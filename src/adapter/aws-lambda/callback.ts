//ff:type feature=adapter type=adapter
//ff:what Callback

export type Callback<TResult = any> = (error?: Error | string | null, result?: TResult) => void
