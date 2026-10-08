<template>
  <div
    class="msk"
    :class="[`msk--${variant}`, { 'msk--card': withCard, 'msk--embedded': embedded }]"
    role="status"
    aria-busy="true"
    aria-live="polite"
  >
    <!-- Conversation list rows -->
    <template v-if="variant === 'conversations'">
      <div
        v-for="i in n"
        :key="'cv' + i"
        class="msk-person-row msk-person-row--md"
        :class="{ 'has-divider': i < n }"
      >
        <div class="msk-bone msk-avatar msk-avatar--md" />
        <div class="msk-person-body">
          <div class="msk-person-top">
            <div class="msk-bone msk-line" :style="lineStyle(0.38 + (i % 3) * 0.08)" />
            <div class="msk-bone msk-line msk-line--xs" style="width: 2.1rem" />
          </div>
          <div class="msk-bone msk-line msk-line--sm" :style="lineStyle(0.55 + (i % 4) * 0.07)" />
        </div>
      </div>
    </template>

    <!-- Contact / search / member person rows -->
    <template v-else-if="variant === 'contacts' || variant === 'users' || variant === 'members'">
      <div
        v-for="i in n"
        :key="'ct' + i"
        class="msk-person-row"
        :class="[
          variant === 'users' || variant === 'members' ? 'msk-person-row--sm' : 'msk-person-row--contact',
          { 'has-divider': i < n },
        ]"
      >
        <div
          class="msk-bone msk-avatar"
          :class="variant === 'users' ? 'msk-avatar--md' : 'msk-avatar--sm'"
        />
        <div class="msk-person-body">
          <div class="msk-bone msk-line" :style="lineStyle(0.34 + (i % 3) * 0.1)" />
          <div class="msk-bone msk-line msk-line--sm" :style="lineStyle(0.42 + (i % 4) * 0.08)" />
        </div>
      </div>
    </template>

    <!-- Blocked users (avatar + name + button stub) -->
    <template v-else-if="variant === 'blocked'">
      <div
        v-for="i in n"
        :key="'bl' + i"
        class="msk-person-row msk-person-row--blocked"
        :class="{ 'has-divider': i < n }"
      >
        <div class="msk-bone msk-avatar msk-avatar--md" />
        <div class="msk-person-body">
          <div class="msk-bone msk-line" :style="lineStyle(0.36 + (i % 3) * 0.09)" />
          <div class="msk-bone msk-line msk-line--sm" :style="lineStyle(0.28 + (i % 2) * 0.08)" />
        </div>
        <div class="msk-bone msk-chip" />
      </div>
    </template>

    <!-- Shared media grid -->
    <template v-else-if="variant === 'media-grid'">
      <div class="msk-grid">
        <div v-for="i in n" :key="'mg' + i" class="msk-bone msk-tile" />
      </div>
    </template>

    <!-- Shared media list (audio / voice / links) -->
    <template v-else-if="variant === 'media-list'">
      <div
        v-for="i in n"
        :key="'ml' + i"
        class="msk-media-row"
        :class="{ 'has-divider': i < n }"
      >
        <div class="msk-bone msk-media-icon" />
        <div class="msk-person-body">
          <div class="msk-bone msk-line" :style="lineStyle(0.48 + (i % 3) * 0.1)" />
          <div class="msk-bone msk-line msk-line--sm" :style="lineStyle(0.32 + (i % 2) * 0.1)" />
        </div>
      </div>
    </template>

    <!-- User profile hero + info -->
    <template v-else-if="variant === 'profile'">
      <div class="msk-profile-hero">
        <div class="msk-bone msk-avatar msk-avatar--xl" />
        <div class="msk-bone msk-line msk-line--title" />
        <div class="msk-bone msk-line msk-line--sm msk-line--center" style="width: 5.5rem" />
      </div>
      <div class="msk-profile-card">
        <div v-for="i in 3" :key="'pi' + i" class="msk-info-row" :class="{ 'has-divider': i < 3 }">
          <div class="msk-bone msk-info-icon" />
          <div class="msk-person-body">
            <div class="msk-bone msk-line" :style="lineStyle(0.4 + i * 0.08)" />
            <div class="msk-bone msk-line msk-line--xs" style="width: 3.2rem" />
          </div>
        </div>
      </div>
      <div class="msk-profile-card msk-profile-card--toggle">
        <div class="msk-bone msk-line" style="width: 7rem" />
        <div class="msk-bone msk-toggle" />
      </div>
    </template>

    <!-- Group / channel profile hero -->
    <template v-else-if="variant === 'group-profile'">
      <div class="msk-group-hero">
        <div class="msk-bone msk-cover" />
        <div class="msk-group-avatar-wrap">
          <div class="msk-bone msk-avatar msk-avatar--xl" />
        </div>
        <div class="msk-bone msk-line msk-line--title" />
        <div class="msk-bone msk-line msk-line--sm msk-line--center" style="width: 6.5rem" />
      </div>
      <div class="msk-profile-card msk-profile-card--toggle">
        <div class="msk-bone msk-line" style="width: 8rem" />
        <div class="msk-bone msk-chip" style="width: 5rem; height: 1.75rem; border-radius: 8px" />
      </div>
    </template>

    <!-- Chat message bubbles -->
    <template v-else-if="variant === 'messages'">
      <div class="msk-messages">
        <div
          v-for="(b, i) in messageLayout"
          :key="'msg' + i"
          class="msk-bubble-row"
          :class="b.mine ? 'is-mine' : 'is-theirs'"
        >
          <div class="msk-bone msk-bubble" :style="{ width: b.w }" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
