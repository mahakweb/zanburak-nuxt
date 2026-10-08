<script setup>
definePageMeta({
  name: 'panel-messenger-join',
  middleware: ['auth'],
})

const MessengerPage = defineAsyncComponent(() =>
  import('@/views/page/messenger/MessengerPage.vue'),
)
</script>

<template>
  <ClientOnly>
    <MessengerPage />
    <template #fallback>
      <div class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-100 dark:bg-[#0e1621]">
        <div class="h-10 w-10 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
      </div>
    </template>
  </ClientOnly>
</template>
