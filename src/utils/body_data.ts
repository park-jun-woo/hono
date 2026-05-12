//ff:type feature=utils type=model
//ff:what Body data
import { HonoRequest } from '../request'
import type { SimplifyBodyData } from './simplify_body_data.js'
import type { BodyDataValue } from './body_data_value.js'
import type { ParseBodyOptions } from './parse_body_options.js'

export type BodyData<T extends Partial<ParseBodyOptions> = {}> = SimplifyBodyData<
  Record<string, BodyDataValue<T>>
>
