//ff:type feature=core type=handler
//ff:what Middleware handler interface
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
import type { BlankSchema } from './blank_schema.js'
import type { MiddlewareHandler } from './middleware_handler.js'
import type { Schema } from './schema.js'
import type { MergePath } from './merge_path.js'
import type { IntersectNonAnyTypes } from './intersect_non_any_types.js'

////////////////////////////////////////
//////                            //////
////// MiddlewareHandlerInterface //////
//////                            //////
////////////////////////////////////////
export interface MiddlewareHandlerInterface<
  E extends Env = Env,
  S extends Schema = BlankSchema,
  BasePath extends string = '/',
> {
  //// app.use(...handlers[])
  <E2 extends Env = E>(
    ...handlers: MiddlewareHandler<E2, MergePath<BasePath, '*'>>[]
  ): HonoBase<IntersectNonAnyTypes<[E, E2]>, S, BasePath, MergePath<BasePath, '*'>>

  // app.use(handler)
  <E2 extends Env = E>(
    handler: MiddlewareHandler<E2, MergePath<BasePath, '*'>>
  ): HonoBase<IntersectNonAnyTypes<[E, E2]>, S, BasePath, MergePath<BasePath, '*'>>

  // app.use(handler x2)
  <
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    P extends string = MergePath<BasePath, '*'>,
  >(
    ...handlers: [MiddlewareHandler<E2, P>, MiddlewareHandler<E3, P>]
  ): HonoBase<IntersectNonAnyTypes<[E, E2, E3]>, S, BasePath, P>

  // app.use(path, handler)
  <P extends string, MergedPath extends MergePath<BasePath, P>, E2 extends Env = E>(
    path: P,
    handler: MiddlewareHandler<E2, MergedPath, any, any>
  ): HonoBase<IntersectNonAnyTypes<[E, E2]>, S, BasePath, MergedPath>

  // app.use(handler x3)
  <
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
    P extends string = MergePath<BasePath, '*'>,
  >(
    ...handlers: [
      MiddlewareHandler<E2, P, any, any>,
      MiddlewareHandler<E3, P, any, any>,
      MiddlewareHandler<E4, P, any, any>,
    ]
  ): HonoBase<IntersectNonAnyTypes<[E, E2, E3, E4]>, S, BasePath, P>

  // app.use(path, handler x2)
  <
    P extends string,
    MergedPath extends MergePath<BasePath, P>,
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
  >(
    path: P,
    ...handlers: [MiddlewareHandler<E2, P>, MiddlewareHandler<E3, P>]
  ): HonoBase<IntersectNonAnyTypes<[E, E2, E3]>, S, BasePath, MergedPath>

  // app.use(handler x4)
  <
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
    E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>,
    P extends string = MergePath<BasePath, '*'>,
  >(
    ...handlers: [
      MiddlewareHandler<E2, P>,
      MiddlewareHandler<E3, P>,
      MiddlewareHandler<E4, P>,
      MiddlewareHandler<E5, P>,
    ]
  ): HonoBase<IntersectNonAnyTypes<[E, E2, E3, E4, E5]>, S, BasePath, P>

  // app.use(path, handler x3)
  <
    P extends string,
    MergedPath extends MergePath<BasePath, P>,
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
  >(
    path: P,
    ...handlers: [MiddlewareHandler<E2, P>, MiddlewareHandler<E3, P>, MiddlewareHandler<E4, P>]
  ): HonoBase<IntersectNonAnyTypes<[E, E2, E3, E4]>, S, BasePath, MergedPath>

  // app.use(handler x5)
  <
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
    E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>,
    E6 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5]>,
    P extends string = MergePath<BasePath, '*'>,
  >(
    ...handlers: [
      MiddlewareHandler<E2, P>,
      MiddlewareHandler<E3, P>,
      MiddlewareHandler<E4, P>,
      MiddlewareHandler<E5, P>,
      MiddlewareHandler<E6, P>,
    ]
  ): HonoBase<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>, S, BasePath, P>

  // app.use(path, handler x4)
  <
    P extends string,
    MergedPath extends MergePath<BasePath, P>,
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
    E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>,
  >(
    path: P,
    ...handlers: [
      MiddlewareHandler<E2, P>,
      MiddlewareHandler<E3, P>,
      MiddlewareHandler<E4, P>,
      MiddlewareHandler<E5, P>,
    ]
  ): HonoBase<IntersectNonAnyTypes<[E, E2, E3, E4, E5]>, S, BasePath, MergedPath>

  // app.use(handler x6)
  <
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
    E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>,
    E6 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5]>,
    E7 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>,
    P extends string = MergePath<BasePath, '*'>,
  >(
    ...handlers: [
      MiddlewareHandler<E2, P>,
      MiddlewareHandler<E3, P>,
      MiddlewareHandler<E4, P>,
      MiddlewareHandler<E5, P>,
      MiddlewareHandler<E6, P>,
      MiddlewareHandler<E7, P>,
    ]
  ): HonoBase<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7]>, S, BasePath, P>

  // app.use(path, handler x5)
  <
    P extends string,
    MergedPath extends MergePath<BasePath, P>,
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
    E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>,
    E6 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5]>,
  >(
    path: P,
    ...handlers: [
      MiddlewareHandler<E2, P>,
      MiddlewareHandler<E3, P>,
      MiddlewareHandler<E4, P>,
      MiddlewareHandler<E5, P>,
      MiddlewareHandler<E6, P>,
    ]
  ): HonoBase<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>, S, BasePath, MergedPath>

  // app.use(handler x7)
  <
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
    E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>,
    E6 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5]>,
    E7 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>,
    E8 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7]>,
    P extends string = MergePath<BasePath, '*'>,
  >(
    ...handlers: [
      MiddlewareHandler<E2, P>,
      MiddlewareHandler<E3, P>,
      MiddlewareHandler<E4, P>,
      MiddlewareHandler<E5, P>,
      MiddlewareHandler<E6, P>,
      MiddlewareHandler<E7, P>,
      MiddlewareHandler<E8, P>,
    ]
  ): HonoBase<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8]>, S, BasePath, P>

  // app.use(path, handler x6)
  <
    P extends string,
    MergedPath extends MergePath<BasePath, P>,
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
    E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>,
    E6 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5]>,
    E7 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>,
  >(
    path: P,
    ...handlers: [
      MiddlewareHandler<E2, P>,
      MiddlewareHandler<E3, P>,
      MiddlewareHandler<E4, P>,
      MiddlewareHandler<E5, P>,
      MiddlewareHandler<E6, P>,
      MiddlewareHandler<E7, P>,
    ]
  ): HonoBase<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7]>, S, BasePath, MergedPath>

  // app.use(handler x8)
  <
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
    E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>,
    E6 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5]>,
    E7 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>,
    E8 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7]>,
    E9 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8]>,
    P extends string = MergePath<BasePath, '*'>,
  >(
    ...handlers: [
      MiddlewareHandler<E2, P>,
      MiddlewareHandler<E3, P>,
      MiddlewareHandler<E4, P>,
      MiddlewareHandler<E5, P>,
      MiddlewareHandler<E6, P>,
      MiddlewareHandler<E7, P>,
      MiddlewareHandler<E8, P>,
      MiddlewareHandler<E9, P>,
    ]
  ): HonoBase<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9]>, S, BasePath, P>

  // app.use(path, handler x7)
  <
    P extends string,
    MergedPath extends MergePath<BasePath, P>,
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
    E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>,
    E6 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5]>,
    E7 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>,
    E8 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7]>,
  >(
    path: P,
    ...handlers: [
      MiddlewareHandler<E2, P>,
      MiddlewareHandler<E3, P>,
      MiddlewareHandler<E4, P>,
      MiddlewareHandler<E5, P>,
      MiddlewareHandler<E6, P>,
      MiddlewareHandler<E7, P>,
      MiddlewareHandler<E8, P>,
    ]
  ): HonoBase<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8]>, S, BasePath, MergedPath>

  // app.use(handler x9)
  <
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
    E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>,
    E6 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5]>,
    E7 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>,
    E8 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7]>,
    E9 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8]>,
    E10 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9]>,
    P extends string = MergePath<BasePath, '*'>,
  >(
    ...handlers: [
      MiddlewareHandler<E2, P>,
      MiddlewareHandler<E3, P>,
      MiddlewareHandler<E4, P>,
      MiddlewareHandler<E5, P>,
      MiddlewareHandler<E6, P>,
      MiddlewareHandler<E7, P>,
      MiddlewareHandler<E8, P>,
      MiddlewareHandler<E9, P>,
      MiddlewareHandler<E10, P>,
    ]
  ): HonoBase<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9, E10]>, S, BasePath, P>

  // app.use(path, handler x8)
  <
    P extends string,
    MergedPath extends MergePath<BasePath, P>,
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
    E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>,
    E6 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5]>,
    E7 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>,
    E8 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7]>,
    E9 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8]>,
  >(
    path: P,
    ...handlers: [
      MiddlewareHandler<E2, P>,
      MiddlewareHandler<E3, P>,
      MiddlewareHandler<E4, P>,
      MiddlewareHandler<E5, P>,
      MiddlewareHandler<E6, P>,
      MiddlewareHandler<E7, P>,
      MiddlewareHandler<E8, P>,
      MiddlewareHandler<E9, P>,
    ]
  ): HonoBase<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9]>, S, BasePath, MergedPath>

  // app.use(handler x10)
  <
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
    P extends string = MergePath<BasePath, '*'>,
  >(
    ...handlers: [
      MiddlewareHandler<E2, P>,
      MiddlewareHandler<E3, P>,
      MiddlewareHandler<E4, P>,
      MiddlewareHandler<E5, P>,
      MiddlewareHandler<E6, P>,
      MiddlewareHandler<E7, P>,
      MiddlewareHandler<E8, P>,
      MiddlewareHandler<E9, P>,
      MiddlewareHandler<E10, P>,
      MiddlewareHandler<E11, P>,
    ]
  ): HonoBase<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9, E10, E11]>, S, BasePath, P>

  // app.use(path, handler x9)
  <
    P extends string,
    MergedPath extends MergePath<BasePath, P>,
    E2 extends Env = E,
    E3 extends Env = IntersectNonAnyTypes<[E, E2]>,
    E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>,
    E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>,
    E6 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5]>,
    E7 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>,
    E8 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7]>,
    E9 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8]>,
    E10 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9]>,
  >(
    path: P,
    ...handlers: [
      MiddlewareHandler<E2, P>,
      MiddlewareHandler<E3, P>,
      MiddlewareHandler<E4, P>,
      MiddlewareHandler<E5, P>,
      MiddlewareHandler<E6, P>,
      MiddlewareHandler<E7, P>,
      MiddlewareHandler<E8, P>,
      MiddlewareHandler<E9, P>,
      MiddlewareHandler<E10, P>,
    ]
  ): HonoBase<
    IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9, E10]>,
    S,
    BasePath,
    MergedPath
  >

  //// app.use(path, ...handlers[])
  <P extends string, E2 extends Env = E>(
    path: P,
    ...handlers: MiddlewareHandler<E2, MergePath<BasePath, P>>[]
  ): HonoBase<E, S, BasePath, MergePath<BasePath, P>>
}
