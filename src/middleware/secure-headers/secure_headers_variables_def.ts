//ff:type feature=middleware type=handler
//ff:what Secure headers variables def
import type { Context } from '../../context'
import type { MiddlewareHandler } from '../../types'
import { encodeBase64 } from '../../utils/encode'
import type { PermissionsPolicyDirective } from './permissions-policy'

export type SecureHeadersVariables = {
  secureHeadersNonce?: string
}
