//ff:type feature=middleware type=handler
//ff:what Get ip addr
import type { Context, MiddlewareHandler } from '../..'
import type { AddressType, GetConnInfo } from '../../helper/conninfo'
import { HTTPException } from '../../http-exception'
import {
  convertIPv4MappedIPv6ToIPv4,
  convertIPv4ToBinary,
  convertIPv6BinaryToString,
  convertIPv6ToBinary,
  distinctRemoteAddr,
  isIPv4MappedIPv6,
} from '../../utils/ipaddr'

/**
 * Function to get IP Address
 */
export type GetIPAddr = GetConnInfo | ((c: Context) => string)
