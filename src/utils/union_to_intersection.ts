//ff:type feature=utils type=model
//ff:what Union to intersection

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never
