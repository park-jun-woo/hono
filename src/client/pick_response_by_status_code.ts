//ff:type feature=client type=model
//ff:what Pick response by status code
import type { Hono } from '../hono'
import type { HonoBase } from '../hono-base'
import type { METHODS, METHOD_NAME_ALL_LOWERCASE } from '../router'
import type { Endpoint, ExtractSchema, KnownResponseFormat, ResponseFormat, Schema } from '../types'
import type { StatusCode, SuccessStatusCode } from '../utils/http-status'
import type { HasRequiredKeys } from '../utils/types'
import type { PickSchema } from './pick_schema.js'

/**
 * Keep only specific status code responses from all routes of an app.
 * Useful when error responses are handled centrally (e.g., via custom fetch)
 * and you want the client to only expose success response types.
 *
 * @example
 * ```ts
 * type AppSuccessOnly = PickResponseByStatusCode<typeof app, 200>
 * const client = hc<AppSuccessOnly>('http://localhost')
 * ```
 */
export type PickResponseByStatusCode<App, U extends StatusCode> =
  App extends HonoBase<infer E, infer _ extends Schema, infer B>
    ? PickSchema<ExtractSchema<App>, U> extends infer S extends Schema
      ? Hono<E, S, B>
      : never
    : never
