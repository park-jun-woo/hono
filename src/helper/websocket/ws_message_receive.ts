//ff:type feature=helper type=model
//ff:what Ws message receive
import type { Context } from '../../context'
import type { MiddlewareHandler, TypedResponse } from '../../types'
import type { StatusCode } from '../../utils/http-status'

export type WSMessageReceive = string | Blob | ArrayBufferLike
