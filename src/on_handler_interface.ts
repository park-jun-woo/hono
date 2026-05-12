//ff:type feature=core type=model
//ff:what On handler interface
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
import type { Env } from './env.js'
import type { Input } from './input.js'
import type { BlankSchema } from './blank_schema.js'
import type { BlankInput } from './blank_input.js'
import type { HandlerResponse } from './handler_response.js'
import type { H } from './h.js'
import type { ToSchema } from './to_schema.js'
import type { Schema } from './schema.js'
import type { MergePath } from './merge_path.js'
import type { MergeTypedResponse } from './merge_typed_response.js'
import type { MergeMiddlewareResponse } from './merge_middleware_response.js'
import type { IntersectNonAnyTypes } from './intersect_non_any_types.js'

////////////////////////////////////////
//////                            //////
//////     OnHandlerInterface     //////
//////                            //////
////////////////////////////////////////
export interface OnHandlerInterface<
  E extends Env = Env,
  S extends Schema = BlankSchema,
  BasePath extends string = '/',
> {
  // app.on(method, path, handler)
  <
    M extends string,
    P extends string,
    MergedPath extends MergePath<BasePath, P>,
    R extends HandlerResponse<any> = any,
    I extends Input = BlankInput,
    E2 extends Env = E,
  >(
    method: M,
    path: P,
    handler: H<E2, MergedPath, I, R>
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2]>,
    S & ToSchema<M, MergePath<BasePath, P>, I, MergeTypedResponse<R>>,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.on(method, path, handler x2)
  <
    M extends string,
    P extends string,
    MergedPath extends MergePath<BasePath, P>,
    R extends HandlerResponse<any> = any,
    I extends Input = BlankInput,
    I2 extends Input = I,
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    // Middleware
    M1 extends H<E2, MergedPath, I> = H<E2, MergedPath, I>,
  >(
    method: M,
    path: P,
    ...handlers: [H<E2, MergedPath, I> & M1, H<E3, MergedPath, I2, R>]
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2, E3]>,
    S &
      ToSchema<M, MergePath<BasePath, P>, I2, MergeTypedResponse<R> | MergeMiddlewareResponse<M1>>,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.on(method, path, handler x3)
  <
    M extends string,
    P extends string,
    MergedPath extends MergePath<BasePath, P>,
    R extends HandlerResponse<any> = any,
    I extends Input = BlankInput,
    I2 extends Input = I,
    I3 extends Input = I & I2,
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
    // Middleware
    M1 extends H<E2, MergedPath, I> = H<E2, MergedPath, I>,
    M2 extends H<E3, MergedPath, I2> = H<E3, MergedPath, I2>,
  >(
    method: M,
    path: P,
    ...handlers: [H<E2, MergedPath, I> & M1, H<E3, MergedPath, I2> & M2, H<E4, MergedPath, I3, R>]
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2, E3, E4]>,
    S &
      ToSchema<
        M,
        MergePath<BasePath, P>,
        I3,
        MergeTypedResponse<R> | MergeMiddlewareResponse<M1> | MergeMiddlewareResponse<M2>
      >,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.on(method, path, handler x4)
  <
    M extends string,
    P extends string,
    MergedPath extends MergePath<BasePath, P>,
    R extends HandlerResponse<any> = any,
    I extends Input = BlankInput,
    I2 extends Input = I,
    I3 extends Input = I & I2,
    I4 extends Input = I & I2 & I3,
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
    E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>,
    // Middleware
    M1 extends H<E2, MergedPath, I> = H<E2, MergedPath, I>,
    M2 extends H<E3, MergedPath, I2> = H<E3, MergedPath, I2>,
    M3 extends H<E4, MergedPath, I3> = H<E4, MergedPath, I3>,
  >(
    method: M,
    path: P,
    ...handlers: [
      H<E2, MergedPath, I> & M1,
      H<E3, MergedPath, I2> & M2,
      H<E4, MergedPath, I3> & M3,
      H<E5, MergedPath, I4, R>,
    ]
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2, E3, E4, E5]>,
    S &
      ToSchema<
        M,
        MergePath<BasePath, P>,
        I4,
        | MergeTypedResponse<R>
        | MergeMiddlewareResponse<M1>
        | MergeMiddlewareResponse<M2>
        | MergeMiddlewareResponse<M3>
      >,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.on(method, path, handler x5)
  <
    M extends string,
    P extends string,
    MergedPath extends MergePath<BasePath, P>,
    R extends HandlerResponse<any> = any,
    I extends Input = BlankInput,
    I2 extends Input = I,
    I3 extends Input = I & I2,
    I4 extends Input = I & I2 & I3,
    I5 extends Input = I & I2 & I3 & I4,
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
    E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>,
    E6 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5]>,
    // Middleware
    M1 extends H<E2, MergedPath, I> = H<E2, MergedPath, I>,
    M2 extends H<E3, MergedPath, I2> = H<E3, MergedPath, I2>,
    M3 extends H<E4, MergedPath, I3> = H<E4, MergedPath, I3>,
    M4 extends H<E5, MergedPath, I4> = H<E5, MergedPath, I4>,
  >(
    method: M,
    path: P,
    ...handlers: [
      H<E2, MergedPath, I> & M1,
      H<E3, MergedPath, I2> & M2,
      H<E4, MergedPath, I3> & M3,
      H<E5, MergedPath, I4> & M4,
      H<E6, MergedPath, I5, R>,
    ]
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>,
    S &
      ToSchema<
        M,
        MergePath<BasePath, P>,
        I5,
        | MergeTypedResponse<R>
        | MergeMiddlewareResponse<M1>
        | MergeMiddlewareResponse<M2>
        | MergeMiddlewareResponse<M3>
        | MergeMiddlewareResponse<M4>
      >,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.on(method, path, handler x6)
  <
    M extends string,
    P extends string,
    MergedPath extends MergePath<BasePath, P>,
    R extends HandlerResponse<any> = any,
    I extends Input = BlankInput,
    I2 extends Input = I,
    I3 extends Input = I & I2,
    I4 extends Input = I & I2 & I3,
    I5 extends Input = I & I2 & I3 & I4,
    I6 extends Input = I & I2 & I3 & I4 & I5,
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
    E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>,
    E6 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5]>,
    E7 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>,
    // Middleware
    M1 extends H<E2, MergedPath, I> = H<E2, MergedPath, I>,
    M2 extends H<E3, MergedPath, I2> = H<E3, MergedPath, I2>,
    M3 extends H<E4, MergedPath, I3> = H<E4, MergedPath, I3>,
    M4 extends H<E5, MergedPath, I4> = H<E5, MergedPath, I4>,
    M5 extends H<E6, MergedPath, I5> = H<E6, MergedPath, I5>,
  >(
    method: M,
    path: P,
    ...handlers: [
      H<E2, MergedPath, I> & M1,
      H<E3, MergedPath, I2> & M2,
      H<E4, MergedPath, I3> & M3,
      H<E5, MergedPath, I4> & M4,
      H<E6, MergedPath, I5> & M5,
      H<E7, MergedPath, I6, R>,
    ]
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7]>,
    S &
      ToSchema<
        M,
        MergePath<BasePath, P>,
        I6,
        | MergeTypedResponse<R>
        | MergeMiddlewareResponse<M1>
        | MergeMiddlewareResponse<M2>
        | MergeMiddlewareResponse<M3>
        | MergeMiddlewareResponse<M4>
        | MergeMiddlewareResponse<M5>
      >,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.on(method, path, handler x7)
  <
    M extends string,
    P extends string,
    MergedPath extends MergePath<BasePath, P>,
    R extends HandlerResponse<any> = any,
    I extends Input = BlankInput,
    I2 extends Input = I,
    I3 extends Input = I & I2,
    I4 extends Input = I & I2 & I3,
    I5 extends Input = I & I2 & I3 & I4,
    I6 extends Input = I & I2 & I3 & I4 & I5,
    I7 extends Input = I & I2 & I3 & I4 & I5 & I6,
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
    E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>,
    E6 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5]>,
    E7 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>,
    E8 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7]>,
    // Middleware
    M1 extends H<E2, MergedPath, I> = H<E2, MergedPath, I>,
    M2 extends H<E3, MergedPath, I2> = H<E3, MergedPath, I2>,
    M3 extends H<E4, MergedPath, I3> = H<E4, MergedPath, I3>,
    M4 extends H<E5, MergedPath, I4> = H<E5, MergedPath, I4>,
    M5 extends H<E6, MergedPath, I5> = H<E6, MergedPath, I5>,
    M6 extends H<E7, MergedPath, I6> = H<E7, MergedPath, I6>,
  >(
    method: M,
    path: P,
    ...handlers: [
      H<E2, MergedPath, I> & M1,
      H<E3, MergedPath, I2> & M2,
      H<E4, MergedPath, I3> & M3,
      H<E5, MergedPath, I4> & M4,
      H<E6, MergedPath, I5> & M5,
      H<E7, MergedPath, I6> & M6,
      H<E8, MergedPath, I7, R>,
    ]
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8]>,
    S &
      ToSchema<
        M,
        MergePath<BasePath, P>,
        I7,
        | MergeTypedResponse<R>
        | MergeMiddlewareResponse<M1>
        | MergeMiddlewareResponse<M2>
        | MergeMiddlewareResponse<M3>
        | MergeMiddlewareResponse<M4>
        | MergeMiddlewareResponse<M5>
        | MergeMiddlewareResponse<M6>
      >,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.on(method, path, handler x8)
  <
    M extends string,
    P extends string,
    MergedPath extends MergePath<BasePath, P>,
    R extends HandlerResponse<any> = any,
    I extends Input = BlankInput,
    I2 extends Input = I,
    I3 extends Input = I & I2,
    I4 extends Input = I & I2 & I3,
    I5 extends Input = I & I2 & I3 & I4,
    I6 extends Input = I & I2 & I3 & I4 & I5,
    I7 extends Input = I & I2 & I3 & I4 & I5 & I6,
    I8 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7,
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
    E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>,
    E6 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5]>,
    E7 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>,
    E8 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7]>,
    E9 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8]>,
    // Middleware
    M1 extends H<E2, MergedPath, I> = H<E2, MergedPath, I>,
    M2 extends H<E3, MergedPath, I2> = H<E3, MergedPath, I2>,
    M3 extends H<E4, MergedPath, I3> = H<E4, MergedPath, I3>,
    M4 extends H<E5, MergedPath, I4> = H<E5, MergedPath, I4>,
    M5 extends H<E6, MergedPath, I5> = H<E6, MergedPath, I5>,
    M6 extends H<E7, MergedPath, I6> = H<E7, MergedPath, I6>,
    M7 extends H<E8, MergedPath, I7> = H<E8, MergedPath, I7>,
  >(
    method: M,
    path: P,
    ...handlers: [
      H<E2, MergedPath, I> & M1,
      H<E3, MergedPath, I2> & M2,
      H<E4, MergedPath, I3> & M3,
      H<E5, MergedPath, I4> & M4,
      H<E6, MergedPath, I5> & M5,
      H<E7, MergedPath, I6> & M6,
      H<E8, MergedPath, I7> & M7,
      H<E9, MergedPath, I8, R>,
    ]
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9]>,
    S &
      ToSchema<
        M,
        MergePath<BasePath, P>,
        I8,
        | MergeTypedResponse<R>
        | MergeMiddlewareResponse<M1>
        | MergeMiddlewareResponse<M2>
        | MergeMiddlewareResponse<M3>
        | MergeMiddlewareResponse<M4>
        | MergeMiddlewareResponse<M5>
        | MergeMiddlewareResponse<M6>
        | MergeMiddlewareResponse<M7>
      >,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.on(method, path, handler x9)
  <
    M extends string,
    P extends string,
    MergedPath extends MergePath<BasePath, P>,
    R extends HandlerResponse<any> = any,
    I extends Input = BlankInput,
    I2 extends Input = I,
    I3 extends Input = I & I2,
    I4 extends Input = I & I2 & I3,
    I5 extends Input = I & I2 & I3 & I4,
    I6 extends Input = I & I2 & I3 & I4 & I5,
    I7 extends Input = I & I2 & I3 & I4 & I5 & I6,
    I8 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7,
    I9 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7 & I8,
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
    E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>,
    E6 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5]>,
    E7 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>,
    E8 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7]>,
    E9 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8]>,
    E10 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9]>,
    // Middleware
    M1 extends H<E2, MergedPath, I> = H<E2, MergedPath, I>,
    M2 extends H<E3, MergedPath, I2> = H<E3, MergedPath, I2>,
    M3 extends H<E4, MergedPath, I3> = H<E4, MergedPath, I3>,
    M4 extends H<E5, MergedPath, I4> = H<E5, MergedPath, I4>,
    M5 extends H<E6, MergedPath, I5> = H<E6, MergedPath, I5>,
    M6 extends H<E7, MergedPath, I6> = H<E7, MergedPath, I6>,
    M7 extends H<E8, MergedPath, I7> = H<E8, MergedPath, I7>,
    M8 extends H<E9, MergedPath, I8> = H<E9, MergedPath, I8>,
  >(
    method: M,
    path: P,
    ...handlers: [
      H<E2, MergedPath, I> & M1,
      H<E3, MergedPath, I2> & M2,
      H<E4, MergedPath, I3> & M3,
      H<E5, MergedPath, I4> & M4,
      H<E6, MergedPath, I5> & M5,
      H<E7, MergedPath, I6> & M6,
      H<E8, MergedPath, I7> & M7,
      H<E9, MergedPath, I8> & M8,
      H<E10, MergedPath, I9, R>,
    ]
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9, E10]>,
    S &
      ToSchema<
        M,
        MergePath<BasePath, P>,
        I9,
        | MergeTypedResponse<R>
        | MergeMiddlewareResponse<M1>
        | MergeMiddlewareResponse<M2>
        | MergeMiddlewareResponse<M3>
        | MergeMiddlewareResponse<M4>
        | MergeMiddlewareResponse<M5>
        | MergeMiddlewareResponse<M6>
        | MergeMiddlewareResponse<M7>
        | MergeMiddlewareResponse<M8>
      >,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.on(method, path, handler x10)
  <
    M extends string,
    P extends string,
    MergedPath extends MergePath<BasePath, P>,
    R extends HandlerResponse<any> = any,
    I extends Input = BlankInput,
    I2 extends Input = I,
    I3 extends Input = I & I2,
    I4 extends Input = I & I2 & I3,
    I5 extends Input = I & I2 & I3 & I4,
    I6 extends Input = I & I2 & I3 & I4 & I5,
    I7 extends Input = I & I2 & I3 & I4 & I5 & I6,
    I8 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7,
    I9 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7 & I8,
    I10 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7 & I8 & I9,
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
    E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>,
    E6 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5]>,
    E7 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>,
    E8 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7]>,
    E9 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8]>,
    E10 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9]>,
    E11 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9, E10]>,
    // Middleware
    M1 extends H<E2, MergedPath, I> = H<E2, MergedPath, I>,
    M2 extends H<E3, MergedPath, I2> = H<E3, MergedPath, I2>,
    M3 extends H<E4, MergedPath, I3> = H<E4, MergedPath, I3>,
    M4 extends H<E5, MergedPath, I4> = H<E5, MergedPath, I4>,
    M5 extends H<E6, MergedPath, I5> = H<E6, MergedPath, I5>,
    M6 extends H<E7, MergedPath, I6> = H<E7, MergedPath, I6>,
    M7 extends H<E8, MergedPath, I7> = H<E8, MergedPath, I7>,
    M8 extends H<E9, MergedPath, I8> = H<E9, MergedPath, I8>,
    M9 extends H<E10, MergedPath, I9> = H<E10, MergedPath, I9>,
  >(
    method: M,
    path: P,
    ...handlers: [
      H<E2, MergedPath, I> & M1,
      H<E3, MergedPath, I2> & M2,
      H<E4, MergedPath, I3> & M3,
      H<E5, MergedPath, I4> & M4,
      H<E6, MergedPath, I5> & M5,
      H<E7, MergedPath, I6> & M6,
      H<E8, MergedPath, I7> & M7,
      H<E9, MergedPath, I8> & M8,
      H<E10, MergedPath, I9> & M9,
      H<E11, MergedPath, I10, R>,
    ]
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9, E10, E11]>,
    S &
      ToSchema<
        M,
        MergePath<BasePath, P>,
        I10,
        | MergeTypedResponse<R>
        | MergeMiddlewareResponse<M1>
        | MergeMiddlewareResponse<M2>
        | MergeMiddlewareResponse<M3>
        | MergeMiddlewareResponse<M4>
        | MergeMiddlewareResponse<M5>
        | MergeMiddlewareResponse<M6>
        | MergeMiddlewareResponse<M7>
        | MergeMiddlewareResponse<M8>
        | MergeMiddlewareResponse<M9>
      >,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.on(method, path, ...handler)
  <
    M extends string,
    P extends string,
    R extends HandlerResponse<any> = any,
    I extends Input = BlankInput,
  >(
    method: M,
    path: P,
    ...handlers: [H<E, MergePath<BasePath, P>, I, R>, ...H<E, MergePath<BasePath, P>, I, R>[]]
  ): HonoBase<
    E,
    S & ToSchema<M, MergePath<BasePath, P>, I, MergeTypedResponse<R>>,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.on(method[], path, handler)
  <
    M extends string,
    P extends string,
    MergedPath extends MergePath<BasePath, P>,
    R extends HandlerResponse<any> = any,
    I extends Input = BlankInput,
    E2 extends Env = E,
  >(
    methods: M[],
    path: P,
    handler: H<E2, MergedPath, I, R>
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2]>,
    S & ToSchema<M, MergePath<BasePath, P>, I, MergeTypedResponse<R>>,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.on(method[], path, handler x2)
  <
    M extends string,
    P extends string,
    MergedPath extends MergePath<BasePath, P>,
    R extends HandlerResponse<any> = any,
    I extends Input = BlankInput,
    I2 extends Input = I,
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    // Middleware
    M1 extends H<E2, MergedPath, I> = H<E2, MergedPath, I>,
  >(
    methods: M[],
    path: P,
    ...handlers: [H<E2, MergedPath, I> & M1, H<E3, MergedPath, I2, R>]
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2, E3]>,
    S &
      ToSchema<M, MergePath<BasePath, P>, I2, MergeTypedResponse<R> | MergeMiddlewareResponse<M1>>,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.on(method[], path, handler x3)
  <
    M extends string,
    P extends string,
    MergedPath extends MergePath<BasePath, P>,
    R extends HandlerResponse<any> = any,
    I extends Input = BlankInput,
    I2 extends Input = I,
    I3 extends Input = I & I2,
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
    // Middleware
    M1 extends H<E2, MergedPath, I> = H<E2, MergedPath, I>,
    M2 extends H<E3, MergedPath, I2> = H<E3, MergedPath, I2>,
  >(
    methods: M[],
    path: P,
    ...handlers: [H<E2, MergedPath, I> & M1, H<E3, MergedPath, I2> & M2, H<E4, MergedPath, I3, R>]
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2, E3, E4]>,
    S &
      ToSchema<
        M,
        MergePath<BasePath, P>,
        I3,
        MergeTypedResponse<R> | MergeMiddlewareResponse<M1> | MergeMiddlewareResponse<M2>
      >,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.on(method[], path, handler x4)
  <
    M extends string,
    P extends string,
    MergedPath extends MergePath<BasePath, P>,
    R extends HandlerResponse<any> = any,
    I extends Input = BlankInput,
    I2 extends Input = I,
    I3 extends Input = I & I2,
    I4 extends Input = I & I2 & I3,
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
    E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>,
    // Middleware
    M1 extends H<E2, MergedPath, I> = H<E2, MergedPath, I>,
    M2 extends H<E3, MergedPath, I2> = H<E3, MergedPath, I2>,
    M3 extends H<E4, MergedPath, I3> = H<E4, MergedPath, I3>,
  >(
    methods: M[],
    path: P,
    ...handlers: [
      H<E2, MergedPath, I> & M1,
      H<E3, MergedPath, I2> & M2,
      H<E4, MergedPath, I3> & M3,
      H<E5, MergedPath, I4, R>,
    ]
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2, E3, E4, E5]>,
    S &
      ToSchema<
        M,
        MergePath<BasePath, P>,
        I4,
        | MergeTypedResponse<R>
        | MergeMiddlewareResponse<M1>
        | MergeMiddlewareResponse<M2>
        | MergeMiddlewareResponse<M3>
      >,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.on(method[], path, handler x5)
  <
    M extends string,
    P extends string,
    MergedPath extends MergePath<BasePath, P>,
    R extends HandlerResponse<any> = any,
    I extends Input = BlankInput,
    I2 extends Input = I,
    I3 extends Input = I & I2,
    I4 extends Input = I & I2 & I3,
    I5 extends Input = I & I2 & I3 & I4,
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
    E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>,
    E6 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5]>,
    // Middleware
    M1 extends H<E2, MergedPath, I> = H<E2, MergedPath, I>,
    M2 extends H<E3, MergedPath, I2> = H<E3, MergedPath, I2>,
    M3 extends H<E4, MergedPath, I3> = H<E4, MergedPath, I3>,
    M4 extends H<E5, MergedPath, I4> = H<E5, MergedPath, I4>,
  >(
    methods: M[],
    path: P,
    ...handlers: [
      H<E2, MergedPath, I> & M1,
      H<E3, MergedPath, I2> & M2,
      H<E4, MergedPath, I3> & M3,
      H<E5, MergedPath, I4> & M4,
      H<E6, MergedPath, I5, R>,
    ]
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>,
    S &
      ToSchema<
        M,
        MergePath<BasePath, P>,
        I5,
        | MergeTypedResponse<R>
        | MergeMiddlewareResponse<M1>
        | MergeMiddlewareResponse<M2>
        | MergeMiddlewareResponse<M3>
        | MergeMiddlewareResponse<M4>
      >,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.on(method[], path, handler x6)
  <
    M extends string,
    P extends string,
    MergedPath extends MergePath<BasePath, P>,
    R extends HandlerResponse<any> = any,
    I extends Input = BlankInput,
    I2 extends Input = I,
    I3 extends Input = I & I2,
    I4 extends Input = I & I2 & I3,
    I5 extends Input = I & I2 & I3 & I4,
    I6 extends Input = I & I2 & I3 & I4 & I5,
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
    E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>,
    E6 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5]>,
    E7 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>,
    // Middleware
    M1 extends H<E2, MergedPath, I> = H<E2, MergedPath, I>,
    M2 extends H<E3, MergedPath, I2> = H<E3, MergedPath, I2>,
    M3 extends H<E4, MergedPath, I3> = H<E4, MergedPath, I3>,
    M4 extends H<E5, MergedPath, I4> = H<E5, MergedPath, I4>,
    M5 extends H<E6, MergedPath, I5> = H<E6, MergedPath, I5>,
  >(
    methods: M[],
    path: P,
    ...handlers: [
      H<E2, MergedPath, I> & M1,
      H<E3, MergedPath, I2> & M2,
      H<E4, MergedPath, I3> & M3,
      H<E5, MergedPath, I4> & M4,
      H<E6, MergedPath, I5> & M5,
      H<E7, MergedPath, I6, R>,
    ]
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7]>,
    S &
      ToSchema<
        M,
        MergePath<BasePath, P>,
        I6,
        | MergeTypedResponse<R>
        | MergeMiddlewareResponse<M1>
        | MergeMiddlewareResponse<M2>
        | MergeMiddlewareResponse<M3>
        | MergeMiddlewareResponse<M4>
        | MergeMiddlewareResponse<M5>
      >,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.on(method[], path, handler x7)
  <
    M extends string,
    P extends string,
    MergedPath extends MergePath<BasePath, P>,
    R extends HandlerResponse<any> = any,
    I extends Input = BlankInput,
    I2 extends Input = I,
    I3 extends Input = I & I2,
    I4 extends Input = I & I2 & I3,
    I5 extends Input = I & I2 & I3 & I4,
    I6 extends Input = I & I2 & I3 & I4 & I5,
    I7 extends Input = I & I2 & I3 & I4 & I5 & I6,
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
    E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>,
    E6 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5]>,
    E7 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>,
    E8 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7]>,
    // Middleware
    M1 extends H<E2, MergedPath, I> = H<E2, MergedPath, I>,
    M2 extends H<E3, MergedPath, I2> = H<E3, MergedPath, I2>,
    M3 extends H<E4, MergedPath, I3> = H<E4, MergedPath, I3>,
    M4 extends H<E5, MergedPath, I4> = H<E5, MergedPath, I4>,
    M5 extends H<E6, MergedPath, I5> = H<E6, MergedPath, I5>,
    M6 extends H<E7, MergedPath, I6> = H<E7, MergedPath, I6>,
  >(
    methods: M[],
    path: P,
    ...handlers: [
      H<E2, MergedPath, I> & M1,
      H<E3, MergedPath, I2> & M2,
      H<E4, MergedPath, I3> & M3,
      H<E5, MergedPath, I4> & M4,
      H<E6, MergedPath, I5> & M5,
      H<E7, MergedPath, I6> & M6,
      H<E8, MergedPath, I7, R>,
    ]
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8]>,
    S &
      ToSchema<
        M,
        MergePath<BasePath, P>,
        I7,
        | MergeTypedResponse<R>
        | MergeMiddlewareResponse<M1>
        | MergeMiddlewareResponse<M2>
        | MergeMiddlewareResponse<M3>
        | MergeMiddlewareResponse<M4>
        | MergeMiddlewareResponse<M5>
        | MergeMiddlewareResponse<M6>
      >,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.on(method[], path, handler x8)
  <
    M extends string,
    P extends string,
    MergedPath extends MergePath<BasePath, P>,
    R extends HandlerResponse<any> = any,
    I extends Input = BlankInput,
    I2 extends Input = I,
    I3 extends Input = I & I2,
    I4 extends Input = I & I2 & I3,
    I5 extends Input = I & I2 & I3 & I4,
    I6 extends Input = I & I2 & I3 & I4 & I5,
    I7 extends Input = I & I2 & I3 & I4 & I5 & I6,
    I8 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7,
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
    E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>,
    E6 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5]>,
    E7 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>,
    E8 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7]>,
    E9 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8]>,
    // Middleware
    M1 extends H<E2, MergedPath, I> = H<E2, MergedPath, I>,
    M2 extends H<E3, MergedPath, I2> = H<E3, MergedPath, I2>,
    M3 extends H<E4, MergedPath, I3> = H<E4, MergedPath, I3>,
    M4 extends H<E5, MergedPath, I4> = H<E5, MergedPath, I4>,
    M5 extends H<E6, MergedPath, I5> = H<E6, MergedPath, I5>,
    M6 extends H<E7, MergedPath, I6> = H<E7, MergedPath, I6>,
    M7 extends H<E8, MergedPath, I7> = H<E8, MergedPath, I7>,
  >(
    methods: M[],
    path: P,
    ...handlers: [
      H<E2, MergedPath, I> & M1,
      H<E3, MergedPath, I2> & M2,
      H<E4, MergedPath, I3> & M3,
      H<E5, MergedPath, I4> & M4,
      H<E6, MergedPath, I5> & M5,
      H<E7, MergedPath, I6> & M6,
      H<E8, MergedPath, I7> & M7,
      H<E9, MergedPath, I8, R>,
    ]
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9]>,
    S &
      ToSchema<
        M,
        MergePath<BasePath, P>,
        I8,
        | MergeTypedResponse<R>
        | MergeMiddlewareResponse<M1>
        | MergeMiddlewareResponse<M2>
        | MergeMiddlewareResponse<M3>
        | MergeMiddlewareResponse<M4>
        | MergeMiddlewareResponse<M5>
        | MergeMiddlewareResponse<M6>
        | MergeMiddlewareResponse<M7>
      >,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.on(method[], path, handler x9)
  <
    M extends string,
    P extends string,
    MergedPath extends MergePath<BasePath, P>,
    R extends HandlerResponse<any> = any,
    I extends Input = BlankInput,
    I2 extends Input = I,
    I3 extends Input = I & I2,
    I4 extends Input = I & I2 & I3,
    I5 extends Input = I & I2 & I3 & I4,
    I6 extends Input = I & I2 & I3 & I4 & I5,
    I7 extends Input = I & I2 & I3 & I4 & I5 & I6,
    I8 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7,
    I9 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7 & I8,
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
    E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>,
    E6 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5]>,
    E7 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>,
    E8 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7]>,
    E9 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8]>,
    E10 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9]>,
    // Middleware
    M1 extends H<E2, MergedPath, I> = H<E2, MergedPath, I>,
    M2 extends H<E3, MergedPath, I2> = H<E3, MergedPath, I2>,
    M3 extends H<E4, MergedPath, I3> = H<E4, MergedPath, I3>,
    M4 extends H<E5, MergedPath, I4> = H<E5, MergedPath, I4>,
    M5 extends H<E6, MergedPath, I5> = H<E6, MergedPath, I5>,
    M6 extends H<E7, MergedPath, I6> = H<E7, MergedPath, I6>,
    M7 extends H<E8, MergedPath, I7> = H<E8, MergedPath, I7>,
    M8 extends H<E9, MergedPath, I8> = H<E9, MergedPath, I8>,
  >(
    methods: M[],
    path: P,
    ...handlers: [
      H<E2, MergedPath, I> & M1,
      H<E3, MergedPath, I2> & M2,
      H<E4, MergedPath, I3> & M3,
      H<E5, MergedPath, I4> & M4,
      H<E6, MergedPath, I5> & M5,
      H<E7, MergedPath, I6> & M6,
      H<E8, MergedPath, I7> & M7,
      H<E9, MergedPath, I8> & M8,
      H<E10, MergedPath, I9, R>,
    ]
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9, E10]>,
    S &
      ToSchema<
        M,
        MergePath<BasePath, P>,
        I9,
        | MergeTypedResponse<R>
        | MergeMiddlewareResponse<M1>
        | MergeMiddlewareResponse<M2>
        | MergeMiddlewareResponse<M3>
        | MergeMiddlewareResponse<M4>
        | MergeMiddlewareResponse<M5>
        | MergeMiddlewareResponse<M6>
        | MergeMiddlewareResponse<M7>
        | MergeMiddlewareResponse<M8>
      >,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.on(method[], path, handler x10)
  <
    M extends string,
    P extends string,
    MergedPath extends MergePath<BasePath, P>,
    R extends HandlerResponse<any> = any,
    I extends Input = BlankInput,
    I2 extends Input = I,
    I3 extends Input = I & I2,
    I4 extends Input = I & I2 & I3,
    I5 extends Input = I & I2 & I3 & I4,
    I6 extends Input = I & I2 & I3 & I4 & I5,
    I7 extends Input = I & I2 & I3 & I4 & I5 & I6,
    I8 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7,
    I9 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7 & I8,
    I10 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7 & I8 & I9,
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
    E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>,
    E6 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5]>,
    E7 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>,
    E8 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7]>,
    E9 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8]>,
    E10 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9]>,
    E11 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9, E10]>,
    // Middleware
    M1 extends H<E2, MergedPath, I> = H<E2, MergedPath, I>,
    M2 extends H<E3, MergedPath, I2> = H<E3, MergedPath, I2>,
    M3 extends H<E4, MergedPath, I3> = H<E4, MergedPath, I3>,
    M4 extends H<E5, MergedPath, I4> = H<E5, MergedPath, I4>,
    M5 extends H<E6, MergedPath, I5> = H<E6, MergedPath, I5>,
    M6 extends H<E7, MergedPath, I6> = H<E7, MergedPath, I6>,
    M7 extends H<E8, MergedPath, I7> = H<E8, MergedPath, I7>,
    M8 extends H<E9, MergedPath, I8> = H<E9, MergedPath, I8>,
    M9 extends H<E10, MergedPath, I9> = H<E10, MergedPath, I9>,
  >(
    methods: M[],
    path: P,
    ...handlers: [
      H<E2, MergedPath, I> & M1,
      H<E3, MergedPath, I2> & M2,
      H<E4, MergedPath, I3> & M3,
      H<E5, MergedPath, I4> & M4,
      H<E6, MergedPath, I5> & M5,
      H<E7, MergedPath, I6> & M6,
      H<E8, MergedPath, I7> & M7,
      H<E9, MergedPath, I8> & M8,
      H<E10, MergedPath, I9> & M9,
      H<E11, MergedPath, I10, R>,
    ]
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9, E10, E11]>,
    S &
      ToSchema<
        M,
        MergePath<BasePath, P>,
        I10,
        | MergeTypedResponse<R>
        | MergeMiddlewareResponse<M1>
        | MergeMiddlewareResponse<M2>
        | MergeMiddlewareResponse<M3>
        | MergeMiddlewareResponse<M4>
        | MergeMiddlewareResponse<M5>
        | MergeMiddlewareResponse<M6>
        | MergeMiddlewareResponse<M7>
        | MergeMiddlewareResponse<M8>
        | MergeMiddlewareResponse<M9>
      >,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.on(method[], path, ...handlers[])
  <
    M extends string,
    P extends string,
    R extends HandlerResponse<any> = any,
    I extends Input = BlankInput,
  >(
    methods: M[],
    path: P,
    ...handlers: [H<E, MergePath<BasePath, P>, I, R>, ...H<E, MergePath<BasePath, P>, I, R>[]]
  ): HonoBase<
    E,
    S & ToSchema<M, MergePath<BasePath, P>, I, MergeTypedResponse<R>>,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.on(method | method[], path[], ...handlers[])
  <
    M extends string,
    const Ps extends string[],
    I extends Input = BlankInput,
    R extends HandlerResponse<any> = any,
    E2 extends Env = E,
  >(
    methods: M | M[],
    paths: Ps,
    ...handlers: H<E2, MergePath<BasePath, Ps[number]>, I, R>[]
  ): HonoBase<
    E,
    S & ToSchema<M, MergePath<BasePath, Ps[number]>, I, MergeTypedResponse<R>>,
    BasePath,
    Ps extends [...string[], infer LastPath extends string] ? MergePath<BasePath, LastPath> : never
  >
}
