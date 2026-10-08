<template>
  <AdminMasterPage>
    <template #breadcrumb-actions>
      <button
        type="button"
        @click="resetToDefaults"
        :disabled="saving || loading"
        class="shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 disabled:opacity-60 dark:bg-gray-900 dark:text-white"
      >
        بازگشت به پیش‌فرض
      </button>
      <button
        type="button"
        @click="save"
        :disabled="saving || loading || !canUpdate"
        class="shrink-0 group h-9 select-none rounded-lg bg-amber-400 px-3 text-sm font-semibold leading-8 text-gray-900 shadow-[0_-3px_0_0px_#d4a017_inset,0_0_0_1px_#f5d76e_inset] hover:bg-amber-300 disabled:opacity-60"
      >
        {{ saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات' }}
      </button>
    </template>

    <div class="space-y-5">
      <div v-if="error" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
        {{ error }}
      </div>
      <div v-if="success" class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
        {{ success }}
      </div>

      <div v-if="loading" class="text-sm font-semibold text-center py-24 text-gray-500">
        <div class="inline-flex flex-col items-center gap-3">
          <div class="w-12 h-12 rounded-full border-4 border-yellow-400/30 border-t-yellow-400 animate-spin"></div>
          در حال بارگذاری تنظیمات پیام‌رسان...
        </div>
      </div>

      <template v-else>
        <!-- Status banner -->
        <div
          class="rounded-2xl border px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          :class="form.enabled
            ? 'border-emerald-200/80 bg-emerald-50/80 dark:border-emerald-900/40 dark:bg-emerald-950/30'
            : 'border-rose-200/80 bg-rose-50/80 dark:border-rose-900/40 dark:bg-rose-950/30'"
        >
          <div>
            <p class="text-sm font-bold text-gray-800 dark:text-gray-100">
              وضعیت پیام‌رسان: {{ form.enabled ? 'فعال' : 'غیرفعال' }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ form.enabled
                ? 'کاربران با دسترسی مجاز می‌توانند از پیام‌رسان استفاده کنند.'
                : 'تمام دسترسی‌ها مسدود است تا دوباره فعال شود.' }}
            </p>
          </div>
          <label class="inline-flex items-center gap-2 cursor-pointer select-none">
            <span class="text-xs font-semibold text-gray-600 dark:text-gray-300">فعال‌سازی سراسری</span>
            <input v-model="form.enabled" type="checkbox" class="toggle toggle-sm toggle-warning" :disabled="!canUpdate" />
          </label>
        </div>

        <!-- Section tabs -->
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="(label, key) in sections"
            :key="key"
            type="button"
            @click="activeSection = key"
            class="h-8 px-3 rounded-lg text-xs font-semibold transition"
            :class="activeSection === key
              ? 'bg-gray-900 text-white dark:bg-amber-400 dark:text-gray-900'
              : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300'"
          >
            {{ label }}
          </button>
          <button
            type="button"
            @click="activeSection = 'users'"
            class="h-8 px-3 rounded-lg text-xs font-semibold transition"
            :class="activeSection === 'users'
              ? 'bg-gray-900 text-white dark:bg-amber-400 dark:text-gray-900'
              : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300'"
          >
            دسترسی کاربران
          </button>
        </div>

        <!-- Settings sections -->
        <div v-if="activeSection !== 'users'" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 md:p-5 space-y-4">
          <h3 class="text-sm font-bold text-gray-800 dark:text-gray-100">
            {{ sections[activeSection] }}
          </h3>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div
              v-for="field in sectionFields"
              :key="field.key"
              class="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40 px-3.5 py-3"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="text-xs font-semibold text-gray-800 dark:text-gray-100">{{ field.label }}</p>
                  <p v-if="field.help" class="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                    {{ field.help }}
                  </p>
                </div>
                <template v-if="field.type === 'boolean'">
                  <input
                    v-model="form[field.key]"
                    type="checkbox"
                    class="toggle toggle-sm toggle-warning shrink-0"
                    :disabled="!canUpdate"
                  />
                </template>
              </div>

              <div v-if="field.type !== 'boolean'" class="mt-2">
                <div class="relative">
                  <input
                    v-if="field.type === 'integer' || field.type === 'float'"
                    v-model.number="form[field.key]"
                    type="number"
                    :min="field.min"
                    :max="field.max"
                    :disabled="!canUpdate"
                    class="w-full h-9 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-3 text-sm font-medium text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    dir="ltr"
                  />
                  <input
                    v-else
                    v-model="form[field.key]"
                    type="text"
                    :disabled="!canUpdate"
                    class="w-full h-9 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-3 text-sm font-medium text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                  <span
                    v-if="field.unit"
                    class="absolute inset-y-0 end-0 flex items-center pe-3 text-[10px] font-bold text-gray-400"
                    dir="ltr"
                  >
                    {{ field.unit }}
                  </span>
                </div>
                <p v-if="field.key.startsWith('max_') && field.unit === 'KB'" class="mt-1 text-[10px] text-gray-400" dir="ltr">
                  ≈ {{ kbToMb(form[field.key]) }} MB
                </p>
                <p v-if="field.key === 'daily_upload_bytes'" class="mt-1 text-[10px] text-gray-400" dir="ltr">
                  ≈ {{ bytesToMb(form[field.key]) }} MB / day (0 = unlimited)
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Per-user access -->
        <div v-else class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 md:p-5 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h3 class="text-sm font-bold text-gray-800 dark:text-gray-100">دسترسی کاربران به پیام‌رسان</h3>
              <p class="text-xs text-gray-500 mt-1">
                پیش‌فرض سراسری:
                <span class="font-semibold" :class="defaultAccess ? 'text-emerald-600' : 'text-rose-500'">
                  {{ defaultAccess ? 'مجاز' : 'مسدود' }}
                </span>
                — می‌توانید برای هر کاربر override بگذارید یا به پیش‌فرض برگردانید.
              </p>
            </div>
            <div class="relative w-full max-w-xs">
              <input
                v-model.trim="userQuery"
                type="search"
                placeholder="جستجوی کاربر..."
                class="w-full h-9 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
                @input="onUserSearch"
              />
            </div>
          </div>

          <div v-if="usersLoading" class="text-xs text-gray-500 py-8 text-center">در حال جستجو...</div>
          <div v-else-if="!users.length" class="text-xs text-gray-500 py-8 text-center">
            کاربری پیدا نشد. نام کاربری یا ایمیل را جستجو کنید.
          </div>
          <div v-else class="divide-y divide-gray-100 dark:divide-gray-800">
            <div
              v-for="u in users"
              :key="u.id"
              class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3"
            >
              <div class="min-w-0">
                <p class="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                  {{ u.name || u.username }}
                  <span class="text-xs font-normal text-gray-400" dir="ltr">@{{ u.username }}</span>
                </p>
                <p class="text-[11px] text-gray-500 truncate" dir="ltr">{{ u.email }}</p>
                <p class="text-[11px] mt-0.5" :class="u.effective_access ? 'text-emerald-600' : 'text-rose-500'">
                  دسترسی مؤثر: {{ u.effective_access ? 'مجاز' : 'مسدود' }}
                  <span v-if="u.inherits_default" class="text-gray-400">(از پیش‌فرض)</span>
                </p>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  class="h-8 px-2.5 rounded-lg text-[11px] font-semibold"
                  :class="u.access_enabled === true ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'"
                  :disabled="!canManageUsers"
                  @click="setUserAccess(u, true)"
                >
                  مجاز
                </button>
                <button
                  type="button"
                  class="h-8 px-2.5 rounded-lg text-[11px] font-semibold"
                  :class="u.access_enabled === false ? 'bg-rose-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'"
                  :disabled="!canManageUsers"
                  @click="setUserAccess(u, false)"
                >
                  مسدود
                </button>
                <button
                  type="button"
                  class="h-8 px-2.5 rounded-lg text-[11px] font-semibold"
                  :class="u.access_enabled === null ? 'bg-amber-400 text-gray-900' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'"
                  :disabled="!canManageUsers"
                  @click="setUserAccess(u, null)"
                >
                  پیش‌فرض
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </AdminMasterPage>
</template>

<script>
import AdminMasterPage from '@/views/page/admin/layouts/AdminMasterPage.vue';
import {
  getMessengerSettings,
  updateMessengerSettings,
  resetMessengerSettings,
  searchMessengerUsers,
  updateMessengerUserAccess,
} from '@/services/messenger-settings.service';

export default {
  name: 'AdminMessengerSettings',
  components: { AdminMasterPage },
  data() {
    return {
      loading: true,
      saving: false,
      error: '',
      success: '',
      form: {},
      schema: {},
      sections: {},
      activeSection: 'general',
      defaultAccess: true,
      userQuery: '',
      users: [],
      usersLoading: false,
      userSearchTimer: null,
    };
  },
  computed: {
    canUpdate() {
      return this.$can('messenger.settings.update');
    },
    canManageUsers() {
      return this.$can(['messenger.users.manage', 'messenger.settings.update']);
    },
    sectionFields() {
      return Object.entries(this.schema)
        .filter(([, meta]) => meta.section === this.activeSection)
        .filter(([key]) => !(key === 'enabled' && this.activeSection === 'general'))
        .map(([key, meta]) => ({ key, ...meta }));
    },
  },
  created() {
    this.load();
  },
  methods: {
    kbToMb(kb) {
      const n = Number(kb) || 0;
      return (n / 1024).toFixed(n >= 1024 ? 1 : 2);
    },
    bytesToMb(bytes) {
      const n = Number(bytes) || 0;
      if (n <= 0) return '0';
      return (n / (1024 * 1024)).toFixed(1);
    },
    async load() {
      this.loading = true;
      this.error = '';
      try {
        const { data } = await getMessengerSettings();
        const payload = data?.data || {};
        this.form = { ...(payload.settings || {}) };
        this.schema = payload.schema || {};
        this.sections = payload.sections || {};
        this.defaultAccess = !!this.form.users_default_access;
        if (!this.sections[this.activeSection] && this.activeSection !== 'users') {
          this.activeSection = Object.keys(this.sections)[0] || 'general';
        }
      } catch (e) {
        this.error = e?.response?.data?.message || 'خطا در بارگذاری تنظیمات';
      } finally {
        this.loading = false;
      }
    },
    async save() {
      if (!this.canUpdate) return;
      this.saving = true;
      this.error = '';
      this.success = '';
      try {
        const { data } = await updateMessengerSettings(this.form);
        const payload = data?.data || {};
        this.form = { ...(payload.settings || this.form) };
        this.defaultAccess = !!this.form.users_default_access;
        this.success = data?.message || 'ذخیره شد.';
      } catch (e) {
        this.error = e?.response?.data?.message || 'خطا در ذخیره تنظیمات';
      } finally {
        this.saving = false;
      }
    },
    async resetToDefaults() {
      if (!this.canUpdate) return;
      if (!window.confirm('همه تنظیمات پیام‌رسان به مقادیر پیش‌فرض برگردد؟')) return;
      this.saving = true;
      this.error = '';
      this.success = '';
      try {
        const { data } = await resetMessengerSettings();
        const payload = data?.data || {};
        this.form = { ...(payload.settings || {}) };
        this.defaultAccess = !!this.form.users_default_access;
        this.success = data?.message || 'بازنشانی شد.';
      } catch (e) {
        this.error = e?.response?.data?.message || 'خطا در بازنشانی';
      } finally {
        this.saving = false;
      }
    },
    onUserSearch() {
      clearTimeout(this.userSearchTimer);
      this.userSearchTimer = setTimeout(() => this.fetchUsers(), 350);
    },
    async fetchUsers() {
      if (!this.canManageUsers) return;
      this.usersLoading = true;
      try {
        const { data } = await searchMessengerUsers(this.userQuery);
        this.users = data?.data || [];
        if (typeof data?.default_access === 'boolean') {
          this.defaultAccess = data.default_access;
        }
      } catch (e) {
        this.error = e?.response?.data?.message || 'خطا در جستجوی کاربران';
      } finally {
        this.usersLoading = false;
      }
    },
    async setUserAccess(user, value) {
      if (!this.canManageUsers) return;
      try {
        const { data } = await updateMessengerUserAccess(user.id, value);
        const result = data?.data || {};
        user.access_enabled = result.access_enabled ?? value;
        user.effective_access = !!result.effective_access;
        user.inherits_default = result.access_enabled === null;
        this.success = data?.message || 'دسترسی به‌روز شد.';
      } catch (e) {
        this.error = e?.response?.data?.message || 'خطا در به‌روزرسانی دسترسی';
      }
    },
  },
  watch: {
    activeSection(val) {
      if (val === 'users' && !this.users.length) {
        this.fetchUsers();
      }
    },
  },
};
</script>
