//ff:type feature=validator type=model
//ff:what Utils
import type { FormValue, ParsedFormValue, ValidationTargets } from '../types'
import type { UnionToIntersection } from '../utils/types'
import type { SimplifyDeep } from './simplify_deep.js'
import type { InferInputInner } from './infer_input_inner.js'

export type { IsLiteralUnion } from './is_literal_union.js'
export type { IsOptionalUnion } from './is_optional_union.js'
export type { SimplifyDeep } from './simplify_deep.js'
export type { InferInputInner } from './infer_input_inner.js'

// Check if type is an optional union (T | undefined) but not unknown/any
// Helper to force TypeScript to expand type aliases
/**
 * Utility type to infer input types for validation targets.
 * Preserves literal union types (e.g., 'asc' | 'desc') while using
 * the default ValidationTargets type for other values.
 *
 * @example
 * ```ts
 * // In @hono/zod-validator or similar:
 * type Input = InferInput<z.input<Schema>, 'query'>
 * // { orderBy: 'asc' | 'desc', page: string | string[] }
 * ```
 */
export type InferInput<
  Output,
  Target extends keyof ValidationTargets,
  T extends FormValue = ParsedFormValue,
> = [Exclude<Output, undefined>] extends [never]
  ? {}
  : [Exclude<Output, undefined>] extends [object]
    ? undefined extends Output
      ? SimplifyDeep<InferInputInner<Exclude<Output, undefined>, Target, T>> | undefined
      : SimplifyDeep<InferInputInner<Output, Target, T>>
    : {}
