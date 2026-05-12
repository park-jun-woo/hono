//ff:type feature=core type=model
//ff:what Optional request init properties
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

export type OptionalRequestInitProperties = 'window' | 'priority'
