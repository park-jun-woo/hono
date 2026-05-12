//ff:type feature=adapter type=adapter
//ff:what Types

import type { ExtendableEvent } from './extendable_event.js'

export type { ExtendableEvent } from './extendable_event.js'

export interface FetchEvent extends ExtendableEvent {
  readonly clientId: string
  readonly handled: Promise<void>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly preloadResponse: Promise<any>
  readonly request: Request
  readonly resultingClientId: string
  respondWith(r: Response | PromiseLike<Response>): void
}
