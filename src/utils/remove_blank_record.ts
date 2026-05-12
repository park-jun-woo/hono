//ff:type feature=utils type=model
//ff:what Remove blank record

export type RemoveBlankRecord<T> =
  T extends Record<infer K, unknown> ? (K extends string ? T : never) : never
