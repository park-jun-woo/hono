//ff:type feature=utils type=model
//ff:what String buffer

/**
 * StringBuffer contains string and Promise<string> alternately
 * The length of the array will be odd, the odd numbered element will be a string,
 * and the even numbered element will be a Promise<string>.
 * When concatenating into a single string, it must be processed from the tail.
 * @example
 * [
 *   'framework.',
 *   Promise.resolve('ultra fast'),
 *   'a ',
 *   Promise.resolve('is '),
 *   'Hono',
 * ]
 */
export type StringBuffer = (string | Promise<string>)[]
