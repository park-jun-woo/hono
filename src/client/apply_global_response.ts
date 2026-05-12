//ff:type feature=client type=model
//ff:what Apply global response
import type { Hono } from '../hono'
import type { HonoBase } from '../hono-base'
import type { METHODS, METHOD_NAME_ALL_LOWERCASE } from '../router'
import type { Endpoint, ExtractSchema, KnownResponseFormat, ResponseFormat, Schema } from '../types'
import type { StatusCode, SuccessStatusCode } from '../utils/http-status'
import type { HasRequiredKeys } from '../utils/types'
import type { GlobalResponseDefinition } from './global_response_definition.js'
import type { ModSchema } from './mod_schema.js'

export type ApplyGlobalResponse<App, Def extends GlobalResponseDefinition> =
  App extends HonoBase<infer E, infer _ extends Schema, infer B>
    ? ModSchema<ExtractSchema<App>, Def> extends infer S extends Schema
      ? Hono<E, S, B>
      : never
    : never
