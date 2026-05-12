//ff:type feature=adapter type=adapter
//ff:what Lattice proxy event v2
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

export interface LatticeProxyEventV2 {
  version: string
  path: string
  method: string
  headers: Record<string, string[] | undefined>
  queryStringParameters: Record<string, string[] | undefined>
  body: string | null
  isBase64Encoded: boolean
  requestContext: LatticeRequestContextV2
}
