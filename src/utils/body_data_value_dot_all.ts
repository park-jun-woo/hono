//ff:type feature=utils type=model
//ff:what Body data value dot all
import { HonoRequest } from '../request'

export type BodyDataValueDotAll = {
  [x: string]: string | File | (string | File)[] | BodyDataValueDotAll
}
