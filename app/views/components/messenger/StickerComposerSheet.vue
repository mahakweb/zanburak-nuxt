<template>
  <teleport to="body">
    <transition name="stk-sheet">
      <div v-if="open" class="stk-root fixed inset-0 z-[2000000400] flex items-end justify-center" @click.self="close">
        <section class="stk-sheet" role="dialog" aria-modal="true" @click.stop>
          <div class="stk-handle" />
          <header class="stk-header">
            <button type="button" class="stk-glass stk-action" @click="close">{{ cancelLabel }}</button>
            <h3 class="stk-title">{{ title }}</h3>
            <button type="button" class="stk-glass stk-action stk-save" :disabled="!canSave" @click="save">{{ saveLabel }}</button>
          </header>

          <div class="stk-fields">
            <input v-if="mode === 'pack' && !editSticker" v-model="packTitle" class="stk-input" type="text" :placeholder="namePlaceholder">
            <div class="stk-emoji-fields">
              <label v-if="mode === 'pack' && !editSticker"><span>آیکن پک</span><input v-model="packEmoji" class="stk-emoji-input" maxlength="8" inputmode="text"></label>
              <label><span>ایموجی استیکر</span><input v-model="stickerEmoji" class="stk-emoji-input" maxlength="8" inputmode="text"></label>
            </div>
          </div>

          <div class="stk-stage">
            <button v-if="!hasImage" type="button" class="stk-empty" @click="pickFile">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" d="M12 5v14M5 12h14"/></svg>
              <span>{{ pickImageLabel }}</span>
            </button>
            <div v-show="hasImage" ref="canvasBox" class="stk-canvas-box">
              <canvas
                ref="canvas"
                class="stk-canvas"
                :class="{ 'is-drawing': tool === 'pen' || tool === 'eraser' }"
                @pointerdown="onPointerDown"
                @pointermove="onPointerMove"
                @pointerup="onPointerUp"
                @pointercancel="onPointerUp"
              />
              <div v-if="cropRect" class="stk-crop" :style="cropStyle" />
            </div>
          </div>

          <nav class="stk-tools" aria-label="ابزارهای ویرایش">
            <button
              v-for="item in tools"
              :key="item.id"
              type="button"
              class="stk-glass stk-tool"
              :class="{ 'is-active': tool === item.id }"
              :aria-label="item.label"
              :title="item.label"
              @click="setTool(item.id)"
            >
              <svg v-if="item.id === 'crop'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" d="M6 3v12a3 3 0 003 3h12M3 6h12a3 3 0 013 3v12"/></svg>
              <svg v-else-if="item.id === 'rotate'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 11a8 8 0 10-2.35 5.65M20 4v7h-7"/></svg>
              <svg v-else-if="item.id === 'pen'" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
              <svg v-else-if="item.id === 'eraser'" viewBox="0 0 24 24" fill="currentColor"><path d="M16.2 3.6l4.9 4.9a2 2 0 010 2.8l-9.2 9.2a2 2 0 01-1.4.6H4v-6.6c0-.5.2-1 .6-1.4l9.2-9.2a2 2 0 012.4 0zM5.4 18H10l7.1-7.1-5-5-6.7 6.7V18z"/></svg>
              <svg v-else-if="item.id === 'undo'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 14L4 9l5-5"/><path stroke-linecap="round" d="M4 9h10a6 6 0 010 12h-3"/></svg>
            </button>
          </nav>

          <div class="stk-submenu">
            <template v-if="tool === 'pen'">
              <div class="stk-controls-col">
                <div class="stk-swatches">
                  <button
                    v-for="color in colors"
                    :key="color"
                    type="button"
                    class="stk-swatch"
                    :class="{ active: penColor === color }"
                    :style="{ backgroundColor: color }"
                    @click="penColor = color"
                  />
                  <label class="stk-swatch stk-swatch-picker" :title="'رنگ دلخواه'">
                    <input v-model="penColor" type="color">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><path stroke-linecap="round" d="M12 8v8M8 12h8"/></svg>
                  </label>
                </div>
                <label class="stk-slider">
                  <span>اندازه</span>
                  <div class="stk-slider-track">
                    <input v-model.number="penSize" type="range" min="2" max="42">
                    <i class="stk-slider-fill" :style="{ width: ((penSize - 2) / 40 * 100) + '%' }" />
                  </div>
                  <output>{{ penSize }}</output>
                </label>
              </div>
            </template>

            <template v-else-if="tool === 'eraser'">
              <label class="stk-slider stk-slider-wide">
                <span>اندازه پاک‌کن</span>
                <div class="stk-slider-track">
                  <input v-model.number="eraserSize" type="range" min="4" max="70">
                  <i class="stk-slider-fill" :style="{ width: ((eraserSize - 4) / 66 * 100) + '%' }" />
                </div>
                <output>{{ eraserSize }}</output>
              </label>
            </template>

            <template v-else-if="tool === 'rotate'">
              <div class="stk-rotate-panel">
                <button type="button" class="stk-glass stk-rotate-step" aria-label="چرخش ۹۰ درجه" @click="rotateQuarter">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 11a8 8 0 10-2.35 5.65M20 4v7h-7"/></svg>
                </button>
                <div class="stk-dial" aria-hidden="true">
                  <svg viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="46" class="stk-dial-ring" />
                    <circle cx="60" cy="60" r="46" class="stk-dial-progress" :style="dialProgressStyle" />
                    <line x1="60" y1="60" x2="60" y2="18" class="stk-dial-needle" :transform="`rotate(${rotationAngle} 60 60)`" />
                    <circle cx="60" cy="60" r="4" class="stk-dial-hub" />
                  </svg>
                </div>
                <label class="stk-slider stk-slider-grow">
                  <span>چرخش</span>
                  <div class="stk-slider-track">
                    <input v-model.number="rotationAngle" type="range" min="-360" max="360" step="1" @input="previewRotation" @change="commitRotation">
                    <i class="stk-slider-fill is-center" :style="rotationFillStyle" />
                  </div>
                  <output>{{ Math.round(rotationAngle) }}°</output>
                </label>
              </div>
            </template>

            <template v-else-if="tool === 'crop'">
              <div class="stk-presets">
                <button
                  v-for="preset in cropPresets"
                  :key="preset.id"
                  type="button"
                  class="stk-preset"
                  :class="{ active: cropAspectKey === preset.id }"
                  :title="preset.label"
                  @click="cropAspectKey = preset.id"
                >
                  <svg v-if="preset.id === 'free'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" />
                    <path stroke-linecap="round" stroke-dasharray="2 2" d="M8 8h8v8H8z" />
                  </svg>
                  <span v-else>{{ preset.label }}</span>
                </button>
              </div>
            </template>
          </div>

          <input ref="fileInput" type="file" accept="image/png,image/webp,image/jpeg,image/gif,.png,.webp,.jpg,.jpeg,.gif" class="hidden" @change="onFile">
        </section>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { createCustomPack, addCustomSticker, addStickerToPack, updateCustomSticker, replaceLocalPackWithServer, ensurePackStickerPreview, isServerPackId } from './stickerPacks';
