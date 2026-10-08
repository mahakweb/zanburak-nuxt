<template>
  <div class="min-h-screen flex flex-col">
    <ClientOnly>
      <PromotionBanner />
    </ClientOnly>
    <NavbarComponent />
    <main class="flex-1">
      <slot />
    </main>
    <FooterComponent />
  </div>
</template>

<script setup>
import NavbarComponent from '@/views/components/home/NavbarComponent.vue'
import FooterComponent from '@/views/components/home/FooterComponent.vue'
import PromotionBanner from '@/views/components/promotion/PromotionBanner.vue'
</script>
