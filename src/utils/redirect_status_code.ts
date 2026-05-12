//ff:type feature=utils type=model
//ff:what Redirect status code
import type { DeprecatedStatusCode } from './deprecated_status_code.js'

export type RedirectStatusCode = 300 | 301 | 302 | 303 | 304 | DeprecatedStatusCode | 307 | 308
