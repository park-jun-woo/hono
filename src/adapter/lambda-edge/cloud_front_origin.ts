//ff:type feature=adapter type=adapter
//ff:what Cloud front origin
import crypto from 'node:crypto'
import type { Hono } from '../../hono'
import { decodeBase64, encodeBase64 } from '../../utils/encode'
import type { CloudFrontCustomOrigin } from './cloud_front_custom_origin.js'
import type { CloudFrontS3Origin } from './cloud_front_s3_origin.js'

export type CloudFrontOrigin =
  | { s3: CloudFrontS3Origin; custom?: never }
  | { custom: CloudFrontCustomOrigin; s3?: never }
