<template>
  <teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-[115]"
      @click="$emit('close')"
    >
      <!-- Primary menu (on mobile, "More" replaces this panel's content) -->
      <transition name="tg-pop">
        <div
          ref="primary"
          class="tg-menu absolute"
          :style="primaryStyle"
          @click.stop
        >
          <!-- Mobile: More submenu replaces primary content -->
          <template v-if="isMobile && showMore">
            <button type="button" class="tg-menu-item" @click="closeMore">
              <svg class="tg-menu-item-icon rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                <path v-for="(d, di) in menuIcons.back" :key="'ab'+di" stroke-linecap="round" stroke-linejoin="round" :d="d" />
              </svg>
              <span class="tg-menu-item-label">{{ $t('messenger.back') }}</span>
            </button>

            <div class="tg-menu-divider" />

            <button type="button" class="tg-menu-item" @click="toggleDark">
              <svg class="tg-menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                <path v-for="(d, di) in menuIcons.moon" :key="'am'+di" stroke-linecap="round" stroke-linejoin="round" :d="d" />
              </svg>
              <span class="tg-menu-item-label">{{ $t('messenger.nightMode') }}</span>
              <MessengerToggle :model-value="isDark" @update:modelValue="setDark" />
            </button>

            <button type="button" class="tg-menu-item" @click="toggleAnimations">
              <svg class="tg-menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                <path v-for="(d, di) in menuIcons.animations" :key="'aa'+di" stroke-linecap="round" stroke-linejoin="round" :d="d" />
              </svg>
              <span class="tg-menu-item-label">{{ $t('messenger.animations') }}</span>
              <MessengerToggle :model-value="animations" @update:modelValue="setAnimations" />
            </button>

            <div class="tg-menu-divider" />

            <button type="button" class="tg-menu-item" @click="pick('exit')">
              <svg class="tg-menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                <path v-for="(d, di) in menuIcons.home" :key="'ah'+di" stroke-linecap="round" stroke-linejoin="round" :d="d" />
              </svg>
              <span class="tg-menu-item-label">{{ $t('messenger.home') }}</span>
            </button>

            <p class="px-4 py-2 text-[11px] text-center" style="color: var(--tg-text-secondary)">Zanburak Messenger</p>
          </template>

          <!-- Primary list -->
          <template v-else>
            <button type="button" class="tg-menu-account" @click="pick('profile')" @mouseenter="onPrimaryHoverAway">
              <MessengerAvatar :user="user" size="md" />
              <div class="min-w-0 flex-1">
                <div class="tg-menu-account-name">{{ displayName }}</div>
                <div v-if="user?.username" class="tg-menu-account-status">@{{ user.username }}</div>
              </div>
            </button>

            <div class="tg-menu-divider" />

            <button
              v-for="row in primaryRows"
              :key="row.value"
              :ref="row.value === 'more' ? 'moreRow' : undefined"
              type="button"
              :disabled="row.disabled"
              :class="['tg-menu-item', row.disabled ? 'is-disabled' : '', (row.value === 'more' && showMore) ? 'is-active' : '']"
              @click="pick(row.value)"
              @mouseenter="onPrimaryRowEnter(row)"
            >
              <svg class="tg-menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                <path v-for="(d, di) in row.icon" :key="di" stroke-linecap="round" stroke-linejoin="round" :d="d" />
              </svg>
              <span class="tg-menu-item-label">{{ row.label }}</span>
              <svg v-if="row.chevron" class="w-4 h-4 flex-shrink-0 rtl:rotate-180" style="color: var(--tg-text-secondary)" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </template>
        </div>
      </transition>

      <!-- Desktop only: More as side flyout -->
      <transition name="tg-pop">
        <div
          v-if="showMore && !isMobile"
          ref="more"
          class="tg-menu absolute"
          :style="moreStyle"
          @click.stop
          @mouseenter="keepMore"
        >
          <button type="button" class="tg-menu-item" @click="toggleDark">
            <svg class="tg-menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <path v-for="(d, di) in menuIcons.moon" :key="'dm'+di" stroke-linecap="round" stroke-linejoin="round" :d="d" />
            </svg>
            <span class="tg-menu-item-label">{{ $t('messenger.nightMode') }}</span>
            <MessengerToggle :model-value="isDark" @update:modelValue="setDark" />
          </button>

          <button type="button" class="tg-menu-item" @click="toggleAnimations">
            <svg class="tg-menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <path v-for="(d, di) in menuIcons.animations" :key="'da'+di" stroke-linecap="round" stroke-linejoin="round" :d="d" />
            </svg>
            <span class="tg-menu-item-label">{{ $t('messenger.animations') }}</span>
            <MessengerToggle :model-value="animations" @update:modelValue="setAnimations" />
          </button>

          <div class="tg-menu-divider" />

          <button type="button" class="tg-menu-item" @click="pick('exit')">
            <svg class="tg-menu-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
              <path v-for="(d, di) in menuIcons.home" :key="'dh'+di" stroke-linecap="round" stroke-linejoin="round" :d="d" />
            </svg>
            <span class="tg-menu-item-label">{{ $t('messenger.home') }}</span>
          </button>

          <p class="px-4 py-2 text-[11px] text-center" style="color: var(--tg-text-secondary)">Zanburak Messenger</p>
        </div>
      </transition>
    </div>
  </teleport>
</template>

<script>
import { mapState } from "@/composables/useStore";
import MessengerAvatar from './MessengerAvatar.vue';
import MessengerToggle from './MessengerToggle.vue';
import { ICONS as TG_ICONS } from './messengerIcons';

/** Telegram menu glyph set (same paths / menuIconFg via CSS). */
const ICONS = {
  plus: TG_ICONS.plus,
  user: TG_ICONS.user,
  bookmark: TG_ICONS.bookmark,
  users: TG_ICONS.users,
  settings: TG_ICONS.settings,
  // Filled dots read better than stroke dots at menu size.
  more: [
    'M6.5 12C6.5 13.1046 5.60457 14 4.5 14C3.39543 14 2.5 13.1046 2.5 12C2.5 10.8954 3.39543 10 4.5 10C5.60457 10 6.5 10.8954 6.5 12Z',
    'M13.5 12C13.5 13.1046 12.6046 14 11.5 14C10.3954 14 9.5 13.1046 9.5 12C9.5 10.8954 10.3954 10 11.5 10C12.6046 10 13.5 10.8954 13.5 12Z',
    'M20.5 12C20.5 13.1046 19.6046 14 18.5 14C17.3954 14 16.5 13.1046 16.5 12C16.5 10.8954 17.3954 10 18.5 10C19.6046 10 20.5 10.8954 20.5 12Z',
  ],
  back: TG_ICONS.back,
  moon: TG_ICONS.moon,
  animations: TG_ICONS.animations,
  home: TG_ICONS.home,
};

const MOBILE_MQ = '(max-width: 767px)';

export default {
  components: { MessengerAvatar, MessengerToggle },
  props: {
    visible: { type: Boolean, default: false },
    anchorRect: { type: Object, default: null },
  },
  emits: ['close', 'navigate'],
  data() {
    return {
      showMore: false,
      isMobile: typeof window !== 'undefined' && window.matchMedia(MOBILE_MQ).matches,
      primaryPos: { x: 0, y: 0 },
      morePos: { x: 0, y: 0 },
      isDark: typeof document !== 'undefined' && document.documentElement.classList.contains('dark'),
      animations: typeof localStorage !== 'undefined' ? localStorage.getItem('messenger_animations') !== '0' : true,
    };
  },
  computed: {
    ...mapState('auth', { user: (s) => s.status.userInfo }),
    menuIcons() {
      return ICONS;
    },
    displayName() {
      const u = this.user || {};
      return (u.first_name || u.last_name)
        ? `${u.first_name || ''} ${u.last_name || ''}`.trim()
        : (u.username || '');
    },
    primaryStyle() {
      return { top: `${this.primaryPos.y}px`, left: `${this.primaryPos.x}px` };
    },
    moreStyle() {
      return { top: `${this.morePos.y}px`, left: `${this.morePos.x}px` };
    },
    primaryRows() {
      return [
        { value: 'add-account', label: this.$t('messenger.addAccount'), icon: ICONS.plus, disabled: true },
        { value: 'profile', label: this.$t('messenger.myProfile'), icon: ICONS.user },
        { value: 'saved', label: this.$t('messenger.savedMessages'), icon: ICONS.bookmark },
        { value: 'contacts', label: this.$t('messenger.contacts'), icon: ICONS.users },
        { value: 'communities', label: this.$t('messenger.myCommunities'), icon: ICONS.users },
        { value: 'settings', label: this.$t('messenger.settings'), icon: ICONS.settings },
        { value: 'more', label: this.$t('messenger.more'), icon: ICONS.more, chevron: true },
      ];
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.showMore = false;
        this.syncMobile();
        this.$nextTick(() => this.positionPrimary());
        window.addEventListener('keydown', this.onKey);
        window.addEventListener('resize', this.onResize);
      } else {
        window.removeEventListener('keydown', this.onKey);
        window.removeEventListener('resize', this.onResize);
      }
    },
    showMore() {
      if (!this.visible) return;
      this.$nextTick(() => {
        if (this.isMobile) this.positionPrimary();
        else if (this.showMore) this.positionMore();
      });
    },
  },
  mounted() {
    this.applyAnimations();
    this.syncMobile();
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onKey);
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    syncMobile() {
      this.isMobile = window.matchMedia(MOBILE_MQ).matches;
    },
    onResize() {
      const wasMobile = this.isMobile;
      this.syncMobile();
      if (wasMobile !== this.isMobile) this.showMore = false;
      this.$nextTick(() => {
        this.positionPrimary();
        if (this.showMore && !this.isMobile) this.positionMore();
      });
    },
    positionPrimary() {
      const rect = this.anchorRect;
      if (!rect) return;
      const pad = 8;
      const rtl = document.documentElement.dir === 'rtl';
      const el = this.$refs.primary;
      const w = el ? (el.offsetWidth || 240) : 240;
      const h = el ? (el.offsetHeight || 400) : 400;
      // Drop straight under the hamburger, aligned to the button's own side:
      // right-edge in RTL, left-edge in LTR.
      let x = rtl ? rect.right - w : rect.left;
      let y = rect.bottom + 6;
      if (x + w + pad > window.innerWidth) x = window.innerWidth - w - pad;
      if (x < pad) x = pad;
      if (y + h + pad > window.innerHeight) y = rect.top - h - 6;
      this.primaryPos = { x: Math.max(pad, x), y: Math.max(pad, y) };
    },
    positionMore() {
      const more = this.$refs.more;
      const primary = this.$refs.primary;
      const moreRowRef = this.$refs.moreRow;
      const moreRow = Array.isArray(moreRowRef) ? moreRowRef[0] : moreRowRef;
      if (!more || !primary || !moreRow) return;
      const pad = 8;
      const overlap = 3;
      const rtl = document.documentElement.dir === 'rtl';
      const pRect = primary.getBoundingClientRect();
      const rowRect = moreRow.getBoundingClientRect();
      const w = more.offsetWidth;
      const h = more.offsetHeight;

      // Open beside the primary menu on the natural reading side, next to the
      // "More" row — the primary stays visible (Telegram desktop behaviour).
      let x = rtl ? pRect.left - w + overlap : pRect.right - overlap;
      // If it overflows that side, flip to the other side.
      if (x + w + pad > window.innerWidth) x = pRect.left - w + overlap;
      if (x < pad) x = pRect.right - overlap;
      if (x + w + pad > window.innerWidth) x = window.innerWidth - w - pad;
      if (x < pad) x = pad;

      let y = rowRect.top - 6;
      if (y + h + pad > window.innerHeight) y = window.innerHeight - h - pad;
      this.morePos = { x: Math.max(pad, x), y: Math.max(pad, y) };
    },
    openMore() {
      if (this.moreCloseTimer) { clearTimeout(this.moreCloseTimer); this.moreCloseTimer = null; }
      if (this.showMore) return;
      this.showMore = true;
    },
    keepMore() {
      if (this.moreCloseTimer) { clearTimeout(this.moreCloseTimer); this.moreCloseTimer = null; }
    },
    closeMore() {
      if (!this.showMore) return;
      this.showMore = false;
    },
    onPrimaryHoverAway() {
      if (!this.isMobile) this.closeMore();
    },
    onPrimaryRowEnter(row) {
      if (this.isMobile) return;
      if (row.value === 'more') this.openMore();
      else this.closeMore();
    },
    pick(value) {
      if (value === 'more') {
        if (this.showMore) this.closeMore();
        else this.openMore();
        return;
      }
      this.$emit('navigate', value);
      this.$emit('close');
    },
    toggleDark() {
      this.setDark(!this.isDark);
    },
    setDark(val) {
      this.isDark = val;
      if (val) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', val ? 'dark' : 'light');
      document.documentElement.dispatchEvent(new Event('onChangeTheme'));
      this.$store.dispatch('messenger/saveSettings', { theme: val ? 'dark' : 'light' });
    },
    toggleAnimations() {
      this.setAnimations(!this.animations);
    },
    setAnimations(val) {
      this.animations = val;
      localStorage.setItem('messenger_animations', val ? '1' : '0');
      this.applyAnimations();
    },
    applyAnimations() {
      document.documentElement.classList.toggle('messenger-no-anim', !this.animations);
    },
    onKey(e) {
      if (e.key === 'Escape') {
        if (this.showMore) this.showMore = false;
        else this.$emit('close');
      }
    },
  },
};
</script>
