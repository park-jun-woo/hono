//ff:type feature=utils type=model
//ff:what Jwt header requires kid

export class JwtHeaderRequiresKid extends Error {
  constructor(header: object) {
    super(`required "kid" in jwt header: ${JSON.stringify(header)}`)
    this.name = 'JwtHeaderRequiresKid'
  }
}
