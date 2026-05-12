//ff:type feature=utils type=model
//ff:what Headers


export type { RequestHeader } from './request_header.js'
export type { ResponseHeader } from './response_header.js'
export type { AcceptHeader } from './accept_header.js'

// note: `X-${string}` is deprecated
export type CustomHeader = string & {}
