//ff:type feature=utils type=model
//ff:what Jwt algorithm not implemented

/**
 * @module
 * Type definitions for JWT utilities.
 */
export class JwtAlgorithmNotImplemented extends Error {
  constructor(alg: string) {
    super(`${alg} is not an implemented algorithm`)
    this.name = 'JwtAlgorithmNotImplemented'
  }
}
