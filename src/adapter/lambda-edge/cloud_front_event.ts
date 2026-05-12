//ff:type feature=adapter type=adapter
//ff:what Cloud front event
import crypto from 'node:crypto'
import type { Hono } from '../../hono'
import { decodeBase64, encodeBase64 } from '../../utils/encode'
import type { CloudFrontRequest } from './cloud_front_request.js'
import type { CloudFrontResponse } from './cloud_front_response.js'
import type { CloudFrontConfig } from './cloud_front_config.js'

export interface CloudFrontEvent {
  cf: {
    config: CloudFrontConfig
    request: CloudFrontRequest
    response?: CloudFrontResponse
  }
}
