//ff:type feature=helper type=model
//ff:what Css variable basic type
import type { CssClassName } from './css_class_name.js'
import type { CssEscapedString } from './common.js'

export type CssVariableBasicType =
  | CssClassName
  | CssEscapedString
  | string
  | number
  | boolean
  | null
  | undefined
