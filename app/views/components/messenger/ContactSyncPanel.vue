<template>
  <div class="pt-3 pb-5 mx-3">
    <!-- Primary actions -->
    <div class="bg-white dark:bg-[#17212b] rounded-xl overflow-hidden mb-2">
      <button
        type="button"
        class="w-full flex items-center gap-4 px-[18px] py-[9px] text-start hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition disabled:opacity-50 border-b border-black/[0.06] dark:border-white/[0.06]"
        :disabled="busy"
        @click="syncFromDevice"
      >
        <svg class="w-[21px] h-[21px] flex-shrink-0 text-[#3390ec]" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="flex-1 min-w-0 text-[15px] text-[#3390ec] truncate">{{ $t('messenger.syncFromDevice') }}</span>
      </button>
      <button
        type="button"
        class="w-full flex items-center gap-4 px-[18px] py-[9px] text-start hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition disabled:opacity-50 border-b border-black/[0.06] dark:border-white/[0.06]"
        :disabled="busy"
        @click="triggerFile"
      >
        <svg class="w-[21px] h-[21px] flex-shrink-0 text-[#707579]" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
        <span class="flex-1 min-w-0 text-[15px] text-gray-900 dark:text-[#e8e8e8] truncate">{{ $t('messenger.importContactsFile') }}</span>
      </button>
      <button
        type="button"
        class="w-full flex items-center gap-4 px-[18px] py-[9px] text-start hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition disabled:opacity-50"
        :disabled="busy || !hasSyncedData"
        @click="refreshStatus"
      >
        <svg class="w-[21px] h-[21px] flex-shrink-0 text-[#707579]" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span class="flex-1 min-w-0 text-[15px] text-gray-900 dark:text-[#e8e8e8] truncate">{{ $t('messenger.refreshContactStatus') }}</span>
      </button>
      <input ref="fileInput" type="file" accept=".vcf,.csv,text/vcard,text/csv,*/*" class="hidden" @change="onFile" />
    </div>

    <p class="px-2 pb-2 text-[12.5px] leading-5 text-[#a2acb4]">
      {{ pickerSupported ? $t('messenger.syncContactsHint') : $t('messenger.syncContactsDesktopHint') }}
    </p>

    <p v-if="statusMsg" class="px-2 pb-2 text-[12.5px]" :class="statusError ? 'text-red-500' : 'text-[#3390ec]'">
      {{ statusMsg }}
    </p>
    <p v-if="lastSyncedLabel" class="px-2 pb-3 text-[11px] text-[#a2acb4]">{{ lastSyncedLabel }}</p>

    <!-- Empty state -->
    <div v-if="!loading && !hasSyncedData" class="bg-white dark:bg-[#17212b] rounded-xl overflow-hidden">
      <div class="px-5 py-12 flex flex-col items-center text-center">
        <div class="w-16 h-16 rounded-full bg-[#3390ec]/10 flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-[#3390ec]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p class="text-[15px] font-medium text-gray-900 dark:text-gray-100 mb-1">{{ $t('messenger.syncContactsEmptyTitle') }}</p>
        <p class="text-[13px] text-[#a2acb4] leading-5 max-w-[16rem] mb-5">{{ $t('messenger.syncContactsEmptyDesc') }}</p>
        <button
          type="button"
          class="px-5 py-2.5 rounded-xl bg-[#3390ec] hover:bg-[#4ea4f5] text-white text-[14px] font-semibold disabled:opacity-50 transition active:scale-[.98]"
          :disabled="busy"
          @click="syncFromDevice"
        >
          {{ busy ? '…' : $t('messenger.syncFromDevice') }}
        </button>
      </div>
    </div>

    <template v-else>
      <div class="bg-white dark:bg-[#17212b] rounded-xl overflow-hidden mb-2">
        <div class="px-3 py-2.5">
          <div class="relative">
            <svg class="w-4 h-4 text-[#3390ec] absolute top-1/2 -translate-y-1/2 ltr:left-3.5 rtl:right-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input
              v-model="query"
              :placeholder="$t('messenger.searchContacts')"
              class="w-full ltr:pl-10 rtl:pr-10 pe-3 py-1.5 text-[13px] rounded-full bg-[#f4f4f5] dark:bg-[#0e1621] border-0 focus:outline-none focus:ring-2 focus:ring-[#3390ec]/30 text-gray-900 dark:text-gray-100 placeholder:text-[#a2acb4]"
            />
          </div>
        </div>
      </div>

      <p class="px-1 pt-2 pb-1.5 text-[13px] font-medium text-[#3390ec]">{{ $t('messenger.registeredContacts') }}</p>
      <div class="bg-white dark:bg-[#17212b] rounded-xl overflow-hidden mb-3">
        <MessengerSkeleton v-if="loading && !filteredRegistered.length" variant="contacts" :count="5" />
        <div v-else-if="!filteredRegistered.length" class="px-4 py-10 text-center text-[14px] text-[#a2acb4]">
          {{ query ? $t('messenger.noResults') : $t('messenger.noRegisteredContacts') }}
        </div>
        <div
          v-for="(row, idx) in filteredRegistered"
          :key="'r-' + (row.user?.id || row.phone)"
          :class="['w-full flex items-center gap-2.5 py-1.5 ps-3 pe-3 hover:bg-black/[0.04] dark:hover:bg-white/5 transition cursor-pointer select-none', idx < filteredRegistered.length - 1 ? 'border-b border-black/[0.06] dark:border-white/[0.06]' : '']"
          @click="$emit('open-user', row.user)"
        >
          <MessengerAvatar :user="row.user" :name="row.name" size="sm" :online="!!row.user?.is_online" />
          <div class="flex-1 min-w-0">
            <div class="text-[13px] font-medium text-gray-900 dark:text-gray-100 truncate leading-snug">{{ row.name }}</div>
            <div class="text-[12px] truncate leading-snug" :class="row.user?.is_online ? 'text-[#3390ec]' : 'text-[#a2acb4]'">
              {{ presenceText(row.user) }}
            </div>
          </div>
        </div>
      </div>

      <p class="px-1 pt-1 pb-1.5 text-[13px] font-medium text-[#3390ec]">{{ $t('messenger.inviteableContacts') }}</p>
      <div class="bg-white dark:bg-[#17212b] rounded-xl overflow-hidden">
        <div v-if="!filteredInviteable.length" class="px-4 py-10 text-center text-[14px] text-[#a2acb4]">
          {{ query ? $t('messenger.noResults') : $t('messenger.noInviteableContacts') }}
        </div>
        <div
          v-for="(row, idx) in filteredInviteable"
          :key="'i-' + row.phone"
          :class="['w-full flex items-center gap-2.5 py-2 ps-3 pe-2.5 hover:bg-black/[0.04] dark:hover:bg-white/5 transition select-none', idx < filteredInviteable.length - 1 ? 'border-b border-black/[0.06] dark:border-white/[0.06]' : '']"
        >
          <MessengerAvatar :name="row.name" size="sm" />
          <div class="flex-1 min-w-0">
            <div class="text-[13px] font-medium text-gray-900 dark:text-gray-100 truncate leading-snug">{{ row.name }}</div>
            <div class="mt-0.5 text-[12px] text-[#a2acb4] leading-snug">
              <span dir="ltr" class="invite-phone inline-block max-w-full truncate align-top">{{ row.phone }}</span>
            </div>
          </div>
          <button
            type="button"
            class="invite-glass-btn"
            :disabled="invitingPhone === row.phone || busy"
            @click.stop="invite(row)"
          >
            {{ invitingPhone === row.phone ? '…' : $t('messenger.invite') }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from "@/composables/useStore";
import MessengerAvatar from './MessengerAvatar.vue';
import MessengerSkeleton from './MessengerSkeleton.vue';
import { formatPresenceText } from '@/utils/messengerPresence';
import {
  contactPickerSupported,
  pickDeviceContacts,
  parseContactFile,
  saveSyncCache,
  contactsFromCache,
  loadSyncCache,
  clearContactOnboardingSkip,
} from '@/utils/contactSync';

export default {
  name: 'ContactSyncPanel',
  components: { MessengerAvatar, MessengerSkeleton },
  emits: ['open-user'],
  data() {
    return {
      busy: false,
      statusMsg: '',
      statusError: false,
      invitingPhone: null,
      query: '',
      pickerSupported: contactPickerSupported(),
    };
  },
  computed: {
    ...mapState('messenger', ['syncedContacts', 'syncedContactsLoading']),
    loading() {
      return this.syncedContactsLoading || this.busy;
    },
    registered() {
      return this.syncedContacts?.registered || [];
    },
    inviteable() {
      return this.syncedContacts?.inviteable || [];
    },
    hasSyncedData() {
      return this.registered.length + this.inviteable.length > 0 || contactsFromCache().length > 0;
    },
    filteredRegistered() {
      return this.filterRows(this.registered);
    },
    filteredInviteable() {
      return this.filterRows(this.inviteable);
    },
    lastSyncedLabel() {
      const iso = this.syncedContacts?.last_synced_at || loadSyncCache()?.saved_at;
      if (!iso) return '';
      const d = typeof iso === 'number' ? new Date(iso) : new Date(iso);
      if (Number.isNaN(d.getTime())) return '';
      return this.$t('messenger.lastSyncedAt', {
        time: d.toLocaleString(this.$i18n.locale === 'fa' ? 'fa-IR' : 'en-US'),
      });
    },
  },
  mounted() {
    this.$store.dispatch('messenger/fetchSyncedContacts').catch(() => {});
  },
  methods: {
    filterRows(list) {
      const q = this.query.trim().toLowerCase();
      if (!q) return list;
      return (list || []).filter((row) => {
        const name = (row.name || '').toLowerCase();
        const phone = (row.phone || '').toLowerCase();
        const u = row.user || {};
        const uname = (u.username || '').toLowerCase();
        const full = `${u.first_name || ''} ${u.last_name || ''}`.trim().toLowerCase();
        return name.includes(q) || phone.includes(q) || uname.includes(q) || full.includes(q);
      });
    },
    presenceText(user) {
      return formatPresenceText(user, (k, p) => this.$t(k, p), {
        locale: this.$i18n.locale === 'fa' ? 'fa-IR' : 'en-US',
      });
    },
    triggerFile() {
      this.$refs.fileInput?.click();
    },
    async syncFromDevice() {
      this.busy = true;
      this.statusMsg = '';
      try {
        if (contactPickerSupported()) {
          const contacts = await pickDeviceContacts();
          if (!contacts.length) {
            this.statusError = false;
            this.statusMsg = this.$t('messenger.syncContactsCancelled');
            return;
          }
          await this.upload(contacts);
          return;
        }
        this.triggerFile();
      } catch (e) {
        if (e?.name === 'AbortError' || e?.name === 'NotAllowedError') {
          this.statusError = false;
          this.statusMsg = this.$t('messenger.syncContactsCancelled');
        } else if (e?.message === 'unsupported') {
          this.triggerFile();
        } else {
          this.statusError = true;
          this.statusMsg = this.$t('messenger.syncContactsFailed');
        }
      } finally {
        this.busy = false;
      }
    },
    async onFile(ev) {
      const file = ev.target?.files?.[0];
      ev.target.value = '';
      if (!file) return;
      this.busy = true;
      this.statusMsg = '';
      try {
        const contacts = await parseContactFile(file);
        if (!contacts.length) {
          this.statusError = true;
          this.statusMsg = this.$t('messenger.noValidPhonesInFile');
          return;
        }
        await this.upload(contacts);
      } catch {
        this.statusError = true;
        this.statusMsg = this.$t('messenger.syncContactsFailed');
      } finally {
        this.busy = false;
      }
    },
    async upload(contacts) {
      const res = await this.$store.dispatch('messenger/syncContactsAction', contacts);
      saveSyncCache({ contacts });
      clearContactOnboardingSkip();
      this.statusError = false;
      this.statusMsg = this.$t('messenger.syncContactsDone', {
        matched: res.matched_count || 0,
        total: res.synced_count || contacts.length,
      });
    },
    async refreshStatus() {
      this.busy = true;
      this.statusMsg = '';
      try {
        const cached = contactsFromCache();
        if (cached.length) {
          await this.upload(cached);
        } else {
          await this.$store.dispatch('messenger/refreshContactSyncAction');
          this.statusError = false;
          this.statusMsg = this.$t('messenger.contactStatusRefreshed');
        }
      } catch {
        this.statusError = true;
        this.statusMsg = this.$t('messenger.syncContactsFailed');
      } finally {
        this.busy = false;
      }
    },
    async invite(row) {
      this.invitingPhone = row.phone;
      try {
        const res = await this.$store.dispatch('messenger/inviteContactAction', row.phone);
        if (res?.throttled) {
          this.statusError = false;
          this.statusMsg = this.$t('messenger.inviteThrottled');
        } else if (res?.status === 'invited' || res?.invited) {
          this.statusError = false;
          this.statusMsg = this.$t('messenger.inviteSent', { channel: 'SMS' });
        } else if (res?.status === 'added') {
          this.statusError = false;
          this.statusMsg = this.$t('messenger.contactAdded');
          await this.$store.dispatch('messenger/fetchSyncedContacts');
        } else {
          this.statusError = true;
          this.statusMsg = this.$t('messenger.inviteFailed');
        }
      } catch {
        this.statusError = true;
        this.statusMsg = this.$t('messenger.inviteFailed');
      } finally {
        this.invitingPhone = null;
      }
    },
  },
};
</script>

<style scoped>
.invite-phone {
  unicode-bidi: isolate;
}

.invite-glass-btn {
  flex-shrink: 0;
  margin: 0;
  border: 0;
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 650;
  letter-spacing: 0.01em;
  color: #3390ec;
  background: rgba(51, 144, 236, 0.14);
  -webkit-backdrop-filter: blur(14px) saturate(1.4);
  backdrop-filter: blur(14px) saturate(1.4);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.28),
    0 1px 2px rgba(15, 23, 42, 0.04);
  transition:
    background-color 140ms ease,
    color 140ms ease,
    transform 100ms ease,
    box-shadow 140ms ease,
    opacity 140ms ease;
  -webkit-tap-highlight-color: transparent;
}

.invite-glass-btn:hover:not(:disabled) {
  background: rgba(51, 144, 236, 0.22);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.34),
    0 2px 8px rgba(51, 144, 236, 0.16);
}

.invite-glass-btn:active:not(:disabled) {
  transform: scale(0.96);
}

.invite-glass-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

:global(.dark) .invite-glass-btn,
.dark .invite-glass-btn {
  color: #6ab2f2;
  background: rgba(106, 178, 242, 0.14);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.2);
}

:global(.dark) .invite-glass-btn:hover:not(:disabled),
.dark .invite-glass-btn:hover:not(:disabled) {
  background: rgba(106, 178, 242, 0.24);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.14),
    0 2px 10px rgba(51, 144, 236, 0.2);
}
</style>
