<template>
  <div class="wp">
    <!-- Phone-style live preview -->
    <div class="wp-preview" :style="previewStyle">
      <div class="wp-preview-media">
        <div class="wp-preview-image" :style="previewImageStyle" />
      </div>
      <div class="wp-preview-dim" :style="previewDimStyle" />
      <div class="wp-preview-pattern" :style="previewPatternStyle" />
      <div class="wp-preview-glow" :class="{ 'is-neon': draft.type === 'neon' }" :style="previewGlowStyle" />

      <!-- Preview-only: fixed LTR chat frame (Telegram picker). Tails stay outward; text may be RTL. -->
      <div class="wp-preview-bubbles" dir="ltr">
        <div class="wp-bubble wp-bubble--in">
          <span dir="auto">{{ $t('messenger.wallpaperSample1') }}</span>
          <span class="wp-tail wp-tail--in" aria-hidden="true">
            <svg class="wp-tail-svg" fill="none" viewBox="0 0 20 20">
              <path
                d="M20 20 V6 C20 10 18 13 16 15 C14.5 16.5 13 17.5 12 18 C10.8 18.5 10 18.8 10 19.4 C10 20 11 20 13 20 Z"
                fill="currentColor"
              />
            </svg>
          </span>
        </div>
        <div class="wp-bubble wp-bubble--out">
          <span dir="auto">{{ $t('messenger.wallpaperSample2') }}</span>
          <span class="wp-tail wp-tail--out" aria-hidden="true">
            <svg class="wp-tail-svg" fill="none" viewBox="0 0 20 20">
              <path
                d="M20 20 V6 C20 10 18 13 16 15 C14.5 16.5 13 17.5 12 18 C10.8 18.5 10 18.8 10 19.4 C10 20 11 20 13 20 Z"
                fill="currentColor"
              />
            </svg>
          </span>
        </div>
        <div class="wp-bubble wp-bubble--in">
          <span dir="auto">{{ $t('messenger.wallpaperSample3') }}</span>
          <span class="wp-tail wp-tail--in" aria-hidden="true">
            <svg class="wp-tail-svg" fill="none" viewBox="0 0 20 20">
              <path
                d="M20 20 V6 C20 10 18 13 16 15 C14.5 16.5 13 17.5 12 18 C10.8 18.5 10 18.8 10 19.4 C10 20 11 20 13 20 Z"
                fill="currentColor"
              />
            </svg>
          </span>
        </div>
      </div>

      <div v-if="pendingFile" class="wp-preview-badge">{{ $t('messenger.wallpaperLocalPreview') }}</div>
    </div>

    <!-- Segmented mode control -->
    <div class="wp-seg" role="tablist">
      <button
        type="button"
        role="tab"
        :aria-selected="showPatternTab"
        :class="['wp-seg-btn', showPatternTab ? 'is-on' : '']"
        @click="openPatternTab"
      >{{ $t('messenger.bgTypePattern') }}</button>
      <button
        type="button"
        role="tab"
        :aria-selected="draft.type === 'neon'"
        :class="['wp-seg-btn', draft.type === 'neon' ? 'is-on' : '']"
        @click="setNeon"
      >{{ $t('messenger.bgTypeNeon') }}</button>
      <button
        type="button"
        role="tab"
        :aria-selected="showImageTab"
        :class="['wp-seg-btn', showImageTab ? 'is-on' : '']"
        @click="openImageTab"
      >{{ $t('messenger.bgTypeImage') }}</button>
      <button
        type="button"
        class="wp-seg-btn"
        :disabled="busy"
        @click="pickUpload"
      >
        <svg class="wp-seg-ico" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12 5v14M5 12h14" />
        </svg>
        {{ $t('messenger.wallpaperUpload') }}
      </button>
      <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFilePicked" />
    </div>

    <!-- PATTERN (SVG doodles + tiling textures) -->
    <template v-if="showPatternTab">
      <p class="wp-label">{{ $t('messenger.pattern') }}</p>
      <div class="wp-pattern-grid">
        <button
          v-for="p in patterns"
          :key="p.id"
          type="button"
          :class="['wp-swatch', draft.type === 'pattern' && draft.pattern === p.id ? 'is-on' : '']"
          :style="swatchStyle(p.id)"
          :title="p.id === 'none' ? $t('messenger.pattern_none') : $t('messenger.pattern') + ' ' + p.n"
          @click="set({ type: 'pattern', pattern: p.id })"
        >
          <span v-if="p.id === 'none'" class="wp-swatch-none">{{ $t('messenger.pattern_none') }}</span>
          <span v-else class="wp-swatch-fill" :style="swatchPatternStyle(p.id)" />
        </button>
      </div>

      <template v-if="patternTextures.length">
        <p class="wp-label">{{ $t('messenger.patternTextures') }}</p>
        <div class="wp-gallery wp-gallery--textures">
          <button
            v-for="img in patternTextures"
            :key="'tex-' + img.id"
            type="button"
            :class="['wp-tile', draft.type === 'image' && draft.image === img.id ? 'is-on' : '']"
            :style="{ backgroundImage: 'url(\'' + img.url + '\')', backgroundSize: (img.tile || 120) + 'px' }"
            :title="img.id"
            @click="selectPatternTexture(img)"
          />
        </div>
      </template>

      <template v-if="draft.type === 'pattern'">
        <p class="wp-label">{{ $t('messenger.color') }}</p>
        <div class="wp-colors">
          <button
            v-for="col in colors"
            :key="col"
            type="button"
            :class="['wp-color', draft.color === col ? 'is-on' : '']"
            :style="{ backgroundColor: col }"
            @click="set({ color: col })"
          />
          <label class="wp-color wp-color--custom" :title="$t('messenger.customColor')">
            <input type="color" :value="draft.color" @input="set({ color: $event.target.value })" />
            <span>+</span>
          </label>
        </div>

        <div class="wp-slider-head wp-light-head">
          <span>{{ $t('messenger.lightStyle') }}</span>
          <button
            v-if="currentLightRotate"
            type="button"
            class="wp-rotate"
            :title="$t('messenger.lightRotate')"
            @click="rotateLight"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 12a8 8 0 018-8 8.2 8.2 0 017.4 5M20 4v5h-5M20 12a8 8 0 01-8 8 8.2 8.2 0 01-7.4-5M4 20v-5h5" />
            </svg>
          </button>
        </div>
        <div class="wp-light-grid" role="listbox">
          <button
            v-for="ls in lightStyles"
            :key="ls.id"
            type="button"
            role="option"
            :aria-selected="draft.light === ls.id"
            :class="['wp-light', draft.light === ls.id ? 'is-on' : '']"
            :style="lightChipStyle(ls.id)"
            :title="$t('messenger.light_' + ls.id)"
            @click="set({ light: ls.id })"
          />
        </div>
        <p class="wp-hint">{{ $t('messenger.lightStyleHint') }}</p>

        <p class="wp-label">{{ $t('messenger.lightColor') }}</p>
        <div class="wp-colors">
          <button
            v-for="col in glowColors"
            :key="'glow-' + col"
            type="button"
            :class="['wp-color', draft.glow === col ? 'is-on' : '']"
            :style="{ backgroundColor: col }"
            @click="set({ glow: col })"
          />
          <label class="wp-color wp-color--custom" :title="$t('messenger.customColor')">
            <input type="color" :value="draft.glow" @input="set({ glow: $event.target.value })" />
            <span>+</span>
          </label>
        </div>

        <div class="wp-slider">
          <div class="wp-slider-head">
            <span>{{ $t('messenger.intensity') }}</span>
            <strong>{{ draft.intensity }}%</strong>
          </div>
          <input
            class="wp-range"
            type="range"
            min="0"
            max="100"
            step="1"
            :value="draft.intensity"
            :style="rangeFill(draft.intensity, 100)"
            @input="set({ intensity: Number($event.target.value) })"
          />
          <p class="wp-hint">{{ $t('messenger.patternIntensityHint') }}</p>
        </div>

        <div class="wp-slider">
          <div class="wp-slider-head">
            <span>{{ $t('messenger.patternScale') }}</span>
            <strong>{{ draft.scale }}%</strong>
          </div>
          <input
            class="wp-range"
            type="range"
            min="30"
            max="200"
            step="5"
            :value="draft.scale"
            :style="rangeFill(draft.scale - 30, 170)"
            @input="set({ scale: Number($event.target.value) })"
          />
          <p class="wp-hint">{{ $t('messenger.patternScaleHint') }}</p>
        </div>
      </template>

      <template v-else-if="isPatternTexture">
        <div class="wp-slider">
          <div class="wp-slider-head">
            <span>{{ $t('messenger.wallpaperDim') }}</span>
            <strong>{{ draft.dim }}%</strong>
          </div>
          <input
            class="wp-range"
            type="range"
            min="0"
            max="80"
            step="1"
            :value="draft.dim"
            :style="rangeFill(draft.dim, 80)"
            @input="set({ dim: Number($event.target.value) })"
          />
        </div>
      </template>
    </template>

    <!-- NEON / AURORA -->
    <template v-else-if="draft.type === 'neon'">
      <p class="wp-label">{{ $t('messenger.neonPresets') }}</p>
      <div class="wp-neon-grid">
        <button
          v-for="n in neonPresets"
          :key="n.id"
          type="button"
          :class="['wp-neon-swatch', isNeonPreset(n) ? 'is-on' : '']"
          :style="neonSwatchStyle(n)"
          :title="n.id"
          @click="applyNeonPreset(n)"
        />
      </div>

      <p class="wp-label">{{ $t('messenger.color') }}</p>
      <div class="wp-colors">
        <button
          v-for="col in colors"
          :key="'base-' + col"
          type="button"
          :class="['wp-color', draft.color === col ? 'is-on' : '']"
          :style="{ backgroundColor: col }"
          @click="set({ color: col })"
        />
        <label class="wp-color wp-color--custom" :title="$t('messenger.customColor')">
          <input type="color" :value="draft.color" @input="set({ color: $event.target.value })" />
          <span>+</span>
        </label>
      </div>

      <p class="wp-label">{{ $t('messenger.neonGlowColor') }}</p>
      <div class="wp-colors">
        <button
          v-for="n in neonPresets"
          :key="'glow-' + n.id"
          type="button"
          :class="['wp-color', draft.glow === n.glow ? 'is-on' : '']"
          :style="{ backgroundColor: n.glow }"
          @click="set({ glow: n.glow })"
        />
        <label class="wp-color wp-color--custom" :title="$t('messenger.customColor')">
          <input type="color" :value="draft.glow" @input="set({ glow: $event.target.value })" />
          <span>+</span>
        </label>
      </div>

      <div class="wp-slider">
        <div class="wp-slider-head">
          <span>{{ $t('messenger.neonIntensity') }}</span>
          <strong>{{ draft.intensity }}%</strong>
        </div>
        <input
          class="wp-range"
          type="range"
          min="0"
          max="100"
          step="1"
          :value="draft.intensity"
          :style="rangeFill(draft.intensity, 100)"
          @input="set({ intensity: Number($event.target.value) })"
        />
        <p class="wp-hint">{{ $t('messenger.neonIntensityHint') }}</p>
      </div>

      <div class="wp-slider">
        <div class="wp-slider-head">
          <span>{{ $t('messenger.neonScale') }}</span>
          <strong>{{ draft.scale }}%</strong>
        </div>
        <input
          class="wp-range"
          type="range"
          min="50"
          max="200"
          step="5"
          :value="draft.scale"
          :style="rangeFill(draft.scale - 50, 150)"
          @input="set({ scale: Number($event.target.value) })"
        />
        <p class="wp-hint">{{ $t('messenger.neonScaleHint') }}</p>
      </div>

      <div class="wp-slider">
        <div class="wp-slider-head">
          <span>{{ $t('messenger.neonBlur') }}</span>
          <strong>{{ draft.blur }}</strong>
        </div>
        <input
          class="wp-range"
          type="range"
          min="8"
          max="80"
          step="1"
          :value="draft.blur"
          :style="rangeFill(draft.blur - 8, 72)"
          @input="set({ blur: Number($event.target.value) })"
        />
        <p class="wp-hint">{{ $t('messenger.neonBlurHint') }}</p>
      </div>
    </template>

    <!-- IMAGE / CUSTOM (photos + uploads — not tiling pattern textures) -->
    <template v-else-if="showImageTab">
      <template v-if="myWallpapers.length">
        <p class="wp-label">{{ $t('messenger.myWallpapers') }}</p>
        <div class="wp-gallery">
          <div v-for="w in myWallpapers" :key="'mw-' + w.id" class="wp-tile-wrap">
            <button
              type="button"
              :class="['wp-tile', isSelectedCustom(w) ? 'is-on' : '']"
              :style="{ backgroundImage: 'url(\'' + (w.thumb_url || w.url) + '\')' }"
              @click="selectCustom(w)"
            />
            <button type="button" class="wp-tile-x" :title="$t('messenger.delete')" @click.stop="removeWallpaper(w)">
              <svg viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-width="2.2" stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      </template>

      <p class="wp-label">{{ $t('messenger.gallery') }}</p>
      <div class="wp-gallery">
        <button
          v-for="img in images"
          :key="img.id"
          type="button"
          :class="['wp-tile', draft.type === 'image' && draft.image === img.id ? 'is-on' : '']"
          :style="{ backgroundImage: 'url(\'' + img.url + '\')' }"
          :title="img.id"
          @click="selectBundled(img)"
        />
      </div>

      <div class="wp-slider">
        <div class="wp-slider-head">
          <span>{{ $t('messenger.wallpaperBlur') }}</span>
          <strong>{{ draft.blur }}</strong>
        </div>
        <input
          class="wp-range"
          type="range"
          min="0"
          max="40"
          step="1"
          :value="draft.blur"
          :style="rangeFill(draft.blur, 40)"
          @input="set({ blur: Number($event.target.value) })"
        />
      </div>
      <div class="wp-slider">
        <div class="wp-slider-head">
          <span>{{ $t('messenger.wallpaperDim') }}</span>
          <strong>{{ draft.dim }}%</strong>
        </div>
        <input
          class="wp-range"
          type="range"
          min="0"
          max="80"
          step="1"
          :value="draft.dim"
          :style="rangeFill(draft.dim, 80)"
          @input="set({ dim: Number($event.target.value) })"
        />
      </div>
    </template>

    <!-- Actions -->
    <div class="wp-actions">
      <button
        v-if="isChatMode"
        type="button"
        class="wp-btn wp-btn--primary"
        :disabled="busy"
        @click="applyToChat"
      >
        {{ busy ? $t('messenger.uploading') : $t('messenger.wallpaperSetForChat') }}
      </button>
      <button
        v-else
        type="button"
        class="wp-btn wp-btn--primary"
        :disabled="busy"
        @click="applyGlobal"
      >
        {{ busy ? $t('messenger.uploading') : $t('messenger.wallpaperApplyLocal') }}
      </button>
      <button
        type="button"
        class="wp-btn wp-btn--ghost"
        :disabled="busy"
        @click="reset"
      >
        {{ isChatMode ? $t('messenger.wallpaperUseDefault') : $t('messenger.resetDefault') }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from "@/composables/useStore";
import {
  PATTERNS,
  IMAGES,
  PATTERN_IMAGES,
  COLORS,
  GLOW_COLORS,
  LIGHT_STYLES,
  NEON_PRESETS,
  DEFAULT_WALLPAPER,
  normalizeWallpaper,
  neonWallpaperDefaults,
  isLocalWallpaperPreview,
  isTilingWallpaperImage,
  nextWallpaperRotation,
  resolvePatternUrl,
  preloadPatternUrl,
  buildWallpaperStyle,
  buildWallpaperImageStyle,
  buildWallpaperDimStyle,
  buildWallpaperPatternStyle,
  buildWallpaperGlowStyle,
  buildLightSwatchStyle,
} from './wallpaper';

export default {
  name: 'WallpaperPicker',
  props: {
    conversationId: { type: [Number, String], default: null },
    partnerName: { type: String, default: '' },
    initialConfig: { type: Object, default: null },
  },
  emits: ['request-apply-chat', 'draft-change', 'applied-global'],
  data() {
    return {
      patterns: PATTERNS,
      images: IMAGES,
      patternTextures: PATTERN_IMAGES,
      colors: COLORS,
      glowColors: GLOW_COLORS,
      lightStyles: LIGHT_STYLES,
      neonPresets: NEON_PRESETS,
      draft: normalizeWallpaper(null),
      pendingFile: null,
      pendingLocalUrl: null,
      busy: false,
      globalSyncTimer: null,
    };
  },
  computed: {
    ...mapState('messenger', ['wallpaper', 'myWallpapers']),
    isChatMode() {
      return this.conversationId != null && this.conversationId !== '' && this.conversationId !== 'draft';
    },
    isPatternTexture() {
      return this.draft.type === 'image' && isTilingWallpaperImage(this.draft.image);
    },
    showPatternTab() {
      return this.draft.type === 'pattern' || this.isPatternTexture;
    },
    showImageTab() {
      return (this.draft.type === 'image' && !this.isPatternTexture) || this.draft.type === 'custom';
    },
    previewStyle() {
      return buildWallpaperStyle(this.draft);
    },
    previewImageStyle() {
      return buildWallpaperImageStyle(this.draft);
    },
    previewDimStyle() {
      return buildWallpaperDimStyle(this.draft);
    },
    previewPatternStyle() {
      return buildWallpaperPatternStyle(this.draft);
    },
    previewGlowStyle() {
      return buildWallpaperGlowStyle(this.draft);
    },
    currentLightRotate() {
      return !!this.lightStyles.find((s) => s.id === this.draft.light)?.rotate;
    },
  },
  watch: {
    initialConfig: {
      immediate: true,
      handler(cfg) {
        this.seedDraft(cfg);
      },
    },
    draft: {
      deep: true,
      handler(val) {
        this.$emit('draft-change', normalizeWallpaper(val));
      },
    },
  },
  mounted() {
    this.$store.dispatch('messenger/fetchWallpapers').catch(() => {});
  },
  beforeUnmount() {
    this.clearPendingLocal();
    if (this.globalSyncTimer) clearTimeout(this.globalSyncTimer);
  },
  methods: {
    rangeFill(value, max) {
      const pct = Math.max(0, Math.min(100, (Number(value) / Number(max || 1)) * 100));
      return {
        background: `linear-gradient(to var(--wp-range-dir, right), #3390ec 0%, #3390ec ${pct}%, rgba(120,130,140,0.22) ${pct}%, rgba(120,130,140,0.22) 100%)`,
      };
    },
    seedDraft(cfg) {
      this.clearPendingLocal();
      this.draft = normalizeWallpaper(cfg || this.wallpaper);
    },
    set(patch) {
      if (patch.type === 'pattern' || patch.type === 'neon' || (patch.type === 'image' && patch.image)) {
        this.clearPendingLocal();
      }
      this.draft = normalizeWallpaper({ ...this.draft, ...patch });
      if (this.draft.type === 'pattern' && this.draft.pattern) {
        preloadPatternUrl(resolvePatternUrl(this.draft.pattern));
      }
      if (!this.isChatMode && !this.pendingFile) this.scheduleGlobalSync();
    },
    rotateLight() {
      this.set({ rotation: nextWallpaperRotation(this.draft.rotation) });
    },
    lightChipStyle(styleId) {
      return buildLightSwatchStyle(styleId, this.draft.color, this.draft.glow);
    },
    openPatternTab() {
      if (this.isPatternTexture) return;
      const patch = { type: 'pattern' };
      if (this.draft.type === 'neon') {
        patch.light = 'sun';
        patch.glow = DEFAULT_WALLPAPER.glow;
        patch.intensity = DEFAULT_WALLPAPER.intensity;
        patch.scale = DEFAULT_WALLPAPER.scale;
      }
      this.set(patch);
    },
    openImageTab() {
      if (this.draft.type === 'custom') {
        this.set({ type: 'custom' });
        return;
      }
      // Prefer a photo gallery image, not a tiling texture.
      const photoId = this.images[0]?.id || this.draft.image;
      this.set({ type: 'image', image: photoId, url: '', wallpaper_id: null });
    },
    setNeon() {
      this.clearPendingLocal();
      const keep = {
        color: this.draft.type === 'neon' ? this.draft.color : undefined,
        glow: this.draft.glow,
        intensity: this.draft.type === 'neon' ? this.draft.intensity : undefined,
        scale: this.draft.type === 'neon' ? this.draft.scale : undefined,
        blur: this.draft.type === 'neon' ? this.draft.blur : undefined,
      };
      this.draft = neonWallpaperDefaults(keep);
      if (!this.isChatMode) this.scheduleGlobalSync();
    },
    applyNeonPreset(n) {
      this.set({
        type: 'neon',
        color: n.color,
        glow: n.glow,
        intensity: this.draft.type === 'neon' ? this.draft.intensity : 58,
        scale: this.draft.type === 'neon' ? this.draft.scale : 110,
        blur: this.draft.type === 'neon' ? this.draft.blur : 48,
      });
    },
    isNeonPreset(n) {
      return this.draft.type === 'neon'
        && String(this.draft.color).toLowerCase() === String(n.color).toLowerCase()
        && String(this.draft.glow).toLowerCase() === String(n.glow).toLowerCase();
    },
    neonSwatchStyle(n) {
      const glow = buildWallpaperGlowStyle({
        type: 'neon',
        color: n.color,
        glow: n.glow,
        intensity: 70,
        scale: 120,
        blur: 28,
      });
      return {
        backgroundColor: n.color,
        backgroundImage: glow.backgroundImage,
        filter: 'none',
      };
    },
    scheduleGlobalSync() {
      if (this.globalSyncTimer) clearTimeout(this.globalSyncTimer);
      this.globalSyncTimer = setTimeout(() => {
        this.globalSyncTimer = null;
        this.$store.dispatch('messenger/setWallpaper', { ...this.draft });
      }, 120);
    },
    flushGlobalSync() {
      if (this.globalSyncTimer) {
        clearTimeout(this.globalSyncTimer);
        this.globalSyncTimer = null;
      }
      return this.$store.dispatch('messenger/setWallpaper', { ...this.draft });
    },
    clearPendingLocal() {
      if (this.pendingLocalUrl) {
        try { URL.revokeObjectURL(this.pendingLocalUrl); } catch (e) { /* noop */ }
      }
      this.pendingLocalUrl = null;
      this.pendingFile = null;
    },
    selectBundled(img) {
      this.clearPendingLocal();
      this.set({
        type: 'image',
        image: img.id,
        url: '',
        wallpaper_id: null,
        blur: this.draft.blur || 0,
        dim: this.draft.dim || 0,
      });
    },
    selectPatternTexture(img) {
      this.clearPendingLocal();
      this.set({
        type: 'image',
        image: img.id,
        url: '',
        wallpaper_id: null,
        blur: 0,
        dim: this.draft.dim || 0,
      });
    },
    selectCustom(w) {
      this.clearPendingLocal();
      this.set({
        type: 'custom',
        url: w.url,
        wallpaper_id: w.id,
        image: '',
        blur: this.draft.blur || 0,
        dim: this.draft.dim || 20,
      });
    },
    isSelectedCustom(w) {
      if (this.pendingFile) return false;
      return this.draft.type === 'custom'
        && (Number(this.draft.wallpaper_id) === Number(w.id) || this.draft.url === w.url);
    },
    pickUpload() {
      this.$refs.fileInput?.click();
    },
    onFilePicked(e) {
      const file = e?.target?.files?.[0];
      if (e?.target) e.target.value = '';
      if (!file) return;
      this.clearPendingLocal();
      const localUrl = URL.createObjectURL(file);
      this.pendingFile = file;
      this.pendingLocalUrl = localUrl;
      this.draft = normalizeWallpaper({
        ...this.draft,
        type: 'custom',
        url: localUrl,
        wallpaper_id: null,
        image: '',
        blur: this.draft.type === 'custom' ? (this.draft.blur || 0) : 0,
        dim: this.draft.type === 'custom' ? (this.draft.dim || 20) : 20,
      });
    },
    async ensureUploaded() {
      if (!this.pendingFile) return normalizeWallpaper(this.draft);
      this.busy = true;
      try {
        const w = await this.$store.dispatch('messenger/uploadWallpaper', this.pendingFile);
        const next = normalizeWallpaper({
          ...this.draft,
          type: 'custom',
          url: w.url,
          wallpaper_id: w.id,
          image: '',
        });
        this.clearPendingLocal();
        this.draft = next;
        return next;
      } finally {
        this.busy = false;
      }
    },
    async applyGlobal() {
      const cfg = await this.ensureUploaded();
      this.draft = normalizeWallpaper(cfg);
      await this.flushGlobalSync();
      await this.$store.dispatch('messenger/syncWallpaperSettings').catch(() => {});
      this.$emit('applied-global', cfg);
    },
    async applyGlobalPending() {
      return this.applyGlobal();
    },
    async applyToChat() {
      let cfg = normalizeWallpaper(this.draft);
      if (this.pendingFile || isLocalWallpaperPreview(cfg)) {
        cfg = await this.ensureUploaded();
      }
      this.$emit('request-apply-chat', {
        config: { ...cfg },
        partnerName: this.partnerName,
      });
    },
    async removeWallpaper(w) {
      try {
        await this.$store.dispatch('messenger/deleteWallpaper', w.id);
        if (Number(this.draft.wallpaper_id) === Number(w.id)) {
          this.set({ type: 'image', url: '', wallpaper_id: null });
        }
      } catch (err) { /* noop */ }
    },
    async reset() {
      this.clearPendingLocal();
      if (this.isChatMode) {
        // Parent decides forBoth (shared clear for community staff) + closes panel.
        this.draft = normalizeWallpaper(this.wallpaper);
        this.$emit('request-apply-chat', { config: null, partnerName: this.partnerName, cleared: true });
        return;
      }
      this.draft = { ...DEFAULT_WALLPAPER };
      this.$store.dispatch('messenger/setWallpaper', { ...DEFAULT_WALLPAPER });
    },
    swatchStyle(patternId) {
      return buildWallpaperStyle({
        type: 'pattern',
        pattern: patternId,
        color: this.draft.color,
        glow: this.draft.glow,
        light: this.draft.light,
        rotation: this.draft.rotation,
        intensity: Math.max(55, this.draft.intensity),
        scale: this.draft.scale,
      });
    },
    swatchPatternStyle(patternId) {
      const base = buildWallpaperPatternStyle({
        type: 'pattern',
        pattern: patternId,
        color: this.draft.color,
        glow: this.draft.glow,
        light: this.draft.light,
        intensity: Math.max(70, this.draft.intensity),
        scale: 55,
      });
      return {
        ...base,
        WebkitMaskPosition: '0 0',
        maskPosition: '0 0',
        WebkitMaskRepeat: 'repeat',
        maskRepeat: 'repeat',
      };
    },
  },
};
</script>

<style scoped>
.wp {
  --wp-blue: #3390ec;
  --wp-blue-soft: rgba(51, 144, 236, 0.14);
  padding: 16px 16px 28px;
  max-width: 520px;
  margin: 0 auto;
}

/* -------- Preview (taller, phone-like) -------- */
.wp-preview {
  position: relative;
  height: min(58vh, 460px);
  min-height: 320px;
  border-radius: 22px;
  overflow: hidden;
  isolation: isolate;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.35) inset,
    0 18px 40px -18px rgba(15, 23, 42, 0.35),
    0 0 0 1px rgba(0, 0, 0, 0.06);
}
:global(.dark) .wp-preview {
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.06) inset,
    0 18px 40px -18px rgba(0, 0, 0, 0.55),
    0 0 0 1px rgba(255, 255, 255, 0.08);
}
.wp-preview-media {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.wp-preview-image,
.wp-preview-dim,
.wp-preview-pattern,
.wp-preview-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.wp-preview-glow.is-neon {
  animation: wp-neon-drift 16s ease-in-out infinite alternate;
}
@keyframes wp-neon-drift {
  from { transform: translate3d(0, 0, 0) scale(1); }
  to { transform: translate3d(10px, -8px, 0) scale(1.04); }
}
.wp-preview-bubbles {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  padding: 28px 18px;
  direction: ltr;
}
.wp-bubble {
  position: relative;
  max-width: 78%;
  padding: 9px 12px 10px;
  font-size: 13.5px;
  line-height: 1.35;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.06);
}
.wp-bubble--in {
  align-self: flex-start;
  background: #ffffff;
  color: #1a1a1a;
  /* Sharp corner on the outer-bottom (left) where the tail attaches */
  border-radius: 16px 16px 16px 0;
}
:global(.dark) .wp-bubble--in {
  background: #1e2c3a;
  color: #f1f5f9;
}
.wp-bubble--out {
  align-self: flex-end;
  background: #eeffde;
  color: #1a1a1a;
  /* Sharp corner on the outer-bottom (right) where the tail attaches */
  border-radius: 16px 16px 0 16px;
}
:global(.dark) .wp-bubble--out {
  background: #3e6b41;
  color: #f8fafc;
}
/* Preview-scoped tails only (dir=ltr frame). Shape matches MessageBubble. */
.wp-tail {
  position: absolute;
  bottom: 1px;
  width: 12px;
  height: 15px;
  pointer-events: none;
  z-index: 2;
  overflow: visible;
}
.wp-tail-svg {
  display: block;
  width: 16px;
  height: 16px;
}
.wp-tail--in {
  left: -14px;
  color: #ffffff;
}
:global(.dark) .wp-tail--in {
  color: #1e2c3a;
}
.wp-tail--out {
  right: -14px;
  color: #eeffde;
  transform: scaleX(-1);
}
:global(.dark) .wp-tail--out {
  color: #3e6b41;
}
.wp-preview-badge {
  position: absolute;
  z-index: 3;
  top: 12px;
  inset-inline-start: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: #fff;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* -------- Segmented control -------- */
.wp-seg {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 4px;
  margin-top: 18px;
  padding: 4px;
  border-radius: 14px;
  background: rgba(120, 130, 140, 0.12);
}
:global(.dark) .wp-seg {
  background: rgba(255, 255, 255, 0.06);
}
.wp-seg-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  min-height: 38px;
  padding: 0 8px;
  border-radius: 11px;
  border: 0;
  background: transparent;
  color: #707579;
  font-size: 11.5px;
  font-weight: 700;
  transition: background 0.18s ease, color 0.18s ease, transform 0.12s ease;
}
:global(.dark) .wp-seg-btn {
  color: #8b98a5;
}
.wp-seg-btn.is-on {
  background: #fff;
  color: #1c2733;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.1);
}
:global(.dark) .wp-seg-btn.is-on {
  background: rgba(255, 255, 255, 0.12);
  color: #f1f5f9;
  box-shadow: none;
}
.wp-seg-btn:active:not(:disabled) {
  transform: scale(0.97);
}
.wp-seg-btn:disabled {
  opacity: 0.45;
}
.wp-seg-ico {
  width: 14px;
  height: 14px;
}

