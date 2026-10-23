import { setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

/** First-load paths that must not paint until the session is known. */
function initialPathNeedsSession(pathname: string) {
    const path = pathname || '/'
    return (
        path.startsWith('/admin') ||
        path.startsWith('/panel') ||
        path.startsWith('/messenger') ||
        path.startsWith('/quiz') ||
        path.startsWith('/payment') ||
        path.startsWith('/checkout') ||
        path.startsWith('/auth') ||
        path.startsWith('/oauth') ||
        path === '/request-project' ||
        path.startsWith('/discuss/create') ||
        /\/discuss\/.+\/edit\/?$/.test(path)
    )
}

/**
 * Restore the session on the client.
 * Public pages do not wait — the navbar skeleton covers the in-flight /user
 * request. Protected/guest routes await restore so the first paint is the
 * real page instead of login-then-redirect.
 *
 * Skip SSR restore so public HTML/payload never serializes the user profile.
 */
export default defineNuxtPlugin({
    name: 'auth-session',
    dependsOn: ['pinia-active'],
    async setup(nuxtApp) {
        if (import.meta.server) return
        const pinia = nuxtApp.$pinia || usePinia()
        if (pinia) setActivePinia(pinia)
        const auth = useAuthStore(pinia)
        const pathname = window.location.pathname
        if (initialPathNeedsSession(pathname)) {
            await auth.restoreFromStorage()
            return
        }
        auth.restoreFromStorage()
    },
})
