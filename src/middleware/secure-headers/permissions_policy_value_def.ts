//ff:type feature=middleware type=handler
//ff:what Permissions policy value def
import type { Context } from '../../context'
import type { MiddlewareHandler } from '../../types'
import { encodeBase64 } from '../../utils/encode'
import type { PermissionsPolicyDirective } from './permissions-policy'

export type PermissionsPolicyValue = '*' | 'self' | 'src' | 'none' | string
