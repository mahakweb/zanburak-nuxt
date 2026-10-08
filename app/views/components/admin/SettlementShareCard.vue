<template>
  <!-- نوار مینیمال فرم تسویه -->
  <div v-if="variant === 'strip'" class="strip" @mouseenter="open = true" @mouseleave="open = false">
    <div class="strip__flow">
      <div class="strip__item" title="مبلغ اصلی">
        <span class="strip__ico strip__ico--base">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="6" width="18" height="12" rx="2.5"/><path d="M3 10h18M7 14h2"/></svg>
        </span>
        <span class="strip__num font-anjoman">{{ formatCurrency(gross) }}</span>
      </div>
      <span class="strip__sep" aria-hidden="true">→</span>
      <div class="strip__item strip__item--cut" :title="'کسر سایت ' + formatPercent(sitePercent) + '٪'">
        <span class="strip__ico strip__ico--cut">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="8"/><path d="M8 12h8"/></svg>
        </span>
        <span class="strip__num font-anjoman">−{{ formatCurrency(platform) }}</span>
        <span class="strip__pct">{{ formatPercent(sitePercent) }}٪</span>
      </div>
      <span class="strip__sep" aria-hidden="true">→</span>
      <div class="strip__item strip__item--pay" :title="'واریز ' + payoutLabel">
        <span class="strip__ico strip__ico--pay">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3v12m0 0l-3.5-3.5M12 15l3.5-3.5"/><path d="M5 19h14"/></svg>
        </span>
        <span class="strip__num font-anjoman">{{ formatCurrency(teacher) }}</span>
        <span class="strip__pct strip__pct--pay">{{ formatPercent(teacherPercent) }}٪</span>
      </div>
    </div>
    <div class="share-tip">
      <button type="button" class="share-tip__btn" :aria-expanded="open ? 'true' : 'false'" aria-label="توضیح" @click.stop="open = !open">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3a5.5 5.5 0 00-3.2 10l.2 1.2h6l.2-1.2A5.5 5.5 0 0012 3z"/><path stroke-linecap="round" stroke-linejoin="round" d="M10 17h4M11 20h2"/></svg>
      </button>
      <div v-if="open" class="share-tip__panel" role="tooltip">
        <p class="share-tip__title">{{ explainTitle }}</p>
        <ul class="share-tip__list">
          <li v-for="(line, idx) in explainLines" :key="idx">{{ line }}</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- کارت کامل برای تنظیمات / جزئیات -->
  <div v-else class="preview">
    <div class="preview__head">
      <div class="min-w-0">
        <p v-if="eyebrow" class="preview__eyebrow">{{ eyebrow }}</p>
        <p class="preview__title">{{ title || 'محاسبه سهم' }}</p>
      </div>
      <div class="share-tip" @mouseenter="open = true" @mouseleave="open = false">
        <button type="button" class="share-tip__btn share-tip__btn--lg" :aria-expanded="open ? 'true' : 'false'" aria-label="توضیح" @click.stop="open = !open">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3a5.5 5.5 0 00-3.2 10l.2 1.2h6l.2-1.2A5.5 5.5 0 0012 3z"/><path stroke-linecap="round" stroke-linejoin="round" d="M10 17h4M11 20h2"/></svg>
        </button>
        <div v-if="open" class="share-tip__panel" role="tooltip">
          <p class="share-tip__title">{{ explainTitle }}</p>
          <ul class="share-tip__list">
            <li v-for="(line, idx) in explainLines" :key="idx">{{ line }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="preview__hero">
      <div class="preview__ring" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="48" class="preview__track"/>
          <circle cx="60" cy="60" r="48" class="preview__arc preview__arc--pay" :stroke-dasharray="payDash" stroke-dashoffset="0"/>
          <circle cx="60" cy="60" r="48" class="preview__arc preview__arc--cut" :stroke-dasharray="cutDash" :stroke-dashoffset="-payLen"/>
        </svg>
        <div class="preview__ring-center">
          <span class="preview__ring-label">واریز</span>
          <span class="preview__ring-pct font-anjoman">{{ formatPercent(teacherPercent) }}٪</span>
        </div>
      </div>
      <div class="preview__legend">
        <div class="preview__legend-row">
          <span class="dot dot--pay"></span>
          <span>{{ payoutLabel }}</span>
          <strong class="font-anjoman">{{ formatPercent(teacherPercent) }}٪</strong>
        </div>
        <div class="preview__legend-row">
          <span class="dot dot--cut"></span>
          <span>سایت</span>
          <strong class="font-anjoman">{{ formatPercent(sitePercent) }}٪</strong>
        </div>
      </div>
    </div>

    <div class="preview__cards">
      <div class="tile">
        <span class="tile__ico tile__ico--base">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="6" width="18" height="12" rx="2.5"/><path d="M3 10h18M7 14h2"/></svg>
        </span>
        <div>
          <p class="tile__label">مبلغ اصلی</p>
          <p class="tile__value font-anjoman">{{ formatCurrency(gross) }} <small>تومان</small></p>
        </div>
      </div>
      <div class="tile tile--cut">
        <span class="tile__ico tile__ico--cut">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="8"/><path d="M8 12h8"/></svg>
        </span>
        <div>
          <p class="tile__label">کسر سایت · {{ formatPercent(sitePercent) }}٪</p>
          <p class="tile__value font-anjoman">−{{ formatCurrency(platform) }} <small>تومان</small></p>
        </div>
      </div>
      <div class="tile tile--pay">
        <span class="tile__ico tile__ico--pay">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3v12m0 0l-3.5-3.5M12 15l3.5-3.5"/><path d="M5 19h14"/></svg>
        </span>
        <div>
          <p class="tile__label">واریز {{ payoutLabel }} · {{ formatPercent(teacherPercent) }}٪</p>
          <p class="tile__value font-anjoman">{{ formatCurrency(teacher) }} <small>تومان</small></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const CIRC = 2 * Math.PI * 48;

export default {
  name: "SettlementShareCard",
  props: {
    grossAmount: { type: [Number, String], default: 0 },
    platformAmount: { type: [Number, String], default: 0 },
    teacherAmount: { type: [Number, String], default: 0 },
    sitePercent: { type: [Number, String], default: 0 },
    teacherPercent: { type: [Number, String], default: 100 },
    explain: { type: Object, default: null },
    payoutLabel: { type: String, default: "مدرس" },
    eyebrow: { type: String, default: "" },
    title: { type: String, default: "" },
    compact: { type: Boolean, default: false },
    showBar: { type: Boolean, default: true },
    variant: { type: String, default: "card" },
  },
  data() {
    return { open: false };
  },
  computed: {
    gross() { return Number(this.grossAmount || 0); },
    platform() { return Number(this.platformAmount || 0); },
    teacher() { return Number(this.teacherAmount || 0); },
    explainTitle() { return this.explain?.title || "نحوه محاسبه سهم تسویه"; },
    explainLines() {
      if (Array.isArray(this.explain?.lines) && this.explain.lines.length) return this.explain.lines;
      return [
        "مبلغ پایه همان مبلغ نهایی فروش بعد از تخفیف است.",
        "کارمزد درگاه جزو سهم مدرس یا سایت نیست.",
        `از مبلغ پایه، ${this.formatPercent(this.sitePercent)}٪ سهم سایت و ${this.formatPercent(this.teacherPercent)}٪ سهم ${this.payoutLabel} است.`,
        "مبلغ واریزی همان سهم دریافت‌کننده است؛ مابقی سهم پلتفرم است.",
      ];
    },
    payLen() {
      return (Math.max(0, Math.min(100, Number(this.teacherPercent) || 0)) / 100) * CIRC;
    },
    cutLen() {
      return CIRC - this.payLen;
    },
    payDash() {
      return `${this.payLen} ${CIRC}`;
    },
    cutDash() {
      return `${this.cutLen} ${CIRC}`;
    },
  },
  methods: {
    formatCurrency(value) {
      return Number(value || 0).toLocaleString("fa-IR");
    },
    formatPercent(value) {
      const n = Number(value || 0);
      return Number.isInteger(n) ? String(n) : n.toLocaleString("fa-IR", { maximumFractionDigits: 2 });
    },
  },
};
</script>

<style scoped>
/* —— strip (فرم) —— */
.strip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.55rem;
  border-radius: 0.85rem;
  border: 1px solid rgba(251, 191, 36, 0.28);
  background: linear-gradient(105deg, rgba(251, 191, 36, 0.07), rgba(16, 185, 129, 0.05));
}
.dark .strip {
  border-color: rgba(251, 191, 36, 0.2);
  background: linear-gradient(105deg, rgba(251, 191, 36, 0.09), rgba(16, 185, 129, 0.06));
}
.strip__flow {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 0.35rem;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
}
.strip__flow::-webkit-scrollbar { display: none; }
.strip__item {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  white-space: nowrap;
}
.strip__ico {
  width: 1.45rem;
  height: 1.45rem;
  border-radius: 0.45rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.strip__ico svg { width: 0.85rem; height: 0.85rem; }
.strip__ico--base { background: rgba(107, 114, 128, 0.12); color: #4b5563; }
.dark .strip__ico--base { background: rgba(156, 163, 175, 0.14); color: #d1d5db; }
.strip__ico--cut { background: rgba(244, 63, 94, 0.12); color: #e11d48; }
.dark .strip__ico--cut { color: #fb7185; }
.strip__ico--pay { background: rgba(16, 185, 129, 0.14); color: #047857; }
.dark .strip__ico--pay { color: #34d399; }
.strip__num {
  font-size: 0.78rem;
  font-weight: 700;
  color: #111827;
}
.dark .strip__num { color: #f9fafb; }
.strip__item--cut .strip__num { color: #e11d48; }
.dark .strip__item--cut .strip__num { color: #fb7185; }
.strip__item--pay .strip__num { color: #047857; }
.dark .strip__item--pay .strip__num { color: #34d399; }
.strip__pct {
  font-size: 9px;
  font-weight: 700;
  padding: 0.1rem 0.3rem;
  border-radius: 999px;
  background: rgba(244, 63, 94, 0.1);
  color: #be123c;
}
.strip__pct--pay {
  background: rgba(16, 185, 129, 0.12);
  color: #047857;
}
.dark .strip__pct { color: #fda4af; }
.dark .strip__pct--pay { color: #6ee7b7; }
.strip__sep {
  color: #d1d5db;
  font-size: 0.7rem;
  flex-shrink: 0;
}
.dark .strip__sep { color: #4b5563; }

/* —— preview card —— */
.preview {
  border-radius: 1.25rem;
  border: 1px solid rgba(229, 231, 235, 0.95);
  background: #fff;
  padding: 1.1rem 1.15rem 1.2rem;
  height: 100%;
}
.dark .preview {
  border-color: rgba(55, 65, 81, 0.95);
  background: #111827;
}
.preview__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.preview__eyebrow {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #b45309;
}
.dark .preview__eyebrow { color: #fbbf24; }
.preview__title {
  margin-top: 0.15rem;
  font-size: 0.95rem;
  font-weight: 800;
  color: #111827;
}
.dark .preview__title { color: #f9fafb; }
.preview__hero {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
.preview__ring {
  position: relative;
  width: 7.5rem;
  height: 7.5rem;
  flex-shrink: 0;
}
.preview__ring svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.preview__track {
  fill: none;
  stroke: #f3f4f6;
  stroke-width: 10;
}
.dark .preview__track { stroke: #1f2937; }
.preview__arc {
  fill: none;
  stroke-width: 10;
  stroke-linecap: round;
  transition: stroke-dasharray 0.35s ease, stroke-dashoffset 0.35s ease;
}
.preview__arc--pay { stroke: #34d399; }
.preview__arc--cut { stroke: #fb7185; }
.preview__ring-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.preview__ring-label {
  font-size: 10px;
  font-weight: 600;
  color: #9ca3af;
}
.preview__ring-pct {
  font-size: 1.15rem;
  font-weight: 800;
  color: #047857;
  line-height: 1.2;
}
.dark .preview__ring-pct { color: #34d399; }
.preview__legend {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}
.preview__legend-row {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.75rem;
  color: #6b7280;
}
.dark .preview__legend-row { color: #9ca3af; }
.preview__legend-row strong {
  margin-inline-start: auto;
  color: #111827;
  font-size: 0.8rem;
}
.dark .preview__legend-row strong { color: #f3f4f6; }
.dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  flex-shrink: 0;
}
.dot--pay { background: #34d399; }
.dot--cut { background: #fb7185; }
.preview__cards {
  display: grid;
  gap: 0.5rem;
}
.tile {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.7rem 0.8rem;
  border-radius: 0.9rem;
  background: #f9fafb;
  border: 1px solid #f3f4f6;
}
.dark .tile {
  background: rgba(31, 41, 55, 0.55);
  border-color: rgba(55, 65, 81, 0.8);
}
.tile--cut { border-color: rgba(244, 63, 94, 0.18); }
.tile--pay { border-color: rgba(16, 185, 129, 0.22); }
.tile__ico {
  width: 2.15rem;
  height: 2.15rem;
  border-radius: 0.7rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.tile__ico svg { width: 1.05rem; height: 1.05rem; }
.tile__ico--base { background: rgba(107, 114, 128, 0.12); color: #4b5563; }
.dark .tile__ico--base { color: #d1d5db; }
.tile__ico--cut { background: rgba(244, 63, 94, 0.12); color: #e11d48; }
.dark .tile__ico--cut { color: #fb7185; }
.tile__ico--pay { background: rgba(16, 185, 129, 0.14); color: #047857; }
.dark .tile__ico--pay { color: #34d399; }
.tile__label {
  font-size: 10px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.1rem;
}
.dark .tile__label { color: #9ca3af; }
.tile__value {
  font-size: 0.95rem;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
}
.dark .tile__value { color: #fff; }
.tile--cut .tile__value { color: #e11d48; }
.dark .tile--cut .tile__value { color: #fb7185; }
.tile--pay .tile__value { color: #047857; }
.dark .tile--pay .tile__value { color: #34d399; }
.tile__value small {
  font-size: 10px;
  font-weight: 600;
  color: #9ca3af;
  margin-inline-start: 0.15rem;
}

/* tip */
.share-tip { position: relative; flex-shrink: 0; }
.share-tip__btn {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #92400e;
  background: rgba(251, 191, 36, 0.22);
}
.share-tip__btn svg { width: 0.8rem; height: 0.8rem; }
.share-tip__btn--lg {
  width: 1.85rem;
  height: 1.85rem;
}
.share-tip__btn--lg svg { width: 0.95rem; height: 0.95rem; }
.share-tip__btn:hover { background: rgba(251, 191, 36, 0.4); }
.dark .share-tip__btn { color: #fde68a; background: rgba(251, 191, 36, 0.16); }
.share-tip__panel {
  position: absolute;
  inset-inline-end: 0;
  top: calc(100% + 0.35rem);
  z-index: 30;
  width: min(16.5rem, 76vw);
  border-radius: 0.75rem;
  padding: 0.65rem 0.75rem;
  background: #111827;
  color: #f9fafb;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.32);
}
.share-tip__title {
  font-size: 0.7rem;
  font-weight: 700;
  margin-bottom: 0.35rem;
  color: #fbbf24;
}
.share-tip__list {
  margin: 0;
  padding-inline-start: 0.9rem;
  display: grid;
  gap: 0.28rem;
  font-size: 10px;
  line-height: 1.55;
  color: #e5e7eb;
}
</style>
