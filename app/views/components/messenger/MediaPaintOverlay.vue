<template>
  <div
    ref="root"
    class="mp-root"
    :class="{ 'is-drawing': tool === 'pen' || tool === 'eraser' }"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <canvas ref="canvas" class="mp-canvas" />

    <div
      v-if="tool === 'text' && textDraft"
      class="mp-text-box"
      :style="textBoxStyle"
      @pointerdown.stop
    >
      <input
        ref="textInput"
        v-model="textDraft.value"
        class="mp-text-input"
        :style="{ color: color, fontSize: `${Math.max(16, textDraft.size * stageScale)}px` }"
        maxlength="80"
        @keydown.enter.prevent="commitText"
        @keydown.esc.prevent="cancelText"
        @blur="commitText"
      />
    </div>

    <div
      v-if="placingEmoji"
      class="mp-emoji-ghost"
      :style="emojiGhostStyle"
    >{{ placingEmoji }}</div>
  </div>
</template>

<script>
import {
  PAINT_COLORS,
  pushPaintLayer,
  rasterizePaintLayers,
} from './mediaPaint';

export default {
  name: 'MediaPaintOverlay',
  props: {
    modelValue: { type: Object, default: null },
    tool: { type: String, default: 'pen' },
    color: { type: String, default: PAINT_COLORS[0] },
    thickness: { type: Number, default: 4 },
    emoji: { type: String, default: '😀' },
    enabled: { type: Boolean, default: true },
  },
  emits: ['update:modelValue', 'drawing-change'],
  data() {
    return {
      drawing: false,
      currentStroke: null,
      textDraft: null,
      placingEmoji: null,
      placeX: 0.5,
      placeY: 0.5,
      stageScale: 1,
      cssW: 1,
      cssH: 1,
      dpr: 1,
      raf: 0,
      ro: null,
    };
  },
  computed: {
    textBoxStyle() {
      if (!this.textDraft) return {};
      return {
        left: `${this.textDraft.x * 100}%`,
        top: `${this.textDraft.y * 100}%`,
      };
    },
    emojiGhostStyle() {
      return {
        left: `${this.placeX * 100}%`,
        top: `${this.placeY * 100}%`,
        fontSize: `${48 * this.stageScale}px`,
      };
    },
  },
  watch: {
    modelValue: {
      deep: true,
      handler() {
        this.scheduleRedraw();
      },
    },
    tool(v) {
      if (v !== 'text') this.cancelText();
      if (v !== 'emoji') this.placingEmoji = null;
    },
  },
  mounted() {
    this.resize();
    this.scheduleRedraw();
    window.addEventListener('resize', this.resize);
    if (typeof ResizeObserver !== 'undefined' && this.$refs.root) {
      this.ro = new ResizeObserver(() => this.resize());
      this.ro.observe(this.$refs.root);
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resize);
    if (this.ro) {
      try { this.ro.disconnect(); } catch (e) { /* noop */ }
      this.ro = null;
    }
    if (this.raf) cancelAnimationFrame(this.raf);
  },
  methods: {
    resize() {
      const root = this.$refs.root;
      const canvas = this.$refs.canvas;
      if (!root || !canvas) return;
      const rect = root.getBoundingClientRect();
      const cssW = Math.max(1, rect.width);
      const cssH = Math.max(1, rect.height);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      this.cssW = cssW;
      this.cssH = cssH;
      this.dpr = dpr;
      canvas.width = Math.max(1, Math.round(cssW * dpr));
      canvas.height = Math.max(1, Math.round(cssH * dpr));
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      const ctx = canvas.getContext('2d');
      // Draw in CSS pixel space so pointer coords match strokes 1:1.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.stageScale = Math.min(cssW, cssH) / 360;
      this.scheduleRedraw();
    },
    scheduleRedraw() {
      if (this.raf) cancelAnimationFrame(this.raf);
      this.raf = requestAnimationFrame(() => {
        this.raf = 0;
        this.redraw();
      });
    },
    redraw() {
      const canvas = this.$refs.canvas;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      ctx.clearRect(0, 0, this.cssW, this.cssH);
      const layers = this.modelValue?.layers || [];
      rasterizePaintLayers(ctx, layers, this.cssW, this.cssH);
      if (this.currentStroke) {
        rasterizePaintLayers(ctx, [this.currentStroke], this.cssW, this.cssH);
      }
    },
    /** Normalize pointer to 0..1 against the overlay / canvas CSS box. */
    normPoint(e) {
      const el = this.$refs.canvas || this.$refs.root;
      if (!el) return { x: 0, y: 0 };
      const rect = el.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      return {
        x: Math.max(0, Math.min(1, (e.clientX - rect.left) / w)),
        y: Math.max(0, Math.min(1, (e.clientY - rect.top) / h)),
      };
    },
    emitState(next) {
      this.$emit('update:modelValue', next);
      this.$emit('drawing-change', next);
    },
    onPointerDown(e) {
      if (!this.enabled) return;
      if (this.tool === 'pen' || this.tool === 'eraser') {
        e.preventDefault();
        e.stopPropagation();
        const p = this.normPoint(e);
        this.drawing = true;
        this.currentStroke = {
          type: 'stroke',
          tool: this.tool,
          color: this.color,
          width: this.thickness,
          points: [p],
        };
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
        this.scheduleRedraw();
        return;
      }
      if (this.tool === 'text') {
        e.preventDefault();
        const p = this.normPoint(e);
        this.textDraft = { x: p.x, y: p.y, value: '', size: 28 };
        this.$nextTick(() => {
          const el = this.$refs.textInput;
          if (el) el.focus();
        });
        return;
      }
      if (this.tool === 'emoji') {
        e.preventDefault();
        const p = this.normPoint(e);
        const next = pushPaintLayer(this.modelValue, {
          type: 'emoji',
          emoji: this.emoji || '😀',
          x: p.x,
          y: p.y,
          size: 48,
        });
        this.emitState(next);
        this.scheduleRedraw();
      }
    },
    onPointerMove(e) {
      if (this.tool === 'emoji' && !this.drawing) {
        const p = this.normPoint(e);
        this.placeX = p.x;
        this.placeY = p.y;
        this.placingEmoji = this.emoji;
      }
      if (!this.drawing || !this.currentStroke) return;
      e.preventDefault();
      this.currentStroke.points.push(this.normPoint(e));
      this.scheduleRedraw();
    },
    onPointerUp() {
      if (!this.drawing || !this.currentStroke) {
        this.drawing = false;
        return;
      }
      const stroke = this.currentStroke;
      this.currentStroke = null;
      this.drawing = false;
      if (stroke.points?.length) {
        const next = pushPaintLayer(this.modelValue, stroke);
        this.emitState(next);
      }
      this.scheduleRedraw();
    },
    commitText() {
      if (!this.textDraft) return;
      const value = String(this.textDraft.value || '').trim();
      const draft = this.textDraft;
      this.textDraft = null;
      if (!value) return;
      const next = pushPaintLayer(this.modelValue, {
        type: 'text',
        text: value,
        x: draft.x,
        y: draft.y,
        color: this.color,
        size: draft.size || 28,
      });
      this.emitState(next);
      this.scheduleRedraw();
    },
    cancelText() {
      this.textDraft = null;
    },
  },
};
</script>

<style scoped>
.mp-root {
  position: absolute;
  inset: 0;
  z-index: 5;
  touch-action: none;
  cursor: crosshair;
  overflow: hidden;
}
.mp-canvas {
  position: absolute;
  inset: 0;
  display: block;
  pointer-events: none;
}
.mp-text-box {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 6;
  min-width: 8rem;
}
.mp-text-input {
  width: 100%;
  background: rgba(0, 0, 0, 0.35);
  border: 1.5px solid rgba(255, 255, 255, 0.55);
  border-radius: 10px;
  padding: 6px 10px;
  color: #fff;
  font-weight: 700;
  text-align: center;
  outline: none;
  backdrop-filter: blur(8px);
}
.mp-emoji-ghost {
  position: absolute;
  transform: translate(-50%, -50%);
  pointer-events: none;
  opacity: 0.7;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4));
  z-index: 6;
}
</style>
