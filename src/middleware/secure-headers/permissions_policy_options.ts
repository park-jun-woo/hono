//ff:type feature=middleware type=handler
//ff:what Permissions policy options
import type { Context } from '../../context'
import type { MiddlewareHandler } from '../../types'
import { encodeBase64 } from '../../utils/encode'
import type { PermissionsPolicyDirective } from './permissions-policy'
import type { PermissionsPolicyValue } from './permissions_policy_value.js'

export type PermissionsPolicyOptions = Partial<
  Record<PermissionsPolicyDirective, PermissionsPolicyValue[] | boolean>
>
