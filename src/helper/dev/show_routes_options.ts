//ff:type feature=helper type=model
//ff:what Show routes options
import type { Hono } from '../../hono'
import type { Env, RouterRoute } from '../../types'
import { getColorEnabled } from '../../utils/color'
import { findTargetHandler, isMiddleware } from '../../utils/handler'

export interface ShowRoutesOptions {
  verbose?: boolean
  colorize?: boolean
}
