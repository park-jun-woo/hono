//ff:type feature=adapter type=adapter
//ff:what Callback
import crypto from 'node:crypto'
import type { Hono } from '../../hono'
import { decodeBase64, encodeBase64 } from '../../utils/encode'
import type { CloudFrontRequest } from './cloud_front_request.js'
import type { CloudFrontResult } from './handler.js'

export interface Callback {
  (err: Error | null, result?: CloudFrontRequest | CloudFrontResult): void
}
