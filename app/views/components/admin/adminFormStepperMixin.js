export function createStepperMixin(stepsKey = 'FORM_STEPS') {
    const stepsPropertyKey = stepsKey;

    const getSteps = (vm) => vm[stepsPropertyKey] || vm.FORM_STEPS || [];

    return {
        data() {
            return {
                currentStep: 0,
            };
        },
        computed: {
            currentStepId() {
                const steps = getSteps(this);
                return steps[this.currentStep]?.id || steps[0]?.id || '';
            },
            footerStepLabel() {
                const steps = getSteps(this);
                const step = steps[this.currentStep];
                return step ? `${step.label} (${this.currentStep + 1}/${steps.length})` : '';
            },
        },
        methods: {
            goToStep(index) {
                const steps = getSteps(this);
                if (index >= 0 && index < steps.length) {
                    if (index > this.currentStep && !this.validateFormStep(this.currentStep)) return;
                    this.currentStep = index;
                }
            },
            nextStep() {
                if (!this.validateFormStep(this.currentStep)) return;
                const steps = getSteps(this);
                if (this.currentStep < steps.length - 1) this.currentStep += 1;
            },
            prevStep() {
                if (this.currentStep > 0) this.currentStep -= 1;
            },
            validateFormStep(stepIndex) {
                void stepIndex;
                return true;
            },
        },
    };
}

export const BTN_SECONDARY = 'flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 dark:bg-gray-900 dark:text-gray-100 dark:shadow-none dark:border dark:border-gray-700 dark:hover:bg-gray-800';

/** هم‌تراز با عرض بردکرامب در AdminMasterPage */
export const ADMIN_PAGE_CONTENT_CLASS = 'w-full max-w-screen-xl mx-auto px-2 md:px-3 min-w-0';

export const ADMIN_FORM_STYLES = `
.form-input {
    display: block;
    width: 100%;
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
    border-radius: 0.75rem;
    outline: none;
    background: #f3f4f6;
    color: #111827;
    border: 1px solid transparent;
    transition: box-shadow 0.15s, border-color 0.15s;
}
.form-input:focus {
    box-shadow: 0 0 0 2px #facc15;
}
.dark .form-input {
    background: #374151;
    color: #fff;
}
.field-label {
    display: block;
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
    margin-bottom: 0.375rem;
}
.dark .field-label { color: #9ca3af; }
@media (min-width: 1024px) {
    .admin-form-layout {
        grid-template-columns: 14rem minmax(0, 1fr);
    }
}
`;
