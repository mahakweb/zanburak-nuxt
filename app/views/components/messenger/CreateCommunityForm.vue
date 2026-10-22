<template>
  <section class="cc-form">
    <div class="cc-card cc-intro">
      <div class="cc-intro-icon">
        <svg v-if="kind === 'channel'" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m8-4a4 4 0 11-8 0 4 4 0 018 0zm6 8v-1a3 3 0 00-3-3h-1" />
        </svg>
      </div>
      <div class="cc-intro-copy">
        <div class="cc-intro-title">
          {{ kind === 'channel' ? $t('messenger.newChannel') : $t('messenger.newGroup') }}
        </div>
        <p class="cc-intro-hint">
          {{ kind === 'channel' ? $t('messenger.channelKindHint') : $t('messenger.groupKindHint') }}
        </p>
      </div>
    </div>

    <div class="cc-card cc-pad">
      <label class="cc-label">{{ titleLabel }}</label>
      <input v-model="form.title" type="text" maxlength="128"
        class="cc-field"
        :placeholder="titlePlaceholder" />

      <label class="cc-label cc-label-gap">{{ $t('messenger.groupDescription') }}</label>
      <textarea
        :value="form.description"
        rows="2"
        maxlength="2000"
        class="cc-field cc-area"
        :placeholder="$t('messenger.groupDescriptionPlaceholder')"
        @input="onDescriptionInput"
      ></textarea>
    </div>

    <div class="cc-card">
      <div class="cc-row">
        <span class="cc-row-label">{{ publicLabel }}</span>
        <MessengerToggle class="cc-switch" :model-value="form.is_public" @update:modelValue="setPublic" />
      </div>

      <div v-if="form.is_public" class="cc-sub">
        <label class="cc-label">
          {{ $t('messenger.username') }} <span class="text-red-500">*</span>
        </label>
        <div class="cc-user" :class="usernameBorderClass">
          <span class="cc-at">@</span>
          <input v-model="form.username" type="text" maxlength="32" dir="ltr"
            :placeholder="$t('messenger.usernameRequiredHint')"
            @input="onUsernameInput" />
        </div>
        <p v-if="usernameStatus === 'checking'" class="cc-status">{{ $t('messenger.usernameChecking') }}</p>
        <p v-else-if="usernameStatus === 'available'" class="cc-status is-ok">{{ $t('messenger.usernameAvailable') }}</p>
        <p v-else-if="usernameStatus === 'taken'" class="cc-status is-bad">{{ $t('messenger.usernameTaken') }}</p>
        <p v-else-if="usernameStatus === 'invalid'" class="cc-status is-bad">{{ $t('messenger.usernameInvalid') }}</p>
      </div>
      <p v-else class="cc-note">{{ $t('messenger.privateAutoIdHint') }}</p>

      <div v-if="kind === 'group'" class="cc-row">
        <span class="cc-row-label">{{ $t('messenger.historyVisible') }}</span>
        <MessengerToggle class="cc-switch" :model-value="form.history_visible" @update:modelValue="(v) => { form.history_visible = v; }" />
      </div>
      <div class="cc-row">
        <span class="cc-row-label">{{ $t('messenger.joinApproval') }}</span>
        <MessengerToggle class="cc-switch" :model-value="form.join_approval_required" @update:modelValue="(v) => { form.join_approval_required = v; }" />
      </div>
    </div>

    <div class="cc-card cc-pad">
      <label class="cc-label">{{ $t('messenger.addMembers') }}</label>
      <MemberPicker
        :selected="selectedMembers"
        :self-id="meId"
        :max="maxMembers"
        :allow-search="canMessengerFeature('user_search')"
        :disabled="saving"
        @update:selected="selectedMembers = $event"
        @limit="onMemberLimit"
      />
    </div>

    <p v-if="error" class="mx-3 mt-3 text-sm text-red-500">{{ error }}</p>

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
import { useAuthStore } from '@/stores/auth'
import { useMessengerStore } from '@/stores/messenger'
import { mapState } from 'pinia'
import MessengerToggle from './MessengerToggle.vue';
import MemberPicker from './MemberPicker.vue';
import { toSingleLine } from './textHelpers';
import { createGroup, createChannel, checkCommunityUsername } from '@/services/messenger';

function resolveUserId(raw) {
  if (!raw) return null;
  if (typeof raw === 'object' && raw.value != null && typeof raw.value === 'object') {
    return raw.value.id ?? null;
  }
  return raw.id ?? null;
}

