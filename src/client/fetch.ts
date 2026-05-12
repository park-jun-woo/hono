//ff:type feature=client type=model
//ff:what Fetch
import type { Hono } from '../hono'
import type { HonoBase } from '../hono-base'
import type { METHODS, METHOD_NAME_ALL_LOWERCASE } from '../router'
import type { Endpoint, ExtractSchema, KnownResponseFormat, ResponseFormat, Schema } from '../types'
import type { StatusCode, SuccessStatusCode } from '../utils/http-status'
import type { HasRequiredKeys } from '../utils/types'
import type { ClientRequestOptions } from './client_request_options.js'
import type { ClientResponseOfEndpoint } from './client_response_of_endpoint.js'
import type { InferEndpointType } from './infer_endpoint_type.js'
import type { InferRequestType } from './infer_request_type.js'

export type Fetch<T> = (
  args?: InferRequestType<T>,
  opt?: ClientRequestOptions
) => Promise<ClientResponseOfEndpoint<InferEndpointType<T>>>
