//ff:type feature=utils type=model
//ff:what Jwt algorithm mismatch

export class JwtAlgorithmMismatch extends Error {
  constructor(expected: string, actual: string) {
    super(`JWT algorithm mismatch: expected "${expected}", got "${actual}"`)
    this.name = 'JwtAlgorithmMismatch'
  }
}
