//ff:type feature=validator type=model
//ff:what Extract validation response
import type { Context } from '../context'
import { getCookie } from '../helper/cookie'
import { HTTPException } from '../http-exception'
import type { Env, MiddlewareHandler, TypedResponse, ValidationTargets, FormValue } from '../types'
import type { BodyData } from '../utils/body'
import { bufferToFormData } from '../utils/buffer'
import type { InferInput } from './utils'

export type ExtractValidationResponse<VF> = VF extends (value: any, c: any) => infer R
  ? R extends Promise<infer PR>
    ? PR extends TypedResponse<infer T, infer S, infer F>
      ? TypedResponse<T, S, F>
      : PR extends Response
        ? PR
        : PR extends undefined
          ? never // undefined → never
          : never // anything else → never
    : R extends TypedResponse<infer T, infer S, infer F>
      ? TypedResponse<T, S, F>
      : R extends Response
        ? R
        : R extends undefined
          ? never // undefined → never
          : never // anything else → never
  : never
