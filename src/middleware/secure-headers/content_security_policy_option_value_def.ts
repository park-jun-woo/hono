//ff:type feature=middleware type=handler
//ff:what Content security policy option value def
import type { Context } from '../../context'
import type { MiddlewareHandler } from '../../types'
import { encodeBase64 } from '../../utils/encode'
import type { PermissionsPolicyDirective } from './permissions-policy'
import type { ContentSecurityPolicyOptionHandler } from './content_security_policy_option_handler_def.js'

export type ContentSecurityPolicyOptionValue = (string | ContentSecurityPolicyOptionHandler)[]
