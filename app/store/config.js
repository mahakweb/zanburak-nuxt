const devDefaults = {
  appUrl: 'http://localhost:3000',
  apiBaseUrl: 'http://localhost:8000/api',
  pusherKey: 'zanburak-key',
  wsHost: 'localhost',
  wsPort: 6001,
  wssPort: 6001,
  forceTLS: false,
  googleRecaptchaSitekey: '6LccV6QrAAAAAPJg8qA5ZjGfXGZrBn5xjEZ8Irox',
}

const prodDefaults = {
  appUrl: 'https://zanburak.ir',
  apiBaseUrl: 'https://api.zanburak.ir/api',
  pusherKey: 'zb_live_3kf9d2m7p1q8',
  wsHost: 'api.zanburak.ir',
  wsPort: 443,
  wssPort: 443,
  forceTLS: true,
  googleRecaptchaSitekey: '6LekVqQrAAAAAKtusONUqgC840FJxDon_RilcxGN',
}

function envDefaults() {
  return import.meta.dev ? devDefaults : prodDefaults
}

function envStr(key) {
  try {
    return process.env?.[key] || undefined
  } catch {
    return undefined
  }
}

function envBool(key, fallback) {
  const v = envStr(key)
  if (v == null) return fallback
  return v === 'true' || v === '1'
}

function envNum(key, fallback) {
  const v = envStr(key)
  if (v == null || v === '') return fallback
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

/**
 * SSR-safe config. Do NOT call useRuntimeConfig() here — this module is imported
 * at module-eval time (axios), outside Nuxt setup context (NUXT_E1001).
 * Nitro injects NUXT_PUBLIC_* into process.env at runtime.
 */
function buildConfig() {
  const env = envDefaults()
  const isProd = !import.meta.dev

  const apiBaseUrl = envStr('NUXT_PUBLIC_API_BASE_URL') || env.apiBaseUrl
  const appUrl = envStr('NUXT_PUBLIC_APP_URL') || env.appUrl

  const pusherConfig = {
    broadcaster: 'pusher',
    key: envStr('NUXT_PUBLIC_PUSHER_KEY') || env.pusherKey,
    cluster: envStr('NUXT_PUBLIC_PUSHER_CLUSTER') || 'mt1',
    wsHost: envStr('NUXT_PUBLIC_PUSHER_WS_HOST') || env.wsHost,
    wsPort: envNum('NUXT_PUBLIC_PUSHER_WS_PORT', env.wsPort),
    wssPort: envNum('NUXT_PUBLIC_PUSHER_WSS_PORT', env.wssPort),
    forceTLS: envBool('NUXT_PUBLIC_PUSHER_FORCE_TLS', isProd ? env.forceTLS : false),
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
    withCredentials: false,
    authEndpoint: `${apiBaseUrl}/broadcasting/auth`,
  }

  return {
    pusherConfig,
    appUrl,
    apiBaseUrl,
    googleRecaptchaSitekey:
      envStr('NUXT_PUBLIC_RECAPTCHA_SITEKEY') || env.googleRecaptchaSitekey,
  }
}

let cached = null

function getConfig() {
  if (!cached) cached = buildConfig()
  return cached
}

export default new Proxy(
  {},
  {
    get(_target, prop) {
      if (prop === 'then') return undefined
      return getConfig()[prop]
    },
  },
)
