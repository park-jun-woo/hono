//ff:type feature=utils type=model
//ff:what Simplify body data def
import { HonoRequest } from '../request'
import type { BodyDataValueDot } from './body_data_value_dot_def.js'
import type { BodyDataValueDotAll } from './body_data_value_dot_all_def.js'

export type SimplifyBodyData<T> = {
  [K in keyof T]: string | File | (string | File)[] | BodyDataValueDotAll extends T[K]
    ? string | File | (string | File)[] | BodyDataValueDotAll
    : string | File | BodyDataValueDot extends T[K]
      ? string | File | BodyDataValueDot
      : string | File | (string | File)[] extends T[K]
        ? string | File | (string | File)[]
        : string | File
} & {}
