//ff:type feature=router type=router
//ff:what Node
import type { Params } from '../../router'
import { METHOD_NAME_ALL } from '../../router'
import type { Pattern } from '../../utils/url'
import { getPattern, splitPath, splitRoutingPath } from '../../utils/url'
import type { HandlerSet } from './handler_set.js'
import type { HandlerParamsSet } from './handler_params_set.js'

export type { HandlerSet } from './handler_set.js'
export type { HandlerParamsSet } from './handler_params_set.js'

const emptyParams = Object.create(null)

const hasChildren = (children: Record<string, unknown>): boolean => {
  for (const _ in children) {
    return true
  }
  return false
}

const _ensurePartOffsets = (partOffsets: number[] | null, len: number, path: string, parts: string[]): number[] => {
  if (partOffsets !== null) {
    return partOffsets
  }
  partOffsets = new Array(len)
  let offset = path[0] === '/' ? 1 : 0
  for (let p = 0; p < len; p++) {
    partOffsets[p] = offset
    offset += parts[p].length + 1
  }
  return partOffsets
}

const _assignHandlerParams = <T>(
  handlerSet: HandlerParamsSet<T>,
  nodeParams: Record<string, string>,
  params?: Record<string, string>
): void => {
  if (nodeParams === emptyParams && !(params && params !== emptyParams)) {
    return
  }
  const processedSet: Record<number, boolean> = {}
  for (let i = 0, len = handlerSet.possibleKeys.length; i < len; i++) {
    const key = handlerSet.possibleKeys[i]
    const processed = processedSet[handlerSet.score]
    handlerSet.params[key] =
      params?.[key] && !processed ? params[key] : (nodeParams[key] ?? params?.[key])
    processedSet[handlerSet.score] = true
  }
}

export class Node<T> {
  #methods: Record<string, HandlerSet<T>>[]

  #children: Record<string, Node<T>>
  #patterns: Pattern[]
  #order: number = 0
  #params: Record<string, string> = emptyParams

  constructor(method?: string, handler?: T, children?: Record<string, Node<T>>) {
    this.#children = children || Object.create(null)
    this.#methods = []
    if (method && handler) {
      const m: Record<string, HandlerSet<T>> = Object.create(null)
      m[method] = { handler, possibleKeys: [], score: 0 }
      this.#methods = [m]
    }
    this.#patterns = []
  }

  #insertPart(p: string, nextP: string | undefined, possibleKeys: string[]): Node<T> {
    const pattern = getPattern(p, nextP)
    const key = Array.isArray(pattern) ? pattern[0] : p

    if (key in this.#children) {
      if (pattern) {
        possibleKeys.push(pattern[1])
      }
      return this.#children[key]
    }

