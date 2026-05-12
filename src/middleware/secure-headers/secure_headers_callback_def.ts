//ff:type feature=middleware type=handler
//ff:what Secure headers callback def
import type { Context } from '../../context'
import type { MiddlewareHandler } from '../../types'
import { encodeBase64 } from '../../utils/encode'
import type { PermissionsPolicyDirective } from './permissions-policy'

export type SecureHeadersCallback = (
  ctx: Context,
  headersToSet: [string, string | string[]][]
) => [string, string][]
