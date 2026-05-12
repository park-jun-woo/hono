//ff:type feature=adapter type=adapter
//ff:what Types


export type { Callback } from './callback.js'
export type { Handler } from './handler_def.js'
export type { CognitoIdentity } from './cognito_identity.js'
export type { ClientContext } from './client_context.js'
export type { ClientContextClient } from './client_context_client.js'
export type { ClientContextEnv } from './client_context_env.js'
export type { LambdaContext } from './lambda_context.js'
export type { ClientCert } from './client_cert.js'
export type { Identity } from './identity.js'
export type { ApiGatewayRequestContext } from './api_gateway_request_context.js'
export type { Authorizer } from './authorizer.js'
export type { ApiGatewayRequestContextV2 } from './api_gateway_request_context_v2.js'
export type { ALBRequestContext } from './alb_request_context.js'

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface LatticeRequestContextV2 {
  serviceNetworkArn: string
  serviceArn: string
  targetGroupArn: string
  region: string
  timeEpoch: string
  identity: {
    sourceVpcArn?: string
    type?: string
    principal?: string
    principalOrgID?: string
    sessionName?: string
    x509IssuerOu?: string
    x509SanDns?: string
    x509SanNameCn?: string
    x509SanUri?: string
    x509SubjectCn?: string
  }
}
