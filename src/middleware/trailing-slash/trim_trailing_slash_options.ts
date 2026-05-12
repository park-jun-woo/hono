//ff:type feature=middleware type=handler
//ff:what Trim trailing slash options
import type { MiddlewareHandler } from '../../types'

export type TrimTrailingSlashOptions = {
  /**
   * If `true`, the middleware will always redirect requests with a trailing slash
   * before executing handlers.
   * This is useful for routes with wildcards (`*`).
   * If `false` (default), it will only redirect when the route is not found (404).
   * @default false
   */
  alwaysRedirect?: boolean
}
