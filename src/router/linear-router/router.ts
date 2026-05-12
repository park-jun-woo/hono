//ff:type feature=router type=router
//ff:what Router
import type { Params, Result, Router } from '../../router'
import { METHOD_NAME_ALL, UnsupportedPathError } from '../../router'
import { checkOptionalParameter } from '../../utils/url'
import type { RegExpMatchArrayWithIndices } from './reg_exp_match_array_with_indices.js'

export type { RegExpMatchArrayWithIndices } from './reg_exp_match_array_with_indices.js'

const emptyParams = Object.create(null)

const splitPathRe = /\/(:\w+(?:{(?:(?:{[\d,]+})|[^}])+})?)|\/[^\/\?]+|(\?)/g
const splitByStarRe = /\*/

// MatchResult: [T, Params] | null — inlined to avoid F2 violation

const checkStarPart = (parts: string[], j: number, path: string, pos: number, endsWithStar: boolean): number => {
  const part = parts[j]
  const index = path.indexOf(part, pos)
  if (index !== pos) return -1
  pos += part.length
  if (j === parts.length - 1) {
    if (!endsWithStar && pos !== path.length && !(pos === path.length - 1 && path.charCodeAt(pos) === 47)) return -1
  } else {
    const slashIndex = path.indexOf('/', pos)
    if (slashIndex === -1) return -1
    pos = slashIndex
  }
  return pos
}

const matchStarRoute = <T>(routePath: string, path: string, handler: T): [T, Params] | null => {
  const endsWithStar = routePath.charCodeAt(routePath.length - 1) === 42
  const parts = (endsWithStar ? routePath.slice(0, -2) : routePath).split(splitByStarRe)
  let pos = 0
  for (let j = 0, len = parts.length; j < len; j++) {
    pos = checkStarPart(parts, j, path, pos, endsWithStar)
    if (pos === -1) return null
  }
  return [handler, emptyParams]
}

const matchLabelPart = (
  part: string,
  parts: string[],
  j: number,
  path: string,
  pos: number,
  params: Record<string, string>
): number => {
  if (path.charCodeAt(pos) !== 47) return -2
  let name = part.slice(2)
  let value: string
  if (name.charCodeAt(name.length - 1) === 125) {
    const openBracePos = name.indexOf('{')
    const next = parts[j + 1]
    const lookahead = next && next[1] !== ':' && next[1] !== '*' ? `(?=${next})` : ''
    const pattern = name.slice(openBracePos + 1, -1) + lookahead
    const restPath = path.slice(pos + 1)
    const match = new RegExp(pattern, 'd').exec(restPath) as RegExpMatchArrayWithIndices
    if (!match || match.indices[0][0] !== 0 || match.indices[0][1] === 0) return -2
    name = name.slice(0, openBracePos)
    value = restPath.slice(...match.indices[0])
    pos += match.indices[0][1] + 1
  } else {
    let endValuePos = path.indexOf('/', pos + 1)
    if (endValuePos === -1) {
      if (pos + 1 === path.length) return -2
      endValuePos = path.length
    }
    value = path.slice(pos + 1, endValuePos)
    pos = endValuePos
  }
  params[name] ||= value as string
  return pos
}

const matchLabelRoute = <T>(routePath: string, path: string, handler: T): [T, Params] | null => {
  const params: Record<string, string> = Object.create(null)
  const parts = routePath.match(splitPathRe) as string[]
  const lastIndex = parts.length - 1
  let pos = 0
  for (let j = 0, len = parts.length; j < len; j++) {
    if (pos === -1 || pos >= path.length) return null
    const part = parts[j]
    if (part.charCodeAt(1) === 58) {
      pos = matchLabelPart(part, parts, j, path, pos, params)
      if (pos === -2) return null
    } else {
      const index = path.indexOf(part, pos)
      if (index !== pos) return null
      pos += part.length
    }
    if (j === lastIndex) {
      if (pos !== path.length && !(pos === path.length - 1 && path.charCodeAt(pos) === 47)) return null
    }
  }
  return [handler, params]
}

const matchRoute = <T>(routePath: string, path: string, handler: T): [T, Params] | null => {
  if (routePath === '*' || routePath === '/*') return [handler, emptyParams]
  const hasStar = routePath.indexOf('*') !== -1
  const hasLabel = routePath.indexOf(':') !== -1
  if (!hasStar && !hasLabel) {
    return (routePath === path || routePath + '/' === path) ? [handler, emptyParams] : null
  }
  if (hasStar && !hasLabel) return matchStarRoute(routePath, path, handler)
  if (hasLabel && !hasStar) return matchLabelRoute(routePath, path, handler)
  throw new UnsupportedPathError()
}

export class LinearRouter<T> implements Router<T> {
  name: string = 'LinearRouter'
  #routes: [string, string, T][] = []

  add(method: string, path: string, handler: T) {
    for (
      let i = 0, paths = checkOptionalParameter(path) || [path], len = paths.length;
      i < len;
      i++
    ) {
      this.#routes.push([method, paths[i], handler])
    }
  }

  match(method: string, path: string): Result<T> {
    const handlers: [T, Params][] = []
    for (let i = 0, len = this.#routes.length; i < len; i++) {
      const [routeMethod, routePath, handler] = this.#routes[i]
      if (routeMethod !== method && routeMethod !== METHOD_NAME_ALL) {
        continue
      }
      const result = matchRoute(routePath, path, handler)
      if (result) handlers.push(result)
    }
    return [handlers]
  }
}
