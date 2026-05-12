//ff:type feature=jsx type=model
//ff:what Context def
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
import type { PendingType } from './pending_type.js'
import type { UpdateHook } from './update_hook.js'
import { update } from './render.js'
import { render } from './render.js'

export type Context =
  | [
      PendingType, // PendingType
      boolean, // got an error
      UpdateHook, // update hook
      boolean, // is in view transition
      boolean, // is in top level render
      [Context, Function, NodeObject][], //  [context, error handler, node] stack for this context
    ]
  | [PendingType, boolean, UpdateHook, boolean]
  | [PendingType, boolean, UpdateHook]
  | [PendingType, boolean]
  | [PendingType]
  | []
