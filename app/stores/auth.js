import { defineStore } from 'pinia'
import { reactive } from 'vue'
import axiosInstance from '@/store/axiosInstance'
import AuthService from '@/services/auth.service'
import {
  clearAuthToken,
  getAuthToken,
  persistAuthToken,
} from '@/utils/authToken'
import { getDispatch } from './storeRoot'

let refreshUserPromise = null
let restorePromise = null

export const useAuthStore = defineStore('auth', () => {
  const state = reactive({
    status: { loggedIn: false, userInfo: null },
    token: null,
  })

  function applyAxiosAuth(token) {
    if (token) {
      axiosInstance.addHeaders({ Authorization: 'Bearer ' + token })
    } else if (axiosInstance.defaults?.headers?.common) {
      delete axiosInstance.defaults.headers.common.Authorization
    }
  }

  function setUserInfo(userInfo) {
    state.status.userInfo = userInfo
  }

  function loginSuccess(data) {
    state.status.loggedIn = true
    state.status.user = data.token
    state.status.userInfo = data.user
    state.token = data.token
  }

  function loginFailure() {
    state.status.loggedIn = false
    state.status.user = null
    state.status.userInfo = null
    state.token = null
  }

  function logoutMutation() {
    state.status.loggedIn = false
    state.status.user = null
    state.status.userInfo = null
    state.token = null
  }

  function registerSuccess(data) {
    state.status.loggedIn = true
    state.status.user = data.token
    state.status.userInfo = data.user
    state.token = data.token
  }

  function registerFailure() {
    state.status.loggedIn = false
    state.status.user = null
    state.status.userInfo = null
    state.token = null
  }

  function commit(type, payload) {
    switch (type) {
      case 'setUserInfo':
        setUserInfo(payload)
        break
      case 'loginSuccess':
        loginSuccess(payload)
        break
      case 'loginFailure':
        loginFailure()
        break
      case 'logout':
        logoutMutation()
        break
      case 'registerSuccess':
        registerSuccess(payload)
        break
      case 'registerFailure':
        registerFailure()
        break
      default:
        console.warn(`[auth] Unknown mutation: ${type}`)
    }
  }

  async function refreshUser() {
    if (refreshUserPromise) return refreshUserPromise

    const token = state.token || getAuthToken()
    if (!token) {
      return Promise.resolve(null)
    }

    applyAxiosAuth(token)

    refreshUserPromise = axiosInstance
      .get('/user')
      .then((response) => {
        if (response.data) {
          commit('setUserInfo', response.data)
          return response.data
        }
        return null
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          clearAuthToken()
          applyAxiosAuth(null)
          commit('loginFailure')
        }
        throw error
      })
      .finally(() => {
        refreshUserPromise = null
      })

    return refreshUserPromise
  }

  function getUser() {
    return refreshUser()
  }

  function completeLogin(data) {
    commit('loginSuccess', data)
    if (data?.token) {
      persistAuthToken(data.token)
      applyAxiosAuth(data.token)
    }
    return Promise.resolve()
  }

  function login(user) {
    return AuthService.login(user)
      .then((response) => completeLogin(response.data).then(() => response))
      .catch((error) => {
        clearAuthToken()
        applyAxiosAuth(null)
        commit('loginFailure')
        return Promise.reject(error)
      })
  }

  function logout() {
    AuthService.logout()
      .catch(() => {})
      .finally(() => {
        clearAuthToken()
        applyAxiosAuth(null)
        commit('logout')
        try {
          getDispatch()('notification/resetFeed', null, { root: true })
        } catch {
          /* ignore */
        }
      })
  }

  function register(user) {
    return AuthService.register(user)
      .then((response) => {
        commit('registerSuccess', response.data)
        if (response.data?.token) {
          persistAuthToken(response.data.token)
          applyAxiosAuth(response.data.token)
        }
        return Promise.resolve(response.data)
      })
      .catch((error) => {
        clearAuthToken()
        applyAxiosAuth(null)
        commit('registerFailure')
        return Promise.reject(error)
      })
  }

  /**
   * Restore session from cookie (SSR + client) and localStorage (client).
   * Safe to call from a universal plugin before route middleware.
   */
  async function restoreFromStorage() {
    if (restorePromise) return restorePromise

    restorePromise = (async () => {
      const token = getAuthToken()
      if (!token) {
        applyAxiosAuth(null)
        return
      }

      // Keep cookie + localStorage in sync on the client
      persistAuthToken(token)
      applyAxiosAuth(token)
      state.token = token
      state.status.loggedIn = true

      try {
        const response = await axiosInstance.get('/user')
        if (response.data) {
          state.status.userInfo = response.data
        }
      } catch (error) {
        if (error.response?.status === 401) {
          clearAuthToken()
          applyAxiosAuth(null)
          loginFailure()
        } else {
          console.error(error)
        }
      }
    })().finally(() => {
      restorePromise = null
    })

    return restorePromise
  }

  return {
    $state: state,
    commit,
    refreshUser,
    getUser,
    completeLogin,
    login,
    logout,
    register,
    restoreFromStorage,
  }
})
