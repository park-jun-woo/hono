//ff:type feature=client type=model
//ff:what Pick schema
import type { Hono } from '../hono'
import type { HonoBase } from '../hono-base'
import type { METHODS, METHOD_NAME_ALL_LOWERCASE } from '../router'
import type { Endpoint, ExtractSchema, KnownResponseFormat, ResponseFormat, Schema } from '../types'
import type { StatusCode, SuccessStatusCode } from '../utils/http-status'
import type { HasRequiredKeys } from '../utils/types'
import type { PickRoute } from './pick_route.js'

export type PickSchema<D, U extends StatusCode> = {
  [K in keyof D]: {
    [M in keyof D[K]]: PickRoute<D[K][M], U>
  }
}
