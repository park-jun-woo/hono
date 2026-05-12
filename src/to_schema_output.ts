//ff:type feature=core type=model
//ff:what To schema output
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
import type { TypedResponse } from './typed_response.js'

////////////////////////////////////////
//////                            //////
//////           ToSchema           //////
//////                            //////
////////////////////////////////////////
export type ToSchemaOutput<RorO, I extends Input | Input['in']> =
  RorO extends TypedResponse<infer T, infer U, infer F>
    ? {
        output: unknown extends T ? {} : T
        outputFormat: I extends { outputFormat: string } ? I['outputFormat'] : F
        status: U
      }
    : {
        output: unknown extends RorO ? {} : RorO
        outputFormat: unknown extends RorO
          ? 'json'
          : I extends { outputFormat: string }
            ? I['outputFormat']
            : 'json'
        status: StatusCode
      }
