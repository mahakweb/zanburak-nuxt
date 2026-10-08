import { useHead } from '@vueuse/head'

const SITE_NAME = 'زنبورک'
const SITE_URL = process.env.VUE_APP_SITE_URL || 'https://zanburak.ir'
const DEFAULT_DESCRIPTION = 'آموزش برنامه‌نویسی و توسعه وب با دوره‌های تخصصی و حرفه‌ای'
const DEFAULT_IMAGE = `${SITE_URL}/assets/image/logo/logo.png`

function inferImageMimeType(imageUrl) {
    if (!imageUrl || typeof imageUrl !== 'string') return 'image/png'
    const lower = imageUrl.split('?')[0].toLowerCase()
    if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
    if (lower.endsWith('.webp')) return 'image/webp'
    if (lower.endsWith('.png')) return 'image/png'
    return 'image/png'
}

/**
 * Composable for managing SEO meta tags
 */
/**
 * Build a CTR-friendly document title.
 * When titleAlreadyFormatted=true, title is used as-is (still capped).
 */
export function formatSeoTitle(title, { siteName = SITE_NAME, maxLength = 60 } = {}) {
    const raw = String(title || '').trim()
    if (!raw) return siteName
    const withBrand = raw.includes(siteName) ? raw : `${raw} | ${siteName}`
    if (withBrand.length <= maxLength) return withBrand
    const withoutBrand = raw.length <= maxLength ? raw : `${raw.slice(0, maxLength - 1)}…`
    return withoutBrand
}

/**
 * Truncate meta description for SERP (~150–160 chars).
 */
export function formatSeoDescription(description, maxLength = 160) {
    const raw = String(description || DEFAULT_DESCRIPTION).replace(/\s+/g, ' ').trim()
    if (raw.length <= maxLength) return raw
    return `${raw.slice(0, maxLength - 1)}…`
}

