//ff:type feature=core type=model
//ff:what Required request init
import { HTTPException } from './http-exception'
import { GET_MATCH_RESULT } from './request/constants'
import type { Result } from './router'
import type {
  Input,
  InputToDataByTarget,
  ParamKeyToRecord,
  ParamKeys,
  RemoveQuestion,
  RouterRoute,
  ValidationTargets,
} from './types'
import { parseBody } from './utils/body'
import type { BodyData, ParseBodyOptions } from './utils/body'
import type { CustomHeader, RequestHeader } from './utils/headers'
import type { Simplify, UnionToIntersection } from './utils/types'
import { decodeURIComponent_, getQueryParam, getQueryParams, tryDecode } from './utils/url'
import type { OptionalRequestInitProperties } from './optional_request_init_properties.js'

export type RequiredRequestInit = Required<Omit<RequestInit, OptionalRequestInitProperties>> & {
  [Key in OptionalRequestInitProperties]?: RequestInit[Key]
}
