//ff:type feature=adapter type=adapter
//ff:what Identity
import type { ClientCert } from './client_cert.js'

export interface Identity {
  accessKey?: string
  accountId?: string
  caller?: string
  cognitoAuthenticationProvider?: string
  cognitoAuthenticationType?: string
  cognitoIdentityId?: string
  cognitoIdentityPoolId?: string
  principalOrgId?: string
  sourceIp: string
  user?: string
  userAgent: string
  userArn?: string
  clientCert?: ClientCert
}
