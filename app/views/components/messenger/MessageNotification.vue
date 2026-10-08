<template>
  <div class="messenger-notif-layer pointer-events-none fixed inset-x-0 top-0 z-[120] flex flex-col items-center gap-2 px-3 pt-3">
    <transition-group name="notif-pop">
      <button
        v-for="n in notifications"
        :key="n.id"
        type="button"
        @click="$emit('open', n)"
        class="notif-card pointer-events-auto w-full max-w-md flex items-start gap-3 ps-3 pe-2 py-2.5 rounded-2xl bg-white/95 dark:bg-[#1e2c3a]/95 backdrop-blur shadow-xl ring-1 ring-black/5 dark:ring-white/10 text-start active:scale-[0.99] transition"
      >
        <MessengerAvatar :user="n.sender" :name="n.senderName" size="sm" class="mt-0.5" />
        <div class="flex-1 min-w-0">
          <div class="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">
            {{ n.senderName || $t('messenger.title') }}
          </div>
          <div class="notif-body text-[13px] text-gray-600 dark:text-gray-300 break-words">
            {{ n.body }}
          </div>
        </div>
        <span
          @click.stop="$emit('dismiss', n.id)"
          class="flex-shrink-0 p-1.5 -me-0.5 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition self-center"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </span>
      </button>
    </transition-group>
  </div>
</template>

<script>
import MessengerAvatar from './MessengerAvatar.vue';

export default {
  components: { MessengerAvatar },
  props: {
    notifications: { type: Array, default: () => [] },
    // Auto-dismiss delay in milliseconds.
    duration: { type: Number, default: 5000 },
  },
  emits: ['open', 'dismiss'],
  data() {
    return { timers: {} };
  },
  watch: {
    notifications: {
      immediate: true,
      handler(list) {
        const ids = new Set((list || []).map((n) => n.id));
        // Arm an auto-dismiss timer for any freshly added notification.
        (list || []).forEach((n) => {
          if (this.timers[n.id]) return;
          this.timers[n.id] = setTimeout(() => {
            this.$emit('dismiss', n.id);
          }, this.duration);
        });
        // Clear timers for notifications that are gone.
        Object.keys(this.timers).forEach((id) => {
          if (!ids.has(id)) {
            clearTimeout(this.timers[id]);
            delete this.timers[id];
          }
        });
      },
    },
  },
  beforeUnmount() {
    Object.values(this.timers).forEach((t) => clearTimeout(t));
    this.timers = {};
  },
};
</script>

<style scoped>
/* Clamp the preview to a maximum of two lines. */
.notif-body {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.35;
}
.notif-pop-enter-active,
.notif-pop-leave-active {
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.notif-pop-enter-from,
.notif-pop-leave-to {
  opacity: 0;
  transform: translateY(-18px) scale(0.96);
}
.notif-pop-move {
  transition: transform 0.25s ease;
}
</style>
