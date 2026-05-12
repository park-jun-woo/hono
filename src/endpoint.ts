//ff:type feature=core type=model
//ff:what Endpoint
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

export type Endpoint = {
  input: any
  output: any
  outputFormat: ResponseFormat
  status: StatusCode
}
