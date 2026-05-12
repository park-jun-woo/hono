//ff:type feature=jsx type=model
//ff:what Base
import { raw } from '../helper/html'
import { escapeToBuffer, resolveCallbackSync, stringBufferToString } from '../utils/html'
import type { HtmlEscaped, HtmlEscapedString, StringBufferWithCallbacks } from '../utils/html'
import { DOM_RENDERER, DOM_MEMO } from './constants'
import type { Context } from './context'
import { createContext, globalContexts, useContext } from './context'
import { domRenderers } from './intrinsic-element/common'
import * as intrinsicElementTags from './intrinsic-element/components'
import type {
  JSX as HonoJSX,
  IntrinsicElements as IntrinsicElementsDefined,
} from './intrinsic-elements'
import {
  isValidAttributeName,
  isValidTagName,
  normalizeIntrinsicElementKey,
  styleObjectForEach,
} from './utils'
import type { Props } from './props.js'
import type { Child } from './child.js'
import { JSXNode } from './jsx_node.js'
import { JSXFunctionNode } from './jsx_function_node.js'
import type { FC } from './fc.js'
import type { MemorableFC } from './memorable_fc.js'

export type { Props } from './props.js'
export type { FC } from './fc.js'
export type { DOMAttributes } from './dom_attributes.js'
export type { LocalContexts } from './local_contexts.js'
export type { Child } from './child.js'
export type { MemorableFC } from './memorable_fc.js'
export { JSXNode } from './jsx_node.js'
export { JSXFunctionNode } from './jsx_function_node.js'


// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace JSX {
  export type Element = HtmlEscapedString | Promise<HtmlEscapedString>
  export interface ElementChildrenAttribute {
    children: Child
  }
  export interface IntrinsicElements extends IntrinsicElementsDefined {
    [tagName: string]: Props
  }
  export interface IntrinsicAttributes {
    key?: string | number | bigint | null | undefined
  }
}

export let nameSpaceContext: Context<string> | undefined = undefined
export const getNameSpaceContext = () => nameSpaceContext

export const toSVGAttributeName = (key: string): string =>
  /[A-Z]/.test(key) &&
  // Presentation attributes are findable in style object. "clip-path", "font-size", "stroke-width", etc.
  // Or other un-deprecated kebab-case attributes. "overline-position", "paint-order", "strikethrough-position", etc.
  key.match(
    /^(?:al|basel|clip(?:Path|Rule)$|co|do|fill|fl|fo|gl|let|lig|i|marker[EMS]|o|pai|pointe|sh|st[or]|text[^L]|tr|u|ve|w)/
  )
    ? key.replace(/([A-Z])/g, '-$1').toLowerCase()
    : key

export const emptyTags = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]
export const booleanAttributes = [
  'allowfullscreen',
  'async',
  'autofocus',
  'autoplay',
  'checked',
  'controls',
  'default',
  'defer',
  'disabled',
  'download',
  'formnovalidate',
  'hidden',
  'inert',
  'ismap',
  'itemscope',
  'loop',
  'multiple',
  'muted',
  'nomodule',
  'novalidate',
  'open',
  'playsinline',
  'readonly',
  'required',
  'reversed',
  'selected',
]

export const childrenToStringToBuffer = (children: Child[], buffer: StringBufferWithCallbacks): void => {
  for (let i = 0, len = children.length; i < len; i++) {
    const child = children[i]
    if (typeof child === 'string') {
      escapeToBuffer(child, buffer)
    } else if (typeof child === 'boolean' || child === null || child === undefined) {
      continue
    } else if (child instanceof JSXNode) {
      child.toStringToBuffer(buffer)
    } else if (
      typeof child === 'number' ||
      (child as unknown as { isEscaped: boolean }).isEscaped
    ) {
      ;(buffer[0] as string) += child
    } else if (child instanceof Promise) {
      buffer.unshift('', child)
    } else {
      // `child` type is `Child[]`, so stringify recursively
      childrenToStringToBuffer(child, buffer)
    }
  }
}

