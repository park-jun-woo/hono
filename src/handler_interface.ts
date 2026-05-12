//ff:type feature=core type=model
//ff:what Handler interface
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
import type { AddSchemaIfHasResponse } from './add_schema_if_has_response.js'
import type { MergePath } from './merge_path.js'
import type { MergeTypedResponse } from './merge_typed_response.js'
import type { MergeMiddlewareResponse } from './merge_middleware_response.js'
import type { IntersectNonAnyTypes } from './intersect_non_any_types.js'

////////////////////////////////////////
//////                            //////
//////     HandlerInterface       //////
//////                            //////
////////////////////////////////////////
export interface HandlerInterface<
  E extends Env = Env,
  M extends string = string,
  S extends Schema = BlankSchema,
  BasePath extends string = '/',
  CurrentPath extends string = BasePath,
> {
  // app.get(handler)
  <
    P extends string = CurrentPath,
    I extends Input = BlankInput,
    R extends HandlerResponse<any> = any,
    E2 extends Env = E,
  >(
    handler: H<E2, P, I, R>
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2]>,
    S & ToSchema<M, P, I, MergeTypedResponse<R>>,
    BasePath,
    CurrentPath
  >

  // app.get(handler x2)
  <
    P extends string = CurrentPath,
    I extends Input = BlankInput,
    I2 extends Input = I,
    R extends HandlerResponse<any> = any,
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    M1 extends H<E2, P, I> = H<E2, P, I>,
  >(
    ...handlers: [H<E2, P, I> & M1, H<E3, P, I2, R>]
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2, E3]>,
    S & ToSchema<M, P, I2, MergeTypedResponse<R> | MergeMiddlewareResponse<M1>>,
    BasePath,
    CurrentPath
  >

  // app.get(path, handler)
  <
    P extends string,
    MergedPath extends MergePath<BasePath, P>,
    R extends HandlerResponse<any> = any,
    I extends Input = BlankInput,
    E2 extends Env = E,
  >(
    path: P,
    handler: H<E2, MergedPath, I, R>
  ): HonoBase<
    E,
    AddSchemaIfHasResponse<MergeTypedResponse<R>, S, M, P, I, BasePath>,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.get(handler x 3)
  <
    P extends string = CurrentPath,
    R extends HandlerResponse<any> = any,
    I extends Input = BlankInput,
    I2 extends Input = I,
    I3 extends Input = I & I2,
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
    // Middleware
    M1 extends H<E2, P, I> = H<E2, P, I>,
    M2 extends H<E3, P, I2> = H<E3, P, I2>,
  >(
    ...handlers: [H<E2, P, I> & M1, H<E3, P, I2> & M2, H<E4, P, I3, R>]
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2, E3, E4]>,
    S &
      ToSchema<
        M,
        P,
        I3,
        MergeTypedResponse<R> | MergeMiddlewareResponse<M1> | MergeMiddlewareResponse<M2>
      >,
    BasePath,
    CurrentPath
  >

  // app.get(path, handler x2)
  <
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
    path: P,
    ...handlers: [H<E2, MergedPath, I> & M1, H<E3, MergedPath, I2, R>]
  ): HonoBase<
    E,
    AddSchemaIfHasResponse<
      MergeTypedResponse<R> | MergeMiddlewareResponse<M1>,
      S,
      M,
      P,
      I2,
      BasePath
    >,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.get(handler x 4)
  <
    P extends string = CurrentPath,
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
    M1 extends H<E2, P, I> = H<E2, P, I>,
    M2 extends H<E3, P, I2> = H<E3, P, I2>,
    M3 extends H<E4, P, I3> = H<E4, P, I3>,
  >(
    ...handlers: [H<E2, P, I> & M1, H<E3, P, I2> & M2, H<E4, P, I3> & M3, H<E5, P, I4, R>]
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2, E3, E4, E5]>,
    S &
      ToSchema<
        M,
        P,
        I4,
        | MergeTypedResponse<R>
        | MergeMiddlewareResponse<M1>
        | MergeMiddlewareResponse<M2>
        | MergeMiddlewareResponse<M3>
      >,
    BasePath,
    CurrentPath
  >

  // app.get(path, handler x3)
  <
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
    path: P,
    ...handlers: [H<E2, MergedPath, I> & M1, H<E3, MergedPath, I2> & M2, H<E4, MergedPath, I3, R>]
  ): HonoBase<
    E,
    AddSchemaIfHasResponse<
      MergeTypedResponse<R> | MergeMiddlewareResponse<M1> | MergeMiddlewareResponse<M2>,
      S,
      M,
      P,
      I3,
      BasePath
    >,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.get(handler x 5)
  <
    P extends string = CurrentPath,
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
    M1 extends H<E2, P, I> = H<E2, P, I>,
    M2 extends H<E3, P, I2> = H<E3, P, I2>,
    M3 extends H<E4, P, I3> = H<E4, P, I3>,
    M4 extends H<E5, P, I4> = H<E5, P, I4>,
  >(
    ...handlers: [
      H<E2, P, I> & M1,
      H<E3, P, I2> & M2,
      H<E4, P, I3> & M3,
      H<E5, P, I4> & M4,
      H<E6, P, I5, R>,
    ]
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>,
    S &
      ToSchema<
        M,
        P,
        I5,
        | MergeTypedResponse<R>
        | MergeMiddlewareResponse<M1>
        | MergeMiddlewareResponse<M2>
        | MergeMiddlewareResponse<M3>
        | MergeMiddlewareResponse<M4>
      >,
    BasePath,
    CurrentPath
  >

  // app.get(path, handler x4)
  <
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
    path: P,
    ...handlers: [
      H<E2, MergedPath, I> & M1,
      H<E3, MergedPath, I2> & M2,
      H<E4, MergedPath, I3> & M3,
      H<E5, MergedPath, I4, R>,
    ]
  ): HonoBase<
    E,
    AddSchemaIfHasResponse<
      | MergeTypedResponse<R>
      | MergeMiddlewareResponse<M1>
      | MergeMiddlewareResponse<M2>
      | MergeMiddlewareResponse<M3>,
      S,
      M,
      P,
      I4,
      BasePath
    >,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.get(handler x 6)
  <
    P extends string = CurrentPath,
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
    M1 extends H<E2, P, I> = H<E2, P, I>,
    M2 extends H<E3, P, I2> = H<E3, P, I2>,
    M3 extends H<E4, P, I3> = H<E4, P, I3>,
    M4 extends H<E5, P, I4> = H<E5, P, I4>,
    M5 extends H<E6, P, I5> = H<E6, P, I5>,
  >(
    ...handlers: [
      H<E2, P, I> & M1,
      H<E3, P, I2> & M2,
      H<E4, P, I3> & M3,
      H<E5, P, I4> & M4,
      H<E6, P, I5> & M5,
      H<E7, P, I6, R>,
    ]
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7]>,
    S &
      ToSchema<
        M,
        P,
        I6,
        | MergeTypedResponse<R>
        | MergeMiddlewareResponse<M1>
        | MergeMiddlewareResponse<M2>
        | MergeMiddlewareResponse<M3>
        | MergeMiddlewareResponse<M4>
        | MergeMiddlewareResponse<M5>
      >,
    BasePath,
    CurrentPath
  >

  // app.get(path, handler x5)
  <
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
    path: P,
    ...handlers: [
      H<E2, MergedPath, I> & M1,
      H<E3, MergedPath, I2> & M2,
      H<E4, MergedPath, I3> & M3,
      H<E5, MergedPath, I4> & M4,
      H<E6, MergedPath, I5, R>,
    ]
  ): HonoBase<
    E,
    AddSchemaIfHasResponse<
      | MergeTypedResponse<R>
      | MergeMiddlewareResponse<M1>
      | MergeMiddlewareResponse<M2>
      | MergeMiddlewareResponse<M3>
      | MergeMiddlewareResponse<M4>,
      S,
      M,
      P,
      I5,
      BasePath
    >,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.get(handler x 7)
  <
    P extends string = CurrentPath,
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
    M1 extends H<E2, P, I> = H<E2, P, I>,
    M2 extends H<E3, P, I2> = H<E3, P, I2>,
    M3 extends H<E4, P, I3> = H<E4, P, I3>,
    M4 extends H<E5, P, I4> = H<E5, P, I4>,
    M5 extends H<E6, P, I5> = H<E6, P, I5>,
    M6 extends H<E7, P, I6> = H<E7, P, I6>,
  >(
    ...handlers: [
      H<E2, P, I> & M1,
      H<E3, P, I2> & M2,
      H<E4, P, I3> & M3,
      H<E5, P, I4> & M4,
      H<E6, P, I5> & M5,
      H<E7, P, I6> & M6,
      H<E8, P, I7, R>,
    ]
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8]>,
    S &
      ToSchema<
        M,
        P,
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
    CurrentPath
  >

  // app.get(path, handler x6)
  <
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
    E,
    AddSchemaIfHasResponse<
      | MergeTypedResponse<R>
      | MergeMiddlewareResponse<M1>
      | MergeMiddlewareResponse<M2>
      | MergeMiddlewareResponse<M3>
      | MergeMiddlewareResponse<M4>
      | MergeMiddlewareResponse<M5>,
      S,
      M,
      P,
      I6,
      BasePath
    >,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.get(handler x 8)
  <
    P extends string = CurrentPath,
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
    M1 extends H<E2, P, I> = H<E2, P, I>,
    M2 extends H<E3, P, I2> = H<E3, P, I2>,
    M3 extends H<E4, P, I3> = H<E4, P, I3>,
    M4 extends H<E5, P, I4> = H<E5, P, I4>,
    M5 extends H<E6, P, I5> = H<E6, P, I5>,
    M6 extends H<E7, P, I6> = H<E7, P, I6>,
    M7 extends H<E8, P, I7> = H<E8, P, I7>,
  >(
    ...handlers: [
      H<E2, P, I> & M1,
      H<E3, P, I2> & M2,
      H<E4, P, I3> & M3,
      H<E5, P, I4> & M4,
      H<E6, P, I5> & M5,
      H<E7, P, I6> & M6,
      H<E8, P, I7> & M7,
      H<E9, P, I8, R>,
    ]
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9]>,
    S &
      ToSchema<
        M,
        P,
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
    CurrentPath
  >

  // app.get(path, handler x7)
  <
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
    E,
    AddSchemaIfHasResponse<
      | MergeTypedResponse<R>
      | MergeMiddlewareResponse<M1>
      | MergeMiddlewareResponse<M2>
      | MergeMiddlewareResponse<M3>
      | MergeMiddlewareResponse<M4>
      | MergeMiddlewareResponse<M5>
      | MergeMiddlewareResponse<M6>,
      S,
      M,
      P,
      I7,
      BasePath
    >,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.get(handler x 9)
  <
    P extends string = CurrentPath,
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
    M1 extends H<E2, P, I> = H<E2, P, I>,
    M2 extends H<E3, P, I2> = H<E3, P, I2>,
    M3 extends H<E4, P, I3> = H<E4, P, I3>,
    M4 extends H<E5, P, I4> = H<E5, P, I4>,
    M5 extends H<E6, P, I5> = H<E6, P, I5>,
    M6 extends H<E7, P, I6> = H<E7, P, I6>,
    M7 extends H<E8, P, I7> = H<E8, P, I7>,
    M8 extends H<E9, P, I8> = H<E9, P, I8>,
  >(
    ...handlers: [
      H<E2, P, I> & M1,
      H<E3, P, I2> & M2,
      H<E4, P, I3> & M3,
      H<E5, P, I4> & M4,
      H<E6, P, I5> & M5,
      H<E7, P, I6> & M6,
      H<E8, P, I7> & M7,
      H<E9, P, I8> & M8,
      H<E10, P, I9, R>,
    ]
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9, E10]>,
    S &
      ToSchema<
        M,
        P,
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
    CurrentPath
  >

  // app.get(path, handler x8)
  <
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
    E,
    AddSchemaIfHasResponse<
      | MergeTypedResponse<R>
      | MergeMiddlewareResponse<M1>
      | MergeMiddlewareResponse<M2>
      | MergeMiddlewareResponse<M3>
      | MergeMiddlewareResponse<M4>
      | MergeMiddlewareResponse<M5>
      | MergeMiddlewareResponse<M6>
      | MergeMiddlewareResponse<M7>,
      S,
      M,
      P,
      I8,
      BasePath
    >,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.get(handler x 10)
  <
    P extends string = CurrentPath,
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
    M1 extends H<E2, P, I> = H<E2, P, I>,
    M2 extends H<E3, P, I2> = H<E3, P, I2>,
    M3 extends H<E4, P, I3> = H<E4, P, I3>,
    M4 extends H<E5, P, I4> = H<E5, P, I4>,
    M5 extends H<E6, P, I5> = H<E6, P, I5>,
    M6 extends H<E7, P, I6> = H<E7, P, I6>,
    M7 extends H<E8, P, I7> = H<E8, P, I7>,
    M8 extends H<E9, P, I8> = H<E9, P, I8>,
    M9 extends H<E10, P, I9> = H<E10, P, I9>,
  >(
    ...handlers: [
      H<E2, P, I> & M1,
      H<E3, P, I2> & M2,
      H<E4, P, I3> & M3,
      H<E5, P, I4> & M4,
      H<E6, P, I5> & M5,
      H<E7, P, I6> & M6,
      H<E8, P, I7> & M7,
      H<E9, P, I8> & M8,
      H<E10, P, I9> & M9,
      H<E11, P, I10, R>,
    ]
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9, E10, E11]>,
    S &
      ToSchema<
        M,
        P,
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
    CurrentPath
  >

  // app.get(path, handler x9)
  <
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
    E,
    AddSchemaIfHasResponse<
      | MergeTypedResponse<R>
      | MergeMiddlewareResponse<M1>
      | MergeMiddlewareResponse<M2>
      | MergeMiddlewareResponse<M3>
      | MergeMiddlewareResponse<M4>
      | MergeMiddlewareResponse<M5>
      | MergeMiddlewareResponse<M6>
      | MergeMiddlewareResponse<M7>
      | MergeMiddlewareResponse<M8>,
      S,
      M,
      P,
      I9,
      BasePath
    >,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.get(path, handler x10)
  <
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
    E,
    AddSchemaIfHasResponse<
      | MergeTypedResponse<R>
      | MergeMiddlewareResponse<M1>
      | MergeMiddlewareResponse<M2>
      | MergeMiddlewareResponse<M3>
      | MergeMiddlewareResponse<M4>
      | MergeMiddlewareResponse<M5>
      | MergeMiddlewareResponse<M6>
      | MergeMiddlewareResponse<M7>
      | MergeMiddlewareResponse<M8>
      | MergeMiddlewareResponse<M9>,
      S,
      M,
      P,
      I10,
      BasePath
    >,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.get(...handlers[])
  <
    P extends string = CurrentPath,
    I extends Input = BlankInput,
    R extends HandlerResponse<any> = any,
  >(
    ...handlers: H<E, P, I, R>[]
  ): HonoBase<E, S & ToSchema<M, P, I, MergeTypedResponse<R>>, BasePath, CurrentPath>

  // app.get(path, ...handlers[])
  <P extends string, I extends Input = BlankInput, R extends HandlerResponse<any> = any>(
    path: P,
    ...handlers: [H<E, MergePath<BasePath, P>, I, R>, ...H<E, MergePath<BasePath, P>, I, R>[]]
  ): HonoBase<
    E,
    S & ToSchema<M, MergePath<BasePath, P>, I, MergeTypedResponse<R>>,
    BasePath,
    MergePath<BasePath, P>
  >

  // app.get(path)
  <P extends string, R extends HandlerResponse<any> = any, I extends Input = BlankInput>(
    path: P
  ): HonoBase<
    E,
    S & ToSchema<M, MergePath<BasePath, P>, I, MergeTypedResponse<R>>,
    BasePath,
    MergePath<BasePath, P>
  >
}
