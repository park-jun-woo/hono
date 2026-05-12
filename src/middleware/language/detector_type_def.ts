//ff:type feature=middleware type=handler
//ff:what Detector type def
import type { Context } from '../../context'
import { setCookie, getCookie } from '../../helper/cookie'
import type { MiddlewareHandler } from '../../types'
import { parseAccept } from '../../utils/accept'

export type DetectorType = 'path' | 'querystring' | 'cookie' | 'header'
