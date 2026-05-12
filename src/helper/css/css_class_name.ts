//ff:type feature=helper type=model
//ff:what Css class name
import { SELECTOR } from './common.js'
import { CLASS_NAME } from './common.js'
import { STYLE_STRING } from './common.js'
import { SELECTORS } from './common.js'
import { EXTERNAL_CLASS_NAMES } from './common.js'

export interface CssClassName {
  [SELECTOR]: string
  [CLASS_NAME]: string
  [STYLE_STRING]: string
  [SELECTORS]: CssClassName[]
  [EXTERNAL_CLASS_NAMES]: string[]
}
