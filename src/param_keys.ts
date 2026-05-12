//ff:type feature=core type=model
//ff:what Param keys
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
import type { ParamKey } from './param_key.js'

export type ParamKeys<Path> = Path extends `${infer Component}/${infer Rest}`
  ? ParamKey<Component> | ParamKeys<Rest>
  : ParamKey<Path>
