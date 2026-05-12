//ff:type feature=client type=model
//ff:what Build path
import type { Hono } from '../hono'
import type { HonoBase } from '../hono-base'
import type { METHODS, METHOD_NAME_ALL_LOWERCASE } from '../router'
import type { Endpoint, ExtractSchema, KnownResponseFormat, ResponseFormat, Schema } from '../types'
import type { StatusCode, SuccessStatusCode } from '../utils/http-status'
import type { HasRequiredKeys } from '../utils/types'
import type { BuildSearch } from './build_search.js'
import type { BuildPathname } from './build_pathname.js'

export type BuildPath<P extends string, Arg> = `${BuildPathname<P, Arg>}${BuildSearch<Arg, 'query'>}`
