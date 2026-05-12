//ff:type feature=helper type=model
//ff:what Init app
import { Hono } from '../../hono'
import type { HonoOptions } from '../../hono-base'
import type {
  Env,
  H,
  HandlerResponse,
  Input,
  IntersectNonAnyTypes,
  MiddlewareHandler,
} from '../../types'

export type InitApp<E extends Env = Env> = (app: Hono<E>) => void
