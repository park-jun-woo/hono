//ff:type feature=helper type=model
//ff:what View transition type
import type { CssVariableType } from './css_variable_type.js'
import type { ClassNameSlug } from './class_name_slug.js'
import type { OnInvalidSlug } from './on_invalid_slug.js'
import type { CssClassName } from './css_class_name.js'

export type ViewTransitionType = {
  (
    strings: TemplateStringsArray,
    values: CssVariableType[],
    classNameSlug?: ClassNameSlug,
    onInvalidSlug?: OnInvalidSlug
  ): CssClassName
  (content: CssClassName): CssClassName
  (): CssClassName
}
