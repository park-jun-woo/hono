//ff:type feature=core type=handler
//ff:what Middleware tuple
import type { Params } from './router'

export type MiddlewareTuple = [[Function, unknown], Params]
