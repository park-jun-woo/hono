//ff:type feature=utils type=model
//ff:what Invalid to null
import type { InvalidJSONValue } from './invalid_json_value.js'

export type InvalidToNull<T> = T extends InvalidJSONValue ? null : T
