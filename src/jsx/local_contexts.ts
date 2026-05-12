//ff:type feature=jsx type=model
//ff:what Local contexts
import { raw } from '../helper/html'
import { escapeToBuffer, resolveCallbackSync, stringBufferToString } from '../utils/html'
import type { HtmlEscaped, HtmlEscapedString, StringBufferWithCallbacks } from '../utils/html'
import { DOM_RENDERER, DOM_MEMO } from './constants'
import type { Context } from './context'
import { createContext, globalContexts, useContext } from './context'
import { domRenderers } from './intrinsic-element/common'
import * as intrinsicElementTags from './intrinsic-element/components'
import type {
  JSX as HonoJSX,
  IntrinsicElements as IntrinsicElementsDefined,
} from './intrinsic-elements'
import {
  isValidAttributeName,
  isValidTagName,
  normalizeIntrinsicElementKey,
  styleObjectForEach,
} from './utils'

export type LocalContexts = [Context<unknown>, unknown][]
