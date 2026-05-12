//ff:type feature=jsx type=model
//ff:what Render
import type { Child, FC, JSXNode, Props, MemorableFC } from '../base'
import { toArray } from '../children'
import {
  DOM_ERROR_HANDLER,
  DOM_INTERNAL_TAG,
  DOM_MEMO,
  DOM_RENDERER,
  DOM_STASH,
} from '../constants'
import type { Context as JSXContext } from '../context'
import { globalContexts as globalJSXContexts, useContext } from '../context'
import type { EffectData } from '../hooks'
import { STASH_EFFECT } from '../hooks'
import { normalizeIntrinsicElementKey, styleObjectForEach } from '../utils'
import { createContext } from './context'
import type { Node } from './node.js'
import type { Context } from './context_def.js'
import type { NodeString } from './node_string.js'
import type { SupportedElement } from './supported_element.js'
import type { HasRenderToDom } from './has_render_to_dom.js'
import type { NodeObject } from './node_object.js'
import type { Container } from './container.js'
import type { LocalJSXContexts } from './local_jsx_contexts.js'
import type { ErrorHandler } from './error_handler.js'
import type { UpdateHook } from './update_hook.js'

export type { HasRenderToDom } from './has_render_to_dom.js'
export type { ErrorHandler } from './error_handler.js'
export type { Container } from './container.js'
export type { LocalJSXContexts } from './local_jsx_contexts.js'
export type { SupportedElement } from './supported_element.js'
export type { PreserveNodeType } from './preserve_node_type.js'
export type { NodeObject } from './node_object.js'
export type { NodeString } from './node_string.js'
export type { Node } from './node.js'
export type { PendingType } from './pending_type.js'
export type { UpdateHook } from './update_hook.js'
export type { Context } from './context_def.js'
 // import dom-specific versions

const HONO_PORTAL_ELEMENT = '_hp'

const eventAliasMap: Record<string, string> = {
  Change: 'Input',
  DoubleClick: 'DblClick',
} as const

const nameSpaceMap: Record<string, string> = {
  svg: '2000/svg',
  math: '1998/Math/MathML',
} as const

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buildDataStack: [Context, Node][] = []

const refCleanupMap: WeakMap<Element, () => void> = new WeakMap()

let nameSpaceContext: JSXContext<string> | undefined = undefined
export const getNameSpaceContext = () => nameSpaceContext

const isNodeString = (node: Node): node is NodeString => 't' in (node as NodeString)

const eventCache: Record<string, [string, boolean]> = {
  // pre-define events that are used very frequently
  onClick: ['click', false],
}
const getEventSpec = (key: string): [string, boolean] | undefined => {
  if (!key.startsWith('on')) {
    return undefined
  }
  if (eventCache[key]) {
    return eventCache[key]
  }

  const match = key.match(/^on([A-Z][a-zA-Z]+?(?:PointerCapture)?)(Capture)?$/)
  if (match) {
    const [, eventName, capture] = match
    return (eventCache[key] = [(eventAliasMap[eventName] || eventName).toLowerCase(), !!capture])
  }
  return undefined
}

const toAttributeName = (element: SupportedElement, key: string): string =>
  nameSpaceContext &&
  element instanceof SVGElement &&
  /[A-Z]/.test(key) &&
  (key in element.style || // Presentation attributes are findable in style object. "clip-path", "font-size", "stroke-width", etc.
    key.match(/^(?:o|pai|str|u|ve)/)) // Other un-deprecated kebab-case attributes. "overline-position", "paint-order", "strikethrough-position", etc.
    ? key.replace(/([A-Z])/g, '-$1').toLowerCase()
    : key

const normalizeFormValue = (value: Props['value']) =>
  value === null || value === undefined || value === false ? null : value

const applySelectValue = (select: HTMLSelectElement, props: Props): void => {
  if (!('value' in props)) {
    return
  }

  select.value = normalizeFormValue(props['value'])
  if (!select.multiple && select.selectedIndex === -1) {
    select.selectedIndex = 0
  }
}

