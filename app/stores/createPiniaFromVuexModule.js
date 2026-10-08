import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'
import { getRootState, getRootGetters, getDispatch } from './storeRoot'

function cloneInitialState(state) {
  if (typeof state === 'function') return state()
  return JSON.parse(JSON.stringify(state))
}

/**
 * Wrap a legacy namespaced Vuex module as a Pinia setup store (mutations/actions/getters unchanged).
 */
export function createPiniaFromVuexModule(id, module) {
  return defineStore(id, () => {
    const state = reactive(cloneInitialState(module.state))

    function commit(type, payload) {
      const mutation = module.mutations?.[type]
      if (!mutation) {
        console.warn(`[${id}] Unknown mutation: ${type}`)
        return
      }
      mutation(state, payload)
    }

    function buildLocalGetters() {
      const g = {}
      for (const [name, fn] of Object.entries(module.getters || {})) {
        Object.defineProperty(g, name, {
          get: () => fn(state, g, getRootState(), getRootGetters()),
          enumerable: true,
        })
      }
      return g
    }

    const getterComputeds = {}
    for (const name of Object.keys(module.getters || {})) {
      getterComputeds[name] = computed(() => buildLocalGetters()[name])
    }

    function dispatch(actionName, payload, options) {
      if (typeof actionName === 'string' && actionName.includes('/')) {
        return getDispatch()(actionName, payload, options)
      }
      if (options?.root) {
        return getDispatch()(`${id}/${actionName}`, payload, options)
      }
      const action = module.actions?.[actionName]
      if (!action) {
        console.warn(`[${id}] Unknown action: ${actionName}`)
        return Promise.resolve()
      }
      const ctx = {
        state,
        commit,
        dispatch: (a, p, o) => dispatch(a, p, o),
        getters: buildLocalGetters(),
        rootState: getRootState(),
        rootGetters: getRootGetters(),
      }
      return action(ctx, payload)
    }

    const actionFns = {}
    for (const name of Object.keys(module.actions || {})) {
      actionFns[name] = (payload) => dispatch(name, payload)
    }

    return {
      $state: state,
      commit,
      dispatch,
      __vuexGetters: Object.fromEntries(
        Object.keys(module.getters || {}).map((name) => [
          name,
          () => getterComputeds[name].value,
        ]),
      ),
      ...getterComputeds,
      ...actionFns,
    }
  })
}
