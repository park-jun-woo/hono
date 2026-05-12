//ff:type feature=client type=model
//ff:what Mod route
import type { Hono } from '../hono'
import type { HonoBase } from '../hono-base'
import type { METHODS, METHOD_NAME_ALL_LOWERCASE } from '../router'
import type { Endpoint, ExtractSchema, KnownResponseFormat, ResponseFormat, Schema } from '../types'
import type { StatusCode, SuccessStatusCode } from '../utils/http-status'
import type { HasRequiredKeys } from '../utils/types'
import type { GlobalResponseDefinition } from './global_response_definition.js'
import type { ToEndpoints } from './to_endpoints.js'

export type ModRoute<R, Def extends GlobalResponseDefinition> = R extends Endpoint
  ? R | ToEndpoints<Def, R>
  : R
