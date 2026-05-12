//ff:type feature=adapter type=adapter
//ff:what Cloud front context
import crypto from 'node:crypto'
import type { Hono } from '../../hono'
import { decodeBase64, encodeBase64 } from '../../utils/encode'

export type CloudFrontContext = {}
