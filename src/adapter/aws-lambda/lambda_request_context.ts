//ff:type feature=adapter type=adapter
//ff:what Lambda request context
import type { Context } from '../../context'
import type { GetConnInfo } from '../../helper/conninfo'
import type {
  ApiGatewayRequestContext,
  ApiGatewayRequestContextV2,
  ALBRequestContext,
} from './types'

export type LambdaRequestContext =
  | ApiGatewayRequestContext
  | ApiGatewayRequestContextV2
  | ALBRequestContext
