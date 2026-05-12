//ff:type feature=client type=model
//ff:what To endpoints
import type { Hono } from '../hono'
import type { HonoBase } from '../hono-base'
import type { METHODS, METHOD_NAME_ALL_LOWERCASE } from '../router'
import type { Endpoint, ExtractSchema, KnownResponseFormat, ResponseFormat, Schema } from '../types'
import type { StatusCode, SuccessStatusCode } from '../utils/http-status'
import type { HasRequiredKeys } from '../utils/types'
import type { GlobalResponseDefinition } from './global_response_definition.js'

export type ToEndpoints<Def extends GlobalResponseDefinition, R> = {
  [S in keyof Def & StatusCode]: {
    [F in keyof Def[S] & KnownResponseFormat]: Omit<R, 'output' | 'status' | 'outputFormat'> & {
      output: Def[S][F]
      status: S
      outputFormat: F
    }
  }[keyof Def[S] & KnownResponseFormat]
}[keyof Def & StatusCode]
