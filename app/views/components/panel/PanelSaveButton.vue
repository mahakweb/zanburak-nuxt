<template>
    <div class="flex justify-end" :class="wrapperClass">
        <button
            type="button"
            :disabled="loading || disabled"
            class="inline-flex items-center justify-center gap-2 min-w-[10rem] h-11 px-6 text-sm font-bold text-gray-900 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-xl shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md"
            @click="$emit('click', $event)"
        >
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>{{ loading ? loadingLabel : label }}</span>
        </button>
    </div>
</template>

<script>
export default {
    emits: ["click"],
    props: {
        label: { type: String, required: true },
        loadingLabel: { type: String, default: "" },
        loading: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        wrapperClass: { type: String, default: "mt-8" },
    },
};
</script>
