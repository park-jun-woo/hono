//ff:type feature=middleware type=handler
//ff:what Reporting endpoint options def
import type { Context } from '../../context'
import type { MiddlewareHandler } from '../../types'
import { encodeBase64 } from '../../utils/encode'
import type { PermissionsPolicyDirective } from './permissions-policy'

export interface ReportingEndpointOptions {
  name: string
  url: string
}
