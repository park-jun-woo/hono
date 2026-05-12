//ff:type feature=middleware type=handler
//ff:what Detector function
import type { Context } from '../../context'
import { setCookie, getCookie } from '../../helper/cookie'
import type { MiddlewareHandler } from '../../types'
import { parseAccept } from '../../utils/accept'
import type { DetectorOptions } from './detector_options.js'

/** Type for detector functions */
export type DetectorFunction = (c: Context, options: DetectorOptions) => string | undefined
