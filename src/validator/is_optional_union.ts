//ff:type feature=validator type=model
//ff:what Is optional union
import type { FormValue, ParsedFormValue, ValidationTargets } from '../types'
import type { UnionToIntersection } from '../utils/types'

// Check if type is an optional union (T | undefined) but not unknown/any
export type IsOptionalUnion<T> = [unknown] extends [T]
  ? false // unknown or any
  : undefined extends T
    ? true
    : false
