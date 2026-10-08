<template>
  <teleport to="body">
    <transition name="stk-sheet">
      <div
        v-if="open"
        class="stk-sheet-root fixed inset-0 z-[2000000300]"
        @click.self="close"
      >
        <div class="stk-sheet-panel" @click.stop>
          <div class="stk-sheet-handle" aria-hidden="true" />
          <header class="stk-sheet-head">
            <div class="stk-sheet-title-wrap">
              <span class="stk-sheet-icon" aria-hidden="true">{{ packIcon }}</span>
              <div class="min-w-0">
                <h3 class="stk-sheet-title truncate">{{ title }}</h3>
                <p class="stk-sheet-sub">{{ loading ? loadingLabel : countLabel }}</p>
              </div>
            </div>
          </header>

          <div class="stk-sheet-grid custom-stk-scroll">
            <button
              v-for="st in stickers"
              :key="st.id"
              type="button"
              class="stk-sheet-cell"
              @click="onPick(st)"
              @pointerdown="onStickerPointerDown(st, $event)"
              @pointerup="onStickerPointerUp"
              @pointercancel="onStickerPointerUp"
              @pointerleave="onStickerPointerUp"
            >
              <img v-if="st.kind === 'image' && st.src" :src="st.src" alt="" class="stk-sheet-img">
              <span v-else class="stk-sheet-emoji">{{ st.emoji }}</span>
            </button>
            <div v-if="loading && !stickers.length" class="stk-sheet-empty">
              {{ loadingLabel }}
            </div>
            <div v-else-if="!stickers.length" class="stk-sheet-empty">
              {{ emptyLabel }}
            </div>
          </div>

          <div v-if="pack" class="stk-sheet-footer">
            <button
              v-if="!installed"
              type="button"
              class="stk-sheet-action stk-sheet-action--add"
              :disabled="busy"
              @click="onAddPack"
            >
              {{ addPackLabel }}
            </button>
            <button
              v-else
              type="button"
              class="stk-sheet-action stk-sheet-action--remove"
              :disabled="busy"
              @click="onRemovePack"
            >
              {{ removePackLabel }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="stk-hold">
      <div
        v-if="holdOverlay"
        class="stk-sheet-hold fixed inset-0 z-[2000000350] flex items-center justify-center"
        data-sticker-hold-overlay
        @click.self="closeHold"
        @pointerdown.self="closeHold"
      >
        <div class="stk-sheet-hold-preview" @click.stop @pointerdown.stop>
          <img
            v-if="holdOverlay.kind === 'image' && holdOverlay.src"
            :src="holdOverlay.src"
            alt=""
            class="stk-sheet-hold-img"
          >
          <span v-else class="stk-sheet-hold-emoji">{{ holdOverlay.emoji }}</span>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import {
  findPackById,
  installPack,
  uninstallPack,
  isPackInstalled,
  packTitleLocalized,
  mergeServerPacks,
  cacheServerPack,
  isServerPackId,
} from './stickerPacks';
import { installStickerPackApi, uninstallStickerPackApi, getStickerPack } from '@/services/messenger';

const HOLD_MS = 420;

export default {
  name: 'StickerPackSheet',
  props: {
    open: { type: Boolean, default: false },
    packId: { type: String, default: null },
    /** Fallback single sticker when pack unknown */
    fallbackSticker: { type: Object, default: null },
    /** Stickers seen in this chat for the same pack (offline / local pack preview). */
    seedStickers: { type: Array, default: () => [] },
  },
  emits: ['close', 'send', 'pack-changed'],
  data() {
    return {
      holdOverlay: null,
      holdTimer: null,
      holdSuppressClick: false,
      installTick: 0,
      loading: false,
      busy: false,
      loadToken: 0,
    };
  },
  computed: {
    pack() {
      // installTick forces recompute after install/uninstall / remote hydrate
      void this.installTick;
      const p = findPackById(this.packId);
      const localStickers = p?.stickers || [];
      const localHasImages = localStickers.some((s) => s?.src);
      if (p && localStickers.length && localHasImages) return p;

      if (this.mergedSeedStickers.length) {
        const seedHasImages = this.mergedSeedStickers.some((s) => s?.src);
        // Prefer chat seeds when local pack is missing or only emoji placeholders.
        if (!p || !localStickers.length || seedHasImages) {
          return {
            id: this.packId || p?.id || 'unknown',
            title: p?.title || this.fallbackSticker?.packTitle || 'Sticker',
            titleFa: p?.titleFa || this.fallbackSticker?.packTitleFa || 'استیکر',
            icon: p?.icon || this.fallbackSticker?.emoji || this.mergedSeedStickers[0]?.emoji || '⭐',
            stickers: this.mergedSeedStickers,
            custom: !!p?.custom,
            remote: !!p?.remote || isServerPackId(this.packId),
          };
        }
      }

      if (p && localStickers.length) return p;

      if (this.fallbackSticker) {
        return {
          id: this.packId || 'unknown',
          title: this.fallbackSticker.packTitle || 'Sticker',
          titleFa: this.fallbackSticker.packTitleFa || 'استیکر',
          icon: this.fallbackSticker.emoji || '⭐',
          stickers: [this.fallbackSticker],
          custom: false,
        };
      }
      return p || null;
    },
    mergedSeedStickers() {
      const byId = new Map();
      const push = (st) => {
        if (!st) return;
        const id = String(st.id || st.stickerId || '');
        if (!id) return;
        const prev = byId.get(id);
        const src = st.src || st.url || st.cdn_url || null;
        const kind = st.kind || (src ? 'image' : 'emoji');
        if (!prev) {
          byId.set(id, {
            id,
            kind,
            src,
            emoji: st.emoji || '⭐',
            mediaId: st.mediaId || st.media_id || null,
            width: st.width || null,
            height: st.height || null,
          });
          return;
        }
        // Prefer image src over emoji-only placeholder.
        if ((!prev.src || prev.kind === 'emoji') && src) {
          byId.set(id, {
            ...prev,
            kind: 'image',
            src,
            mediaId: st.mediaId || st.media_id || prev.mediaId,
            width: st.width || prev.width,
            height: st.height || prev.height,
          });
        }
      };
      (this.seedStickers || []).forEach(push);
      if (this.fallbackSticker) push(this.fallbackSticker);
      return [...byId.values()];
    },
    stickers() {
      const list = this.pack?.stickers || [];
      return list.map((st) => ({
        ...st,
        kind: st.kind || (st.src ? 'image' : 'emoji'),
      }));
    },
    packIcon() {
      const firstImg = this.stickers.find((s) => s.kind === 'image' && s.src);
      if (firstImg) {
        return this.pack?.icon && this.pack.icon !== '⭐'
          ? this.pack.icon
          : (firstImg.emoji || '🎨');
      }
      return this.pack?.icon || this.fallbackSticker?.emoji || '⭐';
    },
    title() {
      return packTitleLocalized(this.pack, this.$i18n?.locale);
    },
    installed() {
      void this.installTick;
      return isPackInstalled(this.pack?.id);
    },
    countLabel() {
      const n = this.stickers.length;
      const t = this.$t('messenger.stickerCount', { n });
      return t !== 'messenger.stickerCount' ? t : `${n}`;
    },
    loadingLabel() {
      const t = this.$t('messenger.loading');
      return t !== 'messenger.loading' ? t : '…';
    },
    addPackLabel() {
      const t = this.$t('messenger.stickerAddPack');
      return t !== 'messenger.stickerAddPack' ? t : 'Add pack';
    },
    removePackLabel() {
      const n = this.stickers.length;
      const counted = this.$t('messenger.stickerRemoveCount', { n });
      if (counted !== 'messenger.stickerRemoveCount') return counted;
      const t = this.$t('messenger.stickerRemovePack');
      return t !== 'messenger.stickerRemovePack' ? t : 'Remove pack';
    },
    emptyLabel() {
      const t = this.$t('messenger.stickerEmptyTitle');
      return t !== 'messenger.stickerEmptyTitle' ? t : 'No stickers';
    },
  },
  watch: {
    open: {
      immediate: true,
      handler(v) {
        if (!v) {
          this.closeHold();
          this.onStickerPointerUp();
          this.loading = false;
          return;
        }
        this.hydratePack();
      },
    },
    packId() {
      if (this.open) this.hydratePack();
    },
  },
  beforeUnmount() {
    this.onStickerPointerUp();
  },
  methods: {
    close() {
      this.closeHold();
      this.$emit('close');
    },
    async hydratePack() {
      const token = ++this.loadToken;
      const id = this.packId;
      if (!id || !isServerPackId(id)) {
        this.installTick += 1;
        return;
      }
      const local = findPackById(id);
      const hasImages = (local?.stickers || []).some((s) => s.src);
      if (hasImages && (local.stickers || []).length > 1) {
        this.installTick += 1;
      } else {
        this.loading = true;
      }
      try {
        const remote = await getStickerPack(id);
        if (token !== this.loadToken) return;
        if (remote) {
          cacheServerPack(remote);
          this.installTick += 1;
        }
      } catch (e) {
        /* keep fallback / seed stickers */
      } finally {
        if (token === this.loadToken) this.loading = false;
      }
    },
    onPick(st) {
      if (this.holdSuppressClick) {
        this.holdSuppressClick = false;
        return;
      }
      this.$emit('send', {
        id: st.id,
        packId: this.pack?.id || null,
        emoji: st.emoji || null,
        kind: st.kind || (st.src ? 'image' : 'emoji'),
        src: st.src || null,
        mediaId: st.mediaId || st.media_id || null,
        width: st.width || null,
        height: st.height || null,
      });
      this.close();
    },
    onStickerPointerDown(st, event) {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      this.holdSuppressClick = false;
      this.onStickerPointerUp();
      this.holdTimer = window.setTimeout(() => {
        this.holdSuppressClick = true;
        this.holdOverlay = { ...st };
      }, HOLD_MS);
    },
    onStickerPointerUp() {
      if (this.holdTimer) {
        clearTimeout(this.holdTimer);
        this.holdTimer = null;
      }
    },
    closeHold() {
      this.holdOverlay = null;
    },
    async onAddPack() {
      if (!this.pack || this.busy) return;
      this.busy = true;
      try {
        try {
          const remote = await getStickerPack(this.pack.id);
          if (remote) {
            mergeServerPacks([remote], { markInstalled: true });
            await installStickerPackApi(this.pack.id);
          } else {
            installPack(this.pack);
          }
        } catch (e) {
          installPack(this.pack);
        }
        this.installTick += 1;
        this.$emit('pack-changed', { action: 'install', packId: this.pack.id });
      } finally {
        this.busy = false;
      }
    },
    async onRemovePack() {
      if (!this.pack?.id || this.busy) return;
      const packId = this.pack.id;
      this.busy = true;
      try {
        if (isServerPackId(packId)) {
          try {
            await uninstallStickerPackApi(packId);
          } catch (e) { /* local fallback */ }
        }
        uninstallPack(packId);
        this.installTick += 1;
        this.$emit('pack-changed', { action: 'uninstall', packId });
        this.close();
      } finally {
        this.busy = false;
      }
    },
  },
};
</script>

<style scoped>
.stk-sheet-root {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(0, 0, 0, 0.28);
  -webkit-backdrop-filter: blur(10px) saturate(1.2);
  backdrop-filter: blur(10px) saturate(1.2);
}

.stk-sheet-panel {
  width: 100%;
  max-width: 480px;
  max-height: min(72vh, 560px);
  background: rgba(255, 255, 255, 0.58);
  border: 1px solid rgba(255, 255, 255, 0.42);
  border-bottom: 0;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -10px 40px rgba(15, 23, 42, 0.18), 0 1px 0 rgba(255, 255, 255, 0.4) inset;
  -webkit-backdrop-filter: blur(40px) saturate(1.85);
  backdrop-filter: blur(40px) saturate(1.85);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: env(safe-area-inset-bottom, 0);
  font-size: 13px;
}

.dark .stk-sheet-panel {
  background: rgba(28, 36, 47, 0.56);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 -12px 48px rgba(0, 0, 0, 0.45), 0 1px 0 rgba(255, 255, 255, 0.06) inset;
}

@media (min-width: 640px) {
  .stk-sheet-panel {
    max-width: min(560px, 92vw);
    border-radius: 10px 10px 0 0;
  }
}

.stk-sheet-handle {
  width: 36px;
  height: 4px;
  border-radius: 999px;
  background: rgba(120, 130, 140, 0.45);
  margin: 8px auto 4px;
}

.stk-sheet-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.dark .stk-sheet-head {
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

.stk-sheet-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.stk-sheet-icon {
  font-size: 28px;
  line-height: 1;
}

.stk-sheet-title {
  font-size: 13.5px;
  font-weight: 650;
  color: #1a1a1a;
}

.dark .stk-sheet-title {
  color: #f1f5f9;
}

.stk-sheet-sub {
  font-size: 12px;
  color: #8b98a5;
  margin-top: 1px;
}

.stk-sheet-grid {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  padding: 10px 12px 12px;
}

.custom-stk-scroll {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  transition: scrollbar-color 0.25s ease;
}
.custom-stk-scroll:hover {
  scrollbar-color: rgba(130, 130, 130, 0.45) transparent;
}
.custom-stk-scroll::-webkit-scrollbar {
  width: 10px;
}
.custom-stk-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-stk-scroll::-webkit-scrollbar-button {
  display: none;
  width: 0;
  height: 0;
}
.custom-stk-scroll::-webkit-scrollbar-thumb {
  background-color: transparent;
  border: 3px solid transparent;
  background-clip: padding-box;
  border-radius: 999px;
}
.custom-stk-scroll:hover::-webkit-scrollbar-thumb {
  background-color: rgba(130, 130, 130, 0.4);
}
.custom-stk-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgba(130, 130, 130, 0.7);
  border-width: 2px;
}

.stk-sheet-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.stk-sheet-cell:active {
  background: rgba(51, 144, 236, 0.1);
}

.stk-sheet-emoji {
  font-size: 2.4rem;
  line-height: 1;
}

.stk-sheet-img {
  width: 78%;
  height: 78%;
  object-fit: contain;
}

.stk-sheet-empty {
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem 1rem;
  color: #8b98a5;
  font-size: 13px;
}

.stk-sheet-footer {
  flex-shrink: 0;
  padding: 10px 14px 14px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.dark .stk-sheet-footer {
  border-top-color: rgba(255, 255, 255, 0.08);
}

.stk-sheet-action {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
}

.stk-sheet-action:disabled {
  opacity: 0.55;
  pointer-events: none;
}

.stk-sheet-action--add {
  background: #f5c518;
  color: #111;
}

.stk-sheet-action--add:active {
  filter: brightness(0.95);
}

.stk-sheet-action--remove {
  color: #e53935;
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(14px) saturate(1.2);
  -webkit-backdrop-filter: blur(14px) saturate(1.2);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.dark .stk-sheet-action--remove {
  background: rgba(255, 255, 255, 0.1);
}

.stk-sheet-action--remove:active {
  background: rgba(229, 57, 53, 0.16);
}

.stk-sheet-hold {
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 24px;
}

.stk-sheet-hold-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: min(280px, 80vw);
  max-height: min(280px, 60vh);
}

.stk-sheet-hold-emoji {
  font-size: 7rem;
  line-height: 1;
  filter: drop-shadow(0 12px 28px rgba(0, 0, 0, 0.35));
}

.stk-sheet-hold-img {
  max-width: min(220px, 70vw);
  max-height: min(220px, 50vh);
  object-fit: contain;
  filter: drop-shadow(0 12px 28px rgba(0, 0, 0, 0.35));
}

.stk-sheet-enter-active,
.stk-sheet-leave-active {
  transition: opacity 0.2s ease;
}
.stk-sheet-enter-active .stk-sheet-panel,
.stk-sheet-leave-active .stk-sheet-panel {
  transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}
.stk-sheet-enter-from,
.stk-sheet-leave-to {
  opacity: 0;
}
.stk-sheet-enter-from .stk-sheet-panel,
.stk-sheet-leave-to .stk-sheet-panel {
  transform: translateY(100%);
}

.stk-hold-enter-active,
.stk-hold-leave-active {
  transition: opacity 0.18s ease;
}
.stk-hold-enter-from,
.stk-hold-leave-to {
  opacity: 0;
}
</style>
