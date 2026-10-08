/**
 * Composable for using SEO API endpoints
 * This composable integrates with the backend SeoController
 */

import { useHead } from '@vueuse/head'

const API_BASE_URL = process.env.VUE_APP_API_URL || '/api'

/**
 * Load and apply SEO meta tags from API
 * @param {string} type - Type of content: 'course', 'episode', 'path', 'question'
 * @param {string} slug - Slug of the content
 * @param {string} courseSlug - Course slug (required for episode type)
 */
export async function useSeoMetaFromApi(type, slug, courseSlug = null) {
  try {
    const params = new URLSearchParams({
      type,
      slug,
      ...(courseSlug && { course_slug: courseSlug })
    })

    const response = await fetch(`${API_BASE_URL}/seo/meta-tags?${params}`)
    
    if (!response.ok) {
      console.warn('Failed to load SEO meta tags from API')
      return
    }

    const meta = await response.json()

    // Apply meta tags using useHead
    useHead({
      title: meta.title,
      meta: [
        { name: 'description', content: meta.description },
        ...(meta.keywords ? [{ name: 'keywords', content: meta.keywords }] : []),
        { property: 'og:title', content: meta['og:title'] },
        { property: 'og:description', content: meta['og:description'] },
        { property: 'og:image', content: meta['og:image'] },
        { property: 'og:url', content: meta['og:url'] },
        { property: 'og:type', content: meta['og:type'] },
        { name: 'twitter:card', content: meta['twitter:card'] },
        { name: 'twitter:title', content: meta['twitter:title'] },
        { name: 'twitter:description', content: meta['twitter:description'] },
        ...(meta['twitter:image'] ? [{ name: 'twitter:image', content: meta['twitter:image'] }] : []),
        ...(meta['article:published_time'] ? [{ property: 'article:published_time', content: meta['article:published_time'] }] : []),
        ...(meta['article:modified_time'] ? [{ property: 'article:modified_time', content: meta['article:modified_time'] }] : []),
        ...(meta['video:duration'] ? [{ name: 'video:duration', content: meta['video:duration'] }] : []),
        ...(meta['video:release_date'] ? [{ name: 'video:release_date', content: meta['video:release_date'] }] : []),
      ],
      link: [
        { rel: 'canonical', href: meta.canonical }
      ]
    })
  } catch (error) {
    console.error('Error loading SEO meta tags:', error)
  }
}

/**
 * Load and inject JSON-LD Schema from API
 * @param {string} type - Type of content: 'course', 'episode', 'path', 'question'
 * @param {string} slug - Slug of the content
 * @param {string} courseSlug - Course slug (required for episode type)
 */
export async function useSeoSchemaFromApi(type, slug, courseSlug = null) {
  try {
    let url = ''
    
    switch (type) {
      case 'course':
        url = `${API_BASE_URL}/seo/course/${slug}/schema.json`
        break
      case 'episode':
        if (!courseSlug) {
          console.error('courseSlug is required for episode type')
          return
        }
        url = `${API_BASE_URL}/seo/course/${courseSlug}/episode/${slug}/schema.json`
        break
      case 'path':
        url = `${API_BASE_URL}/seo/path/${slug}/schema.json`
        break
      case 'question':
        url = `${API_BASE_URL}/seo/question/${slug}/schema.json`
        break
      default:
        console.error('Invalid type:', type)
        return
    }

    const response = await fetch(url)
    
    if (!response.ok) {
      console.warn('Failed to load SEO schema from API')
      return
    }

    const schema = await response.json()

    // Remove existing schema script if exists
    const existingScript = document.querySelector(`script[data-seo-schema="${type}-${slug}"]`)
    if (existingScript) {
      existingScript.remove()
    }

    // Inject schema script
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-seo-schema', `${type}-${slug}`)
    script.textContent = JSON.stringify(schema)
    document.head.appendChild(script)
  } catch (error) {
    console.error('Error loading SEO schema:', error)
  }
}

/**
 * Complete SEO setup using API (both meta tags and schema)
 * @param {string} type - Type of content
 * @param {string} slug - Slug of the content
 * @param {string} courseSlug - Course slug (required for episode type)
 */
export async function useSeoFromApi(type, slug, courseSlug = null) {
  await Promise.all([
    useSeoMetaFromApi(type, slug, courseSlug),
    useSeoSchemaFromApi(type, slug, courseSlug)
  ])
}

/**
 * Get SEO health check status
 * @returns {Promise<Object>} Health check results
 */
export async function getSeoHealthCheck() {
  try {
    const response = await fetch(`${API_BASE_URL}/seo/health-check`)
    
    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Error loading SEO health check:', error)
    return null
  }
}

