<template>
  <div
    class="flip-clock"
    :style="{
      '--flip-main': mainColor,
      '--flip-label': labelColor,
      '--flip-bg': mainFlipBackgroundColor,
      '--flip-second': resolvedSecondFlipColor,
      '--flip-second-bg': secondFlipBackgroundColor,
    }"
  >
    <span
      v-for="unit in timeData"
      v-show="unit.show"
      :key="unit.key"
      class="flip-clock__piece"
      :class="{ flip: unit.flipping, 'is-wide': unit.wide }"
    >
      <div v-if="flipAnimation">
        <span
          class="flip-clock__card flip-card"
          :style="countdownSize ? { fontSize: countdownSize } : null"
        >
          <b class="flip-card__top">{{ twoDigits(unit.current) }}</b>
          <b class="flip-card__bottom" :data-value="twoDigits(unit.current)" />
          <b class="flip-card__back" :data-value="twoDigits(unit.previous)" />
          <b class="flip-card__back-bottom" :data-value="twoDigits(unit.previous)" />
        </span>
      </div>
      <div v-else>
        <span class="no-animation__card">{{ twoDigits(unit.current) }}</span>
      </div>
      <span
        v-if="showLabels"
        class="flip-clock__slot"
        :style="labelSize ? { fontSize: labelSize } : null"
      >
        {{ unit.label }}
      </span>
    </span>
  </div>
</template>

<script>
const DEFAULT_LABELS = {
  days: 'Days',
  hours: 'Hours',
  minutes: 'Minutes',
  seconds: 'Seconds',
}

function parseDeadlineMs(deadline, deadlineISO, deadlineDate) {
  if (deadlineDate) {
    const fromDate = new Date(deadlineDate).getTime()
    if (!Number.isNaN(fromDate)) return fromDate
  }
  if (deadlineISO) {
    const fromIso = Date.parse(deadlineISO)
    if (!Number.isNaN(fromIso)) return fromIso
  }
  if (deadline == null || deadline === '') {
    return Date.now() + 32 * 86400 * 1000 + 10 * 1000
  }
  if (typeof deadline === 'number') {
    return deadline < 1e12 ? deadline * 1000 : deadline
  }
  const raw = String(deadline).trim()
  if (/^\d+$/.test(raw)) {
    const n = Number(raw)
    return n < 1e12 ? n * 1000 : n
  }
  const normalized = raw.includes('T') ? raw : raw.replace(' ', 'T')
  const parsed = Date.parse(normalized)
  if (!Number.isNaN(parsed)) return parsed
  const fallback = Date.parse(raw)
  return Number.isNaN(fallback) ? Date.now() : fallback
}

function twoDigits(value) {
  const n = value == null ? 0 : Number(value)
  if (!Number.isFinite(n)) return '00'
  return String(Math.max(0, Math.trunc(n))).padStart(2, '0')
}

export default {
  name: 'vue3-flip-countdown',
  emits: ['timeElapsed'],
  props: {
    deadline: { type: [String, Number], default: '' },
    deadlineISO: { type: String, default: '' },
    deadlineDate: { type: [Date, String, Number], default: null },
    countdownSize: { type: String, default: '' },
    labelSize: { type: String, default: '' },
    stop: { type: Boolean, default: false },
    flipAnimation: { type: Boolean, default: true },
    showDays: { type: Boolean, default: true },
    showHours: { type: Boolean, default: true },
    showMinutes: { type: Boolean, default: true },
    showSeconds: { type: Boolean, default: true },
    showLabels: { type: Boolean, default: true },
    labels: {
      type: Object,
      default: () => ({ ...DEFAULT_LABELS }),
    },
    mainColor: { type: String, default: '#EC685C' },
    secondFlipColor: { type: String, default: '' },
    mainFlipBackgroundColor: { type: String, default: '#222222' },
    secondFlipBackgroundColor: { type: String, default: '#393939' },
    labelColor: { type: String, default: '#222222' },
  },
  data() {
    const labels = { ...DEFAULT_LABELS, ...(this.labels || {}) }
    return {
      intervalId: null,
      elapsedEmitted: false,
      timeData: [
        { key: 'days', current: 0, previous: 0, flipping: false, wide: false, label: labels.days, show: this.showDays },
        { key: 'hours', current: 0, previous: 0, flipping: false, wide: false, label: labels.hours, show: this.showHours },
        { key: 'minutes', current: 0, previous: 0, flipping: false, wide: false, label: labels.minutes, show: this.showMinutes },
        { key: 'seconds', current: 0, previous: 0, flipping: false, wide: false, label: labels.seconds, show: this.showSeconds },
      ],
    }
  },
  computed: {
    resolvedSecondFlipColor() {
      return this.secondFlipColor || this.mainColor
    },
  },
  watch: {
    deadline: 'tick',
    deadlineISO: 'tick',
    deadlineDate: 'tick',
    stop(value) {
      if (value) this.clearTimer()
      else this.startTimer()
    },
    labels: {
      deep: true,
      handler(value) {
        const labels = { ...DEFAULT_LABELS, ...(value || {}) }
        this.timeData[0].label = labels.days
        this.timeData[1].label = labels.hours
        this.timeData[2].label = labels.minutes
        this.timeData[3].label = labels.seconds
      },
    },
  },
  mounted() {
    this.tick()
    this.startTimer()
  },
  beforeUnmount() {
    this.clearTimer()
  },
  methods: {
    twoDigits,
    remainingParts() {
      const end = parseDeadlineMs(this.deadline, this.deadlineISO, this.deadlineDate)
      const total = Math.max(0, Math.trunc((end - Date.now()) / 1000))
      return {
        total,
        days: Math.floor(total / 86400),
        hours: Math.floor((total % 86400) / 3600),
        minutes: Math.floor((total % 3600) / 60),
        seconds: total % 60,
      }
    },
    updateUnit(index, next) {
      const unit = this.timeData[index]
      const value = next < 0 ? 0 : next
      if (value === unit.current) {
        unit.wide = unit.key === 'days' && value >= 1000
        return
      }
      unit.previous = unit.current
      unit.current = value
      unit.wide = unit.key === 'days' && value >= 1000
      if (!this.flipAnimation) return
      unit.flipping = false
      this.$nextTick(() => {
        void unit.current
        unit.flipping = true
        window.setTimeout(() => {
          unit.flipping = false
        }, 650)
      })
    },
    tick() {
      const parts = this.remainingParts()
      this.updateUnit(0, parts.days)
      this.updateUnit(1, parts.hours)
      this.updateUnit(2, parts.minutes)
      this.updateUnit(3, parts.seconds)
      if (parts.total <= 0 && !this.elapsedEmitted) {
        this.elapsedEmitted = true
        this.$emit('timeElapsed')
        this.clearTimer()
      }
    },
    startTimer() {
      this.clearTimer()
      if (this.stop) return
      this.intervalId = window.setInterval(() => this.tick(), 1000)
    },
    clearTimer() {
      if (this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = null
      }
    },
  },
}
</script>

