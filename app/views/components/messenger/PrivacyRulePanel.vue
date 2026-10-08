<template>
  <div class="pt-2 pb-5">
    <!-- Exception submenu (Always Allow / Never Allow) -->
    <template v-if="exceptionMode">
      <p class="px-5 pb-3 text-[13px] leading-5 text-[#707579] dark:text-[#a2acb4]">
        {{ exceptionMode === 'allow' ? $t('messenger.privacyAlwaysAllowHint') : $t('messenger.privacyNeverAllowHint') }}
      </p>

      <p class="px-5 pt-1 pb-1.5 text-[13px] font-medium text-[#3390ec]">
        {{ exceptionMode === 'allow' ? $t('messenger.privacyAlwaysAllow') : $t('messenger.privacyNeverAllow') }}
      </p>
      <div class="mx-3 mb-3 rounded-xl overflow-hidden bg-white dark:bg-[#17212b]">
        <div v-if="!activeList.length" class="px-4 py-10 text-center text-[14px] text-[#a2acb4]">
          {{ $t('messenger.privacyNoExceptions') }}
        </div>
        <div
          v-for="(u, idx) in activeList"
          :key="u.id"
          :class="['w-full flex items-center gap-2.5 py-1.5 ps-3 pe-2', idx < activeList.length - 1 ? 'border-b border-black/[0.06] dark:border-white/[0.06]' : '']"
        >
          <MessengerAvatar :user="u" size="sm" />
          <div class="flex-1 min-w-0 text-[13px] font-medium text-gray-900 dark:text-gray-100 truncate leading-snug">
            {{ displayName(u) }}
          </div>
          <button
            type="button"
            class="flex-shrink-0 px-3 py-1.5 text-[13px] font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
            @click="removeException(u.id)"
          >
            {{ $t('messenger.remove') }}
          </button>
        </div>
      </div>

      <p class="px-5 pt-1 pb-1.5 text-[13px] font-medium text-[#3390ec]">{{ $t('messenger.privacyAddException') }}</p>
      <div class="mx-3 rounded-xl overflow-hidden bg-white dark:bg-[#17212b]">
        <div class="px-3 py-2.5 border-b border-black/[0.06] dark:border-white/[0.06]">
          <div class="relative">
            <svg class="w-4 h-4 text-[#3390ec] absolute top-1/2 -translate-y-1/2 ltr:left-3.5 rtl:right-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input
              v-model="exceptionQuery"
              :placeholder="$t('messenger.searchContacts')"
              class="w-full ltr:pl-10 rtl:pr-10 pe-3 py-1.5 text-[13px] rounded-full bg-[#f4f4f5] dark:bg-[#0e1621] border-0 focus:outline-none focus:ring-2 focus:ring-[#3390ec]/30 text-gray-900 dark:text-gray-100 placeholder:text-[#a2acb4]"
            />
          </div>
        </div>
        <div v-if="!filteredAddable.length" class="px-4 py-10 text-center text-[14px] text-[#a2acb4]">
          {{ exceptionQuery ? $t('messenger.noResults') : $t('messenger.noContacts') }}
        </div>
        <button
          v-for="(ct, idx) in filteredAddable"
          :key="ct.id"
          type="button"
          :class="['w-full flex items-center gap-2.5 py-1.5 ps-3 pe-3 hover:bg-black/[0.04] dark:hover:bg-white/5 transition text-start', idx < filteredAddable.length - 1 ? 'border-b border-black/[0.06] dark:border-white/[0.06]' : '']"
          @click="addException(ct.contact_user)"
        >
          <MessengerAvatar :user="ct.contact_user" :name="ct.name" size="sm" :online="!!ct.contact_user?.is_online" />
          <div class="flex-1 min-w-0">
            <div class="text-[13px] font-medium text-gray-900 dark:text-gray-100 truncate leading-snug">{{ ct.name }}</div>
            <div v-if="ct.contact_user?.username" class="text-[12px] text-[#a2acb4] truncate leading-snug" dir="ltr">@{{ ct.contact_user.username }}</div>
          </div>
          <svg class="w-5 h-5 text-[#3390ec] flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
        </button>
      </div>
    </template>

    <!-- Main privacy rule screen -->
    <template v-else>
      <p class="px-5 pb-3 text-[13px] leading-5 text-[#707579] dark:text-[#a2acb4]">
        {{ hint }}
      </p>

      <div class="mx-3 mb-3 rounded-xl overflow-hidden bg-white dark:bg-[#17212b]">
        <button
          v-for="(opt, idx) in ruleOptions"
          :key="opt.value"
          type="button"
          :class="[
            'w-full flex items-center justify-between gap-3 px-4 py-[11px] text-start text-[15px] text-gray-900 dark:text-[#e8e8e8] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition',
            idx < ruleOptions.length - 1 ? 'border-b border-black/[0.06] dark:border-white/[0.06]' : '',
          ]"
          @click="setRule(opt.value)"
        >
          <span>{{ $t(opt.labelKey) }}</span>
          <svg v-if="currentRule === opt.value" class="w-5 h-5 text-[#3390ec] flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
        </button>
      </div>

      <p class="px-5 pt-2 pb-1.5 text-[13px] font-medium text-[#3390ec]">{{ $t('messenger.privacyExceptions') }}</p>
      <div class="mx-3 rounded-xl overflow-hidden bg-white dark:bg-[#17212b]">
        <button
          type="button"
          class="w-full flex items-center gap-3 px-[18px] py-[9px] text-start hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition border-b border-black/[0.06] dark:border-white/[0.06]"
          @click="openException('allow')"
        >
          <span class="flex-1 min-w-0 text-[15px] text-gray-900 dark:text-[#e8e8e8] truncate">{{ $t('messenger.privacyAlwaysAllow') }}</span>
          <span v-if="alwaysAllow.length" class="text-[13px] text-[#a2acb4] tabular-nums">{{ alwaysAllow.length }}</span>
          <svg class="w-4 h-4 text-[#c4c9cc] flex-shrink-0 rtl:rotate-180" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
        </button>
        <button
          type="button"
          class="w-full flex items-center gap-3 px-[18px] py-[9px] text-start hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition"
          @click="openException('deny')"
        >
          <span class="flex-1 min-w-0 text-[15px] text-gray-900 dark:text-[#e8e8e8] truncate">{{ $t('messenger.privacyNeverAllow') }}</span>
          <span v-if="neverAllow.length" class="text-[13px] text-[#a2acb4] tabular-nums">{{ neverAllow.length }}</span>
          <svg class="w-4 h-4 text-[#c4c9cc] flex-shrink-0 rtl:rotate-180" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from "@/composables/useStore";
