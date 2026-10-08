<template>
  <section class="pt-3 pb-0 px-0 min-h-full flex flex-col">
    <div class="tg-card mx-3 p-4 flex-1 space-y-3 text-gray-900 dark:text-gray-100">
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

    <div class="tg-form-footer mt-3">
      <button
        type="button"
        class="tg-form-btn tg-form-btn--primary tg-form-btn--full"
        :disabled="!canSubmit"
        @click="submit"
      >
        {{ saving ? $t('messenger.creating') : $t('messenger.create') }}
      </button>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "@/composables/useStore";
import MessengerAvatar from './MessengerAvatar.vue';
import { toSingleLine, onHorizontalWheel } from './textHelpers';
import { createGroup, createChannel, searchUsers, checkCommunityUsername } from '@/services/messenger';

export default {
  name: 'CreateCommunityForm',
  components: { MessengerAvatar },
  props: {
    kind: { type: String, default: 'group' }, // group | channel
  },
  emits: ['created'],
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
      usernameStatus: '',
      saving: false,
      error: '',
    };
  },
  computed: {
    ...mapGetters('messenger', ['messengerLimits', 'canMessengerFeature']),
    maxMembers() {
      if (this.kind === 'channel') {
        const n = Number(this.messengerLimits?.max_channel_subscribers) || 0;
        if (n > 0) return n;
      }
      return Math.max(2, Number(this.messengerLimits?.max_group_members) || 200);
    },
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
    kind() {
      this.reset();
    },
    'form.is_public'(v) {
      if (!v) {
        this.form.username = '';
        this.usernameStatus = '';
        clearTimeout(this.usernameTimer);
      }
    },
  },
  mounted() {
    this.reset();
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
        if (q.length < 2 || !this.canMessengerFeature('user_search')) {
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
      if (i >= 0) {
        this.selectedMembers.splice(i, 1);
        return;
      }
      if (this.selectedMembers.length >= this.maxMembers) {
        this.error = `حداکثر ${this.maxMembers} عضو در ساخت مجاز است.`;
        return;
      }
      this.selectedMembers.push(u);
    },
    async submit() {
      if (!this.canSubmit) return;
      if (this.kind === 'group' && !this.canMessengerFeature('groups')) {
        this.error = 'ساخت گروه غیرفعال است.';
        return;
      }
      if (this.kind === 'channel' && !this.canMessengerFeature('channels')) {
        this.error = 'ساخت کانال غیرفعال است.';
        return;
      }
      if (this.selectedMembers.length > this.maxMembers) {
        this.error = `حداکثر ${this.maxMembers} عضو در ساخت مجاز است.`;
        return;
      }
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
      } catch (e) {
        this.error = e?.response?.data?.message || this.$t('messenger.saveError');
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<style scoped>
.tg-card :deep(.tg-field-inset),
.tg-card :deep(textarea.tg-field-inset),
.tg-card :deep(input.tg-field-inset) {
  background: #f4f4f5 !important;
  color: #111827 !important;
  border: 1px solid rgba(15, 23, 42, 0.06);
}
.dark .tg-card :deep(.tg-field-inset),
.dark .tg-card :deep(textarea.tg-field-inset),
.dark .tg-card :deep(input.tg-field-inset) {
  background: #0e1621 !important;
  color: #f3f4f6 !important;
  border-color: rgba(255, 255, 255, 0.08);
}
.tg-card :deep(.tg-field-wrap) {
  background: #f4f4f5 !important;
  border: 1px solid rgba(15, 23, 42, 0.06);
}
.dark .tg-card :deep(.tg-field-wrap) {
  background: #0e1621 !important;
  border-color: rgba(255, 255, 255, 0.08);
}
.tg-card :deep(.tg-field-wrap > input) {
  background: transparent !important;
  color: inherit !important;
}
</style>
