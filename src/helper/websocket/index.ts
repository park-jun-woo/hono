//ff:type feature=helper type=model
//ff:what Index
/**
 * @module
 * WebSocket Helper for Hono.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Context } from '../../context'
import type { MiddlewareHandler, TypedResponse } from '../../types'
import type { StatusCode } from '../../utils/http-status'
import type { WSReadyState } from './ws_ready_state.js'
import type { WSContextInit } from './ws_context_init.js'
import type { SendOptions } from './send_options.js'
import type { WSMessageReceive } from './ws_message_receive.js'
import type { WebSocketHelperDefineHandler } from './web_socket_helper_define_handler.js'
import type { WSEvents } from './ws_events.js'
import type { UpgradeWebSocket } from './upgrade_web_socket.js'

export type { WSReadyState } from './ws_ready_state.js'
export type { WSMessageReceive } from './ws_message_receive.js'
export type { WebSocketHelperDefineHandler } from './web_socket_helper_define_handler.js'
export type { WSEvents } from './ws_events.js'
export type { UpgradeWebSocket } from './upgrade_web_socket.js'
export type { WSContextInit } from './ws_context_init.js'
export type { SendOptions } from './send_options.js'
export type { WebSocketHelperDefineContext } from './web_socket_helper_define_context.js'


/**
 * A context for controlling WebSockets
 */
export class WSContext<T = unknown> {
  #init: WSContextInit<T>
  constructor(init: WSContextInit<T>) {
    this.#init = init
    this.raw = init.raw
    this.url = init.url ? new URL(init.url) : null
    this.protocol = init.protocol ?? null
  }
  send(source: string | ArrayBuffer | Uint8Array<ArrayBuffer>, options?: SendOptions): void {
    this.#init.send(source, options ?? {})
  }
  raw?: T
  binaryType: BinaryType = 'arraybuffer'
  get readyState(): WSReadyState {
    return this.#init.readyState
  }
  url: URL | null
  protocol: string | null
  close(code?: number, reason?: string) {
    this.#init.close(code, reason)
  }
}

export const createWSMessageEvent = (source: WSMessageReceive): MessageEvent<WSMessageReceive> => {
  return new MessageEvent<WSMessageReceive>('message', {
    data: source,
  })
}
/**
 * Create a WebSocket adapter/helper
 */
export const defineWebSocketHelper = <T = unknown, U = any>(
  handler: WebSocketHelperDefineHandler<T, U>
): UpgradeWebSocket<T, U> => {
  return ((
    ...args:
      | [createEvents: (c: Context) => WSEvents<T> | Promise<WSEvents<T>>, options?: U]
      | [c: Context, events: WSEvents<T>, options?: U]
  ) => {
    if (typeof args[0] === 'function') {
      const [createEvents, options] = args
      return async function upgradeWebSocket(c, next) {
        const events = await createEvents(c)
        const result = await handler(c, events, options as U)
        if (result) {
          return result
        }
        await next()
      }
    } else {
      const [c, events, options] = args as [c: Context, events: WSEvents<T>, options?: U]
      return (async () => {
        const upgraded = await handler(c, events, options as U)
        if (!upgraded) {
          throw new Error('Failed to upgrade WebSocket')
        }
        return upgraded
      })()
    }
  }) as UpgradeWebSocket<T, U>
}
