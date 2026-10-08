<script setup>
import axiosInstance from '@/store/axiosInstance'
import QuestionsList from '@/views/page/discuss/QuestionsList.vue'

definePageMeta({
  name: 'discuss-index',
})

const { data: ssrDiscussBootstrap } = await useAsyncData('discuss-bootstrap', async () => {
  try {
    const [questionsRes, initRes] = await Promise.all([
      axiosInstance.post('/discuss', { page: 1 }),
      axiosInstance.post('/discuss/layouts/getInitData'),
    ])
    return {
      questions: questionsRes.data?.questions || [],
      pagination: questionsRes.data?.pagination || null,
      initData: initRes.data?.initData || null,
    }
  } catch {
    return null
  }
})

provide('ssrDiscussBootstrap', ssrDiscussBootstrap)
</script>

<template>
  <QuestionsList />
</template>
