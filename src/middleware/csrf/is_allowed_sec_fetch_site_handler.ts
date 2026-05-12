//ff:type feature=middleware type=handler
//ff:what Is allowed sec fetch site handler
import type { Context } from '../../context'
import { HTTPException } from '../../http-exception'
import type { MiddlewareHandler } from '../../types'
import type { SecFetchSite } from './sec_fetch_site.js'

export type IsAllowedSecFetchSiteHandler = (
  secFetchSite: SecFetchSite,
  context: Context
) => boolean | Promise<boolean>
