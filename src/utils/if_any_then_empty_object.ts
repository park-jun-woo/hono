//ff:type feature=utils type=model
//ff:what If any then empty object

export type IfAnyThenEmptyObject<T> = 0 extends 1 & T ? {} : T
