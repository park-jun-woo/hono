//ff:type feature=middleware type=handler
//ff:what Timer
import type { Context } from '../../context'
import type { MiddlewareHandler } from '../../types'
import '../../context'

export interface Timer {
  description?: string
  start: number
}