/* -------- Labels / grids -------- */
.wp-label {
  margin: 20px 0 10px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #8a9299;
}
.wp-pattern-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}
.wp-swatch {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: auto;
  aspect-ratio: 3 / 4;
  min-height: 64px;
  border-radius: 14px;
  border: 2px solid transparent;
  overflow: hidden;
  transition: border-color 0.15s ease, transform 0.12s ease, box-shadow 0.15s ease;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06);
}
:global(.dark) .wp-swatch {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08);
}
.wp-swatch.is-on {
  border-color: var(--wp-blue);
  box-shadow: 0 0 0 3px var(--wp-blue-soft);
}
.wp-swatch:active {
  transform: scale(0.96);
}
.wp-swatch-fill {
  position: absolute;
  inset: 0;
}
.wp-swatch-none {
  font-size: 10px;
  font-weight: 700;
  color: #9aa3ab;
}

.wp-light-head {
  margin-top: 18px;
  margin-bottom: 10px;
}
.wp-rotate {
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #5b6570;
  background: rgba(120, 130, 140, 0.12);
}
:global(.dark) .wp-rotate {
  color: #c5ced6;
  background: rgba(255, 255, 255, 0.08);
}
.wp-rotate svg {
  width: 16px;
  height: 16px;
}
.wp-rotate:active {
  transform: rotate(20deg);
}
.wp-light-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
}
.wp-light {
  height: 46px;
  padding: 0;
  margin: 0;
  border: 0;
  border-radius: 12px;
  -webkit-appearance: none;
  appearance: none;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-origin: border-box;
  background-clip: border-box;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.12s ease, box-shadow 0.15s ease;
}
:global(.dark) .wp-light {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
}
.wp-light.is-on {
  box-shadow:
    0 0 0 2px var(--wp-blue),
    0 0 0 4px var(--wp-blue-soft);
}
.wp-light:active {
  transform: scale(0.96);
}