// Unlike SSR (which uses isValidAttributeName for upfront validation),
// the DOM renderer relies on try/catch for performance—invalid attribute
// names are rare at runtime, so avoiding the per-attribute regex check is faster.
const isIgnorableAttributeError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'InvalidCharacterError'

const applyProps = (
  container: SupportedElement,
  attributes: Props,
  oldAttributes?: Props
): void => {
  attributes ||= {}
  for (let key in attributes) {
    const value = attributes[key]
    if (key !== 'children' && (!oldAttributes || oldAttributes[key] !== value)) {
      key = normalizeIntrinsicElementKey(key)
      const eventSpec = getEventSpec(key)
      if (eventSpec) {
        if (oldAttributes?.[key] !== value) {
          if (oldAttributes) {
            container.removeEventListener(eventSpec[0], oldAttributes[key], eventSpec[1])
          }
          if (value != null) {
            if (typeof value !== 'function') {
              throw new Error(`Event handler for "${key}" is not a function`)
            }
            container.addEventListener(eventSpec[0], value, eventSpec[1])
          }
        }
      } else if (key === 'dangerouslySetInnerHTML' && value) {
        container.innerHTML = value.__html
      } else if (key === 'ref') {
        let cleanup
        if (typeof value === 'function') {
          cleanup = value(container) || (() => value(null))
        } else if (value && 'current' in value) {
          value.current = container
          cleanup = () => (value.current = null)
        }
        refCleanupMap.set(container, cleanup)
      } else if (key === 'style') {
        const style = container.style
        if (typeof value === 'string') {
          style.cssText = value
        } else {
          style.cssText = ''
          if (value != null) {
            styleObjectForEach(value, style.setProperty.bind(style))
          }
        }
      } else {
        if (key === 'value') {
          const nodeName = container.nodeName
          if (nodeName === 'SELECT') {
            // Deferred to applySelectValue() after children are rendered
            continue
          } else if (nodeName === 'INPUT' || nodeName === 'TEXTAREA') {
            ;(container as unknown as HTMLInputElement).value = normalizeFormValue(value)

            if (nodeName === 'TEXTAREA') {
              container.textContent = value
              continue
            }
          }
        } else if (
          (key === 'checked' && container.nodeName === 'INPUT') ||
          (key === 'selected' && container.nodeName === 'OPTION')
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(container as any)[key] = value
        }

        const k = toAttributeName(container, key)

        try {
          if (value === null || value === undefined || value === false) {
            container.removeAttribute(k)
          } else if (value === true) {
            container.setAttribute(k, '')
          } else if (typeof value === 'string' || typeof value === 'number') {
            container.setAttribute(k, value as string)
          } else {
            container.setAttribute(k, value.toString())
          }
        } catch (e) {
          if (!isIgnorableAttributeError(e)) {
            throw e
          }
        }
      }
    }
  }
  if (oldAttributes) {
    for (let key in oldAttributes) {
      const value = oldAttributes[key]
      if (key !== 'children' && !(key in attributes)) {
        key = normalizeIntrinsicElementKey(key)
        const eventSpec = getEventSpec(key)
        if (eventSpec) {
          container.removeEventListener(eventSpec[0], value, eventSpec[1])
        } else if (key === 'ref') {
          refCleanupMap.get(container)?.()
        } else {
          try {
            container.removeAttribute(toAttributeName(container, key))
          } catch (e) {
            if (!isIgnorableAttributeError(e)) {
              throw e
            }
          }
        }
      }
    }
  }
}

const invokeTag = (context: Context, node: NodeObject): Child[] => {
  node[DOM_STASH][0] = 0
  buildDataStack.push([context, node])
  const func = (node.tag as HasRenderToDom)[DOM_RENDERER] || node.tag
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props = (func as any).defaultProps
    ? {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(func as any).defaultProps,
        ...node.props,
      }
    : node.props
  try {
    return [func.call(null, props)]
  } finally {
    buildDataStack.pop()
  }
}

