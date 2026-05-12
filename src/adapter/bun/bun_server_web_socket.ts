//ff:type feature=adapter type=adapter
//ff:what Bun server web socket
import type { UpgradeWebSocket, WSEvents, WSMessageReceive } from '../../helper/websocket'
import { createWSMessageEvent, defineWebSocketHelper, WSContext } from '../../helper/websocket'
import { getBunServer } from './server'

/**
 * @internal
 */
export interface BunServerWebSocket<T> {
  send(data: string | ArrayBuffer | Uint8Array, compress?: boolean): void
  close(code?: number, reason?: string): void
  data: T
  readyState: 0 | 1 | 2 | 3
}
