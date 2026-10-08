<template>
  <BottomSheetDrawer
    :model-value="open"
    :draggable="true"
    :fit-content="true"
    :initial-height="0.28"
    :min-height="0.18"
    :max-height="0.48"
    :auto-close-on-min="true"
    :close-on-backdrop="true"
    :lock-scroll="true"
    backdrop-z-class="z-[2000000030]"
    panel-z-class="z-[2000000040]"
    :panel-class="panelClass"
    :content-class="'attach-sheet-content'"
    :backdrop-class="backdropClass"
    :handle-class="'attach-sheet-handle'"
    @update:modelValue="(v) => { if (!v) $emit('close'); }"
    @close="$emit('close')"
  >
    <div class="attach-sheet" role="list">
      <div class="attach-sheet__title">{{ $t('messenger.attach') }}</div>
      <div class="attach-row">
        <button
          v-for="item in items"
          :key="item.value"
          type="button"
          role="listitem"
          class="attach-cell"
          :title="item.label"
          :aria-label="item.label"
          @click="$emit('select', item.value)"
        >
          <span class="attach-icon" :style="{ background: item.bg, color: item.fg }">
            <!-- Camera -->
            <svg v-if="item.value === 'camera'" class="attach-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7.5h2.2l1.2-2h8.2l1.2 2H19a2 2 0 012 2v8.5a2 2 0 01-2 2H5a2 2 0 01-2-2V9.5a2 2 0 012-2z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" />
              <circle cx="12" cy="13" r="3.25" stroke="currentColor" stroke-width="1.75" />
            </svg>
            <!-- Gallery -->
            <svg v-else-if="item.value === 'photo'" class="attach-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="4.5" width="18" height="15" rx="3.25" stroke="currentColor" stroke-width="1.75" />
              <circle cx="8.75" cy="9.25" r="1.65" fill="currentColor" />
              <path d="M3.8 16.2l4.3-4.1a1.6 1.6 0 012.2 0l2.1 2 2.55-2.45a1.6 1.6 0 012.25 0L20.2 16.2" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <!-- File -->
            <svg v-else-if="item.value === 'file'" class="attach-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 3.75h6.2L19 9.6V20.25a1.5 1.5 0 01-1.5 1.5H7A1.5 1.5 0 015.5 20.25V5.25A1.5 1.5 0 017 3.75z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" />
              <path d="M13.1 3.9V9.4H18.5" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" />
              <path d="M8.5 13.2h7M8.5 16.6h5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
            </svg>
            <!-- Audio -->
            <svg v-else-if="item.value === 'audio'" class="attach-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M10 17.5V6.2l10-1.7v11.4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
              <circle cx="7.5" cy="17.5" r="2.5" stroke="currentColor" stroke-width="1.75" />
              <circle cx="17.5" cy="15.9" r="2.5" stroke="currentColor" stroke-width="1.75" />
            </svg>
            <!-- Location -->
            <svg v-else class="attach-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 21.2s6.5-5.35 6.5-10.4A6.5 6.5 0 0012 4.3a6.5 6.5 0 00-6.5 6.5c0 5.05 6.5 10.4 6.5 10.4z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" />
              <circle cx="12" cy="10.8" r="2.15" stroke="currentColor" stroke-width="1.75" />
            </svg>
          </span>
          <span class="attach-label">{{ item.short }}</span>
        </button>
      </div>
    </div>
  </BottomSheetDrawer>
</template>

<script>
import { mapGetters } from "@/composables/useStore";
import BottomSheetDrawer from '@/views/components/common/BottomSheetDrawer.vue';
import { MESSENGER_SHEET_PANEL, MESSENGER_SHEET_BACKDROP } from './sheetStyles';

