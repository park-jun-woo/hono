//ff:type feature=core type=model
//ff:what Merge endpoint params with path
import type { Context } from './context'
import type { HonoBase } from './hono-base'
import type { CustomHeader, RequestHeader } from './utils/headers'
import type { StatusCode } from './utils/http-status'
import type {
  IfAnyThenEmptyObject,
  IsAny,
  JSONValue,
  RemoveBlankRecord,
  Simplify,
  UnionToIntersection,
} from './utils/types'
import type { Endpoint } from './endpoint.js'
import type { ExtractParams } from './extract_params.js'
import type { FlattenIfIntersect } from './flatten_if_intersect.js'

export type MergeEndpointParamsWithPath<T extends Endpoint, SubPath extends string> = T extends unknown
  ? {
      input: T['input'] extends { param: infer _ }
        ? ExtractParams<SubPath> extends never
          ? T['input']
          : FlattenIfIntersect<
              T['input'] & {
                param: {
                  // Maps extracted keys, stripping braces, to a string-typed record.
                  [K in keyof ExtractParams<SubPath> as K extends `${infer Prefix}{${infer _}}`
                    ? Prefix
                    : K]: string
                }
              }
            >
        : RemoveBlankRecord<ExtractParams<SubPath>> extends never
          ? T['input']
          : T['input'] & {
              // Maps extracted keys, stripping braces, to a string-typed record.
              param: {
                [K in keyof ExtractParams<SubPath> as K extends `${infer Prefix}{${infer _}}`
                  ? Prefix
                  : K]: string
              }
            }
      output: T['output']
      outputFormat: T['outputFormat']
      status: T['status']
    }
  : never
