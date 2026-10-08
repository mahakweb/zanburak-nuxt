<template>
  <teleport to="body">
    <transition name="ctx-fade">
      <div
        v-if="visible"
        class="ctx-menu-root fixed inset-0 z-[2000000200]"
        :class="{ 'ctx-menu-root--sheet': isMobileMenu }"
        @click="onBackdropClick"
        @contextmenu.prevent="onBackdropContextMenu"
      >
        <div
          ref="menu"
          class="tg-menu tg-menu--context ctx-menu-panel select-none"
          :class="{ 'ctx-menu-panel--sheet': isMobileMenu }"
          :style="menuBoxStyle"
          @click.stop
        >
          <div v-if="isMobileMenu" class="ctx-sheet-handle" aria-hidden="true" />
          <template v-for="(item, i) in items" :key="i">
            <div v-if="item.divider" class="tg-menu-divider" />

            <div
              v-else-if="item.header"
              class="tg-menu-header"
            >
              <span v-if="item.icon" class="tg-menu-header-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path v-for="(d, di) in iconPaths(item.icon)" :key="di" stroke-linecap="round" stroke-linejoin="round" :d="d" />
                </svg>
              </span>
              <span class="tg-menu-header-label">{{ item.label }}</span>
            </div>

            <button
              v-else-if="item.toggle"
              type="button"
              @click="selectToggle(item)"
              class="tg-menu-item"
            >
              <span v-if="item.icon" class="tg-menu-item-glyph" aria-hidden="true">
                <svg class="tg-menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path v-for="(d, di) in iconPaths(item.icon)" :key="di" :d="d" />
                </svg>
              </span>
              <span class="tg-menu-item-label">{{ item.label }}</span>
              <MessengerToggle :model-value="!!item.checked" @update:modelValue="onToggle(item, $event)" />
            </button>

            <button
              v-else-if="item.disabled"
              type="button"
              disabled
              class="tg-menu-item is-disabled"
            >
              <span v-if="item.icon" class="tg-menu-item-glyph" aria-hidden="true">
                <svg class="tg-menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path v-for="(d, di) in iconPaths(item.icon)" :key="di" :d="d" />
                </svg>
              </span>
              <span class="tg-menu-item-label">{{ item.label }}</span>
            </button>

            <button
              v-else
              type="button"
              tabindex="-1"
              @click.prevent.stop="select(item, $event)"
              :class="['tg-menu-item', item.danger ? 'is-danger' : '']"
            >
              <span v-if="item.icon" class="tg-menu-item-glyph" aria-hidden="true">
                <svg class="tg-menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                  <path v-for="(d, di) in iconPaths(item.icon)" :key="di" :d="d" />
                </svg>
              </span>
              <span class="tg-menu-item-label">{{ item.label }}</span>
              <svg v-if="item.chevron" class="tg-menu-item-chevron rtl:rotate-180 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span v-else-if="item.trailing" class="tg-menu-item-trailing pointer-events-none">{{ item.trailing }}</span>
            </button>
          </template>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { mapState } from "@/composables/useStore";
import MessengerToggle from './MessengerToggle.vue';
import { fontFamily, defaultFontId } from './appearance';
import { ICONS } from './messengerIcons';

