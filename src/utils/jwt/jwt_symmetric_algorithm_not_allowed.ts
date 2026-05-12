//ff:type feature=utils type=model
//ff:what Jwt symmetric algorithm not allowed

export class JwtSymmetricAlgorithmNotAllowed extends Error {
  constructor(alg: string) {
    super(`symmetric algorithm "${alg}" is not allowed for JWK verification`)
    this.name = 'JwtSymmetricAlgorithmNotAllowed'
  }
}
