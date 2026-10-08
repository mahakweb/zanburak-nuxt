<template>
  <transition name="app-lock-fade">
    <div
      v-if="open"
      class="app-lock-overlay"
      role="dialog"
      aria-modal="true"
      :aria-label="$t('messenger.passcodeLock')"
      @keydown.stop="onKeydown"
    >
      <div class="app-lock-overlay__glow" aria-hidden="true" />
      <div class="app-lock-overlay__inner">
        <div class="app-lock-overlay__brand">
          <div class="app-lock-overlay__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" d="M8 11V8a4 4 0 118 0v3" />
              <rect x="5.5" y="11" width="13" height="9.5" rx="2.5" stroke="currentColor" stroke-width="1.75" />
              <circle cx="12" cy="15.5" r="1.35" fill="currentColor" />
            </svg>
          </div>
        </div>

        <PasscodePad
          ref="pad"
          v-model="pin"
          :hint="padHint"
          :error="error"
          :busy="busy"
          :biometric="showBiometric"
          :biometric-kind="biometricKind"
          :biometric-label="biometricLabel"
          :backspace-label="$t('messenger.passcodeBackspace')"
          :aria-label="$t('messenger.enterPasscode')"
          @complete="onPinComplete"
          @biometric="tryBiometric"
        />
      </div>
    </div>
  </transition>
</template>

<script>
import PasscodePad from './PasscodePad.vue';
import {
  unlockWithPin,
  unlockWithBiometric,
  isBiometricAvailable,
  detectBiometricKind,
  getLockSnapshot,
} from './appLock';

export default {
  name: 'AppLockOverlay',
  components: { PasscodePad },
  props: {
    open: { type: Boolean, default: false },
  },
  emits: ['unlocked'],
  data() {
    return {
      pin: '',
      error: '',
      busy: false,
      biometricOk: false,
      biometricKind: detectBiometricKind(),
    };
  },
  computed: {
    showBiometric() {
      return this.biometricOk && getLockSnapshot().biometricEnabled;
    },
    biometricLabel() {
      return this.biometricKind === 'face'
        ? this.$t('messenger.unlockWithFace')
        : this.$t('messenger.unlockWithFingerprint');
    },
    padHint() {
      // Keep unlock screen minimal — only show errors, not status copy.
      return '';
    },
  },
  watch: {
    open: {
      immediate: true,
      handler(v) {
        if (!v) {
          this.reset();
          return;
        }
        this.reset();
        this.biometricKind = detectBiometricKind();
        this.prepareBiometric();
      },
    },
  },
  methods: {
    reset() {
      this.pin = '';
      this.error = '';
      this.busy = false;
    },
    onKeydown(e) {
      if (!this.open || this.busy) return;
      const key = e.key;
      if (/^\d$/.test(key)) {
        e.preventDefault();
        const next = `${this.pin}${key}`.slice(0, 4);
        this.pin = next;
        if (next.length >= 4) this.onPinComplete(next);
        return;
      }
      if (key === 'Backspace') {
        e.preventDefault();
        this.pin = this.pin.slice(0, -1);
      }
    },
    async prepareBiometric() {
      try {
        this.biometricOk = await isBiometricAvailable();
      } catch {
        this.biometricOk = false;
      }
      // Never auto-prompt — user must tap the biometric key on the pad.
    },
    async onPinComplete(pin) {
      if (this.busy) return;
      this.busy = true;
      this.error = '';
      try {
        const ok = await unlockWithPin(pin);
        if (!ok) {
          this.error = this.$t('messenger.wrongPasscode');
          this.pin = '';
          return;
        }
        this.$emit('unlocked');
      } catch {
        this.error = this.$t('messenger.wrongPasscode');
        this.pin = '';
      } finally {
        this.busy = false;
      }
    },
    async tryBiometric() {
      if (this.busy || !this.showBiometric) return;
      this.busy = true;
      this.error = '';
      try {
        const ok = await unlockWithBiometric();
        if (ok) this.$emit('unlocked');
      } catch (e) {
        const code = e?.name || e?.message || '';
        if (code === 'NotAllowedError' || code === 'cancelled') {
          // dismissed
        } else if (code === 'unavailable') {
          this.biometricOk = false;
        } else {
          this.error = this.$t('messenger.biometricFailed');
        }
      } finally {
        this.busy = false;
      }
    },
  },
};
</script>

<style scoped>
.app-lock-overlay {
  position: absolute;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px 20px 36px;
  background:
    radial-gradient(120% 80% at 50% -10%, rgba(51, 144, 236, 0.14), transparent 55%),
    linear-gradient(180deg, #f7f8fa 0%, #eef1f5 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
.dark .app-lock-overlay {
  background:
    radial-gradient(120% 80% at 50% -10%, rgba(51, 144, 236, 0.18), transparent 55%),
    linear-gradient(180deg, #15202b 0%, #0e1621 100%);
}
.app-lock-overlay__glow {
  position: absolute;
  inset: auto 0 0;
  height: 40%;
  pointer-events: none;
  background: radial-gradient(60% 80% at 50% 100%, rgba(51, 144, 236, 0.08), transparent 70%);
}
.app-lock-overlay__inner {
  position: relative;
  width: 100%;
  max-width: 340px;
}
.app-lock-overlay__brand {
  text-align: center;
  margin-bottom: 28px;
}
.app-lock-overlay__icon {
  width: 68px;
  height: 68px;
  margin: 0 auto;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3390ec;
  background: rgba(51, 144, 236, 0.12);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35);
}
.app-lock-overlay__icon svg {
  width: 30px;
  height: 30px;
}
.dark .app-lock-overlay__icon {
  background: rgba(51, 144, 236, 0.16);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.app-lock-fade-enter-active,
.app-lock-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.app-lock-fade-enter-from,
.app-lock-fade-leave-to {
  opacity: 0;
  transform: scale(1.02);
}
</style>
