//ff:type feature=router type=router
//ff:what Handler set
import type { Params } from '../../router'
import { METHOD_NAME_ALL } from '../../router'
import type { Pattern } from '../../utils/url'
import { getPattern, splitPath, splitRoutingPath } from '../../utils/url'

export type HandlerSet<T> = {
  handler: T
  possibleKeys: string[]
  score: number
}
