import { useRequestHeaders } from '#app'

/**
 * Auth token persistence for Nuxt SSR + client.
 * Cookie `zb_token` is the source of truth; localStorage is only a client-side
 * migration fallback for sessions created before cookie-based persistence.
 */

export const AUTH_TOKEN_COOKIE = 'zb_token'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30 // 30 days

function parseStoredToken(raw) {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    return typeof parsed === 'string' && parsed ? parsed : null
  } catch {
    return typeof raw === 'string' && raw && raw !== 'null' && raw !== 'undefined' ? raw : null
  }
}

/** Read token from a Cookie header / document.cookie string. */
export function readTokenFromCookieString(cookieHeader = '') {
  if (!cookieHeader) return null
  const parts = String(cookieHeader).split(';')
  for (const part of parts) {
    const idx = part.indexOf('=')
    if (idx === -1) continue
    const key = part.slice(0, idx).trim()
    if (key !== AUTH_TOKEN_COOKIE) continue
    try {
      return decodeURIComponent(part.slice(idx + 1).trim()) || null
    } catch {
      return part.slice(idx + 1).trim() || null
    }
  }
  return null
}

function writeClientCookie(token) {
  if (!import.meta.client) return
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  if (token) {
    document.cookie = `${AUTH_TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax${secure}`
  } else {
    document.cookie = `${AUTH_TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secure}`
  }
}

/**
 * Safe token read for axios interceptors / services.
 * Server request headers are request-scoped; no module-level token is retained.
 */
export function getAuthTokenSync() {
  if (import.meta.client) {
    try {
      const fromCookie = readTokenFromCookieString(document.cookie)
      if (fromCookie) return fromCookie
    } catch {
      /* cookie unavailable */
    }
    try {
      const fromLs = parseStoredToken(localStorage.getItem('token'))
      if (fromLs) return fromLs
    } catch {
      /* localStorage unavailable */
    }
    return null
  }

  try {
    const headers = useRequestHeaders(['cookie'])
    return readTokenFromCookieString(headers.cookie || '')
  } catch {
    return null
  }
}

/**
 * Cookie-aware helpers for Nuxt setup / plugins / middleware only.
 */
export function useAuthTokenCookie() {
  return useCookie(AUTH_TOKEN_COOKIE, {
    maxAge: MAX_AGE_SECONDS,
    sameSite: 'lax',
    secure: !import.meta.dev,
    path: '/',
    watch: false,
  })
}

export function getAuthToken() {
  // Prefer Nuxt cookie when inside setup context
  try {
    const cookie = useAuthTokenCookie()
    if (cookie.value) return String(cookie.value)
  } catch {
    /* outside setup — fall through */
  }
  return getAuthTokenSync()
}

export function persistAuthToken(token) {
  if (!token) {
    clearAuthToken()
    return
  }

  const value = String(token)

  try {
    const cookie = useAuthTokenCookie()
    cookie.value = value
  } catch {
    writeClientCookie(value)
  }

  if (import.meta.client) {
    try {
      localStorage.removeItem('token')
    } catch {
      /* ignore */
    }
    writeClientCookie(value)
  }
}

export function clearAuthToken() {
  try {
    const cookie = useAuthTokenCookie()
    cookie.value = null
  } catch {
    writeClientCookie(null)
  }

  if (import.meta.client) {
    try {
      localStorage.removeItem('token')
    } catch {
      /* ignore */
    }
    writeClientCookie(null)
  }
}
