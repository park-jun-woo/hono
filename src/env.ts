//ff:type feature=core type=model
//ff:what Env
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
import type { Bindings } from './bindings.js'
import type { Variables } from './variables.js'

export type Env = {
  Bindings?: Bindings
  Variables?: Variables
}
