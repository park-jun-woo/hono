//ff:type feature=helper type=model
//ff:what Ws context init
import type { Context } from '../../context'
import type { MiddlewareHandler, TypedResponse } from '../../types'
import type { StatusCode } from '../../utils/http-status'
import type { WSReadyState } from './ws_ready_state.js'
import type { SendOptions } from './send_options.js'

/**
 * An argument for WSContext class
 */
export interface WSContextInit<T = unknown> {
  send(data: string | ArrayBuffer | Uint8Array, options: SendOptions): void
  close(code?: number, reason?: string): void

  raw?: T
  readyState: WSReadyState
  url?: string | URL | null
  protocol?: string | null
}
