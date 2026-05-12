//ff:type feature=utils type=model
//ff:what Partitioned cookie constraint
import { decodeURIComponent_, tryDecode } from './url'

export type PartitionedCookieConstraint =
  | { partitioned: true; secure: true }
  | { partitioned?: boolean; secure?: boolean }