export function useSEO(options = {}) {
    const {
        title = '',
        description = DEFAULT_DESCRIPTION,
        image = DEFAULT_IMAGE,
        images = [], // optional array of images with optional {url,width,height,alt}
        url = '',
        /** Override canonical independently from og:url when needed */
        canonical = '',
        type = 'website',
        keywords = [],
        author = 'زنبورک',
        publishedTime = '',
        modifiedTime = '',
        schema = null, // JSON-LD structured data
        noindex = false,
        nofollow = false,
        /** If true, do not append "| زنبورک" (title already complete) */
        titleAlreadyFormatted = false,
        // Advanced options
        articleAuthor = '',
        articleSection = '',
        articleTags = [],
        videoDuration = '',
        videoReleaseDate = '',
        videoUrl = '',
        videoType = '',
        videoWidth = '',
        videoHeight = '',
        // Audio (optional)
        audioUrl = '',
        audioSecureUrl = '',
        audioType = '',
        imageWidth = '',
        imageHeight = '',
        imageAlt = '',
        rating = '',
        reviewCount = '',
        alternateLanguages = [],
        mobileWebApp = true,
        // Social overrides
        twitterSite = '@zanburak',
        twitterCreator = '@zanburak',
        twitterSiteId = '',
        twitterCreatorId = '',
        twitterLabel1 = '',
        twitterData1 = '',
        twitterLabel2 = '',
        twitterData2 = '',
        twitterPlayer = '',
        twitterPlayerWidth = '',
        twitterPlayerHeight = '',
        facebookAppId = '',
        facebookPages = '',
        // Product fields (optional)
        productPriceAmount = '',
        productPriceCurrency = '',
        productAvailability = '',
        // Site verifications (optional)
        googleSiteVerification = '',
        bingSiteVerification = '',
        yandexSiteVerification = 'ff32717d2d944b04',
        ahrefsSiteVerification = '9ea3ced3b1a254f7a3b1fb2632e5233fad192625d8fdfb53073bc6b20610269a',
        // Publisher/Relations
        articlePublisher = '',
        seeAlso = [], // array of URLs
        // Windows/Edge UI (non-SEO)
        msApplicationTileColor = '',
        msApplicationNavButtonColor = '',
        // Product brand (for product OG)
        productBrand = '',
    } = options

    // Construct full title / description (CTR-oriented, length-safe)
    const fullTitle = titleAlreadyFormatted
        ? formatSeoTitle(title || SITE_NAME, { siteName: SITE_NAME })
        : (title ? formatSeoTitle(title) : SITE_NAME)
    const safeDescription = formatSeoDescription(description)
    const fullUrl = url ? (url.startsWith('http') ? url : `${SITE_URL}${url}`) : SITE_URL
    const canonicalHref = canonical
        ? (canonical.startsWith('http') ? canonical : `${SITE_URL}${canonical}`)
        : fullUrl
    const absoluteImage = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : DEFAULT_IMAGE
    const imageMime = inferImageMimeType(absoluteImage)
    const twitterDomain = (() => {
        try {
            const u = new URL(fullUrl)
            return u.hostname.replace(/^www\./, '')
        } catch {
            try {
                const u = new URL(SITE_URL)
                return u.hostname.replace(/^www\./, '')
            } catch {
                return 'zanburak.ir'
            }
        }
    })()

    // Meta tags configuration
    const metaTags = [
        // Basic meta tags
        { name: 'description', content: safeDescription },
        { name: 'author', content: author },
        { name: 'keywords', content: keywords.join(', ') },
        { name: 'language', content: 'fa' },
        { name: 'geo.region', content: 'IR' },
        { name: 'geo.placename', content: 'Iran' },
        
        // Open Graph tags - Basic
        { property: 'og:title', content: fullTitle },
        { property: 'og:description', content: safeDescription },
        { property: 'og:image', content: absoluteImage },
        { property: 'og:image:secure_url', content: absoluteImage },
        { property: 'og:url', content: fullUrl },
        { property: 'og:type', content: type },
        { property: 'og:site_name', content: SITE_NAME },
        { property: 'og:locale', content: 'fa_IR' },
        { property: 'og:locale:alternate', content: 'en_US' },
        ...(modifiedTime ? [{ property: 'og:updated_time', content: modifiedTime }] : []),
        ...(facebookAppId ? [{ property: 'fb:app_id', content: facebookAppId }] : []),
        ...(facebookPages ? [{ property: 'fb:pages', content: facebookPages }] : []),
        ...(Array.isArray(seeAlso) ? seeAlso.filter(Boolean).map(u => ({ property: 'og:see_also', content: u })) : []),
        
        // Open Graph tags - Image details
        ...(imageWidth ? [{ property: 'og:image:width', content: imageWidth }] : []),
        ...(imageHeight ? [{ property: 'og:image:height', content: imageHeight }] : []),
        ...(imageAlt ? [{ property: 'og:image:alt', content: imageAlt }] : []),
        { property: 'og:image:type', content: imageMime },
        // Additional images (if provided)
        ...(
            Array.isArray(images) && images.length > 0
                ? images.flatMap(img => {
                    const imgUrl = img?.url ? (img.url.startsWith('http') ? img.url : `${SITE_URL}${img.url}`) : ''
                    if (!imgUrl) return []
                    const mime = inferImageMimeType(imgUrl)
                    return [
                        { property: 'og:image', content: imgUrl },
                        { property: 'og:image:secure_url', content: imgUrl },
                        ...(img.width ? [{ property: 'og:image:width', content: img.width }] : []),
                        ...(img.height ? [{ property: 'og:image:height', content: img.height }] : []),
                        ...(img.alt ? [{ property: 'og:image:alt', content: img.alt }] : []),
                        { property: 'og:image:type', content: mime },
                    ]
                })
                : []
        ),
        // Audio (optional)
        ...(audioUrl ? [{ property: 'og:audio', content: audioUrl }] : []),
        ...(audioSecureUrl ? [{ property: 'og:audio:secure_url', content: audioSecureUrl }] : []),
        ...(audioType ? [{ property: 'og:audio:type', content: audioType }] : []),
        
        // Twitter Card tags
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: fullTitle },
        { name: 'twitter:description', content: safeDescription },
        { name: 'twitter:image', content: absoluteImage },
        ...(imageAlt ? [{ name: 'twitter:image:alt', content: imageAlt }] : []),
        { name: 'twitter:url', content: fullUrl },
        { name: 'twitter:site', content: twitterSite },
        { name: 'twitter:creator', content: twitterCreator },
        { name: 'twitter:domain', content: twitterDomain },
        ...(twitterSiteId ? [{ name: 'twitter:site:id', content: twitterSiteId }] : []),
        ...(twitterCreatorId ? [{ name: 'twitter:creator:id', content: twitterCreatorId }] : []),
        ...(twitterLabel1 && twitterData1 ? [{ name: 'twitter:label1', content: twitterLabel1 }, { name: 'twitter:data1', content: twitterData1 }] : []),
        ...(twitterLabel2 && twitterData2 ? [{ name: 'twitter:label2', content: twitterLabel2 }, { name: 'twitter:data2', content: twitterData2 }] : []),
        ...(twitterPlayer ? [{ name: 'twitter:player', content: twitterPlayer }] : []),
        ...(twitterPlayerWidth ? [{ name: 'twitter:player:width', content: twitterPlayerWidth }] : []),
        ...(twitterPlayerHeight ? [{ name: 'twitter:player:height', content: twitterPlayerHeight }] : []),
        
        // Article tags
        ...(type === 'article' || type === 'video.episode' ? [
            ...(articleAuthor ? [{ property: 'article:author', content: articleAuthor }] : []),
            ...(articleSection ? [{ property: 'article:section', content: articleSection }] : []),
            ...(articleTags.map(tag => ({ property: 'article:tag', content: tag }))),
            ...(articlePublisher ? [{ property: 'article:publisher', content: articlePublisher }] : []),
        ] : []),
        ...(publishedTime ? [{ property: 'article:published_time', content: publishedTime }] : []),
        ...(modifiedTime ? [{ property: 'article:modified_time', content: modifiedTime }] : []),
        
        // Video tags
        ...(type === 'video.episode' || type === 'video' ? [
            ...(videoDuration ? [{ property: 'video:duration', content: videoDuration }] : []),
            ...(videoReleaseDate ? [{ property: 'video:release_date', content: videoReleaseDate }] : []),
            ...(articleTags.map(tag => ({ property: 'video:tag', content: tag }))),
            ...(videoUrl ? [{ property: 'og:video', content: videoUrl }, { property: 'og:video:secure_url', content: videoUrl }] : []),
            ...(videoType ? [{ property: 'og:video:type', content: videoType }] : []),
            ...(videoWidth ? [{ property: 'og:video:width', content: videoWidth }] : []),
            ...(videoHeight ? [{ property: 'og:video:height', content: videoHeight }] : []),
        ] : []),
        
        // Product tags (optional)
        ...((type === 'product') ? [
            ...(productPriceAmount ? [{ property: 'product:price:amount', content: productPriceAmount }] : []),
            ...(productPriceCurrency ? [{ property: 'product:price:currency', content: productPriceCurrency }] : []),
            ...(productAvailability ? [{ property: 'product:availability', content: productAvailability }] : []),
            ...(productBrand ? [{ property: 'product:brand', content: productBrand }] : [{ property: 'product:brand', content: SITE_NAME }]),
        ] : []),
        
        // Rating tags
        ...(rating ? [
            { name: 'rating', content: rating },
            { name: 'rating:value', content: rating },
            { name: 'rating:scale', content: '5' },
        ] : []),
        ...(reviewCount ? [{ name: 'review_count', content: reviewCount }] : []),
        
        // Mobile tags
        ...(mobileWebApp ? [
            { name: 'mobile-web-app-capable', content: 'yes' },
            { name: 'apple-mobile-web-app-capable', content: 'yes' },
            { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
            { name: 'apple-mobile-web-app-title', content: SITE_NAME },
        ] : []),
        
        // Additional meta tags
        { name: 'robots', content: `${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}, max-image-preview:large, max-snippet:-1, max-video-preview:-1` },
        { name: 'googlebot', content: `${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}, max-image-preview:large, max-snippet:-1, max-video-preview:-1` },
        { name: 'bingbot', content: `${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}` },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#fed700' },
        ...(googleSiteVerification ? [{ name: 'google-site-verification', content: googleSiteVerification }] : []),
        ...(bingSiteVerification ? [{ name: 'msvalidate.01', content: bingSiteVerification }] : []),
        ...(yandexSiteVerification ? [{ name: 'yandex-verification', content: yandexSiteVerification }] : []),
        ...(ahrefsSiteVerification ? [{ name: 'ahrefs-site-verification', content: ahrefsSiteVerification }] : []),
        ...(msApplicationTileColor ? [{ name: 'msapplication-TileColor', content: msApplicationTileColor }] : []),
        ...(msApplicationNavButtonColor ? [{ name: 'msapplication-navbutton-color', content: msApplicationNavButtonColor }] : []),
    ]

    // Add time-based meta tags if provided
    if (publishedTime) {
        metaTags.push(
            { property: 'article:published_time', content: publishedTime },
            { name: 'pubdate', content: publishedTime }
        )
    }
    if (modifiedTime) {
        metaTags.push({ property: 'article:modified_time', content: modifiedTime })
    }
    
    // Add alternate language links
    const linkTags = [
        { rel: 'canonical', href: canonicalHref },
        { rel: 'image_src', href: absoluteImage }
    ]
    
    if (alternateLanguages.length > 0) {
        alternateLanguages.forEach(lang => {
            linkTags.push({
                rel: 'alternate',
                hreflang: lang.code,
                href: lang.url
            })
        })
    }

    // Remove empty keywords
    const filteredMetaTags = metaTags.filter(tag => {
        if (tag.name === 'keywords' && !tag.content) return false
        return true
    })

    // Handle schema - can be single object or array
    const schemaArray = Array.isArray(schema) ? schema : (schema ? [schema] : [])
    const schemaScripts = schemaArray.map(s => ({
        type: 'application/ld+json',
        innerHTML: JSON.stringify(s)
    }))

    // Set up head
    useHead({
        title: fullTitle,
        meta: filteredMetaTags,
        link: linkTags,
        script: schemaScripts.length > 0 ? schemaScripts : []
    })

    // Let prerender-spa-plugin capture HTML after meta/content are applied
    signalPrerenderReady()

    return {
        updateSEO: (newOptions) => {
            useSEO({ ...options, ...newOptions })
        }
    }
}

