<template>
  <div class="avatar-editor flex flex-col h-full min-h-0">
    <div class="avatar-editor-scroll flex-1 min-h-0 overflow-y-auto custom-scrollbar px-3 pt-2 pb-2">
      <!-- Preview stage -->
      <div
        class="avatar-editor-stage relative overflow-hidden rounded-2xl bg-[#0b1219] dark:bg-black/40"
        :class="{ 'avatar-editor-stage--busy': uploading }"
        @touchstart.passive="onStageTouchStart"
        @touchmove="onStageTouchMove"
      >
        <div ref="canvasHost" class="avatar-editor-canvas h-[min(42vh,320px)]" :class="{ 'is-round': mode === 'avatar', 'is-cover': mode === 'cover' }">
          <vue-cropper
            v-if="imageSrc"
            ref="cropper"
            :key="cropperKey"
            :src="imageSrc"
            :aspect-ratio="aspectRatio"
            :view-mode="1"
            :drag-mode="'move'"
            :auto-crop-area="0.86"
            :background="false"
            :responsive="true"
            :restore="false"
            :guides="mode === 'cover'"
            :center="true"
            :highlight="false"
            :crop-box-movable="true"
            :crop-box-resizable="true"
            :toggle-drag-mode-on-dblclick="false"
            :zoomable="true"
            :zoom-on-touch="true"
            :zoom-on-wheel="true"
            :wheel-zoom-ratio="0.1"
            :ready="onReady"
            :zoom="onCropperZoom"
            :container-style="{ width: '100%', height: '100%', touchAction: 'none' }"
            :img-style="{ display: 'block', maxWidth: '100%' }"
          />
        </div>

        <div class="avatar-editor-ring pointer-events-none" aria-hidden="true" />

        <div
          v-if="uploading"
          class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/55 backdrop-blur-[2px]"
        >
          <svg class="w-8 h-8 animate-spin text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <p class="text-[13px] font-medium text-white/90">{{ $t('messenger.avatarUploading') }}</p>
          <div class="w-40 h-1 rounded-full bg-white/20 overflow-hidden" dir="ltr">
            <div class="h-full rounded-full bg-[#3390ec] transition-all duration-200" :style="{ width: `${uploadPercentage}%` }" />
          </div>
        </div>
      </div>

      <p class="mt-2.5 mb-3 px-1 text-[12px] text-[#a2acb4] leading-snug">
        {{ cropHint }}
        <span class="text-[#707579]"> {{ $t('messenger.avatarPinchHint') }}</span>
      </p>

      <!-- Tools -->
      <div class="tg-card overflow-hidden mb-1">
        <!-- Zoom -->
        <div class="avatar-tool-row">
          <button type="button" class="avatar-icon-btn" :disabled="uploading" :title="$t('messenger.avatarZoomOut')" @click="nudgeZoom(-0.12)">
            <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" /></svg>
          </button>
          <input
            :value="zoomLevel"
            type="range"
            min="0"
            max="100"
            class="avatar-slider flex-1"
            :disabled="uploading"
            @input="onZoomSlider"
          />
          <button type="button" class="avatar-icon-btn" :disabled="uploading" :title="$t('messenger.avatarZoomIn')" @click="nudgeZoom(0.12)">
            <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
          </button>
        </div>

        <div class="h-px bg-black/[0.06] dark:bg-white/[0.06]" />

        <!-- Free rotation -->
        <div class="px-3.5 pt-3 pb-2">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[12px] font-medium text-[#707579]">{{ $t('messenger.avatarRotate') }}</span>
            <span class="text-[12px] tabular-nums text-[#3390ec] font-semibold" dir="ltr">{{ Math.round(rotation) }}°</span>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" class="avatar-icon-btn" :disabled="uploading" @click="nudgeRotate(-15)" :title="$t('messenger.avatarRotateLeft')">
              <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l4-4m-4 4l4 4" /></svg>
            </button>
            <input
              v-model.number="rotation"
              type="range"
              min="-180"
              max="180"
              step="1"
              class="avatar-slider flex-1"
              :disabled="uploading"
              @input="onRotateSlider"
            />
            <button type="button" class="avatar-icon-btn" :disabled="uploading" @click="nudgeRotate(15)" :title="$t('messenger.avatarRotateRight')">
              <svg class="w-[18px] h-[18px] scale-x-[-1]" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l4-4m-4 4l4 4" /></svg>
            </button>
          </div>
        </div>

        <div class="h-px bg-black/[0.06] dark:bg-white/[0.06]" />

        <!-- Flip / reset -->
        <div class="flex items-center justify-around gap-1 px-2 py-2.5">
          <button type="button" class="avatar-action" :disabled="uploading" @click="flipX">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7v10M3 12h5m0 0l-3-3m3 3l-3 3M16 7v10m5-5h-5m0 0l3-3m-3 3l3 3" /></svg>
            <span>{{ $t('messenger.avatarFlipH') }}</span>
          </button>
          <button type="button" class="avatar-action" :disabled="uploading" @click="flipY">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M12 3v5m0 0l-3-3m3 3l3-3M7 16h10m-5 5v-5m0 0l-3 3m3-3l3 3" /></svg>
            <span>{{ $t('messenger.avatarFlipV') }}</span>
          </button>
          <button type="button" class="avatar-action avatar-action--muted" :disabled="uploading" @click="resetAll">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            <span>{{ $t('messenger.avatarReset') }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="tg-form-footer">
      <button
        type="button"
        class="tg-form-btn tg-form-btn--muted"
        :disabled="uploading"
        @click="$emit('cancel')"
      >
        {{ $t('messenger.cancel') }}
      </button>
      <button
        type="button"
        class="tg-form-btn tg-form-btn--primary tg-form-btn--grow"
        :disabled="uploading || !imageSrc"
        @click="confirm"
      >
        {{ uploading ? '…' : $t('messenger.avatarApply') }}
      </button>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
const VueCropper = import.meta.client
  ? defineAsyncComponent(async () => {
      await import('cropperjs/dist/cropper.css')
      return (await import('vue-cropperjs')).default
    })
  : { name: 'VueCropperStub', render() { return null } }

import 'cropperjs/dist/cropper.css';

const MODE_CONFIG = {
  avatar: {
    aspectRatio: 1,
    width: 512,
    height: 512,
    fileName: 'avatar.jpg',
  },
  cover: {
    aspectRatio: 3,
    width: 1200,
    height: 400,
    fileName: 'cover.jpg',
  },
};

const ZOOM_MIN = 0.2;
const ZOOM_MAX = 4;

export default {
  name: 'AvatarCropEditor',
  components: { VueCropper },
  props: {
    imageSrc: { type: String, required: true },
    /** avatar = square/circle, cover = wide banner */
    mode: {
      type: String,
      default: 'avatar',
      validator: (v) => ['avatar', 'cover'].includes(v),
    },
    uploading: { type: Boolean, default: false },
    uploadPercentage: { type: Number, default: 0 },
  },
  emits: ['confirm', 'cancel'],
  data() {
    return {
      rotation: 0,
      zoomLevel: 25,
      scaleX: 1,
      scaleY: 1,
      cropperKey: 0,
      syncingZoom: false,
      pinching: false,
    };
  },
  computed: {
    modeConfig() {
      return MODE_CONFIG[this.mode] || MODE_CONFIG.avatar;
    },
    aspectRatio() {
      return this.modeConfig.aspectRatio;
    },
    cropHint() {
      return this.mode === 'cover'
        ? this.$t('messenger.coverCropHint')
        : this.$t('messenger.avatarCropHint');
    },
  },
  watch: {
    imageSrc() {
      this.resetTransforms(false);
    },
    mode() {
      this.resetTransforms(true);
    },
  },
  methods: {
    resetTransforms(bumpKey) {
      this.rotation = 0;
      this.zoomLevel = 25;
      this.scaleX = 1;
      this.scaleY = 1;
      if (bumpKey !== false) this.cropperKey += 1;
      else this.cropperKey += 1;
    },
    /** VueCropper component (has relativeZoom / rotateTo wrappers). */
    getVueCropper() {
      return this.$refs.cropper || null;
    },
    /** Raw Cropper.js instance. */
    getInstance() {
      return this.getVueCropper()?.cropper || null;
    },
    currentAbsRatio() {
      const inst = this.getInstance();
      if (!inst) return 1;
      try {
        const data = inst.getImageData();
        if (!data?.naturalWidth) return 1;
        return data.width / data.naturalWidth;
      } catch (e) {
        return 1;
      }
    },
    ratioToLevel(ratio) {
      const clamped = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, ratio));
      return Math.round(((clamped - ZOOM_MIN) / (ZOOM_MAX - ZOOM_MIN)) * 100);
    },
    levelToRatio(level) {
      const t = Math.max(0, Math.min(100, Number(level) || 0)) / 100;
      return ZOOM_MIN + t * (ZOOM_MAX - ZOOM_MIN);
    },
    syncZoomFromCropper() {
      if (this.syncingZoom) return;
      this.zoomLevel = this.ratioToLevel(this.currentAbsRatio());
    },
    onReady() {
      const vue = this.getVueCropper();
      const inst = this.getInstance();
      if (!vue || !inst) return;
      try {
        vue.rotateTo(this.rotation);
        vue.scaleX(this.scaleX);
        vue.scaleY(this.scaleY);
        this.syncZoomFromCropper();
      } catch (e) { /* noop */ }
    },
    onCropperZoom() {
      // Fired for wheel, pinch, and API zoom — keep slider in sync.
      this.$nextTick(() => this.syncZoomFromCropper());
    },
    /** Relative zoom: Cropper.zoom(+0.1) / zoom(-0.1). */
    nudgeZoom(delta) {
      const vue = this.getVueCropper();
      const inst = this.getInstance();
      if (!vue && !inst) return;
      if (typeof vue?.relativeZoom === 'function') {
        vue.relativeZoom(delta);
      } else if (typeof inst?.zoom === 'function') {
        inst.zoom(delta);
      }
      this.syncZoomFromCropper();
    },
    onZoomSlider(e) {
      const level = Number(e.target.value);
      this.zoomLevel = level;
      const target = this.levelToRatio(level);
      const vue = this.getVueCropper();
      const inst = this.getInstance();
      this.syncingZoom = true;
      try {
        if (typeof vue?.zoomTo === 'function') vue.zoomTo(target);
        else if (typeof inst?.zoomTo === 'function') inst.zoomTo(target);
      } catch (err) { /* noop */ }
      this.$nextTick(() => { this.syncingZoom = false; });
    },
    onRotateSlider() {
      const vue = this.getVueCropper();
      if (vue && typeof vue.rotateTo === 'function') {
        vue.rotateTo(Number(this.rotation) || 0);
      } else {
        this.getInstance()?.rotateTo?.(Number(this.rotation) || 0);
      }
    },
    nudgeRotate(deg) {
      let next = (Number(this.rotation) || 0) + deg;
      if (next > 180) next -= 360;
      if (next < -180) next += 360;
      this.rotation = next;
      this.onRotateSlider();
    },
    flipX() {
      this.scaleX *= -1;
      const vue = this.getVueCropper();
      if (typeof vue?.scaleX === 'function') vue.scaleX(this.scaleX);
      else this.getInstance()?.scaleX?.(this.scaleX);
    },
    flipY() {
      this.scaleY *= -1;
      const vue = this.getVueCropper();
      if (typeof vue?.scaleY === 'function') vue.scaleY(this.scaleY);
      else this.getInstance()?.scaleY?.(this.scaleY);
    },
    resetAll() {
      this.resetTransforms(true);
    },
    onStageTouchStart(e) {
      this.pinching = !!(e.touches && e.touches.length >= 2);
    },
    onStageTouchMove(e) {
      // Keep parent menu from scrolling while pinching on the image.
      if ((e.touches && e.touches.length >= 2) || this.pinching) {
        e.preventDefault();
      }
    },
    confirm() {
      const vue = this.getVueCropper();
      const inst = this.getInstance();
      const getCanvas = vue?.getCroppedCanvas?.bind(vue) || inst?.getCroppedCanvas?.bind(inst);
      if (!getCanvas || this.uploading) return;
      const { width, height, fileName } = this.modeConfig;
      const canvas = getCanvas({
        width,
        height,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
        fillColor: '#fff',
      });
      if (!canvas) return;
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const file = new File([blob], fileName, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          this.$emit('confirm', file);
        },
        'image/jpeg',
        0.92,
      );
    },
  },
};
</script>

