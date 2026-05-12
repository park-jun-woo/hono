//ff:type feature=core type=model
//ff:what New response
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
 * Interface for creating a new response.
 */
export interface NewResponse {
  (data: Data | null, status?: StatusCode, headers?: HeaderRecord): Response
  (data: Data | null, init?: ResponseOrInit): Response
}
