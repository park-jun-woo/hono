

export type { SignatureAlgorithm } from './signature_algorithm.js'
export type { SymmetricAlgorithm } from './symmetric_algorithm.js'
export type { AsymmetricAlgorithm } from './asymmetric_algorithm.js'

/**
 * @module
 * JSON Web Algorithms (JWA)
 * https://datatracker.ietf.org/doc/html/rfc7518
 */

export enum AlgorithmTypes {
  HS256 = 'HS256',
  HS384 = 'HS384',
  HS512 = 'HS512',
  RS256 = 'RS256',
  RS384 = 'RS384',
  RS512 = 'RS512',
  PS256 = 'PS256',
  PS384 = 'PS384',
  PS512 = 'PS512',
  ES256 = 'ES256',
  ES384 = 'ES384',
  ES512 = 'ES512',
  EdDSA = 'EdDSA',
}
