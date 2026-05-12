//ff:type feature=utils type=model
//ff:what Body data value dot
import { HonoRequest } from '../request'

export type BodyDataValueDot = { [x: string]: string | File | BodyDataValueDot }
