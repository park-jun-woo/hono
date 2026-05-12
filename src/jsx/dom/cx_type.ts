//ff:type feature=jsx type=model
//ff:what Cx type
import type { FC, PropsWithChildren } from '../'
import type {
  ClassNameSlug,
  CssClassName,
  CssVariableType,
  OnInvalidSlug,
} from '../../helper/css/common'
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
} from '../../helper/css/common'

export interface CxType {
  (...args: (string | boolean | null | undefined)[]): string
}
