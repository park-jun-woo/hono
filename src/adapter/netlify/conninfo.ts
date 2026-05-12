//ff:type feature=adapter type=adapter
//ff:what Conninfo
import type { Context } from '../../context'
import type { GetConnInfo } from '../../helper/conninfo'
import type { NetlifyContext } from './netlify_context.js'

export type { NetlifyContext } from './netlify_context.js'

type Env = {
  Bindings: {
    context: NetlifyContext
  }
}

/**
 * Get connection information from Netlify
 * @param c - Context
 * @returns Connection information including remote address
 * @example
 * ```ts
 * import { Hono } from 'hono'
 * import { handle, getConnInfo } from 'hono/netlify'
 *
 * const app = new Hono()
 *
 * app.get('/', (c) => {
 *   const info = getConnInfo(c)
 *   return c.text(`Your IP: ${info.remote.address}`)
 * })
 *
 * export default handle(app)
 * ```
 */
export const getConnInfo: GetConnInfo = (c: Context<Env>) => ({
  remote: {
    address: c.env.context?.ip,
  },
})