    this.#children[key] = new Node()
    if (pattern) {
      this.#patterns.push(pattern)
      possibleKeys.push(pattern[1])
    }
    return this.#children[key]
  }

  insert(method: string, path: string, handler: T): Node<T> {
    this.#order = ++this.#order

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let curNode: Node<T> = this
    const parts = splitRoutingPath(path)

    const possibleKeys: string[] = []

    for (let i = 0, len = parts.length; i < len; i++) {
      curNode = curNode.#insertPart(parts[i], parts[i + 1], possibleKeys)
    }

    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: this.#order,
      },
    })

    return curNode
  }

  #pushHandlerSets(
    handlerSets: HandlerParamsSet<T>[],
    node: Node<T>,
    method: string,
    nodeParams: Record<string, string>,
    params?: Record<string, string>
  ): void {
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i]
      const handlerSet = (m[method] || m[METHOD_NAME_ALL]) as HandlerParamsSet<T>
      if (handlerSet === undefined) {
        continue
      }
      handlerSet.params = Object.create(null)
      handlerSets.push(handlerSet)
      _assignHandlerParams(handlerSet, nodeParams, params)
    }
  }

  #handleDirectChild(
    nextNode: Node<T>,
    isLast: boolean,
    handlerSets: HandlerParamsSet<T>[],
    method: string,
    nodeParams: Record<string, string>,
    tempNodes: Node<T>[]
  ): void {
    nextNode.#params = nodeParams
    if (isLast) {
      if (nextNode.#children['*']) {
        this.#pushHandlerSets(handlerSets, nextNode.#children['*'], method, nodeParams)
      }
      this.#pushHandlerSets(handlerSets, nextNode, method, nodeParams)
    } else {
      tempNodes.push(nextNode)
    }
  }

  #handleWildcardPattern(
    node: Node<T>,
    params: Record<string, string>,
    handlerSets: HandlerParamsSet<T>[],
    method: string,
    tempNodes: Node<T>[]
  ): void {
    const astNode = node.#children['*']
    if (astNode) {
      this.#pushHandlerSets(handlerSets, astNode, method, node.#params)
      astNode.#params = params
      tempNodes.push(astNode)
    }
  }

  #handleRegExpMatch(
    child: Node<T>,
    params: Record<string, string>,
    name: string,
    m: RegExpExecArray,
    handlerSets: HandlerParamsSet<T>[],
    method: string,
    nodeParams: Record<string, string>,
    curNodesQueue: Node<T>[][]
  ): void {
    params[name] = m[0]
    this.#pushHandlerSets(handlerSets, child, method, nodeParams, params)
    if (hasChildren(child.#children)) {
      child.#params = params
      const componentCount = m[0].match(/\//)?.length ?? 0
      const targetCurNodes = (curNodesQueue[componentCount] ||= [])
      targetCurNodes.push(child)
    }
  }

  #handleMatchedPattern(
    child: Node<T>,
    params: Record<string, string>,
    part: string,
    name: string,
    isLast: boolean,
    handlerSets: HandlerParamsSet<T>[],
    method: string,
    nodeParams: Record<string, string>,
    tempNodes: Node<T>[]
  ): void {
    params[name] = part
    if (isLast) {
      this.#pushHandlerSets(handlerSets, child, method, params, nodeParams)
      if (child.#children['*']) {
        this.#pushHandlerSets(handlerSets, child.#children['*'], method, params, nodeParams)
      }
    } else {
      child.#params = params
      tempNodes.push(child)
    }
  }

  #processPattern(
    node: Node<T>,
    pattern: Pattern,
    part: string,
    isLast: boolean,
    i: number,
    path: string,
    parts: string[],
    len: number,
    partOffsets: number[] | null,
    handlerSets: HandlerParamsSet<T>[],
    method: string,
    tempNodes: Node<T>[],
    curNodesQueue: Node<T>[][]
  ): number[] | null {
    const params = node.#params === emptyParams ? {} : { ...node.#params }

    if (pattern === '*') {
      this.#handleWildcardPattern(node, params, handlerSets, method, tempNodes)
      return partOffsets
    }

    const [key, name, matcher] = pattern

    if (!part && !(matcher instanceof RegExp)) {
      return partOffsets
    }

    const child = node.#children[key]

    if (matcher instanceof RegExp) {
      partOffsets = _ensurePartOffsets(partOffsets, len, path, parts)
      const restPathString = path.substring(partOffsets[i])
      const m = matcher.exec(restPathString)
      if (m) {
        this.#handleRegExpMatch(child, params, name, m, handlerSets, method, node.#params, curNodesQueue)
        return partOffsets
      }
    }

    if (matcher === true || (matcher as RegExp).test(part)) {
      this.#handleMatchedPattern(child, params, part, name, isLast, handlerSets, method, node.#params, tempNodes)
    }

    return partOffsets
  }

  #processNode(
    node: Node<T>,
    part: string,
    isLast: boolean,
    i: number,
    path: string,
    parts: string[],
    len: number,
    partOffsets: number[] | null,
    handlerSets: HandlerParamsSet<T>[],
    method: string,
    tempNodes: Node<T>[],
    curNodesQueue: Node<T>[][]
  ): number[] | null {
    const nextNode = node.#children[part]

    if (nextNode) {
      this.#handleDirectChild(nextNode, isLast, handlerSets, method, node.#params, tempNodes)
    }

    for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
      partOffsets = this.#processPattern(
        node, node.#patterns[k], part, isLast, i, path, parts, len,
        partOffsets, handlerSets, method, tempNodes, curNodesQueue
      )
    }

    return partOffsets
  }

  search(method: string, path: string): [[T, Params][]] {
    const handlerSets: HandlerParamsSet<T>[] = []
    this.#params = emptyParams

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const curNode: Node<T> = this
    let curNodes = [curNode]
    const parts = splitPath(path)
    const curNodesQueue: Node<T>[][] = []

    const len = parts.length
    let partOffsets: number[] | null = null

    for (let i = 0; i < len; i++) {
      const part: string = parts[i]
      const isLast = i === len - 1
      const tempNodes: Node<T>[] = []

      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        partOffsets = this.#processNode(
          curNodes[j], part, isLast, i, path, parts, len,
          partOffsets, handlerSets, method, tempNodes, curNodesQueue
        )
      }

      const shifted = curNodesQueue.shift()
      curNodes = shifted ? tempNodes.concat(shifted) : tempNodes
    }

    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score
      })
    }

    return [handlerSets.map(({ handler, params }) => [handler, params] as [T, Params])]
  }
}
