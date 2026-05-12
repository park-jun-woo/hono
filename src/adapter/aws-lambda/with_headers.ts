//ff:type feature=adapter type=adapter
//ff:what With headers
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

export type WithHeaders = {
  headers: Record<string, string>
  multiValueHeaders?: undefined
}
