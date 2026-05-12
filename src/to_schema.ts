//ff:type feature=core type=model
//ff:what To schema
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
import type { ExtractInput } from './extract_input.js'
import type { Input } from './input.js'
import type { ToSchemaOutput } from './to_schema_output.js'
import type { AddParam } from './add_param.js'
import type { AddDollar } from './add_dollar.js'
import type { ResponseFormat } from './response_format.js'

export type ToSchema<
  M extends string,
  P extends string,
  I extends Input | Input['in'],
  RorO, // Response or Output
> =
  IsAny<RorO> extends true
    ? {
        [K in P]: {
          [K2 in M as AddDollar<K2>]: {
            input: AddParam<ExtractInput<I>, P>
            output: {}
            outputFormat: ResponseFormat
            status: StatusCode
          }
        }
      }
    : [RorO] extends [never]
      ? {}
      : [RorO] extends [Promise<void>]
        ? {}
        : {
            [K in P]: {
              [K2 in M as AddDollar<K2>]: Simplify<
                {
                  input: AddParam<ExtractInput<I>, P>
                } & ToSchemaOutput<RorO, I>
              >
            }
          }
