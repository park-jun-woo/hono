//ff:type feature=utils type=model
//ff:what Html escaped
import type { HtmlEscapedCallback } from './html_escaped_callback.js'

export type HtmlEscaped = {
  isEscaped: true
  callbacks?: HtmlEscapedCallback[]
}
