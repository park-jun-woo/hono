//ff:type feature=helper type=model
//ff:what Ws events
import type { Context } from '../../context'
import type { MiddlewareHandler, TypedResponse } from '../../types'
import type { StatusCode } from '../../utils/http-status'
import type { WSMessageReceive } from './ws_message_receive.js'
import { WSContext } from './index.js'

/**
 * WebSocket Event Listeners type
 */
export interface WSEvents<T = unknown> {
  onOpen?: (evt: Event, ws: WSContext<T>) => void
  onMessage?: (evt: MessageEvent<WSMessageReceive>, ws: WSContext<T>) => void
  onClose?: (evt: CloseEvent, ws: WSContext<T>) => void
  onError?: (evt: Event, ws: WSContext<T>) => void
}
