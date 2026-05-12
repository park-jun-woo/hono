//ff:type feature=adapter type=adapter
//ff:what Params
import { Context } from '../../context'
import type { Hono } from '../../hono'
import { HTTPException } from '../../http-exception'
import type { BlankSchema, Env, Input, MiddlewareHandler, Schema } from '../../types'

// Ref: https://github.com/cloudflare/workerd/blob/main/types/defines/pages.d.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Params<P extends string = any> = Record<P, string | string[]>
