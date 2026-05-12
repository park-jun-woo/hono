//ff:type feature=utils type=model
//ff:what Http status

import type { StatusCode } from './status_code.js'
import type { ContentlessStatusCode } from './contentless_status_code.js'

export type { InfoStatusCode } from './info_status_code.js'
export type { SuccessStatusCode } from './success_status_code.js'
export type { DeprecatedStatusCode } from './deprecated_status_code.js'
export type { RedirectStatusCode } from './redirect_status_code.js'
export type { ClientErrorStatusCode } from './client_error_status_code.js'
export type { ServerErrorStatusCode } from './server_error_status_code.js'
export type { UnofficialStatusCode } from './unofficial_status_code.js'
export type { UnOfficalStatusCode } from './un_offical_status_code.js'
export type { StatusCode } from './status_code.js'
export type { ContentlessStatusCode } from './contentless_status_code.js'

export type ContentfulStatusCode = Exclude<StatusCode, ContentlessStatusCode>
