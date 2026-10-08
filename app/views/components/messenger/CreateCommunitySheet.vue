<template>
  <BottomSheetDrawer
    :model-value="open"
    :fit-content="true"
    :initial-height="0.72"
    :min-height="0.35"
    :max-height="0.95"
    :auto-close-on-min="true"
    :close-on-backdrop="true"
    :lock-scroll="true"
    backdrop-z-class="z-[2000000030]"
    panel-z-class="z-[2000000040]"
    :panel-class="sheetPanelClass"
    content-class="px-5 pt-1 pb-0 overflow-auto flex flex-col min-h-0"
    :backdrop-class="sheetBackdropClass"
    @update:modelValue="(v) => { if (!v) $emit('close'); }"
    @close="$emit('close')"
  >
    <div class="flex items-center justify-between mb-4 shrink-0">
      <h3 class="text-base font-bold text-gray-900 dark:text-gray-100">
        {{ kind === 'channel' ? $t('messenger.newChannel') : $t('messenger.newGroup') }}
      </h3>
      <button type="button" class="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10" @click="$emit('close')">
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="space-y-3 text-gray-900 dark:text-gray-100 pb-2">
      <div>
        <label class="text-xs font-semibold text-gray-500 dark:text-[#a2acb4]">{{ titleLabel }}</label>
        <input v-model="form.title" type="text" maxlength="128"
          class="tg-field-inset mt-1"
          :placeholder="titlePlaceholder" />
      </div>
      <div>
        <label class="text-xs font-semibold text-gray-500 dark:text-[#a2acb4]">{{ $t('messenger.groupDescription') }}</label>
        <textarea
          :value="form.description"
          rows="1"
          wrap="off"
          maxlength="2000"
          class="tg-field-inset mt-1 messenger-hline"
          :placeholder="$t('messenger.groupDescriptionPlaceholder')"
          @keydown.enter.prevent
          @wheel="onHlineWheel"
          @input="onDescriptionInput"
        ></textarea>
      </div>

      <label class="flex items-center justify-between gap-3 py-1">
        <span class="text-sm text-gray-700 dark:text-gray-200">{{ publicLabel }}</span>
        <input v-model="form.is_public" type="checkbox" class="toggle toggle-sm toggle-info" />
      </label>

      <div v-if="form.is_public">
        <label class="text-xs font-semibold text-gray-500 dark:text-[#a2acb4]">
          {{ $t('messenger.username') }} <span class="text-red-500">*</span>
        </label>
        <div class="tg-field-wrap mt-1" :class="usernameBorderClass">
          <span class="ps-3 text-sm text-[#a2acb4]">@</span>
          <input v-model="form.username" type="text" maxlength="32"
            :placeholder="$t('messenger.usernameRequiredHint')"
            @input="onUsernameInput" />
        </div>
        <p v-if="usernameStatus === 'checking'" class="mt-1 text-[11px] text-gray-400">{{ $t('messenger.usernameChecking') }}</p>
        <p v-else-if="usernameStatus === 'available'" class="mt-1 text-[11px] text-green-600 dark:text-green-400">{{ $t('messenger.usernameAvailable') }}</p>
        <p v-else-if="usernameStatus === 'taken'" class="mt-1 text-[11px] text-red-500">{{ $t('messenger.usernameTaken') }}</p>
        <p v-else-if="usernameStatus === 'invalid'" class="mt-1 text-[11px] text-red-500">{{ $t('messenger.usernameInvalid') }}</p>
      </div>
      <p v-else class="text-[11px] text-gray-400 leading-relaxed">
        {{ $t('messenger.privateAutoIdHint') }}
      </p>

      <label v-if="kind === 'group'" class="flex items-center justify-between gap-3 py-1">
        <span class="text-sm text-gray-700 dark:text-gray-200">{{ $t('messenger.historyVisible') }}</span>
        <input v-model="form.history_visible" type="checkbox" class="toggle toggle-sm toggle-info" />
      </label>
      <label class="flex items-center justify-between gap-3 py-1">
        <span class="text-sm text-gray-700 dark:text-gray-200">{{ $t('messenger.joinApproval') }}</span>
        <input v-model="form.join_approval_required" type="checkbox" class="toggle toggle-sm toggle-info" />
      </label>

      <div>
        <label class="text-xs font-semibold text-gray-500 dark:text-[#a2acb4] mb-2 block">{{ $t('messenger.addMembers') }}</label>
        <input v-model="memberQuery" v-no-autofill="'strong'" type="search" name="messenger-member-search" @input="onSearchMembers"
          class="tg-field-inset"
          :placeholder="$t('messenger.searchUsers')" />
        <div v-if="memberResults.length" class="mt-2 max-h-40 overflow-y-auto space-y-1">
          <button v-for="u in memberResults" :key="u.id" type="button"
            class="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-start text-gray-800 dark:text-gray-100"
            @click="toggleMember(u)">
            <MessengerAvatar :user="u" size="xs" />
            <span class="flex-1 text-sm truncate">{{ displayName(u) }}</span>
            <span v-if="selectedIds.includes(u.id)"
              class="w-5 h-5 rounded-full bg-[#3390ec] text-white text-xs flex items-center justify-center font-bold">✓</span>
            <span v-else class="w-5 h-5 rounded-full border border-gray-300 dark:border-white/20"></span>
          </button>
        </div>
        <div v-if="selectedMembers.length" class="mt-2 flex flex-wrap gap-1.5">
          <span v-for="u in selectedMembers" :key="'s'+u.id"
            class="inline-flex items-center gap-1 rounded-full bg-[#3390ec]/10 text-[#3390ec] text-xs px-2 py-1">
            {{ displayName(u) }}
            <button type="button" @click="toggleMember(u)">×</button>
          </span>
        </div>
      </div>

      <p v-if="error" class="text-sm text-red-500">{{ error }}</p>
    </div>

    <div class="tg-form-footer -mx-5 sticky bottom-0">
      <button
        type="button"
        class="tg-form-btn tg-form-btn--primary tg-form-btn--full"
        :disabled="!canSubmit"
        @click="submit"
      >
        {{ saving ? $t('messenger.creating') : $t('messenger.create') }}
      </button>
    </div>
  </BottomSheetDrawer>
