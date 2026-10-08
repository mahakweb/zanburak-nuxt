<script setup>
import axiosInstance from '@/store/axiosInstance'
import FaqComponent from '@/views/page/FaqComponent.vue'

definePageMeta({
  name: 'faq',
})

const { data: ssrFaqs } = await useAsyncData('faqs-list', async () => {
  try {
    const { data } = await axiosInstance.get('/faqs')
    return data?.faqs || []
  } catch {
    return []
  }
})

provide('ssrFaqs', ssrFaqs)
</script>

<template>
  <FaqComponent />
</template>
