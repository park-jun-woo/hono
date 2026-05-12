//ff:type feature=client type=model
//ff:what Client request options
import type { Hono } from '../hono'
import type { HonoBase } from '../hono-base'
import type { METHODS, METHOD_NAME_ALL_LOWERCASE } from '../router'
import type { Endpoint, ExtractSchema, KnownResponseFormat, ResponseFormat, Schema } from '../types'
import type { StatusCode, SuccessStatusCode } from '../utils/http-status'
import type { HasRequiredKeys } from '../utils/types'
import type { HonoRequest } from './hono_request.js'
import type { BuildSearchParamsFn } from './build_search_params_fn.js'

export type ClientRequestOptions<T = unknown> = {
  fetch?: typeof fetch | HonoRequest
  webSocket?: (...args: ConstructorParameters<typeof WebSocket>) => WebSocket
  /**
   * Standard `RequestInit`, caution that this take highest priority
   * and could be used to overwrite things that Hono sets for you, like `body | method | headers`.
   *
   * If you want to add some headers, use in `headers` instead of `init`
   */
  init?: RequestInit
  /**
   * Custom function to serialize query parameters into URLSearchParams.
   * By default, arrays are serialized as multiple parameters with the same key (e.g., `key=a&key=b`).
   * You can provide a custom function to change this behavior, for example to use bracket notation (e.g., `key[]=a&key[]=b`).
   *
   * @example
   * ```ts
   * const client = hc('http://localhost', {
   *   buildSearchParams: (query) => {
   *     return new URLSearchParams(qs.stringify(query))
   *   }
   * })
   * ```
   */
  buildSearchParams?: BuildSearchParamsFn
} & (keyof T extends never
  ? {
      headers?:
        | Record<string, string>
        | (() => Record<string, string> | Promise<Record<string, string>>)
    }
  : {
      headers: T | (() => T | Promise<T>)
    })
