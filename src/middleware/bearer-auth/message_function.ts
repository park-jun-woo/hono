//ff:type feature=middleware type=handler
//ff:what Message function
import type { Context } from '../../context'
import { HTTPException } from '../../http-exception'
import type { MiddlewareHandler } from '../../types'
import { timingSafeEqual } from '../../utils/buffer'
import type { ContentfulStatusCode } from '../../utils/http-status'

export type MessageFunction = (c: Context) => string | object | Promise<string | object>
