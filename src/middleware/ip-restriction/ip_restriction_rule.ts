//ff:type feature=middleware type=handler
//ff:what Ip restriction rule
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

export type IPRestrictionRule = string | ((addr: { addr: string; type: AddressType }) => boolean)
