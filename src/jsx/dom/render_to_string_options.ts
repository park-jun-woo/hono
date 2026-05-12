//ff:type feature=jsx type=model
//ff:what Render to string options
import type { HtmlEscapedString } from '../../utils/html'
import type { Child } from '../base'
import { renderToReadableStream as renderToReadableStreamHono } from '../streaming'
import version from './'

export interface RenderToStringOptions {
  identifierPrefix?: string
}
