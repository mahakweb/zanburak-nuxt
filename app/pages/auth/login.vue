<script setup>
definePageMeta({
  name: 'login',
  middleware: ['guest'],
})
</script>

<template>
  <UnifiedAuthPage />
</template>

<script>
import UnifiedAuthPage from '@/views/page/auth/UnifiedAuthPage.vue'
export default {
  components: { UnifiedAuthPage },
}
</script>
