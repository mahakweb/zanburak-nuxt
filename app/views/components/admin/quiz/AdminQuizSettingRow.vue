<template>
    <div
        class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40 px-3 py-2.5"
        :class="{ 'opacity-50': disabled }"
    >
        <div class="min-w-0 flex-1">
            <div class="text-xs font-semibold text-gray-800 dark:text-gray-100">{{ label }}</div>
            <p v-if="hint" class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug line-clamp-2">{{ hint }}</p>
        </div>
        <AdminToggleSwitch
            :model-value="modelValue"
            :disabled="disabled"
            @update:model-value="$emit('update:modelValue', $event)"
        />
    </div>
</template>

<script>
import AdminToggleSwitch from '@/views/components/admin/AdminToggleSwitch.vue';

export default {
    components: { AdminToggleSwitch },
    props: {
        modelValue: { type: Boolean, default: false },
        label: { type: String, required: true },
        hint: { type: String, default: '' },
        disabled: { type: Boolean, default: false },
    },
    emits: ['update:modelValue'],
};
</script>
