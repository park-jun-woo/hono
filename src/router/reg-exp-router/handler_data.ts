//ff:type feature=router type=router
//ff:what Handler data
import type { ParamIndexMap, Result, Router } from '../../router'
import { METHOD_NAME_ALL } from '../../router'

export type HandlerData<T> = [T, ParamIndexMap][]
