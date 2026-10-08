/**
 * Helpers for SEO-friendly images (lazy/eager, CLS, optional WebP).
 * Safe for remote CDN URLs — WebP candidate only when it can be derived.
 */

const SITE_URL = process.env.VUE_APP_SITE_URL || 'https://zanburak.ir'

export function toAbsoluteUrl(url) {
  if (!url || typeof url !== 'string') return ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url
  }
  if (url.startsWith('//')) return `https:${url}`
  const path = url.startsWith('/') ? url : `/${url}`
  return `${SITE_URL}${path}`
}

/**
 * Derive a .webp sibling URL when the source looks like a raster image.
 * Returns '' if derivation is unsafe (already webp, svg, data URL).
 * Always returns a sibling for .png/.jpg so <picture><source> stays in the DOM
 * (browser falls back to <img> if the .webp file is missing).
 */
export function deriveWebpUrl(src) {
  if (!src || typeof src !== 'string') return ''
  if (src.startsWith('data:') || src.startsWith('blob:')) return ''
  const [pathPart, query = ''] = src.split('?')
  const lower = pathPart.toLowerCase()
  if (lower.endsWith('.webp') || lower.endsWith('.svg') || lower.endsWith('.gif') || lower.endsWith('.avif')) {
    return ''
  }
  if (!/\.(jpe?g|png)$/i.test(pathPart)) return ''
  const webpPath = pathPart.replace(/\.(jpe?g|png)$/i, '.webp')
  return query ? `${webpPath}?${query}` : webpPath
}

/**
 * Build a simple width-based srcset from a single URL when the host supports
 * common resize query params. Returns '' when not applicable.
 * Supports: ?w= / &width= style already present → leave alone.
 */
export function buildWidthSrcSet(src, widths = [320, 640, 960, 1280]) {
  if (!src || typeof src !== 'string') return ''
  if (src.startsWith('data:') || src.startsWith('blob:')) return ''
  // Only add w= for same-origin /assets or known API media paths with no existing w=
  if (/[?&](w|width|s)=/i.test(src)) return ''
  const absolute = toAbsoluteUrl(src)
  try {
    const u = new URL(absolute)
    // Only invent srcset for our own assets (avoid breaking third-party CDNs)
    const host = u.hostname.replace(/^www\./, '')
    if (!['zanburak.ir', 'api.zanburak.ir', 'localhost'].includes(host) && !host.endsWith('.zanburak.ir')) {
      return ''
    }
    return widths
      .map((w) => {
        const copy = new URL(u.toString())
        copy.searchParams.set('w', String(w))
        return `${copy.toString()} ${w}w`
      })
      .join(', ')
  } catch {
    return ''
  }
}

export function defaultSizes(aspect = 'card') {
  if (aspect === 'hero') return '100vw'
  if (aspect === 'avatar') return '40px'
  if (aspect === 'icon') return '56px'
  if (aspect === 'thumb') return '(max-width: 640px) 50vw, 200px'
  return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
}
