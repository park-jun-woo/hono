//ff:type feature=utils type=model
//ff:what Simplify

/**
 * Useful to flatten the type output to improve type hints shown in editors. And also to transform an interface into a type to aide with assignability.
 * @copyright from sindresorhus/type-fest
 */
export type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {}
