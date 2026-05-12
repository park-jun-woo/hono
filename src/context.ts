//ff:type feature=core type=model
//ff:what Context
import { HonoRequest } from './request'
import type { Result } from './router'
import type {
  Env,
  FetchEventLike,
  H,
  Input,
  NotFoundHandler,
  RouterRoute,
  TypedResponse,
} from './types'
import type { ResponseHeader } from './utils/headers'
import { HtmlEscapedCallbackPhase, resolveCallback } from './utils/html'
import type { ContentfulStatusCode, RedirectStatusCode, StatusCode } from './utils/http-status'
import type { BaseMime } from './utils/mime'
import type { InvalidJSONValue, IsAny, JSONParsed, JSONValue } from './utils/types'
import type { HeaderRecord } from './header_record.js'
import type { ResponseInit } from './response_init.js'
import type { Data } from './data.js'
import type { Renderer } from './renderer.js'
import type { PropsForRenderer } from './props_for_renderer.js'
import type { Layout } from './layout.js'
import type { JSONRespondReturn } from './json_respond_return.js'
import type { ContextOptions } from './context_options.js'
import type { ResponseOrInit } from './response_or_init.js'
import type { ExecutionContext } from './execution_context.js'
import type { ContextVariableMap } from './context_variable_map.js'
import type { Get } from './get.js'
import type { Set } from './set.js'
import type { NewResponse } from './new_response.js'
import type { BodyRespond } from './body_respond.js'
import type { TextRespond } from './text_respond.js'
import type { JSONRespond } from './json_respond.js'
import type { HTMLRespond } from './html_respond.js'
import type { SetHeaders } from './set_headers.js'

export type { HeaderRecord } from './header_record.js'
export type { Data } from './data.js'
export type { Renderer } from './renderer.js'
export type { PropsForRenderer } from './props_for_renderer.js'
export type { Layout } from './layout.js'
export type { JSONRespondReturn } from './json_respond_return.js'
export type { ContextOptions } from './context_options.js'
export type { ResponseHeadersInit } from './response_headers_init.js'
export type { ResponseOrInit } from './response_or_init.js'
export type { ExecutionContext } from './execution_context.js'
export type { ContextVariableMap } from './context_variable_map.js'
export type { ContextRenderer } from './context_renderer.js'
export type { DefaultRenderer } from './default_renderer.js'
export type { Get } from './get.js'
export type { Set } from './set.js'
export type { NewResponse } from './new_response.js'
export type { BodyRespond } from './body_respond.js'
export type { TextRespond } from './text_respond.js'
export type { JSONRespond } from './json_respond.js'
export type { HTMLRespond } from './html_respond.js'
export type { SetHeadersOptions } from './set_headers_options.js'
export type { SetHeaders } from './set_headers.js'
export type { ResponseInit } from './response_init.js'

const copyCookies = (source: Headers, target: Headers): void => {
  const cookies = source.getSetCookie()
  target.delete('set-cookie')
  for (const cookie of cookies) {
    target.append('set-cookie', cookie)
  }
}

const mergeArgHeaders = (source: Headers, target: Headers): void => {
  for (const [key, value] of source) {
    if (key.toLowerCase() === 'set-cookie') {
      target.append(key, value)
    } else {
      target.set(key, value)
    }
  }
}

const applySetHeaders = (headers: Record<string, string | string[]>, target: Headers): void => {
  for (const [k, v] of Object.entries(headers)) {
    if (typeof v === 'string') {
      target.set(k, v)
    } else {
      target.delete(k)
      for (const v2 of v) {
        target.append(k, v2)
      }
    }
  }
}

