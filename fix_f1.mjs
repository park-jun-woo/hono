#!/usr/bin/env node
/**
 * Fix F1 violations by converting extra `function` declarations to arrow functions.
 * Keeps ONE function declaration (the "primary" one) and converts the rest.
 *
 * For each file, the primary function is chosen as:
 * 1. The one that matches the file name (if any)
 * 2. The first exported function
 * 3. The first function
 */

import { Project, SyntaxKind } from 'ts-morph'
import { readFileSync, writeFileSync } from 'fs'
import { basename } from 'path'

const DRY_RUN = process.argv.includes('--dry-run')

const violationsJson = readFileSync('/tmp/violations.json', 'utf-8')
const violations = JSON.parse(violationsJson)

const f1Files = [...new Set(violations.filter(v => v.Rule === 'F1').map(v => v.File))]

const project = new Project({
  tsConfigFilePath: './tsconfig.json',
  skipAddingFilesFromTsConfig: true,
})

for (const file of f1Files) {
  // Process test files too now

  const sourceFile = project.addSourceFileAtPath(file)
  const ext = file.endsWith('.tsx') ? '.tsx' : '.ts'
  const base = basename(file, ext).replace(/-/g, '_')

  // Get all top-level function declarations
  const funcDecls = sourceFile.getFunctions()

  if (funcDecls.length <= 1) {
    console.log(`${file}: only ${funcDecls.length} functions, skipping`)
    project.removeSourceFile(sourceFile)
    continue
  }

  console.log(`${file}: ${funcDecls.length} functions`)

  // Choose which one to keep as a function declaration
  let primaryFunc = null

  // Try to match file name
  for (const f of funcDecls) {
    const name = f.getName()
    if (name && (name.toLowerCase() === base.toLowerCase() ||
        name.toLowerCase().replace(/_/g, '') === base.toLowerCase().replace(/_/g, ''))) {
      primaryFunc = f
      break
    }
  }

  // If no match, use first exported function
  if (!primaryFunc) {
    primaryFunc = funcDecls.find(f => f.isExported()) || funcDecls[0]
  }

  console.log(`  Primary: ${primaryFunc.getName()}`)

  // Convert all other functions to arrow functions
  for (const func of funcDecls) {
    if (func === primaryFunc) continue

    const name = func.getName()
    const isExported = func.isExported()
    const isAsync = func.isAsync()
    const returnType = func.getReturnTypeNode()?.getText() || ''
    const params = func.getParameters().map(p => p.getText()).join(', ')
    const typeParams = func.getTypeParameters().map(p => p.getText()).join(', ')
    const body = func.getBody()?.getText() || '{ }'

    // Build arrow function
    // Correct order: const name = async <T>(params): ReturnType => { body }
    let arrow = ''
    if (isExported) arrow += 'export '
    arrow += 'const '
    arrow += name + ' = '
    if (isAsync) arrow += 'async '
    if (typeParams) {
      // Add trailing comma for .tsx files to disambiguate from JSX
      const isTsx = file.endsWith('.tsx')
      const tpText = isTsx && !typeParams.includes(',') ? typeParams + ',' : typeParams
      arrow += `<${tpText}>`
    }
    arrow += `(${params})`
    if (returnType) arrow += `: ${returnType}`
    arrow += ' => '
    arrow += body

    // Get leading comments
    const leadingComments = func.getLeadingCommentRanges().map(r => r.getText()).join('\n')

    console.log(`  Convert: ${name} (exported=${isExported}, async=${isAsync})`)

    // Replace the function with the arrow function
    const fullText = func.getFullText()
    const startPos = func.getFullStart()
    const endPos = func.getEnd()

    // Use replaceWithText for simplicity
    let replacement = ''
    if (leadingComments) replacement += leadingComments + '\n'
    replacement += arrow

    func.replaceWithText(replacement)
  }

  if (!DRY_RUN) {
    sourceFile.saveSync()
  }

  project.removeSourceFile(sourceFile)
}

console.log('\nDone!')
if (DRY_RUN) console.log('(DRY RUN)')
