//ff:type feature=utils type=model
//ff:what Key importer algorithm def
import { getRuntimeKey } from '../../helper/adapter'
import { decodeBase64 } from '../encode'
import type { SignatureAlgorithm } from './jwa'
import { CryptoKeyUsage, JwtAlgorithmNotImplemented } from './types'
import { utf8Encoder } from './utf8'

export type KeyImporterAlgorithm = Parameters<typeof crypto.subtle.importKey>[2]
