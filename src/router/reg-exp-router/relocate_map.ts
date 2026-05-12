//ff:type feature=router type=router
//ff:what Relocate map
import type { ParamIndexMap, Result, Router } from '../../router'
import { METHOD_NAME_ALL } from '../../router'
import type { HandlerData, Matcher, MatcherMap, StaticMap } from './matcher'
import { match, emptyParam } from './matcher'
import { RegExpRouter } from './router'

export type RelocateMap = Record<string, ([(number | string)[], ParamIndexMap] | [(number | string)[]])[]>
