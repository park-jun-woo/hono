//ff:type feature=adapter type=adapter
//ff:what Cloud front headers
import crypto from 'node:crypto'
import type { Hono } from '../../hono'
import { decodeBase64, encodeBase64 } from '../../utils/encode'
import type { CloudFrontHeader } from './cloud_front_header.js'

export interface CloudFrontHeaders {
  [name: string]: CloudFrontHeader[]
}
