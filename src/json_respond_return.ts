//ff:type feature=core type=model
//ff:what Json respond return
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

/**
 * @template T - The type of the JSON value or simplified unknown type.
 * @template U - The type of the status code.
 *
 * @returns {Response & TypedResponse<JSONParsed<T>, U, 'json'>} - The response after rendering the JSON object, typed with the provided object and status code types.
 */
export type JSONRespondReturn<
  T extends JSONValue | {} | InvalidJSONValue,
  U extends ContentfulStatusCode,
> = Response & TypedResponse<JSONParsed<T>, U, 'json'>
