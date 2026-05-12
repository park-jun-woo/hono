//ff:type feature=utils type=model
//ff:what Jwt algorithm not allowed

export class JwtAlgorithmNotAllowed extends Error {
  constructor(alg: string, allowedAlgorithms: readonly string[]) {
    super(`algorithm "${alg}" is not in the allowed list: [${allowedAlgorithms.join(', ')}]`)
    this.name = 'JwtAlgorithmNotAllowed'
  }
}
