//ff:type feature=helper type=model
//ff:what Ssg params
import type { Context } from '../../context'
import type { Env, MiddlewareHandler } from '../../types'
import { isDynamicRoute } from './utils'
import type { SSGParam } from './ssg_param.js'

export type SSGParams = SSGParam[]
