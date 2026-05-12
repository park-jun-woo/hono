//ff:type feature=utils type=model
//ff:what Signed cookie
import { decodeURIComponent_, tryDecode } from './url'

export type SignedCookie = Record<string, string | false>
