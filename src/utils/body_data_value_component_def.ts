//ff:type feature=utils type=model
//ff:what Body data value component def
import { HonoRequest } from '../request'

export type BodyDataValueComponent<T> =
  | string
  | File
  | (T extends { all: false }
      ? never // explicitly set to false
      : T extends { all: true } | { all: boolean }
        ? (string | File)[] // use all option
        : never)
