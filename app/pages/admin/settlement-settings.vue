<script setup>
definePageMeta({
  name: "admin-settlement-settings",
  middleware: ['auth'],
})
</script>

<template>
  <AdminMasterPage>
    <template #breadcrumb-actions>
      <button
        type="button"
        class="shrink-0 h-9 rounded-xl bg-white px-3.5 text-xs font-semibold text-gray-700 ring-1 ring-gray-200/80 hover:bg-zinc-50 disabled:opacity-50 dark:bg-gray-900 dark:text-gray-200 dark:ring-gray-700"
        :disabled="saving || loading"
        @click="resetForm"
      >
        بازنشانی
      </button>
      <button
        type="button"
        class="shrink-0 h-9 rounded-xl bg-amber-400 px-4 text-xs font-bold text-gray-900 hover:bg-amber-300 disabled:opacity-50"
        :disabled="saving || loading || !canSave"
        @click="save"
      >
        {{ saving ? "در حال ذخیره..." : "ذخیره تغییرات" }}
      </button>
    </template>

    <div class="mx-auto max-w-5xl space-y-5">
      <div v-if="error" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">{{ error }}</div>
      <div v-if="success" class="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">{{ success }}</div>

      <div v-if="loading" class="flex flex-col items-center gap-3 py-24 text-sm font-semibold text-gray-400">
        <div class="h-10 w-10 rounded-full border-[3px] border-amber-300/30 border-t-amber-400 animate-spin"></div>
        بارگذاری تنظیمات سهم...
      </div>

      <template v-else>
        <section class="hero">
          <div class="hero__badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" d="M12 3v3M12 18v3M3 12h3M18 12h3"/><circle cx="12" cy="12" r="3.2"/></svg>
            فقط مدیرکل
          </div>
          <h2 class="hero__title">تقسیم درآمد تسویه</h2>
          <p class="hero__sub">
            مشخص کنید از مبلغ نهایی فروش (بعد از تخفیف) چند درصد مال سایت و چند درصد مال مدرس است.
            کارمزد درگاه جداست و تسویه‌های قبلی با درصد زمان ثبت‌شان ثابت می‌مانند.
          </p>
        </section>

        <div class="layout">
          <section class="panel">
            <header class="panel__head">
              <div>
                <h3 class="panel__title">تنظیم درصد</h3>
                <p class="panel__hint">با جابه‌جایی، طرف مقابل خودکار تکمیل می‌شود</p>
              </div>
              <div class="sum-pill">
                <span class="sum-pill__pay font-anjoman">{{ form.teacher_percent }}٪</span>
                <span class="sum-pill__sep">+</span>
                <span class="sum-pill__cut font-anjoman">{{ form.site_percent }}٪</span>
                <span class="sum-pill__eq">= ۱۰۰</span>
              </div>
            </header>

            <div class="split-visual" aria-hidden="true">
              <div class="split-visual__pay" :style="{ width: form.teacher_percent + '%' }">
                <span v-if="form.teacher_percent >= 18">مدرس</span>
              </div>
              <div class="split-visual__cut" :style="{ width: form.site_percent + '%' }">
                <span v-if="form.site_percent >= 14">سایت</span>
              </div>
            </div>

            <div class="controls">
              <div class="control">
                <div class="control__top">
                  <div class="control__who">
                    <span class="control__ico control__ico--pay">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3v12m0 0l-3.5-3.5M12 15l3.5-3.5"/><path d="M5 19h14"/></svg>
                    </span>
                    <div>
                      <p class="control__name">سهم مدرس / کاربر</p>
                      <p class="control__desc">مبلغی که واریز می‌شود</p>
                    </div>
                  </div>
                  <div class="control__val">
                    <input v-model.number="form.teacher_percent" type="number" min="0" max="100" step="1" dir="ltr" class="pct-box pct-box--pay" @input="onTeacherInput" />
                    <span>٪</span>
                  </div>
                </div>
                <input
                  v-model.number="form.teacher_percent"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  class="slider slider--pay"
                  :style="sliderStyle(form.teacher_percent, '#34d399')"
                  @input="onTeacherInput"
                />
              </div>

              <div class="control">
                <div class="control__top">
                  <div class="control__who">
                    <span class="control__ico control__ico--cut">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 7h16M4 12h10M4 17h7"/><circle cx="18" cy="16.5" r="3.5"/><path d="M16.8 16.5h2.4"/></svg>
                    </span>
                    <div>
                      <p class="control__name">سهم سایت</p>
                      <p class="control__desc">مبلغ کسرشده برای پلتفرم</p>
                    </div>
                  </div>
                  <div class="control__val">
                    <input v-model.number="form.site_percent" type="number" min="0" max="100" step="1" dir="ltr" class="pct-box pct-box--cut" @input="onSiteInput" />
                    <span>٪</span>
                  </div>
                </div>
                <input
                  v-model.number="form.site_percent"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  class="slider slider--cut"
                  :style="sliderStyle(form.site_percent, '#fb7185')"
                  @input="onSiteInput"
                />
              </div>
            </div>

            <div class="quick">
              <span class="quick__label">میانبر</span>
              <button v-for="q in presets" :key="q.site" type="button" class="quick__btn" :class="{ 'is-active': form.site_percent === q.site }" @click="applyPreset(q.site)">
                {{ q.label }}
              </button>
            </div>
          </section>

          <section class="preview-wrap">
            <SettlementShareCard
              variant="card"
              :gross-amount="sample.gross_amount"
              :platform-amount="sample.platform_amount"
              :teacher-amount="sample.teacher_amount"
              :site-percent="form.site_percent"
              :teacher-percent="form.teacher_percent"
              :explain="explain"
              eyebrow="پیش‌نمایش زنده"
              title="برای فروش ۱٬۰۰۰٬۰۰۰ تومانی"
              payout-label="مدرس"
            />
          </section>
        </div>
      </template>
    </div>
  </AdminMasterPage>
