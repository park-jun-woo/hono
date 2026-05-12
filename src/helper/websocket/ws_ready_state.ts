//ff:type feature=helper type=model
//ff:what Ws ready state
import type { Context } from '../../context'
import type { MiddlewareHandler, TypedResponse } from '../../types'
import type { StatusCode } from '../../utils/http-status'

/**
 * ReadyState for WebSocket
 */
export type WSReadyState = 0 | 1 | 2 | 3
