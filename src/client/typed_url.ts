//ff:type feature=client type=model
//ff:what Typed url
import type { Hono } from '../hono'
import type { HonoBase } from '../hono-base'
import type { METHODS, METHOD_NAME_ALL_LOWERCASE } from '../router'
import type { Endpoint, ExtractSchema, KnownResponseFormat, ResponseFormat, Schema } from '../types'
import type { StatusCode, SuccessStatusCode } from '../utils/http-status'
import type { HasRequiredKeys } from '../utils/types'

export interface TypedURL<
  Protocol extends string,
  Hostname extends string,
  Port extends string,
  Pathname extends string,
  Search extends string,
> extends URL {
  protocol: Protocol
  hostname: Hostname
  port: Port
  host: Port extends '' ? Hostname : `${Hostname}:${Port}`
  origin: `${Protocol}//${Hostname}${Port extends '' ? '' : `:${Port}`}`
  pathname: Pathname
  search: Search
  href: `${Protocol}//${Hostname}${Port extends '' ? '' : `:${Port}`}${Pathname}${Search}`
}
