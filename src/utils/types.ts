//ff:type feature=utils type=model
//ff:what Types


export type { Expect } from './expect.js'
export type { Equal } from './equal.js'
export type { NotEqual } from './not_equal.js'
export type { UnionToIntersection } from './union_to_intersection.js'
export type { RemoveBlankRecord } from './remove_blank_record.js'
export type { IfAnyThenEmptyObject } from './if_any_then_empty_object.js'
export type { JSONPrimitive } from './json_primitive.js'
export type { JSONArray } from './json_array.js'
export type { JSONObject } from './json_object.js'
export type { InvalidJSONValue } from './invalid_json_value.js'
export type { InvalidToNull } from './invalid_to_null.js'
export type { IsInvalid } from './is_invalid.js'
export type { OmitSymbolKeys } from './omit_symbol_keys.js'
export type { JSONValue } from './json_value.js'
export type { JSONParsed } from './json_parsed.js'
export type { Simplify } from './simplify.js'
export type { SimplifyDeepArray } from './simplify_deep_array.js'
export type { InterfaceToType } from './interface_to_type.js'
export type { RequiredKeysOf } from './required_keys_of.js'
export type { HasRequiredKeys } from './has_required_keys.js'
export type { IsAny } from './is_any.js'

/**
 * String literal types with auto-completion
 * @see https://github.com/Microsoft/TypeScript/issues/29729
 */
export type StringLiteralUnion<T> = T | (string & Record<never, never>)
