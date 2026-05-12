//ff:type feature=middleware type=handler
//ff:what Report to endpoint def
import type { Context } from '../../context'
import type { MiddlewareHandler } from '../../types'
import { encodeBase64 } from '../../utils/encode'
import type { PermissionsPolicyDirective } from './permissions-policy'

export interface ReportToEndpoint {
  url: string
}
