//ff:type feature=core type=model
//ff:what Set headers
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
import type { SetHeadersOptions } from './set_headers_options.js'

export interface SetHeaders {
  (name: 'Content-Type', value?: BaseMime, options?: SetHeadersOptions): void
  (name: ResponseHeader, value?: string, options?: SetHeadersOptions): void
  (name: string, value?: string, options?: SetHeadersOptions): void
}