const DEFAULT_COUNTS = {
  conversations: 9,
  contacts: 8,
  users: 5,
  members: 6,
  blocked: 5,
  'media-grid': 12,
  'media-list': 5,
  profile: 1,
  'group-profile': 1,
  messages: 6,
};

export default {
  name: 'MessengerSkeleton',
  props: {
    variant: {
      type: String,
      required: true,
      validator: (v) => Object.prototype.hasOwnProperty.call(DEFAULT_COUNTS, v),
    },
    count: { type: Number, default: null },
    withCard: { type: Boolean, default: false },
    embedded: { type: Boolean, default: false },
  },
  computed: {
    n() {
      if (this.count != null && this.count > 0) return this.count;
      return DEFAULT_COUNTS[this.variant] || 6;
    },
    messageLayout() {
      return [
        { mine: false, w: '58%' },
        { mine: false, w: '42%' },
        { mine: true, w: '48%' },
        { mine: false, w: '66%' },
        { mine: true, w: '38%' },
        { mine: true, w: '55%' },
        { mine: false, w: '44%' },
        { mine: true, w: '50%' },
      ].slice(0, this.n);
    },
  },
  methods: {
    lineStyle(fraction) {
      const pct = Math.round(Math.min(0.92, Math.max(0.22, fraction)) * 100);
      return { width: `${pct}%` };
    },
  },
};
</script>

<style scoped>
.msk {
  --msk-bone: #e4e7eb;
  --msk-bone-shine: rgba(255, 255, 255, 0.55);
  pointer-events: none;
  user-select: none;
}

:global(.dark) .msk,
.dark .msk {
  --msk-bone: rgba(255, 255, 255, 0.07);
  --msk-bone-shine: rgba(255, 255, 255, 0.12);
}

.msk--card {
  margin-left: 0.75rem;
  margin-right: 0.75rem;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}

:global(.dark) .msk--card,
.dark .msk--card {
  background: #17212b;
}

.msk-bone {
  background: linear-gradient(
    90deg,
    var(--msk-bone) 0%,
    var(--msk-bone) 40%,
    var(--msk-bone-shine) 50%,
    var(--msk-bone) 60%,
    var(--msk-bone) 100%
  );
  background-size: 200% 100%;
  animation: msk-shimmer 1.2s var(--tg-ease-standard, ease-in-out) infinite;
  border-radius: 6px;
  will-change: background-position;
}

.msk-avatar {
  flex-shrink: 0;
  border-radius: 9999px;
}

.msk-avatar--sm { width: 40px; height: 40px; }
.msk-avatar--md { width: 44px; height: 44px; }
.msk-avatar--xl { width: 112px; height: 112px; }

.msk-line {
  height: 11px;
  max-width: 100%;
  border-radius: 9999px;
}

.msk-line--sm { height: 9px; margin-top: 7px; opacity: 0.85; }
.msk-line--xs { height: 8px; opacity: 0.75; }
.msk-line--title {
  width: 8.5rem;
  height: 14px;
  margin-top: 1rem;
}
.msk-line--center { margin-left: auto; margin-right: auto; margin-top: 8px; }