.wp-colors {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  align-items: center;
}
.wp-color {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 0;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
  transition: transform 0.12s ease, box-shadow 0.15s ease;
}
.wp-color.is-on {
  box-shadow:
    0 0 0 2px #fff,
    0 0 0 4px var(--wp-blue);
}
:global(.dark) .wp-color.is-on {
  box-shadow:
    0 0 0 2px #17212b,
    0 0 0 4px var(--wp-blue);
}
.wp-color:active {
  transform: scale(0.9);
}
.wp-color--custom {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: conic-gradient(from 180deg, #f87171, #fbbf24, #34d399, #60a5fa, #a78bfa, #f87171);
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
}
.wp-color--custom input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}
.wp-color--custom span {
  pointer-events: none;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
}

.wp-gallery {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.wp-gallery--textures {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
.wp-gallery--textures .wp-tile {
  aspect-ratio: 1;
  border-radius: 12px;
  background-repeat: repeat;
  background-position: top left;
}
.wp-tile-wrap {
  position: relative;
}
.wp-tile {
  width: 100%;
  aspect-ratio: 1 / 1.05;
  border-radius: 16px;
  border: 2px solid transparent;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06);
  transition: border-color 0.15s ease, transform 0.12s ease, box-shadow 0.15s ease;
}
:global(.dark) .wp-tile {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08);
}
.wp-tile.is-on {
  border-color: var(--wp-blue);
  box-shadow: 0 0 0 3px var(--wp-blue-soft);
}
.wp-tile:active {
  transform: scale(0.97);
}
.wp-tile-x {
  position: absolute;
  top: 6px;
  inset-inline-end: 6px;
  width: 26px;
  height: 26px;
  border-radius: 999px;
  border: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(6px);
  opacity: 0.85;
  transition: opacity 0.15s ease, transform 0.12s ease;
}
@media (hover: hover) {
  .wp-tile-x { opacity: 0; }
  .wp-tile-wrap:hover .wp-tile-x,
  .wp-tile-wrap:focus-within .wp-tile-x { opacity: 1; }
}
.wp-tile-x:active {
  transform: scale(0.92);
}
.wp-tile-x svg {
  width: 13px;
  height: 13px;
}

