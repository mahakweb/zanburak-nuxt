import { isRef, unref } from 'vue'
import { getActivePinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useNotificationStore } from '@/stores/notification'
import { useAdminCommentsStore } from '@/stores/adminComments'
import { useMessengerStore } from '@/stores/messenger'
import {
  registerStoreFactories,
  setRootDispatch,
  setRootCommit,
} from '@/stores/storeRoot'

const NS = {
  auth: useAuthStore,
  cart: useCartStore,
  notification: useNotificationStore,
  adminComments: useAdminCommentsStore,
  messenger: useMessengerStore,
}

let wired = false

function ensurePinia() {
  let pinia = getActivePinia()
  if (pinia) return pinia
  try {
    const nuxtApp = tryUseNuxtApp()
    pinia = nuxtApp?.$pinia
  } catch {
    /* outside Nuxt context */
  }
  if (!pinia) {
    try {
      pinia = usePinia()
    } catch {
      /* pinia module not ready */
    }
  }
  if (pinia) setActivePinia(pinia)
  return getActivePinia()
}

function wireRoot() {
  if (wired) return
  wired = true
  registerStoreFactories(NS)
  setRootDispatch((type, payload, options) => useStore().dispatch(type, payload, options))
  setRootCommit((type, payload) => useStore().commit(type, payload))
}

function piniaFor(ns) {
  wireRoot()
  const pinia = ensurePinia()
  // Never call Pinia store factories without an instance (PINIA_R1004 / SSR pollution).
  if (!pinia || !NS[ns]) return null
  return NS[ns](pinia)
}

/** Vuex module state: our stores expose reactive state as `$state` inside the Pinia store. */
function moduleState(store) {
  if (!store) return {}
  const piniaState = store.$state
  // Setup stores return `{ $state: reactive(...) }` which Pinia nests under store.$state.$state
  if (piniaState && piniaState.$state && typeof piniaState.$state === 'object') {
    return piniaState.$state
  }
  return piniaState ?? {}
}

function readGetter(store, name) {
  if (!store) return undefined
  const v = store[name]
  return isRef(v) ? unref(v) : v
}

/**
 * Vuex-compatible store facade backed by Pinia modules.
 */
export function useStore() {
  ensurePinia()
  wireRoot()

  const state = {
    get auth() {
      return moduleState(piniaFor('auth'))
    },
    get cart() {
      return moduleState(piniaFor('cart'))
    },
    get notification() {
      return moduleState(piniaFor('notification'))
    },
    get adminComments() {
      return moduleState(piniaFor('adminComments'))
    },
    get messenger() {
      return moduleState(piniaFor('messenger'))
    },
  }

  const getters = new Proxy(
    {},
    {
      get(_target, prop) {
        if (typeof prop !== 'string') return undefined
        const slash = prop.indexOf('/')
        if (slash === -1) return undefined
        const ns = prop.slice(0, slash)
        const name = prop.slice(slash + 1)
        return readGetter(piniaFor(ns), name)
      },
    },
  )

  function commit(type, payload) {
    const slash = type.indexOf('/')
    if (slash === -1) return
    const ns = type.slice(0, slash)
    const mutation = type.slice(slash + 1)
    const store = piniaFor(ns)
    if (store?.commit) store.commit(mutation, payload)
  }

  function dispatch(type, payload, options) {
    const slash = type.indexOf('/')
    if (slash === -1) return Promise.resolve()
    const ns = type.slice(0, slash)
    const action = type.slice(slash + 1)
    const store = piniaFor(ns)
    if (store?.dispatch) return store.dispatch(action, payload, options)
    if (store?.[action]) return Promise.resolve(store[action](payload))
    return Promise.resolve()
  }

  return { state, getters, commit, dispatch }
}

export function mapState(namespace, states) {
  const res = {}
  const entries = Array.isArray(states)
    ? states.map((key) => [key, key])
    : Object.entries(states)

  for (const [key, pathOrFn] of entries) {
    res[key] = function mappedState() {
      // Prefer this.$store in Options API so we never call useStore() outside setup.
      const store = this?.$store || useStore()
      const moduleState = namespace ? store.state[namespace] : store.state
      if (typeof pathOrFn === 'function') {
        return pathOrFn(moduleState)
      }
      const path = pathOrFn
      if (!namespace) {
        return path.split('/').reduce((o, p) => o?.[p], store.state)
      }
      return path.split('.').reduce((o, p) => o?.[p], moduleState)
    }
  }
  return res
}

export function mapGetters(namespace, getters) {
  const list = Array.isArray(getters) ? getters : Object.keys(getters)
  const res = {}
  for (const name of list) {
    const outKey = Array.isArray(getters) ? name : getters[name]
    const getterKey = Array.isArray(getters) ? name : name
    res[outKey] = function mappedGetter() {
      const store = this?.$store || useStore()
      return store.getters[`${namespace}/${getterKey}`]
    }
  }
  return res
}

export function mapActions(namespace, actions) {
  const list = Array.isArray(actions) ? actions : Object.keys(actions)
  const res = {}
  for (const name of list) {
    const outKey = Array.isArray(actions) ? name : actions[name]
    const actionKey = Array.isArray(actions) ? name : name
    res[outKey] = function mappedAction(...args) {
      const store = this?.$store || useStore()
      return store.dispatch(`${namespace}/${actionKey}`, ...args)
    }
  }
  return res
}

export function mapMutations(namespace, mutations) {
  const list = Array.isArray(mutations) ? mutations : Object.keys(mutations)
  const res = {}
  for (const name of list) {
    const outKey = Array.isArray(mutations) ? name : mutations[name]
    const mutationKey = Array.isArray(mutations) ? name : name
    res[outKey] = function mappedMutation(...args) {
      const store = this?.$store || useStore()
      return store.commit(`${namespace}/${mutationKey}`, ...args)
    }
  }
  return res
}
