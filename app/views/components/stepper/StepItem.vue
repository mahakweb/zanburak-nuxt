<template>
    <div class="relative ps-8">
        <div v-if="!isLast && isOpen(index)" class="absolute start-3 top-9 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-500 transition"></div>

        <div
            @click="toggle"
            class="absolute start-0 w-6 h-6 font-sans rounded-full flex items-center justify-center border text-xs font-semibold transition"
            :class="{
                'opacity-60': isDisabled,
                'cursor-pointer': !isDisabled,
                'bg-amber-400 text-gray-600 border-amber-200': isOpen(index),
                'text-gray-500 border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-600 dark:text-gray-200': !isOpen(index),
            }"
        >
            {{ index + 1 }}
        </div>

        <div
            @click="toggle"
            class="py-1 font-medium transition"
            :class="{
                'opacity-60': isDisabled,
                'cursor-pointer': !isDisabled,
                'text-amber-400': isOpen(index),
                'text-gray-700 dark:text-gray-200': !isOpen(index),
            }"
        >
            <slot name="header" />
        </div>

        <div :class="['transition-all duration-150 ease-in-out overflow-hidden ', isOpen(index) ? 'max-h-max opacity-100 visible' : 'max-h-0 opacity-0 invisible']">
            <div class="mt-1 mb-2">
                <slot name="content" />
            </div>
            <slot name="buttons" :next="nextStep" :prev="prevStep" />
        </div>
    </div>
</template>

<script>
export default {
    name: "StepItem",
    inject: ["registerStep", "isOpen", "toggleStep", "multiple", "activeStep", "nextStep", "prevStep", "disabledSteps"],
    props: {
        isLast: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            index: null,
        };
    },
    mounted() {
        this.index = this.registerStep();
    },
    computed: {
        opened() {
            return this.isOpen(this.index);
        },
        isActive() {
            return this.activeStep === this.index;
        },
        isDisabled() {
            return this.disabledSteps?.includes(this.index);
        },
    },
    methods: {
        toggle() {
            this.toggleStep(this.index);
        },
    },
};
</script>

<style scoped></style>
