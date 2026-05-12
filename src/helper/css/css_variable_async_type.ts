//ff:type feature=helper type=model
//ff:what Css variable async type
import type { CssVariableBasicType } from './css_variable_basic_type.js'

export type CssVariableAsyncType = Promise<CssVariableBasicType>
