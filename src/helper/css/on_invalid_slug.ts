//ff:type feature=helper type=model
//ff:what On invalid slug

/**
 * A callback function called when an invalid slug is returned from ClassNameSlug.
 *
 * @param slug - The invalid slug
 */
export type OnInvalidSlug = (slug: string) => void
