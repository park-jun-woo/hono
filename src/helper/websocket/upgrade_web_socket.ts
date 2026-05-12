//ff:type feature=helper type=model
//ff:what Upgrade web socket
import type { Context } from '../../context'
import type { MiddlewareHandler, TypedResponse } from '../../types'
import type { StatusCode } from '../../utils/http-status'
import type { WSEvents } from './ws_events.js'

/**
 * Upgrade WebSocket Type
 */
export interface UpgradeWebSocket<T = unknown, U = any, _WSEvents = WSEvents<T>> {
  (
    createEvents: (c: Context) => _WSEvents | Promise<_WSEvents>,
    options?: U
  ): MiddlewareHandler<
    any,
    string,
    {
      outputFormat: 'ws'
    }
  >
  (
    c: Context,
    events: _WSEvents,
    options?: U
  ): Promise<Response & TypedResponse<{}, StatusCode, 'ws'>>
}
