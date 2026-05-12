//ff:func feature=adapter type=adapter control=sequence
//ff:type feature=adapter type=model
//ff:what Handler
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
import type { WithHeaders } from './with_headers.js'
import type { WithMultiValueHeaders } from './with_multi_value_headers.js'
import type { APIGatewayProxyResult } from './api_gateway_proxy_result.js'
import type { HandleOptions } from './handle_options.js'
import { EventV2Processor } from './event_v2_processor.js'
import { EventV1Processor } from './event_v1_processor.js'
import { ALBProcessor } from './alb_processor.js'
import type { LatticeProxyEventV2 } from './lattice_proxy_event_v2.js'
import { EventProcessor } from './event_processor.js'
import type { ALBProxyEvent } from './alb_proxy_event.js'
import type { APIGatewayProxyEventV2 } from './api_gateway_proxy_event_v2.js'

export type { LambdaEvent } from './lambda_event.js'
export type { WithHeaders } from './with_headers.js'
export type { WithMultiValueHeaders } from './with_multi_value_headers.js'
export type { APIGatewayProxyResult } from './api_gateway_proxy_result.js'
export type { HandleOptions } from './handle_options.js'
export type { LatticeProxyEventV2 } from './lattice_proxy_event_v2.js'
export type { APIGatewayProxyEventV2 } from './api_gateway_proxy_event_v2.js'
export type { APIGatewayProxyEvent } from './api_gateway_proxy_event.js'
export type { ALBProxyEvent } from './alb_proxy_event.js'
export { EventProcessor } from './event_processor.js'
export { EventV2Processor } from './event_v2_processor.js'
export { EventV1Processor } from './event_v1_processor.js'
export { ALBProcessor } from './alb_processor.js'


const appendMultiValueHeaders = (headers: Headers, record: Record<string, string[] | undefined>): void => {
  for (const [k, values] of Object.entries(record)) {
    if (values) {
      const foundK = headers.get(k)
      values.forEach((v) => {
        const sanitizedValue = sanitizeHeaderValue(v)
        return (!foundK || !foundK.includes(sanitizedValue)) && headers.append(k, sanitizedValue)
      })
    }
  }
}

export function sanitizeHeaderValue(value: string): string {
  // Check if the value contains non-ASCII characters (char codes > 127)
  // eslint-disable-next-line no-control-regex
  const hasNonAscii = /[^\x00-\x7F]/.test(value)
  if (!hasNonAscii) {
    return value
  }
  return encodeURIComponent(value)
}

// When calling HTTP API or Lambda directly through function urls
// When calling Lambda through an API Gateway
// When calling Lambda through an Application Load Balancer
const getRequestContext = (
  event: LambdaEvent
):
  | ApiGatewayRequestContext
  | ApiGatewayRequestContextV2
  | ALBRequestContext
  | LatticeRequestContextV2 => {
  return event.requestContext
}

const streamToNodeStream = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  writer: NodeJS.WritableStream
): Promise<void> => {
  let readResult = await reader.read()
  while (!readResult.done) {
    writer.write(readResult.value)
    readResult = await reader.read()
  }
  writer.end()
}

export const streamHandle = <
  E extends Env = Env,
  S extends Schema = {},
  BasePath extends string = '/',
>(
  app: Hono<E, S, BasePath>
): Handler => {
  // @ts-expect-error awslambda is not a standard API
  return awslambda.streamifyResponse(
    async (event: LambdaEvent, responseStream: NodeJS.WritableStream, context: LambdaContext) => {
      const processor = getProcessor(event)
      try {
        const req = processor.createRequest(event)
        const requestContext = getRequestContext(event)

        const res = await app.fetch(req, {
          event,
          requestContext,
          context,
        })

        const headers: Record<string, string> = {}
        const cookies: string[] = []
        res.headers.forEach((value, name) => {
          if (name === 'set-cookie') {
            cookies.push(value)
          } else {
            headers[name] = value
          }
        })

        // Check content type
        const httpResponseMetadata = {
          statusCode: res.status,
          headers,
          cookies,
        }

        // Update response stream
        // @ts-expect-error awslambda is not a standard API
        responseStream = awslambda.HttpResponseStream.from(responseStream, httpResponseMetadata)

        if (res.body) {
          await streamToNodeStream(res.body.getReader(), responseStream)
        } else {
          responseStream.write('')
        }
      } catch (error) {
        console.error('Error processing request:', error)
        responseStream.write('Internal Server Error')
      } finally {
        responseStream.end()
      }
    }
  )
}
/**
 * Converts a Hono application to an AWS Lambda handler.
 *
 * Accepts events from API Gateway (v1 and v2), Application Load Balancer (ALB),
 * and Lambda Function URLs.
 *
 * @param app - The Hono application instance
 * @param options - Optional configuration
 * @param options.isContentTypeBinary - A function to determine if the content type is binary.
 *                                      If not provided, the default function will be used.
 * @returns Lambda handler function
 *
 * @example
 * ```js
 * import { Hono } from 'hono'
 * import { handle } from 'hono/aws-lambda'
 *
 * const app = new Hono()
 *
 * app.get('/', (c) => c.text('Hello from Lambda'))
 * app.get('/json', (c) => c.json({ message: 'Hello JSON' }))
 *
 * export const handler = handle(app)
 * ```
 *
 * @example
 * ```js
 * // With custom binary content type detection
 * import { handle, defaultIsContentTypeBinary } from 'hono/aws-lambda'
 * export const handler = handle(app, {
 *   isContentTypeBinary: (contentType) => {
 *     if (defaultIsContentTypeBinary(contentType)) {
 *       // default logic same as prior to v4.8.4
 *       return true
 *     }
 *     return contentType.startsWith('image/') || contentType === 'application/pdf'
 *   }
 * })
 * ```
 */
