//ff:type feature=utils type=model
//ff:what Host cookie constraint
import { decodeURIComponent_, tryDecode } from './url'

export type HostCookieConstraint = { secure: true; path: '/'; domain?: undefined }
