//ff:type feature=client type=model
//ff:what Filter client response by status code
import type { Hono } from '../hono'
import type { HonoBase } from '../hono-base'
import type { METHODS, METHOD_NAME_ALL_LOWERCASE } from '../router'
import type { Endpoint, ExtractSchema, KnownResponseFormat, ResponseFormat, Schema } from '../types'
import type { StatusCode, SuccessStatusCode } from '../utils/http-status'
import type { HasRequiredKeys } from '../utils/types'
import type { ClientResponse } from './client_response.js'

/**
 * Filter a ClientResponse type so it only includes responses of specific status codes.
 */
export type FilterClientResponseByStatusCode<
  T extends ClientResponse<any, any, any>,
  U extends number = StatusCode,
> =
  T extends ClientResponse<infer RT, infer RC, infer RF>
    ? RC extends U
      ? ClientResponse<RT, RC, RF>
      : never
    : never
