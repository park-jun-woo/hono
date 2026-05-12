//ff:type feature=client type=model
//ff:what Expand all method
import type { Hono } from '../hono'
import type { HonoBase } from '../hono-base'
import type { METHODS, METHOD_NAME_ALL_LOWERCASE } from '../router'
import type { Endpoint, ExtractSchema, KnownResponseFormat, ResponseFormat, Schema } from '../types'
import type { StatusCode, SuccessStatusCode } from '../utils/http-status'
import type { HasRequiredKeys } from '../utils/types'
import type { MethodNameAll } from './method_name_all.js'
import type { StandardMethods } from './standard_methods.js'

/**
 * Expands '$all' into all standard HTTP methods.
 * If the schema contains '$all', it creates a type where all standard HTTP methods
 * point to the same endpoint definition as '$all', while removing '$all' itself.
 */
export type ExpandAllMethod<S> = MethodNameAll extends keyof S
  ? { [M in StandardMethods]: S[MethodNameAll] } & Omit<S, MethodNameAll>
  : S
