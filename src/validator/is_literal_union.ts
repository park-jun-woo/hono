//ff:type feature=validator type=model
//ff:what Is literal union
import type { FormValue, ParsedFormValue, ValidationTargets } from '../types'
import type { UnionToIntersection } from '../utils/types'

/**
 * Checks if T is a literal union type (e.g., 'asc' | 'desc')
 * that should be preserved in input types.
 * Returns true for union literals, false for single literals or wide types.
 */
export type IsLiteralUnion<T, Base> = [Exclude<T, undefined>] extends [Base]
  ? [Exclude<T, undefined>] extends [UnionToIntersection<Exclude<T, undefined>>]
    ? false
    : true
  : false
