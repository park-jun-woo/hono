//ff:type feature=helper type=model
//ff:what To ssg options
import { replaceUrlParam } from '../../client/utils'
import type { Hono } from '../../hono'
import type { Env, Schema } from '../../types'
import { createPool } from '../../utils/concurrent'
import { getExtension } from '../../utils/mime'
import type { AddedSSGDataRequest, SSGParams } from './middleware'
import { SSG_CONTEXT, X_HONO_DISABLE_SSG_HEADER_KEY } from './middleware'
import { defaultPlugin } from './plugins'
import {
  dirname,
  ensureWithinOutDir,
  filterStaticGenerateRoutes,
  isDynamicRoute,
  joinPaths,
} from './utils'
import type { BeforeRequestHook } from './before_request_hook.js'
import type { AfterResponseHook } from './after_response_hook.js'
import type { AfterGenerateHook } from './after_generate_hook.js'
import type { SSGPlugin } from './ssg_plugin.js'

export interface ToSSGOptions {
  dir?: string
  /**
   * @deprecated Use plugins[].beforeRequestHook instead.
   */
  beforeRequestHook?: BeforeRequestHook | BeforeRequestHook[]
  /**
   * @deprecated Use plugins[].afterResponseHook instead.
   */
  afterResponseHook?: AfterResponseHook | AfterResponseHook[]
  /**
   * @deprecated Use plugins[].afterGenerateHook instead.
   */
  afterGenerateHook?: AfterGenerateHook | AfterGenerateHook[]
  concurrency?: number
  extensionMap?: Record<string, string>
  plugins?: SSGPlugin[]
}
