//ff:type feature=middleware type=handler
//ff:what Message function
import type { Context } from '../../context'
import { HTTPException } from '../../http-exception'
import type { MiddlewareHandler } from '../../types'
import { auth } from '../../utils/basic-auth'
import { timingSafeEqual } from '../../utils/buffer'

export type MessageFunction = (c: Context) => string | object | Promise<string | object>
