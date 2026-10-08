<template>
  <BottomSheetDrawer
    :model-value="open"
    :initial-height="0.9"
    :min-height="0.4"
    :max-height="0.95"
    :auto-close-on-min="true"
    :close-on-backdrop="true"
    :lock-scroll="true"
    backdrop-z-class="z-[2000000030]"
    panel-z-class="z-[2000000040]"
    :panel-class="sheetPanelClass"
    content-class="px-0 pb-6 flex flex-col min-h-0"
    :backdrop-class="sheetBackdropClass"
    @update:modelValue="(v) => { if (!v) $emit('close'); }"
    @close="$emit('close')"
  >
    <div class="px-2 pb-3 border-b border-gray-100 dark:border-white/5 flex-shrink-0 flex items-center gap-1">
      <button
        v-if="view !== 'main'"
        @click="goBack"
        class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-300 transition"
        :title="$t('messenger.back')"
      >
      <svg class="w-5 h-5 ltr:rotate-180" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M4 12h16m0 0l-6 6m6-6l-6-6"></path>
      </svg>
      </button>
      <h3 class="font-extrabold text-gray-800 dark:text-gray-100 px-2">{{ viewTitle }}</h3>
    </div>

    <div class="flex-1 overflow-y-auto custom-scrollbar min-h-0">
      <!-- MAIN MENU -->
      <template v-if="view === 'main'">
        <button
          v-for="row in menuRows"
          :key="row.view"
          @click="row.action ? row.action() : (view = row.view)"
          class="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-white/5 transition text-start border-b border-gray-50 dark:border-white/5"
        >
          <span class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" :class="row.iconBg">
            <svg class="w-5 h-5" :class="row.iconColor" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" :d="row.icon" /></svg>
          </span>
          <span class="flex-1 text-sm font-semibold text-gray-800 dark:text-gray-100">{{ $t(row.label) }}</span>
          <svg class="w-4 h-4 text-gray-300 rtl:rotate-180" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
        </button>
      </template>

      <!-- Profile -->
      <section v-if="view === 'profile'" class="p-5">
        <div class="flex flex-col items-center gap-3">
          <div class="relative">
            <img v-if="avatar" :src="avatar" class="w-24 h-24 rounded-full object-cover" />
            <div v-else class="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-2xl font-bold text-white">{{ initials }}</div>
            <button
              @click="$refs.avatarInput.click()"
              class="absolute bottom-0 rtl:left-0 ltr:right-0 w-8 h-8 rounded-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 flex items-center justify-center shadow-lg"
              :title="$t('messenger.changePhoto')"
            >
              <svg v-if="!uploading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><circle cx="12" cy="13" r="3" stroke-width="2"/></svg>
              <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
            </button>
            <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="onAvatarChange" />
          </div>
        </div>

        <div class="mt-4 space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-gray-400 mb-1">{{ $t('messenger.firstName') }}</label>
              <input v-model="form.first_name" class="w-full px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-white/5 border-0 focus:ring-2 focus:ring-yellow-400 focus:outline-none text-gray-800 dark:text-gray-100" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-gray-400 mb-1">{{ $t('messenger.lastName') }}</label>
              <input v-model="form.last_name" class="w-full px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-white/5 border-0 focus:ring-2 focus:ring-yellow-400 focus:outline-none text-gray-800 dark:text-gray-100" />
            </div>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-gray-400 mb-1">{{ $t('messenger.username') }}</label>
            <input v-model="form.username" class="w-full px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-white/5 border-0 focus:ring-2 focus:ring-yellow-400 focus:outline-none text-gray-800 dark:text-gray-100" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-gray-400 mb-1">{{ $t('messenger.bio') }}</label>
            <textarea
              :value="form.bio"
              rows="1"
              wrap="off"
              maxlength="255"
              :placeholder="$t('messenger.bioPlaceholder')"
              class="w-full px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-white/5 border-0 focus:ring-2 focus:ring-yellow-400 focus:outline-none text-gray-800 dark:text-gray-100 messenger-hline"
              @keydown.enter.prevent
              @wheel="onHlineWheel"
              @input="onBioInput"
            ></textarea>
          </div>
          <button
            @click="saveProfile"
            :disabled="savingProfile"
            class="w-full py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-gray-900 font-bold text-sm transition"
          >
            {{ savingProfile ? '...' : $t('messenger.saveProfile') }}
          </button>
        </div>
      </section>

      <!-- Privacy & Security -->
      <section v-if="view === 'privacy'" class="pt-2 pb-5">
        <p class="menu-section-title">{{ $t('messenger.privacy') }}</p>
        <div class="tg-card mx-3 mb-3 overflow-hidden">
          <button
            v-for="(row, idx) in privacyRows"
            :key="row.key"
            type="button"
            :class="['menu-row w-full text-start', idx < privacyRows.length - 1 ? 'border-b border-black/[0.06] dark:border-white/[0.06]' : '']"
            @click="privacyKey = row.key; view = 'privacyDetail'"
          >
            <span class="menu-row-label">{{ $t(row.labelKey) }}</span>
            <span class="text-[13px] text-[#a2acb4] me-1">{{ privacyRuleLabel(row.key) }}</span>
            <svg class="menu-row-chevron rtl:rotate-180" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
        <div class="menu-settings-group mb-3">
          <div class="menu-settings-row menu-settings-row-last">
            <span>{{ $t('messenger.showEmail') }}</span>
            <input type="checkbox" :checked="settings.show_email" @change="toggleSetting('show_email', $event.target.checked)" class="toggle toggle-warning toggle-sm" />
          </div>
        </div>
        <div class="tg-card mx-3 overflow-hidden">
          <button
            type="button"
            class="menu-row"
            @click="$emit('open-blocked')"
          >
            <span class="menu-row-label">{{ $t('messenger.blockedUsers') }}</span>
            <svg class="menu-row-chevron rtl:rotate-180" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </section>

      <section v-else-if="view === 'privacyDetail' && privacyKey" class="p-0">
        <PrivacyRulePanel ref="privacyRulePanel" :setting-key="privacyKey" />
      </section>

      <!-- Appearance -->
      <section v-if="view === 'appearance'" class="p-5">
        <p class="text-[11px] font-bold text-gray-400 uppercase mb-3">{{ $t('messenger.appearance') }}</p>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="opt in themeOptions"
            :key="opt.value"
            @click="applyTheme(opt.value)"
            :class="[
              'py-2 rounded-lg text-xs font-bold transition border-2',
              theme === opt.value ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-400/10 text-gray-800 dark:text-gray-100' : 'border-transparent bg-gray-100 dark:bg-white/5 text-gray-500',
            ]"
          >
            {{ $t('messenger.theme_' + opt.value) }}
          </button>
        </div>
      </section>

      <!-- Language -->
      <section v-if="view === 'language'" class="p-5">
        <p class="text-[11px] font-bold text-gray-400 uppercase mb-3">{{ $t('messenger.language') }}</p>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="lang in langOptions"
            :key="lang.locale"
            @click="applyLocale(lang)"
            :class="[
              'py-2 rounded-lg text-sm font-bold transition border-2',
              currentLocale === lang.locale ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-400/10 text-gray-800 dark:text-gray-100' : 'border-transparent bg-gray-100 dark:bg-white/5 text-gray-500',
            ]"
          >
            {{ lang.label }}
          </button>
        </div>
      </section>

      <!-- Chat settings -->
      <section v-if="view === 'chat'" class="p-5">
        <p class="text-[11px] font-bold text-gray-400 uppercase mb-3">{{ $t('messenger.chatSettings') }}</p>
        <label class="flex items-center justify-between py-2 cursor-pointer">
          <span class="text-sm text-gray-700 dark:text-gray-200">{{ $t('messenger.enterToSend') }}</span>
          <input type="checkbox" :checked="settings.enter_to_send" @change="toggleSetting('enter_to_send', $event.target.checked)" class="toggle toggle-warning toggle-sm" />
        </label>
        <label class="flex items-center justify-between py-2 cursor-pointer">
          <span class="text-sm text-gray-700 dark:text-gray-200">{{ $t('messenger.quoteWithTitle') }}</span>
          <input type="checkbox" :checked="settings.quote_with_title" @change="toggleSetting('quote_with_title', $event.target.checked)" class="toggle toggle-warning toggle-sm" />
        </label>
        <label class="flex items-center justify-between py-2 cursor-pointer">
          <span class="text-sm text-gray-700 dark:text-gray-200">{{ $t('messenger.forwardTapToChat') }}</span>
          <input type="checkbox" :checked="settings.forward_tap_to_chat" @change="toggleSetting('forward_tap_to_chat', $event.target.checked)" class="toggle toggle-warning toggle-sm" />
        </label>
        <p class="text-[11px] font-bold text-gray-400 uppercase mt-4 mb-2">{{ $t('messenger.autoDownloadTitle') }}</p>
        <p class="text-[12px] text-gray-500 dark:text-gray-400 mb-2 leading-snug">{{ $t('messenger.autoDownloadHint') }}</p>
        <label class="flex items-center justify-between py-2 cursor-pointer">
          <span class="text-sm text-gray-700 dark:text-gray-200">{{ $t('messenger.autoDownloadPhotos') }}</span>
          <input type="checkbox" :checked="settings.auto_download_photos" @change="toggleSetting('auto_download_photos', $event.target.checked)" class="toggle toggle-warning toggle-sm" />
        </label>
        <label class="flex items-center justify-between py-2 cursor-pointer">
          <span class="text-sm text-gray-700 dark:text-gray-200">{{ $t('messenger.autoDownloadVideos') }}</span>
          <input type="checkbox" :checked="settings.auto_download_videos" @change="toggleSetting('auto_download_videos', $event.target.checked)" class="toggle toggle-warning toggle-sm" />
        </label>
        <label class="flex items-center justify-between py-2 cursor-pointer">
          <span class="text-sm text-gray-700 dark:text-gray-200">{{ $t('messenger.autoDownloadFiles') }}</span>
          <input type="checkbox" :checked="settings.auto_download_files" @change="toggleSetting('auto_download_files', $event.target.checked)" class="toggle toggle-warning toggle-sm" />
        </label>
        <label class="flex items-center justify-between py-2 cursor-pointer">
          <span class="text-sm text-gray-700 dark:text-gray-200">{{ $t('messenger.autoDownloadVoice') }}</span>
          <input type="checkbox" :checked="settings.auto_download_voice" @change="toggleSetting('auto_download_voice', $event.target.checked)" class="toggle toggle-warning toggle-sm" />
        </label>
        <label class="flex items-center justify-between py-2 cursor-pointer">
          <span class="text-sm text-gray-700 dark:text-gray-200">{{ $t('messenger.autoDownloadAudio') }}</span>
          <input type="checkbox" :checked="settings.auto_download_audio" @change="toggleSetting('auto_download_audio', $event.target.checked)" class="toggle toggle-warning toggle-sm" />
        </label>
        <div class="py-2">
          <p class="text-sm text-gray-700 dark:text-gray-200 mb-2">{{ $t('messenger.wallpaper') }}</p>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="w in wallpapers"
              :key="w.id"
              @click="toggleSetting('wallpaper', w.id)"
              :class="['h-14 rounded-lg border-2 transition', w.class, settings.wallpaper === w.id ? 'border-yellow-400' : 'border-transparent']"
            ></button>
          </div>
        </div>
      </section>
    </div>
  </BottomSheetDrawer>