</template>

<script>
import MessengerAvatar from './MessengerAvatar.vue';
import BottomSheetDrawer from '@/views/components/common/BottomSheetDrawer.vue';
import { toSingleLine, onHorizontalWheel } from './textHelpers';
import { createGroup, createChannel, searchUsers, checkCommunityUsername } from '@/services/messenger';
import { MESSENGER_SHEET_PANEL, MESSENGER_SHEET_BACKDROP } from './sheetStyles';

export default {
  name: 'CreateCommunitySheet',
  components: { MessengerAvatar, BottomSheetDrawer },
  props: {
    open: { type: Boolean, default: false },
    kind: { type: String, default: 'group' }, // group | channel
  },
  emits: ['close', 'created'],
  data() {
    return {
      form: {
        title: '',
        description: '',
        username: '',
        is_public: false,
        history_visible: true,
        join_approval_required: false,
      },
      memberQuery: '',
      memberResults: [],
      selectedMembers: [],
      searchTimer: null,
      usernameTimer: null,
      usernameStatus: '', // '' | checking | available | taken | invalid
      saving: false,
      error: '',
    };
  },
  computed: {
    sheetPanelClass() { return MESSENGER_SHEET_PANEL; },
    sheetBackdropClass() { return MESSENGER_SHEET_BACKDROP; },
    selectedIds() {
      return this.selectedMembers.map((u) => u.id);
    },
    titleLabel() {
      return this.kind === 'channel' ? this.$t('messenger.channelTitle') : this.$t('messenger.groupTitle');
    },
    titlePlaceholder() {
      return this.kind === 'channel'
        ? this.$t('messenger.channelTitlePlaceholder')
        : this.$t('messenger.groupTitlePlaceholder');
    },
    publicLabel() {
      return this.kind === 'channel' ? this.$t('messenger.publicChannel') : this.$t('messenger.publicGroup');
    },
    usernameBorderClass() {
      if (this.usernameStatus === 'available') return 'ring-1 ring-green-500/50';
      if (this.usernameStatus === 'taken' || this.usernameStatus === 'invalid') return 'ring-1 ring-red-500/50';
      return '';
    },
    canSubmit() {
      if (this.saving || !this.form.title.trim()) return false;
      if (this.form.is_public) {
        if (!this.form.username.trim()) return false;
        if (this.usernameStatus === 'taken' || this.usernameStatus === 'invalid' || this.usernameStatus === 'checking') {
          return false;
        }
      }
      return true;
    },
  },
  watch: {
    open(v) {
      if (v) this.reset();
    },
    'form.is_public'(v) {
      if (!v) {
        this.form.username = '';
        this.usernameStatus = '';
        clearTimeout(this.usernameTimer);
      }
    },
  },
  beforeUnmount() {
    clearTimeout(this.searchTimer);
    clearTimeout(this.usernameTimer);
  },
  methods: {
    reset() {
      this.form = {
        title: '',
        description: '',
        username: '',
        is_public: false,
        history_visible: true,
        join_approval_required: false,
      };
      this.memberQuery = '';
      this.memberResults = [];
      this.selectedMembers = [];
      this.usernameStatus = '';
      this.error = '';
      this.saving = false;
      clearTimeout(this.usernameTimer);
    },
    displayName(u) {
      return (u.first_name || u.last_name)
        ? `${u.first_name || ''} ${u.last_name || ''}`.trim()
        : u.username || `#${u.id}`;
    },
    onDescriptionInput(e) {
      this.form.description = toSingleLine(e.target.value);
    },
    onHlineWheel: onHorizontalWheel,
    onSearchMembers() {
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(async () => {
        const q = this.memberQuery.trim();
        if (q.length < 2) {
          this.memberResults = [];
          return;
        }
        try {
          const res = await searchUsers(q, 12);
          this.memberResults = res.data || res || [];
        } catch (e) {
          this.memberResults = [];
        }
      }, 250);
    },
    onUsernameInput() {
      this.usernameStatus = '';
      clearTimeout(this.usernameTimer);
      const raw = this.form.username.trim().replace(/^@/, '');
      this.form.username = raw;
      if (!raw) return;
      this.usernameTimer = setTimeout(() => this.checkUsername(), 1500);
    },
    async checkUsername() {
      const username = this.form.username.trim();
      if (!username) {
        this.usernameStatus = '';
        return;
      }
      this.usernameStatus = 'checking';
      try {
        const res = await checkCommunityUsername(username);
        if (this.form.username.trim() !== username) return;
        if (res.available) this.usernameStatus = 'available';
        else if (res.reason === 'invalid') this.usernameStatus = 'invalid';
        else this.usernameStatus = 'taken';
      } catch (e) {
        if (this.form.username.trim() === username) this.usernameStatus = 'invalid';
      }
    },
    toggleMember(u) {
      const i = this.selectedMembers.findIndex((x) => x.id === u.id);
      if (i >= 0) this.selectedMembers.splice(i, 1);
      else this.selectedMembers.push(u);
    },
    async submit() {
      if (!this.canSubmit) return;
      if (this.form.is_public && this.usernameStatus !== 'available') {
        await this.checkUsername();
        if (this.usernameStatus !== 'available') {
          this.error = this.$t('messenger.publicRequiresUsername');
          return;
        }
      }
      this.saving = true;
      this.error = '';
      const payload = {
        title: this.form.title.trim(),
        description: toSingleLine(this.form.description).trim() || null,
        username: this.form.is_public ? (this.form.username.trim() || null) : null,
        is_public: !!this.form.is_public,
        history_visible: this.kind === 'group' ? !!this.form.history_visible : true,
        join_approval_required: !!this.form.join_approval_required,
        member_ids: this.selectedIds,
      };
      try {
        const conversation = this.kind === 'channel'
          ? await createChannel(payload)
          : await createGroup(payload);
        this.$emit('created', conversation);
        this.$emit('close');
      } catch (e) {
        this.error = e?.response?.data?.message || this.$t('messenger.saveError');
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>
