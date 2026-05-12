//ff:type feature=core type=model
//ff:what Handler
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
import type { Env } from './env.js'
import type { Next } from './next.js'
import type { Input } from './input.js'
import type { BlankInput } from './blank_input.js'
import type { HandlerResponse } from './handler_response.js'

export type Handler<
  E extends Env = any,
  P extends string = any,
  I extends Input = BlankInput,
  R extends HandlerResponse<any> = any,
> = (c: Context<E, P, I>, next: Next) => R
