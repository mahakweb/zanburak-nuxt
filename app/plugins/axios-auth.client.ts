export default defineNuxtPlugin(() => {
  window.addEventListener('storage', (event) => {
    if (event.key === 'token' && !event.newValue) {
      window.location.href = '/auth/login'
    }
  })
})
