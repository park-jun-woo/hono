//ff:type feature=helper type=model
//ff:what To ssg interface
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
import type { FileSystemModule } from './file_system_module.js'
import type { ToSSGResult } from './to_ssg_result.js'
import type { ToSSGOptions } from './to_ssg_options.js'

/**
 * @experimental
 * `ToSSGInterface` is an experimental feature.
 * The API might be changed.
 */
export interface ToSSGInterface {
  (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    app: Hono<any, any, any>,
    fsModule: FileSystemModule,
    options?: ToSSGOptions
  ): Promise<ToSSGResult>
}
