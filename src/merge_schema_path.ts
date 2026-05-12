//ff:type feature=core type=model
//ff:what Merge schema path
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
import type { Schema } from './schema.js'
import type { Endpoint } from './endpoint.js'
import type { MergeEndpointParamsWithPath } from './merge_endpoint_params_with_path.js'
import type { MergePath } from './merge_path.js'

export type MergeSchemaPath<OrigSchema extends Schema, SubPath extends string> = {
  [P in keyof OrigSchema as MergePath<SubPath, P & string>]: [OrigSchema[P]] extends [
    Record<string, Endpoint>,
  ]
    ? { [M in keyof OrigSchema[P]]: MergeEndpointParamsWithPath<OrigSchema[P][M], SubPath> }
    : never
}
