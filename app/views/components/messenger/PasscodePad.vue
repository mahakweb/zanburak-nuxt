<template>
  <div class="passcode-pad" :class="{ 'is-error': errorShake, 'is-compact': compact }" dir="ltr">
    <div class="passcode-pad__dots" aria-hidden="true">
      <span
        v-for="i in length"
        :key="i"
        class="passcode-pad__dot"
        :class="{ filled: value.length >= i }"
      />
    </div>

    <div class="passcode-pad__status">
      <p v-if="error" class="passcode-pad__error">{{ error }}</p>
      <p v-else-if="hint" class="passcode-pad__hint">{{ hint }}</p>
      <p v-else class="passcode-pad__hint passcode-pad__hint--spacer">&nbsp;</p>
    </div>

    <div class="passcode-pad__keys" role="group" :aria-label="ariaLabel">
      <button
        v-for="cell in digitCells"
        :key="cell.digit"
        type="button"
        class="passcode-pad__key"
        :disabled="disabled || busy"
        @click="press(cell.digit)"
      >
        <span class="passcode-pad__digit">{{ cell.digit }}</span>
        <span v-if="cell.letters" class="passcode-pad__letters">{{ cell.letters }}</span>
      </button>

      <button
        type="button"
        class="passcode-pad__key passcode-pad__key--action"
        :disabled="disabled || busy || !value.length"
        :aria-label="backspaceLabel"
        @click="backspace"
      >
        <svg class="passcode-pad__glyph passcode-pad__glyph--backspace" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" d="M18.5 6h-8.3a2 2 0 00-1.5.7L4.2 12l4.5 5.3a2 2 0 001.5.7h8.3a2 2 0 002-2V8a2 2 0 00-2-2z" />
          <path stroke="currentColor" stroke-width="1.7" stroke-linecap="round" d="M14.2 9.8l-3.4 4.4M10.8 9.8l3.4 4.4" />
        </svg>
      </button>

      <button
        type="button"
        class="passcode-pad__key"
        :disabled="disabled || busy"
        @click="press('0')"
      >
        <span class="passcode-pad__digit">0</span>
      </button>

      <button
        type="button"
        class="passcode-pad__key passcode-pad__key--action"
        :disabled="disabled || busy || !biometric"
        :class="{ 'is-hidden': !biometric }"
        :aria-label="resolvedBiometricLabel"
        @click="$emit('biometric')"
      >
        <!-- Face ID / face unlock -->
        <svg v-if="resolvedKind === 'face'" class="passcode-pad__glyph" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" d="M8 3.5H6.2A2.7 2.7 0 003.5 6.2V8M16 3.5h1.8a2.7 2.7 0 012.7 2.7V8M8 20.5H6.2a2.7 2.7 0 01-2.7-2.7V16M16 20.5h1.8a2.7 2.7 0 002.7-2.7V16" />
          <circle cx="9.2" cy="10.2" r="0.85" fill="currentColor" />
          <circle cx="14.8" cy="10.2" r="0.85" fill="currentColor" />
          <path stroke="currentColor" stroke-width="1.65" stroke-linecap="round" d="M9.4 14.6c.85.95 1.75 1.4 2.6 1.4s1.75-.45 2.6-1.4" />
        </svg>
        <!-- Fingerprint (ionicons finger-print-sharp) -->
        <svg v-else class="passcode-pad__glyph" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true">
          <path d="M56.79 200.58l12.36 7.5 7.35-13.58C93.07 166.75 143.78 102 256 102c115 0 164 70.32 180.1 93.46l8.16 12.7L469.88 192l-8.54-13.36c-8.88-12.85-27.52-39.53-60.78-63.1C360.15 86.82 311.5 72.25 256 72.25c-128.07 0-186.69 75.11-206 107.25L42.63 192 54 198.86a14.09 14.09 0 001.63 1.1 12.57 12.57 0 001.16.62z"/>
          <path d="M379.22 172.32c-35.54-28.93-78.12-44.25-123.22-44.25-97.52 0-162.31 66-183.33 131.47C53.42 320 76.82 407.61 77.8 411.36l4.38 13.81 29.93-6.43-4.74-15c-.21-.75-22.1-82.93-5.41-135.21 9-28.08 27.73-55.4 51.35-74.79C181.81 170.39 217.35 158 256 158c90.58 0 141.93 70.61 156.45 108.11 11.27 28.93 8.67 61.82-6.28 82-5.53 7.39-15.28 16.07-30.12 15.32-33.81-1.72-39.66-18.43-47.79-50.25-3.9-15.32-7.9-31.18-17.87-44-12.14-15.75-29.8-23.36-54.28-23.36-26.33 0-46.27 8.68-59.38 25.72-28.6 37.28-10 100.93-9.21 103.61l.22.85c1.41 3.86 36.08 96.65 128.93 119.68l14.77 3.21 8.09-28.71-15.27-3.43c-74.22-18.43-105.21-94.39-107.59-100.39a152.44 152.44 0 01-5.1-29.79c-1.08-14.46-.32-34.39 9.43-47.14 7.15-9.32 18.64-13.82 35-13.82 29.79 0 34.78 14.57 42.58 44.79 7.58 29.46 18 69.85 75.84 72.75 22.21 1.07 42.26-8.79 56.34-27.65 21.13-28.28 25.14-71.57 10.19-110.14-11.68-30.36-34.21-60.54-61.73-83.04z"/>
          <path d="M154.18 343.21c-3.47-28.28 1.41-71 26.55-98.78 17.44-19.29 42.79-29 75.19-29 37.49 0 65.87 16.72 84.51 49.61a154 154 0 0117.88 53.25l1.43 14.69 30-2.2a112.63 112.63 0 00-1-15.6c-.11-1.28-3.57-32.46-21-63.75-24.06-43.11-62.63-65.93-111.74-65.93-41.5 0-74.55 13.18-98.06 39.11-31.85 35.14-38.35 86.25-33.91 122.35v.33c7.97 54.53 28.97 98.14 66.12 137.14l11.6 11.22 20.95-21.79-10.34-9.79c-32.72-34.28-51.25-72.64-58.18-120.86zM132.47 72.66c11.08-6.72 50.27-26.77 123.53-26.77 87.54 0 126.44 28.72 126.87 28.93l13.9 8.86L413 58.47l-13.22-8.56c-.52-.38-1.06-.76-1.6-1.12C385.5 40.54 340.54 16 256 16c-87.71 0-132.75 26.48-143.41 33.71L99 58.52l16.2 25.21z"/>
          <path d="M390.59 415.21c-33.37 3.75-60.45-2.67-80.71-18.85-34.24-27.43-38.68-75.11-38.79-76l-1.23-14.88-30.53 2.23 1.31 15c.22 2.46 5.2 60.75 49.62 96.54 22.11 17.89 49.74 26.89 82.24 26.89a187 187 0 0021.56-1.29l16.59-2.09-6.1-29.71z"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { PIN_LENGTH, detectBiometricKind } from './appLock';

