//ff:type feature=core type=model
//ff:what Mount replace request
import { compose } from './compose'
import { Context } from './context'
import type { ExecutionContext } from './context'
import type { Router } from './router'
import { METHODS, METHOD_NAME_ALL, METHOD_NAME_ALL_LOWERCASE } from './router'
import type {
  Env,
  ErrorHandler,
  FetchEventLike,
  H,
  HandlerInterface,
  MergePath,
  MergeSchemaPath,
  MiddlewareHandler,
  MiddlewareHandlerInterface,
  Next,
  NotFoundHandler,
  OnHandlerInterface,
  RouterRoute,
  Schema,
} from './types'
import { COMPOSED_HANDLER } from './utils/constants'
import { getPath, getPathNoStrict, mergePath } from './utils/url'

export type MountReplaceRequest = (originalRequest: Request) => Request
