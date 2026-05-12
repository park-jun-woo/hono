//ff:type feature=jsx type=model
//ff:what Update state function
import type { JSX } from '../base'
import { DOM_STASH } from '../constants'
import { buildDataStack, update } from '../dom/render'
import type { Context, Node, NodeObject, PendingType, UpdateHook } from '../dom/render'

export type UpdateStateFunction<T> = (newState: T | ((currentState: T) => T)) => void
