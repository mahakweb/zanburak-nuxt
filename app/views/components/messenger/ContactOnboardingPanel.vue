<template>
  <div class="contact-onboarding mx-3">
    <div class="contact-onboarding__glass">
      <div class="contact-onboarding__icon" aria-hidden="true">
        <svg class="w-9 h-9 text-[#3390ec]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>

      <h2 class="contact-onboarding__title">{{ $t('messenger.contactOnboardingTitle') }}</h2>
      <p class="contact-onboarding__desc">{{ $t('messenger.contactOnboardingDesc') }}</p>
      <p class="contact-onboarding__hint">
        {{ pickerSupported ? $t('messenger.contactOnboardingPickerHint') : $t('messenger.contactOnboardingFileHint') }}
      </p>

      <p v-if="statusMsg" class="contact-onboarding__status" :class="statusError ? 'is-error' : 'is-ok'">
        {{ statusMsg }}
      </p>

      <div class="contact-onboarding__actions">
        <button
          type="button"
          class="contact-onboarding__primary"
          :disabled="busy"
          @click="primaryImport"
        >
          {{ busy ? '…' : (pickerSupported ? $t('messenger.syncFromDevice') : $t('messenger.importContactsFile')) }}
        </button>

        <button
          v-if="pickerSupported"
          type="button"
          class="contact-onboarding__secondary"
          :disabled="busy"
          @click="triggerFile"
        >
          {{ $t('messenger.importContactsFile') }}
        </button>

        <button
          type="button"
          class="contact-onboarding__skip"
          :disabled="busy"
          @click="onSkip"
        >
          {{ $t('messenger.contactOnboardingSkip') }}
        </button>
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept=".vcf,.csv,text/vcard,text/csv,*/*"
      class="hidden"
      @change="onFile"
    />
  </div>
</template>

<script>
import {
  contactPickerSupported,
  pickDeviceContacts,
  parseContactFile,
  saveSyncCache,
  clearContactOnboardingSkip,
  skipContactOnboarding,
} from '@/utils/contactSync';

export default {
  name: 'ContactOnboardingPanel',
  emits: ['skip', 'synced'],
  data() {
    return {
      busy: false,
      statusMsg: '',
      statusError: false,
      pickerSupported: contactPickerSupported(),
    };
  },
  methods: {
    triggerFile() {
      this.$refs.fileInput?.click();
    },
    onSkip() {
      skipContactOnboarding();
      this.$emit('skip');
    },
    async primaryImport() {
      if (this.pickerSupported) {
        await this.syncFromDevice();
        return;
      }
      this.triggerFile();
    },
    async syncFromDevice() {
      this.busy = true;
      this.statusMsg = '';
      try {
        if (!contactPickerSupported()) {
          this.triggerFile();
          return;
        }
        const contacts = await pickDeviceContacts();
        if (!contacts.length) {
          this.statusError = false;
          this.statusMsg = this.$t('messenger.syncContactsCancelled');
          return;
        }
        await this.upload(contacts);
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
      this.$emit('synced', res);
    },
  },
};
</script>

<style scoped>
.contact-onboarding__glass {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.75rem 1.25rem 1.5rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.55);
  -webkit-backdrop-filter: blur(22px) saturate(1.35);
  backdrop-filter: blur(22px) saturate(1.35);
  box-shadow: 0 8px 28px rgba(15, 23, 42, 0.06);
  animation: tg-empty-in var(--tg-dur-med, 220ms) var(--tg-ease-out, cubic-bezier(0.22, 1, 0.36, 1)) both;
}

:global(.dark) .contact-onboarding__glass,
.dark .contact-onboarding__glass {
  background: rgba(23, 33, 43, 0.62);
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.28);
}

.contact-onboarding__icon {
  width: 4.25rem;
  height: 4.25rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  background: rgba(51, 144, 236, 0.12);
}

.contact-onboarding__title {
  margin: 0 0 0.4rem;
  font-size: 16px;
  font-weight: 650;
  color: #111827;
  letter-spacing: -0.01em;
}

.dark .contact-onboarding__title {
  color: #f3f4f6;
}

.contact-onboarding__desc {
  margin: 0;
  max-width: 17.5rem;
  font-size: 13.5px;
  line-height: 1.5;
  color: #707579;
}

.dark .contact-onboarding__desc {
  color: #a2acb4;
}

.contact-onboarding__hint {
  margin: 0.65rem 0 0;
  max-width: 18rem;
  font-size: 12.5px;
  line-height: 1.45;
  color: #a2acb4;
}

.contact-onboarding__status {
  margin: 0.75rem 0 0;
  font-size: 12.5px;
  line-height: 1.4;
}

.contact-onboarding__status.is-ok {
  color: #3390ec;
}

.contact-onboarding__status.is-error {
  color: #ef4444;
}

.contact-onboarding__actions {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.5rem;
  width: 100%;
  max-width: 16.5rem;
  margin-top: 1.15rem;
}

.contact-onboarding__primary,
.contact-onboarding__secondary,
.contact-onboarding__skip {
  border: 0;
  border-radius: 12px;
  padding: 0.7rem 1rem;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 140ms ease, transform 100ms ease, opacity 140ms ease;
  -webkit-tap-highlight-color: transparent;
}

.contact-onboarding__primary {
  background: #3390ec;
  color: #fff;
}

.contact-onboarding__primary:hover:not(:disabled) {
  background: #4ea4f5;
}

.contact-onboarding__primary:active:not(:disabled) {
  transform: scale(0.98);
}

.contact-onboarding__secondary {
  background: rgba(51, 144, 236, 0.1);
  color: #3390ec;
}

.contact-onboarding__secondary:hover:not(:disabled) {
  background: rgba(51, 144, 236, 0.16);
}

.contact-onboarding__skip {
  background: transparent;
  color: #a2acb4;
  font-weight: 500;
}

.contact-onboarding__skip:hover:not(:disabled) {
  color: #707579;
  background: rgba(0, 0, 0, 0.03);
}

.dark .contact-onboarding__skip:hover:not(:disabled) {
  color: #c4cdd5;
  background: rgba(255, 255, 255, 0.04);
}

.contact-onboarding__primary:disabled,
.contact-onboarding__secondary:disabled,
.contact-onboarding__skip:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>
