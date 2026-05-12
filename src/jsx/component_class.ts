//ff:type feature=jsx type=model
//ff:what Component class
import type { Child, JSXNode } from './base'
import type { JSX } from './intrinsic-elements'

type ComponentClass<_P = {}, _S = {}> = unknown
