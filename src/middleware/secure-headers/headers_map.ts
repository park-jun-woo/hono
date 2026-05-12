//ff:type feature=middleware type=handler
//ff:what Headers map
import type { Context } from '../../context'
import type { MiddlewareHandler } from '../../types'
import { encodeBase64 } from '../../utils/encode'
import type { PermissionsPolicyDirective } from './permissions-policy'
import type { SecureHeadersOptions } from './secure-headers.js'

export type HeadersMap = {
  [key in keyof SecureHeadersOptions]: [string, string]
}
