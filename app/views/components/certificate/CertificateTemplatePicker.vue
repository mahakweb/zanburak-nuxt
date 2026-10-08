<template>
    <div class="certificate-template-picker">
        <div v-if="loading" class="flex items-center justify-center py-8">
            <svg class="w-6 h-6 animate-spin text-amber-400" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
        </div>

        <div v-else-if="!activeTemplates.length" class="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/80 dark:bg-gray-800/30 px-4 py-6 text-center">
            <p class="text-xs text-gray-500 dark:text-gray-400">قالب فعالی یافت نشد.</p>
            <router-link v-if="showManageLink" :to="{ name: 'admin-certificate-templates' }" class="mt-2 inline-block text-xs font-semibold text-amber-600 hover:text-amber-700">
                مدیریت قالب‌ها
            </router-link>
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <button
                v-for="tpl in activeTemplates"
                :key="tpl.id"
                type="button"
                class="group relative flex flex-col overflow-hidden rounded-xl border-2 text-start transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                :class="isSelected(tpl.id)
                    ? 'border-amber-400 bg-amber-50/60 shadow-md shadow-amber-500/10 dark:border-amber-500 dark:bg-amber-500/10'
                    : 'border-gray-200/80 bg-white hover:border-amber-300/70 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-amber-500/40'"
                @click="select(tpl.id)"
            >
                <div class="relative h-24 sm:h-28 bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                    <img
                        v-if="tpl.background_image_url"
                        :src="tpl.background_image_url"
                        :alt="tpl.name"
                        class="max-h-[5.5rem] max-w-[90%] w-auto object-contain rounded shadow-sm ring-1 ring-gray-200/50 dark:ring-gray-700/50 transition-transform duration-300 group-hover:scale-[1.03]"
                        onerror="this.style.display='none'"
                    />
                    <div
                        v-else
                        class="rounded border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-900/60 flex flex-col items-center justify-center gap-1 p-2"
                        :class="tpl.orientation === 'portrait' ? 'w-12 h-16' : 'w-16 h-11'"
                    >
                        <div class="w-5 h-0.5 rounded-full bg-amber-400"></div>
                        <div class="w-8 h-0.5 rounded bg-gray-200 dark:bg-gray-700"></div>
                        <div class="w-6 h-0.5 rounded bg-gray-100 dark:bg-gray-800"></div>
                    </div>

                    <img
                        v-if="tpl.logo_image_url"
                        :src="tpl.logo_image_url"
                        alt=""
                        class="absolute bottom-1.5 end-1.5 w-5 h-5 object-contain opacity-90 drop-shadow-sm"
                        onerror="this.style.display='none'"
                    />

                    <span
                        v-if="tpl.is_default"
                        class="absolute top-1.5 start-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-yellow-400 text-gray-900 shadow-sm"
                    >
                        پیش‌فرض
                    </span>

                    <span
                        class="absolute top-1.5 end-1.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-black/55 text-white backdrop-blur-sm"
                    >
                        {{ tpl.orientation === 'portrait' ? 'عمودی' : 'افقی' }}
                    </span>

                    <div
                        v-if="isSelected(tpl.id)"
                        class="absolute inset-0 bg-amber-400/10 flex items-center justify-center"
                    >
                        <span class="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-gray-900 shadow-lg ring-2 ring-white dark:ring-gray-900">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </span>
                    </div>
                </div>

                <div class="px-2.5 py-2 min-w-0">
                    <p class="text-[11px] font-bold text-gray-900 dark:text-white line-clamp-1">{{ tpl.name }}</p>
                </div>
            </button>
        </div>

        <p v-if="selectedTemplate && showHint" class="mt-2 text-[10px] text-gray-500 dark:text-gray-400">
            قالب انتخاب‌شده: <span class="font-semibold text-gray-700 dark:text-gray-300">{{ selectedTemplate.name }}</span>
        </p>
    </div>
</template>

<script>
export default {
    props: {
        modelValue: { type: [Number, String, null], default: null },
        templates: { type: Array, default: () => [] },
        loading: { type: Boolean, default: false },
        showHint: { type: Boolean, default: true },
        showManageLink: { type: Boolean, default: true },
        required: { type: Boolean, default: false },
    },
    emits: ['update:modelValue'],
    computed: {
        activeTemplates() {
            return (this.templates || []).filter((t) => t.is_active !== false);
        },
        selectedTemplate() {
            if (!this.modelValue) return null;
            return this.activeTemplates.find((t) => t.id === this.modelValue) || null;
        },
    },
    methods: {
        isSelected(id) {
            return Number(this.modelValue) === Number(id);
        },
        select(id) {
            if (this.required && this.isSelected(id)) return;
            const next = this.isSelected(id) ? null : id;
            this.$emit('update:modelValue', next);
        },
    },
};
</script>

<style scoped>
.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