const getNextChildren = (
  node: NodeObject,
  container: Container,
  nextChildren: Node[],
  childrenToRemove: Node[],
  callbacks: EffectData[]
): void => {
  if (node.vR?.length) {
    childrenToRemove.push(...node.vR)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (node as any).vR
  }
  if (typeof node.tag === 'function') {
    node[DOM_STASH][1][STASH_EFFECT]?.forEach((data: EffectData) => callbacks.push(data))
  }
  node.vC.forEach((child) => {
    if (isNodeString(child)) {
      nextChildren.push(child)
    } else {
      if (typeof child.tag === 'function' || child.tag === '') {
        child.c = container
        const currentNextChildrenIndex = nextChildren.length
        getNextChildren(child, container, nextChildren, childrenToRemove, callbacks)
        if (child.s) {
          for (let i = currentNextChildrenIndex; i < nextChildren.length; i++) {
            nextChildren[i].s = true
          }
          child.s = false
        }
      } else {
        nextChildren.push(child)
        if (child.vR?.length) {
          childrenToRemove.push(...child.vR)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          delete (child as any).vR
        }
      }
    }
  })
}

const findInsertBefore = (node: Node | undefined): SupportedElement | Text | undefined => {
  while (node && (node.tag === HONO_PORTAL_ELEMENT || !node.e)) {
    node = node.tag === HONO_PORTAL_ELEMENT || !node.vC?.[0] ? node.nN : node.vC[0]
  }
  return node?.e
}

const removeNode = (node: Node): void => {
  if (!isNodeString(node)) {
    node[DOM_STASH]?.[1][STASH_EFFECT]?.forEach((data: EffectData) => data[2]?.())

    refCleanupMap.get(node.e as Element)?.()
    if (node.p === 2) {
      node.vC?.forEach((n) => (n.p = 2))
    }
    node.vC?.forEach(removeNode)
  }
  if (!node.p) {
    node.e?.remove()
    delete node.e
  }
  if (typeof node.tag === 'function') {
    updateMap.delete(node)
    fallbackUpdateFnArrayMap.delete(node)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (node as any)[DOM_STASH][3] // delete explicitly for avoid circular reference
    node.a = true
  }
}

export const apply = (node: NodeObject, container: Container, isNew: boolean): void => {
  node.c = container
  applyNodeObject(node, container, isNew)
}

const findChildNodeIndex = (
  childNodes: NodeListOf<ChildNode>,
  child: ChildNode | undefined
): number | undefined => {
  if (!child) {
    return
  }

  for (let i = 0, len = childNodes.length; i < len; i++) {
    if (childNodes[i] === child) {
      return i
    }
  }

  return
}

const cancelBuild: symbol = Symbol()
const applyNodeObject = (node: NodeObject, container: Container, isNew: boolean): void => {
  const next: Node[] = []
  const remove: Node[] = []
  const callbacks: EffectData[] = []
  getNextChildren(node, container, next, remove, callbacks)
  remove.forEach(removeNode)

  const childNodes = (isNew ? undefined : container.childNodes) as NodeListOf<ChildNode>
  let offset: number
  let insertBeforeNode: ChildNode | null = null
  if (isNew) {
    offset = -1
  } else if (!childNodes.length) {
    offset = 0
  } else {
    const offsetByNextNode = findChildNodeIndex(childNodes, findInsertBefore(node.nN))
    if (offsetByNextNode !== undefined) {
      insertBeforeNode = childNodes[offsetByNextNode]
      offset = offsetByNextNode
    } else {
      offset =
        findChildNodeIndex(childNodes, next.find((n) => n.tag !== HONO_PORTAL_ELEMENT && n.e)?.e) ??
        -1
    }

    if (offset === -1) {
      isNew = true
    }
  }

  for (let i = 0, len = next.length; i < len; i++, offset++) {
    const child = next[i]

    let el: SupportedElement | Text
    if (child.s && child.e) {
      el = child.e
      child.s = false
    } else {
      const isNewLocal = isNew || !child.e
      if (isNodeString(child)) {
        if (child.e && child.d) {
          child.e.textContent = child.t
        }
        child.d = false
        el = child.e ||= document.createTextNode(child.t)
      } else {
        el = child.e ||= child.n
          ? (document.createElementNS(child.n, child.tag as string) as SVGElement | MathMLElement)
          : document.createElement(child.tag as string)

        applyProps(el as HTMLElement, child.props, child.pP)
        applyNodeObject(child, el as HTMLElement, isNewLocal)
        if (child.tag === 'select') {
          applySelectValue(el as HTMLSelectElement, child.props)
        }
      }
    }
    if (child.tag === HONO_PORTAL_ELEMENT) {
      offset--
    } else if (isNew) {
      if (!el.parentNode) {
        container.appendChild(el)
      }
    } else if (childNodes[offset] !== el && childNodes[offset - 1] !== el) {
      if (childNodes[offset + 1] === el) {
        // Move extra elements to the back of the container. This is to be done efficiently when elements are swapped.
        container.appendChild(childNodes[offset])
      } else {
        container.insertBefore(el, insertBeforeNode || childNodes[offset] || null)
      }
    }
  }
  if (node.pP) {
    node.pP = undefined
  }
  if (callbacks.length) {
    const useLayoutEffectCbs: Array<() => void> = []
    const useEffectCbs: Array<() => void> = []
    callbacks.forEach(([, useLayoutEffectCb, , useEffectCb, useInsertionEffectCb]) => {
      if (useLayoutEffectCb) {
        useLayoutEffectCbs.push(useLayoutEffectCb)
      }
      if (useEffectCb) {
        useEffectCbs.push(useEffectCb)
      }
      useInsertionEffectCb?.() // invoke useInsertionEffect callbacks
    })
    useLayoutEffectCbs.forEach((cb) => cb()) // invoke useLayoutEffect callbacks
    if (useEffectCbs.length) {
      requestAnimationFrame(() => {
        useEffectCbs.forEach((cb) => cb()) // invoke useEffect callbacks
      })
    }
  }
}

