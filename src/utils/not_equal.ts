//ff:type feature=utils type=model
//ff:what Not equal
import type { Equal } from './equal.js'

export type NotEqual<X, Y> = true extends Equal<X, Y> ? false : true
