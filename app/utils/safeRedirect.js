/**
 * Allow only same-origin relative paths. Reject protocol-relative URLs
 * (`//evil.com`), backslash tricks, and encoded slashes.
 */
export function isSafeInternalPath(value) {
  if (typeof value !== 'string') return false
  const path = value.trim()
  if (!path.startsWith('/')) return false
  if (path.startsWith('//') || path.startsWith('/\\')) return false
  if (path.includes('\\')) return false
  if (/^[\\/]{2,}/.test(path)) return false
  if (/[\s@]/.test(path)) return false
  try {
    const origin = typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : 'https://zanburak.ir'
    const url = new URL(path, origin)
    if (url.origin !== origin) return false
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false
    return url.pathname.startsWith('/')
  } catch {
    return false
  }
}

export function safeInternalPath(value, fallback = '/') {
  return isSafeInternalPath(value) ? value : fallback
}
