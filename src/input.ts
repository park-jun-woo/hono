//ff:type feature=core type=model
//ff:what Input
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
import type { ResponseFormat } from './response_format.js'

export type Input = {
  in?: {}
  out?: {}
  outputFormat?: ResponseFormat
}
