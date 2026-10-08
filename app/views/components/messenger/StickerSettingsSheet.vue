<template>
  <Teleport to="body">
    <transition name="stk-settings-fade">
      <div
        v-if="open"
        class="stk-settings-root"
        role="presentation"
        @keydown.esc.prevent.stop="$emit('close')"
      >
        <div class="stk-settings-backdrop" aria-hidden="true" @click="$emit('close')" />

        <div
          class="stk-settings-panel"
          role="dialog"
          aria-modal="true"
          :aria-label="titleLabel"
          tabindex="-1"
          @click.stop
        >
          <header class="stk-settings-head">
            <h3 class="stk-settings-title">{{ titleLabel }}</h3>
            <div class="stk-settings-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                class="stk-settings-tab is-active"
                aria-selected="true"
              >
                {{ stickersTabLabel }}
              </button>
              <button
                type="button"
                role="tab"
                class="stk-settings-tab is-disabled"
                aria-selected="false"
                disabled
                :title="trendingSoonLabel"
              >
                {{ trendingTabLabel }}
              </button>
            </div>
          </header>

          <div class="stk-settings-list custom-stk-scroll">
            <!-- Recently used — fixed, not draggable -->
            <div class="stk-settings-row is-fixed">
              <span class="stk-settings-handle is-disabled" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                  <path d="M8 7h8M8 12h8M8 17h8" />
                </svg>
              </span>
              <span class="stk-settings-icon" aria-hidden="true">🕒</span>
              <div class="stk-settings-meta min-w-0 flex-1">
                <div class="stk-settings-name truncate">{{ recentLabel }}</div>
                <div class="stk-settings-sub">{{ stickersCountLabel(recentCount) }}</div>
              </div>
            </div>

            <TransitionGroup name="stk-reorder" tag="div" class="stk-settings-packs">
              <div
                v-for="(pack, index) in packs"
                :key="pack.id"
                class="stk-settings-row"
                :class="{
                  'is-dragging': dragIndex === index,
                  'is-drop-target': dropIndex === index && dragIndex !== index,
                }"
                draggable="true"
                @dragstart="onDragStart(index, $event)"
                @dragover.prevent="onDragOver(index, $event)"
                @drop.prevent="onDrop(index)"
                @dragend="onDragEnd"
              >
                <span
                  class="stk-settings-handle"
                  :title="reorderLabel"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                    <path d="M8 7h8M8 12h8M8 17h8" />
                  </svg>
                </span>
                <span class="stk-settings-icon" aria-hidden="true">
                  <img
                    v-if="packPreview(pack)"
                    :src="packPreview(pack)"
                    alt=""
                    class="stk-settings-icon-img"
                  >
                  <template v-else>{{ pack.icon || '⭐' }}</template>
                </span>
                <div class="stk-settings-meta min-w-0 flex-1">
                  <div class="stk-settings-name truncate">{{ packTitle(pack) }}</div>
                  <div class="stk-settings-sub">{{ stickersCountLabel((pack.stickers || []).length) }}</div>
                </div>
                <button
                  type="button"
                  class="stk-settings-trash"
                  :title="removeLabel"
                  :aria-label="removeLabel"
                  @click.stop="requestDelete(pack)"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                  </svg>
                </button>
              </div>
            </TransitionGroup>
          </div>

          <footer class="stk-settings-foot">
            <button type="button" class="stk-settings-done" @click="$emit('close')">
              {{ doneLabel }}
            </button>
          </footer>
        </div>
      </div>
    </transition>
  </Teleport>

  <ConfirmDialog
    :open="!!pendingDelete"
    :title="deleteConfirmTitle"
    :confirm-label="removeLabel"
    :danger="true"
    @close="pendingDelete = null"
    @confirm="confirmDelete"
  />
</template>

<script>
import {
  getAllStickerPacks,
  deleteCustomPack,
  uninstallPack,
  reorderStickerPacks,
  packTitleLocalized,
} from './stickerPacks';
import { listRecentStickers } from './stickerGifLibrary';
import ConfirmDialog from './ConfirmDialog.vue';
import { uninstallStickerPackApi } from '@/services/messenger';

