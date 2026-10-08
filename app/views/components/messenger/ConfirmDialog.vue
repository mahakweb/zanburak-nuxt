<template>
  <Teleport to="body">
    <transition name="tg-confirm-fade">
      <div
        v-if="open"
        class="tg-confirm-root"
        :class="{ 'tg-confirm-root--armoring': armoring }"
        role="presentation"
        @keydown.esc.prevent.stop="requestClose"
      >
        <div
          class="tg-confirm-backdrop"
          aria-hidden="true"
          @pointerdown.prevent.stop="onBackdropPointer"
          @pointerup.prevent.stop="onBackdropPointer"
          @click.prevent.stop="onBackdropClick"
        />

        <div
          class="tg-confirm-panel"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          tabindex="-1"
          ref="panel"
          @click.stop
          @pointerdown.stop
          @pointerup.stop
        >
          <div class="tg-confirm">
            <h3 v-if="title" :id="titleId" class="tg-confirm__title">{{ title }}</h3>
            <p v-if="message" class="tg-confirm__hint">{{ message }}</p>

            <label
              v-if="checkboxLabel"
              class="tg-confirm__check"
              @pointerdown.stop
            >
              <span
                class="tg-confirm__box"
                :class="{ on: checked }"
                aria-hidden="true"
              >
                <svg v-if="checked" class="tg-confirm__tick" viewBox="0 0 24 24" fill="none">
                  <path
                    stroke="currentColor"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
              <input
                :checked="checked"
                type="checkbox"
                class="sr-only"
                @change="onCheck"
              >
              <span class="tg-confirm__check-label">{{ checkboxLabel }}</span>
            </label>

            <!-- Centered modal actions (Telegram Web A) — never a bottom sheet -->
            <div
              class="tg-confirm__actions tg-confirm__actions--text"
              :class="{ 'tg-confirm__actions--wrap': actions.length > 2 }"
            >
              <button
                type="button"
                class="tg-confirm__text-btn"
                @click="requestClose"
              >
                {{ cancelLabel || $t('messenger.cancel') }}
              </button>
              <template v-if="actions.length">
                <button
                  v-for="a in actions"
                  :key="a.value"
                  type="button"
                  class="tg-confirm__text-btn"
                  :class="{ 'is-danger': a.danger }"
                  @click="onSelect(a)"
                >
                  {{ a.label }}
                </button>
              </template>
              <button
                v-else
                type="button"
                class="tg-confirm__text-btn"
                :class="{ 'is-danger': danger }"
                @click="onConfirm"
              >
                {{ confirmLabel || $t('messenger.ok') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script>
import {
  OPEN_CLICK_GRACE_MS,
  withinOpenGrace,
  registerOverlay,
  OVERLAY_PRIORITY,
} from './interactionManagers';

let confirmUid = 0;

export default {
  name: 'ConfirmDialog',
  props: {
    open: { type: Boolean, default: false },
    title: { type: String, default: '' },
    message: { type: String, default: '' },
    checkboxLabel: { type: String, default: '' },
    modelValue: { type: Boolean, default: false },
    confirmLabel: { type: String, default: '' },
    cancelLabel: { type: String, default: '' },
    danger: { type: Boolean, default: false },
    /** Extra actions [{ label, value, danger?, primary? }] — used by ActionSheet. */
    actions: { type: Array, default: () => [] },
    /** Kept for callers; layout is always centered dialog. */
    stacked: { type: Boolean, default: false },
    closeOnBackdrop: { type: Boolean, default: true },
  },
  emits: ['close', 'confirm', 'select', 'update:modelValue'],
  data() {
    confirmUid += 1;
    return {
      titleId: `tg-confirm-title-${confirmUid}`,
      openedAtMs: 0,
      armoring: false,
      armorTimer: null,
      unregisterOverlay: null,
    };
  },
  computed: {
    checked: {
      get() { return this.modelValue; },
      set(v) { this.$emit('update:modelValue', v); },
    },
  },
  watch: {
    open(val) {
      if (val) this.onOpened();
      else this.onClosed();
    },
  },
  mounted() {
    if (this.open) this.onOpened();
  },
  beforeUnmount() {
    this.onClosed();
  },
  methods: {
    onOpened() {
      this.openedAtMs = Date.now();
      this.armoring = true;
      if (this.armorTimer) {
        clearTimeout(this.armorTimer);
        this.armorTimer = null;
      }
      this.armorTimer = window.setTimeout(() => {
        this.armoring = false;
        this.armorTimer = null;
      }, OPEN_CLICK_GRACE_MS);

      this.$nextTick(() => this.$refs.panel?.focus?.());
      document.addEventListener('keydown', this.onDocKey, true);
      document.addEventListener('click', this.swallowGhostClick, true);
      document.addEventListener('pointerup', this.swallowGhostClick, true);
      document.addEventListener('pointerdown', this.swallowGhostClick, true);
      window.setTimeout(() => {
        document.removeEventListener('click', this.swallowGhostClick, true);
        document.removeEventListener('pointerup', this.swallowGhostClick, true);
        document.removeEventListener('pointerdown', this.swallowGhostClick, true);
      }, OPEN_CLICK_GRACE_MS + 80);

      if (this.unregisterOverlay) {
        this.unregisterOverlay();
        this.unregisterOverlay = null;
      }
      this.unregisterOverlay = registerOverlay({
        kind: 'confirm',
        priority: OVERLAY_PRIORITY.confirm,
        close: () => this.requestClose(),
      });
    },
    onClosed() {
      this.armoring = false;
      if (this.armorTimer) {
        clearTimeout(this.armorTimer);
        this.armorTimer = null;
      }
      document.removeEventListener('keydown', this.onDocKey, true);
      document.removeEventListener('click', this.swallowGhostClick, true);
      document.removeEventListener('pointerup', this.swallowGhostClick, true);
      document.removeEventListener('pointerdown', this.swallowGhostClick, true);
      if (this.unregisterOverlay) {
        this.unregisterOverlay();
        this.unregisterOverlay = null;
      }
    },
    swallowGhostClick(e) {
      if (!this.open || !withinOpenGrace(this.openedAtMs)) return;
      const t = e.target;
      if (t && typeof t.closest === 'function') {
        if (t.closest('.tg-confirm-panel')) return;
      }
      e.preventDefault?.();
      e.stopPropagation?.();
      e.stopImmediatePropagation?.();
    },
    onDocKey(e) {
      if (e.key === 'Escape' && this.open) {
        e.preventDefault();
        e.stopPropagation();
        this.requestClose();
      }
    },
    onBackdropPointer(e) {
      if (withinOpenGrace(this.openedAtMs) || this.armoring) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    onBackdropClick(e) {
      if (!this.closeOnBackdrop) return;
      if (withinOpenGrace(this.openedAtMs) || this.armoring) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      this.requestClose();
    },
    requestClose() {
      this.$emit('close');
    },
    onCheck(e) {
      this.$emit('update:modelValue', !!e.target.checked);
    },
    onConfirm() {
      this.$emit('confirm', this.checked);
      this.$emit('close');
    },
    onSelect(a) {
      this.$emit('select', a.value);
      this.$emit('close');
    },
  },
};
</script>
