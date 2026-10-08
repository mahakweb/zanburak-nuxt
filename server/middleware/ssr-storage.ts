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

const als = globalThis.__zanburakStorageALS || new AsyncLocalStorage()
globalThis.__zanburakStorageALS = als

function activeStorage(kind) {
  const store = als.getStore()
  if (store?.[kind]) return store[kind]
  if (!globalThis.__zanburakStorageFallback) {
    globalThis.__zanburakStorageFallback = {
      localStorage: createMemoryStorage(),
      sessionStorage: createMemoryStorage(),
    }
  }
  return globalThis.__zanburakStorageFallback[kind]
}

if (!globalThis.__zanburakStorageShimInstalled) {
  globalThis.__zanburakStorageShimInstalled = true
  for (const name of ['localStorage', 'sessionStorage']) {
    if (typeof globalThis[name] !== 'undefined') continue
    Object.defineProperty(globalThis, name, {
      configurable: true,
      enumerable: true,
      get() {
        return activeStorage(name)
      },
    })
  }
}

/**
 * Enter request-scoped memory storage before Nuxt renders.
 */
export default defineEventHandler((event) => {
  const bag = {
    localStorage: createMemoryStorage(),
    sessionStorage: createMemoryStorage(),
  }
  als.enterWith(bag)
  event.context.ssrStorage = bag
})
