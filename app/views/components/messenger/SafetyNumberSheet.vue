<template>
  <div v-if="open" class="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-4 messenger-sheet-backdrop" @click.self="$emit('close')">
    <div class="w-full max-w-md rounded-2xl messenger-sheet-panel !rounded-2xl shadow-xl p-5 space-y-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="text-[14px] font-semibold text-gray-900 dark:text-gray-100">تأیید رمزنگاری</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            این عدد را با مخاطب خود مقایسه کنید. اگر یکسان بود، ارتباط امن است.
          </p>
        </div>
        <button type="button" class="text-gray-400 hover:text-gray-600" @click="$emit('close')">✕</button>
      </div>

      <div v-if="loading" class="text-[12.5px] text-gray-500 py-8 text-center">در حال محاسبه…</div>
      <div v-else-if="error" class="text-[12.5px] text-red-500 py-4 text-center">{{ error }}</div>
      <template v-else>
        <div
          v-if="changed"
          class="rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700 px-3 py-2 text-xs text-amber-800 dark:text-amber-200"
        >
          کلیدهای امنیتی مخاطب تغییر کرده است. قبل از ادامه، عدد زیر را دوباره با او مقایسه کنید.
        </div>
        <pre
          class="font-mono text-[12.5px] leading-7 tracking-wider text-center bg-black/[0.04] dark:bg-black/30 rounded-xl p-4 text-gray-800 dark:text-gray-100 whitespace-pre-wrap"
          dir="ltr"
        >{{ display }}</pre>
        <button
          v-if="changed && fingerprint"
          type="button"
          class="w-full text-[13px] rounded-xl bg-[#3390ec] text-white py-2.5 font-medium"
          @click="confirmVerified"
        >
          مقایسه کردم — تأیید
        </button>
      </template>

      <p class="text-[11px] text-gray-400 text-center">
        End-to-end · کلیدها فقط روی دستگاه‌ها ذخیره می‌شوند
      </p>
    </div>
  </div>
</template>

<script>
import { computeSafetyNumber, markSafetyNumberVerified } from '@/crypto/messenger';

export default {
  name: 'SafetyNumberSheet',
  props: {
    open: { type: Boolean, default: false },
    userId: { type: [Number, String], default: null },
  },
  emits: ['close'],
  data() {
    return {
      loading: false,
      error: '',
      display: '',
      changed: false,
      fingerprint: '',
    };
  },
  watch: {
    open: {
      immediate: true,
      handler(v) {
        if (v && this.userId) this.load();
      },
    },
    userId(v) {
      if (this.open && v) this.load();
    },
  },
  methods: {
    async load() {
      this.loading = true;
      this.error = '';
      this.display = '';
      this.changed = false;
      this.fingerprint = '';
      try {
        const res = await computeSafetyNumber(Number(this.userId));
        this.display = res.display || '';
        this.changed = !!res.changed;
        this.fingerprint = res.fingerprint || '';
        if (!res.remoteCount) {
          this.error = 'مخاطب هنوز دستگاه رمزنگاری ثبت نکرده است.';
        }
      } catch (e) {
        this.error = e?.response?.data?.message || e?.message || 'خطا در دریافت کد ایمنی';
      } finally {
        this.loading = false;
      }
    },
    confirmVerified() {
      markSafetyNumberVerified(this.userId, this.fingerprint);
      this.changed = false;
    },
  },
};
</script>
