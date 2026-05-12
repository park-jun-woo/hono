//ff:type feature=core type=model
//ff:what Not found handler
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
import type { Env } from './env.js'
import type { NotFoundResponse } from './not_found_response.js'

export type NotFoundHandler<E extends Env = any> = (
  c: Context<E>
) => NotFoundResponse extends Response
  ? NotFoundResponse | Promise<NotFoundResponse>
  : Response | Promise<Response>