import { createStickerPackApi, addStickersToPackApi, updateStickerApi } from '@/services/messenger';

const SIZE = 512;

export default {
  name: 'StickerComposerSheet',
  props: {
    open: { type: Boolean, default: false },
    mode: { type: String, default: 'pack' },
    initialFiles: { type: Array, default: () => [] },
    editSticker: { type: Object, default: null },
    targetPackId: { type: String, default: null },
  },
  emits: ['close', 'saved'],
  data() {
    return {
      packTitle: '',
      packEmoji: '✨',
      stickerEmoji: '⭐',
      hasImage: false,
      tool: 'pen',
      penColor: '#ffffff',
      penSize: 7,
      eraserSize: 26,
      colors: ['#ffffff', '#111827', '#ef4444', '#f59e0b', '#3390ec', '#22c55e', '#d946ef'],
      history: [],
      drawing: false,
      lastPoint: null,
      cropStart: null,
      cropRect: null,
      cropAspectKey: 'free',
      rotationAngle: 0,
      rotationSource: null,
      rotateTimer: null,
      baseCanvas: null,
    };
  },
  computed: {
    title() {
      if (this.editSticker || this.mode === 'edit') return 'ویرایش استیکر';
      if (this.mode === 'add') return 'افزودن استیکر';
      return 'ساخت پک استیکر';
    },
    cancelLabel() { const t = this.$t('messenger.cancel'); return t !== 'messenger.cancel' ? t : 'لغو'; },
    saveLabel() { const t = this.$t('messenger.save'); return t !== 'messenger.save' ? t : 'ذخیره'; },
    namePlaceholder() { return 'نام پک'; },
    pickImageLabel() { return 'انتخاب تصویر'; },
    canSave() {
      if (!this.hasImage) return false;
      if (this.mode === 'pack' && !this.editSticker && !String(this.packTitle).trim()) return false;
      return true;
    },
    tools() {
      return [
        { id: 'crop', label: 'برش' },
        { id: 'rotate', label: 'چرخش' },
        { id: 'pen', label: 'قلم' },
        { id: 'eraser', label: 'پاک‌کن' },
        { id: 'undo', label: 'بازگشت' },
      ];
    },
    cropPresets() {
      return [
        { id: 'free', label: 'آزاد', value: null },
        { id: '1:1', label: '1:1', value: 1 },
        { id: '3:4', label: '3:4', value: 3 / 4 },
        { id: '4:3', label: '4:3', value: 4 / 3 },
        { id: '16:9', label: '16:9', value: 16 / 9 },
      ];
    },
    cropAspect() {
      return this.cropPresets.find((p) => p.id === this.cropAspectKey)?.value ?? null;
    },
    cropStyle() {
      if (!this.cropRect) return {};
      return {
        left: `${this.cropRect.x / SIZE * 100}%`,
        top: `${this.cropRect.y / SIZE * 100}%`,
        width: `${this.cropRect.w / SIZE * 100}%`,
        height: `${this.cropRect.h / SIZE * 100}%`,
      };
    },
    dialProgressStyle() {
      const abs = Math.min(360, Math.abs(this.rotationAngle));
      const color = this.rotationAngle < 0 ? '#f59e0b' : '#55b4ff';
      return {
        strokeDasharray: `${(abs / 360) * 289} 289`,
        stroke: color,
      };
    },
    rotationFillStyle() {
      const pct = ((this.rotationAngle + 360) / 720) * 100;
      return { width: `${Math.max(0, Math.min(100, pct))}%` };
    },
  },
  watch: {
    open(value) { if (value) this.bootstrap(); },
  },
  methods: {
    async bootstrap() {
      this.packTitle = '';
      this.packEmoji = '✨';
      this.stickerEmoji = this.editSticker?.emoji || '⭐';
      this.hasImage = false;
      this.tool = 'pen';
      this.history = [];
      this.cropRect = null;
      this.cropAspectKey = 'free';
      this.rotationAngle = 0;
      this.rotationSource = null;
      await this.$nextTick();
      this.initCanvas();
      if (this.editSticker?.src) await this.loadSrc(this.editSticker.src);
      else if (this.editSticker?.emoji) this.loadEmoji(this.editSticker.emoji);
      else if (this.initialFiles?.[0]) await this.loadFile(this.initialFiles[0]);
    },
    initCanvas() {
      const c = this.$refs.canvas;
      if (c) { c.width = SIZE; c.height = SIZE; }
      this.baseCanvas = document.createElement('canvas');
      this.baseCanvas.width = SIZE;
      this.baseCanvas.height = SIZE;
    },
    ctx() { return this.$refs.canvas?.getContext('2d') || null; },
    syncBase() {
      if (!this.baseCanvas || !this.$refs.canvas) return;
      const base = this.baseCanvas.getContext('2d');
      base.clearRect(0, 0, SIZE, SIZE);
      base.drawImage(this.$refs.canvas, 0, 0);
    },
    close() { this.$emit('close'); },
    pickFile() { this.$refs.fileInput?.click(); },
    async onFile(event) {
      const file = event.target?.files?.[0];
      event.target.value = '';
      if (file) await this.loadFile(file);
    },
    loadFile(file) {
      if (!file?.type?.startsWith('image/')) return Promise.resolve();
      const url = URL.createObjectURL(file);
      return this.loadSrc(url).finally(() => URL.revokeObjectURL(url));
    },
    loadSrc(src) {
      return new Promise((resolve) => {
        const image = new Image();
        image.onload = () => {
          this.drawCover(image);
          this.syncBase();
          this.hasImage = true;
          this.saveHistory();
          resolve();
        };
        image.onerror = resolve;
        image.crossOrigin = 'anonymous';
        image.src = src;
      });
    },
    loadEmoji(emoji) {
      const ctx = this.ctx();
      if (!ctx) return;
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.font = '320px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, SIZE / 2, SIZE / 2 + 10);
      this.syncBase();
      this.hasImage = true;
      this.saveHistory();
    },
    drawCover(image) {
      const ctx = this.ctx();
      if (!ctx) return;
      const scale = Math.min(SIZE / image.width, SIZE / image.height);
      const width = image.width * scale;
      const height = image.height * scale;
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.drawImage(image, (SIZE - width) / 2, (SIZE - height) / 2, width, height);
    },
    saveHistory() {
      if (!this.baseCanvas) return;
      this.history.push({ image: this.baseCanvas.toDataURL('image/png') });
      if (this.history.length > 30) this.history.shift();
    },
    undo() {
      if (this.history.length < 2) return;
      this.history.pop();
      const state = this.history[this.history.length - 1];
      const image = new Image();
      image.onload = () => {
        const ctx = this.ctx();
        ctx.clearRect(0, 0, SIZE, SIZE);
        ctx.drawImage(image, 0, 0);
        this.syncBase();
      };
      image.src = state.image;
    },
    setTool(id) {
      if (id === 'undo') { this.undo(); return; }
      if (this.tool === 'rotate' && id !== 'rotate') this.commitRotation();
      this.tool = id;
      this.cropRect = null;
      this.cropStart = null;
      if (id === 'rotate') {
        this.rotationAngle = 0;
        this.rotationSource = this.$refs.canvas?.toDataURL('image/png') || null;
      }
    },
    canvasPoint(event) {
      const rect = this.$refs.canvas?.getBoundingClientRect();
      if (!rect || !rect.width || !rect.height) return null;
      return {
        x: Math.max(0, Math.min(SIZE, (event.clientX - rect.left) / rect.width * SIZE)),
        y: Math.max(0, Math.min(SIZE, (event.clientY - rect.top) / rect.height * SIZE)),
      };
    },
    onPointerDown(event) {
      if (!this.hasImage) return;
      const point = this.canvasPoint(event);
      if (!point) return;
      event.currentTarget.setPointerCapture?.(event.pointerId);
      if (this.tool === 'crop') {
        this.cropStart = point;
        this.cropRect = { x: point.x, y: point.y, w: 0, h: 0 };
        this.drawing = true;
        return;
      }
      if (this.tool !== 'pen' && this.tool !== 'eraser') return;
      const ctx = this.ctx();
      this.drawing = true;
      this.lastPoint = point;
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = this.tool === 'eraser' ? this.eraserSize : this.penSize;
      ctx.globalCompositeOperation = this.tool === 'eraser' ? 'destination-out' : 'source-over';
      ctx.strokeStyle = this.penColor;
    },
    onPointerMove(event) {
      const point = this.canvasPoint(event);
      if (!point || !this.drawing) return;
      if (this.tool === 'crop') {
        this.cropRect = this.aspectRect(this.cropStart, point);
        return;
      }
      const ctx = this.ctx();
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    },
    onPointerUp() {
      if (!this.drawing) return;
      this.drawing = false;
      const ctx = this.ctx();
      if (ctx) ctx.globalCompositeOperation = 'source-over';
      if (this.tool === 'crop' && this.cropRect?.w > 8 && this.cropRect?.h > 8) {
        this.applyCrop(this.cropRect);
        this.cropRect = null;
      } else if (this.tool === 'pen' || this.tool === 'eraser') {
        this.syncBase();
        this.saveHistory();
      }
    },
    aspectRect(start, point) {
      let w = point.x - start.x;
      let h = point.y - start.y;
      if (this.cropAspect) {
        const sign = h < 0 ? -1 : 1;
        h = sign * Math.abs(w) / this.cropAspect;
      }
      const x = w < 0 ? start.x + w : start.x;
      const y = h < 0 ? start.y + h : start.y;
      return {
        x: Math.max(0, x),
        y: Math.max(0, y),
        w: Math.min(Math.abs(w), SIZE - Math.max(0, x)),
        h: Math.min(Math.abs(h), SIZE - Math.max(0, y)),
      };
    },
    applyCrop(rect) {
      const source = document.createElement('canvas');
      source.width = SIZE;
      source.height = SIZE;
      source.getContext('2d').drawImage(this.$refs.canvas, 0, 0);
      const ctx = this.ctx();
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.drawImage(source, rect.x, rect.y, rect.w, rect.h, 0, 0, SIZE, SIZE);
      this.syncBase();
      this.saveHistory();
    },
    previewRotation() {
      this.rotationAngle = Math.max(-360, Math.min(360, Number(this.rotationAngle) || 0));
      if (!this.rotationSource) {
        this.rotationSource = this.$refs.canvas?.toDataURL('image/png') || null;
      }
      if (!this.rotationSource) return;
      clearTimeout(this.rotateTimer);
      this.rotateTimer = setTimeout(() => this.drawRotation(this.rotationSource, this.rotationAngle, false), 0);
    },
    drawRotation(source, angle, save) {
      return new Promise((resolve) => {
        const image = new Image();
        image.onload = () => {
          const ctx = this.ctx();
          if (!ctx) { resolve(); return; }
          ctx.clearRect(0, 0, SIZE, SIZE);
          ctx.save();
          ctx.translate(SIZE / 2, SIZE / 2);
          ctx.rotate(angle * Math.PI / 180);
          ctx.drawImage(image, -SIZE / 2, -SIZE / 2);
          ctx.restore();
          this.syncBase();
          if (save) this.saveHistory();
          resolve();
        };
        image.onerror = resolve;
        image.src = source;
      });
    },
    commitRotation() {
      if (!this.rotationSource) return Promise.resolve();
      const angle = Math.max(-360, Math.min(360, Number(this.rotationAngle) || 0));
      const source = this.rotationSource;
      this.rotationSource = null;
      this.rotationAngle = 0;
      return Math.abs(angle) > 0.01 ? this.drawRotation(source, angle, true) : Promise.resolve();
    },
    rotateQuarter() {
      const source = this.rotationSource || this.$refs.canvas?.toDataURL('image/png');
      if (!source) return;
      this.rotationSource = null;
      this.rotationAngle = 0;
      this.drawRotation(source, 90, true).then(() => {
        this.rotationSource = this.$refs.canvas?.toDataURL('image/png') || null;
      });
    },
    exportDataUrl() {
      return this.$refs.canvas?.toDataURL('image/png') || null;
    },
    async save() {
      if (!this.canSave) return;
      await this.commitRotation();
      const dataUrl = this.exportDataUrl();
      if (!dataUrl) return;
      const emoji = String(this.stickerEmoji || '⭐').trim() || '⭐';
      if (this.editSticker?.id && this.editSticker?.packId) {
        updateCustomSticker(this.editSticker.packId, this.editSticker.id, { src: dataUrl, kind: 'image', emoji });
        if (isServerPackId(this.editSticker.id)) {
          try { await updateStickerApi(this.editSticker.id, { data_url: dataUrl, emoji }); } catch (error) { /* offline ok */ }
        }
        this.$emit('saved', { pack: null, stickerId: this.editSticker.id });
      } else if (this.mode === 'add' && this.targetPackId) {
        addStickerToPack(this.targetPackId, dataUrl, emoji);
        let serverPack = null;
        if (isServerPackId(this.targetPackId)) {
          try {
            serverPack = await addStickersToPackApi(this.targetPackId, [{ emoji, data_url: dataUrl }]);
          } catch (error) { /* offline ok */ }
        }
        ensurePackStickerPreview(this.targetPackId, dataUrl, emoji, serverPack);
        this.$emit('saved', { packId: this.targetPackId });
      } else if (this.mode === 'pack') {
        const title = String(this.packTitle).trim();
        const pack = createCustomPack({ title, titleFa: title, stickers: [{ kind: 'image', src: dataUrl, emoji }] });
        if (pack) pack.icon = String(this.packEmoji || emoji).trim() || emoji;
        try {
          const serverPack = await createStickerPackApi({
            title,
            title_fa: title,
            icon: this.packEmoji || emoji,
            stickers: [{ emoji, data_url: dataUrl }],
          });
          if (serverPack) {
            replaceLocalPackWithServer(pack?.id, serverPack);
            ensurePackStickerPreview(serverPack.id, dataUrl, emoji, serverPack);
          }
        } catch (error) { /* local pack remains available offline */ }
        this.$emit('saved', { pack });
      } else {
        addCustomSticker(dataUrl, emoji);
        this.$emit('saved', { pack: null });
      }
      this.close();
    },
  },
};
</script>

