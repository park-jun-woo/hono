//ff:func feature=middleware type=handler control=sequence
//ff:type feature=middleware type=model
//ff:what Language
/**
 * @module
 * Language module for Hono.
 */
import type { Context } from '../../context'
import { setCookie, getCookie } from '../../helper/cookie'
import type { MiddlewareHandler } from '../../types'
import { parseAccept } from '../../utils/accept'
import type { DetectorOptions } from './detector_options_def.js'

export type { DetectorType } from './detector_type_def.js'
export type { CacheType } from './cache_type_def.js'
export type { DetectorFunction } from './detector_function_def.js'
export type { Detectors } from './detectors_def.js'
export type { DetectorOptions } from './detector_options_def.js'


export interface LanguageVariables {
  language: string
}

export const DEFAULT_OPTIONS: DetectorOptions = {
  order: ['querystring', 'cookie', 'header'],
  lookupQueryString: 'lang',
  lookupCookie: 'language',
  lookupFromHeaderKey: 'accept-language',
  lookupFromPathIndex: 0,
  caches: ['cookie'],
  ignoreCase: true,
  fallbackLanguage: 'en',
  supportedLanguages: ['en'],
  cookieOptions: {
    sameSite: 'Strict',
    secure: true,
    maxAge: 365 * 24 * 60 * 60,
    httpOnly: true,
  },
  debug: false,
}
/**
 * Parse Accept-Language header values with quality scores
 * @param header Accept-Language header string
 * @returns Array of parsed languages with quality scores
 */
export function parseAcceptLanguage(header: string): Array<{ lang: string; q: number }> {
  return parseAccept(header).map(({ type, q }) => ({ lang: type, q }))
}

/**
 * Validate and normalize language codes
 * @param lang Language code to normalize
 * @param options Detector options
 * @returns Normalized language code or undefined
 */
export const normalizeLanguage = (
  lang: string | null | undefined,
  options: DetectorOptions
): string | undefined => {
  if (!lang) {
    return undefined
  }

  try {
    let normalizedLang = lang.trim()
    if (options.convertDetectedLanguage) {
      normalizedLang = options.convertDetectedLanguage(normalizedLang)
    }

    const compLang = options.ignoreCase ? normalizedLang.toLowerCase() : normalizedLang
    const compSupported = options.supportedLanguages.map((l) =>
      options.ignoreCase ? l.toLowerCase() : l
    )

    // Exact match
    const exactIndex = compSupported.indexOf(compLang)
    if (exactIndex !== -1) {
      return options.supportedLanguages[exactIndex]
    }

    // Progressive truncation (RFC 4647 Lookup)
    const parts = compLang.split('-')
    for (let i = parts.length - 1; i > 0; i--) {
      const candidate = parts.slice(0, i).join('-')
      const prefixIndex = compSupported.indexOf(candidate)
      if (prefixIndex !== -1) {
        return options.supportedLanguages[prefixIndex]
      }
    }

    return undefined
  } catch {
    return undefined
  }
}

/**
 * Detects language from query parameter
 */
export const detectFromQuery = (c: Context, options: DetectorOptions): string | undefined => {
  try {
    const query = c.req.query(options.lookupQueryString)
    return normalizeLanguage(query, options)
  } catch {
    return undefined
  }
}

/**
 * Detects language from cookie
 */
export const detectFromCookie = (c: Context, options: DetectorOptions): string | undefined => {
  try {
    const cookie = getCookie(c, options.lookupCookie)
    return normalizeLanguage(cookie, options)
  } catch {
    return undefined
  }
}

/**
 * Detects language from Accept-Language header
 */
export const detectFromHeader = (c: Context, options: DetectorOptions): string | undefined => {
  try {
    const acceptLanguage = c.req.header(options.lookupFromHeaderKey)
    if (!acceptLanguage) {
      return undefined
    }

    const languages = parseAcceptLanguage(acceptLanguage)
    for (const { lang } of languages) {
      const normalizedLang = normalizeLanguage(lang, options)
      if (normalizedLang) {
        return normalizedLang
      }
    }
    return undefined
  } catch {
    return undefined
  }
}

/**
 * Detects language from URL path
 */
export const detectFromPath = (c: Context, options: DetectorOptions): string | undefined => {
  try {
    const url = new URL(c.req.url)
    const pathSegments = url.pathname.split('/').filter(Boolean)
    const langSegment = pathSegments[options.lookupFromPathIndex]
    return normalizeLanguage(langSegment, options)
  } catch {
    return undefined
  }
}

/**
 * Collection of all language detection strategies
 */
export const detectors = {
  querystring: detectFromQuery,
  cookie: detectFromCookie,
  header: detectFromHeader,
  path: detectFromPath,
} as const
/**
 * Validate detector options
 * @param options Detector options to validate
 * @throws Error if options are invalid
 */
export const validateOptions = (options: DetectorOptions): void => {
  if (!options.supportedLanguages.includes(options.fallbackLanguage)) {
    throw new Error('Fallback language must be included in supported languages')
  }

  if (options.lookupFromPathIndex < 0) {
    throw new Error('Path index must be non-negative')
  }

  if (!options.order.every((detector) => Object.keys(detectors).includes(detector))) {
    throw new Error('Invalid detector type in order array')
  }
}

/**
 * Cache detected language
 */
const cacheLanguage = (c: Context, language: string, options: DetectorOptions): void => {
  if (!Array.isArray(options.caches) || !options.caches.includes('cookie')) {
    return
  }

  try {
    setCookie(c, options.lookupCookie, language, options.cookieOptions)
  } catch (error) {
    if (options.debug) {
      console.error('Failed to cache language:', error)
    }
  }
}

/**
 * Detect language from request
 */
const detectLanguage = (c: Context, options: DetectorOptions): string => {
  let detectedLang: string | undefined

  for (const detectorName of options.order) {
    const detector = detectors[detectorName]
    if (!detector) {
      continue
    }

    try {
      detectedLang = detector(c, options)
      if (detectedLang) {
        if (options.debug) {
          console.log(`Language detected from ${detectorName}: ${detectedLang}`)
        }
        break
      }
    } catch (error) {
      if (options.debug) {
        console.error(`Error in ${detectorName} detector:`, error)
      }
      continue
    }
  }

  const finalLang = detectedLang || options.fallbackLanguage

  if (detectedLang && options.caches) {
    cacheLanguage(c, finalLang, options)
  }

  return finalLang
}

/**
 * Language detector middleware factory
 * @param userOptions Configuration options for the language detector
 * @returns Hono middleware function
 */
export const languageDetector = (userOptions: Partial<DetectorOptions>): MiddlewareHandler => {
  const options: DetectorOptions = {
    ...DEFAULT_OPTIONS,
    ...userOptions,
    cookieOptions: {
      ...DEFAULT_OPTIONS.cookieOptions,
      ...userOptions.cookieOptions,
    },
  }

  validateOptions(options)

  return async function languageDetector(ctx, next) {
    try {
      const lang = detectLanguage(ctx, options)
      ctx.set('language', lang)
    } catch (error) {
      if (options.debug) {
        console.error('Language detection failed:', error)
      }
      ctx.set('language', options.fallbackLanguage)
    }

    await next()
  }
}