export default {
  components: { MessengerToggle },
  props: {
    visible: { type: Boolean, default: false },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    items: { type: Array, default: () => [] },
    preferAbove: { type: Boolean, default: false },
  },
  emits: ['close', 'select'],
  data() {
    return {
      pos: { x: 0, y: 0 },
      box: { maxWidth: null, maxHeight: null },
      openedAt: 0,
      anchorX: 0,
      anchorY: 0,
    };
  },
  computed: {
    ...mapState('messenger', ['fontSlots']),
    /** Teleported to body — inherit menu font from store, not shell CSS vars. */
    menuFontFamily() {
      return fontFamily(this.fontSlots?.menu || this.fontSlots?.message || defaultFontId());
    },
    /** Keep clear of screen edges. */
    edgePad() {
      return 12;
    },
    /** Soft-keyboard band below the visual viewport (layout px). */
    keyboardBottomInset() {
      if (typeof window === 'undefined') return 0;
      const vv = window.visualViewport;
      if (!vv) return 0;
      return Math.max(0, Math.round(window.innerHeight - vv.height - (vv.offsetTop || 0)));
    },
    /** Mobile: centered soft-bias menu. Desktop: anchor near the message. */
    isMobileMenu() {
      if (typeof window === 'undefined') return true;
      const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
      const narrow = window.innerWidth < 640;
      return !!(coarse || narrow);
    },
    menuBoxStyle() {
      const style = {
        position: 'fixed',
        zIndex: 2000000201,
        fontFamily: this.menuFontFamily,
        '--msg-font-menu': this.menuFontFamily,
      };
      if (this.isMobileMenu) {
        // Bottom sheet — sit on the VISUAL viewport bottom (above soft keyboard),
        // not layout bottom:0 which paints under the keyboard.
        const inset = this.keyboardBottomInset;
        style.left = '0';
        style.right = '0';
        style.bottom = `${inset}px`;
        style.top = 'auto';
        style.width = '100%';
        style.maxWidth = '100%';
        if (this.box.maxHeight != null) {
          style.maxHeight = Math.floor(this.box.maxHeight) + 'px';
          style.overflowY = 'auto';
        }
        return style;
      }
      style.top = Math.round(this.pos.y) + 'px';
      style.left = Math.round(this.pos.x) + 'px';
      style.right = 'auto';
      style.bottom = 'auto';
      if (this.box.maxWidth != null) style.maxWidth = Math.floor(this.box.maxWidth) + 'px';
      if (this.box.maxHeight != null) {
        style.maxHeight = Math.floor(this.box.maxHeight) + 'px';
        style.overflowY = 'auto';
      }
      return style;
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.openedAt = Date.now();
        this.anchorX = this.x;
        this.anchorY = this.y;
        this.pos = { x: this.x, y: this.y };
        this.schedulePlace();
        window.addEventListener('scroll', this.onScroll, true);
        window.addEventListener('keydown', this.onKey);
        this.bindViewport();
      } else {
        this.unbindListeners();
      }
    },
    x(val) {
      if (!this.visible) return;
      this.anchorX = val;
      this.schedulePlace();
    },
    y(val) {
      if (!this.visible) return;
      this.anchorY = val;
      this.schedulePlace();
    },
    items() {
      if (!this.visible) return;
      this.schedulePlace();
    },
  },
  beforeUnmount() {
    this.unbindListeners();
  },
  methods: {
    iconPaths(name) {
      return ICONS[name] || [];
    },
    schedulePlace() {
      this.$nextTick(() => {
        this.placeAndClamp();
        requestAnimationFrame(() => this.placeAndClamp());
      });
    },
    bindViewport() {
      const vv = window.visualViewport;
      if (!vv) return;
      vv.addEventListener('resize', this.onViewportChange);
      vv.addEventListener('scroll', this.onViewportChange);
    },
    unbindListeners() {
      window.removeEventListener('scroll', this.onScroll, true);
      window.removeEventListener('keydown', this.onKey);
      const vv = window.visualViewport;
      if (!vv) return;
      vv.removeEventListener('resize', this.onViewportChange);
      vv.removeEventListener('scroll', this.onViewportChange);
    },
    visibleBounds() {
      // Prefer visualViewport so menus size/clamp above the soft keyboard.
      const vv = typeof window !== 'undefined' ? window.visualViewport : null;
      if (vv && Number.isFinite(vv.width) && Number.isFinite(vv.height)) {
        return {
          left: Math.round(vv.offsetLeft || 0),
          top: Math.round(vv.offsetTop || 0),
          width: Math.round(vv.width),
          height: Math.round(vv.height),
        };
      }
      return {
        left: 0,
        top: 0,
        width: window.innerWidth || document.documentElement.clientWidth || 360,
        height: window.innerHeight || document.documentElement.clientHeight || 640,
      };
    },
    placeAndClamp() {
      const el = this.$refs.menu;
      if (!el || typeof window === 'undefined') return;
      const pad = this.edgePad;
      const vb = this.visibleBounds();
      const maxW = Math.max(160, vb.width - pad * 2);
      const maxH = Math.max(120, vb.height - pad * 2);
      this.box = { maxWidth: maxW, maxHeight: maxH };

      if (this.isMobileMenu) {
        // Bottom sheet above the soft keyboard (visual viewport), not under it.
        const sheetMax = Math.min(maxH, Math.floor(vb.height * 0.92));
        const inset = this.keyboardBottomInset;
        this.box = { maxWidth: vb.width, maxHeight: sheetMax };
        el.style.maxWidth = '100%';
        el.style.width = '100%';
        el.style.maxHeight = Math.floor(sheetMax) + 'px';
        el.style.overflowY = 'auto';
        el.style.minWidth = '0';
        el.style.bottom = `${inset}px`;
        this.pos = { x: 0, y: vb.top + vb.height };
        return;
      }

      // Prefer a modest bubble context menu; never exceed the safe viewport inset.
      const preferMinW = Math.min(260, maxW);
      el.style.maxWidth = Math.floor(maxW) + 'px';
      el.style.maxHeight = Math.floor(maxH) + 'px';
      el.style.overflowY = 'auto';
      el.style.minWidth = Math.floor(preferMinW) + 'px';
      el.style.width = 'max-content';

      const rect = el.getBoundingClientRect();
      const w = Math.min(Math.max(rect.width || el.offsetWidth || preferMinW, preferMinW), maxW);
      const h = Math.min(rect.height || el.offsetHeight || 160, maxH);

      const ax = Number(this.anchorX) || (vb.left + vb.width / 2);
      const ay = Number(this.anchorY) || (vb.top + vb.height / 2);

      let x = ax - w / 2;
      let y;
      if (this.preferAbove) {
        y = ay - h - 12;
      } else {
        y = ay - h * 0.35;
      }

      const minX = vb.left + pad;
      const maxX = vb.left + vb.width - w - pad;
      const minY = vb.top + pad;
      const maxY = vb.top + vb.height - h - pad;
      this.pos = {
        x: Math.round(Math.min(Math.max(x, minX), Math.max(minX, maxX))),
        y: Math.round(Math.min(Math.max(y, minY), Math.max(minY, maxY))),
      };
    },
    clamp() {
      this.placeAndClamp();
    },
    select(item, e) {
      if (e) {
        try { e.preventDefault(); } catch (err) { /* noop */ }
        try { e.stopPropagation(); } catch (err) { /* noop */ }
      }
      this.$emit('select', item);
      if (!item.keepOpen) {
        this.$emit('close');
      } else {
        this.openedAt = Date.now();
        this.schedulePlace();
      }
    },
    selectToggle(item) {
      this.$emit('select', item);
    },
    onToggle(item, value) {
      this.$emit('select', { ...item, checked: value });
    },
    onViewportChange() {
      if (!this.visible) return;
      this.schedulePlace();
    },
    onScroll(e) {
      if (Date.now() - this.openedAt < 700) return;
      const t = e && e.target;
      if (t === document || t === document.documentElement || t === document.body) return;
      if (this.$refs.menu && (t === this.$refs.menu || this.$refs.menu.contains(t))) return;
      this.$emit('close');
    },
    onKey(e) {
      if (e.key === 'Escape') this.$emit('close');
    },
    onBackdropClick() {
      if (Date.now() - this.openedAt < 480) return;
      this.$emit('close');
    },
    onBackdropContextMenu(e) {
      // Long-press opens the menu, then the delayed native `contextmenu` would
      // immediately close it — ignore briefly after open (same as click guard).
      if (Date.now() - this.openedAt < 700) {
        if (e?.preventDefault) e.preventDefault();
        return;
      }
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.ctx-menu-root {
  pointer-events: auto;
  background: transparent;
}
.ctx-menu-root--sheet {
  background: rgba(0, 0, 0, 0.28);
  display: flex;
  align-items: flex-end;
  justify-content: stretch;
}
.ctx-menu-panel {
  max-width: none !important;
  box-sizing: border-box;
}
.ctx-menu-panel--sheet {
  border-radius: 16px 16px 0 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  padding-bottom: max(8px, env(safe-area-inset-bottom, 0px));
  box-shadow: 0 -8px 28px rgba(0, 0, 0, 0.18);
}
.ctx-sheet-handle {
  width: 36px;
  height: 4px;
  border-radius: 999px;
  background: rgba(120, 130, 140, 0.45);
  margin: 8px auto 4px;
}
.dark .ctx-sheet-handle {
  background: rgba(180, 190, 200, 0.35);
}

.ctx-fade-enter-active {
  transition: opacity var(--tg-dur-fast, 140ms) ease;
}
.ctx-fade-leave-active {
  transition: opacity var(--tg-dur-instant, 100ms) ease;
}
.ctx-fade-enter-active .ctx-menu-panel,
.ctx-fade-leave-active .ctx-menu-panel {
  transition: transform var(--tg-dur-med, 240ms) var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1)),
    opacity var(--tg-dur-fast, 140ms) ease;
}
.ctx-fade-leave-active .ctx-menu-panel--sheet {
  transition: transform var(--tg-dur-normal, 200ms) var(--tg-ease-emphasized, cubic-bezier(0.2, 0, 0, 1)),
    opacity var(--tg-dur-fast, 140ms) ease;
}
.ctx-fade-enter-from,
.ctx-fade-leave-to {
  opacity: 0;
}
.ctx-fade-enter-from .ctx-menu-panel:not(.ctx-menu-panel--sheet),
.ctx-fade-leave-to .ctx-menu-panel:not(.ctx-menu-panel--sheet) {
  opacity: 0;
  transform: scale(0.94) translateY(6px);
}
.ctx-fade-enter-from .ctx-menu-panel--sheet,
.ctx-fade-leave-to .ctx-menu-panel--sheet {
  transform: translateY(100%);
}
</style>
