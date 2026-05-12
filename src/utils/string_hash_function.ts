//ff:type feature=utils type=model
//ff:what String hash function
import { sha256 } from './crypto'

export type StringHashFunction = (input: string) => string | null | Promise<string | null>
