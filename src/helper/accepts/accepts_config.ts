//ff:type feature=helper type=model
//ff:what Accepts config
import type { Context } from '../../context'
import { parseAccept } from '../../utils/accept'
import type { AcceptHeader } from '../../utils/headers'

export interface acceptsConfig {
  header: AcceptHeader
  supports: string[]
  default: string
}
