//ff:type feature=router type=router
//ff:what Route
import type { Params, Result, Router } from '../../router'
import { METHOD_NAME_ALL, UnsupportedPathError } from '../../router'

export type Route<T> = [RegExp, string, T]