const mergeHeaders = (source: Headers, target: Headers): void => {
  for (const [k, v] of source.entries()) {
    if (k === 'content-type') continue
    if (k === 'set-cookie') {
      copyCookies(source, target)
    } else {
      target.set(k, v)
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TEXT_PLAIN = 'text/plain; charset=UTF-8'

const setDefaultContentType = (contentType: string, headers?: HeaderRecord): HeaderRecord => {
  return {
    'Content-Type': contentType,
    ...headers,
  }
}

const createResponseInstance = (
  body?: BodyInit | null | undefined,
  init?: globalThis.ResponseInit
): Response => new Response(body, init)

export class Context<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  E extends Env = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P extends string = any,
  I extends Input = {},
> {
  #rawRequest: Request
  #req: HonoRequest<P, I['out']> | undefined
  /**
   * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
   *
   * @see {@link https://hono.dev/docs/api/context#env}
   *
   * @example
   * ```ts
   * // Environment object for Cloudflare Workers
   * app.get('*', async c => {
   *   const counter = c.env.COUNTER
   * })
   * ```
   */
  env: E['Bindings'] = {}
  #var: Map<unknown, unknown> | undefined
  finalized: boolean = false
  /**
   * `.error` can get the error object from the middleware if the Handler throws an error.
   *
   * @see {@link https://hono.dev/docs/api/context#error}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   await next()
   *   if (c.error) {
   *     // do something...
   *   }
   * })
   * ```
   */
  error: Error | undefined

  #status: StatusCode | undefined
  #executionCtx: FetchEventLike | ExecutionContext | undefined
  #res: Response | undefined
  #layout: Layout<PropsForRenderer & { Layout: Layout }> | undefined
  #renderer: Renderer | undefined
  #notFoundHandler: NotFoundHandler<E> | undefined
  #preparedHeaders: Headers | undefined

  #matchResult: Result<[H, RouterRoute]> | undefined
  #path: string | undefined

  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(req: Request, options?: ContextOptions<E>) {
    this.#rawRequest = req
    if (options) {
      this.#executionCtx = options.executionCtx
      this.env = options.env
      this.#notFoundHandler = options.notFoundHandler
      this.#path = options.path
      this.#matchResult = options.matchResult
    }
  }

  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req(): HonoRequest<P, I['out']> {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult)
    return this.#req
  }

  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event(): FetchEventLike {
    if (this.#executionCtx && 'respondWith' in this.#executionCtx) {
      return this.#executionCtx
    } else {
      throw Error('This context has no FetchEvent')
    }
  }

  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx(): ExecutionContext {
    if (this.#executionCtx) {
      return this.#executionCtx as ExecutionContext
    } else {
      throw Error('This context has no ExecutionContext')
    }
  }

  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res(): Response {
    return (this.#res ||= createResponseInstance(null, {
      headers: (this.#preparedHeaders ??= new Headers()),
    }))
  }

  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(_res: Response | undefined) {
    if (this.#res && _res) {
      _res = createResponseInstance(_res.body, _res)
      mergeHeaders(this.#res.headers, _res.headers)
    }
    this.#res = _res
    this.finalized = true
  }

  /**
   * `.render()` can create a response within a layout.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   return c.render('Hello!')
   * })
   * ```
   */
  render: Renderer = (...args) => {
    this.#renderer ??= (content: string | Promise<string>) => this.html(content)
    return this.#renderer(...args)
  }

  /**
   * Sets the layout for the response.
   *
   * @param layout - The layout to set.
   * @returns The layout function.
   */
  setLayout = (
    layout: Layout<PropsForRenderer & { Layout: Layout }>
  ): Layout<
    PropsForRenderer & {
      Layout: Layout
    }
  > => (this.#layout = layout)

  /**
   * Gets the current layout for the response.
   *
   * @returns The current layout function.
   */
  getLayout = (): Layout<PropsForRenderer & { Layout: Layout }> | undefined => this.#layout

  /**
   * `.setRenderer()` can set the layout in the custom middleware.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```tsx
   * app.use('*', async (c, next) => {
   *   c.setRenderer((content) => {
   *     return c.html(
   *       <html>
   *         <body>
   *           <p>{content}</p>
   *         </body>
   *       </html>
   *     )
   *   })
   *   await next()
   * })
   * ```
   */
  setRenderer = (renderer: Renderer): void => {
    this.#renderer = renderer
  }

  /**
   * `.header()` can set headers.
   *
   * @see {@link https://hono.dev/docs/api/context#header}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  header: SetHeaders = (name, value, options): void => {
    if (this.finalized) {
      this.#res = createResponseInstance((this.#res as Response).body, this.#res)
    }
    const headers = this.#res ? this.#res.headers : (this.#preparedHeaders ??= new Headers())
    if (value === undefined) {
      headers.delete(name)
    } else if (options?.append) {
      headers.append(name, value)
    } else {
      headers.set(name, value)
    }
  }

  status = (status: StatusCode): void => {
    this.#status = status
  }

  /**
   * `.set()` can set the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   c.set('message', 'Hono is hot!!')
   *   await next()
   * })
   * ```
   */
  set: Set<
    IsAny<E> extends true
      ? {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Variables: ContextVariableMap & Record<string, any>
        }
      : E
  > = (key: string, value: unknown) => {
    this.#var ??= new Map()
    this.#var.set(key, value)
  }

  /**
   * `.get()` can use the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   const message = c.get('message')
   *   return c.text(`The message is "${message}"`)
   * })
   * ```
   */
  get: Get<
    IsAny<E> extends true
      ? {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Variables: ContextVariableMap & Record<string, any>
        }
      : E
  > = (key: string) => {
    return this.#var ? this.#var.get(key) : undefined
  }

  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var(): Readonly<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ContextVariableMap & (IsAny<E['Variables']> extends true ? Record<string, any> : E['Variables'])
  > {
    if (!this.#var) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return {} as any
    }
    return Object.fromEntries(this.#var)
  }

  #newResponse(
    data: Data | null,
    arg?: StatusCode | ResponseOrInit,
    headers?: HeaderRecord
  ): Response {
    const responseHeaders = this.#res
      ? new Headers(this.#res.headers)
      : (this.#preparedHeaders ?? new Headers())

    if (typeof arg === 'object' && 'headers' in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers)
      mergeArgHeaders(argHeaders, responseHeaders)
    }

    if (headers) {
      applySetHeaders(headers, responseHeaders)
    }

    const status = typeof arg === 'number' ? arg : (arg?.status ?? this.#status)
    return createResponseInstance(data, { status, headers: responseHeaders })
  }

  newResponse: NewResponse = (...args) => this.#newResponse(...(args as Parameters<NewResponse>))

  /**
   * `.body()` can return the HTTP response.
   * You can set headers with `.header()` and set HTTP status code with `.status`.
   * This can also be set in `.text()`, `.json()` and so on.
   *
   * @see {@link https://hono.dev/docs/api/context#body}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *   // Set HTTP status code
   *   c.status(201)
   *
   *   // Return the response body
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  body: BodyRespond = (
    data: Data | null,
    arg?: StatusCode | RequestInit,
    headers?: HeaderRecord
  ): ReturnType<BodyRespond> => this.#newResponse(data, arg, headers) as ReturnType<BodyRespond>

  /**
   * `.text()` can render text as `Content-Type:text/plain`.
   *
   * @see {@link https://hono.dev/docs/api/context#text}
   *
   * @example
   * ```ts
   * app.get('/say', (c) => {
   *   return c.text('Hello!')
   * })
   * ```
   */
  text: TextRespond = (
    text: string,
    arg?: ContentfulStatusCode | ResponseOrInit,
    headers?: HeaderRecord
  ): ReturnType<TextRespond> => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized
      ? (new Response(text) as ReturnType<TextRespond>)
      : (this.#newResponse(
          text,
          arg,
          setDefaultContentType(TEXT_PLAIN, headers)
        ) as ReturnType<TextRespond>)
  }

  /**
   * `.json()` can render JSON as `Content-Type:application/json`.
   *
   * @see {@link https://hono.dev/docs/api/context#json}
   *
   * @example
   * ```ts
   * app.get('/api', (c) => {
   *   return c.json({ message: 'Hello!' })
   * })
   * ```
   */
  json: JSONRespond = <
    T extends JSONValue | {} | InvalidJSONValue,
    U extends ContentfulStatusCode = ContentfulStatusCode,
  >(
    object: T,
    arg?: U | ResponseOrInit<U>,
    headers?: HeaderRecord
  ): JSONRespondReturn<T, U> => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType('application/json', headers)
    ) /* eslint-disable @typescript-eslint/no-explicit-any */ as any
  }

  html: HTMLRespond = (
    html: string | Promise<string>,
    arg?: ContentfulStatusCode | ResponseOrInit<ContentfulStatusCode>,
    headers?: HeaderRecord
  ): Response | Promise<Response> => {
    const res = (html: string) =>
      this.#newResponse(html, arg, setDefaultContentType('text/html; charset=UTF-8', headers))
    return typeof html === 'object'
      ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res)
      : res(html)
  }

  /**
   * `.redirect()` can Redirect, default status code is 302.
   *
   * @see {@link https://hono.dev/docs/api/context#redirect}
   *
   * @example
   * ```ts
   * app.get('/redirect', (c) => {
   *   return c.redirect('/')
   * })
   * app.get('/redirect-permanently', (c) => {
   *   return c.redirect('/', 301)
   * })
   * ```
   */
  redirect = <T extends RedirectStatusCode = 302>(
    location: string | URL,
    status?: T
  ): Response & TypedResponse<undefined, T, 'redirect'> => {
    const locationString = String(location)
    this.header(
      'Location',
      // Multibyes should be encoded
      // eslint-disable-next-line no-control-regex
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    )
    return this.newResponse(null, status ?? 302) as any
  }

  /**
   * `.notFound()` can return the Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/context#notfound}
   *
   * @example
   * ```ts
   * app.get('/notfound', (c) => {
   *   return c.notFound()
   * })
   * ```
   */
  notFound = (): ReturnType<NotFoundHandler> => {
    this.#notFoundHandler ??= () => createResponseInstance()
    return this.#notFoundHandler(this)
  }
}
