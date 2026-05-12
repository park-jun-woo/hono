//ff:type feature=core type=model
//ff:what Http exception options
import type { ContentfulStatusCode } from './utils/http-status'

/**
 * Options for creating an `HTTPException`.
 * @property res - Optional response object to use.
 * @property message - Optional custom error message.
 * @property cause - Optional cause of the error.
 */
export type HTTPExceptionOptions = {
  res?: Response
  message?: string
  cause?: unknown
}
