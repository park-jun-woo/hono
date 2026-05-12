//ff:type feature=jsx type=model
//ff:what Effect data
import type { JSX } from '../base'
import { DOM_STASH } from '../constants'
import { buildDataStack, update } from '../dom/render'
import type { Context, Node, NodeObject, PendingType, UpdateHook } from '../dom/render'

export type EffectData = [
  readonly unknown[] | undefined, // deps
  (() => void | (() => void)) | undefined, // layout effect
  (() => void) | undefined, // cleanup
  (() => void) | undefined, // effect
  (() => void) | undefined, // insertion effect
]
