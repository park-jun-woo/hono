//ff:type feature=core type=router
//ff:what Router route
import type { Context } from './context'
import type { HonoBase } from './hono-base'
import type { CustomHeader, RequestHeader } from './utils/headers'
import type { StatusCode } from './utils/http-status'
import type {
  IfAnyThenEmptyObject,
  IsAny,
  JSONValue,
  RemoveBlankRecord,
  Simplify,
  UnionToIntersection,
} from './utils/types'
import type { H } from './h.js'

////////////////////////////////////////
//////                            //////
//////          Routes            //////
//////                            //////
////////////////////////////////////////
export interface RouterRoute {
  basePath: string
  path: string
  method: string
  handler: H
}
