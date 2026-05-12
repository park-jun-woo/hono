//ff:type feature=core type=model
//ff:what Handler response
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
import type { TypedResponse } from './typed_response.js'

////////////////////////////////////////
//////                            //////
//////          Handlers          //////
//////                            //////
////////////////////////////////////////
export type HandlerResponse<O> =
  | Response
  | TypedResponse<O>
  | Promise<Response | TypedResponse<O>>
  | Promise<void>
