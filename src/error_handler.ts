//ff:type feature=core type=model
//ff:what Error handler
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
import type { HTTPResponseError } from './http_response_error.js'

export type ErrorHandler<E extends Env = any> = (
  err: Error | HTTPResponseError,
  c: Context<E>
) => Response | Promise<Response>