const DIGIT_LETTERS = {
  2: 'ABC',
  3: 'DEF',
  4: 'GHI',
  5: 'JKL',
  6: 'MNO',
  7: 'PQRS',
  8: 'TUV',
  9: 'WXYZ',
};

export default {
  name: 'PasscodePad',
  props: {
    modelValue: { type: String, default: '' },
    length: { type: Number, default: PIN_LENGTH },
    hint: { type: String, default: '' },
    error: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    busy: { type: Boolean, default: false },
    biometric: { type: Boolean, default: false },
    /** Preferred icon: 'face' | 'fingerprint'. Empty = auto-detect. */
    biometricKind: { type: String, default: '' },
    biometricLabel: { type: String, default: '' },
    backspaceLabel: { type: String, default: 'Backspace' },
    ariaLabel: { type: String, default: 'Passcode keypad' },
    compact: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'complete', 'biometric'],
  data() {
    return {
      errorShake: false,
      shakeTimer: null,
      inferredKind: detectBiometricKind(),
    };
  },
  computed: {
    value() {
      return String(this.modelValue || '').replace(/\D/g, '').slice(0, this.length);
    },
    digitCells() {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => ({
        digit: String(digit),
        letters: DIGIT_LETTERS[digit] || '',
      }));
    },
    resolvedKind() {
      if (this.biometricKind === 'face' || this.biometricKind === 'fingerprint') {
        return this.biometricKind;
      }
      return this.inferredKind === 'face' ? 'face' : 'fingerprint';
    },
    resolvedBiometricLabel() {
      if (this.biometricLabel) return this.biometricLabel;
      return this.resolvedKind === 'face' ? 'Face ID' : 'Fingerprint';
    },
  },
  watch: {
    error(v) {
      if (!v) return;
      this.errorShake = true;
      clearTimeout(this.shakeTimer);
      this.shakeTimer = setTimeout(() => { this.errorShake = false; }, 420);
    },
  },
  mounted() {
    this.inferredKind = detectBiometricKind();
    window.addEventListener('keydown', this.onKeydown);
  },
  beforeUnmount() {
    clearTimeout(this.shakeTimer);
    window.removeEventListener('keydown', this.onKeydown);
  },
  methods: {
    onKeydown(e) {
      if (this.disabled || this.busy) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const key = e.key;
      if (key >= '0' && key <= '9') {
        e.preventDefault();
        this.press(key);
        return;
      }
      if (key === 'Backspace' || key === 'Delete') {
        e.preventDefault();
        this.backspace();
      }
    },
    press(digit) {
      if (this.disabled || this.busy) return;
      if (this.value.length >= this.length) return;
      const next = `${this.value}${digit}`;
      this.$emit('update:modelValue', next);
      if (next.length >= this.length) {
        this.$nextTick(() => this.$emit('complete', next));
      }
    },
    backspace() {
      if (this.disabled || this.busy || !this.value.length) return;
      this.$emit('update:modelValue', this.value.slice(0, -1));
    },
    clear() {
      this.$emit('update:modelValue', '');
    },
  },
};
</script>

