//ff:type feature=middleware type=handler
//ff:what Is allowed origin handler
import type { Context } from '../../context'
import { HTTPException } from '../../http-exception'
import type { MiddlewareHandler } from '../../types'

export type IsAllowedOriginHandler = (origin: string, context: Context) => boolean | Promise<boolean>
