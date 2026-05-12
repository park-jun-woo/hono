//ff:type feature=validator type=model
//ff:what Validation function
import type { Context } from '../context'
import { getCookie } from '../helper/cookie'
import { HTTPException } from '../http-exception'
import type { Env, MiddlewareHandler, TypedResponse, ValidationTargets, FormValue } from '../types'
import type { BodyData } from '../utils/body'
import { bufferToFormData } from '../utils/buffer'
import type { InferInput } from './utils'

export type ValidationFunction<
  InputType,
  OutputType,
  E extends Env = {},
  P extends string = string,
> = (
  value: InputType,
  c: Context<E, P>
) => OutputType | TypedResponse | Promise<OutputType> | Promise<TypedResponse>
