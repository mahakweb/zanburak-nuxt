<script setup>
import ArticleShow from '@/views/page/articles/ArticleShow.vue'

definePageMeta({
  name: "article-show",
})

const route = useRoute()
</script>

<template>
  <ArticleShow :article-slug="route.params.articleSlug" />
</template>
