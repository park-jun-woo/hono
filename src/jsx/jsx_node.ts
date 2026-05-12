//ff:type feature=jsx type=model
//ff:what Jsx node
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
import type { Props } from './props.js'
import type { LocalContexts } from './local_contexts.js'
import type { Child } from './child.js'
import { toSVGAttributeName } from './base.js'
import { childrenToStringToBuffer } from './base.js'
import { nameSpaceContext } from './base.js'
import { emptyTags } from './base.js'
import { booleanAttributes } from './base.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _writeProp = (key: string, v: any, tag: string, children: Child[], buffer: StringBufferWithCallbacks): Child[] => {
  if (key === 'children') {
    // skip children
  } else if (key === 'style' && typeof v === 'object') {
    // object to style strings
    let styleStr = ''
    styleObjectForEach(v, (property, value) => {
      if (value != null) {
        styleStr += `${styleStr ? ';' : ''}${property}:${value}`
      }
    })
    buffer[0] += ' style="'
    escapeToBuffer(styleStr, buffer)
    buffer[0] += '"'
  } else if (typeof v === 'string') {
    buffer[0] += ` ${key}="`
    escapeToBuffer(v, buffer)
    buffer[0] += '"'
  } else if (v === null || v === undefined) {
    // Do nothing
  } else if (typeof v === 'number' || (v as HtmlEscaped).isEscaped) {
    buffer[0] += ` ${key}="${v}"`
  } else if (typeof v === 'boolean' && booleanAttributes.includes(key)) {
    if (v) {
      buffer[0] += ` ${key}=""`
    }
  } else if (key === 'dangerouslySetInnerHTML') {
    if (children.length > 0) {
      throw new Error('Can only set one of `children` or `props.dangerouslySetInnerHTML`.')
    }
    return [raw(v.__html)]
  } else if (v instanceof Promise) {
    buffer[0] += ` ${key}="`
    buffer.unshift('"', v)
  } else if (typeof v === 'function') {
    if (!key.startsWith('on') && key !== 'ref') {
      throw new Error(`Invalid prop '${key}' of type 'function' supplied to '${tag}'.`)
    }
    // maybe event handler for client components, just ignore in server components
  } else {
    buffer[0] += ` ${key}="`
    escapeToBuffer(v.toString(), buffer)
    buffer[0] += '"'
  }
  return children
}

export class JSXNode implements HtmlEscaped {
  tag: string | Function
  props: Props
  key?: string
  children: Child[]
  isEscaped: true = true as const
  localContexts?: LocalContexts
  constructor(tag: string | Function, props: Props, children: Child[]) {
    if (typeof tag !== 'function' && !isValidTagName(tag)) {
      throw new Error(`Invalid JSX tag name: ${tag}`)
    }
    this.tag = tag
    this.props = props
    this.children = children
  }

  get type(): string | Function {
    return this.tag as string
  }

  // Added for compatibility with libraries that rely on React's internal structure
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get ref(): any {
    return this.props.ref || null
  }

  toString(): string | Promise<string> {
    const buffer: StringBufferWithCallbacks = [''] as StringBufferWithCallbacks
    this.localContexts?.forEach(([context, value]) => {
      context.values.push(value)
    })
    try {
      this.toStringToBuffer(buffer)
    } finally {
      this.localContexts?.forEach(([context]) => {
        context.values.pop()
      })
    }
    return buffer.length === 1
      ? 'callbacks' in buffer
        ? resolveCallbackSync(raw(buffer[0], buffer.callbacks)).toString()
        : buffer[0]
      : stringBufferToString(buffer, buffer.callbacks)
  }

  toStringToBuffer(buffer: StringBufferWithCallbacks): void {
    const tag = this.tag as string
    const props = this.props
    let { children } = this

    buffer[0] += `<${tag}`

    const normalizeKey: (key: string) => string =
      tag === 'svg' || (nameSpaceContext && useContext(nameSpaceContext) === 'svg')
        ? (key) => toSVGAttributeName(normalizeIntrinsicElementKey(key))
        : (key) => normalizeIntrinsicElementKey(key)
    for (let [key, v] of Object.entries(props)) {
      key = normalizeKey(key)
      if (!isValidAttributeName(key)) {
        continue
      }
      children = _writeProp(key, v, tag, children, buffer)
    }

    if (emptyTags.includes(tag as string) && children.length === 0) {
      buffer[0] += '/>'
      return
    }

    buffer[0] += '>'

    childrenToStringToBuffer(children, buffer)

    buffer[0] += `</${tag}>`
  }
}
