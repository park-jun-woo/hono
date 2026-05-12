//ff:type feature=core type=model
//ff:what Renderer
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
import type { ContextRenderer } from './context_renderer.js'
import type { DefaultRenderer } from './default_renderer.js'

/**
 * Renderer type which can either be a ContextRenderer or DefaultRenderer.
 */
export type Renderer = ContextRenderer extends Function ? ContextRenderer : DefaultRenderer