export default {
  name: 'AttachMediaSheet',
  components: { BottomSheetDrawer },
  props: {
    open: { type: Boolean, default: false },
  },
  emits: ['close', 'select'],
  computed: {
    ...mapGetters('messenger', ['canMessengerUpload', 'canMessengerFeature']),
    panelClass() {
      return `${MESSENGER_SHEET_PANEL} attach-sheet-panel`;
    },
    backdropClass() {
      return MESSENGER_SHEET_BACKDROP;
    },
    items() {
      const rows = [];
      const allow = (type) => this.canMessengerUpload(type);
      if (allow('photo')) {
        rows.push({
          value: 'camera',
          label: this.$t('messenger.camera'),
          short: this.$t('messenger.camera'),
          bg: 'linear-gradient(145deg, #5ce07a 0%, #34c759 100%)',
          fg: '#fff',
        });
      }
      if (allow('photo') || allow('video')) {
        rows.push({
          value: 'photo',
          label: this.$t('messenger.mediaGallery'),
          short: this.$t('messenger.mediaGallery'),
          bg: 'linear-gradient(145deg, #5aaef5 0%, #3390ec 100%)',
          fg: '#fff',
        });
      }
      if (allow('file')) {
        rows.push({
          value: 'file',
          label: this.$t('messenger.attachFile'),
          short: this.$t('messenger.attachFile'),
          bg: 'linear-gradient(145deg, #8e99a4 0%, #707579 100%)',
          fg: '#fff',
        });
      }
      if (allow('audio')) {
        rows.push({
          value: 'audio',
          label: this.$t('messenger.mediaAudio'),
          short: this.$t('messenger.mediaAudio'),
          bg: 'linear-gradient(145deg, #ff8a65 0%, #ff6b35 100%)',
          fg: '#fff',
        });
      }
      if (this.canMessengerFeature('location')) {
        rows.push({
          value: 'location',
          label: this.$t('messenger.location'),
          short: this.$t('messenger.location'),
          bg: 'linear-gradient(145deg, #ff7a8a 0%, #e53955 100%)',
          fg: '#fff',
        });
      }
      return rows;
    },
  },
};
</script>

<style scoped>
.attach-sheet {
  padding: 2px 8px 4px;
}

.attach-sheet__title {
  margin: 0 4px 12px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #1e2023;
  text-align: center;
  line-height: 1.2;
}

.dark .attach-sheet__title {
  color: #f5f5f5;
}

.attach-row {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px 2px;
  max-width: 26rem;
  margin: 0 auto;
  padding: 0 2px 6px;
}

.attach-cell {
  flex: 1 1 4.2rem;
  max-width: 5.25rem;
  min-width: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
  padding: 6px 4px 8px;
  border-radius: 18px;
  transition:
    background 140ms ease,
    transform 100ms cubic-bezier(0.22, 1, 0.36, 1);
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.attach-cell:hover .attach-icon {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.16);
}

.attach-cell:active {
  transform: scale(0.95);
  background: rgba(0, 0, 0, 0.04);
}

.dark .attach-cell:active {
  background: rgba(255, 255, 255, 0.06);
}

.attach-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    transform 200ms cubic-bezier(0.34, 1.3, 0.64, 1),
    box-shadow 200ms ease;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.22) inset,
    0 4px 12px rgba(15, 23, 42, 0.14);
}

.dark .attach-icon {
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.14) inset,
    0 6px 16px rgba(0, 0, 0, 0.4);
}

.attach-svg {
  width: 26px;
  height: 26px;
}

.attach-label {
  max-width: 100%;
  padding: 0 2px;
  font-size: 11px;
  font-weight: 550;
  letter-spacing: 0.01em;
  color: #707579;
  line-height: 1.15;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .attach-label {
  color: #a2acb4;
}

@media (min-width: 640px) {
  .attach-icon {
    width: 52px;
    height: 52px;
  }

  .attach-svg {
    width: 24px;
    height: 24px;
  }
}
</style>

<style>
/* Unscoped — classes land on BottomSheetDrawer teleported nodes */
.attach-sheet-panel.messenger-sheet-panel {
  padding: 0 !important;
  border-radius: 1.15rem 1.15rem 0 0 !important;
  /* Glass tokens come from messenger-theme.css (.messenger-sheet-panel) */
}

.attach-sheet-handle {
  margin-inline: auto;
  height: 5px;
  width: 36px;
  border-radius: 999px;
  background: rgba(112, 117, 121, 0.35);
  transition: background 150ms ease;
}

.dark .attach-sheet-handle {
  background: rgba(255, 255, 255, 0.22);
}

.attach-sheet-content {
  padding: 0 10px calc(12px + env(safe-area-inset-bottom, 0px)) !important;
  overflow: visible !important;
}
</style>
