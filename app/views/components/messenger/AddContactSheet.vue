<template>
  <BottomSheetDrawer
    :model-value="open"
    :initial-height="0.5"
    :min-height="0.3"
    :max-height="0.85"
    :auto-close-on-min="true"
    :close-on-backdrop="true"
    :lock-scroll="true"
    backdrop-z-class="z-[2000000030]"
    panel-z-class="z-[2000000040]"
    :panel-class="sheetPanelClass"
    content-class="px-5 pb-6 overflow-auto"
    :backdrop-class="sheetBackdropClass"
    @update:modelValue="(v) => { if (!v) close(); }"
    @close="close"
  >
    <h3 class="text-[15px] font-bold text-gray-800 dark:text-gray-100 mb-0.5">{{ $t('messenger.addContact') }}</h3>
    <p class="text-[12px] text-gray-500 dark:text-gray-400 mb-3">{{ $t('messenger.addContactHint') }}</p>

    <!-- Stage 1: identifier input -->
    <template v-if="stage === 'input'">
      <input
        ref="input"
        v-model="identifier"
        v-no-autofill="'strong'"
        type="text"
        name="messenger-contact-lookup"
        @keydown.enter.prevent="doLookup"
        :placeholder="$t('messenger.addContactPlaceholder')"
        class="w-full px-4 py-3 text-sm rounded-2xl bg-gray-100 dark:bg-white/5 border-0 focus:ring-2 focus:ring-yellow-400 focus:outline-none text-gray-800 dark:text-gray-100"
        dir="auto"
      />
      <p v-if="message" class="mt-3 text-sm text-red-500">{{ message }}</p>
      <button
        @click="doLookup"
        :disabled="busy || identifier.trim().length < 2"
        class="mt-4 w-full py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-gray-900 font-bold text-sm transition flex items-center justify-center gap-2"
      >
        <svg v-if="busy" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
        {{ $t('messenger.continue') }}
      </button>
    </template>

    <!-- Stage 2: found user -> name + add -->
    <template v-else-if="stage === 'found'">
      <div class="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 mb-4">
        <img v-if="foundUser?.profile_pic" :src="foundUser.profile_pic" class="w-12 h-12 rounded-full object-cover" />
        <div v-else class="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-gray-900 font-bold">{{ foundInitials }}</div>
        <div class="min-w-0">
          <p class="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">{{ foundName }}</p>
          <p v-if="foundUser?.username" class="text-xs text-gray-500 truncate">@{{ foundUser.username }}</p>
        </div>
      </div>

      <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">{{ $t('messenger.customNameLabel') }}</label>
      <input
        v-model="customName"
        v-no-autofill="'strong'"
        type="text"
        name="messenger-contact-nickname"
        :placeholder="foundName"
        class="w-full px-4 py-3 text-sm rounded-2xl bg-gray-100 dark:bg-white/5 border-0 focus:ring-2 focus:ring-yellow-400 focus:outline-none text-gray-800 dark:text-gray-100"
        dir="auto"
      />
      <p class="mt-1 text-xs text-gray-400">{{ $t('messenger.customNameHint') }}</p>

      <div class="mt-4 flex gap-2">
        <button
          type="button"
          @click="reset"
          class="flex-1 h-11 rounded-xl text-[14px] font-semibold text-gray-500 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition"
        >
          {{ $t('messenger.back') }}
        </button>
        <button
          type="button"
          @click="confirmAdd"
          :disabled="busy"
          class="flex-[1.2] h-11 rounded-xl bg-[#3390ec] hover:bg-[#4ea4f5] disabled:opacity-50 text-white font-semibold text-[14px] transition active:scale-[.99]"
        >
          {{ $t('messenger.saveContact') }}
        </button>
      </div>
    </template>

    <!-- Stage 3: not a member -> ask to invite -->
    <template v-else-if="stage === 'invite'">
      <div class="text-center py-2">
        <div class="mx-auto w-12 h-12 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center mb-3">
          <svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
        </div>
        <p class="text-sm text-gray-700 dark:text-gray-200 font-bold">{{ $t('messenger.notMemberTitle') }}</p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ $t('messenger.notMemberInvite', { channel: $t('messenger.channel_' + inviteChannel) }) }}</p>
      </div>
      <p v-if="message" :class="['mt-3 text-sm text-center', error ? 'text-red-500' : 'text-green-600 dark:text-green-400']">{{ message }}</p>
      <div class="mt-4 flex gap-2">
        <button
          type="button"
          @click="reset"
          class="flex-1 h-11 rounded-xl text-[14px] font-semibold text-gray-500 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition"
        >
          {{ $t('messenger.back') }}
        </button>
        <button
          type="button"
          @click="confirmInvite"
          :disabled="busy"
          class="flex-[1.2] h-11 rounded-xl bg-[#3390ec] hover:bg-[#4ea4f5] disabled:opacity-50 text-white font-semibold text-[14px] transition flex items-center justify-center gap-2 active:scale-[.99]"
        >
          <svg v-if="busy" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
          {{ $t('messenger.sendInvite') }}
        </button>
      </div>
    </template>
  </BottomSheetDrawer>
