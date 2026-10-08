<template>
  <div class="empty-greet" aria-live="polite">
    <div class="empty-greet__glass">
      <p class="empty-greet__title">{{ $t('messenger.emptyChatTitle') }}</p>
      <p class="empty-greet__hint">{{ $t('messenger.emptyChatHint') }}</p>

      <button
        type="button"
        class="empty-greet__sticker"
        :class="`is-${variant.motion}`"
        :aria-label="$t('messenger.emptyChatSendGreeting')"
        @click="$emit('greet', variant)"
      >
        <span class="empty-greet__emoji" aria-hidden="true">{{ variant.emoji }}</span>
      </button>
    </div>
  </div>
</template>

<script>
/** Stable greeting variants — one pick per conversation id (Telegram-style). */
export const EMPTY_CHAT_GREETINGS = [
  { id: 0, emoji: '👋', stickerId: 'greet_wave', motion: 'wave' },
  { id: 1, emoji: '🦇', stickerId: 'greet_bat', motion: 'bob' },
  { id: 2, emoji: '🥳', stickerId: 'greet_party', motion: 'spin' },
  { id: 3, emoji: '💖', stickerId: 'greet_heart', motion: 'pulse' },
  { id: 4, emoji: '👍', stickerId: 'greet_thumb', motion: 'nod' },
  { id: 5, emoji: '✨', stickerId: 'greet_sparkle', motion: 'twinkle' },
  { id: 6, emoji: '🐰', stickerId: 'greet_bunny', motion: 'bob' },
];

export function greetingVariantForChat(conversationId) {
  const raw = String(conversationId ?? '0');
  let h = 2166136261;
  for (let i = 0; i < raw.length; i += 1) {
    h ^= raw.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const idx = Math.abs(h) % EMPTY_CHAT_GREETINGS.length;
  return EMPTY_CHAT_GREETINGS[idx];
}

export default {
  name: 'EmptyChatGreeting',
  props: {
    conversationId: { type: [Number, String], default: null },
  },
  emits: ['greet'],
  computed: {
    variant() {
      return greetingVariantForChat(this.conversationId);
    },
  },
};
</script>

<style scoped>
/* Fill the message viewport and center like Telegram Web */
.empty-greet {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  pointer-events: none;
  animation: empty-greet-in 0.35s var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1)) both;
}

.empty-greet__glass {
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(100%, 13.75rem);
  padding: 1.15rem 1.35rem 0.85rem;
  border-radius: 1.15rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.72);
  -webkit-backdrop-filter: blur(20px) saturate(1.35);
  backdrop-filter: blur(20px) saturate(1.35);
  box-shadow:
    0 8px 28px rgba(15, 23, 42, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

:global(.dark) .empty-greet__glass,
.dark .empty-greet__glass {
  /* Telegram empty-chat glass */
  background: rgba(33, 47, 61, 0.78);
  box-shadow:
    0 10px 32px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.empty-greet__title {
  margin: 0;
  max-width: 11.5rem;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: 0;
  color: #1f2937;
}

.dark .empty-greet__title {
  color: #ffffff;
}

.empty-greet__hint {
  margin: 0.4rem 0 0;
  max-width: 11.75rem;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.35;
  color: #707579;
}

.dark .empty-greet__hint {
  color: rgba(255, 255, 255, 0.72);
}

.empty-greet__sticker {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 7.5rem;
  height: 7.5rem;
  margin: 0.85rem 0 0.15rem;
  padding: 0;
  border: 0;
  background: transparent;
  border-radius: 1rem;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform 140ms var(--tg-ease-spring, cubic-bezier(0.34, 1.3, 0.64, 1));
}

.empty-greet__sticker:hover {
  transform: scale(1.04);
}

.empty-greet__sticker:active {
  transform: scale(0.94);
}

.empty-greet__emoji {
  display: block;
  font-size: 5.5rem;
  line-height: 1;
  user-select: none;
  font-family: "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.18));
  transform-origin: center bottom;
}

.empty-greet__sticker.is-wave .empty-greet__emoji {
  animation: greet-wave 1.6s ease-in-out infinite;
  transform-origin: 70% 90%;
}

.empty-greet__sticker.is-bob .empty-greet__emoji {
  animation: greet-bob 2.2s ease-in-out infinite;
}

.empty-greet__sticker.is-spin .empty-greet__emoji {
  animation: greet-spin 3.2s ease-in-out infinite;
}

.empty-greet__sticker.is-pulse .empty-greet__emoji {
  animation: greet-pulse 1.4s ease-in-out infinite;
}

.empty-greet__sticker.is-nod .empty-greet__emoji {
  animation: greet-nod 1.7s ease-in-out infinite;
  transform-origin: 50% 85%;
}

.empty-greet__sticker.is-twinkle .empty-greet__emoji {
  animation: greet-twinkle 1.5s ease-in-out infinite;
}

@keyframes empty-greet-in {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes greet-wave {
  0%,
  100% { transform: rotate(0deg); }
  20% { transform: rotate(16deg); }
  40% { transform: rotate(-8deg); }
  60% { transform: rotate(12deg); }
  80% { transform: rotate(-4deg); }
}

@keyframes greet-bob {
  0%,
  100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

@keyframes greet-spin {
  0%,
  100% { transform: rotate(-5deg) scale(1); }
  50% { transform: rotate(5deg) scale(1.05); }
}

@keyframes greet-pulse {
  0%,
  100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes greet-nod {
  0%,
  100% { transform: rotate(0deg) translateY(0); }
  35% { transform: rotate(-10deg) translateY(-3px); }
  70% { transform: rotate(6deg) translateY(1px); }
}

@keyframes greet-twinkle {
  0%,
  100% { transform: scale(1) rotate(0deg); filter: brightness(1); }
  50% { transform: scale(1.08) rotate(6deg); filter: brightness(1.12); }
}

@media (prefers-reduced-motion: reduce) {
  .empty-greet__emoji {
    animation: none !important;
  }
}
</style>
