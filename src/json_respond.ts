//ff:type feature=core type=model
//ff:what Json respond
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
import type { JSONRespondReturn } from './json_respond_return.js'
import type { ResponseOrInit } from './response_or_init.js'

/**
 * Interface for responding with JSON.
 *
 * @interface JSONRespond
 * @template T - The type of the JSON value or simplified unknown type.
 * @template U - The type of the status code.
 *
 * @param {T} object - The JSON object to be included in the response.
 * @param {U} [status] - An optional status code for the response.
 * @param {HeaderRecord} [headers] - An optional record of headers to include in the response.
 *
 * @returns {JSONRespondReturn<T, U>} - The response after rendering the JSON object, typed with the provided object and status code types.
 */
export interface JSONRespond {
  <
    T extends JSONValue | {} | InvalidJSONValue,
    U extends ContentfulStatusCode = ContentfulStatusCode,
  >(
    object: T,
    status?: U,
    headers?: HeaderRecord
  ): JSONRespondReturn<T, U>
  <
    T extends JSONValue | {} | InvalidJSONValue,
    U extends ContentfulStatusCode = ContentfulStatusCode,
  >(
    object: T,
    init?: ResponseOrInit<U>
  ): JSONRespondReturn<T, U>
}
