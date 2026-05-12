//ff:type feature=router type=router
//ff:what Handler params set
import type { Params } from '../../router'
import { METHOD_NAME_ALL } from '../../router'
import type { Pattern } from '../../utils/url'
import { getPattern, splitPath, splitRoutingPath } from '../../utils/url'
import type { HandlerSet } from './handler_set.js'

export type HandlerParamsSet<T> = HandlerSet<T> & {
  params: Record<string, string>
}
