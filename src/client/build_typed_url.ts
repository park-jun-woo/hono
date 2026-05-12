//ff:type feature=client type=model
//ff:what Build typed url
import type { Hono } from '../hono'
import type { HonoBase } from '../hono-base'
import type { METHODS, METHOD_NAME_ALL_LOWERCASE } from '../router'
import type { Endpoint, ExtractSchema, KnownResponseFormat, ResponseFormat, Schema } from '../types'
import type { StatusCode, SuccessStatusCode } from '../utils/http-status'
import type { HasRequiredKeys } from '../utils/types'
import type { BuildSearch } from './build_search.js'
import type { BuildPathname } from './build_pathname.js'
import type { TypedURL } from './typed_url.js'

export type BuildTypedURL<
  Protocol extends string,
  Host extends string,
  Port extends string,
  P extends string,
  Arg,
> = TypedURL<`${Protocol}:`, Host, Port, BuildPathname<P, Arg>, BuildSearch<Arg, 'query'>>
