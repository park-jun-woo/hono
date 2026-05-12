//ff:type feature=router type=router
//ff:what Handler with metadata
import type { ParamIndexMap, Router } from '../../router'
import {
  MESSAGE_MATCHER_IS_ALREADY_BUILT,
  METHOD_NAME_ALL,
  UnsupportedPathError,
} from '../../router'
import { checkOptionalParameter } from '../../utils/url'
import type { HandlerData, StaticMap, Matcher, MatcherMap } from './matcher'
import { match, emptyParam } from './matcher'
import { PATH_ERROR } from './node'
import type { ParamAssocArray } from './node'
import { Trie } from './trie'

export type HandlerWithMetadata<T> = [T, number]