export default {
  name: 'CreateCommunityForm',
  components: { MessengerToggle, MemberPicker },
  setup() {
    return { authStore: useAuthStore() };
  },
  props: {
    kind: { type: String, default: 'group' },
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
      selectedMembers: [],
      usernameTimer: null,
      usernameStatus: '',
      saving: false,
      error: '',
    };
  },
  computed: {
    ...mapState(useMessengerStore, ['messengerLimits', 'canMessengerFeature']),
    meId() {
      return resolveUserId(this.authStore?.status?.userInfo);
    },
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
  },
  mounted() {
    this.reset();
  },
  beforeUnmount() {
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
      this.selectedMembers = [];
      this.usernameStatus = '';
      this.error = '';
      this.saving = false;
      clearTimeout(this.usernameTimer);
    },
    setPublic(value) {
      this.form.is_public = !!value;
      if (!this.form.is_public) {
        this.form.username = '';
        this.usernameStatus = '';
        clearTimeout(this.usernameTimer);
      }
    },
    onDescriptionInput(e) {
      this.form.description = toSingleLine(e.target.value);
    },
    onMemberLimit() {
      this.error = this.$t('messenger.maxMembersCreate', { count: this.maxMembers });
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
    apiError(e) {
      const msg = e?.response?.data?.message || '';
      if (msg === 'One or more users cannot be added') return this.$t('messenger.cannotAddUsers');
      return msg || this.$t('messenger.saveError');
    },
    async submit() {
      if (!this.canSubmit || this.saving) return;
      if (this.kind === 'group' && !this.canMessengerFeature('groups')) {
        this.error = this.$t('messenger.groupsDisabled');
        return;
      }
      if (this.kind === 'channel' && !this.canMessengerFeature('channels')) {
        this.error = this.$t('messenger.channelsDisabled');
        return;
      }
      if (this.selectedMembers.length > this.maxMembers) {
        this.onMemberLimit();
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
        this.error = this.apiError(e);
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<style scoped>
.cc-form {
  display: block;
  flex: 0 0 auto;
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
  padding-top: 12px;
  color: #111827;
}
.dark .cc-form { color: #f3f4f6; }

.cc-card {
  margin: 0 12px 10px;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  overflow: hidden;
}
.dark .cc-card {
  background: #17212b;
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: none;
}
.cc-pad { padding: 14px; }
.cc-intro {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
}
.cc-intro-icon {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background: rgba(51, 144, 236, 0.12);
  color: #3390ec;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 42px;
}
.cc-intro-copy { min-width: 0; flex: 1; text-align: start; }
.cc-intro-title { font-size: 15px; font-weight: 650; }
.cc-intro-hint { margin-top: 2px; font-size: 12px; line-height: 1.45; color: #707579; }

.cc-label {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #707579;
  text-align: start;
}
.cc-label-gap { margin-top: 12px; }

.cc-field {
  display: block;
  width: 100%;
  box-sizing: border-box;
  border-radius: 12px;
  border: 1px solid #c5ced6 !important;
  background: #f7f9fb !important;
  color: #111827 !important;
  padding: 11px 12px;
  font-size: 14px;
  line-height: 1.4;
  outline: none;
}
.cc-field::placeholder { color: #8b98a5; }
.cc-field:focus {
  border-color: #3390ec !important;
  background: #fff !important;
  box-shadow: 0 0 0 3px rgba(51, 144, 236, 0.16);
}
.cc-area { resize: none; min-height: 64px; }
.dark .cc-field {
  background: #0e1621 !important;
  border-color: rgba(255, 255, 255, 0.16) !important;
  color: #f3f4f6 !important;
}
.dark .cc-field:focus { background: #101b27 !important; }

.cc-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  min-height: 48px;
  padding: 8px 14px;
  box-sizing: border-box;
}
.cc-row + .cc-row,
.cc-note + .cc-row,
.cc-sub + .cc-row {
  border-top: 1px solid rgba(15, 23, 42, 0.06);
}
.dark .cc-row + .cc-row,
.dark .cc-note + .cc-row,
.dark .cc-sub + .cc-row {
  border-top-color: rgba(255, 255, 255, 0.06);
}
.cc-row-label {
  flex: 1 1 auto;
  min-width: 0;
  text-align: start;
  font-size: 14px;
  line-height: 1.35;
}
.cc-switch {
  flex: 0 0 36px;
  align-self: center;
  width: 36px !important;
  height: 22px !important;
  min-width: 36px;
  max-width: 36px;
  padding: 0;
}
.cc-note,
.cc-sub {
  padding: 0 14px 12px;
  font-size: 12px;
  line-height: 1.5;
  color: #707579;
  text-align: start;
}
.cc-user {
  display: flex;
  align-items: center;
  border: 1px solid #c5ced6;
  border-radius: 12px;
  background: #f7f9fb;
  overflow: hidden;
}
.dark .cc-user {
  background: #0e1621;
  border-color: rgba(255, 255, 255, 0.16);
}
.cc-user:focus-within {
  border-color: #3390ec;
  box-shadow: 0 0 0 3px rgba(51, 144, 236, 0.16);
}
.cc-at {
  padding-inline-start: 12px;
  color: #8b98a5;
  font-size: 14px;
}
.cc-user input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  padding: 11px 12px;
  font-size: 14px;
  color: inherit;
  outline: none;
  text-align: left;
}
.cc-status { margin-top: 6px; font-size: 11px; color: #8b98a5; }
.cc-status.is-ok { color: #1a9f4b; }
.cc-status.is-bad { color: #e05353; }
</style>
