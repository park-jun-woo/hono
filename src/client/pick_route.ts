//ff:type feature=client type=model
//ff:what Pick route
import type { Hono } from '../hono'
import type { HonoBase } from '../hono-base'
import type { METHODS, METHOD_NAME_ALL_LOWERCASE } from '../router'
import type { Endpoint, ExtractSchema, KnownResponseFormat, ResponseFormat, Schema } from '../types'
import type { StatusCode, SuccessStatusCode } from '../utils/http-status'
import type { HasRequiredKeys } from '../utils/types'

export type PickRoute<R, U extends StatusCode> = R extends Endpoint
  ? R extends { status: U }
    ? R
    : never
  : R
