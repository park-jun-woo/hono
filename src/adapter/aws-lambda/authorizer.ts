//ff:type feature=adapter type=adapter
//ff:what Authorizer

export interface Authorizer {
  iam?: {
    accessKey: string
    accountId: string
    callerId: string
    cognitoIdentity: null
    principalOrgId: null
    userArn: string
    userId: string
  }
}
