//ff:type feature=utils type=model
//ff:what Body data value def
import { HonoRequest } from '../request'
import type { BodyDataValueComponent } from './body_data_value_component_def.js'
import type { BodyDataValueObject } from './body_data_value_object_def.js'

export type BodyDataValue<T> =
  | BodyDataValueComponent<T>
  | (T extends { dot: false }
      ? never // explicitly set to false
      : T extends { dot: true } | { dot: boolean }
        ? BodyDataValueObject<T> // use dot option
        : never)
