//ff:type feature=middleware type=handler
//ff:what Request id variables
import type { Context } from '../../context'
import type { MiddlewareHandler } from '../../types'
import { requestId } from './request-id.js'

export type RequestIdVariables = {
  requestId: string
}
