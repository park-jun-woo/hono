//ff:type feature=core type=router
//ff:what Router


export type { ParamIndexMap } from './param_index_map.js'
export type { ParamStash } from './param_stash.js'
export type { Params } from './params.js'
export type { Result } from './result.js'
export type { Router } from './router_def.js'

/**
 * @module
 * This module provides types definitions and variables for the routers.
 */

/**
 * Constant representing all HTTP methods in uppercase.
 */
export const METHOD_NAME_ALL = 'ALL' as const
/**
 * Constant representing all HTTP methods in lowercase.
 */
export const METHOD_NAME_ALL_LOWERCASE = 'all' as const
/**
 * Array of supported HTTP methods.
 */
export const METHODS = ['get', 'post', 'put', 'delete', 'options', 'patch'] as const
/**
 * Error message indicating that a route cannot be added because the matcher is already built.
 */
export const MESSAGE_MATCHER_IS_ALREADY_BUILT =
  'Can not add a route since the matcher is already built.'

/**
 * Error class representing an unsupported path error.
 */
export class UnsupportedPathError extends Error {}
