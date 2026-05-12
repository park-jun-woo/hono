//ff:type feature=adapter type=adapter
//ff:what Handler def
import type { Callback } from './callback.js'
import type { LambdaContext } from './lambda_context.js'

export type Handler<TEvent = any, TResult = any> = (
  event: TEvent,
  context: LambdaContext,
  callback: Callback<TResult>
) => void | Promise<TResult>
