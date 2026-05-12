//ff:type feature=core type=model
//ff:what Extract handler response
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

export type ExtractHandlerResponse<T> = T extends (c: any, next: any) => Promise<infer R>
  ? Exclude<R, void> extends never
    ? never // Only void in the type → filter out
    : Exclude<R, void> extends Response | TypedResponse<any, any, any>
      ? Exclude<R, void> // Return the response type without void
      : never // Invalid response type → filter out
  : T extends (c: any, next: any) => infer R
    ? R extends Response | TypedResponse<any, any, any>
      ? R
      : never
    : never
