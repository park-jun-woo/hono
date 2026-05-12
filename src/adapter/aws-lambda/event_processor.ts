//ff:type feature=adapter type=adapter
//ff:what Event processor
import type { Hono } from '../../hono'
import type { Env, Schema } from '../../types'
import { decodeBase64, encodeBase64 } from '../../utils/encode'
import type {
  ALBRequestContext,
  ApiGatewayRequestContext,
  ApiGatewayRequestContextV2,
  Handler,
  LambdaContext,
  LatticeRequestContextV2,
} from './types'
import type { LambdaEvent } from './lambda_event.js'
import type { APIGatewayProxyResult } from './api_gateway_proxy_result.js'
import type { HandleOptions } from './handle_options.js'
import { defaultIsContentTypeBinary } from './handler.js'
import { isContentEncodingBinary } from './handler.js'

export abstract class EventProcessor<E extends LambdaEvent> {
  protected abstract getPath(event: E): string

  protected abstract getMethod(event: E): string

  protected abstract getQueryString(event: E): string

  protected abstract getHeaders(event: E): Headers

  protected abstract getCookies(event: E, headers: Headers): void

  protected abstract setCookiesToResult(result: APIGatewayProxyResult, cookies: string[]): void

  protected getHeaderValue(headers: E['headers'], key: string): string | undefined {
    const value = headers
      ? Array.isArray(headers[key])
        ? headers[key][0]
        : headers[key]
      : undefined

    return value
  }

  protected getDomainName(event: E): string | undefined {
    if (event.requestContext && 'domainName' in event.requestContext) {
      return event.requestContext.domainName
    }

    const hostFromHeaders = this.getHeaderValue(event.headers, 'host')

    if (hostFromHeaders) {
      return hostFromHeaders
    }

    const multiValueHeaders = 'multiValueHeaders' in event ? event.multiValueHeaders : {}
    const hostFromMultiValueHeaders = this.getHeaderValue(multiValueHeaders, 'host')

    return hostFromMultiValueHeaders
  }

  createRequest(event: E): Request {
    const queryString = this.getQueryString(event)
    const domainName = this.getDomainName(event)
    const path = this.getPath(event)
    const urlPath = `https://${domainName}${path}`
    const url = queryString ? `${urlPath}?${queryString}` : urlPath

    const headers = this.getHeaders(event)

    const method = this.getMethod(event)
    const requestInit: RequestInit = {
      headers,
      method,
    }

    if (event.body) {
      requestInit.body = event.isBase64Encoded ? decodeBase64(event.body) : event.body
    }

    return new Request(url, requestInit)
  }

  async createResult(
    event: E,
    res: Response,
    options: Pick<HandleOptions, 'isContentTypeBinary'>
  ): Promise<APIGatewayProxyResult> {
    // determine whether the response body should be base64 encoded
    const contentType = res.headers.get('content-type')
    const isContentTypeBinary = options.isContentTypeBinary ?? defaultIsContentTypeBinary // overwrite default function if provided
    let isBase64Encoded = contentType && isContentTypeBinary(contentType) ? true : false

    if (!isBase64Encoded) {
      const contentEncoding = res.headers.get('content-encoding')
      isBase64Encoded = isContentEncodingBinary(contentEncoding)
    }

    const body = isBase64Encoded ? encodeBase64(await res.arrayBuffer()) : await res.text()

    const result: APIGatewayProxyResult = {
      body: body,
      statusCode: res.status,
      isBase64Encoded,
      ...('multiValueHeaders' in event && event.multiValueHeaders
        ? {
            multiValueHeaders: {},
          }
        : {
            headers: {},
          }),
    }

    this.setCookies(event, res, result)
    if (result.multiValueHeaders) {
      res.headers.forEach((value, key) => {
        result.multiValueHeaders[key] = [value]
      })
    } else {
      res.headers.forEach((value, key) => {
        result.headers[key] = value
      })
    }

    return result
  }

  setCookies(_event: E, res: Response, result: APIGatewayProxyResult) {
    if (res.headers.has('set-cookie')) {
      const cookies = res.headers.getSetCookie
        ? res.headers.getSetCookie()
        : Array.from(res.headers.entries())
            .filter(([k]) => k === 'set-cookie')
            .map(([, v]) => v)

      if (Array.isArray(cookies)) {
        this.setCookiesToResult(result, cookies)
        res.headers.delete('set-cookie')
      }
    }
  }
}
