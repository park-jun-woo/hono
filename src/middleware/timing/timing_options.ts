//ff:type feature=middleware type=handler
//ff:what Timing options
import type { Context } from '../../context'
import type { MiddlewareHandler } from '../../types'
import '../../context'

export interface TimingOptions {
  total?: boolean
  enabled?: boolean | ((c: Context) => boolean)
  totalDescription?: string
  autoEnd?: boolean
  crossOrigin?: boolean | string | ((c: Context) => boolean | string)
}
