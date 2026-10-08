<script setup>
definePageMeta({
  name: 'cart',
})
</script>

<template>
  <CartPage />
</template>

<script>
import CartPage from '@/views/page/CartPage.vue'
export default {
  components: { CartPage },
}
</script>