export default {
  name: 'StickerSettingsSheet',
  components: { ConfirmDialog },
  props: {
    open: { type: Boolean, default: false },
  },
  emits: ['close', 'changed'],
  data() {
    return {
      packs: [],
      recentCount: 0,
      dragIndex: null,
      dropIndex: null,
      pendingDelete: null,
    };
  },
  computed: {
    titleLabel() {
      return this.tOr('messenger.stickerSettings', 'Stickers and Emoji');
    },
    stickersTabLabel() {
      return this.tOr('messenger.panelStickers', 'Stickers');
    },
    trendingTabLabel() {
      return this.tOr('messenger.stickerSettingsTrending', 'Trending');
    },
    trendingSoonLabel() {
      return this.tOr('messenger.comingSoon', 'Coming soon');
    },
    recentLabel() {
      return this.tOr('messenger.stickerRecent', 'Recently used');
    },
    doneLabel() {
      const done = this.tOr('messenger.stickerSettingsDone', '');
      if (done) return done;
      return this.tOr('messenger.done', 'Done');
    },
    removeLabel() {
      return this.tOr('messenger.stickerRemovePack', 'Remove');
    },
    reorderLabel() {
      return this.tOr('messenger.reorder', 'Reorder');
    },
    deleteConfirmTitle() {
      if (!this.pendingDelete) return this.tOr('messenger.stickerSettingsDeleteConfirm', 'Remove this sticker pack?');
      const name = this.packTitle(this.pendingDelete);
      return this.tOr('messenger.stickerSettingsDeleteConfirm', 'Remove this sticker pack?')
        + (name ? `\n${name}` : '');
    },
  },
  watch: {
    open(v) {
      if (v) this.reload();
    },
  },
  methods: {
    tOr(key, fallback) {
      const t = this.$t(key);
      return t !== key ? t : fallback;
    },
    reload() {
      this.packs = getAllStickerPacks().map((p) => ({ ...p }));
      this.recentCount = listRecentStickers().length;
      this.dragIndex = null;
      this.dropIndex = null;
      this.pendingDelete = null;
    },
    packTitle(pack) {
      return packTitleLocalized(pack, this.$i18n?.locale);
    },
    packPreview(pack) {
      const first = (pack?.stickers || []).find((s) => s.kind === 'image' && s.src);
      return first?.src || null;
    },
    stickersCountLabel(count) {
      const n = Number(count) || 0;
      const t = this.$t('messenger.stickersCount', { count: n });
      if (t !== 'messenger.stickersCount') return t;
      const alt = this.$t('messenger.stickerCount', { n });
      if (alt !== 'messenger.stickerCount') return alt;
      return `${n} stickers`;
    },
    persistOrder() {
      reorderStickerPacks(this.packs.map((p) => p.id));
      this.$emit('changed');
    },
    onDragStart(index, event) {
      this.dragIndex = index;
      this.dropIndex = index;
      try {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', String(index));
        // Slightly transparent drag ghost
        if (event.target && event.dataTransfer.setDragImage) {
          const row = event.currentTarget;
          if (row) event.dataTransfer.setDragImage(row, 24, 24);
        }
      } catch (e) { /* noop */ }
    },
    onDragOver(index) {
      if (this.dragIndex == null || this.dragIndex === index) {
        this.dropIndex = index;
        return;
      }
      const next = [...this.packs];
      const [item] = next.splice(this.dragIndex, 1);
      next.splice(index, 0, item);
      this.packs = next;
      this.dragIndex = index;
      this.dropIndex = index;
    },
    onDrop() {
      this.persistOrder();
      this.dragIndex = null;
      this.dropIndex = null;
    },
    onDragEnd() {
      if (this.dragIndex != null) this.persistOrder();
      this.dragIndex = null;
      this.dropIndex = null;
    },
    requestDelete(pack) {
      if (!pack?.id) return;
      this.pendingDelete = pack;
    },
    confirmDelete() {
      const pack = this.pendingDelete;
      this.pendingDelete = null;
      if (!pack?.id) return;
      deleteCustomPack(pack.id);
      uninstallPack(pack.id);
      uninstallStickerPackApi(pack.id).catch(() => {});
      this.reload();
      this.$emit('changed');
    },
  },
};
</script>

