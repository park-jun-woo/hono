//ff:type feature=adapter type=adapter
//ff:what Cloud front s3 origin
import crypto from 'node:crypto'
import type { Hono } from '../../hono'
import { decodeBase64, encodeBase64 } from '../../utils/encode'
import type { CloudFrontHeaders } from './cloud_front_headers.js'

// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html
export interface CloudFrontS3Origin {
  authMethod: 'origin-access-identity' | 'none'
  customHeaders: CloudFrontHeaders
  domainName: string
  path: string
  region: string
}
