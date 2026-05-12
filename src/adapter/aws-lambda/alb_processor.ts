//ff:type feature=adapter type=adapter
//ff:what Alb processor
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
import type { ALBProxyEvent } from './alb_proxy_event.js'
import { EventProcessor } from './event_processor.js'
import { sanitizeHeaderValue } from './handler.js'

const setMultiValueHeaders = (headers: Headers, record: Record<string, string[] | undefined>): void => {
  for (const [key, values] of Object.entries(record)) {
    if (values && Array.isArray(values)) {
      headers.set(key, sanitizeHeaderValue(values.join('; ')))
    }
  }
}

const setSingleValueHeaders = (headers: Headers, record: Record<string, string | undefined>): void => {
  for (const [key, value] of Object.entries(record)) {
    if (value) {
      headers.set(key, sanitizeHeaderValue(value))
    }
  }
}

export class ALBProcessor extends EventProcessor<ALBProxyEvent> {
  protected getHeaders(event: ALBProxyEvent): Headers {
    const headers = new Headers()
    if (event.multiValueHeaders) {
      setMultiValueHeaders(headers, event.multiValueHeaders)
    } else {
      setSingleValueHeaders(headers, event.headers ?? {})
    }
    return headers
  }

  protected getPath(event: ALBProxyEvent): string {
    return event.path
  }

  protected getMethod(event: ALBProxyEvent): string {
    return event.httpMethod
  }

  protected getQueryString(event: ALBProxyEvent): string {
    // In the case of ALB Integration either queryStringParameters or multiValueQueryStringParameters can be present not both
    /*
      In other cases like when using the serverless framework, the event object does contain both queryStringParameters and multiValueQueryStringParameters:
      Below is an example event object for this URL: /payment/b8c55e69?select=amount&select=currency
      {
        ...
        queryStringParameters: { select: 'currency' },
        multiValueQueryStringParameters: { select: [ 'amount', 'currency' ] },
      }
      The expected results is for select to be an array with two items. However the pre-fix code is only returning one item ('currency') in the array.
      A simple fix would be to invert the if statement and check the multiValueQueryStringParameters first.
    */
    if (event.multiValueQueryStringParameters) {
      return Object.entries(event.multiValueQueryStringParameters || {})
        .filter(([, value]) => value)
        .map(([key, value]) => `${key}=${value.join(`&${key}=`)}`)
        .join('&')
    } else {
      return Object.entries(event.queryStringParameters || {})
        .filter(([, value]) => value)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')
    }
  }

  protected getCookies(event: ALBProxyEvent, headers: Headers): void {
    let cookie
    if (event.multiValueHeaders) {
      cookie = event.multiValueHeaders['cookie']?.join('; ')
    } else {
      cookie = event.headers ? event.headers['cookie'] : undefined
    }
    if (cookie) {
      headers.append('Cookie', cookie)
    }
  }

  protected setCookiesToResult(result: APIGatewayProxyResult, cookies: string[]): void {
    // when multi value headers is enabled
    if (result.multiValueHeaders) {
      result.multiValueHeaders['set-cookie'] = cookies
    } else {
      // otherwise serialize the set-cookie
      result.headers['set-cookie'] = cookies.join(', ')
    }
  }
}
