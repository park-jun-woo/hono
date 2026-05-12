//ff:type feature=adapter type=adapter
//ff:what Cloud front response
import crypto from 'node:crypto'
import type { Hono } from '../../hono'
import { decodeBase64, encodeBase64 } from '../../utils/encode'
import type { CloudFrontHeaders } from './cloud_front_headers.js'

export interface CloudFrontResponse {
  headers: CloudFrontHeaders
  status: string
  statusDescription?: string
}
