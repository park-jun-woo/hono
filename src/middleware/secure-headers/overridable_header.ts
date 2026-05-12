//ff:type feature=middleware type=handler
//ff:what Overridable header
import type { Context } from '../../context'
import type { MiddlewareHandler } from '../../types'
import { encodeBase64 } from '../../utils/encode'
import type { PermissionsPolicyDirective } from './permissions-policy'

export type overridableHeader = boolean | string
