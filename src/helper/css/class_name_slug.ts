//ff:type feature=helper type=model
//ff:what Class name slug

/**
 * A function that customizes generated CSS class names.
 *
 * @param hash - The default hash-based class name (e.g. `css-1234567890`)
 * @param label - The comment label extracted from the CSS template, may be empty.
 *   Whitespace is trimmed and inner spaces are replaced with hyphens.
 * @param styleString - The minified CSS style string
 * @returns The custom class name to use. Must be a safe CSS identifier;
 *   otherwise, the default hash is used as a fallback.
 */
export type ClassNameSlug = (hash: string, label: string, styleString: string) => string
