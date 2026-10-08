<script setup>
import { articleService } from '@/services/article.service'
import ArticlesList from '@/views/page/articles/ArticlesList.vue'

definePageMeta({
  name: 'articles-index',
})

const { data: ssrArticlesBootstrap } = await useAsyncData('articles-bootstrap', async () => {
  try {
    const [listRes, sectionsRes] = await Promise.all([
      articleService.list({ page: 1, perPage: 12, sort: 'latest' }),
      articleService.sections(),
    ])
    return {
      articles: listRes.data?.articles || [],
      pagination: listRes.data?.pagination || null,
      featured: sectionsRes.data?.featured || [],
      categories: sectionsRes.data?.categories || [],
      popularTags: sectionsRes.data?.popular_tags || [],
      bookmarked: sectionsRes.data?.bookmarked_articles || [],
    }
  } catch {
    return null
  }
})

provide('ssrArticlesBootstrap', ssrArticlesBootstrap)
</script>

<template>
  <ArticlesList />
</template>
