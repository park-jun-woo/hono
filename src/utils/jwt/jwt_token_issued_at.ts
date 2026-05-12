//ff:type feature=utils type=model
//ff:what Jwt token issued at

export class JwtTokenIssuedAt extends Error {
  constructor(currentTimestamp: number, iat: number) {
    super(
      `Invalid "iat" claim, must be a valid number lower than "${currentTimestamp}" (iat: "${iat}")`
    )
    this.name = 'JwtTokenIssuedAt'
  }
}
