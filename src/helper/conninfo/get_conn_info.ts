//ff:type feature=helper type=model
//ff:what Get conn info
import type { Context } from '../../context'
import type { ConnInfo } from './types.js'

/**
 * Helper type
 */
export type GetConnInfo = (c: Context) => ConnInfo
