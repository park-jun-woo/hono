//ff:type feature=adapter type=adapter
//ff:what Netlify context
import type { Context } from '../../context'
import type { GetConnInfo } from '../../helper/conninfo'

/**
 * Netlify context type
 * @see https://docs.netlify.com/functions/api/
 */
export type NetlifyContext = {
  ip?: string
  geo?: {
    city?: string
    country?: {
      code?: string
      name?: string
    }
    subdivision?: {
      code?: string
      name?: string
    }
    latitude?: number
    longitude?: number
    timezone?: string
    postalCode?: string
  }
  requestId?: string
}
