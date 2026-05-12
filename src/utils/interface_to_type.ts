//ff:type feature=utils type=model
//ff:what Interface to type

export type InterfaceToType<T> = T extends Function ? T : { [K in keyof T]: InterfaceToType<T[K]> }
