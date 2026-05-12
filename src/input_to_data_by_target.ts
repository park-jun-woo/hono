//ff:type feature=core type=model
//ff:what Input to data by target
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
import type { ValidationTargets } from './validation_targets.js'

////////////////////////////////////////
//////                            //////
/////       For HonoRequest       //////
//////                            //////
////////////////////////////////////////
export type InputToDataByTarget<
  T extends Input['out'],
  Target extends keyof ValidationTargets,
> = T extends {
  [K in Target]: infer R
}
  ? R
  : never
