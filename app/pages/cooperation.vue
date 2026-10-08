<script setup>
definePageMeta({
  name: 'cooperation',
})

const CooperationComponent = defineAsyncComponent(() =>
  import('@/views/page/CooperationComponent.vue'),
)
</script>

<template>
  <ClientOnly>
    <CooperationComponent />
    <template #fallback>
      <div class="mx-auto flex min-h-[40vh] max-w-screen-xl items-center justify-center px-4">
        <div class="h-10 w-10 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
      </div>
    </template>
  </ClientOnly>
</template>
