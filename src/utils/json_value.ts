//ff:type feature=utils type=model
//ff:what Json value
import type { JSONPrimitive } from './json_primitive.js'
import type { JSONArray } from './json_array.js'
import type { JSONObject } from './json_object.js'

export type JSONValue = JSONObject | JSONArray | JSONPrimitive
