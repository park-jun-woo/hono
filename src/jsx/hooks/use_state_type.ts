//ff:type feature=jsx type=model
//ff:what Use state type
import type { JSX } from '../base'
import { DOM_STASH } from '../constants'
import { buildDataStack, update } from '../dom/render'
import type { Context, Node, NodeObject, PendingType, UpdateHook } from '../dom/render'
import type { UpdateStateFunction } from './update_state_function.js'

export type UseStateType = {
  <T>(initialState: T | (() => T)): [T, UpdateStateFunction<T>]
  <T = undefined>(): [T | undefined, UpdateStateFunction<T | undefined>]
}
