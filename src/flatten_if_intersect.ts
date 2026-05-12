//ff:type feature=core type=model
//ff:what Flatten if intersect
import type { Context } from './context'
import type { HonoBase } from './hono-base'
import type { CustomHeader, RequestHeader } from './utils/headers'
import type { StatusCode } from './utils/http-status'
import type {
  IfAnyThenEmptyObject,
  IsAny,
  JSONValue,
  RemoveBlankRecord,
  Simplify,
  UnionToIntersection,
} from './utils/types'

export type FlattenIfIntersect<T> = T extends infer O ? { [K in keyof O]: O[K] } : never
