//ff:type feature=adapter type=adapter
//ff:what Lambda event
import type { Hono } from '../../hono'
import type { Env, Schema } from '../../types'
import { decodeBase64, encodeBase64 } from '../../utils/encode'
import type {
  ALBRequestContext,
  ApiGatewayRequestContext,
  ApiGatewayRequestContextV2,
  Handler,
  LambdaContext,
  LatticeRequestContextV2,
} from './types'
import type { LatticeProxyEventV2 } from './lattice_proxy_event_v2.js'
import type { APIGatewayProxyEventV2 } from './api_gateway_proxy_event_v2.js'
import type { APIGatewayProxyEvent } from './api_gateway_proxy_event.js'
import type { ALBProxyEvent } from './alb_proxy_event.js'

export type LambdaEvent =
  | APIGatewayProxyEvent
  | APIGatewayProxyEventV2
  | ALBProxyEvent
  | LatticeProxyEventV2
