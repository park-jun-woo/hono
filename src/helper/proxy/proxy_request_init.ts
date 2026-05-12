//ff:type feature=helper type=model
//ff:what Proxy request init
import { HTTPException } from '../../http-exception'
import type { RequestHeader } from '../../utils/headers'

export interface ProxyRequestInit extends Omit<RequestInit, 'headers'> {
  raw?: Request
  headers?:
    | HeadersInit
    | [string, string][]
    | Record<RequestHeader, string | undefined>
    | Record<string, string | undefined>
  customFetch?: (request: Request) => Promise<Response>
  /**
   * Enable strict RFC 9110 compliance for Connection header processing.
   *
   * - `false` (default): Ignores Connection header to prevent potential
   *   Hop-by-Hop Header Injection attacks. Recommended for untrusted clients.
   * - `true`: Processes Connection header per RFC 9110 and removes listed headers.
   *   Only use in trusted environments.
   *
   * @default false
   * @see https://datatracker.ietf.org/doc/html/rfc9110#section-7.6.1
   */
  strictConnectionProcessing?: boolean
}
