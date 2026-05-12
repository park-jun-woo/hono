//ff:type feature=adapter type=adapter
//ff:what Extendable event

export interface ExtendableEvent extends Event {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  waitUntil(f: Promise<any>): void
}
