//ff:type feature=helper type=model
//ff:what Css variable array type
import type { CssVariableBasicType } from './css_variable_basic_type.js'
import type { CssVariableAsyncType } from './css_variable_async_type.js'

export type CssVariableArrayType = (CssVariableBasicType | CssVariableAsyncType)[]