.msk-person-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
}

.msk-person-row--md { padding: 7px 12px; gap: 10px; }
.msk-person-row--contact { padding: 6px 12px; gap: 10px; }
.msk-person-row--sm { padding: 8px 12px; gap: 10px; }
.msk-person-row--blocked { padding: 10px 16px; gap: 12px; }

.msk-person-row.has-divider {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

:global(.dark) .msk-person-row.has-divider,
.dark .msk-person-row.has-divider {
  border-bottom-color: rgba(255, 255, 255, 0.06);
}

.msk-person-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.msk-person-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.msk-chip {
  width: 3.6rem;
  height: 1.55rem;
  border-radius: 9999px;
  flex-shrink: 0;
}

.msk-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 2px;
  margin: 8px;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.06);
}

:global(.dark) .msk-grid,
.dark .msk-grid {
  background: rgba(255, 255, 255, 0.06);
}

.msk-tile {
  aspect-ratio: 1;
  border-radius: 0;
  animation-duration: 1.5s;
}

.msk-tile:nth-child(4n + 2) { animation-delay: 0.08s; }
.msk-tile:nth-child(4n + 3) { animation-delay: 0.16s; }
.msk-tile:nth-child(4n + 4) { animation-delay: 0.24s; }

.msk-media-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
}

.msk-media-row.has-divider {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

:global(.dark) .msk-media-row.has-divider,
.dark .msk-media-row.has-divider {
  border-bottom-color: rgba(255, 255, 255, 0.06);
}

.msk-media-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  flex-shrink: 0;
}

.msk-profile-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem 0.75rem;
}

.msk-profile-card {
  margin: 0 0.75rem 0.75rem;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}

:global(.dark) .msk-profile-card,
.dark .msk-profile-card {
  background: #17212b;
}

.msk-profile-card--toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
}

.msk-info-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
}

.msk-info-row.has-divider {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

:global(.dark) .msk-info-row.has-divider,
.dark .msk-info-row.has-divider {
  border-bottom-color: rgba(255, 255, 255, 0.06);
}

.msk-info-icon {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  margin-top: 2px;
  flex-shrink: 0;
}

.msk-toggle {
  width: 2.5rem;
  height: 1.35rem;
  border-radius: 9999px;
}

.msk-group-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.75rem;
}

.msk-cover {
  width: 100%;
  height: 9rem;
  border-radius: 0;
}

.msk-group-avatar-wrap {
  margin-top: -2.75rem;
  padding: 3px;
  border-radius: 9999px;
  background: #f4f4f5;
  position: relative;
  z-index: 1;
}

:global(.dark) .msk-group-avatar-wrap,
.dark .msk-group-avatar-wrap {
  background: #0e1621;
}

.msk-messages {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 12px;
  width: 100%;
  max-width: 42rem;
  margin: 0 auto;
}

.msk-bubble-row {
  display: flex;
  animation: msk-bubble-in 0.36s var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1)) both;
}

.msk-bubble-row:nth-child(1) { animation-delay: 0.02s; }
.msk-bubble-row:nth-child(2) { animation-delay: 0.05s; }
.msk-bubble-row:nth-child(3) { animation-delay: 0.08s; }
.msk-bubble-row:nth-child(4) { animation-delay: 0.11s; }
.msk-bubble-row:nth-child(5) { animation-delay: 0.14s; }
.msk-bubble-row:nth-child(6) { animation-delay: 0.17s; }
.msk-bubble-row:nth-child(7) { animation-delay: 0.2s; }
.msk-bubble-row:nth-child(8) { animation-delay: 0.23s; }

.msk-bubble-row.is-mine { justify-content: flex-end; }
.msk-bubble-row.is-theirs { justify-content: flex-start; }

.msk-bubble {
  height: 2.35rem;
  max-width: 75%;
  border-radius: 16px;
}

.msk-bubble-row.is-mine .msk-bubble {
  border-bottom-right-radius: 6px;
}

.msk-bubble-row.is-theirs .msk-bubble {
  border-bottom-left-radius: 6px;
}

.msk--embedded .msk-grid {
  margin: 0;
}

@keyframes msk-shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}

@keyframes msk-bubble-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .msk-bone {
    animation: none;
    background: var(--msk-bone);
    will-change: auto;
  }
  .msk-bubble-row {
    animation: none;
  }
}
</style>
