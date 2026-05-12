//ff:func feature=router type=router control=sequence
//ff:type feature=router type=model
//ff:what Matcher
import type { ParamIndexMap, Result, Router } from '../../router'
import { METHOD_NAME_ALL } from '../../router'
import type { Matcher } from './matcher_def.js'

export type { HandlerData } from './handler_data.js'
export type { StaticMap } from './static_map.js'
export type { Matcher } from './matcher_def.js'

export type MatcherMap<T> = Record<string, Matcher<T> | null>

export const emptyParam: string[] = []
export function match<R extends Router<T>, T>(this: R, method: string, path: string): Result<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matchers: MatcherMap<T> = (this as any).buildAllMatchers()

  const match = ((method, path) => {
    const matcher = (matchers[method] || matchers[METHOD_NAME_ALL]) as Matcher<T>

    const staticMatch = matcher[2][path]
    if (staticMatch) {
      return staticMatch
    }

    const match = path.match(matcher[0])
    if (!match) {
      return [[], emptyParam]
    }

    const index = match.indexOf('', 1)
    return [matcher[1][index], match]
  }) as Router<T>['match']

  this.match = match
  return match(method, path)
}
