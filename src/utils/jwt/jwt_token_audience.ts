//ff:type feature=utils type=model
//ff:what Jwt token audience

export class JwtTokenAudience extends Error {
  constructor(expected: string | string[] | RegExp, aud: string | string[]) {
    super(
      `expected audience "${
        Array.isArray(expected) ? expected.join(', ') : expected
      }", got "${aud}"`
    )
    this.name = 'JwtTokenAudience'
  }
}
