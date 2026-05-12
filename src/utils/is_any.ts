//ff:type feature=utils type=model
//ff:what Is any

export type IsAny<T> = boolean extends (T extends never ? true : false) ? true : false
