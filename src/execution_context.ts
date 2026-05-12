//ff:type feature=core type=model
//ff:what Execution context
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
 * Interface for the execution context in a web worker or similar environment.
 */
export interface ExecutionContext {
  /**
   * Extends the lifetime of the event callback until the promise is settled.
   *
   * @param promise - A promise to wait for.
   */
  waitUntil(promise: Promise<unknown>): void
  /**
   * Allows the event to be passed through to subsequent event listeners.
   */
  passThroughOnException(): void
  /**
   * For compatibility with Wrangler 4.x.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any
  /**
   * For compatibility with Wrangler 4.x.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exports?: any
}
