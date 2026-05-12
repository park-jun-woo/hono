//ff:type feature=utils type=model
//ff:what Status code
import type { InfoStatusCode } from './info_status_code.js'
import type { SuccessStatusCode } from './success_status_code.js'
import type { RedirectStatusCode } from './redirect_status_code.js'
import type { ClientErrorStatusCode } from './client_error_status_code.js'
import type { ServerErrorStatusCode } from './server_error_status_code.js'
import type { UnofficialStatusCode } from './unofficial_status_code.js'

/**
 * If you want to use an unofficial status, use `UnofficialStatusCode`.
 */
export type StatusCode =
  | InfoStatusCode
  | SuccessStatusCode
  | RedirectStatusCode
  | ClientErrorStatusCode
  | ServerErrorStatusCode
  | UnofficialStatusCode
