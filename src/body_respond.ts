//ff:type feature=core type=model
//ff:what Body respond
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
import type { Data } from './data.js'
import type { ResponseOrInit } from './response_or_init.js'

/**
 * Interface for responding with a body.
 */
export interface BodyRespond {
  // if we return content, only allow the status codes that allow for returning the body
  <T extends Data, U extends ContentfulStatusCode>(
    data: T,
    status?: U,
    headers?: HeaderRecord
  ): Response & TypedResponse<T, U, 'body'>
  <T extends Data, U extends ContentfulStatusCode>(
    data: T,
    init?: ResponseOrInit<U>
  ): Response & TypedResponse<T, U, 'body'>
  <T extends null, U extends StatusCode>(
    data: T,
    status?: U,
    headers?: HeaderRecord
  ): Response & TypedResponse<null, U, 'body'>
  <T extends null, U extends StatusCode>(
    data: T,
    init?: ResponseOrInit<U>
  ): Response & TypedResponse<null, U, 'body'>
}
