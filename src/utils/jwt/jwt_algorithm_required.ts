//ff:type feature=utils type=model
//ff:what Jwt algorithm required

export class JwtAlgorithmRequired extends Error {
  constructor() {
    super('JWT verification requires "alg" option to be specified')
    this.name = 'JwtAlgorithmRequired'
  }
}
