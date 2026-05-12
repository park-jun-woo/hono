//ff:type feature=core type=model
//ff:what Html respond
import { HonoRequest } from './request'
import type { Result } from './router'
import type {
  Env,
  FetchEventLike,
  H,
  Input,
  NotFoundHandler,
  RouterRoute,
  TypedResponse,
} from './types'
import type { ResponseHeader } from './utils/headers'
import { HtmlEscapedCallbackPhase, resolveCallback } from './utils/html'
import type { ContentfulStatusCode, RedirectStatusCode, StatusCode } from './utils/http-status'
import type { BaseMime } from './utils/mime'
import type { InvalidJSONValue, IsAny, JSONParsed, JSONValue } from './utils/types'
import type { HeaderRecord } from './header_record.js'
import type { ResponseOrInit } from './response_or_init.js'

/**
 * Interface representing a function that responds with HTML content.
 *
 * @param html - The HTML content to respond with, which can be a string or a Promise that resolves to a string.
 * @param status - (Optional) The HTTP status code for the response.
 * @param headers - (Optional) A record of headers to include in the response.
 * @param init - (Optional) The response initialization object.
 *
 * @returns A Response object or a Promise that resolves to a Response object.
 */
export interface HTMLRespond {
  <T extends string | Promise<string>>(
    html: T,
    status?: ContentfulStatusCode,
    headers?: HeaderRecord
  ): T extends string ? Response : Promise<Response>
  <T extends string | Promise<string>>(
    html: T,
    init?: ResponseOrInit<ContentfulStatusCode>
  ): T extends string ? Response : Promise<Response>
}
