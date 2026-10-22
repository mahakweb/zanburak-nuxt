import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'
import axiosInstance from '@/store/axiosInstance'
import AuthService from '@/services/auth.service'
import {
  clearAuthToken,
  getAuthToken,
  persistAuthToken,
} from '@/utils/authToken'

export const useAuthStore = defineStore('auth', () => {
  const status = reactive({
    loggedIn: false,
    userInfo: null,
  })
  const isAuthenticated = computed(() => status.loggedIn)
  let refreshUserPromise = null
  let restorePromise = null

  function applyAxiosAuth(value) {
    // On the server the request interceptor reads the token from this request's
    // cookie. Never mutate shared Axios defaults across concurrent SSR requests.
    if (import.meta.server) return
    if (value) {
      axiosInstance.addHeaders({ Authorization: `Bearer ${value}` })
    } else if (axiosInstance.defaults?.headers?.common) {
      delete axiosInstance.defaults.headers.common.Authorization
    }
  }

  function setUserInfo(userInfo) {
    status.userInfo = userInfo
  }

  function setSession(data) {
    status.loggedIn = true
    status.userInfo = data.user
    if (data.token) {
      persistAuthToken(data.token)
      applyAxiosAuth(data.token)
    } else {
      clearAuthToken()
      applyAxiosAuth(null)
    }
  }

  function clearSession() {
    status.loggedIn = false
    status.userInfo = null
  }

  async function refreshUser() {
    if (refreshUserPromise) return refreshUserPromise

    const authToken = getAuthToken()
    if (authToken) applyAxiosAuth(authToken)

    refreshUserPromise = axiosInstance
      .get('/user')
      .then((response) => {
        if (response.data) {
          status.loggedIn = true
          setUserInfo(response.data)
          return response.data
        }
        clearAuthToken()
        applyAxiosAuth(null)
        clearSession()
        return null
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          clearAuthToken()
          applyAxiosAuth(null)
          clearSession()
        }
        throw error
      })
      .finally(() => {
        refreshUserPromise = null
      })

    return refreshUserPromise
  }

  async function completeLogin(data) {
    if (!data?.user) {
      throw new TypeError('Authentication response must include a user')
    }
    setSession(data)
  }

  async function login(credentials) {
    try {
      const response = await AuthService.login(credentials)
      await completeLogin(response.data)
      return response
    } catch (error) {
      clearAuthToken()
      applyAxiosAuth(null)
      clearSession()
      throw error
    }
  }

  async function register(user) {
    try {
      const response = await AuthService.register(user)
      await completeLogin(response.data)
      return response.data
    } catch (error) {
      clearAuthToken()
      applyAxiosAuth(null)
      clearSession()
      throw error
    }
  }

  async function logout() {
    try {
      await AuthService.logout()
    } catch (error) {
      console.warn('[auth] Server logout failed; clearing the local session', error)
    } finally {
      clearAuthToken()
      applyAxiosAuth(null)
      clearSession()
      try {
        const { useNotificationStore } = await import('./notification')
        useNotificationStore().resetFeed()
      } catch (error) {
        console.error('[auth] Failed to reset notifications after logout', error)
      }
      try {
        const { useMessengerStore } = await import('./messenger')
        useMessengerStore().forgetSession()
      } catch (error) {
        console.error('[auth] Failed to reset messenger after logout', error)
      }
    }
  }

  /**
   * Restore the browser's HttpOnly Laravel session cookie. A legacy Bearer
   * token remains supported for sessions created by older Nuxt deployments.
   */
  async function restoreFromStorage() {
    if (restorePromise) return restorePromise

    restorePromise = (async () => {
      const authToken = getAuthToken()
      if (authToken) applyAxiosAuth(authToken)

      try {
        const user = await refreshUser()
        if (!user) clearSession()
      } catch (error) {
        if (error.response?.status !== 401) console.error('[auth] Failed to restore user profile', error)
        clearSession()
      }
    })().finally(() => {
      restorePromise = null
    })

    return restorePromise
  }

  return {
    status,
    isAuthenticated,
    setUserInfo,
    refreshUser,
    getUser: refreshUser,
    completeLogin,
    login,
    logout,
    register,
    restoreFromStorage,
  }
})
