//ff:type feature=core type=model
//ff:what Text respond
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
 * Interface for responding with text.
 *
 * @interface TextRespond
 * @template T - The type of the text content.
 * @template U - The type of the status code.
 *
 * @param {T} text - The text content to be included in the response.
 * @param {U} [status] - An optional status code for the response.
 * @param {HeaderRecord} [headers] - An optional record of headers to include in the response.
 *
 * @returns {Response & TypedResponse<T, U, 'text'>} - The response after rendering the text content, typed with the provided text and status code types.
 */
export interface TextRespond {
  <T extends string, U extends ContentfulStatusCode = ContentfulStatusCode>(
    text: T,
    status?: U,
    headers?: HeaderRecord
  ): Response & TypedResponse<T, U, 'text'>
  <T extends string, U extends ContentfulStatusCode = ContentfulStatusCode>(
    text: T,
    init?: ResponseOrInit<U>
  ): Response & TypedResponse<T, U, 'text'>
}
