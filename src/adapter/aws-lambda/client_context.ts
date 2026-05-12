//ff:type feature=adapter type=adapter
//ff:what Client context
import type { ClientContextClient } from './client_context_client.js'
import type { ClientContextEnv } from './client_context_env.js'

export interface ClientContext {
  client: ClientContextClient

  Custom?: any
  env: ClientContextEnv
}
