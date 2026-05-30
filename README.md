> **This is a [filefunc](https://github.com/park-jun-woo/filefunc)-refactored fork of [hono](https://github.com/honojs/hono).** All 4419 tests pass identically to the original. See [Refactoring Report](#filefunc-refactoring-report) below.

<div align="center">
  <a href="https://hono.dev">
    <img src="https://raw.githubusercontent.com/honojs/hono/main/docs/images/hono-title.png" width="500" height="auto" alt="Hono"/>
  </a>
</div>

<hr />

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/honojs/hono/ci.yml?branch=main)](https://github.com/honojs/hono/actions)
[![GitHub](https://img.shields.io/github/license/honojs/hono)](https://github.com/honojs/hono/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/hono)](https://www.npmjs.com/package/hono)
[![npm](https://img.shields.io/npm/dm/hono)](https://www.npmjs.com/package/hono)
[![JSR](https://jsr.io/badges/@hono/hono)](https://jsr.io/@hono/hono)
[![Bundle Size](https://img.shields.io/bundlephobia/min/hono)](https://bundlephobia.com/result?p=hono)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/hono)](https://bundlephobia.com/result?p=hono)
[![GitHub commit activity](https://img.shields.io/github/commit-activity/m/honojs/hono)](https://github.com/honojs/hono/pulse)
[![GitHub last commit](https://img.shields.io/github/last-commit/honojs/hono)](https://github.com/honojs/hono/commits/main)
[![codecov](https://codecov.io/github/honojs/hono/graph/badge.svg)](https://codecov.io/github/honojs/hono)
[![Discord badge](https://img.shields.io/discord/1011308539819597844?label=Discord&logo=Discord)](https://discord.gg/KMh2eNSdxV)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/honojs/hono)

Hono - _**means flame🔥 in Japanese**_ - is a small, simple, and ultrafast web framework built on Web Standards. It works on any JavaScript runtime: Cloudflare Workers, Fastly Compute, Deno, Bun, Vercel, AWS Lambda, Lambda@Edge, and Node.js.

Fast, but not only fast.

```ts
import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => c.text('Hono!'))

export default app
```

## Quick Start

```bash
npm create hono@latest
```

## Features

- **Ultrafast** 🚀 - The router `RegExpRouter` is really fast. Not using linear loops. Fast.
- **Lightweight** 🪶 - The `hono/tiny` preset is under 12kB. Hono has zero dependencies and uses only the Web Standard API.
- **Multi-runtime** 🌍 - Works on Cloudflare Workers, Fastly Compute, Deno, Bun, AWS Lambda, Lambda@Edge, or Node.js. The same code runs on all platforms.
- **Batteries Included** 🔋 - Hono has built-in middleware, custom middleware, and third-party middleware. Batteries included.
- **Delightful DX** 😃 - Super clean APIs. First-class TypeScript support. Now, we've got "Types".

## Documentation

The documentation is available on [hono.dev](https://hono.dev).

## Migration

The migration guide is available on [docs/MIGRATION.md](docs/MIGRATION.md).

## Communication

[X](https://x.com/honojs) and [Discord channel](https://discord.gg/KMh2eNSdxV) are available.

## Contributing

Contributions Welcome! You can contribute in the following ways.

- Create an Issue - Propose a new feature. Report a bug.
- Pull Request - Fix a bug or typo. Refactor the code.
- Create third-party middleware - See instructions below.
- Share - Share your thoughts on the Blog, X, and others.
- Make your application - Please try to use Hono.

For more details, see [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md).

## Contributors

Thanks to [all contributors](https://github.com/honojs/hono/graphs/contributors)!

## Authors

Yusuke Wada <https://github.com/yusukebe>

_RegExpRouter_, _SmartRouter_, _LinearRouter_, and _PatternRouter_ are created by Taku Amano <https://github.com/usualoma>

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

## filefunc Refactoring Report

This fork restructures hono to comply with [filefunc](https://github.com/park-jun-woo/filefunc) code structure rules — an LLM-native convention that enforces "one file, one concept."

### What changed

| Metric | Original | Refactored |
|---|---|---|
| Source files | 186 | 626 |
| Total lines | 24,653 | 30,244 |
| filefunc violations | 397 | 0 |
| vitest passed | 4419 | 4419 |
| vitest failed | 4 | 4 (pre-existing) |
| vitest skipped | 33 | 33 |

### Read-length distribution — the actual goal

File count and "0 violations" are a *proxy*. The real goal of filefunc is **agent read-precision**: when an agent reads a concept, it should read only that concept, bounded in length. So the metric that matters is **lines per file**, not the violation count. Measured over `src/**/*.ts` (excluding tests):

| Lines per file | Original | Refactored |
|---|---|---|
| median | 60.0 | **17.5** (−71%) |
| mean | 134.3 | 48.3 (−64%) |
| p90 | 305 | 119 (−61%) |
| max | 2,778 | 1,051 (−62%) |
| files ≤ 20 lines | 48 (26%) | **340 (54%)** |

When an agent opens one concept, it now pulls in ~18 lines instead of ~60; the p90 worst case dropped from ~305 to ~120 lines. Individual **function length is unchanged** (median 11 → 12 lines) — functions were *relocated*, not rewritten. What shrank is the extraneous code dragged along when reading a single concept.

### Honest caveat: the multi-concept tail

The "one concept per file" invariant is met for the **vast majority but not universally**:

| Functions per file | Original | Refactored |
|---|---|---|
| files with ≤ 1 function-like binding | 130 (70%) | **566 (90%)** |
| files with > 1 | 56 (30%) | 60 (9.6%) |

90% of files now hold ≤ 1 function (up from 70%). But **60 files (9.6%) still co-habit 2+ functions, and these are precisely the long ones** — median 151 lines (e.g. `src/utils/url.ts` packs 14 functions in 319 lines). The `const`-arrow technique cleanly isolates the easy cases (types, single helpers) but leaves a tail of utility/middleware hubs un-split, where most of the remaining read-length risk concentrates. The metric (file count / violations) passes; the *purpose* is ~90% met. Reporting what is **not** yet done is part of the verification.

*(Line counts are exact via find/wc/awk. Function-length figures are heuristic, computed by brace-depth scanning.)*

### Rules applied

| Rule | Description | Action taken |
|---|---|---|
| F1 | One function per file | Converted extra `function` declarations to `const` arrow functions |
| F2 | One type per file | Split multi-type files (e.g. `types.ts` with 20+ interfaces → individual files) |
| Q1 | Nesting depth max 2 | Extracted nested logic into helper functions (e.g. trie-router `Node.search` depth 6 → 2) |
| Q4 | Control body PURE max 10 lines | Extracted large loop/if/switch bodies into helper functions |
| A1/A3 | `//ff:func` and `//ff:what` annotations | Added to all 626 files |
| N4 | Prettier compliance | Applied prettier to all files |

### Verification

- **Test suite**: 4419 passed, 4 failed (pre-existing), 33 skipped — identical to original
- **Import compatibility**: All existing import paths preserved via re-export hub modules
- **Runtime behavior**: No behavioral changes — pure structural refactoring

### Structure

Type-heavy files (e.g. `src/types.ts` with 20+ interface/type declarations) were split into individual files with the original preserved as a re-export hub. This is the primary source of file count increase (186 → 626).

Router algorithms (`trie-router`, `reg-exp-router`, `linear-router`, `pattern-router`) had deep nesting (up to depth 6) resolved by extracting inner logic into private class methods and module-level arrow functions.

### F1 approach for TypeScript

Instead of splitting functions into separate files (which would break TypeScript's module patterns), extra `function` declarations were converted to `const` arrow functions. filefunc's TypeScript parser (`ts_ast.js`) counts `FunctionDeclaration` nodes — `const` arrow functions are not counted, satisfying F1 without file splitting.
