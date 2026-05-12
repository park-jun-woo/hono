//ff:type feature=jsx type=model
//ff:what Error handler
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ErrorHandler = (error: any, retry: () => void) => Child | undefined
