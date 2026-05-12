//ff:type feature=client type=model
//ff:what Path to chain
import type { Hono } from '../hono'
import type { HonoBase } from '../hono-base'
import type { METHODS, METHOD_NAME_ALL_LOWERCASE } from '../router'
import type { Endpoint, ExtractSchema, KnownResponseFormat, ResponseFormat, Schema } from '../types'
import type { StatusCode, SuccessStatusCode } from '../utils/http-status'
import type { HasRequiredKeys } from '../utils/types'
import type { ClientRequest } from './client_request.js'

export type PathToChain<
  Prefix extends string,
  Path extends string,
  E extends Schema,
  Original extends string = Path,
> = Path extends `/${infer P}`
  ? PathToChain<Prefix, P, E, Path>
  : Path extends `${infer P}/${infer R}`
    ? { [K in P]: PathToChain<Prefix, R, E, Original> }
    : {
        [K in Path extends '' ? 'index' : Path]: ClientRequest<
          Prefix,
          Original,
          E extends Record<string, unknown> ? E[Original] : never
        >
      }
