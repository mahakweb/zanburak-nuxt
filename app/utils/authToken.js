/**
 * Auth token persistence for Nuxt SSR + client.
 * Cookie `zb_token` is the SSR source of truth; localStorage mirrors it on the client.
 *
 * IMPORTANT: Do not call Nuxt composables (useCookie / useRequestEvent) from axios
 * interceptors or other module-eval code — that triggers NUXT_E1001.
 */

export const AUTH_TOKEN_COOKIE = 'zb_token'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30 // 30 days

/** Per-request token set by the auth-session plugin on the server. */
let serverRequestToken = null

export function setServerRequestToken(token) {
  serverRequestToken = token || null
}

export function clearServerRequestToken() {
  serverRequestToken = null
}

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
 * Safe token read for axios interceptors / services (no Nuxt composables).
 * Client: localStorage → document.cookie
 * Server: token injected by auth-session plugin for this request
 */
export function getAuthTokenSync() {
  if (import.meta.client) {
    try {
      const fromLs = parseStoredToken(localStorage.getItem('token'))
      if (fromLs) return fromLs
    } catch {
      /* ignore */
    }
    try {
      return readTokenFromCookieString(document.cookie)
    } catch {
      return null
    }
  }
  return serverRequestToken
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
  setServerRequestToken(value)

  try {
    const cookie = useAuthTokenCookie()
    cookie.value = value
  } catch {
    writeClientCookie(value)
  }

  if (import.meta.client) {
    try {
      localStorage.setItem('token', JSON.stringify(value))
    } catch {
      /* ignore */
    }
    writeClientCookie(value)
  }
}

export function clearAuthToken() {
  clearServerRequestToken()

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
