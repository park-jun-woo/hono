//ff:type feature=client type=model
//ff:what Method name all
import type { Hono } from '../hono'
import type { HonoBase } from '../hono-base'
import type { METHODS, METHOD_NAME_ALL_LOWERCASE } from '../router'
import type { Endpoint, ExtractSchema, KnownResponseFormat, ResponseFormat, Schema } from '../types'
import type { StatusCode, SuccessStatusCode } from '../utils/http-status'
import type { HasRequiredKeys } from '../utils/types'

/**
 * Type representing the '$all' method name
 */
export type MethodNameAll = `$${typeof METHOD_NAME_ALL_LOWERCASE}`