<style scoped>
.no-animation__card {
  font-weight: 500;
  font-size: 2rem;
  line-height: 1.5;
  display: block;
  color: var(--flip-main);
}

.flip-clock {
  text-align: center;
  perspective: 600px;
  margin: 0 auto;
}

.flip-clock,
.flip-clock *,
.flip-clock :after,
.flip-clock :before {
  box-sizing: border-box;
}

.flip-clock__piece {
  display: inline-block;
  margin: 0 0.2vw;
}

@media (min-width: 1000px) {
  .flip-clock__piece {
    margin: 0 5px;
  }
}

.flip-clock__slot {
  font-size: 1rem;
  line-height: 1.5;
  display: block;
  color: var(--flip-label);
}

.flip-card {
  display: block;
  position: relative;
  padding-bottom: 0.72em;
  font-size: 2.25rem;
  line-height: 0.95;
}

@media (min-width: 1000px) {
  .flip-clock__slot {
    font-size: 1.2rem;
  }

  .flip-card {
    font-size: 3rem;
  }
}

.flip-card__top,
.flip-card__bottom,
.flip-card__back,
.flip-card__back:before,
.flip-card__back:after,
.flip-card__back-bottom {
  display: block;
  color: var(--flip-main);
  background: var(--flip-bg);
  padding: 0.23em 0.15em 0.4em;
  border-radius: 0.15em 0.15em 0 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform-style: preserve-3d;
  width: 2.1em;
  height: 0.72em;
}

.is-wide .flip-card__top,
.is-wide .flip-card__bottom,
.is-wide .flip-card__back,
.is-wide .flip-card__back:before,
.is-wide .flip-card__back:after,
.is-wide .flip-card__back-bottom {
  width: 2.65em;
}

.flip-card__bottom,
.flip-card__back-bottom {
  color: var(--flip-second, var(--flip-main));
  position: absolute;
  top: 50%;
  left: 0;
  border-top: 1px solid #000;
  background: var(--flip-second-bg);
  border-radius: 0 0 0.15em 0.15em;
  pointer-events: none;
  overflow: hidden;
  z-index: 2;
}

.flip-card__back-bottom {
  z-index: 1;
}

.flip-card__bottom:after,
.flip-card__back-bottom:after {
  display: block;
  margin-top: -0.72em;
  content: attr(data-value);
}

.flip-card__back {
  position: absolute;
  top: 0;
  height: 100%;
  left: 0;
  pointer-events: none;
}

.flip-card__back:before {
  content: attr(data-value);
  position: relative;
  overflow: hidden;
  z-index: -1;
}

.flip .flip-card__back:before {
  z-index: 1;
  animation: flip-top 0.3s cubic-bezier(0.37, 0.01, 0.94, 0.35);
  animation-fill-mode: both;
  transform-origin: center bottom;
}

.flip .flip-card__bottom {
  transform-origin: center top;
  animation: flip-bottom 0.6s cubic-bezier(0.15, 0.45, 0.28, 1);
  animation-fill-mode: both;
}

@keyframes flip-top {
  0% {
    transform: rotateX(0deg);
    z-index: 2;
    opacity: 1;
  }
  99% {
    opacity: 1;
  }
  to {
    transform: rotateX(-90deg);
    opacity: 0;
  }
}

@keyframes flip-bottom {
  0%,
  50% {
    z-index: -1;
    transform: rotateX(90deg);
    opacity: 0;
  }
  51% {
    opacity: 1;
  }
  to {
    opacity: 1;
    transform: rotateX(0deg);
    z-index: 5;
  }
}
</style>
