//ff:type feature=middleware type=handler
//ff:what Content security policy option handler
import type { Context } from '../../context'
import type { MiddlewareHandler } from '../../types'
import { encodeBase64 } from '../../utils/encode'
import type { PermissionsPolicyDirective } from './permissions-policy'

export type ContentSecurityPolicyOptionHandler = (ctx: Context, directive: string) => string
