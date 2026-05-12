//ff:type feature=jsx type=model
//ff:what Node
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
import type { NodeObject } from './node_object.js'
import type { NodeString } from './node_string.js'

export type Node = NodeString | NodeObject
