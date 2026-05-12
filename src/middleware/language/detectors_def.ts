//ff:type feature=middleware type=handler
//ff:what Detectors def
import type { Context } from '../../context'
import { setCookie, getCookie } from '../../helper/cookie'
import type { MiddlewareHandler } from '../../types'
import { parseAccept } from '../../utils/accept'
import type { DetectorFunction } from './detector_function_def.js'
import { detectors } from './language.js'

/** Type-safe detector map */
export type Detectors = Record<keyof typeof detectors, DetectorFunction>
