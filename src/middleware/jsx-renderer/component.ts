//ff:type feature=middleware type=handler
//ff:what Component
import type { Context, PropsForRenderer } from '../../context'
import { html, raw } from '../../helper/html'
import { Fragment, createContext, jsx, useContext } from '../../jsx'
import type { FC, Context as JSXContext, JSXNode, PropsWithChildren } from '../../jsx'
import { renderToReadableStream } from '../../jsx/streaming'
import type { Env, Input, MiddlewareHandler } from '../../types'
import type { HtmlEscapedString } from '../../utils/html'

export type Component = (
  props: PropsForRenderer & { Layout: FC },
  c: Context
) => HtmlEscapedString | Promise<HtmlEscapedString>
