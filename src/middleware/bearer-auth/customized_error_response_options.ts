//ff:type feature=middleware type=handler
//ff:what Customized error response options
import type { Context } from '../../context'
import { HTTPException } from '../../http-exception'
import type { MiddlewareHandler } from '../../types'
import { timingSafeEqual } from '../../utils/buffer'
import type { ContentfulStatusCode } from '../../utils/http-status'
import type { MessageFunction } from './message_function.js'

export type CustomizedErrorResponseOptions = {
  wwwAuthenticateHeader?: string | object | MessageFunction
  message?: string | object | MessageFunction
}
