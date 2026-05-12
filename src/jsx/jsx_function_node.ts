//ff:type feature=jsx type=model
//ff:what Jsx function node
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
import type { LocalContexts } from './local_contexts.js'
import { JSXNode } from './jsx_node.js'

export class JSXFunctionNode extends JSXNode {
  override toStringToBuffer(buffer: StringBufferWithCallbacks): void {
    const { children } = this

    const props = { ...this.props }
    if (children.length) {
      props.children = children.length === 1 ? children[0] : children
    }

    const res = (this.tag as Function).call(null, props)

    if (typeof res === 'boolean' || res == null) {
      // boolean or null or undefined
      return
    } else if (res instanceof Promise) {
      if (globalContexts.length === 0) {
        buffer.unshift('', res)
      } else {
        // save current contexts for resuming
        const currentContexts: LocalContexts = globalContexts.map((c) => [c, c.values.at(-1)])
        buffer.unshift(
          '',
          res.then((childRes) => {
            if (childRes instanceof JSXNode) {
              childRes.localContexts = currentContexts
            }
            return childRes
          })
        )
      }
    } else if (res instanceof JSXNode) {
      res.toStringToBuffer(buffer)
    } else if (typeof res === 'number' || (res as HtmlEscaped).isEscaped) {
      buffer[0] += res
      if (res.callbacks) {
        buffer.callbacks ||= []
        buffer.callbacks.push(...res.callbacks)
      }
    } else {
      escapeToBuffer(res, buffer)
    }
  }
}
