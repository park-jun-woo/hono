//ff:type feature=helper type=model
//ff:what Sse message
import type { Context } from '../../context'
import { HtmlEscapedCallbackPhase, resolveCallback } from '../../utils/html'
import { StreamingApi } from '../../utils/stream'
import { isOldBunVersion } from './utils'

export interface SSEMessage {
  data: string | Promise<string>
  event?: string
  id?: string
  retry?: number
}
