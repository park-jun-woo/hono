//ff:type feature=router type=router
//ff:what Reg exp match array with indices
import type { Params, Result, Router } from '../../router'
import { METHOD_NAME_ALL, UnsupportedPathError } from '../../router'
import { checkOptionalParameter } from '../../utils/url'

export type RegExpMatchArrayWithIndices = RegExpMatchArray & { indices: [number, number][] }
