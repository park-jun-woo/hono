//ff:type feature=middleware type=handler
//ff:what Report to options def
import type { Context } from '../../context'
import type { MiddlewareHandler } from '../../types'
import { encodeBase64 } from '../../utils/encode'
import type { PermissionsPolicyDirective } from './permissions-policy'
import type { ReportToEndpoint } from './report_to_endpoint_def.js'

export interface ReportToOptions {
  group: string
  max_age: number
  endpoints: ReportToEndpoint[]
}
