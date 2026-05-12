//ff:type feature=helper type=model
//ff:what Added ssg data request
import type { Context } from '../../context'
import type { Env, MiddlewareHandler } from '../../types'
import { isDynamicRoute } from './utils'
import type { SSGParams } from './ssg_params.js'
import { ssgParams } from './middleware.js'

export type AddedSSGDataRequest = Request & {
  ssgParams?: SSGParams
}
