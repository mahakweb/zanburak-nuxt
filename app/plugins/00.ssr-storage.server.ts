/**
 * Per-request memory Storage for SSR so Options API data()/created()
 * that touch localStorage do not crash. Concurrent requests each get
 * their own Map via AsyncLocalStorage.
 */
import { AsyncLocalStorage } from 'node:async_hooks'

function createMemoryStorage() {
  const map = new Map()
  return {
    getItem(key) {
      const k = String(key)
      return map.has(k) ? map.get(k) : null
    },
    setItem(key, value) {
      map.set(String(key), String(value))
    },
    removeItem(key) {
      map.delete(String(key))
    },
    clear() {
      map.clear()
    },
    key(index) {
      return Array.from(map.keys())[index] ?? null
    },
    get length() {
      return map.size
    },
  }
}

const als = new AsyncLocalStorage()

function activeStorage(kind) {
  const store = als.getStore()
  if (store?.[kind]) return store[kind]
  // Fallback isolated bucket (should be rare — ALS not entered)
  if (!globalThis.__zanburakStorageFallback) {
    globalThis.__zanburakStorageFallback = {
      localStorage: createMemoryStorage(),
      sessionStorage: createMemoryStorage(),
    }
  }
  return globalThis.__zanburakStorageFallback[kind]
}

function installShim() {
  if (globalThis.__zanburakStorageShimInstalled) return
  globalThis.__zanburakStorageShimInstalled = true

  const define = (name) => {
    try {
      Object.defineProperty(globalThis, name, {
        configurable: true,
        enumerable: true,
        get() {
          return activeStorage(name)
        },
      })
    } catch {
      /* already defined */
    }
  }

  if (typeof globalThis.localStorage === 'undefined') define('localStorage')
  if (typeof globalThis.sessionStorage === 'undefined') define('sessionStorage')
}

installShim()

export function runWithSsrStorage(fn) {
  return als.run(
    {
      localStorage: createMemoryStorage(),
      sessionStorage: createMemoryStorage(),
    },
    fn,
  )
}

export default defineNuxtPlugin({
  name: 'ssr-storage-shim',
  enforce: 'pre',
  setup(nuxtApp) {
    installShim()
    const bag = {
      localStorage: createMemoryStorage(),
      sessionStorage: createMemoryStorage(),
    }
    // Keep a reference for the duration of this request's Vue app
    nuxtApp.hooks.hook('app:created', () => {
      als.enterWith(bag)
    })
  },
})