import MessengerAvatar from './MessengerAvatar.vue';

const HINT_KEYS = {
  last_seen: 'messenger.privacyLastSeenHint',
  online: 'messenger.privacyOnlineHint',
  profile_photo: 'messenger.privacyProfilePhotoHint',
  bio: 'messenger.privacyBioHint',
  phone: 'messenger.privacyPhoneHint',
};

export default {
  name: 'PrivacyRulePanel',
  components: { MessengerAvatar },
  props: {
    settingKey: { type: String, required: true },
  },
  emits: ['exception-mode'],
  data() {
    return {
      exceptionMode: null,
      exceptionQuery: '',
      ruleOptions: [
        { value: 'everybody', labelKey: 'messenger.privacyEverybody' },
        { value: 'contacts', labelKey: 'messenger.privacyMyContacts' },
        { value: 'nobody', labelKey: 'messenger.privacyNobody' },
      ],
    };
  },
  computed: {
    ...mapState('messenger', ['settings', 'contacts']),
    slice() {
      return this.settings?.privacy?.[this.settingKey] || { rule: 'everybody', always_allow: [], never_allow: [] };
    },
    currentRule() {
      return this.slice.rule || 'everybody';
    },
    alwaysAllow() {
      return this.slice.always_allow || [];
    },
    neverAllow() {
      return this.slice.never_allow || [];
    },
    activeList() {
      return this.exceptionMode === 'allow' ? this.alwaysAllow : this.neverAllow;
    },
    hint() {
      return this.$t(HINT_KEYS[this.settingKey] || 'messenger.privacyGenericHint');
    },
    addableContacts() {
      const blocked = new Set([
        ...this.alwaysAllow.map((u) => Number(u.id)),
        ...this.neverAllow.map((u) => Number(u.id)),
      ]);
      return (this.contacts || []).filter((ct) => ct.contact_user && !blocked.has(Number(ct.contact_user.id)));
    },
    filteredAddable() {
      const q = this.exceptionQuery.trim().toLowerCase();
      if (!q) return this.addableContacts;
      return this.addableContacts.filter((ct) => {
        const name = (ct.name || '').toLowerCase();
        const u = ct.contact_user || {};
        const uname = (u.username || '').toLowerCase();
        const full = `${u.first_name || ''} ${u.last_name || ''}`.trim().toLowerCase();
        return name.includes(q) || uname.includes(q) || full.includes(q);
      });
    },
  },
  watch: {
    exceptionMode(val) {
      this.exceptionQuery = '';
      this.$emit('exception-mode', val);
    },
    settingKey() {
      this.exceptionMode = null;
      this.exceptionQuery = '';
      this.$emit('exception-mode', null);
    },
  },
  methods: {
    openException(mode) {
      this.exceptionMode = mode;
    },
    displayName(u) {
      return [u.first_name, u.last_name].filter(Boolean).join(' ') || u.username || `#${u.id}`;
    },
    async setRule(rule) {
      await this.$store.dispatch('messenger/savePrivacySetting', {
        key: this.settingKey,
        rule,
        always_allow: this.alwaysAllow,
        never_allow: this.neverAllow,
      });
    },
    async persist(always, never) {
      await this.$store.dispatch('messenger/savePrivacySetting', {
        key: this.settingKey,
        rule: this.currentRule,
        always_allow: always,
        never_allow: never,
      });
    },
    async addException(user) {
      if (!user?.id) return;
      const brief = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        profile_pic: user.profile_pic,
      };
      if (this.exceptionMode === 'allow') {
        const always = [...this.alwaysAllow.filter((u) => Number(u.id) !== Number(user.id)), brief];
        const never = this.neverAllow.filter((u) => Number(u.id) !== Number(user.id));
        await this.persist(always, never);
      } else {
        const never = [...this.neverAllow.filter((u) => Number(u.id) !== Number(user.id)), brief];
        const always = this.alwaysAllow.filter((u) => Number(u.id) !== Number(user.id));
        await this.persist(always, never);
      }
    },
    async removeException(userId) {
      if (this.exceptionMode === 'allow') {
        await this.persist(
          this.alwaysAllow.filter((u) => Number(u.id) !== Number(userId)),
          this.neverAllow,
        );
      } else {
        await this.persist(
          this.alwaysAllow,
          this.neverAllow.filter((u) => Number(u.id) !== Number(userId)),
        );
      }
    },
    handleBack() {
      if (this.exceptionMode) {
        this.exceptionMode = null;
        return true;
      }
      return false;
    },
  },
};
</script>
