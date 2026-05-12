//ff:type feature=utils type=model
//ff:what Omit symbol keys

/**
 * symbol keys are omitted through `JSON.stringify`
 */
export type OmitSymbolKeys<T> = { [K in keyof T as K extends symbol ? never : K]: T[K] }
