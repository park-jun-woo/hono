//ff:type feature=utils type=model
//ff:what Jwt header invalid

export class JwtHeaderInvalid extends Error {
  constructor(header: object) {
    super(`jwt header is invalid: ${JSON.stringify(header)}`)
    this.name = 'JwtHeaderInvalid'
  }
}