</template>

<script>
import BottomSheetDrawer from '@/views/components/common/BottomSheetDrawer.vue';
import { MESSENGER_SHEET_PANEL, MESSENGER_SHEET_BACKDROP } from './sheetStyles';
import { avatarInitials } from './avatarInitials';

export default {
  components: { BottomSheetDrawer },
  props: { open: { type: Boolean, default: false } },
  emits: ['close', 'added'],
  data() {
    return {
      identifier: '',
      busy: false,
      message: '',
      error: false,
      stage: 'input',
      foundUser: null,
      customName: '',
      inviteChannel: 'email',
    };
  },
  computed: {
    sheetPanelClass() { return MESSENGER_SHEET_PANEL; },
    sheetBackdropClass() { return MESSENGER_SHEET_BACKDROP; },
    foundName() {
      const u = this.foundUser;
      if (!u) return '';
      return (u.first_name || u.last_name)
        ? `${u.first_name || ''} ${u.last_name || ''}`.trim()
        : u.username || '';
    },
    foundInitials() {
      return avatarInitials(this.foundUser);
    },
  },
  watch: {
    open(val) {
      if (val) {
        this.reset();
        this.$nextTick(() => this.$refs.input?.focus());
      }
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
    reset() {
      this.stage = 'input';
      this.message = '';
      this.error = false;
      this.foundUser = null;
      this.customName = '';
    },
    async doLookup() {
      const id = this.identifier.trim();
      if (id.length < 2 || this.busy) return;
      this.busy = true;
      this.message = '';
      this.error = false;
      try {
        const res = await this.$store.dispatch('messenger/lookupContactAction', id);
        if (res.status === 'found') {
          this.foundUser = res.user;
          this.customName = '';
          this.stage = 'found';
        } else if (res.status === 'self') {
          this.error = true;
          this.message = this.$t('messenger.cannotAddSelf');
        } else if (res.status === 'can_invite') {
          this.inviteChannel = res.channel || 'email';
          this.stage = 'invite';
        } else {
          this.error = true;
          this.message = this.$t('messenger.userNotFoundInvalid');
        }
      } catch (e) {
        this.error = true;
        this.message = e?.response?.data?.message || this.$t('messenger.sendError');
      } finally {
        this.busy = false;
      }
    },
    async confirmAdd() {
      if (!this.foundUser || this.busy) return;
      this.busy = true;
      try {
        await this.$store.dispatch('messenger/addContactAction', {
          contactUserId: this.foundUser.id,
          name: this.customName.trim() || null,
        });
        this.$emit('added', this.foundUser);
        this.close();
      } catch (e) {
        this.error = true;
        this.message = e?.response?.data?.message || this.$t('messenger.sendError');
      } finally {
        this.busy = false;
      }
    },
    async confirmInvite() {
      if (this.busy) return;
      this.busy = true;
      this.message = '';
      this.error = false;
      try {
        const res = await this.$store.dispatch('messenger/inviteContactAction', this.identifier.trim());
        if (res.status === 'invited' && res.invited) {
          this.error = false;
          this.message = this.$t('messenger.inviteSent', { channel: this.$t('messenger.channel_' + (res.channel || this.inviteChannel)) });
        } else {
          this.error = true;
          this.message = this.$t('messenger.inviteFailed');
        }
      } catch (e) {
        this.error = true;
        this.message = e?.response?.data?.message || this.$t('messenger.sendError');
      } finally {
        this.busy = false;
      }
    },
  },
};
</script>
