//ff:type feature=utils type=model
//ff:what Json parsed
import type { JSONPrimitive } from './json_primitive.js'
import type { InvalidJSONValue } from './invalid_json_value.js'
import type { InvalidToNull } from './invalid_to_null.js'
import type { IsInvalid } from './is_invalid.js'
import type { OmitSymbolKeys } from './omit_symbol_keys.js'
import type { JSONValue } from './json_value.js'

/**
 * Convert a type to a JSON-compatible type.
 *
 * Non-JSON values such as `Date` implement `.toJSON()`,
 * so they can be transformed to a value assignable to `JSONObject`
 *
 * `JSON.stringify()` throws a `TypeError` when it encounters a `bigint` value,
 * unless a custom `replacer` function or `.toJSON()` method is provided.
 *
 * This behaviour can be controlled by the `TError` generic type parameter,
 * which defaults to `bigint | ReadonlyArray<bigint>`.
 * You can set it to `never` to disable this check.
 */
export type JSONParsed<T, TError = bigint | ReadonlyArray<bigint>> = T extends {
  toJSON(): infer J
}
  ? (() => J) extends () => JSONPrimitive
    ? J
    : (() => J) extends () => { toJSON(): unknown }
      ? {}
      : JSONParsed<J, TError>
  : T extends JSONPrimitive
    ? T
    : T extends InvalidJSONValue
      ? never
      : T extends ReadonlyArray<unknown>
        ? { [K in keyof T]: JSONParsed<InvalidToNull<T[K]>, TError> }
        : T extends Set<unknown> | Map<unknown, unknown> | Record<string, never>
          ? {}
          : T extends object
            ? T[keyof T] extends TError
              ? never
              : {
                  [K in keyof OmitSymbolKeys<T> as IsInvalid<T[K]> extends true
                    ? never
                    : K]: boolean extends IsInvalid<T[K]>
                    ? JSONParsed<T[K], TError> | undefined
                    : JSONParsed<T[K], TError>
                }
            : T extends unknown
              ? T extends TError
                ? never
                : JSONValue
              : never