export const handle = <E extends Env = Env, S extends Schema = {}, BasePath extends string = '/'>(
  app: Hono<E, S, BasePath>,
  { isContentTypeBinary }: HandleOptions = { isContentTypeBinary: undefined }
): (<L extends LambdaEvent>(
  event: L,
  lambdaContext?: LambdaContext
) => Promise<
  APIGatewayProxyResult &
    (L extends { multiValueHeaders: Record<string, string[]> }
      ? WithMultiValueHeaders
      : WithHeaders)
>) => {
  // @ts-expect-error FIXME: Fix return typing
  return async (event, lambdaContext?) => {
    const processor = getProcessor(event)

    let req, requestContext
    try {
      req = processor.createRequest(event)
      requestContext = getRequestContext(event)
    } catch (error) {
      console.error('Error processing request:', error)
      const errorResponse =
        error instanceof TypeError
          ? new Response('Invalid request', { status: 400 })
          : new Response('Internal Server Error', { status: 500 })
      return processor.createResult(event, errorResponse, { isContentTypeBinary })
    }

    const res = await app.fetch(req, {
      event,
      requestContext,
      lambdaContext,
    })

    return processor.createResult(event, res, { isContentTypeBinary })
  }
}
const v2Processor: EventV2Processor = new EventV2Processor()
const v1Processor: EventV1Processor = new EventV1Processor()
const albProcessor: ALBProcessor = new ALBProcessor()

export class LatticeV2Processor extends EventProcessor<LatticeProxyEventV2> {
  protected getPath(event: LatticeProxyEventV2): string {
    return event.path
  }

  protected getMethod(event: LatticeProxyEventV2): string {
    return event.method
  }

  protected getQueryString(): string {
    return ''
  }

  protected getHeaders(event: LatticeProxyEventV2): Headers {
    const headers = new Headers()
    if (event.headers) {
      appendMultiValueHeaders(headers, event.headers)
    }
    return headers
  }

  protected getCookies(): void {
    // nop
  }

  protected setCookiesToResult(result: APIGatewayProxyResult, cookies: string[]): void {
    result.headers = {
      ...result.headers,
      'set-cookie': cookies.join(', '),
    }
  }
}

const latticeV2Processor: LatticeV2Processor = new LatticeV2Processor()

export const getProcessor = (event: LambdaEvent): EventProcessor<LambdaEvent> => {
  if (isProxyEventALB(event)) {
    return albProcessor
  }
  if (isProxyEventV2(event)) {
    return v2Processor
  }
  if (isLatticeEventV2(event)) {
    return latticeV2Processor
  }

  return v1Processor
}

const isProxyEventALB = (event: LambdaEvent): event is ALBProxyEvent => {
  if (event.requestContext) {
    return Object.hasOwn(event.requestContext, 'elb')
  }
  return false
}

const isProxyEventV2 = (event: LambdaEvent): event is APIGatewayProxyEventV2 => {
  return Object.hasOwn(event, 'rawPath')
}

const isLatticeEventV2 = (event: LambdaEvent): event is LatticeProxyEventV2 => {
  if (event.requestContext) {
    return Object.hasOwn(event.requestContext, 'serviceArn')
  }
  return false
}

/**
 * Check if the given content type is binary.
 * This is a default function and may be overwritten by the user via `isContentTypeBinary` option in handler().
 * @param contentType The content type to check.
 * @returns True if the content type is binary, false otherwise.
 */
export const defaultIsContentTypeBinary = (contentType: string): boolean => {
  return !/^text\/(?:plain|html|css|javascript|csv)|(?:\/|\+)(?:json|xml)\s*(?:;|$)/.test(
    contentType
  )
}

export const isContentEncodingBinary = (contentEncoding: string | null) => {
  if (contentEncoding === null) {
    return false
  }
  return /^(gzip|deflate|compress|br)/.test(contentEncoding)
}
