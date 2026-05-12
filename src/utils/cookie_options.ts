//ff:type feature=utils type=model
//ff:what Cookie options
import { decodeURIComponent_, tryDecode } from './url'
import type { PartitionedCookieConstraint } from './partitioned_cookie_constraint.js'
import type { CookiePrefixOptions } from './cookie_prefix_options.js'

export type CookieOptions = {
  domain?: string
  expires?: Date
  httpOnly?: boolean
  maxAge?: number
  path?: string
  secure?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None' | 'strict' | 'lax' | 'none'
  partitioned?: boolean
  priority?: 'Low' | 'Medium' | 'High' | 'low' | 'medium' | 'high'
  prefix?: CookiePrefixOptions
} & PartitionedCookieConstraint
