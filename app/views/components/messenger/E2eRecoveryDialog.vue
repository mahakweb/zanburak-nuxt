<template>
  <div
    v-if="open"
    class="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4"
    role="dialog"
    aria-modal="true"
  >
    <div class="absolute inset-0 bg-black/45" @click="onBackdrop" />
    <div
      class="relative w-full sm:max-w-md bg-white dark:bg-[#17212b] rounded-t-2xl sm:rounded-2xl shadow-2xl px-5 pt-5 pb-6"
      @click.stop
    >
      <div class="mx-auto mb-3 h-1 w-10 rounded-full bg-black/10 dark:bg-white/15 sm:hidden" />
      <h3 class="text-[17px] font-semibold text-gray-900 dark:text-gray-100 mb-1.5">
        {{ title }}
      </h3>
      <p class="text-[13px] leading-5 text-gray-500 dark:text-gray-400 mb-4">
        {{ hint }}
      </p>

      <label class="block text-[12px] font-medium text-gray-500 dark:text-gray-400 mb-1">
        {{ $t('messenger.e2eRecoveryPhrase') }}
      </label>
      <input
        v-model="phrase"
        type="password"
        autocomplete="new-password"
        class="w-full h-11 px-3 rounded-xl bg-[#f4f4f5] dark:bg-white/5 border-0 text-[15px] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3390ec]"
        :placeholder="$t('messenger.e2eRecoveryPlaceholder')"
        @keydown.enter.prevent="submit"
      />
      <template v-if="mode === 'setup'">
        <label class="block text-[12px] font-medium text-gray-500 dark:text-gray-400 mt-3 mb-1">
          {{ $t('messenger.e2eRecoveryConfirm') }}
        </label>
        <input
          v-model="confirm"
          type="password"
          autocomplete="new-password"
          class="w-full h-11 px-3 rounded-xl bg-[#f4f4f5] dark:bg-white/5 border-0 text-[15px] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3390ec]"
          :placeholder="$t('messenger.e2eRecoveryConfirmPlaceholder')"
          @keydown.enter.prevent="submit"
        />
      </template>

      <p v-if="error" class="mt-2 text-[13px] text-red-500">{{ error }}</p>

      <button
        type="button"
        class="mt-4 w-full h-11 rounded-xl bg-[#3390ec] text-white text-[15px] font-semibold disabled:opacity-60"
        :disabled="busy"
        @click="submit"
      >
        {{ busy ? $t('messenger.e2eRecoveryWorking') : primaryLabel }}
      </button>
      <button
        type="button"
        class="mt-2 w-full h-10 text-[14px] text-gray-500 dark:text-gray-400"
        :disabled="busy"
        @click="skip"
      >
        {{ skipLabel }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'E2eRecoveryDialog',
  props: {
    open: { type: Boolean, default: false },
    mode: { type: String, default: 'restore' },
  },
  emits: ['done', 'skip', 'close'],
  data() {
    return {
      phrase: '',
      confirm: '',
      error: '',
      busy: false,
    };
  },
  computed: {
    title() {
      return this.mode === 'setup'
        ? this.$t('messenger.e2eRecoverySetupTitle')
        : this.$t('messenger.e2eRecoveryRestoreTitle');
    },
    hint() {
      return this.mode === 'setup'
        ? this.$t('messenger.e2eRecoverySetupHint')
        : this.$t('messenger.e2eRecoveryRestoreHint');
    },
    primaryLabel() {
      return this.mode === 'setup'
        ? this.$t('messenger.e2eRecoverySave')
        : this.$t('messenger.e2eRecoveryUnlock');
    },
    skipLabel() {
      return this.mode === 'setup'
        ? this.$t('messenger.e2eRecoveryLater')
        : this.$t('messenger.e2eRecoverySkip');
    },
  },
  watch: {
    open(v) {
      if (v) {
        this.phrase = '';
        this.confirm = '';
        this.error = '';
        this.busy = false;
      }
    },
  },
  methods: {
    recoveryErrorText(code) {
      const map = {
        'recovery-too-short': 'messenger.e2eRecoveryTooShort',
        'identity-not-ready': 'messenger.e2eRecoveryNotReady',
        'recovery-required': 'messenger.e2eRecoveryRequired',
        'recovery-missing': 'messenger.e2eRecoveryMissing',
        'recovery-invalid': 'messenger.e2eRecoveryInvalid',
        'recovery-wrong': 'messenger.e2eRecoveryWrong',
        'recovery-mismatch': 'messenger.e2eRecoveryMismatch',
        'recovery-mismatch-confirm': 'messenger.e2eRecoveryConfirmMismatch',
      };
      return this.$t(map[code] || 'messenger.saveError');
    },
    onBackdrop() {
      if (this.busy) return;
      this.skip();
    },
    skip() {
      this.$store.dispatch('messenger/dismissE2eRecoveryPrompt');
      this.$emit('skip');
      this.$emit('close');
    },
    async submit() {
      this.error = '';
      const phrase = String(this.phrase || '');
      if (this.mode === 'setup') {
        if (phrase.trim() !== String(this.confirm || '').trim()) {
          this.error = this.recoveryErrorText('recovery-mismatch-confirm');
          return;
        }
      }
      this.busy = true;
      try {
        if (this.mode === 'setup') {
          await this.$store.dispatch('messenger/enableE2eRecovery', phrase);
        } else {
          await this.$store.dispatch('messenger/restoreE2eFromRecovery', phrase);
        }
        this.$emit('done');
        this.$emit('close');
      } catch (e) {
        this.error = this.recoveryErrorText(e?.message);
      } finally {
        this.busy = false;
      }
    },
  },
};
</script>
