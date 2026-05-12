//ff:type feature=adapter type=adapter
//ff:what Create web socket
import type { UpgradeWebSocket, WSEvents, WSMessageReceive } from '../../helper/websocket'
import { createWSMessageEvent, defineWebSocketHelper, WSContext } from '../../helper/websocket'
import { getBunServer } from './server'
import type { BunWebSocketHandler } from './bun_web_socket_handler.js'
import type { BunWebSocketData } from './websocket.js'
import { upgradeWebSocket } from './websocket.js'
import { websocket } from './websocket.js'

export interface CreateWebSocket<T> {
  upgradeWebSocket: UpgradeWebSocket<T>
  websocket: BunWebSocketHandler<BunWebSocketData>
}
