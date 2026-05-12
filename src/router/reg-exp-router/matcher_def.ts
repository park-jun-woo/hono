//ff:type feature=router type=router
//ff:what Matcher def
import type { ParamIndexMap, Result, Router } from '../../router'
import { METHOD_NAME_ALL } from '../../router'
import type { HandlerData } from './handler_data.js'
import type { StaticMap } from './static_map.js'

export type Matcher<T> = [RegExp, HandlerData<T>[], StaticMap<T>]
