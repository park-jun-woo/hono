//ff:type feature=jsx type=model
//ff:what Error handler
import { raw } from '../helper/html'
import type { HtmlEscapedCallback, HtmlEscapedString } from '../utils/html'
import { HtmlEscapedCallbackPhase, resolveCallback } from '../utils/html'
import { jsx, Fragment } from './base'
import { DOM_RENDERER } from './constants'
import { useContext } from './context'
import { ErrorBoundary as ErrorBoundaryDomRenderer } from './dom/components'
import type { HasRenderToDom } from './dom/render'
import { StreamingContext } from './streaming'
import type { Child, FC, PropsWithChildren } from './'

export type ErrorHandler = (error: Error) => void
