//ff:type feature=router type=router
//ff:what Trie
import type { Context, ParamAssocArray } from './node'
import { Node } from './node'
import type { ReplacementMap } from './replacement_map.js'

export type { ReplacementMap } from './replacement_map.js'


const _restoreGroupInTokens = (tokens: string[], mark: string, original: string): void => {
  for (let j = tokens.length - 1; j >= 0; j--) {
    if (tokens[j].indexOf(mark) !== -1) {
      tokens[j] = tokens[j].replace(mark, original)
      break
    }
  }
}

export class Trie {
  #context: Context = { varIndex: 0 }
  #root: Node = new Node()

  insert(path: string, index: number, pathErrorCheckOnly: boolean): ParamAssocArray {
    const paramAssoc: ParamAssocArray = []

    const groups: [string, string][] = [] // [mark, original string]
    for (let i = 0; ; ) {
      let replaced = false
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`
        groups[i] = [mark, m]
        i++
        replaced = true
        return mark
      })
      if (!replaced) {
        break
      }
    }

    /**
     *  - pattern (:label, :label{0-9]+}, ...)
     *  - /* wildcard
     *  - character
     */
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || []
    for (let i = groups.length - 1; i >= 0; i--) {
      _restoreGroupInTokens(tokens, groups[i][0], groups[i][1])
    }

    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly)

    return paramAssoc
  }

  buildRegExp(): [RegExp, ReplacementMap, ReplacementMap] {
    let regexp = this.#root.buildRegExpStr()
    if (regexp === '') {
      return [/^$/, [], []] // never match
    }

    let captureIndex = 0
    const indexReplacementMap: ReplacementMap = []
    const paramReplacementMap: ReplacementMap = []

    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== undefined) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex)
        return '$()'
      }
      if (paramIndex !== undefined) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex
        return ''
      }

      return ''
    })

    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap]
  }
}
