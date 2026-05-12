//ff:type feature=helper type=model
//ff:what Index
/**
 * @module
 * Factory Helper for Hono.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Hono } from '../../hono'
import type { HonoOptions } from '../../hono-base'
import type {
  Env,
  H,
  HandlerResponse,
  Input,
  IntersectNonAnyTypes,
  MiddlewareHandler,
} from '../../types'
import type { InitApp } from './init_app.js'
import type { CreateHandlersInterface } from './create_handlers_interface.js'

export type { InitApp } from './init_app.js'
export type { CreateHandlersInterface } from './create_handlers_interface.js'


export class Factory<E extends Env = Env, P extends string = string> {
  private initApp?: InitApp<E>
  #defaultAppOptions?: HonoOptions<E>

  constructor(init?: { initApp?: InitApp<E>; defaultAppOptions?: HonoOptions<E> }) {
    this.initApp = init?.initApp
    this.#defaultAppOptions = init?.defaultAppOptions
  }

  createApp = (options?: HonoOptions<E>): Hono<E> => {
    const app = new Hono<E>(
      options && this.#defaultAppOptions
        ? { ...this.#defaultAppOptions, ...options }
        : (options ?? this.#defaultAppOptions)
    )
    if (this.initApp) {
      this.initApp(app)
    }
    return app
  }

  createMiddleware = <I extends Input = {}, R extends HandlerResponse<any> | void = void>(
    middleware: MiddlewareHandler<E, P, I, R extends void ? Response : R>
  ): MiddlewareHandler<E, P, I, R extends void ? Response : R> => middleware

  createHandlers: CreateHandlersInterface<E, P> = (...handlers: any) => {
    // @ts-expect-error this should not be typed
    return handlers.filter((handler) => handler !== undefined)
  }
}

export const createFactory = <E extends Env = Env, P extends string = string>(init?: {
  initApp?: InitApp<E>
  defaultAppOptions?: HonoOptions<E>
}): Factory<E, P> => new Factory<E, P>(init)

export const createMiddleware = <
  E extends Env = any,
  P extends string = string,
  I extends Input = {},
  R extends HandlerResponse<any> | void = void,
>(
  middleware: MiddlewareHandler<E, P, I, R extends void ? Response : R>
): MiddlewareHandler<E, P, I, R extends void ? Response : R> => middleware