<style scoped>
.stk-settings-root {
  position: fixed;
  inset: 0;
  z-index: 2000000400;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
}
.stk-settings-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.32);
  -webkit-backdrop-filter: blur(10px) saturate(1.2);
  backdrop-filter: blur(10px) saturate(1.2);
}
.stk-settings-panel {
  position: relative;
  width: min(420px, 100%);
  max-height: min(640px, calc(100vh - 48px));
  display: flex;
  flex-direction: column;
  border-radius: 14px;
  overflow: hidden;
  background: var(--tg-confirm-bg, rgba(28, 36, 47, 0.62));
  color: #f5f5f5;
  box-shadow: var(--tg-shadow-dialog, 0 16px 48px rgba(0, 0, 0, 0.45));
  border: 1px solid var(--tg-menu-border, rgba(255, 255, 255, 0.12));
  -webkit-backdrop-filter: var(--tg-glass-blur, blur(44px) saturate(1.9));
  backdrop-filter: var(--tg-glass-blur, blur(44px) saturate(1.9));
  font-size: 13px;
}
.stk-settings-head {
  flex-shrink: 0;
  padding: 14px 14px 0;
}
.stk-settings-title {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: -0.01em;
  text-align: start;
}
.stk-settings-tabs {
  display: flex;
  gap: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.stk-settings-tab {
  position: relative;
  padding: 0 2px 10px;
  font-size: 12.5px;
  font-weight: 600;
  color: #8b98a5;
}
.stk-settings-tab.is-active {
  color: var(--tg-blue, #3390ec);
}
.stk-settings-tab.is-active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  border-radius: 3px 3px 0 0;
  background: var(--tg-blue, #3390ec);
}
.stk-settings-tab.is-disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* Custom thin Telegram-style scrollbar */
.stk-settings-list.custom-stk-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 4px 0 8px;
  scrollbar-width: thin;
  scrollbar-color: rgba(130, 140, 150, 0.35) transparent;
}
.stk-settings-list.custom-stk-scroll::-webkit-scrollbar {
  width: 6px;
}
.stk-settings-list.custom-stk-scroll::-webkit-scrollbar-track {
  background: transparent;
  margin: 4px 0;
}
.stk-settings-list.custom-stk-scroll::-webkit-scrollbar-button {
  display: none;
  width: 0;
  height: 0;
}
.stk-settings-list.custom-stk-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(130, 140, 150, 0.35);
  border-radius: 999px;
  border: 1px solid transparent;
  background-clip: padding-box;
}
.stk-settings-list.custom-stk-scroll::-webkit-scrollbar-thumb:hover {
  background-color: rgba(160, 170, 180, 0.55);
}

.stk-settings-packs {
  display: flex;
  flex-direction: column;
}
.stk-settings-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  user-select: none;
  transition: background-color 0.16s ease, transform 0.18s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.18s ease;
}
.stk-settings-row.is-dragging {
  background: rgba(51, 144, 236, 0.14);
  opacity: 0.88;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  z-index: 2;
  position: relative;
}
.stk-settings-row.is-drop-target:not(.is-dragging) {
  background: rgba(51, 144, 236, 0.06);
}
.stk-settings-row.is-fixed {
  opacity: 0.92;
}
.stk-settings-handle {
  width: 22px;
  height: 36px;
  display: grid;
  place-items: center;
  color: #6b7682;
  cursor: grab;
  flex-shrink: 0;
  border-radius: 6px;
  transition: color 0.14s ease, background 0.14s ease;
}
.stk-settings-handle:hover {
  color: #a2acb4;
  background: rgba(255, 255, 255, 0.06);
}
.stk-settings-handle:active {
  cursor: grabbing;
}
.stk-settings-handle.is-disabled {
  opacity: 0.35;
  cursor: default;
  pointer-events: none;
}
.stk-settings-handle.is-disabled:hover {
  background: transparent;
  color: #6b7682;
}
.stk-settings-handle svg {
  width: 16px;
  height: 16px;
}
.stk-settings-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-size: 26px;
  line-height: 1;
  background: rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
  overflow: hidden;
}
.stk-settings-icon-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.stk-settings-name {
  font-size: 13px;
  font-weight: 600;
  color: #f0f2f5;
}
.stk-settings-sub {
  margin-top: 2px;
  font-size: 12px;
  color: #8b98a5;
}
.stk-settings-trash {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: #8b98a5;
  flex-shrink: 0;
  transition: color 0.14s ease, background 0.14s ease;
}
.stk-settings-trash:hover {
  color: #ff8a80;
  background: rgba(223, 63, 64, 0.12);
}
.stk-settings-trash svg {
  width: 18px;
  height: 18px;
}
.stk-settings-foot {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  padding: 10px 16px 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}
.stk-settings-done {
  font-size: 13px;
  font-weight: 600;
  color: var(--tg-blue, #3390ec);
  padding: 6px 10px;
  border-radius: 8px;
  transition: background 0.14s ease;
}
.stk-settings-done:hover {
  background: rgba(51, 144, 236, 0.12);
}

/* Smooth reorder animation */
.stk-reorder-move {
  transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}
.stk-reorder-enter-active,
.stk-reorder-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.stk-reorder-enter-from,
.stk-reorder-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
.stk-reorder-leave-active {
  position: absolute;
  width: 100%;
}

.stk-settings-fade-enter-active,
.stk-settings-fade-leave-active {
  transition: opacity 0.18s ease;
}
.stk-settings-fade-enter-active .stk-settings-panel,
.stk-settings-fade-leave-active .stk-settings-panel {
  transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.18s ease;
}
.stk-settings-fade-enter-from,
.stk-settings-fade-leave-to {
  opacity: 0;
}
.stk-settings-fade-enter-from .stk-settings-panel,
.stk-settings-fade-leave-to .stk-settings-panel {
  transform: translateY(10px) scale(0.98);
  opacity: 0;
}
</style>
