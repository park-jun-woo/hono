//ff:type feature=jsx type=model
//ff:what React element
import type { Child, JSXNode } from './base'
import type { JSX } from './intrinsic-elements'

/**
 * React types
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ReactElement<P = any, T = string | Function> = JSXNode & {
  type: T
  props: P
  key: string | null
}