/**
 * Fire when the current route has meaningful SEO/content for crawlers.
 * Must re-fire per pathname — PrerenderSPAPlugin navigates many routes in one browser.
 */
export function signalPrerenderReady() {
    if (typeof document === 'undefined') return
    const path = typeof location !== 'undefined' ? location.pathname : ''
    if (window.__ZANBURAK_PRERENDER_READY_PATH__ === path) return

    const fire = () => {
        if (window.__ZANBURAK_PRERENDER_READY_PATH__ === path) return
        window.__ZANBURAK_PRERENDER_READY_PATH__ = path
        document.dispatchEvent(new Event('prerender-ready'))
    }

    if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(() => setTimeout(fire, 80))
    } else {
        setTimeout(fire, 120)
    }
}

/**
 * Generate Course schema (JSON-LD)
 */
export function generateCourseSchema(course) {
    if (!course) return null

    const courseUrl = `${SITE_URL}/course/${course.slug}`
    const imageUrl = course.poster ? (course.poster.startsWith('http') ? course.poster : `${SITE_URL}${course.poster}`) : DEFAULT_IMAGE

    return {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: course.title,
        description: course.description || course.short_description,
        image: imageUrl,
        learningResourceType: 'Course',
        provider: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
            logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/assets/image/logo/logo.png`
            }
        },
        url: courseUrl,
        inLanguage: 'fa-IR',
        courseCode: course.slug,
        ...(course.category && course.category.length > 0 && {
            teaches: course.category.map(cat => cat.title).filter(Boolean)
        }),
        ...(course.teacher && {
            instructor: {
                '@type': 'Person',
                name: `${course.teacher.first_name} ${course.teacher.last_name}`,
                ...(course.teacher.profile_pic && {
                    image: course.teacher.profile_pic.startsWith('http') 
                        ? course.teacher.profile_pic 
                        : `${SITE_URL}${course.teacher.profile_pic}`
                })
            }
        }),
        ...(course.avgRating && {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: course.avgRating,
                bestRating: '5',
                worstRating: '1',
                ratingCount: course.reviews_count || 0
            }
        }),
        ...(course.price !== undefined && {
            offers: {
                '@type': 'Offer',
                price: course.price,
                priceCurrency: 'IRR',
                availability: course.price === 0 ? 'https://schema.org/InStock' : 'https://schema.org/InStock',
                url: courseUrl,
                validFrom: course.created_at || new Date().toISOString()
            }
        }),
        ...(course.category && course.category.length > 0 && {
            about: course.category.map(cat => ({
                '@type': 'Thing',
                name: cat.title
            }))
        }),
        datePublished: course.created_at || new Date().toISOString(),
        dateModified: course.updated_at || new Date().toISOString()
    }
}

/**
 * Generate Episode schema (JSON-LD)
 */
export function generateEpisodeSchema(episode, course) {
    if (!episode || !course) return null

    const episodeUrl = `${SITE_URL}/course/${course.slug}/episode/${episode.order}`
    const imageUrl = course.poster ? (course.poster.startsWith('http') ? course.poster : `${SITE_URL}${course.poster}`) : DEFAULT_IMAGE
    const duration = episode.time ? Math.floor(episode.time) : (episode.total_time ? Math.floor(episode.total_time) : 0)

    return {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: episode.title,
        description: episode.description || episode.title,
        thumbnailUrl: imageUrl,
        uploadDate: episode.created_at || new Date().toISOString(),
        ...(duration > 0 && { duration: `PT${duration}S` }),
        contentUrl: episodeUrl,
        embedUrl: episodeUrl,
        inLanguage: 'fa-IR',
        ...(course && {
            partOfSeries: {
                '@type': 'Course',
                name: course.title,
                url: `${SITE_URL}/course/${course.slug}`
            }
        }),
        ...(course.teacher && {
            publisher: {
                '@type': 'Organization',
                name: SITE_NAME,
                logo: {
                    '@type': 'ImageObject',
                    url: `${SITE_URL}/assets/image/logo/logo.png`
                }
            }
        }),
        datePublished: episode.created_at || new Date().toISOString(),
        dateModified: episode.updated_at || new Date().toISOString()
    }
}

/**
 * Generate Question schema (JSON-LD)
 */
export function generateQuestionSchema(question) {
    if (!question) return null

    const questionUrl = `${SITE_URL}/discuss/${question.slug}`
    const questionText = question.question || question.body || question.subject
    const strippedText = questionText ? questionText.replace(/<[^>]*>/g, '').substring(0, 500) : question.subject

    return {
        '@context': 'https://schema.org',
        '@type': 'Question',
        name: question.subject,
        text: strippedText,
        url: questionUrl,
        dateCreated: question.created_at || new Date().toISOString(),
        dateModified: question.updated_at || new Date().toISOString(),
        inLanguage: 'fa-IR',
        author: {
            '@type': 'Person',
            name: question.user ? `${question.user.first_name || ''} ${question.user.last_name || ''}`.trim() || 'کاربر' : 'کاربر'
        },
        ...(question.answers_count > 0 && {
            acceptedAnswer: {
                '@type': 'Answer',
                text: question.last_answer ? (typeof question.last_answer === 'string' ? question.last_answer.replace(/<[^>]*>/g, '').substring(0, 500) : '') : '',
                dateCreated: question.updated_at || new Date().toISOString(),
                author: {
                    '@type': 'Person',
                    name: question.last_answer?.user ? `${question.last_answer.user.first_name || ''} ${question.last_answer.user.last_name || ''}`.trim() : 'کاربر'
                }
            },
            answerCount: question.answers_count || 0
        }),
        ...(question.category && {
            about: {
                '@type': 'Thing',
                name: question.category
            }
        })
    }
}

/**
 * Generate Path schema (JSON-LD)
 */
export function generatePathSchema(path) {
    if (!path) return null

    const pathUrl = `${SITE_URL}/path/${path.slug}`
    const imageUrl = path.poster ? (path.poster.startsWith('http') ? path.poster : `${SITE_URL}${path.poster}`) : DEFAULT_IMAGE

    return {
        '@context': 'https://schema.org',
        '@type': 'LearningResource',
        name: path.title,
        description: path.description || path.short_description,
        image: imageUrl,
        url: pathUrl,
        inLanguage: 'fa-IR',
        provider: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
            logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/assets/image/logo/logo.png`
            }
        },
        ...(path.courses && path.courses.length > 0 && {
            teaches: path.courses.map(course => ({
                '@type': 'Course',
                name: course.title,
                url: `${SITE_URL}/course/${course.slug}`
            }))
        }),
        datePublished: path.created_at || new Date().toISOString(),
        dateModified: path.updated_at || new Date().toISOString()
    }
}

