<template>
    <div class="text-center py-2 px-2">
        <div class="mx-auto mb-4 w-14 h-14 rounded-2xl flex items-center justify-center"
            :class="iconWrapClass">
            <slot name="icon">
                <svg v-if="variant === 'warning'" class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <svg v-else class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </slot>
        </div>
        <p class="mb-3 text-sm font-bold text-gray-800 dark:text-gray-100">{{ message }}</p>
        <p v-if="description" class="mb-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{{ description }}</p>
        <div v-if="hint" class="mb-4 mx-auto max-w-sm rounded-xl border border-amber-200/60 bg-amber-50/50 dark:bg-amber-900/10 dark:border-amber-800/30 px-3 py-2 text-[11px] text-gray-600 dark:text-gray-400 text-start leading-relaxed">
            {{ hint }}
        </div>
        <AdminBottomSheetActions
            :cancel-label="cancelLabel"
            :submit-label="confirmLabel"
            :variant="variant === 'warning' ? 'warning' : 'danger'"
            :loading="loading"
            @cancel="$emit('cancel')"
            @submit="$emit('confirm')"
        />
    </div>
</template>

<script>
import AdminBottomSheetActions from './AdminBottomSheetActions.vue';

export default {
    components: { AdminBottomSheetActions },
    props: {
        variant: { type: String, default: 'danger' },
        message: { type: String, required: true },
        description: { type: String, default: '' },
        hint: { type: String, default: '' },
        cancelLabel: { type: String, default: 'انصراف' },
        confirmLabel: { type: String, default: 'بله، حذف کن' },
        loading: { type: Boolean, default: false },
    },
    emits: ['cancel', 'confirm'],
    computed: {
        iconWrapClass() {
            if (this.variant === 'warning') {
                return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400';
            }
            return 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400';
        },
    },
};
</script>
