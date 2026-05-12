//ff:type feature=jsx type=model
//ff:what Child
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
import { JSXNode } from './jsx_node.js'

export type Child =
  | string
  | Promise<string>
  | number
  | JSXNode
  | null
  | undefined
  | boolean
  | Child[]