<style scoped>
.stk-root{background:rgba(3,10,18,.58);backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px)}
.stk-sheet{width:100%;max-width:540px;max-height:90vh;overflow:auto;background:rgba(28,36,47,.55);border:1px solid rgba(255,255,255,.14);border-bottom:0;border-radius:22px 22px 0 0;box-shadow:0 -14px 48px rgba(0,0,0,.4),0 1px 0 rgba(255,255,255,.08) inset;-webkit-backdrop-filter:blur(44px) saturate(1.9);backdrop-filter:blur(44px) saturate(1.9);padding-bottom:calc(10px + env(safe-area-inset-bottom,0px));font-size:13px}
.stk-handle{width:38px;height:4px;border-radius:99px;background:rgba(255,255,255,.32);margin:9px auto 4px}
.stk-header{display:flex;align-items:center;gap:9px;padding:4px 12px 10px}
.stk-title{flex:1;min-width:0;text-align:center;color:#fff;font-size:13.5px;font-weight:650}
.stk-glass{border:1px solid rgba(255,255,255,.19);background:rgba(255,255,255,.11);color:#fff;box-shadow:inset 0 1px rgba(255,255,255,.17),0 4px 14px rgba(0,0,0,.12);backdrop-filter:blur(15px) saturate(1.3);-webkit-backdrop-filter:blur(15px) saturate(1.3);-webkit-tap-highlight-color:transparent}
.stk-action{height:34px;padding:0 12px;border-radius:11px;font-weight:700;font-size:13px}
.stk-save{color:#72bdff}
.stk-save:disabled{opacity:.38}
.stk-fields{padding:0 13px 5px}
.stk-input{box-sizing:border-box;width:100%;height:39px;border:1px solid rgba(255,255,255,.13);border-radius:12px;background:rgba(0,0,0,.13);color:#fff;padding:0 12px;outline:none}
.stk-emoji-fields{display:flex;gap:8px;margin-top:7px}
.stk-emoji-fields label{display:flex;align-items:center;gap:6px;color:rgba(255,255,255,.6);font-size:11px}
.stk-emoji-input{width:45px;height:28px;text-align:center;border:1px solid rgba(255,255,255,.14);border-radius:9px;background:rgba(255,255,255,.09);color:#fff;font-size:16px;outline:none}
.stk-stage{min-height:240px;display:flex;align-items:center;justify-content:center;padding:8px 14px}
.stk-empty{width:min(300px,76vw);aspect-ratio:1;border:1.5px dashed rgba(255,255,255,.31);border-radius:20px;background:
  linear-gradient(45deg,#1b2733 25%,transparent 25%) 0 0/18px 18px,
  linear-gradient(-45deg,#1b2733 25%,transparent 25%) 0 9px/18px 18px,
  linear-gradient(45deg,transparent 75%,#1b2733 75%) 9px -9px/18px 18px,
  linear-gradient(-45deg,transparent 75%,#1b2733 75%) -9px 0/18px 18px,
  #243444;color:rgba(255,255,255,.75);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;font:600 13px sans-serif}
.stk-empty svg{width:40px;height:40px}
.stk-canvas-box{position:relative;width:min(330px,78vw);height:min(330px,78vw);max-height:43vh;border-radius:18px;overflow:hidden;background:
  linear-gradient(45deg,#cfd6dd 25%,transparent 25%) 0 0/16px 16px,
  linear-gradient(-45deg,#cfd6dd 25%,transparent 25%) 0 8px/16px 16px,
  linear-gradient(45deg,transparent 75%,#cfd6dd 75%) 8px -8px/16px 16px,
  linear-gradient(-45deg,transparent 75%,#cfd6dd 75%) -8px 0/16px 16px,
  #eef2f6}
.stk-canvas{width:100%;height:100%;touch-action:none;background:transparent}
.stk-canvas.is-drawing{cursor:crosshair}
.stk-crop{position:absolute;border:2px dashed rgba(255,255,255,.95);box-shadow:0 0 0 200vmax rgba(0,0,0,.33);pointer-events:none}
.stk-tools{display:flex;justify-content:center;gap:8px;padding:4px 12px 9px}
.stk-tool{width:43px;height:43px;border-radius:14px;display:grid;place-items:center;color:#fff}
.stk-tool svg{width:20px;height:20px;display:block}
.stk-tool.is-active{border-color:rgba(118,195,255,.7);background:rgba(51,144,236,.38);color:#b9e2ff}
.stk-submenu{min-height:56px;display:flex;align-items:center;justify-content:center;padding:0 14px 10px}
.stk-controls-col{display:flex;flex-direction:column;align-items:center;gap:10px;width:min(390px,92vw)}
.stk-swatches,.stk-presets{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap}
.stk-swatch{width:22px;height:22px;border:2px solid transparent;border-radius:50%;box-shadow:0 0 0 1px rgba(255,255,255,.22);padding:0}
.stk-swatch.active{border-color:#fff;box-shadow:0 0 0 3px rgba(51,144,236,.55)}
.stk-swatch-picker{position:relative;display:grid;place-items:center;background:rgba(255,255,255,.12);color:#9ed6ff;overflow:hidden}
.stk-swatch-picker input{position:absolute;inset:0;opacity:0;cursor:pointer}
.stk-swatch-picker svg{width:12px;height:12px;pointer-events:none}
.stk-slider{display:flex;align-items:center;gap:10px;width:100%;color:rgba(255,255,255,.72);font-size:11px}
.stk-slider-wide{width:min(360px,90vw)}
.stk-slider-grow{flex:1;min-width:0}
.stk-slider-track{position:relative;flex:1;height:28px;display:flex;align-items:center;direction:ltr}
.stk-slider-track input{position:relative;z-index:2;width:100%;height:28px;margin:0;appearance:none;background:transparent;cursor:pointer}
.stk-slider-track input::-webkit-slider-runnable-track{height:6px;border-radius:99px;background:rgba(255,255,255,.14)}
.stk-slider-track input::-moz-range-track{height:6px;border-radius:99px;background:rgba(255,255,255,.14)}
.stk-slider-track input::-webkit-slider-thumb{appearance:none;width:18px;height:18px;margin-top:-6px;border-radius:50%;background:linear-gradient(180deg,#8fd0ff,#3390ec);border:2px solid #fff;box-shadow:0 4px 12px rgba(51,144,236,.45)}
.stk-slider-track input::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:linear-gradient(180deg,#8fd0ff,#3390ec);border:2px solid #fff;box-shadow:0 4px 12px rgba(51,144,236,.45)}
.stk-slider-fill{position:absolute;left:0;top:50%;transform:translateY(-50%);height:6px;border-radius:99px;background:linear-gradient(90deg,#4aa8f0,#7fd0ff);pointer-events:none;z-index:1;max-width:100%}
.stk-slider-fill.is-center{left:0}
.stk-slider output{min-width:28px;text-align:center;color:#9ed6ff;font-variant-numeric:tabular-nums}
.stk-preset{min-width:42px;height:34px;border:1px solid rgba(255,255,255,.15);border-radius:10px;background:rgba(255,255,255,.08);color:rgba(255,255,255,.78);padding:0 8px;font-size:11px;display:grid;place-items:center}
.stk-preset svg{width:18px;height:18px}
.stk-preset.active{background:rgba(51,144,236,.44);border-color:#70c0ff;color:#fff}
.stk-rotate-panel{display:flex;align-items:center;gap:10px;width:min(420px,94vw)}
.stk-rotate-step{width:36px;height:36px;border-radius:12px;display:grid;place-items:center;flex-shrink:0}
.stk-rotate-step svg{width:18px;height:18px}
.stk-dial{width:56px;height:56px;flex-shrink:0}
.stk-dial svg{width:100%;height:100%}
.stk-dial-ring{fill:none;stroke:rgba(255,255,255,.14);stroke-width:6}
.stk-dial-progress{fill:none;stroke-width:6;stroke-linecap:round;transform:rotate(-90deg);transform-origin:60px 60px}
.stk-dial-needle{stroke:#dff1ff;stroke-width:3;stroke-linecap:round}
.stk-dial-hub{fill:#9ed6ff}
.stk-sheet-enter-active,.stk-sheet-leave-active{transition:opacity .2s ease}
.stk-sheet-enter-active .stk-sheet,.stk-sheet-leave-active .stk-sheet{transition:transform .24s cubic-bezier(.22,1,.36,1)}
.stk-sheet-enter-from,.stk-sheet-leave-to{opacity:0}
.stk-sheet-enter-from .stk-sheet,.stk-sheet-leave-to .stk-sheet{transform:translateY(100%)}
@media(min-width:640px){.stk-sheet{border-radius:22px 22px 0 0}}
@media(max-height:650px){.stk-stage{min-height:190px}.stk-canvas-box{max-height:35vh}}
</style>