</template>

<script>
import { mapState } from "@/composables/useStore";
import BottomSheetDrawer from '@/views/components/common/BottomSheetDrawer.vue';
import { getMyProfile, updateMyProfile, uploadProfilePic } from '@/services/messenger';
import { toSingleLine, onHorizontalWheel } from './textHelpers';
import { MESSENGER_SHEET_PANEL, MESSENGER_SHEET_BACKDROP } from './sheetStyles';
import { avatarInitials } from './avatarInitials';
import PrivacyRulePanel from './PrivacyRulePanel.vue';

export default {
  components: { BottomSheetDrawer, PrivacyRulePanel },
  props: {
    open: { type: Boolean, default: false },
  },
  emits: ['close', 'open-blocked'],
  data() {
    return {
      view: 'main',
      privacyKey: null,
      form: { first_name: '', last_name: '', username: '', bio: '' },
      savingProfile: false,
      uploading: false,
      theme: localStorage.getItem('theme') || 'system',
      currentLocale: localStorage.getItem('locale') || 'fa',
      themeOptions: [
        { value: 'system' },
        { value: 'light' },
        { value: 'dark' },
      ],
      langOptions: [
        { locale: 'fa', dir: 'rtl', label: 'فارسی' },
        { locale: 'en', dir: 'ltr', label: 'English' },
      ],
      wallpapers: [
        { id: 'default', class: 'bg-[#e7ebf0] dark:bg-[#0e1621]' },
        { id: 'plain', class: 'bg-white dark:bg-[#17212b]' },
        { id: 'warm', class: 'bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-[#2a2410] dark:to-[#1a1505]' },
        { id: 'cool', class: 'bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-[#0e1a2a] dark:to-[#0a1020]' },
      ],
    };
  },
  computed: {
    sheetPanelClass() { return MESSENGER_SHEET_PANEL; },
    sheetBackdropClass() { return MESSENGER_SHEET_BACKDROP; },
    ...mapState('messenger', ['settings']),
    ...mapState('auth', { userInfo: (s) => s.status.userInfo }),
    avatar() {
      return this.userInfo?.profile_pic || null;
    },
    initials() {
      return avatarInitials(this.userInfo);
    },
    privacyRows() {
      return [
        { key: 'last_seen', labelKey: 'messenger.privacyLastSeen' },
        { key: 'online', labelKey: 'messenger.privacyOnline' },
        { key: 'profile_photo', labelKey: 'messenger.privacyProfilePhoto' },
        { key: 'bio', labelKey: 'messenger.privacyBio' },
        { key: 'phone', labelKey: 'messenger.privacyPhone' },
      ];
    },
    menuRows() {
      return [
        { view: 'profile', label: 'messenger.editProfile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', iconBg: 'bg-blue-50 dark:bg-blue-900/20', iconColor: 'text-blue-500' },
        { view: 'privacy', label: 'messenger.privacySecurity', icon: 'M12 11c0-1.105.895-2 2-2s2 .895 2 2M5 13a2 2 0 012-2h10a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6zM12 3a5 5 0 00-5 5v3h10V8a5 5 0 00-5-5z', iconBg: 'bg-green-50 dark:bg-green-900/20', iconColor: 'text-green-500' },
        { view: 'appearance', label: 'messenger.appearance', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 15V5a2 2 0 00-2-2h-4M7 17h.01', iconBg: 'bg-purple-50 dark:bg-purple-900/20', iconColor: 'text-purple-500' },
        { view: 'chat', label: 'messenger.chatSettings', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4-.8L3 20l1.3-3.9C3.5 15 3 13.6 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', iconBg: 'bg-yellow-50 dark:bg-yellow-900/20', iconColor: 'text-yellow-500' },
        { view: 'language', label: 'messenger.language', icon: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129', iconBg: 'bg-pink-50 dark:bg-pink-900/20', iconColor: 'text-pink-500' },
        { view: 'blocked', label: 'messenger.blockedUsers', icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636', iconBg: 'bg-red-50 dark:bg-red-900/20', iconColor: 'text-red-500', action: () => this.$emit('open-blocked') },
      ];
    },
    viewTitle() {
      if (this.view === 'privacyDetail' && this.privacyKey) {
        const labels = {
          last_seen: 'messenger.privacyLastSeen',
          online: 'messenger.privacyOnline',
          profile_photo: 'messenger.privacyProfilePhoto',
          bio: 'messenger.privacyBio',
          phone: 'messenger.privacyPhone',
        };
        return this.$t(labels[this.privacyKey] || 'messenger.privacy');
      }
      const map = {
        main: 'messenger.settings',
        profile: 'messenger.editProfile',
        privacy: 'messenger.privacySecurity',
        appearance: 'messenger.appearance',
        chat: 'messenger.chatSettings',
        language: 'messenger.language',
      };
      return this.$t(map[this.view] || 'messenger.settings');
    },
  },
  watch: {
    open(val) {
      if (val) {
        this.view = 'main';
        this.privacyKey = null;
        this.loadProfile();
        this.$store.dispatch('messenger/fetchContacts').catch(() => {});
      }
    },
  },
  methods: {
    goBack() {
      if (this.view === 'privacyDetail') {
        if (this.$refs.privacyRulePanel?.handleBack?.()) return;
        this.view = 'privacy';
        this.privacyKey = null;
        return;
      }
      this.view = 'main';
    },
    privacyRuleLabel(key) {
      const rule = this.settings?.privacy?.[key]?.rule || 'everybody';
      const map = {
        everybody: 'messenger.privacyEverybody',
        contacts: 'messenger.privacyMyContacts',
        nobody: 'messenger.privacyNobody',
      };
      return this.$t(map[rule] || 'messenger.privacyEverybody');
    },
    async loadProfile() {
      try {
        const p = await getMyProfile();
        this.form = {
          first_name: p.first_name || '',
          last_name: p.last_name || '',
          username: p.username || '',
          bio: toSingleLine(p.bio || ''),
        };
      } catch (e) {
        const u = this.userInfo || {};
        this.form = {
          first_name: u.first_name || '',
          last_name: u.last_name || '',
          username: u.username || '',
          bio: toSingleLine(u.bio || ''),
        };
      }
    },
    onBioInput(e) {
      this.form.bio = toSingleLine(e.target.value);
    },
    onHlineWheel: onHorizontalWheel,
    async saveProfile() {
      this.savingProfile = true;
      try {
        await updateMyProfile({ ...this.form, bio: toSingleLine(this.form.bio) });
        await this.$store.dispatch('auth/getUser');
      } catch (e) { /* noop */ } finally {
        this.savingProfile = false;
      }
    },
    async onAvatarChange(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      this.uploading = true;
      try {
        await uploadProfilePic(file);
        await this.$store.dispatch('auth/getUser');
      } catch (err) { /* noop */ } finally {
        this.uploading = false;
        e.target.value = '';
      }
    },
    applyTheme(value) {
      this.theme = value;
      if (value === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (value === 'light') {
        document.documentElement.classList.remove('dark');
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', value);
      document.documentElement.dispatchEvent(new Event('onChangeTheme'));
      this.$store.dispatch('messenger/saveSettings', { theme: value });
    },
    applyLocale(lang) {
      this.currentLocale = lang.locale;
      this.$i18n.locale = lang.locale;
      document.documentElement.dir = lang.dir;
      document.documentElement.lang = lang.locale;
      localStorage.setItem('direction', lang.dir);
      localStorage.setItem('locale', lang.locale);
      document.documentElement.dispatchEvent(new Event('onChangeLanguage'));
      this.$store.commit('messenger/APPLY_FONT_DIRECTION', lang.dir);
      this.$store.dispatch('messenger/saveSettings', { locale: lang.locale });
    },
    toggleSetting(key, value) {
      this.$store.dispatch('messenger/saveSettings', { [key]: value });
    },
  },
};
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}
</style>
