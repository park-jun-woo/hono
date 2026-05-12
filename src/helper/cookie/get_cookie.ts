//ff:type feature=helper type=model
//ff:what Get cookie
import type { Context } from '../../context'
import { parse, parseSigned, serialize, serializeSigned } from '../../utils/cookie'
import type { Cookie, CookieOptions, CookiePrefixOptions, SignedCookie } from '../../utils/cookie'

export interface GetCookie {
  (c: Context, key: string): string | undefined
  (c: Context): Cookie
  (c: Context, key: string, prefixOptions?: CookiePrefixOptions): string | undefined
}
