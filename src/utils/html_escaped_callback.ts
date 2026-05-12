//ff:type feature=utils type=model
//ff:what Html escaped callback
import type { HtmlEscapedCallbackOpts } from './html_escaped_callback_opts.js'

export type HtmlEscapedCallback = (opts: HtmlEscapedCallbackOpts) => Promise<string> | undefined
