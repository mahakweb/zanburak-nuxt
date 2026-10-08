import axiosInstance from '@/store/axiosInstance'

export default defineNuxtPlugin(() => {
  try {
    const token = JSON.parse(localStorage.getItem('token') || 'null')
    if (token) {
      axiosInstance.addHeaders({ Authorization: `Bearer ${token}` })
    }
  } catch {
    /* noop */
  }

  window.addEventListener('storage', (event) => {
    if (event.key === 'token' && !event.newValue) {
      window.location.href = '/auth/login'
    }
  })
})
