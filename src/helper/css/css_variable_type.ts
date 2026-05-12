//ff:type feature=helper type=model
//ff:what Css variable type
import type { CssVariableBasicType } from './css_variable_basic_type.js'
import type { CssVariableAsyncType } from './css_variable_async_type.js'
import type { CssVariableArrayType } from './css_variable_array_type.js'

export type CssVariableType = CssVariableBasicType | CssVariableAsyncType | CssVariableArrayType
