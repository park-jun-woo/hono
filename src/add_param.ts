//ff:type feature=core type=model
//ff:what Add param
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
import type { ParamKeys } from './param_keys.js'
import type { ParamKeyToRecord } from './param_key_to_record.js'

export type AddParam<I, P extends string> =
  ParamKeys<P> extends never
    ? I
    : I extends { param: infer _ }
      ? I
      : I & { param: UnionToIntersection<ParamKeyToRecord<ParamKeys<P>>> }
