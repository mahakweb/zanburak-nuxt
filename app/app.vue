<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <ClientOnly>
    <PwaInstallBanner />
  </ClientOnly>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useMessengerStore } from '@/stores/messenger'
import { computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { generateOrganizationSchema } from '@/composables/useSEO'
import { getRouteRobotsMeta, isPrivateSeoPath } from '@/composables/usePrivateSeo'
import { cleanupStuckOverlays } from '@/utils/cleanupOverlays'
import { getLanguageByLocale } from '@/config/languages'
import PwaInstallBanner from '@/views/components/pwa/PwaInstallBanner.vue'

const authStore = useAuthStore()
const messengerStore = useMessengerStore()
let streamUserId = null
let recoverGateAt = 0

const route = useRoute()
const { t, locale } = useI18n()
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


useHead(computed(() => {
  const isHome = route.path === '/' && !isPrivateSeoPath(route.path)
  return {
    title: isHome ? 'زنبورک' : undefined,
    meta: [
      ...getRouteRobotsMeta(route.path),
      ...(isHome
        ? [
            { name: 'description', content: t('app.seoDescription') },
            { name: 'keywords', content: t('app.seoKeywords').split('|').join(', ') },
          ]
        : []),
    ],
    script: isHome
      ? [{ type: 'application/ld+json', innerHTML: JSON.stringify(generateOrganizationSchema()) }]
      : [],
  }
}))

function isMessengerPath(path) {
  return String(path || '').startsWith('/messenger')
}

function messengerUserId() {
  const userInfo = authStore.status.userInfo
  return userInfo?.id || userInfo?.value?.id || null
}

function isMessengerSession() {
  return !!(authStore.status.loggedIn && messengerUserId() && isMessengerPath(route.path))
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
    authStore.status.loggedIn,
    messengerUserId(),
    isMessengerPath(route.path),
  ],
  async ([loggedIn, userId, onMessenger]) => {
    if (!import.meta.client) return
    const { connectionManager } = await import('@/services/connectionManager')
    connectionManager.setAuthenticated(loggedIn)
    if (!loggedIn || !userId) {
      if (streamUserId) messengerStore.forgetSession()
      else messengerStore.stopStream()
      streamUserId = null
      return
    }
    if (streamUserId && String(streamUserId) !== String(userId)) {
      messengerStore.forgetSession()
    }
    streamUserId = userId
    if (onMessenger) {
      messengerStore.startStream()
      return
    }
    messengerStore.stopStream()
  },
  { immediate: true },
)

async function onStorageChange(e) {
  if (e.key === 'token' && !e.newValue) {
    messengerStore.forgetSession()
    streamUserId = null
  } else if (e.key === 'token' && e.newValue && isMessengerSession()) {
    const { refreshEchoAuth } = await loadMessengerTransport()
    await refreshEchoAuth()
    messengerStore.startStream()
  }
}

async function recoverMessenger() {
  if (!isMessengerSession()) return
  const now = Date.now()
  if (now - recoverGateAt < 2000) return
  recoverGateAt = now
  try {
    const { connectionManager } = await loadMessengerTransport()
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      connectionManager.handleOffline()
      return
    }
    await connectionManager.ensureConnected()
    messengerStore.startStream()
    await messengerStore.recoverStream().catch(() => {})
    messengerStore.hydrateAndFlushOutbox().catch(() => {})
  } catch (e) {
    console.warn('[messenger] recover failed', e)
  }
}

function onVisibilityChange() {
  if (!isMessengerSession()) return
  messengerStore.presenceVisibility(!!document.hidden)
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
  messengerStore.stopStream()
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
