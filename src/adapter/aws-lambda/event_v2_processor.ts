//ff:type feature=adapter type=adapter
//ff:what Event v2 processor
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
import type { APIGatewayProxyEventV2 } from './api_gateway_proxy_event_v2.js'
import { EventProcessor } from './event_processor.js'

const setHeadersFromRecord = (headers: Headers, record: Record<string, string | undefined>): void => {
  for (const [k, v] of Object.entries(record)) {
    if (v) {
      headers.set(k, v)
    }
  }
}

export class EventV2Processor extends EventProcessor<APIGatewayProxyEventV2> {
  protected getPath(event: APIGatewayProxyEventV2): string {
    return event.rawPath
  }

  protected getMethod(event: APIGatewayProxyEventV2): string {
    return event.requestContext.http.method
  }

  protected getQueryString(event: APIGatewayProxyEventV2): string {
    return event.rawQueryString
  }

  protected getCookies(event: APIGatewayProxyEventV2, headers: Headers): void {
    if (Array.isArray(event.cookies)) {
      headers.set('Cookie', event.cookies.join('; '))
    }
  }

  protected setCookiesToResult(result: APIGatewayProxyResult, cookies: string[]): void {
    result.cookies = cookies
  }

  protected getHeaders(event: APIGatewayProxyEventV2): Headers {
    const headers = new Headers()
    this.getCookies(event, headers)
    if (event.headers) {
      setHeadersFromRecord(headers, event.headers)
    }
    return headers
  }
}