<style scoped>
.passcode-pad {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  user-select: none;
  -webkit-user-select: none;
  direction: ltr;
  unicode-bidi: isolate;
}
.passcode-pad__dots {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 6px;
  min-height: 16px;
}
.passcode-pad__dot {
  width: 13px;
  height: 13px;
  border-radius: 999px;
  border: 1.75px solid #a0a7b0;
  background: transparent;
  transition: background 0.14s ease, border-color 0.14s ease, transform 0.14s ease, box-shadow 0.14s ease;
}
.passcode-pad__dot.filled {
  background: #3390ec;
  border-color: #3390ec;
  transform: scale(1.08);
  box-shadow: 0 0 0 3px rgba(51, 144, 236, 0.16);
}
.dark .passcode-pad__dot {
  border-color: #6b7785;
}
.dark .passcode-pad__dot.filled {
  background: #5aa7f0;
  border-color: #5aa7f0;
  box-shadow: 0 0 0 3px rgba(90, 167, 240, 0.18);
}
.passcode-pad__status {
  min-height: 22px;
  margin-bottom: 8px;
  width: 100%;
  text-align: center;
}
.passcode-pad__hint {
  margin: 0;
  font-size: 13px;
  line-height: 1.35;
  color: #7a848e;
}
.dark .passcode-pad__hint { color: #8b98a5; }
.passcode-pad__hint--spacer { opacity: 0; }
.passcode-pad__error {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  color: #e53935;
}
.passcode-pad.is-error .passcode-pad__dots {
  animation: passcode-shake 0.42s ease;
}
@keyframes passcode-shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-9px); }
  40% { transform: translateX(9px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(6px); }
}
.passcode-pad__keys {
  display: grid;
  grid-template-columns: repeat(3, 72px);
  justify-content: center;
  column-gap: 22px;
  row-gap: 14px;
  width: 100%;
  margin-top: 10px;
  direction: ltr;
}
.passcode-pad__key {
  width: 72px;
  height: 72px;
  border-radius: 999px;
  border: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  color: #1f2937;
  background: rgba(120, 130, 145, 0.12);
  transition: background 0.12s ease, transform 0.08s ease, opacity 0.12s ease;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
.passcode-pad__key:active:not(:disabled) {
  transform: scale(0.93);
  background: rgba(120, 130, 145, 0.22);
}
.passcode-pad__key:disabled {
  opacity: 0.38;
}
.dark .passcode-pad__key {
  color: #f3f4f6;
  background: rgba(255, 255, 255, 0.08);
}
.dark .passcode-pad__key:active:not(:disabled) {
  background: rgba(255, 255, 255, 0.16);
}
.passcode-pad__digit {
  font-size: 30px;
  font-weight: 400;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.passcode-pad__letters {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #8a939e;
  line-height: 1;
  margin-top: 1px;
}
.dark .passcode-pad__letters { color: #9aa6b2; }
.passcode-pad__key--action {
  background: transparent !important;
  color: #3390ec;
}
.dark .passcode-pad__key--action {
  color: #5aa7f0;
}
.passcode-pad__key--action:active:not(:disabled) {
  background: rgba(51, 144, 236, 0.1) !important;
}
.passcode-pad__key--action.is-hidden {
  visibility: hidden;
  pointer-events: none;
}
.passcode-pad__glyph {
  width: 30px;
  height: 30px;
}
.passcode-pad__glyph--backspace {
  width: 28px;
  height: 28px;
}

.passcode-pad.is-compact {
  max-width: 280px;
}
.passcode-pad.is-compact .passcode-pad__keys {
  grid-template-columns: repeat(3, 64px);
  column-gap: 18px;
  row-gap: 12px;
}
.passcode-pad.is-compact .passcode-pad__key {
  width: 64px;
  height: 64px;
}
.passcode-pad.is-compact .passcode-pad__digit {
  font-size: 26px;
}
.passcode-pad.is-compact .passcode-pad__glyph {
  width: 26px;
  height: 26px;
}

@media (max-width: 360px) {
  .passcode-pad__keys {
    grid-template-columns: repeat(3, 64px);
    column-gap: 16px;
  }
  .passcode-pad__key {
    width: 64px;
    height: 64px;
  }
  .passcode-pad__digit { font-size: 26px; }
}
</style>
