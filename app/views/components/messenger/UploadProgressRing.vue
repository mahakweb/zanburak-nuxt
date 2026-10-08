<template>
  <button
    v-if="cancelable"
    type="button"
    class="up-ring"
    :class="[`up-ring--${size}`, indeterminate ? 'is-indeterminate' : '', 'is-cancelable']"
    :aria-valuenow="safePercent"
    role="progressbar"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="cancelLabel || 'Cancel upload'"
    :title="cancelLabel || 'Cancel upload'"
    @click.stop.prevent="$emit('cancel')"
  >
    <svg class="up-ring-svg" viewBox="0 0 36 36" aria-hidden="true">
      <circle class="up-ring-track" cx="18" cy="18" :r="radius" fill="none" :stroke-width="stroke" />
      <circle
        class="up-ring-prog"
        cx="18"
        cy="18"
        :r="radius"
        fill="none"
        :stroke-width="stroke"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        stroke-linecap="round"
      />
    </svg>
    <span v-if="stopIcon" class="up-ring-stop" aria-hidden="true" />
    <span v-else-if="!indeterminate" class="up-ring-label">{{ percentLabel }}</span>
    <span v-else class="up-ring-x" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18" />
      </svg>
    </span>
  </button>
  <div
    v-else
    class="up-ring"
    :class="[`up-ring--${size}`, indeterminate ? 'is-indeterminate' : '']"
    :aria-valuenow="safePercent"
    role="progressbar"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <svg class="up-ring-svg" viewBox="0 0 36 36" aria-hidden="true">
      <circle class="up-ring-track" cx="18" cy="18" :r="radius" fill="none" :stroke-width="stroke" />
      <circle
        class="up-ring-prog"
        cx="18"
        cy="18"
        :r="radius"
        fill="none"
        :stroke-width="stroke"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        stroke-linecap="round"
      />
    </svg>
    <span class="up-ring-label">{{ percentLabel }}</span>
  </div>
</template>

<script>
import { shapeUiDigits } from './appearance';

export default {
  name: 'UploadProgressRing',
  props: {
    percent: { type: Number, default: 0 },
    /** xs | sm | md */
    size: { type: String, default: 'sm' },
    cancelable: { type: Boolean, default: false },
    cancelLabel: { type: String, default: '' },
    /** Telegram-style: square stop in the center instead of percent / X. */
    stopIcon: { type: Boolean, default: false },
  },
  emits: ['cancel'],
  computed: {
    safePercent() {
      const n = Number(this.percent);
      if (!Number.isFinite(n)) return 0;
      return Math.max(0, Math.min(99, Math.round(n)));
    },
    indeterminate() {
      return this.safePercent <= 0;
    },
    percentLabel() {
      const raw = this.size === 'xs' ? String(this.safePercent) : `${this.safePercent}%`;
      return shapeUiDigits(raw, 'meta');
    },
    radius() {
      if (this.size === 'xs') return 14.2;
      if (this.size === 'md') return 15.2;
      return 14.8;
    },
    stroke() {
      if (this.size === 'xs') return 2.6;
      if (this.size === 'md') return 2.9;
      return 2.75;
    },
    circumference() {
      return 2 * Math.PI * this.radius;
    },
    dashOffset() {
      if (this.indeterminate) return this.circumference * 0.72;
      return this.circumference * (1 - this.safePercent / 100);
    },
  },
};
</script>

<style scoped>
.up-ring {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: rgba(28, 28, 30, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(12px) saturate(1.15);
  -webkit-backdrop-filter: blur(12px) saturate(1.15);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04), 0 6px 20px rgba(0, 0, 0, 0.25);
  appearance: none;
  overflow: hidden;
}
.up-ring--md {
  width: 40px;
  height: 40px;
}
.up-ring--sm {
  width: 34px;
  height: 34px;
}
.up-ring--xs {
  width: 28px;
  height: 28px;
}
.up-ring.is-cancelable {
  cursor: pointer;
}
.up-ring.is-cancelable:hover .up-ring-prog,
.up-ring.is-cancelable:focus-visible .up-ring-prog {
  stroke: #fecaca;
}
.up-ring-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
  pointer-events: none;
}
.up-ring.is-indeterminate .up-ring-svg {
  animation: up-ring-spin 0.85s linear infinite;
}
.up-ring-track {
  stroke: rgba(255, 255, 255, 0.22);
}
.up-ring-prog {
  stroke: #fff;
  transition: stroke-dashoffset 0.12s linear, stroke 0.15s ease;
}
.up-ring-label {
  position: relative;
  z-index: 1;
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  line-height: 1;
  direction: ltr;
  letter-spacing: -0.02em;
  font-family: var(--msg-font-meta);
}
.up-ring--md .up-ring-label {
  font-size: 10px;
}
.up-ring--xs .up-ring-label {
  font-size: 8px;
}
.up-ring-x {
  position: relative;
  z-index: 1;
  display: flex;
  color: #fff;
  width: 38%;
  height: 38%;
}
.up-ring-x svg {
  width: 100%;
  height: 100%;
}
.up-ring-stop {
  position: relative;
  z-index: 1;
  width: 28%;
  height: 28%;
  border-radius: 2.5px;
  background: #fff;
}
@keyframes up-ring-spin {
  to { transform: rotate(270deg); }
}
</style>