/* -------- Sliders -------- */
.wp-slider {
  margin-top: 18px;
}
.wp-hint {
  margin: 6px 2px 0;
  font-size: 11px;
  line-height: 1.35;
  color: #8a94a0;
  text-transform: none;
  letter-spacing: 0;
  font-weight: 500;
}
:global(.dark) .wp-hint {
  color: #7d8b99;
}
.wp-neon-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 4px;
}
.wp-neon-swatch {
  position: relative;
  aspect-ratio: 1.35;
  border-radius: 14px;
  border: 2px solid transparent;
  overflow: hidden;
  cursor: pointer;
  background: #0b1219;
  -webkit-tap-highlight-color: transparent;
  transition: border-color 0.12s ease, transform 0.12s ease, box-shadow 0.12s ease;
}
.wp-neon-swatch.is-on {
  border-color: #3390ec;
  box-shadow: 0 0 0 2px rgba(51, 144, 236, 0.25);
}
.wp-neon-swatch:active {
  transform: scale(0.97);
}
.wp-slider-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #8a9299;
}
.wp-slider-head strong {
  font-size: 12px;
  letter-spacing: 0;
  text-transform: none;
  color: #5b6570;
}
:global(.dark) .wp-slider-head strong {
  color: #c5ced6;
}
.wp-range {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 999px;
  outline: none;
  cursor: pointer;
}
.wp-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: #fff;
  border: 0;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.06),
    0 2px 8px rgba(15, 23, 42, 0.22);
  transition: transform 0.12s ease;
}
.wp-range::-webkit-slider-thumb:active {
  transform: scale(1.08);
}
.wp-range::-moz-range-thumb {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: #fff;
  border: 0;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.06),
    0 2px 8px rgba(15, 23, 42, 0.22);
}
:global([dir='rtl']) .wp {
  --wp-range-dir: left;
}

/* -------- Actions -------- */
.wp-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 22px;
}
.wp-btn {
  width: 100%;
  min-height: 48px;
  border-radius: 14px;
  border: 0;
  font-size: 15px;
  font-weight: 700;
  transition: transform 0.12s ease, background 0.15s ease, opacity 0.15s ease;
}
.wp-btn:active:not(:disabled) {
  transform: scale(0.985);
}
.wp-btn:disabled {
  opacity: 0.5;
}
.wp-btn--primary {
  color: #fff;
  background: linear-gradient(180deg, #4ea4f5 0%, #3390ec 100%);
  box-shadow: 0 8px 20px -10px rgba(51, 144, 236, 0.7);
}
.wp-btn--primary:hover:not(:disabled) {
  background: linear-gradient(180deg, #5aadf7 0%, #3a97ef 100%);
}
.wp-btn--ghost {
  color: #5b6570;
  background: rgba(120, 130, 140, 0.12);
}
:global(.dark) .wp-btn--ghost {
  color: #c5ced6;
  background: rgba(255, 255, 255, 0.06);
}
.wp-btn--ghost:hover:not(:disabled) {
  background: rgba(120, 130, 140, 0.18);
}
:global(.dark) .wp-btn--ghost:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
}
</style>
