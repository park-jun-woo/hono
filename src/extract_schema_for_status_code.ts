//ff:type feature=core type=model
//ff:what Extract schema for status code
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
import type { ExtractSchema } from './extract_schema.js'

export type ExtractSchemaForStatusCode<T, Status extends number> = {
  [Path in keyof ExtractSchema<T>]: {
    [Method in keyof ExtractSchema<T>[Path]]: Extract<
      ExtractSchema<T>[Path][Method],
      { status: Status }
    >
  }
}
