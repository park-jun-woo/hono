//ff:type feature=adapter type=adapter
//ff:what Cloud front request
import crypto from 'node:crypto'
import type { Hono } from '../../hono'
import { decodeBase64, encodeBase64 } from '../../utils/encode'
import type { CloudFrontOrigin } from './cloud_front_origin.js'
import type { CloudFrontHeaders } from './cloud_front_headers.js'

export interface CloudFrontRequest {
  clientIp: string
  headers: CloudFrontHeaders
  method: string
  querystring: string
  uri: string
  body?: {
    inputTruncated: boolean
    action: string
    encoding: string
    data: string
  }
  origin?: CloudFrontOrigin
}
