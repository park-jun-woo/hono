//ff:type feature=utils type=model
//ff:what Jwt token issuer

export class JwtTokenIssuer extends Error {
  constructor(expected: string | RegExp, iss: string | null) {
    super(`expected issuer "${expected}", got ${iss ? `"${iss}"` : 'none'} `)
    this.name = 'JwtTokenIssuer'
  }
}
