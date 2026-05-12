//ff:type feature=utils type=model
//ff:what Signature algorithm
import { AlgorithmTypes } from './jwa.js'

export type SignatureAlgorithm = keyof typeof AlgorithmTypes
