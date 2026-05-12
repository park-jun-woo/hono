//ff:type feature=client type=model
//ff:what Hono url
import type { Hono } from '../hono'
import type { HonoBase } from '../hono-base'
import type { METHODS, METHOD_NAME_ALL_LOWERCASE } from '../router'
import type { Endpoint, ExtractSchema, KnownResponseFormat, ResponseFormat, Schema } from '../types'
import type { StatusCode, SuccessStatusCode } from '../utils/http-status'
import type { HasRequiredKeys } from '../utils/types'
import type { BuildTypedURL } from './build_typed_url.js'
import type { ParseHostName } from './parse_host_name.js'
import type { TrimEndSlash } from './trim_end_slash.js'
import type { IsLiteral } from './is_literal.js'

export type HonoURL<Prefix extends string, Path extends string, Arg> =
  IsLiteral<Prefix> extends true
    ? TrimEndSlash<Prefix> extends `${infer Protocol}://${infer Rest}`
      ? Rest extends `${infer Hostname}/${infer P}`
        ? ParseHostName<Hostname> extends [infer Host extends string, infer Port extends string]
          ? BuildTypedURL<Protocol, Host, Port, P, Arg>
          : never
        : ParseHostName<Rest> extends [infer Host extends string, infer Port extends string]
          ? BuildTypedURL<Protocol, Host, Port, Path, Arg>
          : never
      : URL
    : URL
