<script setup>
import ContactUs from '@/views/page/ContactUs.vue'
import { useSEO } from '@/composables/useSEO'

definePageMeta({
  name: 'contact',
})

const { t } = useI18n()

useSEO({
  title: t('contact.seo.title'),
  description: t('contact.seo.description'),
  url: '/contact',
  keywords: ['تماس با ما', 'ارتباط با ما', 'پشتیبانی', 'آدرس زنبورک', 'شماره تماس', 'زنبورک'],
  noindex: false,
})
</script>

<template>
  <ContactUs />
</template>
