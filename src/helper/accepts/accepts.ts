//ff:type feature=helper type=model
//ff:what Accepts
import type { Context } from '../../context'
import { parseAccept } from '../../utils/accept'
import type { AcceptHeader } from '../../utils/headers'
import type { Accept } from './accept.js'
import type { acceptsConfig } from './accepts_config.js'

export type { Accept } from './accept.js'
export type { acceptsConfig } from './accepts_config.js'


export interface acceptsOptions extends acceptsConfig {
  match?: (accepts: Accept[], config: acceptsConfig) => string
}

export const defaultMatch = (accepts: Accept[], config: acceptsConfig): string => {
  const { supports, default: defaultSupport } = config
  const accept = accepts.sort((a, b) => b.q - a.q).find((accept) => supports.includes(accept.type))
  return accept ? accept.type : defaultSupport
}

/**
 * Match the accept header with the given options.
 * @example
 * ```ts
 * app.get('/users', (c) => {
 *   const lang = accepts(c, {
 *     header: 'Accept-Language',
 *     supports: ['en', 'zh'],
 *     default: 'en',
 *   })
 * })
 * ```
 */
export const accepts = (c: Context, options: acceptsOptions): string => {
  const acceptHeader = c.req.header(options.header)
  if (!acceptHeader) {
    return options.default
  }
  const accepts = parseAccept(acceptHeader)
  const match = options.match || defaultMatch

  return match(accepts, options)
}
