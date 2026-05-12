//ff:type feature=adapter type=adapter
//ff:what Handler def
import type { Hono } from '../../hono'
import type { Env, Schema } from '../../types'
import type { FetchEvent } from './types'

export type Handler = (evt: FetchEvent) => void
