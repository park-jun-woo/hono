//ff:type feature=validator type=model
//ff:what Infer input inner
import type { FormValue, ParsedFormValue, ValidationTargets } from '../types'
import type { UnionToIntersection } from '../utils/types'
import type { IsLiteralUnion } from './is_literal_union.js'
import type { IsOptionalUnion } from './is_optional_union.js'
import type { SimplifyDeep } from './simplify_deep.js'

export type InferInputInner<
  Output,
  Target extends keyof ValidationTargets,
  T extends FormValue,
> = SimplifyDeep<{
  [K in keyof Output]: IsLiteralUnion<Output[K], string> extends true
    ? Output[K]
    : IsOptionalUnion<Output[K]> extends true
      ? Output[K]
      : Target extends 'form'
        ? T | T[]
        : Target extends 'query'
          ? string | string[]
          : Target extends 'param'
            ? string
            : Target extends 'header'
              ? string
              : Target extends 'cookie'
                ? string
                : unknown
}>
