//ff:type feature=adapter type=adapter
//ff:what Cloud front edge event
import crypto from 'node:crypto'
import type { Hono } from '../../hono'
import { decodeBase64, encodeBase64 } from '../../utils/encode'
import type { CloudFrontEvent } from './cloud_front_event.js'

export interface CloudFrontEdgeEvent {
  Records: CloudFrontEvent[]
}
