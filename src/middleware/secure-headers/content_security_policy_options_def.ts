//ff:type feature=middleware type=handler
//ff:what Content security policy options def
import type { Context } from '../../context'
import type { MiddlewareHandler } from '../../types'
import { encodeBase64 } from '../../utils/encode'
import type { PermissionsPolicyDirective } from './permissions-policy'
import type { ContentSecurityPolicyOptionValue } from './content_security_policy_option_value_def.js'

export interface ContentSecurityPolicyOptions {
  defaultSrc?: ContentSecurityPolicyOptionValue
  baseUri?: ContentSecurityPolicyOptionValue
  childSrc?: ContentSecurityPolicyOptionValue
  connectSrc?: ContentSecurityPolicyOptionValue
  fontSrc?: ContentSecurityPolicyOptionValue
  formAction?: ContentSecurityPolicyOptionValue
  frameAncestors?: ContentSecurityPolicyOptionValue
  frameSrc?: ContentSecurityPolicyOptionValue
  imgSrc?: ContentSecurityPolicyOptionValue
  manifestSrc?: ContentSecurityPolicyOptionValue
  mediaSrc?: ContentSecurityPolicyOptionValue
  objectSrc?: ContentSecurityPolicyOptionValue
  reportTo?: string
  reportUri?: string | string[]
  sandbox?: ContentSecurityPolicyOptionValue
  scriptSrc?: ContentSecurityPolicyOptionValue
  scriptSrcAttr?: ContentSecurityPolicyOptionValue
  scriptSrcElem?: ContentSecurityPolicyOptionValue
  styleSrc?: ContentSecurityPolicyOptionValue
  styleSrcAttr?: ContentSecurityPolicyOptionValue
  styleSrcElem?: ContentSecurityPolicyOptionValue
  upgradeInsecureRequests?: ContentSecurityPolicyOptionValue
  workerSrc?: ContentSecurityPolicyOptionValue
  requireTrustedTypesFor?: ContentSecurityPolicyOptionValue
  trustedTypes?: ContentSecurityPolicyOptionValue
}
