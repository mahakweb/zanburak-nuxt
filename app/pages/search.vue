<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axiosInstance from '@/store/axiosInstance'
import { episodeShowRoute } from '@/utils/episodeRoute'
import { sanitizeHtml } from '@/utils/sanitizeHtml'
import { useSEO } from '@/composables/useSEO'

definePageMeta({
  name: 'search',
})

const route = useRoute()
const router = useRouter()

const searchQuery = ref(String(route.query.q || '').trim())
const activeType = ref(String(route.query.type || 'all'))
const activeSort = ref(String(route.query.sort || 'relevance'))
const currentPage = ref(Number(route.query.page || 1))
const loading = ref(false)
const searchResult = ref([])
const searchFacets = ref({ types: { course: 0, episode: 0, question: 0, article: 0 } })
const metaInfo = ref(null)

const typeFilters = [
  { value: 'all', label: 'همه دسته‌ها', icon: 'M4 6h16M4 12h16M4 18h7' },
  { value: 'course', label: 'دوره‌ها', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { value: 'episode', label: 'قسمت‌های ویدیو', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
  { value: 'question', label: 'پرسش و پاسخ', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { value: 'article', label: 'مقالات', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
]

const totalCount = computed(() => {
  if (activeType.value !== 'all' && searchFacets.value?.types?.[activeType.value] !== undefined) {
    return searchFacets.value.types[activeType.value]
  }
  return metaInfo.value?.total || (
    (searchFacets.value?.types?.course || 0) +
    (searchFacets.value?.types?.episode || 0) +
    (searchFacets.value?.types?.question || 0) +
    (searchFacets.value?.types?.article || 0)
  )
})

// SEO Integration
useSEO({
  title: computed(() => searchQuery.value ? `نتایج جستجو برای: ${searchQuery.value}` : 'جستجو در زنبورک'),
  description: computed(() => searchQuery.value ? `مشاهده دوره‌ها، ویدیوها و مقالات مرتبط با ${searchQuery.value} در پلتفرم آموزشی زنبورک` : 'جستجوی پیشرفته در دوره‌های آموزشی، مقالات و پرسش و پاسخ‌ها'),
  noindex: computed(() => !searchQuery.value || searchQuery.value.length < 2),
})

async function fetchSearch(page = 1) {
  if (!searchQuery.value || searchQuery.value.trim().length < 2) {
    searchResult.value = []
    metaInfo.value = null
    return
  }
  loading.value = true
  try {
    const payload = {
      key: searchQuery.value.trim(),
      types: activeType.value !== 'all' ? [activeType.value] : undefined,
      sort: activeSort.value,
      page,
      limit: 15,
    }
    const res = await axiosInstance.post('/search', payload)
    searchResult.value = res.data?.result || []
    searchFacets.value = res.data?.facets || { types: { course: 0, episode: 0, question: 0, article: 0 } }
    metaInfo.value = res.data?.meta || null
    currentPage.value = page
  } catch (err) {
    console.error('Search request failed:', err)
    searchResult.value = []
  } finally {
    loading.value = false
  }
}

// Initial SSR fetch via useAsyncData
const { data: initialData } = await useAsyncData(
  `search-${route.fullPath}`,
  async () => {
    const q = String(route.query.q || '').trim()
    if (!q || q.length < 2) return null
    try {
      const payload = {
        key: q,
        types: (route.query.type && route.query.type !== 'all') ? [String(route.query.type)] : undefined,
        sort: String(route.query.sort || 'relevance'),
        page: Number(route.query.page || 1),
        limit: 15,
      }
      const res = await axiosInstance.post('/search', payload)
      return res.data
    } catch {
      return null
    }
  },
  { watch: [() => route.fullPath] }
)

if (initialData.value) {
  searchResult.value = initialData.value.result || []
  searchFacets.value = initialData.value.facets || { types: { course: 0, episode: 0, question: 0, article: 0 } }
  metaInfo.value = initialData.value.meta || null
}

function handleInputSubmit() {
  if (!searchQuery.value.trim()) return
  router.push({
    path: '/search',
    query: {
      q: searchQuery.value.trim(),
      type: activeType.value,
      sort: activeSort.value,
      page: 1,
    },
  })
}

function setType(type) {
  activeType.value = type
  router.push({
    path: '/search',
    query: {
      ...route.query,
      type,
      page: 1,
    },
  })
}

function setSort(sort) {
  activeSort.value = sort
  router.push({
    path: '/search',
    query: {
      ...route.query,
      sort,
      page: 1,
    },
  })
}

function changePage(page) {
  router.push({
    path: '/search',
    query: {
      ...route.query,
      page,
    },
  })
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

let isFirstMount = true
onMounted(() => {
  if (!initialData.value && searchQuery.value) {
    fetchSearch(currentPage.value)
  }
  isFirstMount = false
})

watch(
  () => route.query,
  (newQuery) => {
    searchQuery.value = String(newQuery.q || '').trim()
    activeType.value = String(newQuery.type || 'all')
    activeSort.value = String(newQuery.sort || 'relevance')
    currentPage.value = Number(newQuery.page || 1)
    if (!isFirstMount) {
      fetchSearch(currentPage.value)
    }
  }
)

function highlightText(item, field) {
  const highlights = item.highlights || {}
  if (highlights[field]) {
    return sanitizeHtml(highlights[field])
  }
  return sanitizeHtml(item[field] || '')
}
</script>

<template>
  <main class="min-h-screen py-6 md:py-10 bg-gray-50/50 dark:bg-gray-950">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Search Header & Hero Input -->
      <header class="text-center max-w-3xl mx-auto mb-8 md:mb-12">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-400/10 dark:bg-yellow-400/15 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-xs font-semibold mb-4">
          <svg class="w-4 h-4 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>جستجوی هوشمند در زنبورک</span>
        </div>
        
        <h1 class="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          <template v-if="searchQuery">
            نتایج برای: <span class="text-yellow-500 dark:text-yellow-400">«{{ searchQuery }}»</span>
          </template>
          <template v-else>
            هر آنچه می‌خواهید یاد بگیرید را جستجو کنید
          </template>
        </h1>
        <p class="text-sm md:text-base text-gray-600 dark:text-gray-400">
          جستجو میان دوره‌های جامع، ویدیوهای آموزشی، مقالات تخصصی و تالار گفتگو
        </p>

        <!-- Search Bar with AI Gradient Glow -->
        <form @submit.prevent="handleInputSubmit" class="mt-6 relative">
          <div class="relative group">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-rose-500 rounded-2xl blur-md opacity-30 group-hover:opacity-60 group-focus-within:opacity-80 transition duration-500"></div>
            <div class="relative flex items-center bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200/80 dark:border-gray-800 p-2">
              <div class="flex items-center ps-3 pointer-events-none text-gray-400 dark:text-gray-500">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                class="w-full bg-transparent border-0 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm md:text-base px-3 py-2 focus:ring-0 focus:outline-none font-medium"
                placeholder="نام دوره، موضوع یا تکنولوژی مورد نظر..."
              />
              <button
                type="submit"
                class="shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-sm shadow-md transition-all active:scale-95"
              >
                <span>جستجو</span>
                <svg class="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </form>
      </header>

      <!-- Filter Tabs & Sort Section -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
        <!-- Category Filter Tabs -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            v-for="filter in typeFilters"
            :key="filter.value"
            @click="setType(filter.value)"
            class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-semibold transition-all whitespace-nowrap"
            :class="activeType === filter.value 
              ? 'bg-yellow-400 text-gray-950 shadow-sm font-bold' 
              : 'bg-white dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700/60'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="filter.icon" />
            </svg>
            <span>{{ filter.label }}</span>
            <span
              v-if="filter.value !== 'all' && searchFacets.types?.[filter.value] !== undefined"
              class="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
              :class="activeType === filter.value ? 'bg-black/15 text-gray-900' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'"
            >
              {{ searchFacets.types[filter.value] }}
            </span>
          </button>
        </div>

        <!-- Sort & Count -->
        <div class="flex items-center justify-between md:justify-end gap-3 text-xs md:text-sm">
          <span v-if="totalCount !== undefined" class="text-gray-500 dark:text-gray-400">
            <strong class="text-gray-900 dark:text-white font-bold">{{ totalCount }}</strong> نتیجه پیدا شد
          </span>

          <div class="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-2.5 py-1 shadow-sm">
            <span class="text-gray-400 text-xs">مرتب‌سازی:</span>
            <select
              :value="activeSort"
              @change="setSort($event.target.value)"
              class="bg-transparent border-0 text-xs font-semibold text-gray-800 dark:text-gray-200 focus:ring-0 p-1 cursor-pointer outline-none"
            >
              <option value="relevance" class="dark:bg-gray-800">مرتبط‌ترین</option>
              <option value="newest" class="dark:bg-gray-800">جدیدترین</option>
              <option value="popular" class="dark:bg-gray-800">محبوب‌ترین</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Results Grid / List -->
      <div v-if="loading" class="py-16 text-center">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-yellow-400 border-t-transparent"></div>
        <p class="mt-3 text-sm text-gray-500 dark:text-gray-400 font-medium">در حال جستجو و دریافت نتایج...</p>
      </div>

      <div v-else-if="searchResult && searchResult.length > 0" class="space-y-3">
        <article
          v-for="item in searchResult"
          :key="item.type + '-' + item.id"
          class="group relative bg-white dark:bg-gray-900/90 rounded-2xl p-4 md:p-5 border border-gray-200 dark:border-gray-800 hover:border-yellow-400/50 dark:hover:border-yellow-400/50 hover:shadow-lg transition-all duration-200"
        >
          <!-- Course Card -->
          <NuxtLink
            v-if="item.type === 'course'"
            :to="`/course/${item.slug}`"
            class="flex items-start justify-between gap-4"
          >
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  دوره آموزشی
                </span>
                <span v-if="item.number_of_episodes" class="text-xs text-gray-500 dark:text-gray-400">
                  {{ item.number_of_episodes }} جلسه آموزشی
                </span>
              </div>
              <h2 class="text-base md:text-lg font-bold text-gray-900 dark:text-white group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition" v-html="highlightText(item, 'title')"></h2>
              <p v-if="item.description" class="mt-1 text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-2" v-html="highlightText(item, 'description')"></p>
            </div>
            <div class="shrink-0 p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:text-yellow-500 group-hover:bg-yellow-50 dark:group-hover:bg-yellow-950/30 transition">
              <svg class="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </NuxtLink>

          <!-- Episode Card -->
          <NuxtLink
            v-else-if="item.type === 'episode'"
            :to="episodeShowRoute(item.course?.slug, item.order)"
            class="flex items-start justify-between gap-4"
          >
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ویدیو / جلسه
                </span>
                <span v-if="item.course?.title" class="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                  دوره: <strong class="text-gray-700 dark:text-gray-300 font-semibold">{{ item.course.title }}</strong>
                </span>
              </div>
              <h2 class="text-base md:text-lg font-bold text-gray-900 dark:text-white group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition" v-html="highlightText(item, 'title')"></h2>
            </div>
            <div class="shrink-0 p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:text-yellow-500 group-hover:bg-yellow-50 dark:group-hover:bg-yellow-950/30 transition">
              <svg class="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </NuxtLink>

          <!-- Question Card -->
          <NuxtLink
            v-else-if="item.type === 'question'"
            :to="`/discuss/${item.slug}`"
            class="flex items-start justify-between gap-4"
          >
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  پرسش و پاسخ
                </span>
                <span v-if="item.number_of_answers !== undefined" class="text-xs text-gray-500 dark:text-gray-400">
                  {{ item.number_of_answers }} پاسخ
                </span>
              </div>
              <h2 class="text-base md:text-lg font-bold text-gray-900 dark:text-white group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition" v-html="highlightText(item, 'subject')"></h2>
            </div>
            <div class="shrink-0 p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:text-yellow-500 group-hover:bg-yellow-50 dark:group-hover:bg-yellow-950/30 transition">
              <svg class="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </NuxtLink>

          <!-- Article Card -->
          <NuxtLink
            v-else-if="item.type === 'article'"
            :to="`/article/${item.slug}`"
            class="flex items-start justify-between gap-4"
          >
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  مقاله
                </span>
              </div>
              <h2 class="text-base md:text-lg font-bold text-gray-900 dark:text-white group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition" v-html="highlightText(item, 'title')"></h2>
              <p v-if="item.excerpt" class="mt-1 text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-2" v-html="highlightText(item, 'excerpt')"></p>
            </div>
            <div class="shrink-0 p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:text-yellow-500 group-hover:bg-yellow-50 dark:group-hover:bg-yellow-950/30 transition">
              <svg class="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </NuxtLink>
        </article>

        <!-- Pagination -->
        <div v-if="metaInfo && metaInfo.total_pages > 1" class="pt-8 flex justify-center items-center gap-2">
          <button
            v-if="currentPage > 1"
            @click="changePage(currentPage - 1)"
            class="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition"
          >
            صفحه قبل
          </button>
          <span class="text-xs text-gray-500 dark:text-gray-400 px-2 font-medium">
            صفحه {{ currentPage }} از {{ metaInfo.total_pages }}
          </span>
          <button
            v-if="metaInfo.has_more"
            @click="changePage(currentPage + 1)"
            class="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition"
          >
            صفحه بعد
          </button>
        </div>
      </div>

      <!-- No Results Empty State -->
      <div v-else class="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-yellow-400/10 dark:bg-yellow-400/20 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">نتیجه‌ای یافت نشد</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
          متأسفانه نتیجه‌ای متناسب با عبارت جستجوی شما پیدا نشد. املای کلمات را بررسی کنید یا عبارت دیگری را جستجو فرمایید.
        </p>
        <div class="flex flex-wrap justify-center gap-2">
          <NuxtLink to="/courses" class="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-bold hover:bg-yellow-400 hover:text-gray-900 transition">
            مشاهده همه دوره‌ها
          </NuxtLink>
          <NuxtLink to="/paths" class="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-bold hover:bg-yellow-400 hover:text-gray-900 transition">
            مسیرهای آموزشی
          </NuxtLink>
        </div>
      </div>
    </div>
  </main>
</template>