const isSameContext = (
  oldContexts: LocalJSXContexts,
  newContexts: NonNullable<LocalJSXContexts>
): boolean =>
  !!(
    oldContexts &&
    oldContexts.length === newContexts.length &&
    oldContexts.every((ctx, i) => ctx[1] === newContexts[i][1])
  )

const fallbackUpdateFnArrayMap: WeakMap<
  NodeObject,
  Array<() => Promise<NodeObject | undefined>>
> = new WeakMap<NodeObject, Array<() => Promise<NodeObject | undefined>>>()
export const build = (context: Context, node: NodeObject, children?: Child[]): void => {
  const buildWithPreviousChildren = !children && node.pC
  if (children) {
    node.pC ||= node.vC
  }

  let foundErrorHandler: ErrorHandler | undefined
  try {
    children ||=
      typeof node.tag == 'function' ? invokeTag(context, node) : toArray(node.props.children)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((children[0] as JSXNode)?.tag === '' && (children[0] as any)[DOM_ERROR_HANDLER]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      foundErrorHandler = (children[0] as any)[DOM_ERROR_HANDLER] as ErrorHandler
      context[5]!.push([context, foundErrorHandler, node])
    }
    const oldVChildren: Node[] | undefined = buildWithPreviousChildren
      ? [...(node.pC as Node[])]
      : node.vC
        ? [...node.vC]
        : undefined
    const vChildren: Node[] = []
    let prevNode: Node | undefined
    for (let i = 0; i < children.length; i++) {
      if (Array.isArray(children[i])) {
        children.splice(i, 1, ...((children[i] as unknown[]).flat(Infinity) as Child[]))
        i--
        continue
      }
      let child = buildNode(children[i])
      if (child) {
        if (
          typeof child.tag === 'function' &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          !(child.tag as any)[DOM_INTERNAL_TAG]
        ) {
          if (globalJSXContexts.length > 0) {
            child[DOM_STASH][2] = globalJSXContexts.map((c) => [c, c.values.at(-1)])
          }
          if (context[5]?.length) {
            child[DOM_STASH][3] = context[5].at(-1) as [Context, ErrorHandler, NodeObject]
          }
        }

        let oldChild: NodeObject | undefined
        if (oldVChildren && oldVChildren.length) {
          const i = oldVChildren.findIndex(
            isNodeString(child)
              ? (c) => isNodeString(c)
              : child.key !== undefined
                ? (c) => c.key === (child as Node).key && c.tag === (child as Node).tag
                : (c) => c.tag === (child as Node).tag
          )

          if (i !== -1) {
            oldChild = oldVChildren[i] as NodeObject
            oldVChildren.splice(i, 1)
          }
        }

        if (oldChild) {
          if (isNodeString(child)) {
            if ((oldChild as unknown as NodeString).t !== child.t) {
              ;(oldChild as unknown as NodeString).t = child.t // update text content
              ;(oldChild as unknown as NodeString).d = true
            }
            child = oldChild
          } else {
            const pP = (oldChild.pP = oldChild.props)
            oldChild.props = child.props
            oldChild.f ||= child.f || node.f
            if (typeof child.tag === 'function') {
              const oldContexts = oldChild[DOM_STASH][2]
              oldChild[DOM_STASH][2] = child[DOM_STASH][2] || []
              oldChild[DOM_STASH][3] = child[DOM_STASH][3]

              if (
                !oldChild.f &&
                ((oldChild.o || oldChild) === child.o || // The code generated by the react compiler is memoized under this condition.
                  (oldChild.tag as MemorableFC<unknown>)[DOM_MEMO]?.(pP, oldChild.props)) && // The `memo` function is memoized under this condition.
                isSameContext(oldContexts, oldChild[DOM_STASH][2])
              ) {
                oldChild.s = true
              }
            }
            child = oldChild
          }
        } else if (!isNodeString(child) && nameSpaceContext) {
          const ns = useContext(nameSpaceContext)
          if (ns) {
            child.n = ns
          }
        }

        if (!isNodeString(child) && !child.s) {
          build(context, child)
          delete child.f
        }
        vChildren.push(child)

        if (prevNode && !prevNode.s && !child.s) {
          for (let p = prevNode; p && !isNodeString(p); p = p.vC?.at(-1) as NodeObject) {
            p.nN = child
          }
        }
        prevNode = child
      }
    }
    node.vR = buildWithPreviousChildren ? [...node.vC, ...(oldVChildren || [])] : oldVChildren || []
    node.vC = vChildren
    if (buildWithPreviousChildren) {
      delete node.pC
    }
  } catch (e) {
    node.f = true
    if (e === cancelBuild) {
      if (foundErrorHandler) {
        return
      } else {
        throw e
      }
    }

    const [errorHandlerContext, errorHandler, errorHandlerNode] =
      node[DOM_STASH]?.[3] || ([] as unknown as [undefined, undefined])

    if (errorHandler) {
      const fallbackUpdateFn = () =>
        update([0, false, context[2] as UpdateHook], errorHandlerNode as NodeObject)
      const fallbackUpdateFnArray =
        fallbackUpdateFnArrayMap.get(errorHandlerNode as NodeObject) || []
      fallbackUpdateFnArray.push(fallbackUpdateFn)
      fallbackUpdateFnArrayMap.set(errorHandlerNode as NodeObject, fallbackUpdateFnArray)
      const fallback = errorHandler(e, () => {
        const fnArray = fallbackUpdateFnArrayMap.get(errorHandlerNode as NodeObject)
        if (fnArray) {
          const i = fnArray.indexOf(fallbackUpdateFn)
          if (i !== -1) {
            fnArray.splice(i, 1)
            return fallbackUpdateFn()
          }
        }
      })
      if (fallback) {
        if (context[0] === 1) {
          // low priority render
          context[1] = true
        } else {
          build(context, errorHandlerNode, [fallback])
          if (
            (errorHandler.length === 1 || context !== errorHandlerContext) &&
            errorHandlerNode.c
          ) {
            // render error boundary immediately
            apply(errorHandlerNode, errorHandlerNode.c as Container, false)
            return
          }
        }
        throw cancelBuild
      }
    }

    throw e
  } finally {
    if (foundErrorHandler) {
      context[5]!.pop()
    }
  }
}

