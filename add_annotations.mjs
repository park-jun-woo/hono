#!/usr/bin/env node
/**
 * Add //ff: annotations to all TypeScript files that need them.
 *
 * Logic:
 * - If file has `function` keyword declarations -> add //ff:func
 * - If file has type/interface/class/enum -> add //ff:type
 * - Determine control type from presence of for/while/switch
 * - Determine feature from file path
 * - Add //ff:what with a brief description
 */

import { readFileSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'
import { basename, dirname } from 'path'

const DRY_RUN = process.argv.includes('--dry-run')

// Load violations
const violationsJson = execSync('filefunc validate --lang typescript --format json 2>/dev/null || true', {
  encoding: 'utf-8',
  maxBuffer: 50 * 1024 * 1024,
})

let violations
try {
  violations = JSON.parse(violationsJson)
} catch {
  console.error('Failed to parse violations JSON')
  process.exit(1)
}

// Find files needing A1 or A3
const filesNeedingAnnotations = new Set()
for (const v of violations) {
  if (v.Rule === 'A1' || v.Rule === 'A3') {
    filesNeedingAnnotations.add(v.File)
  }
}

// Determine feature from path
const getFeature = (filePath) => {
  if (filePath.includes('src/router/')) return 'router'
  if (filePath.includes('src/middleware/')) return 'middleware'
  if (filePath.includes('src/helper/')) return 'helper'
  if (filePath.includes('src/adapter/')) return 'adapter'
  if (filePath.includes('src/utils/')) return 'utils'
  if (filePath.includes('src/jsx/')) return 'jsx'
  if (filePath.includes('src/validator/')) return 'validator'
  if (filePath.includes('src/client/')) return 'client'
  return 'core'
}

// Determine type from content analysis
const getType = (content, filePath) => {
  if (filePath.includes('/router')) return 'router'
  if (filePath.includes('/adapter/')) return 'adapter'
  if (filePath.includes('middleware')) return 'handler'

  // Check for type/interface/class declarations
  if (/^export\s+(type|interface)\s/m.test(content)) return 'model'
  if (/^export\s+class\s/m.test(content)) return 'model'
  if (/^(type|interface)\s/m.test(content)) return 'model'

  // Check for parsing
  if (/parse/i.test(basename(filePath))) return 'parser'

  // Check for rendering
  if (/render/i.test(basename(filePath))) return 'renderer'

  // Check for formatting
  if (/format/i.test(basename(filePath))) return 'formatter'

  return 'util'
}

// Determine annotation kind
const getAnnotationKind = (content, filePath) => {
  // Check if file has function declarations (not test describe blocks)
  const hasFuncDecl = /^(export\s+)?(async\s+)?function\s+\w+/m.test(content)
  const hasConstFunc = /^(export\s+)?const\s+\w+\s*=\s*(async\s+)?\(/m.test(content) ||
                       /^(export\s+)?const\s+\w+\s*=\s*(async\s+)?</.test(content)
  const hasType = /^(export\s+)?(type|interface|class|enum|abstract\s+class)\s+\w+/m.test(content)

  if (hasFuncDecl) return 'func'
  if (hasType) return 'type'
  if (hasConstFunc) return 'func'  // const arrow funcs don't trigger A1 but we add annotation anyway
  return null
}

// Determine control from content
const getControl = (content) => {
  // Check for top-level control structures
  if (/\bfor\s*\(|\bwhile\s*\(|\bdo\s*{/.test(content)) return 'iteration'
  if (/\bswitch\s*\(/.test(content)) return 'selection'
  return 'sequence'
}

// Generate description from file name
const getDescription = (filePath) => {
  const base = basename(filePath).replace(/\.(ts|tsx)$/, '').replace(/\.test$/, ' test').replace(/\.spec$/, ' spec')
  // Convert snake_case to words
  const words = base.replace(/_/g, ' ').replace(/-/g, ' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

let modified = 0

for (const file of filesNeedingAnnotations) {
  const content = readFileSync(file, 'utf-8')

  // Skip if already has annotations
  if (content.includes('//ff:func') || content.includes('//ff:type')) continue

  const kind = getAnnotationKind(content, file)
  if (!kind) continue

  const feature = getFeature(file)
  const type = getType(content, file)
  const description = getDescription(file)

  let annotation
  if (kind === 'func') {
    const control = getControl(content)
    annotation = `//ff:func feature=${feature} type=${type} control=${control}\n//ff:what ${description}\n`
    if (control === 'iteration') {
      annotation = `//ff:func feature=${feature} type=${type} control=iteration dimension=1\n//ff:what ${description}\n`
    }
  } else {
    annotation = `//ff:type feature=${feature} type=${type}\n//ff:what ${description}\n`
  }

  // Add annotation at the very top of the file
  const newContent = annotation + content

  if (!DRY_RUN) {
    writeFileSync(file, newContent)
  }

  modified++
}

console.log(`Modified ${modified} files`)
if (DRY_RUN) console.log('(DRY RUN)')
