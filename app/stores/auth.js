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
    ready: false,
  })
  const isAuthenticated = computed(() => status.loggedIn)
  const isReady = computed(() => status.ready)
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
    status.ready = true
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
      .get('/user', { skipCancelOnNavigate: true })
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
      status.ready = true
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

  function isCanceledAuthError(error) {
    return (
      error?.code === 'ERR_CANCELED' ||
      error?.name === 'CanceledError' ||
      error?.response?.status === 0
    )
  }

  /**
   * Restore the browser's HttpOnly Laravel session cookie. A legacy Bearer
   * token remains supported for sessions created by older Nuxt deployments.
   *
   * A canceled /user call must not resolve as "logged out" — callers (route
   * middleware) would redirect to login and then bounce back after a retry.
   */
  async function restoreFromStorage() {
    if (restorePromise) return restorePromise

    restorePromise = (async () => {
      const maxAttempts = 3
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const authToken = getAuthToken()
        if (authToken) applyAxiosAuth(authToken)

        try {
          const user = await refreshUser()
          if (!user) clearSession()
          return
        } catch (error) {
          if (isCanceledAuthError(error) && attempt < maxAttempts - 1) {
            continue
          }
          if (!isCanceledAuthError(error) && error.response?.status !== 401) {
            console.error('[auth] Failed to restore user profile', error)
          }
          clearSession()
          return
        }
      }
    })().finally(() => {
      restorePromise = null
      status.ready = true
    })

    return restorePromise
  }

  return {
    status,
    isAuthenticated,
    isReady,
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
