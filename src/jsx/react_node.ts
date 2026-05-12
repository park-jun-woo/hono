//ff:type feature=jsx type=model
//ff:what React node
import type { Child, JSXNode } from './base'
import type { JSX } from './intrinsic-elements'
import type { ReactElement } from './react_element.js'

type ReactNode = ReactElement | string | number | boolean | null | undefined
