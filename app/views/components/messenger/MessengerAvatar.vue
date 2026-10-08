<template>
  <div
    v-if="saved"
    :class="['relative flex-shrink-0 rounded-full flex items-center justify-center bg-gradient-to-br from-[#3390ec] to-[#5eb3f6] text-white', sizeClass]"
  >
    <svg :class="iconClass" fill="currentColor" viewBox="0 0 24 24"><path d="M6 3a2 2 0 00-2 2v15.382a.5.5 0 00.724.447L12 17.5l7.276 3.329A.5.5 0 0020 20.382V5a2 2 0 00-2-2H6z"/></svg>
  </div>
  <div
    v-else
    :class="['relative flex-shrink-0', sizeClass]"
  >
    <!-- Image/initials clipped to circle; online badge stays outside so it isn't covered/cropped -->
    <div
      class="absolute inset-0 rounded-full overflow-hidden flex items-center justify-center"
      :style="!imgOk ? { background: letterBg } : undefined"
    >
      <img
        v-if="pic && !imgFailed"
        :src="pic"
        class="absolute inset-0 w-full h-full object-cover"
        draggable="false"
        :loading="lazy ? 'lazy' : undefined"
        decoding="async"
        @load="imgOk = true"
        @error="onImgError"
      />
      <span
        v-if="!imgOk"
        :class="['font-bold select-none leading-none', textClass]"
        :style="{ color: letterFg }"
      >{{ initials }}</span>
    </div>
    <span
      v-if="online"
      class="online-dot absolute z-10 pointer-events-none rounded-full bg-[#0ac630] border-2 border-white dark:border-[#17212b]"
      :class="{ 'online-dot--xl': size === 'xl', 'online-dot--lg': size === 'lg' }"
      aria-hidden="true"
    ></span>
  </div>
</template>

<script>
import { avatarInitials, firstLetter } from './avatarInitials';

/** Telegram-like palette — color keyed by first letter of first name. */
const LETTER_COLORS = [
  { bg: '#e17076', fg: '#fff' },
  { bg: '#faa774', fg: '#fff' },
  { bg: '#e5ca77', fg: '#3d3208' },
  { bg: '#7bc862', fg: '#fff' },
  { bg: '#6ec9cb', fg: '#fff' },
  { bg: '#65aadd', fg: '#fff' },
  { bg: '#ee7aae', fg: '#fff' },
  { bg: '#a695e7', fg: '#fff' },
  { bg: '#5c6bc0', fg: '#fff' },
  { bg: '#26a69a', fg: '#fff' },
  { bg: '#ef5350', fg: '#fff' },
  { bg: '#ab47bc', fg: '#fff' },
  { bg: '#42a5f5', fg: '#fff' },
  { bg: '#66bb6a', fg: '#fff' },
  { bg: '#ffa726', fg: '#3d2800' },
  { bg: '#8d6e63', fg: '#fff' },
];

function colorForLetter(ch) {
  if (!ch) return LETTER_COLORS[0];
  const cp = ch.toUpperCase().codePointAt(0) || 0;
  return LETTER_COLORS[Math.abs(cp) % LETTER_COLORS.length];
}

export default {
  props: {
    user: { type: Object, default: null },
    name: { type: String, default: '' },
    src: { type: String, default: '' },
    size: { type: String, default: 'md' }, // xs | sm | md | lg | xl
    online: { type: Boolean, default: false },
    saved: { type: Boolean, default: false },
    /** Prefer lazy-loading for offscreen / carousel avatars. */
    lazy: { type: Boolean, default: false },
  },
  data() {
    return { imgFailed: false, imgOk: false };
  },
  computed: {
    pic() {
      return this.src || this.user?.profile_pic || this.user?.avatar || '';
    },
    firstName() {
      const u = this.user || {};
      if (u.first_name) return String(u.first_name).trim();
      if (this.name) return String(this.name).trim().split(/\s+/)[0] || '';
      if (u.name) return String(u.name).trim().split(/\s+/)[0] || '';
      return '';
    },
    lastName() {
      const u = this.user || {};
      if (u.last_name) return String(u.last_name).trim();
      if (this.name) {
        const parts = String(this.name).trim().split(/\s+/).filter(Boolean);
        if (parts.length >= 2) return parts[parts.length - 1];
      }
      if (u.name) {
        const parts = String(u.name).trim().split(/\s+/).filter(Boolean);
        if (parts.length >= 2) return parts[parts.length - 1];
      }
      return '';
    },
    /** Initials: first + last letter with a space (e.g. م س). */
    initials() {
      return avatarInitials(this.user || { name: this.name }, this.name);
    },
    letterColor() {
      return colorForLetter(firstLetter(this.firstName) || firstLetter(this.initials));
    },
    letterBg() {
      return this.letterColor.bg;
    },
    letterFg() {
      return this.letterColor.fg;
    },
    sizeClass() {
      const map = {
        xs: 'w-8 h-8',
        sm: 'w-10 h-10',
        md: 'w-11 h-11',
        lg: 'w-12 h-12',
        xl: 'w-28 h-28',
      };
      return map[this.size] || map.md;
    },
    textClass() {
      const map = { xs: 'text-[10px]', sm: 'text-xs', md: 'text-sm', lg: 'text-sm', xl: 'text-2xl' };
      return map[this.size] || map.md;
    },
    iconClass() {
      const map = { xs: 'w-4 h-4', sm: 'w-5 h-5', md: 'w-5 h-5', lg: 'w-6 h-6', xl: 'w-12 h-12' };
      return map[this.size] || map.md;
    },
  },
  watch: {
    pic() {
      this.imgFailed = false;
      this.imgOk = false;
    },
  },
  methods: {
    onImgError() {
      this.imgFailed = true;
      this.imgOk = false;
    },
  },
};
</script>

<style scoped>
.online-dot {
  /* Telegram-style: sit on the avatar corner, not floating below */
  width: 26%;
  min-width: 10px;
  max-width: 14px;
  aspect-ratio: 1;
  bottom: 1px;
  inset-inline-end: 1px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04);
}

.online-dot--lg {
  width: 12px;
  min-width: 12px;
  max-width: 12px;
  bottom: 1px;
  inset-inline-end: 1px;
}

.online-dot--xl {
  width: 18px;
  min-width: 18px;
  max-width: 18px;
  bottom: 6px;
  inset-inline-end: 6px;
  border-width: 3px;
}
</style>
