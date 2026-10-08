<script setup>
import AboutUs from '@/views/page/AboutUs.vue'
import { useSEO } from '@/composables/useSEO'

definePageMeta({
  name: 'about',
})

const { t } = useI18n()

useSEO({
  title: t('about.seo.title'),
  description: t('about.seo.description'),
  url: '/about',
  keywords: ['درباره ما', 'درباره زنبورک', 'تیم زنبورک', 'آموزش برنامه‌نویسی', 'پلتفرم آموزشی'],
  noindex: false,
})
</script>

<template>
  <AboutUs />
</template>