export const buildNode = (node: Child): Node | undefined => {
  if (node === undefined || node === null || typeof node === 'boolean') {
    return undefined
  } else if (typeof node === 'string' || typeof node === 'number') {
    return { t: node.toString(), d: true } as NodeString
  } else {
    if ('vR' in node) {
      node = {
        tag: (node as NodeObject).tag,
        props: (node as NodeObject).props,
        key: (node as NodeObject).key,
        f: (node as NodeObject).f,
        type: (node as NodeObject).tag,
        ref: (node as NodeObject).props.ref,
        o: (node as NodeObject).o || node,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any
    }
    if (typeof (node as JSXNode).tag === 'function') {
      ;(node as NodeObject)[DOM_STASH] = [0, []]
    } else {
      const ns = nameSpaceMap[(node as JSXNode).tag as string]
      if (ns) {
        nameSpaceContext ||= createContext('')
        ;(node as JSXNode).props.children = [
          {
            tag: nameSpaceContext,
            props: {
              value: ((node as NodeObject).n = `http://www.w3.org/${ns}`),
              children: (node as JSXNode).props.children,
            },
          },
        ]
      }
    }
    return node as NodeObject
  }
}

const replaceContainer = (node: NodeObject, from: DocumentFragment, to: Container): void => {
  if (node.c === from) {
    node.c = to
    node.vC.forEach((child) => replaceContainer(child as NodeObject, from, to))
  }
}

const updateSync = (context: Context, node: NodeObject): void => {
  node[DOM_STASH][2]?.forEach(([c, v]) => {
    c.values.push(v)
  })
  try {
    build(context, node, undefined)
  } catch {
    return
  }
  if (node.a) {
    delete node.a
    return
  }
  node[DOM_STASH][2]?.forEach(([c]) => {
    c.values.pop()
  })
  if (context[0] !== 1 || !context[1]) {
    apply(node, node.c as Container, false)
  }
}

type UpdateMapResolve = (node: NodeObject | undefined) => void
const updateMap: WeakMap<NodeObject, [UpdateMapResolve, Function]> = new WeakMap<
  NodeObject,
  [UpdateMapResolve, Function]
>()
const currentUpdateSets: Set<NodeObject>[] = []
export const update = async (
  context: Context,
  node: NodeObject
): Promise<NodeObject | undefined> => {
  context[5] ||= []

  const existing = updateMap.get(node)
  if (existing) {
    // execute only the last update() call, so the previous update will be canceled.
    existing[0](undefined)
  }

  let resolve: UpdateMapResolve | undefined
  const promise = new Promise<NodeObject | undefined>((r) => (resolve = r))
  updateMap.set(node, [
    resolve as UpdateMapResolve,
    () => {
      if (context[2]) {
        context[2](context, node, (context) => {
          updateSync(context, node)
        }).then(() => (resolve as UpdateMapResolve)(node))
      } else {
        updateSync(context, node)
        ;(resolve as UpdateMapResolve)(node)
      }
    },
  ])

  if (currentUpdateSets.length) {
    ;(currentUpdateSets.at(-1) as Set<NodeObject>).add(node)
  } else {
    await Promise.resolve()

    const latest = updateMap.get(node)
    if (latest) {
      updateMap.delete(node)
      latest[1]()
    }
  }

  return promise
}

export const renderNode = (node: NodeObject, container: Container): void => {
  const context: Context = []
  ;(context as Context)[5] = [] // error handler stack
  ;(context as Context)[4] = true // start top level render
  build(context, node, undefined)
  ;(context as Context)[4] = false // finish top level render

  const fragment = document.createDocumentFragment()
  apply(node, fragment, true)
  replaceContainer(node, fragment, container)
  container.replaceChildren(fragment)
}

export const render = (jsxNode: Child, container: Container): void => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderNode(buildNode({ tag: '', props: { children: jsxNode } } as any) as NodeObject, container)
}

export const flushSync = (callback: () => void): void => {
  const set = new Set<NodeObject>()
  currentUpdateSets.push(set)
  callback()
  set.forEach((node) => {
    const latest = updateMap.get(node)
    if (latest) {
      updateMap.delete(node)
      latest[1]()
    }
  })
  currentUpdateSets.pop()
}

export const createPortal = (children: Child, container: HTMLElement, key?: string): Child =>
  ({
    tag: HONO_PORTAL_ELEMENT,
    props: {
      children,
    },
    key,
    e: container,
    p: 1,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any
