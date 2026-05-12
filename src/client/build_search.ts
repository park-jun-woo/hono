//ff:type feature=client type=model
//ff:what Build search
import type { Hono } from '../hono'
import type { HonoBase } from '../hono-base'
import type { METHODS, METHOD_NAME_ALL_LOWERCASE } from '../router'
import type { Endpoint, ExtractSchema, KnownResponseFormat, ResponseFormat, Schema } from '../types'
import type { StatusCode, SuccessStatusCode } from '../utils/http-status'
import type { HasRequiredKeys } from '../utils/types'
import type { IsEmptyObject } from './is_empty_object.js'

export type BuildSearch<Arg, Key extends 'query'> = Arg extends { [K in Key]: infer Query }
  ? IsEmptyObject<Query> extends true
    ? ''
    : `?${string}`
  : ''
