//ff:type feature=adapter type=adapter
//ff:what Event v1 processor
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
import type { APIGatewayProxyResult } from './api_gateway_proxy_result.js'
import type { APIGatewayProxyEvent } from './api_gateway_proxy_event.js'
import { EventProcessor } from './event_processor.js'
import { sanitizeHeaderValue } from './handler.js'

const setHeadersFromRecord = (headers: Headers, record: Record<string, string | undefined>): void => {
  for (const [k, v] of Object.entries(record)) {
    if (v) {
      headers.set(k, sanitizeHeaderValue(v))
    }
  }
}

const appendMultiValueHeaders = (headers: Headers, multiValueHeaders: Record<string, string[] | undefined>): void => {
  for (const [k, values] of Object.entries(multiValueHeaders)) {
    if (values) {
      const foundK = headers.get(k)
      values.forEach((v) => {
        const sanitizedValue = sanitizeHeaderValue(v)
        return (!foundK || !foundK.includes(sanitizedValue)) && headers.append(k, sanitizedValue)
      })
    }
  }
}

export class EventV1Processor extends EventProcessor<APIGatewayProxyEvent> {
  protected getPath(event: APIGatewayProxyEvent): string {
    return event.path
  }

  protected getMethod(event: APIGatewayProxyEvent): string {
    return event.httpMethod
  }

  protected getQueryString(event: APIGatewayProxyEvent): string {
    // In the case of gateway Integration either queryStringParameters or multiValueQueryStringParameters can be present not both
    // API Gateway passes decoded values, so we need to re-encode them to preserve the original URL
    if (event.multiValueQueryStringParameters) {
      return Object.entries(event.multiValueQueryStringParameters || {})
        .filter(([, value]) => value)
        .map(([key, values]) =>
          values.map((value) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&')
        )
        .join('&')
    } else {
      return Object.entries(event.queryStringParameters || {})
        .filter(([, value]) => value)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value || '')}`)
        .join('&')
    }
  }

  protected getCookies(_event: APIGatewayProxyEvent, _headers: Headers): void {
    // nop
  }

  protected getHeaders(event: APIGatewayProxyEvent): Headers {
    const headers = new Headers()
    this.getCookies(event, headers)
    if (event.headers) {
      setHeadersFromRecord(headers, event.headers)
    }
    if (event.multiValueHeaders) {
      appendMultiValueHeaders(headers, event.multiValueHeaders)
    }
    return headers
  }

  protected setCookiesToResult(result: APIGatewayProxyResult, cookies: string[]): void {
    result.multiValueHeaders = {
      'set-cookie': cookies,
    }
  }
}
