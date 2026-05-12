//ff:type feature=adapter type=adapter
//ff:what Handler
import crypto from 'node:crypto'
import type { Hono } from '../../hono'

import { decodeBase64, encodeBase64 } from '../../utils/encode'
import type { CloudFrontHeaders } from './cloud_front_headers.js'
import type { CloudFrontContext } from './cloud_front_context.js'
import type { CloudFrontRequest } from './cloud_front_request.js'
import type { CloudFrontEdgeEvent } from './cloud_front_edge_event.js'
import type { Callback } from './callback.js'

export type { CloudFrontOrigin } from './cloud_front_origin.js'
export type { CloudFrontContext } from './cloud_front_context.js'
export type { CloudFrontHeader } from './cloud_front_header.js'
export type { CloudFrontHeaders } from './cloud_front_headers.js'
export type { CloudFrontCustomOrigin } from './cloud_front_custom_origin.js'
export type { CloudFrontS3Origin } from './cloud_front_s3_origin.js'
export type { CloudFrontRequest } from './cloud_front_request.js'
export type { CloudFrontResponse } from './cloud_front_response.js'
export type { CloudFrontConfig } from './cloud_front_config.js'
export type { CloudFrontEvent } from './cloud_front_event.js'
export type { CloudFrontEdgeEvent } from './cloud_front_edge_event.js'
export type { Callback } from './callback.js'


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
globalThis.crypto ??= crypto
// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html
// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-generating-http-responses-in-requests.html#lambda-generating-http-responses-programming-model
export interface CloudFrontResult {
  status: string
  statusDescription?: string
  headers?: {
    [header: string]: {
      key: string
      value: string
    }[]
  }
  body?: string
  bodyEncoding?: 'text' | 'base64'
}

/**
 * Accepts events from 'Lambda@Edge' event
 * https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html
 */
const convertHeaders = (headers: Headers): CloudFrontHeaders => {
  const cfHeaders: CloudFrontHeaders = {}
  headers.forEach((value, key) => {
    cfHeaders[key.toLowerCase()] = [
      ...(cfHeaders[key.toLowerCase()] || []),
      { key: key.toLowerCase(), value },
    ]
  })
  return cfHeaders
}

export const handle = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app: Hono<any>
): ((
  event: CloudFrontEdgeEvent,
  context?: CloudFrontContext,
  callback?: Callback
) => Promise<CloudFrontResult>) => {
  return async (event, ...args: [context?: CloudFrontContext, callback?: Callback]) => {
    const [context, callback] = args
    const res = await app.fetch(createRequest(event), {
      event,
      context,
      callback: (err: Error | null, result?: CloudFrontResult | CloudFrontRequest) => {
        callback?.(err, result)
      },
      config: event.Records[0].cf.config,
      request: event.Records[0].cf.request,
      response: event.Records[0].cf.response,
    })
    return createResult(res)
  }
}

const createResult = async (res: Response): Promise<CloudFrontResult> => {
  const isBase64Encoded = isContentTypeBinary(res.headers.get('content-type') || '')
  const body = isBase64Encoded ? encodeBase64(await res.arrayBuffer()) : await res.text()

  return {
    status: res.status.toString(),
    headers: convertHeaders(res.headers),
    body,
    ...(isBase64Encoded && { bodyEncoding: 'base64' }),
  }
}

const createRequest = (event: CloudFrontEdgeEvent): Request => {
  const queryString = event.Records[0].cf.request.querystring
  const host =
    event.Records[0].cf.request.headers?.host?.[0]?.value ||
    event.Records[0].cf.config.distributionDomainName
  const urlPath = `https://${host}${event.Records[0].cf.request.uri}`
  const url = queryString ? `${urlPath}?${queryString}` : urlPath

  const headers = new Headers()
  Object.entries(event.Records[0].cf.request.headers).forEach(([k, v]) => {
    v.forEach((header) => headers.set(k, header.value))
  })

  const requestBody = event.Records[0].cf.request.body
  const method = event.Records[0].cf.request.method
  const body = createBody(method, requestBody)

  return new Request(url, {
    headers,
    method,
    body,
  })
}

export const createBody = (
  method: string,
  requestBody: CloudFrontRequest['body']
): string | Uint8Array<ArrayBuffer> | undefined => {
  if (!requestBody || !requestBody.data) {
    return undefined
  }
  if (method === 'GET' || method === 'HEAD') {
    return undefined
  }
  if (requestBody.encoding === 'base64') {
    return decodeBase64(requestBody.data)
  }
  return requestBody.data
}

export const isContentTypeBinary = (contentType: string): boolean => {
  return !/^(text\/(plain|html|css|javascript|csv).*|application\/(.*json|.*xml).*|image\/svg\+xml.*)$/.test(
    contentType
  )
}
