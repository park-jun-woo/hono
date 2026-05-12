//ff:type feature=utils type=model
//ff:what Body data value object def
import { HonoRequest } from '../request'
import type { BodyDataValueComponent } from './body_data_value_component_def.js'

export type BodyDataValueObject<T> = { [key: string]: BodyDataValueComponent<T> | BodyDataValueObject<T> }
