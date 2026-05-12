//ff:type feature=utils type=model
//ff:what Has required keys
import type { RequiredKeysOf } from './required_keys_of.js'

export type HasRequiredKeys<BaseType extends object> =
  RequiredKeysOf<BaseType> extends never ? false : true
