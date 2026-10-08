<template>
  <picture
    v-if="resolvedSrc"
    class="seo-image-picture"
    :class="pictureClass"
  >
    <!-- Always keep <source> in DOM for png/jpg — browsers fall back to <img> if .webp 404s -->
    <source
      v-if="webpSrcResolved"
      type="image/webp"
      :srcset="webpSrcset || webpSrcResolved"
      :sizes="sizesAttr"
    />
    <img
      :src="resolvedSrc"
      :srcset="rasterSrcset || undefined"
      :sizes="(rasterSrcset || webpSrcResolved) ? sizesAttr : undefined"
      :alt="altText"
      :width="width || undefined"
      :height="height || undefined"
      :loading="loadingAttr"
      :decoding="decodingAttr"
      :fetchpriority="fetchPriorityAttr"
      :class="imgClass"
      :style="imgStyle"
      @error="onError"
      @load="$emit('load', $event)"
    />
  </picture>
</template>

<script>
import {
  toAbsoluteUrl,
  deriveWebpUrl,
  buildWidthSrcSet,
  defaultSizes,
} from '@/utils/seoImage'

export default {
  name: 'SeoImage',
  props: {
    src: { type: String, default: '' },
    /** Explicit WebP URL; if omitted, sibling .webp is derived when safe. */
    webpSrc: { type: String, default: '' },
    alt: { type: String, default: '' },
    width: { type: [Number, String], default: undefined },
    height: { type: [Number, String], default: undefined },
    /**
     * priority=true → eager + fetchpriority=high (LCP / above-the-fold only).
     * Default is lazy for below-fold images.
     */
    priority: { type: Boolean, default: false },
    lazy: { type: Boolean, default: true },
    sizes: { type: String, default: '' },
    sizesPreset: {
      type: String,
      default: 'card',
      validator: (v) => ['card', 'hero', 'avatar', 'icon', 'thumb'].includes(v),
    },
    srcset: { type: String, default: '' },
    webpSrcset: { type: String, default: '' },
    /** Auto-build width srcset for own-origin images */
    responsive: { type: Boolean, default: false },
    /**
     * When true (default), add <source type="image/webp"> for sibling .webp.
     * Browser natively falls back to <img> if the webp is missing.
     */
    autoWebp: { type: Boolean, default: true },
    imgClass: { type: String, default: 'w-full h-full object-cover' },
    pictureClass: { type: String, default: 'block w-full h-full' },
    decoding: { type: String, default: 'async' },
    /** Hide image only after the raster <img> fails */
    hideOnError: { type: Boolean, default: true },
  },
  emits: ['error', 'load'],
  data() {
    return {
      broken: false,
    }
  },
  watch: {
    src() {
      this.broken = false
    },
    webpSrc() {
      this.broken = false
    },
  },
  computed: {
    resolvedSrc() {
      if (this.broken || !this.src) return ''
      return this.src
    },
    webpSrcResolved() {
      if (this.broken) return ''
      if (this.webpSrc) return this.webpSrc
      if (!this.autoWebp) return ''
      return deriveWebpUrl(this.src)
    },
    rasterSrcset() {
      if (this.srcset) return this.srcset
      if (this.responsive) return buildWidthSrcSet(this.src)
      return ''
    },
    sizesAttr() {
      return this.sizes || defaultSizes(this.sizesPreset)
    },
    altText() {
      return this.alt || ''
    },
    loadingAttr() {
      if (this.priority) return 'eager'
      return this.lazy ? 'lazy' : 'eager'
    },
    fetchPriorityAttr() {
      if (this.priority) return 'high'
      return this.lazy ? 'low' : undefined
    },
    decodingAttr() {
      return this.decoding || 'async'
    },
    imgStyle() {
      const style = {}
      if (this.width && this.height) {
        style.aspectRatio = `${this.width} / ${this.height}`
      }
      return style
    },
  },
  methods: {
    onError(e) {
      // <picture> already falls back from failed webp <source> to <img>.
      // This handler is only for when the raster itself fails.
      if (this.hideOnError && e?.target) {
        e.target.style.display = 'none'
      }
      this.broken = true
      this.$emit('error', e)
    },
    absolute() {
      return toAbsoluteUrl(this.src)
    },
  },
}
</script>

<style scoped>
.seo-image-picture {
  overflow: hidden;
}
.seo-image-picture > img {
  display: block;
  max-width: 100%;
}
</style>
