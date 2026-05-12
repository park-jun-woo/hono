//ff:type feature=client type=model
//ff:what Client request
import type { Hono } from '../hono'
import type { HonoBase } from '../hono-base'
import type { METHODS, METHOD_NAME_ALL_LOWERCASE } from '../router'
import type { Endpoint, ExtractSchema, KnownResponseFormat, ResponseFormat, Schema } from '../types'
import type { StatusCode, SuccessStatusCode } from '../utils/http-status'
import type { HasRequiredKeys } from '../utils/types'
import type { ExpandAllMethod } from './expand_all_method.js'
import type { ClientRequestOptions } from './client_request_options.js'
import type { ClientResponseOfEndpoint } from './client_response_of_endpoint.js'
import type { BuildPath } from './build_path.js'
import type { HonoURL } from './hono_url.js'

export type ClientRequest<Prefix extends string, Path extends string, S extends Schema> = {
  [M in keyof ExpandAllMethod<S>]: ExpandAllMethod<S>[M] extends Endpoint & { input: infer R }
    ? R extends object
      ? HasRequiredKeys<R> extends true
        ? (
            args: R,
            options?: ClientRequestOptions
          ) => Promise<ClientResponseOfEndpoint<ExpandAllMethod<S>[M]>>
        : (
            args?: R,
            options?: ClientRequestOptions
          ) => Promise<ClientResponseOfEndpoint<ExpandAllMethod<S>[M]>>
      : never
    : never
} & {
  $url: <
    const Arg extends
      | (S[keyof S] extends { input: infer R }
          ? R extends { param: infer P }
            ? R extends { query: infer Q }
              ? { param: P; query: Q }
              : { param: P }
            : R extends { query: infer Q }
              ? { query: Q }
              : {}
          : {})
      | undefined = undefined,
  >(
    arg?: Arg
  ) => HonoURL<Prefix, Path, Arg>
  $path: <
    const Arg extends
      | (S[keyof S] extends { input: infer R }
          ? R extends { param: infer P }
            ? R extends { query: infer Q }
              ? { param: P; query: Q }
              : { param: P }
            : R extends { query: infer Q }
              ? { query: Q }
              : {}
          : {})
      | undefined = undefined,
  >(
    arg?: Arg
  ) => BuildPath<Path, Arg>
} & (S['$get'] extends { outputFormat: 'ws' }
    ? S['$get'] extends { input: infer I }
      ? {
          $ws: (args?: I) => WebSocket
        }
      : {}
    : {})
