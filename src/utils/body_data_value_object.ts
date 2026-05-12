//ff:type feature=utils type=model
//ff:what Body data value object
import { HonoRequest } from '../request'
import type { BodyDataValueComponent } from './body_data_value_component.js'

export type BodyDataValueObject<T> = { [key: string]: BodyDataValueComponent<T> | BodyDataValueObject<T> }
