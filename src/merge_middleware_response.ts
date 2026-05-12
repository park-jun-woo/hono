//ff:type feature=core type=handler
//ff:what Merge middleware response
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
import type { ExtractTypedResponseOnly } from './extract_typed_response_only.js'

export type MergeMiddlewareResponse<T> = T extends (c: any, next: any) => Promise<infer R>
  ? Exclude<R, void> extends never
    ? never
    : Exclude<R, void> extends Response | TypedResponse<any, any, any>
      ? ExtractTypedResponseOnly<Exclude<R, void>>
      : never
  : T extends (c: any, next: any) => infer R
    ? R extends Response | TypedResponse<any, any, any>
      ? ExtractTypedResponseOnly<R>
      : never
    : never
