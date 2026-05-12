//ff:type feature=core type=model
//ff:what Merge typed response
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

export type MergeTypedResponse<T> =
  T extends Promise<void>
    ? T
    : T extends Promise<infer T2>
      ? T2 extends TypedResponse
        ? T2
        : TypedResponse
      : T extends TypedResponse
        ? T
        : TypedResponse
