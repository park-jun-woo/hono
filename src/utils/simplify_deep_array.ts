//ff:type feature=utils type=model
//ff:what Simplify deep array
import type { Simplify } from './simplify.js'

/**
 * A simple extension of Simplify that will deeply traverse array elements.
 */
export type SimplifyDeepArray<T> = T extends any[]
  ? { [E in keyof T]: SimplifyDeepArray<T[E]> }
  : Simplify<T>
