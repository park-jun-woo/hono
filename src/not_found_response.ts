//ff:type feature=core type=model
//ff:what Not found response
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

/**
 * You can extend this interface to define a custom `c.notFound()` Response type.
 *
 * @example
 * declare module 'hono' {
 *   interface NotFoundResponse extends Response, TypedResponse<string, 404, 'text'> {}
 * }
 */
export interface NotFoundResponse {}
