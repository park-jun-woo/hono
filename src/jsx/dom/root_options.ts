//ff:type feature=jsx type=model
//ff:what Root options
import type { Child } from '../base'
import { useState } from '../hooks'
import { buildNode, renderNode } from './render'
import type { NodeObject } from './render'

export type RootOptions = Record<string, unknown>
