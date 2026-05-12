//ff:type feature=client type=model
//ff:what Build pathname
import type { Hono } from '../hono'
import type { HonoBase } from '../hono-base'
import type { METHODS, METHOD_NAME_ALL_LOWERCASE } from '../router'
import type { Endpoint, ExtractSchema, KnownResponseFormat, ResponseFormat, Schema } from '../types'
import type { StatusCode, SuccessStatusCode } from '../utils/http-status'
import type { HasRequiredKeys } from '../utils/types'
import type { TrimStartSlash } from './trim_start_slash.js'
import type { ApplyParam } from './apply_param.js'

export type BuildPathname<P extends string, Arg> = Arg extends { param: infer Param }
  ? `${ApplyParam<TrimStartSlash<P>, Param>}`
  : `/${TrimStartSlash<P>}`
