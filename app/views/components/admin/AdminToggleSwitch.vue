<template>
    <button
        type="button"
        role="switch"
        :aria-checked="modelValue"
        :disabled="disabled"
        @click="$emit('update:modelValue', !modelValue)"
        class="relative shrink-0 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="[
            sizeClass,
            modelValue ? activeClass : 'bg-gray-300 dark:bg-gray-600',
        ]"
    >
        <span
            class="absolute top-0.5 bg-white rounded-full shadow transition-all duration-200"
            :class="[knobClass, modelValue ? knobOnClass : knobOffClass]"
        ></span>
    </button>
</template>

<script>
export default {
    props: {
        modelValue: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        size: { type: String, default: 'md' },
    },
    emits: ['update:modelValue'],
    computed: {
        sizeClass() {
            return this.size === 'sm' ? 'w-8 h-4' : 'w-10 h-5';
        },
        knobClass() {
            return this.size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
        },
        knobOnClass() {
            return this.size === 'sm' ? 'start-0.5' : 'start-0.5';
        },
        knobOffClass() {
            return this.size === 'sm' ? 'start-[calc(100%-0.875rem)]' : 'start-[calc(100%-1.125rem)]';
        },
        activeClass() {
            return 'bg-yellow-400';
        },
    },
};
</script>
