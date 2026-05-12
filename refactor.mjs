#!/usr/bin/env node
/**
 * F1/F2 splitter - safe approach.
 * Only splits type aliases and interfaces (compile-time only).
 * Classes, enums, and functions stay in the original file to avoid circular deps.
 * The original file becomes a hub: re-exports for split types + original runtime code.
 */

import { Project, SyntaxKind } from 'ts-morph'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { dirname, basename, join } from 'path'

const DRY_RUN = process.argv.includes('--dry-run')
const SPLIT_ALL = process.argv.includes('--all')  // Also split classes/funcs

const violationsJson = readFileSync('/tmp/violations.json', 'utf-8')
const violations = JSON.parse(violationsJson)

const byFile = {}
for (const v of violations) {
  if (!byFile[v.File]) byFile[v.File] = []
  byFile[v.File].push(v)
}

function toSnakeCase(name) {
  return name
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .replace(/([a-z\d])([A-Z])/g, '$1_$2')
    .replace(/[#]/g, '')
    .toLowerCase()
}

const createdPaths = new Set()

function getUniqueSnake(dir, snake, ext) {
  for (const suffix of ['', '_def', '_decl', '_2', '_3', '_4']) {
    const candidate = join(dir, snake + suffix + ext)
    if (!existsSync(candidate) && !createdPaths.has(candidate)) {
      createdPaths.add(candidate)
      return { filePath: candidate, snake: snake + suffix }
    }
  }
  return null
}

const project = new Project({
  tsConfigFilePath: './tsconfig.json',
  skipAddingFilesFromTsConfig: true,
})

for (const [file, fileViolations] of Object.entries(byFile)) {
  const hasF1 = fileViolations.some(v => v.Rule === 'F1')
  const hasF2 = fileViolations.some(v => v.Rule === 'F2')
  if (!hasF1 && !hasF2) continue
  if (file.includes('.test.')) continue

  const sourceFile = project.addSourceFileAtPath(file)
  const dir = dirname(file)
  const ext = file.endsWith('.tsx') ? '.tsx' : '.ts'

  // Collect top-level type/interface declarations for F2
  const typeAliases = sourceFile.getTypeAliases()
  const interfaces = sourceFile.getInterfaces()
  const classes = sourceFile.getClasses()
  const enums = sourceFile.getEnums()
  const functions = sourceFile.getFunctions()
  const varStatements = sourceFile.getVariableStatements()

  // All "types" for F2 purposes: type aliases + interfaces + classes + enums
  const allTypes = [
    ...typeAliases.map(t => ({ stmt: t, name: t.getName(), kind: 'type' })),
    ...interfaces.map(t => ({ stmt: t, name: t.getName(), kind: 'interface' })),
    ...classes.map(t => ({ stmt: t, name: t.getName?.() || 'Anonymous', kind: 'class' })),
    ...enums.map(t => ({ stmt: t, name: t.getName(), kind: 'enum' })),
  ]

  // All "funcs" for F1 purposes
  const allFuncs = [
    ...functions.map(f => ({ stmt: f, name: f.getName?.() || 'anonymous', kind: 'func' })),
    ...varStatements.flatMap(vs => {
      const decls = vs.getDeclarationList().getDeclarations()
      return decls.filter(d => {
        const init = d.getInitializer()
        return init && (
          init.getKind() === SyntaxKind.ArrowFunction ||
          init.getKind() === SyntaxKind.FunctionExpression
        )
      }).map(d => ({ stmt: vs, name: d.getName(), kind: 'func' }))
    }),
  ]

  const needSplitTypes = hasF2 && allTypes.length > 1
  const needSplitFuncs = hasF1 && allFuncs.length > 1

  if (!needSplitTypes && !needSplitFuncs) {
    project.removeSourceFile(sourceFile)
    continue
  }

  // Determine what to split
  let toSplit = []

  if (needSplitTypes) {
    // Split ONLY type aliases and interfaces (compile-time only, safe)
    const safeTypes = allTypes.filter(t => t.kind === 'type' || t.kind === 'interface')
    if (SPLIT_ALL) {
      // Also split classes and enums
      toSplit.push(...allTypes)
    } else {
      // Only split if we have enough safe types to resolve the violation
      // We need to reduce total types to <= 1 in the original
      // Total types = allTypes.length
      // After splitting N safe types, remaining = allTypes.length - N
      // Need: remaining <= 1, so N >= allTypes.length - 1
      if (safeTypes.length >= allTypes.length - 1) {
        // We can resolve F2 by splitting safe types only
        // Split all but leave at most 1 type in original
        const numToSplit = allTypes.length - 1
        // Prefer splitting type aliases and interfaces first
        const sortedTypes = [...safeTypes]
        // If we need to split more than safe types, also split classes/enums
        if (sortedTypes.length < numToSplit) {
          const unsafeTypes = allTypes.filter(t => t.kind === 'class' || t.kind === 'enum')
          sortedTypes.push(...unsafeTypes)
        }
        toSplit.push(...sortedTypes.slice(0, numToSplit))
      } else {
        // Can't resolve F2 with safe types only
        // Split all safe types + enough unsafe types
        toSplit.push(...safeTypes)
        const remaining = allTypes.length - safeTypes.length
        if (remaining > 1) {
          const unsafeTypes = allTypes.filter(t => t.kind === 'class' || t.kind === 'enum')
          toSplit.push(...unsafeTypes.slice(0, remaining - 1))
        }
      }
    }
  }

  // Skip F1 (func splitting) - too risky due to mutable module state
  // if (needSplitFuncs) {
  //   const numToSplit = allFuncs.length - 1
  //   toSplit.push(...allFuncs.slice(0, numToSplit))
  // }

  if (toSplit.length === 0) {
    project.removeSourceFile(sourceFile)
    continue
  }

  const splitNames = new Set(toSplit.map(d => d.name))

  console.log(`${file}: splitting ${toSplit.length} items (${[...splitNames].join(', ')})`)

  // Collect import text
  const importText = sourceFile.getImportDeclarations().map(i => i.getText()).join('\n')

  // Determine paths
  const nameToPath = {}
  for (const item of toSplit) {
    const snake = toSnakeCase(item.name)
    const result = getUniqueSnake(dir, snake, ext)
    if (!result) { console.log(`  SKIP ${item.name}`); continue }
    nameToPath[item.name] = result
  }

  // Create split files
  const reExportLines = []

  for (const item of toSplit) {
    if (!nameToPath[item.name]) continue
    const { filePath, snake } = nameToPath[item.name]

    const declText = item.stmt.getText()
    const leadingComments = item.stmt.getLeadingCommentRanges().map(r => r.getText()).join('\n')

    // Build file content
    let newContent = ''
    if (importText.trim()) newContent += importText + '\n'

    // Add sibling imports for references to other split items
    const siblingImports = new Set()
    for (const other of toSplit) {
      if (other.name === item.name) continue
      if (!nameToPath[other.name]) continue
      if (new RegExp('\\b' + other.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(declText)) {
        const otherPath = './' + nameToPath[other.name].snake + '.js'
        if (other.kind === 'type' || other.kind === 'interface') {
          siblingImports.add(`import type { ${other.name} } from '${otherPath}'`)
        } else {
          siblingImports.add(`import { ${other.name} } from '${otherPath}'`)
        }
      }
    }

    // Import from hub for kept items
    const hubBaseName = basename(file, ext)
    const hubPath = './' + hubBaseName + '.js'
    // Check if declText references any names defined in the original file that aren't being split
    // We need to know all names in the original file
    const allNames = new Set([
      ...allTypes.map(t => t.name),
      ...allFuncs.map(f => f.name),
      ...varStatements.flatMap(vs =>
        vs.getDeclarationList().getDeclarations().map(d => d.getName())
      ),
    ])
    for (const name of allNames) {
      if (name === item.name) continue
      if (splitNames.has(name)) continue
      if (new RegExp('\\b' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(declText)) {
        if (snake !== hubBaseName) {
          // Determine if it's a type-only import
          const isType = allTypes.some(t => t.name === name && (t.kind === 'type' || t.kind === 'interface'))
          siblingImports.add(isType
            ? `import type { ${name} } from '${hubPath}'`
            : `import { ${name} } from '${hubPath}'`)
        }
      }
    }

    if (siblingImports.size > 0) newContent += [...siblingImports].join('\n') + '\n'
    newContent += '\n'
    if (leadingComments) newContent += leadingComments + '\n'

    let text = declText
    if (!item.stmt.isExported()) text = 'export ' + text
    newContent += text + '\n'

    if (!DRY_RUN) writeFileSync(filePath, newContent)
    console.log(`  -> ${filePath}`)

    // Re-export line
    const importPath = './' + snake + '.js'
    if (item.kind === 'type' || item.kind === 'interface') {
      reExportLines.push(`export type { ${item.name} } from '${importPath}'`)
    } else {
      reExportLines.push(`export { ${item.name} } from '${importPath}'`)
    }
  }

  // Cache split item texts BEFORE removing (removal invalidates node references)
  const splitItemTexts = {}
  for (const item of toSplit) {
    if (nameToPath[item.name]) {
      try { splitItemTexts[item.name] = item.stmt.getText() } catch { splitItemTexts[item.name] = '' }
    }
  }

  // Promote non-exported kept items that split items reference - BEFORE removal
  const statementsBeforeRemoval = sourceFile.getStatements()
  for (const item of toSplit) {
    if (!nameToPath[item.name]) continue
    const declText = splitItemTexts[item.name]
    for (const stmt of statementsBeforeRemoval) {
      const kind = stmt.getKind()
      if (kind === SyntaxKind.ImportDeclaration || kind === SyntaxKind.ExportDeclaration) continue
      if (splitNames.has(stmt.getName?.() || '')) continue // Don't promote items being split

      let name = null
      let isExported = false

      if (kind === SyntaxKind.VariableStatement) {
        const decls = stmt.getDeclarationList().getDeclarations()
        for (const d of decls) {
          name = d.getName()
          isExported = stmt.isExported()
          if (name && !isExported && new RegExp('\\b' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(declText)) {
            stmt.setIsExported(true)
          }
        }
      } else if (kind === SyntaxKind.FunctionDeclaration) {
        name = stmt.getName?.()
        isExported = stmt.isExported()
        if (name && !isExported && new RegExp('\\b' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(declText)) {
          stmt.setIsExported(true)
        }
      } else if (kind === SyntaxKind.TypeAliasDeclaration || kind === SyntaxKind.InterfaceDeclaration) {
        name = stmt.getName?.()
        isExported = stmt.isExported()
        if (name && !isExported && new RegExp('\\b' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(declText)) {
          stmt.setIsExported(true)
        }
      }
    }
  }

  // Compute hub imports BEFORE removing stmts
  const hubNeedImports = new Set()
  for (const stmt of statementsBeforeRemoval) {
    if (splitNames.has(stmt.getName?.() || '')) continue // Skip stmts being split
    const kind = stmt.getKind()
    if (kind === SyntaxKind.ImportDeclaration) continue
    const text = stmt.getText()
    for (const item of toSplit) {
      if (!nameToPath[item.name]) continue
      if (new RegExp('\\b' + item.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(text)) {
        const splitPath = './' + nameToPath[item.name].snake + '.js'
        if (item.kind === 'type' || item.kind === 'interface') {
          hubNeedImports.add(`import type { ${item.name} } from '${splitPath}'`)
        } else {
          hubNeedImports.add(`import { ${item.name} } from '${splitPath}'`)
        }
      }
    }
  }

  // NOW remove split declarations
  const stmtsToRemove = toSplit.filter(item => nameToPath[item.name]).map(item => item.stmt)
  for (const stmt of stmtsToRemove.reverse()) {
    stmt.remove()
  }

  // Build text to insert after last import
  let insertText = '\n'
  if (hubNeedImports.size > 0) {
    insertText += [...hubNeedImports].join('\n') + '\n'
  }
  insertText += '\n' + reExportLines.join('\n') + '\n'

  const importDecls = sourceFile.getImportDeclarations()
  const lastImport = importDecls[importDecls.length - 1]

  if (lastImport) {
    sourceFile.insertText(lastImport.getEnd(), insertText)
  } else {
    // Insert at beginning
    sourceFile.insertText(0, insertText + '\n')
  }

  if (!DRY_RUN) {
    sourceFile.saveSync()
  }

  project.removeSourceFile(sourceFile)
}

console.log('\nDone!')
if (DRY_RUN) console.log('(DRY RUN)')
