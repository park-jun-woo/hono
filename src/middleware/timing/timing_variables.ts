//ff:type feature=middleware type=handler
//ff:what Timing variables
import type { Context } from '../../context'
import type { MiddlewareHandler } from '../../types'
import '../../context'
import type { Timer } from './timer.js'

export type TimingVariables = {
  metric?: {
    headers: string[]
    timers: Map<string, Timer>
  }
}
