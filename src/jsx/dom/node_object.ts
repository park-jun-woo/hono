//ff:type feature=jsx type=model
//ff:what Node object
import type { Child, FC, JSXNode, Props, MemorableFC } from '../base'
import { toArray } from '../children'
import {
  DOM_ERROR_HANDLER,
  DOM_INTERNAL_TAG,
  DOM_MEMO,
  DOM_RENDERER,
  DOM_STASH,
} from '../constants'
import type { Context as JSXContext } from '../context'
import { globalContexts as globalJSXContexts, useContext } from '../context'
import type { EffectData } from '../hooks'
import { STASH_EFFECT } from '../hooks'
import { normalizeIntrinsicElementKey, styleObjectForEach } from '../utils'
import { createContext } from './context'
import type { Container } from './container.js'
import type { LocalJSXContexts } from './local_jsx_contexts.js'
import type { SupportedElement } from './supported_element.js'
import type { PreserveNodeType } from './preserve_node_type.js'
import type { Node } from './node.js'
import type { Context } from './context_def.js'
import { apply } from './render.js'
import { build } from './render.js'

export type NodeObject = {
  pP: Props | undefined // previous props
  nN: Node | undefined // next node
  vC: Node[] // virtual dom children
  pC?: Node[] // previous virtual dom children
  vR: Node[] // virtual dom children to remove
  n?: string // namespace
  f?: boolean // force build
  s?: boolean // skip build and apply
  c: Container | undefined // container
  e: SupportedElement | Text | undefined // rendered element
  p?: PreserveNodeType // preserve HTMLElement if it will be unmounted
  a?: boolean // cancel apply() if true
  o?: NodeObject // original node
  [DOM_STASH]:
    | [
        number, // current hook index
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any[][], // stash for hooks
        LocalJSXContexts, // context
        [Context, Function, NodeObject], // [context, error handler, node] for closest error boundary or suspense
      ]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | [number, any[][]]
} & JSXNode