<style scoped>
.avatar-editor-canvas {
  touch-action: none;
  -webkit-user-select: none;
  user-select: none;
}

.avatar-editor-canvas :deep(.cropper-container),
.avatar-editor-canvas :deep(.cropper-wrap-box),
.avatar-editor-canvas :deep(.cropper-canvas),
.avatar-editor-canvas :deep(.cropper-drag-box),
.avatar-editor-canvas :deep(.cropper-crop-box) {
  touch-action: none;
}

.avatar-editor-canvas :deep(.cropper-container) {
  width: 100% !important;
  height: 100% !important;
}

.avatar-editor-canvas.is-round :deep(.cropper-view-box),
.avatar-editor-canvas.is-round :deep(.cropper-face) {
  border-radius: 50%;
}

.avatar-editor-canvas.is-cover :deep(.cropper-view-box),
.avatar-editor-canvas.is-cover :deep(.cropper-face) {
  border-radius: 8px;
}

.avatar-editor-canvas :deep(.cropper-modal) {
  background-color: #0b1219;
  opacity: 0.72;
}

.avatar-editor-canvas :deep(.cropper-line),
.avatar-editor-canvas :deep(.cropper-point) {
  background-color: #3390ec;
}

.avatar-editor-canvas :deep(.cropper-point) {
  width: 8px;
  height: 8px;
  opacity: 1;
  border-radius: 50%;
}

