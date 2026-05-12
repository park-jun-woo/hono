//ff:type feature=utils type=model
//ff:what Verify options with alg
import { decodeBase64Url, encodeBase64Url } from '../../utils/encode'
import { AlgorithmTypes } from './jwa'
import type { AsymmetricAlgorithm, SignatureAlgorithm, SymmetricAlgorithm } from './jwa'
import { signing, verifying } from './jws'
import type { HonoJsonWebKey, SignatureKey } from './jws'
import {
  JwtAlgorithmMismatch,
  JwtAlgorithmNotAllowed,
  JwtAlgorithmRequired,
  JwtHeaderInvalid,
  JwtHeaderRequiresKid,
  JwtPayloadRequiresAud,
  JwtSymmetricAlgorithmNotAllowed,
  JwtTokenAudience,
  JwtTokenExpired,
  JwtTokenInvalid,
  JwtTokenIssuedAt,
  JwtTokenIssuer,
  JwtTokenNotBefore,
  JwtTokenSignatureMismatched,
} from './types'
import type { JWTPayload } from './types'
import { utf8Decoder, utf8Encoder } from './utf8'
import type { VerifyOptions } from './verify_options.js'

export type VerifyOptionsWithAlg = {
  /** The algorithm used for decoding the token */
  alg: SignatureAlgorithm
} & VerifyOptions
