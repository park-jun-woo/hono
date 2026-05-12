//ff:type feature=utils type=model
//ff:what Is invalid
import type { InvalidJSONValue } from './invalid_json_value.js'

export type IsInvalid<T> = T extends InvalidJSONValue ? true : false
