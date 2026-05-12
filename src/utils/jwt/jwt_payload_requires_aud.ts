//ff:type feature=utils type=model
//ff:what Jwt payload requires aud

export class JwtPayloadRequiresAud extends Error {
  constructor(payload: object) {
    super(`required "aud" in jwt payload: ${JSON.stringify(payload)}`)
    this.name = 'JwtPayloadRequiresAud'
  }
}
