//ff:type feature=helper type=model
//ff:what Cx type
import { raw } from '../../helper/html'
import { DOM_RENDERER } from '../../jsx/constants'
import { createCssJsxDomObjects } from '../../jsx/dom/css'
import type { HtmlEscapedCallback, HtmlEscapedString } from '../../utils/html'
import type {
  ClassNameSlug,
  CssClassName as CssClassNameCommon,
  CssVariableType,
  OnInvalidSlug,
} from './common'
import {
  CLASS_NAME,
  DEFAULT_STYLE_ID,
  PSEUDO_GLOBAL_SELECTOR,
  SELECTOR,
  SELECTORS,
  STYLE_STRING,
  cssCommon,
  cxCommon,
  keyframesCommon,
  viewTransitionCommon,
} from './common'
import type { CssClassName } from './css_class_name_def.js'

export interface CxType {
  (
    ...args: (CssClassName | Promise<string> | string | boolean | null | undefined)[]
  ): Promise<string>
}
