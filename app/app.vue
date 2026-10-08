<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <ClientOnly>
    <PwaInstallBanner />
  </ClientOnly>
</template>

<script setup>
import { computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from '@/composables/useStore'
import { useSEO, generateOrganizationSchema } from '@/composables/useSEO'
import { applyRouteRobots, isPrivateSeoPath } from '@/composables/usePrivateSeo'
import { cleanupStuckOverlays } from '@/utils/cleanupOverlays'
import { getLanguageByLocale } from '@/config/languages'
import PwaInstallBanner from '@/views/components/pwa/PwaInstallBanner.vue'

const route = useRoute()
const { t, locale } = useI18n()
const store = useStore()

const langMeta = computed(() => {
  const lang = getLanguageByLocale(locale.value) || { locale: 'fa', dir: 'rtl' }
  return lang
})

useHead({
  htmlAttrs: {
    lang: () => langMeta.value.locale || 'fa',
    dir: () => langMeta.value.dir || 'rtl',
  },
  bodyAttrs: {
    class: 'rtl:font-YekanBakh bg-slate-100 dark:bg-gray-800 custom-scrollbar',
  },
})


async function syncRouteSeo() {
  applyRouteRobots(route.path)
  if (route.path === '/' && !isPrivateSeoPath(route.path)) {
    useSEO({
      title: '',
      description: t('app.seoDescription'),
      url: '/',
      keywords: t('app.seoKeywords').split('|'),
      schema: generateOrganizationSchema(),
    })
  }
  if (isPrivateSeoPath(route.path)) {
    await nextTick()
    applyRouteRobots(route.path)
    if (import.meta.client) {
      setTimeout(() => applyRouteRobots(route.path), 0)
    }
  }
}

watch(() => route.fullPath, () => {
  syncRouteSeo()
}, { immediate: true })

function isMessengerPath(path) {
  return String(path || '').startsWith('/messenger')
}

function messengerUserId() {
  const userInfo = store.state.auth.status.userInfo
  return userInfo?.id || userInfo?.value?.id || null
}

function isMessengerSession() {
  return !!(store.state.auth.status.loggedIn && messengerUserId() && isMessengerPath(route.path))
}

async function loadMessengerTransport() {
  const [{ connectionManager }, echo] = await Promise.all([
    import('@/services/connectionManager'),
    import('@/lib/echo'),
  ])
  return { connectionManager, ...echo }
}

watch(
  () => [
    store.state.auth.status.loggedIn,
    messengerUserId(),
    isMessengerPath(route.path),
  ],
  ([loggedIn, userId, onMessenger]) => {
    if (!import.meta.client) return
    if (loggedIn && userId && onMessenger) {
      store.dispatch('messenger/startStream')
      return
    }
    if (!loggedIn || (loggedIn && !onMessenger)) {
      store.dispatch('messenger/stopStream')
    }
  },
  { immediate: true },
)

async function onStorageChange(e) {
  if (e.key === 'token' && !e.newValue) {
    store.dispatch('messenger/stopStream')
  } else if (e.key === 'token' && e.newValue && isMessengerSession()) {
    const { refreshEchoAuth } = await loadMessengerTransport()
    await refreshEchoAuth()
    store.dispatch('messenger/startStream')
  }
}

async function recoverMessenger() {
  if (!isMessengerSession()) return
  try {
    const { connectionManager } = await loadMessengerTransport()
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      connectionManager.handleOffline()
      return
    }
    await connectionManager.ensureConnected()
    store.dispatch('messenger/startStream')
    await store.dispatch('messenger/recoverStream').catch(() => {})
    store.dispatch('messenger/hydrateAndFlushOutbox').catch(() => {})
  } catch (e) {
    console.warn('[messenger] recover failed', e)
  }
}

function onVisibilityChange() {
  if (!isMessengerSession()) return
  store.dispatch('messenger/presenceVisibility', !!document.hidden)
  if (!document.hidden) recoverMessenger()
}

onMounted(() => {
  if (!import.meta.client) return
  cleanupStuckOverlays()
  window.addEventListener('storage', onStorageChange)
  window.addEventListener('online', recoverMessenger)
  window.addEventListener('pageshow', recoverMessenger)
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onUnmounted(() => {
  if (!import.meta.client) return
  window.removeEventListener('storage', onStorageChange)
  window.removeEventListener('online', recoverMessenger)
  window.removeEventListener('pageshow', recoverMessenger)
  document.removeEventListener('visibilitychange', onVisibilityChange)
  store.dispatch('messenger/stopStream')
})

watch(() => route.path, (newPath, oldPath) => {
  if (!import.meta.client) return
  cleanupStuckOverlays()
  const nowMsg = isMessengerPath(newPath)
  const wasMsg = isMessengerPath(oldPath)
  if (nowMsg && !wasMsg) {
    recoverMessenger()
  }
})
</script>
