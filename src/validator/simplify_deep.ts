//ff:type feature=validator type=model
//ff:what Simplify deep
import type { FormValue, ParsedFormValue, ValidationTargets } from '../types'
import type { UnionToIntersection } from '../utils/types'

// Helper to force TypeScript to expand type aliases
export type SimplifyDeep<T> = { [K in keyof T]: T[K] } & {}
