//ff:type feature=utils type=model
//ff:what Html escaped callback opts
import { HtmlEscapedCallbackPhase } from './html.js'

export type HtmlEscapedCallbackOpts = {
  buffer?: [string]
  phase: (typeof HtmlEscapedCallbackPhase)[keyof typeof HtmlEscapedCallbackPhase]
  context: Readonly<object> // An object unique to each JSX tree. This object is used as the WeakMap key.
}
