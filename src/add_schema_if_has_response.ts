//ff:type feature=core type=model
//ff:what Add schema if has response
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
import type { Input } from './input.js'
import type { ToSchema } from './to_schema.js'
import type { Schema } from './schema.js'
import type { MergePath } from './merge_path.js'

export type AddSchemaIfHasResponse<
  Merged,
  S extends Schema,
  M extends string,
  P extends string,
  I extends Input | Input['in'],
  BasePath extends string,
> = [Merged] extends [Promise<void>] ? S : S & ToSchema<M, MergePath<BasePath, P>, I, Merged>
