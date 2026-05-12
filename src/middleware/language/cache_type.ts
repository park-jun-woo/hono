//ff:type feature=middleware type=handler
//ff:what Cache type
import type { Context } from '../../context'
import { setCookie, getCookie } from '../../helper/cookie'
import type { MiddlewareHandler } from '../../types'
import { parseAccept } from '../../utils/accept'

export type CacheType = 'cookie'