export class JSXFragmentNode extends JSXNode {
  override toStringToBuffer(buffer: StringBufferWithCallbacks): void {
    childrenToStringToBuffer(this.children, buffer)
  }
}

export const jsx = (
  tag: string | Function,
  props: Props | null,
  ...children: (string | number | HtmlEscapedString)[]
): JSXNode => {
  props ??= {}
  if (children.length) {
    props.children = children.length === 1 ? children[0] : children
  }

  const key = props.key
  delete props['key']

  const node = jsxFn(tag, props, children)
  node.key = key
  return node
}

let initDomRenderer = false
export const jsxFn = (
  tag: string | Function,
  props: Props,
  children: (string | number | HtmlEscapedString)[]
): JSXNode => {
  if (!initDomRenderer) {
    for (const k in domRenderers) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(intrinsicElementTags[k as keyof typeof intrinsicElementTags] as any)[DOM_RENDERER] =
        domRenderers[k]
    }
    initDomRenderer = true
  }

  if (typeof tag === 'function') {
    return new JSXFunctionNode(tag, props, children)
  } else if (intrinsicElementTags[tag as keyof typeof intrinsicElementTags]) {
    return new JSXFunctionNode(
      intrinsicElementTags[tag as keyof typeof intrinsicElementTags],
      props,
      children
    )
  } else if (tag === 'svg' || tag === 'head') {
    nameSpaceContext ||= createContext('')
    return new JSXNode(tag, props, [
      new JSXFunctionNode(
        nameSpaceContext,
        {
          value: tag,
        },
        children
      ),
    ])
  } else {
    return new JSXNode(tag, props, children)
  }
}

export const shallowEqual = (a: Props, b: Props): boolean => {
  if (a === b) {
    return true
  }

  const aKeys = Object.keys(a).sort()
  const bKeys = Object.keys(b).sort()
  if (aKeys.length !== bKeys.length) {
    return false
  }

  for (let i = 0, len = aKeys.length; i < len; i++) {
    if (
      aKeys[i] === 'children' &&
      bKeys[i] === 'children' &&
      !a.children?.length &&
      !b.children?.length
    ) {
      continue
    } else if (a[aKeys[i]] !== b[aKeys[i]]) {
      return false
    }
  }

  return true
}
export const memo = <T>(
  component: FC<T>,
  propsAreEqual: (prevProps: Readonly<T>, nextProps: Readonly<T>) => boolean = shallowEqual
): FC<T> => {
  let computed: ReturnType<FC<T>> = null
  let prevProps: T | undefined = undefined
  const wrapper: MemorableFC<T> = ((props: T) => {
    if (prevProps && !propsAreEqual(prevProps, props)) {
      computed = null
    }
    prevProps = props
    return (computed ||= component(props))
  }) as MemorableFC<T>

  // This function is for toString(), but it can also be used for DOM renderer.
  // So, set DOM_MEMO and DOM_RENDERER for DOM renderer.
  wrapper[DOM_MEMO] = propsAreEqual
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(wrapper as any)[DOM_RENDERER] = component

  return wrapper as FC<T>
}

export const Fragment = ({
  children,
}: {
  key?: string
  children?: Child | HtmlEscapedString
}): HtmlEscapedString => {
  return new JSXFragmentNode(
    '',
    {
      children,
    },
    Array.isArray(children) ? children : children ? [children] : []
  ) as never
}

export const isValidElement = (element: unknown): element is JSXNode => {
  return !!(element && typeof element === 'object' && 'tag' in element && 'props' in element)
}

export const cloneElement = <T extends JSXNode | JSX.Element>(
  element: T,
  props: Partial<Props>,
  ...children: Child[]
): T => {
  let childrenToClone
  if (children.length > 0) {
    childrenToClone = children
  } else {
    const c = (element as JSXNode).props.children
    childrenToClone = Array.isArray(c) ? c : [c]
  }
  return jsx(
    (element as JSXNode).tag,
    { ...(element as JSXNode).props, ...props },
    ...childrenToClone
  ) as T
}

export const reactAPICompatVersion = '19.0.0-hono-jsx'
