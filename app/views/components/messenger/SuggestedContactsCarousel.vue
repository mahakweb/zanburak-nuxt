<template>
  <div v-if="suggestions.length" class="suggested-wrap mx-3">
    <div class="suggested-glass">
      <p class="suggested-title">{{ $t('messenger.suggestedContacts') }}</p>
      <div
        ref="track"
        class="suggested-track"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      >
        <button
          v-for="item in suggestions"
          :key="item.id"
          type="button"
          class="suggested-item"
          :aria-label="item.label"
          @click="onClick(item)"
        >
          <MessengerAvatar
            :user="item.user"
            size="lg"
            :online="item.online"
            lazy
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import MessengerAvatar from './MessengerAvatar.vue';
import { isUserOnline } from '@/utils/messengerPresence';
import { peerDisplayName } from '@/utils/messengerPeerName';

const MAX_SUGGESTIONS = 10;
const DRAG_THRESHOLD = 6;

function lastSeenMs(user) {
  if (!user?.last_seen) return 0;
  const t = Date.parse(user.last_seen);
  return Number.isFinite(t) ? t : 0;
}

/**
 * Rank: registered synced contacts → recently active → mutual/favorite → others.
 */
export function buildSuggestedContacts({
  syncedRegistered = [],
  contacts = [],
  meId = null,
  limit = MAX_SUGGESTIONS,
} = {}) {
  const byId = new Map();

  const upsert = (user, meta = {}) => {
    if (!user?.id) return;
    if (meId != null && Number(user.id) === Number(meId)) return;
    const id = Number(user.id);
    const prev = byId.get(id);
    const next = {
      id,
      user: prev?.user ? { ...prev.user, ...user } : user,
      registered: !!(prev?.registered || meta.registered),
      mutual: !!(prev?.mutual || meta.mutual),
      favorite: !!(prev?.favorite || meta.favorite),
      name: meta.name || prev?.name || '',
    };
    byId.set(id, next);
  };

  (syncedRegistered || []).forEach((row) => {
    upsert(row?.user, { registered: true, name: row?.name || '' });
  });

  (contacts || []).forEach((ct) => {
    const u = ct?.contact_user;
    if (!u) return;
    upsert(u, {
      mutual: true,
      favorite: !!ct.is_favorite,
      name: ct.name || '',
    });
  });

  const ranked = [...byId.values()].sort((a, b) => {
    const aOnline = isUserOnline(a.user) ? 1 : 0;
    const bOnline = isUserOnline(b.user) ? 1 : 0;
    if (bOnline !== aOnline) return bOnline - aOnline;
    if (Number(b.registered) !== Number(a.registered)) {
      return Number(b.registered) - Number(a.registered);
    }
    if (Number(b.favorite) !== Number(a.favorite)) {
      return Number(b.favorite) - Number(a.favorite);
    }
    if (Number(b.mutual) !== Number(a.mutual)) {
      return Number(b.mutual) - Number(a.mutual);
    }
    return lastSeenMs(b.user) - lastSeenMs(a.user);
  });

  return ranked.slice(0, limit).map((row) => ({
    id: row.id,
    user: row.user,
    online: isUserOnline(row.user),
    label: peerDisplayName(row.user, row.name, ''),
  }));
}

export default {
  name: 'SuggestedContactsCarousel',
  components: { MessengerAvatar },
  props: {
    syncedRegistered: { type: Array, default: () => [] },
    contacts: { type: Array, default: () => [] },
    meId: { type: [Number, String], default: null },
  },
  emits: ['select'],
  data() {
    return {
      dragging: false,
      moved: false,
      startX: 0,
      startScroll: 0,
      pointerId: null,
      capturing: false,
    };
  },
  computed: {
    suggestions() {
      return buildSuggestedContacts({
        syncedRegistered: this.syncedRegistered,
        contacts: this.contacts,
        meId: this.meId,
        limit: MAX_SUGGESTIONS,
      });
    },
  },
  methods: {
    selectItem(item) {
      if (this.moved) return;
      if (item?.user) this.$emit('select', item.user);
    },
    onClick(item) {
      this.selectItem(item);
    },
    onPointerDown(e) {
      const el = this.$refs.track;
      if (!el || e.button === 2) return;
      // Touch/pen: native overflow scroll. Custom drag is for mouse only.
      if (e.pointerType && e.pointerType !== 'mouse') return;
      this.dragging = true;
      this.moved = false;
      this.capturing = false;
      this.startX = e.clientX;
      this.startScroll = el.scrollLeft;
      this.pointerId = e.pointerId;
    },
    onPointerMove(e) {
      if (!this.dragging) return;
      const el = this.$refs.track;
      if (!el) return;
      const dx = e.clientX - this.startX;
      if (Math.abs(dx) > DRAG_THRESHOLD) {
        this.moved = true;
        // Capture only after real drag so clicks still reach the avatar button.
        if (!this.capturing && this.pointerId != null) {
          this.capturing = true;
          try {
            el.setPointerCapture(this.pointerId);
          } catch {
            /* noop */
          }
          el.classList.add('is-dragging');
        }
      }
      if (this.moved) {
        el.scrollLeft = this.startScroll - dx;
      }
    },
    onPointerUp() {
      if (!this.dragging) return;
      const el = this.$refs.track;
      const wasMoved = this.moved;
      this.dragging = false;
      if (el) {
        el.classList.remove('is-dragging');
        if (this.capturing && this.pointerId != null) {
          try {
            el.releasePointerCapture(this.pointerId);
          } catch {
            /* noop */
          }
        }
      }
      this.capturing = false;
      this.pointerId = null;
      // Keep moved=true briefly so the click from pointerup is ignored after a drag.
      if (wasMoved) {
        requestAnimationFrame(() => {
          setTimeout(() => {
            this.moved = false;
          }, 40);
        });
      }
    },
  },
};
</script>

<style scoped>
.suggested-glass {
  padding: 1rem 0 1.1rem;
  border-radius: 1rem; /* 2xl */
  background: rgba(255, 255, 255, 0.5);
  -webkit-backdrop-filter: blur(22px) saturate(1.35);
  backdrop-filter: blur(22px) saturate(1.35);
  box-shadow: 0 8px 28px rgba(15, 23, 42, 0.05);
  animation: tg-empty-in var(--tg-dur-med, 220ms) var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1)) both;
}

:global(.dark) .suggested-glass,
.dark .suggested-glass {
  background: rgba(23, 33, 43, 0.58);
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.26);
}

.suggested-title {
  margin: 0 1rem 0.75rem;
  font-size: 13px;
  font-weight: 600;
  color: #3390ec;
}

.suggested-track {
  display: flex;
  gap: 0.85rem;
  padding: 0 1rem 2px;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x proximity;
  scroll-behavior: auto;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-x;
  cursor: grab;
  scrollbar-width: none;
  -ms-overflow-style: none;
  overscroll-behavior-x: contain;
  content-visibility: auto;
  contain: content;
}

.suggested-track::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

.suggested-track.is-dragging {
  cursor: grabbing;
  scroll-behavior: auto;
  user-select: none;
}

.suggested-item {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  margin: 0;
  border: 0;
  background: transparent;
  scroll-snap-align: start;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  transition: transform 120ms var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1));
}

.suggested-item:active {
  transform: scale(0.96);
}
</style>