/**
 * Generate Breadcrumb schema (JSON-LD)
 */
export function generateBreadcrumbSchema(items) {
    if (!items || items.length === 0) return null

    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`
        }))
    }
}

/**
 * Generate Organization schema (JSON-LD)
 */
export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/assets/image/logo/logo.png`
        },
        description: DEFAULT_DESCRIPTION,
        inLanguage: 'fa-IR',
        sameAs: [
            'https://twitter.com/zanburak',
            'https://instagram.com/zanburak',
            'https://t.me/zanburak',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            availableLanguage: ['fa', 'en']
        }
    }
}

/**
 * Generate Article / BlogPosting schema (JSON-LD)
 */
export function generateArticleSchema(article) {
    if (!article) return null

    const slug = article.slug
    const articleUrl = `${SITE_URL}/article/${slug}`
    const imageUrl = article.og_image || article.cover_image
        ? (String(article.og_image || article.cover_image).startsWith('http')
            ? (article.og_image || article.cover_image)
            : `${SITE_URL}${article.og_image || article.cover_image}`)
        : DEFAULT_IMAGE
    const authorName = article.user
        ? `${article.user.first_name || ''} ${article.user.last_name || ''}`.trim() || article.user.username || SITE_NAME
        : (article.author_name || SITE_NAME)
    const bodyText = article.excerpt
        || (article.body ? String(article.body).replace(/<[^>]*>/g, '').substring(0, 500) : '')
        || article.title

    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.seo_title || article.title,
        description: article.seo_description || article.excerpt || bodyText,
        image: [imageUrl],
        url: articleUrl,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': articleUrl,
        },
        inLanguage: 'fa-IR',
        datePublished: article.published_at || article.created_at || new Date().toISOString(),
        dateModified: article.updated_at || article.published_at || new Date().toISOString(),
        author: {
            '@type': 'Person',
            name: authorName,
            ...(article.user?.username ? { url: `${SITE_URL}/@${article.user.username}` } : {}),
        },
        publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/assets/image/logo/logo.png`,
            },
        },
        ...(article.category?.title && {
            articleSection: article.category.title,
        }),
        ...(Array.isArray(article.tags) && article.tags.length > 0 && {
            keywords: article.tags.map((t) => t.name || t.title || t).filter(Boolean).join(', '),
        }),
    }
}

/**
 * Generate FAQPage schema from [{ question, answer }] (plain text or HTML stripped).
 */
export function generateFAQSchema(items) {
    if (!Array.isArray(items) || items.length === 0) return null

    const mainEntity = items
        .map((item) => {
            const q = String(item.question || item.title || '').trim()
            const aRaw = String(item.answer || item.body || '').trim()
            const a = aRaw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
            if (!q || !a) return null
            return {
                '@type': 'Question',
                name: q,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: a.substring(0, 5000),
                },
            }
        })
        .filter(Boolean)

    if (mainEntity.length === 0) return null

    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity,
    }
}

/**
 * Explicit VideoObject helper (alias-friendly wrapper around episode schema fields).
 */
export function generateVideoObjectSchema({
    name,
    description,
    thumbnailUrl,
    uploadDate,
    durationSeconds,
    contentUrl,
    embedUrl,
    course,
} = {}) {
    if (!name || !contentUrl) return null
    const duration = Number(durationSeconds) > 0 ? Math.floor(Number(durationSeconds)) : 0
    return {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name,
        description: description || name,
        thumbnailUrl: thumbnailUrl || DEFAULT_IMAGE,
        uploadDate: uploadDate || new Date().toISOString(),
        ...(duration > 0 && { duration: `PT${duration}S` }),
        contentUrl,
        embedUrl: embedUrl || contentUrl,
        inLanguage: 'fa-IR',
        publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            logo: {
                '@type': 'ImageObject',
                url: `${SITE_URL}/assets/image/logo/logo.png`,
            },
        },
        ...(course?.title && {
            partOfSeries: {
                '@type': 'Course',
                name: course.title,
                url: course.slug ? `${SITE_URL}/course/${course.slug}` : undefined,
            },
        }),
    }
}

export { SITE_NAME, SITE_URL, DEFAULT_DESCRIPTION, DEFAULT_IMAGE }

