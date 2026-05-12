//ff:type feature=client type=model
//ff:what Apply param
import type { Hono } from '../hono'
import type { HonoBase } from '../hono-base'
import type { METHODS, METHOD_NAME_ALL_LOWERCASE } from '../router'
import type { Endpoint, ExtractSchema, KnownResponseFormat, ResponseFormat, Schema } from '../types'
import type { StatusCode, SuccessStatusCode } from '../utils/http-status'
import type { HasRequiredKeys } from '../utils/types'
import type { IsLiteral } from './is_literal.js'

export type ApplyParam<
  Path extends string,
  P,
  Result extends string = '',
> = Path extends `${infer Head}/${infer Rest}`
  ? Head extends `:${infer Param}`
    ? P extends Record<Param, infer Value extends string>
      ? IsLiteral<Value> extends true
        ? ApplyParam<Rest, P, `${Result}/${Value & string}`>
        : ApplyParam<Rest, P, `${Result}/${Head}`>
      : ApplyParam<Rest, P, `${Result}/${Head}`>
    : ApplyParam<Rest, P, `${Result}/${Head}`>
  : Path extends `:${infer Param}`
    ? P extends Record<Param, infer Value extends string>
      ? IsLiteral<Value> extends true
        ? `${Result}/${Value & string}`
        : `${Result}/${Path}`
      : `${Result}/${Path}`
    : `${Result}/${Path}`
