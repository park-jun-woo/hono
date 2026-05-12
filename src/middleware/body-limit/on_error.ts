//ff:type feature=middleware type=handler
//ff:what On error
import type { Context } from '../../context'
import { HTTPException } from '../../http-exception'
import type { MiddlewareHandler } from '../../types'

export type OnError = (c: Context) => Response | Promise<Response>
