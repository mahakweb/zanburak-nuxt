/** Lazy root state/getters for Vuex-module actions (messenger, auth logout, etc.). */

import { getActivePinia, setActivePinia } from 'pinia'

const namespaceIds = ['auth', 'cart', 'notification', 'adminComments', 'messenger']

let storeFactories = null

export function registerStoreFactories(factories) {
  storeFactories = factories
}

function resolvePinia() {
  let pinia = getActivePinia()
  if (pinia) return pinia
  try {
    const nuxtApp = tryUseNuxtApp()
    pinia = nuxtApp?.$pinia
  } catch {
    /* outside Nuxt */
  }
  if (!pinia) {
    try {
      pinia = usePinia()
    } catch {
      /* pinia not ready */
    }
  }
  if (pinia) setActivePinia(pinia)
  return getActivePinia()
}

function tryStore(id) {
  if (!storeFactories?.[id]) return null
  try {
    const pinia = resolvePinia()
    // Always pass pinia explicitly — bare useXxxStore() triggers PINIA_R1004 on SSR.
    if (!pinia) return null
    return storeFactories[id](pinia)
  } catch {
    return null
  }
}

export function getRootState() {
  const root = {}
  for (const id of namespaceIds) {
    const s = tryStore(id)
    const piniaState = s?.$state
    root[id] =
      piniaState?.$state && typeof piniaState.$state === 'object'
        ? piniaState.$state
        : (piniaState ?? {})
  }
  return root
}

function readGetter(store, name) {
  if (!store) return undefined
  const v = store[name]
  if (v && typeof v === 'object' && 'value' in v) return v.value
  return v
}

export function getRootGetters() {
  const root = {}
  for (const id of namespaceIds) {
    const s = tryStore(id)
    if (!s) continue
    const mod = s.__vuexGetters
    if (mod) {
      for (const [name, fn] of Object.entries(mod)) {
        root[`${id}/${name}`] = fn
      }
    }
  }
  return new Proxy(root, {
    get(target, prop) {
      if (typeof prop !== 'string') return undefined
      const fn = target[prop]
      if (typeof fn === 'function') return fn()
      const slash = prop.indexOf('/')
      if (slash === -1) return undefined
      const ns = prop.slice(0, slash)
      const name = prop.slice(slash + 1)
      return readGetter(tryStore(ns), name)
    },
  })
}

let rootDispatch = null
let rootCommit = null

export function setRootDispatch(fn) {
  rootDispatch = fn
}
export function setRootCommit(fn) {
  rootCommit = fn
}

export function getDispatch() {
  return rootDispatch ?? (() => Promise.resolve())
}
export function getCommit() {
  return rootCommit ?? (() => {})
}
