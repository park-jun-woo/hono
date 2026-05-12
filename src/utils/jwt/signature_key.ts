//ff:type feature=utils type=model
//ff:what Signature key
import { getRuntimeKey } from '../../helper/adapter'
import { decodeBase64 } from '../encode'
import type { SignatureAlgorithm } from './jwa'
import { CryptoKeyUsage, JwtAlgorithmNotImplemented } from './types'
import { utf8Encoder } from './utf8'
import type { HonoJsonWebKey } from './jws.js'

export type SignatureKey = string | HonoJsonWebKey | CryptoKey
