//ff:type feature=helper type=model
//ff:what Send options
import type { Context } from '../../context'
import type { MiddlewareHandler, TypedResponse } from '../../types'
import type { StatusCode } from '../../utils/http-status'

/**
 * Options for sending message
 */
export interface SendOptions {
  compress?: boolean
}
