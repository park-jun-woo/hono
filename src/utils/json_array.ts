//ff:type feature=utils type=model
//ff:what Json array
import type { JSONPrimitive } from './json_primitive.js'
import type { JSONObject } from './json_object.js'

export type JSONArray = (JSONPrimitive | JSONObject | JSONArray)[]
