//ff:type feature=core type=model
//ff:what Context options
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
import type { ExecutionContext } from './execution_context.js'

/**
 * Options for configuring the context.
 *
 * @template E - Environment type.
 */
export type ContextOptions<E extends Env> = {
  /**
   * Bindings for the environment.
   */
  env: E['Bindings']
  /**
   * Execution context for the request.
   */
  executionCtx?: FetchEventLike | ExecutionContext | undefined
  /**
   * Handler for not found responses.
   */
  notFoundHandler?: NotFoundHandler<E>
  matchResult?: Result<[H, RouterRoute]>
  path?: string
}
