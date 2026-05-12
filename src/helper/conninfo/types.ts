//ff:type feature=helper type=model
//ff:what Types
import type { Context } from '../../context'
import type { NetAddrInfo } from './net_addr_info.js'

export type { AddressType } from './address_type.js'
export type { NetAddrInfo } from './net_addr_info.js'
export type { GetConnInfo } from './get_conn_info.js'


/**
 * HTTP Connection information
 */
export interface ConnInfo {
  /**
   * Remote information
   */
  remote: NetAddrInfo
}
