//ff:func feature=adapter type=adapter control=sequence
//ff:type feature=adapter type=model
//ff:what Handler
import { Context } from '../../context'
import type { Hono } from '../../hono'
import { HTTPException } from '../../http-exception'
import type { BlankSchema, Env, Input, MiddlewareHandler, Schema } from '../../types'
import type { PagesFunction } from './pages_function.js'
import type { EventContext } from './event_context.js'

export type { Params } from './params.js'
export type { EventContext } from './event_context.js'
export type { PagesFunction } from './pages_function.js'


// Ref: https://github.com/cloudflare/workerd/blob/main/types/defines/pages.d.ts

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handle =
  <E extends Env = Env, S extends Schema = BlankSchema, BasePath extends string = '/'>(
    app: Hono<E, S, BasePath>
  ): PagesFunction<E['Bindings']> =>
  (eventContext) => {
    return app.fetch(
      eventContext.request,
      { ...eventContext.env, eventContext },
      {
        waitUntil: eventContext.waitUntil,
        passThroughOnException: eventContext.passThroughOnException,
        props: {},
      }
    )
  }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleMiddleware<E extends Env = {}, P extends string = any, I extends Input = {}>(
  middleware: MiddlewareHandler<
    E & {
      Bindings: {
        eventContext: EventContext
      }
    },
    P,
    I
  >
): PagesFunction<E['Bindings']> {
  return async (executionCtx) => {
    const context = new Context(executionCtx.request, {
      env: { ...executionCtx.env, eventContext: executionCtx },
      executionCtx,
    })

    let response: Response | void = undefined

    try {
      response = await middleware(context, async () => {
        try {
          context.res = await executionCtx.next()
        } catch (error) {
          if (error instanceof Error) {
            context.error = error
          } else {
            throw error
          }
        }
      })
    } catch (error) {
      if (error instanceof Error) {
        context.error = error
      } else {
        throw error
      }
    }

    if (response) {
      return response
    }

    if (context.error instanceof HTTPException) {
      return context.error.getResponse()
    }

    if (context.error) {
      throw context.error
    }

    return context.res
  }
}

declare abstract class FetcherLike {
  fetch(input: RequestInfo, init?: RequestInit): Promise<Response>
}

/**
 *
 * @description `serveStatic()` is for advanced mode:
 * https://developers.cloudflare.com/pages/platform/functions/advanced-mode/#set-up-a-function
 *
 */
export const serveStatic = (): MiddlewareHandler => {
  return async (c) => {
    const env = c.env as { ASSETS: FetcherLike }
    const res = await env.ASSETS.fetch(c.req.raw)
    if (res.status === 404) {
      return c.notFound()
    }
    return res
  }
}
