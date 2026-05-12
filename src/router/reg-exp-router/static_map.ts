//ff:type feature=router type=router
//ff:what Static map
import type { ParamIndexMap, Result, Router } from '../../router'
import { METHOD_NAME_ALL } from '../../router'

export type StaticMap<T> = Record<string, Result<T>>
