//ff:type feature=utils type=model
//ff:what Json object
import type { JSONPrimitive } from './json_primitive.js'
import type { JSONArray } from './json_array.js'
import type { InvalidJSONValue } from './invalid_json_value.js'

export type JSONObject = {
  [key: string]: JSONPrimitive | JSONArray | JSONObject | object | InvalidJSONValue
}
