import axiosInstance from '@/store/axiosInstance';
import { createStepperMixin, BTN_SECONDARY } from '@/views/components/admin/adminFormStepperMixin.js';
import { showToastError, showToastSuccess } from '@/utils/toastConfig';

export const PLAN_FORM_STEPS = [
    { id: 'basic', label: 'اطلاعات پایه', hint: 'عنوان، مدت و قیمت' },
    { id: 'settings', label: 'تنظیمات', hint: 'آیکن و وضعیت' },
    { id: 'content', label: 'محتوا', hint: 'توضیحات و ویژگی‌ها' },
    { id: 'confirm', label: 'تایید و ثبت', hint: 'بررسی نهایی' },
];

export function createEmptyPlanForm() {
    return {
        title: '',
        english_title: '',
        period_time: null,
        price: null,
        icon: '',
        status: true,
        popular: false,
        allows_installment: false,
        description: '',
    };
}

export const planFormHelpers = {
    methods: {
        errorAt(path) {
            if (!this.errors) return false;
            if (path.includes('.')) {
                const parts = path.split('.');
                let current = this.errors;
                for (const part of parts) {
                    if (current && typeof current === 'object' && part in current) {
                        current = current[part];
                    } else {
                        return false;
                    }
                }
                return current;
            }
            return this.errors[path];
        },
        addFeature() {
            if (this.features.length >= 5) return;
            this.features.push('');
        },
        removeFeature(index) {
            this.features.splice(index, 1);
            if (this.features.length === 0) this.features.push('');
        },
        buildPayload() {
            return {
                ...this.form,
                features: this.features
                    .map((f) => (typeof f === 'string' ? f.trim() : ''))
                    .filter((f) => f.length > 0)
                    .slice(0, 5),
            };
        },
        validateFormStep(stepIndex) {
            const stepId = PLAN_FORM_STEPS[stepIndex]?.id;
            if (stepId === 'basic') {
                if (!this.form.title?.trim()) {
                    showToastError('عنوان پلن الزامی است.');
                    return false;
                }
                if (!this.form.english_title?.trim()) {
                    showToastError('عنوان انگلیسی الزامی است.');
                    return false;
                }
                if (!this.form.period_time || this.form.period_time < 1) {
                    showToastError('مدت پلن باید حداقل ۱ روز باشد.');
                    return false;
                }
                if (this.form.price === null || this.form.price === '' || this.form.price < 0) {
                    showToastError('قیمت پلن را وارد کنید.');
                    return false;
                }
                return true;
            }
            return true;
        },
        mapErrorsToStep() {
            if (!this.errors) return 0;
            const stepMap = {
                title: 0,
                english_title: 0,
                period_time: 0,
                price: 0,
                icon: 1,
                status: 1,
                popular: 1,
                description: 2,
                features: 2,
            };
            for (const key of Object.keys(this.errors)) {
                const base = key.split('.')[0];
                if (base in stepMap) return stepMap[base];
            }
            return 0;
        },
        resetForm() {
            this.form = createEmptyPlanForm();
            this.features = [''];
            this.errors = {};
            this.currentStep = 0;
        },
        applyPlanData(plan) {
            this.form = {
                title: plan.title || '',
                english_title: plan.english_title || '',
                period_time: plan.period_time ?? null,
                price: plan.price ?? null,
                icon: plan.icon || '',
                status: !!plan.status,
                popular: !!plan.popular,
                allows_installment: !!plan.allows_installment,
                description: plan.description || '',
            };
            this.features = Array.isArray(plan.features) && plan.features.length
                ? plan.features.slice(0, 5)
                : [''];
        },
        async loadPlan() {
            if (!this.planId) return;
            this.pageLoading = true;
            try {
                const res = await axiosInstance.get(`/admin/plan/${this.planId}`);
                if (res.data.plan) {
                    this.applyPlanData(res.data.plan);
                }
            } catch {
                showToastError('خطا در دریافت اطلاعات پلن');
            } finally {
                this.pageLoading = false;
            }
        },
        async submitPlan() {
            this.submitLoading = true;
            this.errors = {};
            try {
                const payload = this.buildPayload();
                if (this.isEditMode) {
                    const res = await axiosInstance.post(`/admin/plan/${this.planId}/update`, payload);
                    if (res.data.message === 'Plan updated successfully') {
                        showToastSuccess('پلن با موفقیت بروزرسانی شد');
                        this.$router.push({ name: 'admin-plans-list' });
                    }
                } else {
                    const res = await axiosInstance.post('/admin/plan/create', payload);
                    if (res.data.message === 'Plan created successfully') {
                        showToastSuccess('پلن با موفقیت ایجاد شد');
                        this.$router.push({ name: 'admin-plans-list' });
                    }
                }
            } catch (error) {
                if (error.response?.data?.errors) {
                    this.errors = error.response.data.errors;
                    this.currentStep = this.mapErrorsToStep();
                    showToastError('لطفاً خطاهای فرم را برطرف کنید');
                } else {
                    showToastError(this.isEditMode ? 'خطا در بروزرسانی پلن' : 'خطا در ایجاد پلن');
                }
            } finally {
                this.submitLoading = false;
            }
        },
        formatCurrency(amount) {
            if (amount === null || amount === undefined || amount === '') return '—';
            return new Intl.NumberFormat('fa-IR').format(amount);
        },
    },
};

export const planFormMixin = {
    mixins: [createStepperMixin('PLAN_FORM_STEPS'), planFormHelpers],
    data() {
        return {
            PLAN_FORM_STEPS,
            BTN_SECONDARY,
            submitLoading: false,
            pageLoading: false,
            form: createEmptyPlanForm(),
            features: [''],
            errors: {},
        };
    },
    provide() {
        return { planFormRoot: this };
    },
};
