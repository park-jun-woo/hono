//ff:type feature=jsx type=model
//ff:what Props with children
import type { Child, JSXNode } from './base'
import type { JSX } from './intrinsic-elements'

export type PropsWithChildren<P = unknown> = P & { children?: Child | undefined }