</template>

<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import SettlementShareCard from "@/views/components/admin/SettlementShareCard.vue";
import axiosInstance from "@/store/axiosInstance";
import { isSuperUser } from "@/utils/acl";

export default {
  name: "AdminSettlementSettings",
  components: { AdminMasterPage, SettlementShareCard },
  data() {
    return {
      loading: true,
      saving: false,
      error: "",
      success: "",
      form: { site_percent: 0, teacher_percent: 100 },
      saved: { site_percent: 0, teacher_percent: 100 },
      explain: null,
      sample: { gross_amount: 1000000, platform_amount: 0, teacher_amount: 1000000 },
      presets: [
        { site: 0, label: "۰ / ۱۰۰" },
        { site: 10, label: "۱۰ / ۹۰" },
        { site: 20, label: "۲۰ / ۸۰" },
        { site: 30, label: "۳۰ / ۷۰" },
        { site: 50, label: "۵۰ / ۵۰" },
      ],
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.status.userInfo;
    },
    canSave() {
      return isSuperUser(this.currentUser)
        && (Number(this.form.site_percent) !== Number(this.saved.site_percent)
          || Number(this.form.teacher_percent) !== Number(this.saved.teacher_percent));
    },
  },
  created() {
    if (!isSuperUser(this.currentUser)) {
      this.$router.replace({ name: "admin-forbidden", query: { from: this.$route.fullPath } });
      return;
    }
    this.fetchSettings();
  },
  methods: {
    clamp(value) {
      const n = Number(value);
      if (!Number.isFinite(n)) return 0;
      return Math.max(0, Math.min(100, Math.round(n)));
    },
    sliderStyle(value, color) {
      const pct = this.clamp(value);
      const empty = document.documentElement.classList.contains("dark") ? "#374151" : "#e5e7eb";
      return {
        background: `linear-gradient(90deg, ${color} ${pct}%, ${empty} ${pct}%)`,
      };
    },
    onSiteInput() {
      this.form.site_percent = this.clamp(this.form.site_percent);
      this.form.teacher_percent = this.clamp(100 - this.form.site_percent);
      this.refreshSample();
    },
    onTeacherInput() {
      this.form.teacher_percent = this.clamp(this.form.teacher_percent);
      this.form.site_percent = this.clamp(100 - this.form.teacher_percent);
      this.refreshSample();
    },
    applyPreset(site) {
      this.form.site_percent = site;
      this.form.teacher_percent = 100 - site;
      this.refreshSample();
    },
    refreshSample() {
      const gross = 1000000;
      const teacher = Math.round(gross * Number(this.form.teacher_percent) / 100);
      this.sample = {
        gross_amount: gross,
        teacher_amount: teacher,
        platform_amount: gross - teacher,
      };
    },
    resetForm() {
      this.form = { ...this.saved };
      this.refreshSample();
      this.error = "";
      this.success = "";
    },
    async fetchSettings() {
      this.loading = true;
      this.error = "";
      try {
        const response = await axiosInstance.get("/admin/settlements/settings");
        const settings = response?.data?.settings || {};
        this.form = {
          site_percent: Number(settings.site_percent ?? 0),
          teacher_percent: Number(settings.teacher_percent ?? 100),
        };
        this.saved = { ...this.form };
        this.explain = response?.data?.explain || null;
        this.sample = response?.data?.sample || this.sample;
        this.refreshSample();
      } catch (error) {
        this.error = error?.response?.data?.message || "دریافت تنظیمات تسویه انجام نشد.";
      } finally {
        this.loading = false;
      }
    },
    async save() {
      this.saving = true;
      this.error = "";
      this.success = "";
      try {
        const response = await axiosInstance.post("/admin/settlements/settings", {
          site_percent: this.form.site_percent,
          teacher_percent: this.form.teacher_percent,
        });
        const settings = response?.data?.settings || this.form;
        this.form = {
          site_percent: Number(settings.site_percent ?? 0),
          teacher_percent: Number(settings.teacher_percent ?? 100),
        };
        this.saved = { ...this.form };
        this.explain = response?.data?.explain || this.explain;
        this.sample = response?.data?.sample || this.sample;
        this.success = response?.data?.message || "تنظیمات ذخیره شد.";
        if (this.$toast) this.$toast.success(this.success);
      } catch (error) {
        this.error = error?.response?.data?.message || "ذخیره تنظیمات انجام نشد.";
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  border-radius: 1.5rem;
  padding: 1.35rem 1.4rem 1.45rem;
  border: 1px solid rgba(251, 191, 36, 0.28);
  background:
    radial-gradient(circle at 100% 0%, rgba(251, 191, 36, 0.18), transparent 42%),
    radial-gradient(circle at 0% 100%, rgba(16, 185, 129, 0.12), transparent 40%),
    #fff;
}
.dark .hero {
  border-color: rgba(251, 191, 36, 0.18);
  background:
    radial-gradient(circle at 100% 0%, rgba(251, 191, 36, 0.14), transparent 42%),
    radial-gradient(circle at 0% 100%, rgba(16, 185, 129, 0.1), transparent 40%),
    #111827;
}
.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  height: 1.6rem;
  padding: 0 0.55rem;
  border-radius: 999px;
  background: rgba(251, 191, 36, 0.22);
  color: #92400e;
  font-size: 10px;
  font-weight: 800;
  margin-bottom: 0.65rem;
}
.dark .hero__badge { color: #fde68a; background: rgba(251, 191, 36, 0.14); }
.hero__badge svg { width: 0.85rem; height: 0.85rem; }
.hero__title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #111827;
}
.dark .hero__title { color: #fff; }
.hero__sub {
  margin-top: 0.4rem;
  max-width: 40rem;
  font-size: 0.78rem;
  line-height: 1.7;
  color: #6b7280;
}
.dark .hero__sub { color: #9ca3af; }

.layout {
  display: grid;
  grid-template-columns: 1.15fr 0.95fr;
  gap: 1rem;
  align-items: stretch;
}
@media (max-width: 960px) {
  .layout { grid-template-columns: 1fr; }
}

.panel {
  border-radius: 1.35rem;
  border: 1px solid #f3f4f6;
  background: #fff;
  padding: 1.15rem 1.2rem 1.25rem;
}
.dark .panel {
  border-color: #1f2937;
  background: #111827;
}
.panel__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.panel__title {
  font-size: 0.9rem;
  font-weight: 800;
  color: #111827;
}
.dark .panel__title { color: #f9fafb; }
.panel__hint {
  margin-top: 0.15rem;
  font-size: 11px;
  color: #9ca3af;
}
.sum-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  height: 2rem;
  padding: 0 0.65rem;
  border-radius: 999px;
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  font-size: 11px;
  font-weight: 700;
}
.dark .sum-pill {
  background: #1f2937;
  border-color: #374151;
}
.sum-pill__pay { color: #047857; }
.dark .sum-pill__pay { color: #34d399; }
.sum-pill__cut { color: #e11d48; }
.dark .sum-pill__cut { color: #fb7185; }
.sum-pill__sep, .sum-pill__eq { color: #9ca3af; }

.split-visual {
  display: flex;
  height: 2.35rem;
  border-radius: 0.85rem;
  overflow: hidden;
  margin-bottom: 1.25rem;
  background: #f3f4f6;
}
.dark .split-visual { background: #1f2937; }
.split-visual__pay,
.split-visual__cut {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.28s ease;
  font-size: 10px;
  font-weight: 800;
  color: #fff;
  min-width: 0;
}
.split-visual__pay { background: linear-gradient(90deg, #10b981, #34d399); }
.split-visual__cut { background: linear-gradient(90deg, #fb7185, #f43f5e); }

.controls { display: grid; gap: 1.15rem; }
.control__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.55rem;
}
.control__who { display: flex; align-items: center; gap: 0.65rem; min-width: 0; }
.control__ico {
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 0.8rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.control__ico svg { width: 1.05rem; height: 1.05rem; }
.control__ico--pay { background: rgba(16, 185, 129, 0.14); color: #047857; }
.dark .control__ico--pay { color: #34d399; }
.control__ico--cut { background: rgba(244, 63, 94, 0.12); color: #e11d48; }
.dark .control__ico--cut { color: #fb7185; }
.control__name {
  font-size: 0.8rem;
  font-weight: 750;
  color: #111827;
}
.dark .control__name { color: #f3f4f6; }
.control__desc {
  font-size: 10px;
  color: #9ca3af;
  margin-top: 0.05rem;
}
.control__val {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #6b7280;
}
.pct-box {
  width: 3.6rem;
  height: 2rem;
  border-radius: 0.65rem;
  border: 1px solid transparent;
  text-align: center;
  font-size: 0.85rem;
  font-weight: 800;
  outline: none;
}
.pct-box--pay {
  background: rgba(16, 185, 129, 0.1);
  color: #047857;
}
.pct-box--cut {
  background: rgba(244, 63, 94, 0.1);
  color: #e11d48;
}
.dark .pct-box--pay { color: #34d399; background: rgba(16, 185, 129, 0.14); }
.dark .pct-box--cut { color: #fb7185; background: rgba(244, 63, 94, 0.14); }
.pct-box:focus { box-shadow: 0 0 0 2px #facc15; }

.slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 0.4rem;
  border-radius: 999px;
  outline: none;
  background: #e5e7eb;
  direction: ltr;
}
.dark .panel .slider {
  /* empty track fallback when inline style missing */
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 999px;
  background: #fff;
  border: 3px solid #10b981;
  box-shadow: 0 2px 10px rgba(16, 185, 129, 0.4);
  cursor: pointer;
  transition: transform 0.15s ease;
}
.slider--cut::-webkit-slider-thumb {
  border-color: #f43f5e;
  box-shadow: 0 2px 10px rgba(244, 63, 94, 0.4);
}
.slider::-webkit-slider-thumb:active { transform: scale(1.12); }
.slider::-moz-range-thumb {
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 999px;
  background: #fff;
  border: 3px solid #10b981;
  box-shadow: 0 2px 10px rgba(16, 185, 129, 0.4);
  cursor: pointer;
}
.slider--cut::-moz-range-thumb {
  border-color: #f43f5e;
  box-shadow: 0 2px 10px rgba(244, 63, 94, 0.4);
}

.quick {
  margin-top: 1.2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
}
.quick__label {
  font-size: 10px;
  font-weight: 700;
  color: #9ca3af;
  margin-inline-end: 0.2rem;
}
.quick__btn {
  height: 1.7rem;
  padding: 0 0.55rem;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  color: #6b7280;
  background: #f3f4f6;
  transition: 0.15s ease;
}
.dark .quick__btn { background: #1f2937; color: #9ca3af; }
.quick__btn:hover { background: #e5e7eb; }
.dark .quick__btn:hover { background: #374151; }
.quick__btn.is-active {
  background: #fde68a;
  color: #78350f;
}
.dark .quick__btn.is-active {
  background: rgba(251, 191, 36, 0.22);
  color: #fde68a;
}

.preview-wrap {
  min-height: 100%;
}
.preview-wrap :deep(.preview) {
  min-height: 100%;
}
</style>