.avatar-editor-canvas :deep(.cropper-view-box) {
  outline: 2px solid rgba(51, 144, 236, 0.95);
  outline-offset: 0;
}

.avatar-editor-ring {
  position: absolute;
  inset: 0;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
  border-radius: 1rem;
  pointer-events: none;
}

.avatar-tool-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
}

.avatar-icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #707579;
  background: rgba(0, 0, 0, 0.04);
  transition: background 0.12s ease, color 0.12s ease, transform 0.1s ease;
  flex-shrink: 0;
}
.dark .avatar-icon-btn {
  background: rgba(255, 255, 255, 0.06);
  color: #a2acb4;
}
.avatar-icon-btn:hover:not(:disabled) {
  background: rgba(51, 144, 236, 0.12);
  color: #3390ec;
}
.avatar-icon-btn:active:not(:disabled) {
  transform: scale(0.94);
}
.avatar-icon-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.avatar-slider {
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  border-radius: 999px;
  background: rgba(51, 144, 236, 0.22);
  outline: none;
}
.avatar-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #3390ec;
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.25);
  cursor: pointer;
}
.avatar-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #3390ec;
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.25);
  cursor: pointer;
}
.avatar-slider:disabled {
  opacity: 0.45;
}

.avatar-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
  padding: 8px 4px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  color: #4b5563;
  transition: background 0.12s ease, color 0.12s ease;
}
.dark .avatar-action {
  color: #d1d5db;
}
.avatar-action:hover:not(:disabled) {
  background: rgba(51, 144, 236, 0.1);
  color: #3390ec;
}
.avatar-action--muted:hover:not(:disabled) {
  color: #df3f40;
  background: rgba(223, 63, 64, 0.08);
}
.avatar-action:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
