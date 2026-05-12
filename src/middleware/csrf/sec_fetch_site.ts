//ff:type feature=middleware type=handler
//ff:what Sec fetch site
import type { Context } from '../../context'
import { HTTPException } from '../../http-exception'
import type { MiddlewareHandler } from '../../types'
import { secFetchSiteValues } from './index.js'

export type SecFetchSite = (typeof secFetchSiteValues)[number]
