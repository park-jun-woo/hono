//ff:type feature=client type=model
//ff:what Mod schema
import type { Hono } from '../hono'
import type { HonoBase } from '../hono-base'
import type { METHODS, METHOD_NAME_ALL_LOWERCASE } from '../router'
import type { Endpoint, ExtractSchema, KnownResponseFormat, ResponseFormat, Schema } from '../types'
import type { StatusCode, SuccessStatusCode } from '../utils/http-status'
import type { HasRequiredKeys } from '../utils/types'
import type { GlobalResponseDefinition } from './global_response_definition.js'
import type { ModRoute } from './mod_route.js'

export type ModSchema<D, Def extends GlobalResponseDefinition> = {
  [K in keyof D]: {
    [M in keyof D[K]]: ModRoute<D[K][M], Def>
  }
}
