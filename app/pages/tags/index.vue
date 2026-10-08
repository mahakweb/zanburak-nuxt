<script setup>
import { tagService } from '@/services/tag.service'
import TagsList from '@/views/page/tag/TagsList.vue'

definePageMeta({
  name: 'tags-index',
})

const { data: ssrTagsBootstrap } = await useAsyncData('tags-bootstrap', async () => {
  try {
    const response = await tagService.list({
      page: 1,
      sort: 'popular',
      perPage: 12,
    })
    return {
      tags: response.data?.tags || [],
      pagination: response.data?.pagination || null,
    }
  } catch {
    return null
  }
})

provide('ssrTagsBootstrap', ssrTagsBootstrap)
</script>

<template>
  <TagsList />
</template>
