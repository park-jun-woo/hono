//ff:type feature=helper type=model
//ff:what Ssg param
import type { Context } from '../../context'
import type { Env, MiddlewareHandler } from '../../types'
import { isDynamicRoute } from './utils'

export interface SSGParam {
  [key: string]: string
}
