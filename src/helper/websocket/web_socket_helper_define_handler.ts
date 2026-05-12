//ff:type feature=helper type=model
//ff:what Web socket helper define handler
import type { Context } from '../../context'
import type { MiddlewareHandler, TypedResponse } from '../../types'
import type { StatusCode } from '../../utils/http-status'
import type { WSEvents } from './ws_events.js'

export type WebSocketHelperDefineHandler<T, U> = (
  c: Context,
  events: WSEvents<T>,
  options?: U
) => Promise<Response | void> | Response | void
