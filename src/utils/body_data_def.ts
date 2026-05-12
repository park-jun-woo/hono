//ff:type feature=utils type=model
//ff:what Body data def
import { HonoRequest } from '../request'
import type { SimplifyBodyData } from './simplify_body_data_def.js'
import type { BodyDataValue } from './body_data_value_def.js'
import type { ParseBodyOptions } from './parse_body_options_def.js'

export type BodyData<T extends Partial<ParseBodyOptions> = {}> = SimplifyBodyData<
  Record<string, BodyDataValue<T>>
>
