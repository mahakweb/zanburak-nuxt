<template>
    <div class="space-y-2">
        <slot />
    </div>
</template>

<script>
export default {
    name: "VericalStepper",
    provide() {
        return {
            registerStep: this.registerStep,
            toggleStep: this.toggleStep,
            isOpen: this.isOpen,
            multiple: this.multiple,
            activeStep: this.activeStep,
            nextStep: this.nextStep,
            prevStep: this.prevStep,
            disabledSteps: this.disabledSteps,
        };
    },
    props: {
        multiple: {
            type: Boolean,
            default: false,
        },
        defaultOpened: {
            type: Array,
            default: () => [0],
        },
        disabledSteps: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            openedSteps: [...this.defaultOpened],
            stepCount: 0,
            activeStep: this.defaultOpened[0] || 0,
        };
    },
    methods: {
        registerStep() {
            return this.stepCount++;
        },
        toggleStep(index) {
            if (this.disabledSteps.includes(index)) return;
            if (this.multiple) {
                if (this.openedSteps.includes(index)) {
                    this.openedSteps = this.openedSteps.filter((i) => i !== index);
                } else {
                    this.openedSteps.push(index);
                }
            } else {
                if (this.openedSteps[0] !== index) {
                    this.openedSteps = [];

                    setTimeout(() => {
                        this.openedSteps = [index];
                        this.activeStep = index;
                    }, 150);
                }
            }
        },
        isOpen(index) {
            return this.openedSteps.includes(index);
        },
        nextStep() {
            let next = this.activeStep + 1;
            while (this.disabledSteps.includes(next) && next < this.stepCount) {
                next++;
            }
            if (next < this.stepCount) {
                this.toggleStep(next);
            }
        },
        prevStep() {
            let prev = this.activeStep - 1;
            while (this.disabledSteps.includes(prev) && prev >= 0) {
                prev--;
            }
            if (prev >= 0) {
                this.toggleStep(prev);
            }
        },
    },
};
</script>
