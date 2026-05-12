//ff:type feature=utils type=model
//ff:what Body data value dot all def
import { HonoRequest } from '../request'

export type BodyDataValueDotAll = {
  [x: string]: string | File | (string | File)[] | BodyDataValueDotAll
}
