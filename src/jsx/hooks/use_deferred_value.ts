//ff:type feature=jsx type=model
//ff:what Use deferred value
import type { JSX } from '../base'
import { DOM_STASH } from '../constants'
import { buildDataStack, update } from '../dom/render'
import type { Context, Node, NodeObject, PendingType, UpdateHook } from '../dom/render'

export type UseDeferredValue = <T>(value: T, initialValue?: T) => T
