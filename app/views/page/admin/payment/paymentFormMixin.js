import axiosInstance from '@/store/axiosInstance';
import { createStepperMixin, BTN_SECONDARY } from '@/views/components/admin/adminFormStepperMixin.js';
import { showToastError } from '@/utils/toastConfig';
import { toast } from 'vue3-toastify';

export const PAYMENT_FORM_STEPS = [
    { id: 'user', label: 'انتخاب کاربر', hint: 'کاربر پرداخت‌کننده' },
    { id: 'items', label: 'آیتم‌های پرداخت', hint: 'دوره، اشتراک و ...' },
    { id: 'details', label: 'مشخصات پرداخت', hint: 'روش و مبلغ' },
    { id: 'confirm', label: 'تایید و ثبت', hint: 'بررسی نهایی' },
];

let paymentItemKeySeq = 0;

export function createEmptyPaymentItem() {
    paymentItemKeySeq += 1;
    return {
        _key: `payment-item-${paymentItemKeySeq}`,
        search: '',
        searchResults: [],
        searchLoading: false,
        selected: null,
        payable_type: '',
        payable_id: null,
        price: null,
        discount_amount: 0,
        itemType: '',
    };
}

export const paymentFormHelpers = {
    computed: {
        finalAmount() {
            return this.totalAmount - this.totalDiscount;
        },
        totalItemsAmount() {
            return this.paymentItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
        },
        totalItemsDiscount() {
            return this.paymentItems.reduce((sum, item) => sum + (parseFloat(item.discount_amount) || 0), 0);
        },
        isFormValid() {
            const basicValidation = this.selectedUser
                && this.paymentItems.every((item, index) => this.isItemValid(item, index))
                && this.paymentMethod
                && this.totalAmount > 0;

            if (this.paymentMethod === 'bank' || this.paymentMethod === 'wallet_bank') {
                return basicValidation && this.gateway;
            }
            return basicValidation;
        },
    },
    watch: {
        searchQuery() {
            this.debouncedSearch();
        },
        paymentItems: {
            handler() {
                this.updateTotals();
                if (this.hasWalletItem() && this.paymentMethod === 'wallet') {
                    this.paymentMethod = '';
                }
            },
            deep: true,
        },
        totalDiscountCode() {
            this.validateTotalDiscount();
        },
    },
    methods: {
        parseItemPrice(value) {
            if (value === '' || value === null || value === undefined) return null;
            const parsed = Number(value);
            return Number.isFinite(parsed) ? parsed : null;
        },
        hasItemSelection(item) {
            if (item.itemType === 'wallet') return true;
            return item.payable_id != null && item.payable_id !== '';
        },
        getItemValidationError(item, index) {
            const label = `آیتم ${index + 1}`;
            if (!item.itemType) {
                return `${label}: نوع آیتم را انتخاب کنید.`;
            }
            if (item.itemType !== 'wallet' && !this.hasItemSelection(item)) {
                return `${label}: ${this.getItemTypeLabel(item.itemType)} را از نتایج جستجو انتخاب کنید.`;
            }
            const price = this.parseItemPrice(item.price);
            if (price === null) {
                return `${label}: قیمت را وارد کنید.`;
            }
            if (price < 0) {
                return `${label}: قیمت نامعتبر است.`;
            }
            if (item.itemType === 'wallet' && price <= 0) {
                return `${label}: مبلغ شارژ کیف پول باید بیشتر از صفر باشد.`;
            }
            return null;
        },
        isItemValid(item, index = 0) {
            return this.getItemValidationError(item, index) === null;
        },
        errorAt(path) {
            if (!this.validationErrors) return false;
            if (path.includes('.')) {
                const parts = path.split('.');
                let current = this.validationErrors;
                for (const part of parts) {
                    if (current && typeof current === 'object' && part in current) {
                        current = current[part];
                    } else {
                        return false;
                    }
                }
                return current;
            }
            return this.validationErrors[path];
        },
        debouncedSearch() {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.performSearch();
            }, 1500);
        },
        async performSearch() {
            if (this.searchQuery.length < 2) {
                this.searchResults = [];
                return;
            }
            this.searchLoading = true;
            try {
                const response = await axiosInstance.get('/admin/payments/search', {
                    params: { search: this.searchQuery, type: 'user' },
                });
                this.searchResults = response.data.results.users || [];
                this.searchType = 'user';
            } catch (error) {
                console.error('Error searching:', error);
                this.searchResults = [];
            } finally {
                this.searchLoading = false;
            }
        },
        handleSearch() {
            this.debouncedSearch();
        },
        handleItemSearch(item, index) {
            clearTimeout(item.searchTimeout);
            item.searchTimeout = setTimeout(() => {
                this.searchItem(item, index);
            }, 1500);
        },
        async searchItem(item) {
            if (item.search.length < 2 || !item.itemType) {
                item.searchResults = [];
                return;
            }
            if (item.itemType === 'wallet') return;

            item.searchLoading = true;
            try {
                const response = await axiosInstance.get('/admin/payments/search', {
                    params: { search: item.search, type: item.itemType },
                });
                const dataKey = `${item.itemType}s`;
                item.searchResults = response.data.results[dataKey] || [];
            } catch (error) {
                console.error('Error searching items:', error);
                item.searchResults = [];
            } finally {
                item.searchLoading = false;
            }
        },
        selectUser(user) {
            this.selectedUser = user;
            this.searchQuery = '';
            this.searchResults = [];
        },
        clearSelectedUser() {
            this.selectedUser = null;
            this.searchQuery = '';
            this.searchResults = [];
        },
        selectItem(item, selectedItem) {
            if (!selectedItem?.id) return;

            item.selected = selectedItem;
            item.payable_id = selectedItem.id;
            item.payable_type = item.itemType;
            item.search = '';
            item.searchResults = [];

            if (item.itemType === 'wallet') {
                item.payable_id = null;
                item.payable_type = 'wallet';
            } else {
                const autoPrice = this.parseItemPrice(selectedItem.price);
                if (autoPrice !== null && autoPrice > 0) {
                    item.price = autoPrice;
                }
            }

            this.$nextTick(() => this.updateTotals());
        },
        clearItemSelection(item) {
            item.selected = null;
            item.payable_id = null;
            item.payable_type = item.itemType || '';
            item.search = '';
            item.searchResults = [];
            item.price = null;
            item.discount_amount = 0;
            this.$nextTick(() => this.updateTotals());
        },
        setItemType(item, newType) {
            item.itemType = newType;
            item.search = '';
            item.searchResults = [];
            item.selected = null;
            item.payable_id = null;
            item.payable_type = newType || '';
            item.price = null;
            item.discount_amount = 0;

            if (newType === 'wallet') {
                item.selected = { title: 'افزایش موجودی کیف پول' };
                item.payable_id = null;
                item.payable_type = 'wallet';
            }

            if (newType === 'wallet' && this.paymentMethod === 'wallet') {
                this.paymentMethod = '';
            }

            this.$nextTick(() => this.updateTotals());
        },
        onItemTypeChange(item) {
            this.setItemType(item, item.itemType);
        },
        addItem() {
            this.paymentItems.push(createEmptyPaymentItem());
        },
        removeItem(index) {
            if (this.paymentItems.length > 1) {
                this.paymentItems.splice(index, 1);
                this.$nextTick(() => this.updateTotals());
            }
        },
        getItemTypeLabel(itemType) {
            const labels = { course: 'دوره', plan: 'اشتراک', path: 'مسیر یادگیری', wallet: 'موجودی' };
            return labels[itemType] || 'آیتم';
        },
        updateTotals() {
            this.totalAmount = this.totalItemsAmount;
            this.totalDiscount = this.totalItemsDiscount;
        },
        onPaymentMethodChange() {
            this.gateway = '';
        },
        hasWalletItem() {
            return this.paymentItems.some((item) => item.itemType === 'wallet');
        },
        async validateTotalDiscount() {
            if (!this.totalDiscountCode || this.totalDiscountCode.length < 3) {
                this.totalDiscountValid = null;
                return;
            }
            this.totalDiscountLoading = true;
            try {
                const response = await axiosInstance.post('/cart/validate-discount', {
                    code: this.totalDiscountCode,
                    amount: this.totalAmount,
                });
                if (response.data.valid) {
                    this.totalDiscountValid = true;
                    this.totalDiscount = response.data.discount_amount || 0;
                } else {
                    this.totalDiscountValid = false;
                }
            } catch {
                this.totalDiscountValid = false;
            } finally {
                this.totalDiscountLoading = false;
            }
        },
        formatCurrency(amount) {
            if (!amount) return 0;
            return new Intl.NumberFormat('fa-IR').format(amount);
        },
        paymentMethodLabel(method) {
            if (method === 'wallet') return 'کیف پول';
            if (method === 'bank') return 'درگاه بانکی';
            if (method === 'wallet_bank') return 'کیف پول + درگاه';
            return '—';
        },
        gatewayLabel(driver) {
            if (driver === 'zibal') return 'زیبال';
            if (driver === 'zarinpal') return 'زرین‌پال';
            if (driver === 'digipay') return 'دیجی‌پی';
            return '—';
        },
        validateFormStep(stepIndex) {
            const stepId = PAYMENT_FORM_STEPS[stepIndex]?.id;
            if (stepId === 'user') {
                if (!this.selectedUser) {
                    showToastError('لطفاً یک کاربر انتخاب کنید.');
                    return false;
                }
                return true;
            }
            if (stepId === 'items') {
                for (let i = 0; i < this.paymentItems.length; i += 1) {
                    const reason = this.getItemValidationError(this.paymentItems[i], i);
                    if (reason) {
                        showToastError(reason);
                        return false;
                    }
                }
                return true;
            }
            if (stepId === 'details') {
                if (!this.paymentMethod) {
                    showToastError('روش پرداخت را انتخاب کنید.');
                    return false;
                }
                if (this.totalAmount <= 0) {
                    showToastError('مبلغ کل باید بیشتر از صفر باشد.');
                    return false;
                }
                if ((this.paymentMethod === 'bank' || this.paymentMethod === 'wallet_bank') && !this.gateway) {
                    showToastError('درگاه پرداخت را انتخاب کنید.');
                    return false;
                }
                return true;
            }
            return true;
        },
        mapErrorsToStep() {
            if (!this.validationErrors) return 0;
            const stepMap = {
                user_id: 0,
                items: 1,
                amount: 2,
                discount_amount: 2,
                discount_code: 2,
                payment_method: 2,
                driver: 2,
                expired_at: 2,
                description: 2,
            };
            for (const key of Object.keys(this.validationErrors)) {
                const base = key.split('.')[0];
                if (base in stepMap) return stepMap[base];
            }
            return 0;
        },
        resetForm() {
            this.selectedUser = null;
            this.searchQuery = '';
            this.searchResults = [];
            this.paymentItems = [createEmptyPaymentItem()];
            this.totalAmount = 0;
            this.totalDiscount = 0;
            this.totalDiscountCode = '';
            this.totalDiscountValid = null;
            this.paymentMethod = '';
            this.gateway = '';
            this.expiredAt = '';
            this.autoApprove = false;
            this.description = '';
            this.validationErrors = {};
            this.currentStep = 0;
        },
        mapPayableTypeToItemType(payableType) {
            const map = {
                Course: 'course',
                Plan: 'plan',
                Path: 'path',
                User: 'wallet',
                course: 'course',
                plan: 'plan',
                path: 'path',
                wallet: 'wallet',
            };
            return map[payableType] || String(payableType || '').toLowerCase();
        },
        itemFromPaymentApi(apiItem) {
            const itemType = this.mapPayableTypeToItemType(apiItem.payable_type);
            const item = createEmptyPaymentItem();
            item.itemType = itemType;
            item.payable_id = apiItem.payable_id;
            item.payable_type = itemType;
            item.price = apiItem.price;
            item.discount_amount = apiItem.discount_amount || 0;
            if (apiItem.payable) {
                item.selected = apiItem.payable;
            }
            return item;
        },
        applyPaymentData(payment) {
            this.selectedUser = payment.user || null;
            this.totalAmount = payment.amount ?? 0;
            this.totalDiscount = payment.discount_amount || 0;
            this.totalDiscountCode = payment.discount_code || '';
            this.paymentMethod = payment.payment_method || '';
            this.gateway = payment.driver || '';
            this.description = payment.description || '';
            this.autoApprove = false;
            this.expiredAt = payment.expired_at ? String(payment.expired_at).slice(0, 16) : '';

            if (payment.items?.length) {
                this.paymentItems = payment.items.map((item) => this.itemFromPaymentApi(item));
            } else if (payment.description?.includes('کیف پول')) {
                const walletItem = createEmptyPaymentItem();
                walletItem.itemType = 'wallet';
                walletItem.selected = { title: 'افزایش موجودی کیف پول' };
                walletItem.payable_id = payment.user?.id ?? null;
                walletItem.payable_type = 'wallet';
                walletItem.price = payment.amount;
                this.paymentItems = [walletItem];
            } else {
                this.paymentItems = [createEmptyPaymentItem()];
            }

            this.updateTotals();
        },
        async loadPayment() {
            if (!this.paymentUuid) return;
            this.pageLoading = true;
            try {
                const response = await axiosInstance.get(`/admin/payments/${this.paymentUuid}/details`);
                const payment = response.data.payment;
                if (payment.status) {
                    showToastError('پرداخت تأیید‌شده قابل ویرایش نیست.');
                    this.$router.push({ name: 'admin-payments-list' });
                    return;
                }
                this.applyPaymentData(payment);
            } catch (error) {
                console.error('Error loading payment:', error);
                showToastError('خطا در بارگذاری اطلاعات پرداخت');
                this.$router.push({ name: 'admin-payments-list' });
            } finally {
                this.pageLoading = false;
            }
        },
        buildPaymentPayload() {
            return {
                user_id: this.selectedUser.id,
                payment_method: this.paymentMethod,
                items: this.paymentItems.map((item) => ({
                    payable_type: item.itemType || item.payable_type,
                    payable_id: item.itemType === 'wallet' ? null : item.payable_id,
                    price: item.price,
                    discount_amount: item.discount_amount || 0,
                })),
                amount: this.totalAmount,
                discount_amount: this.totalDiscount || 0,
                discount_code: this.totalDiscountCode || null,
                description: this.description || null,
                auto_approve: this.autoApprove,
                expired_at: this.expiredAt || null,
                ...((this.paymentMethod === 'bank' || this.paymentMethod === 'wallet_bank') && { driver: this.gateway }),
            };
        },
        async createPayment() {
            if (!this.isFormValid) {
                showToastError('لطفاً تمام فیلدهای الزامی را تکمیل کنید.');
                return;
            }

            this.submitLoading = true;
            this.validationErrors = {};

            try {
                const paymentData = this.buildPaymentPayload();
                await axiosInstance.post('/admin/payments/create', paymentData);
                toast.success('پرداخت با موفقیت ایجاد شد، به صفحه مدیریت پرداخت‌ها هدایت می‌شوید', {
                    theme: 'colored',
                    hideProgressBar: false,
                    rtl: localStorage.getItem('direction') === 'rtl',
                    bodyClassName: 'font-YekanBakh',
                    toastClassName: 'rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0',
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                setTimeout(() => {
                    this.$router.push('/admin/payments');
                }, 2000);
            } catch (error) {
                console.error('Error creating payment:', error);
                if (error.response?.data?.errors) {
                    this.validationErrors = error.response.data.errors;
                    this.currentStep = this.mapErrorsToStep();
                    showToastError('لطفاً خطاهای فرم را برطرف کنید');
                } else {
                    showToastError(`خطا در ایجاد پرداخت: ${error.response?.data?.message || error.message}`);
                }
            } finally {
                this.submitLoading = false;
            }
        },
        async updatePayment() {
            if (!this.isFormValid) {
                showToastError('لطفاً تمام فیلدهای الزامی را تکمیل کنید.');
                return;
            }

            this.submitLoading = true;
            this.validationErrors = {};

            try {
                const paymentData = this.buildPaymentPayload();
                delete paymentData.auto_approve;

                const response = await axiosInstance.post(`/admin/payments/${this.paymentUuid}/update`, paymentData);
                if (response.data.message === 'Payment updated successfully') {
                    toast.success('پرداخت با موفقیت بروزرسانی شد', {
                        theme: 'colored',
                        hideProgressBar: false,
                        rtl: localStorage.getItem('direction') === 'rtl',
                        bodyClassName: 'font-YekanBakh',
                        toastClassName: 'rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0',
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                    setTimeout(() => {
                        this.$router.push({ name: 'admin-payments-list' });
                    }, 1500);
                }
            } catch (error) {
                console.error('Error updating payment:', error);
                if (error.response?.data?.errors) {
                    this.validationErrors = error.response.data.errors;
                    this.currentStep = this.mapErrorsToStep();
                    showToastError('لطفاً خطاهای فرم را برطرف کنید');
                } else {
                    showToastError(error.response?.data?.message || 'خطا در بروزرسانی پرداخت');
                }
            } finally {
                this.submitLoading = false;
            }
        },
    },
};

export const paymentFormMixin = {
    mixins: [createStepperMixin('PAYMENT_FORM_STEPS'), paymentFormHelpers],
    data() {
        return {
            PAYMENT_FORM_STEPS,
            BTN_SECONDARY,
            submitLoading: false,
            pageLoading: false,
            paymentUuid: null,
            searchQuery: '',
            searchResults: [],
            searchLoading: false,
            searchType: 'user',
            selectedUser: null,
            paymentItems: [createEmptyPaymentItem()],
            totalAmount: 0,
            totalDiscount: 0,
            totalDiscountCode: '',
            totalDiscountLoading: false,
            totalDiscountValid: null,
            paymentMethod: '',
            gateway: '',
            expiredAt: '',
            autoApprove: false,
            description: '',
            searchTimeout: null,
            validationErrors: {},
        };
    },
    provide() {
        return { paymentFormRoot: this };
    },
    computed: {
        isEditMode() {
            return !!this.paymentUuid;
        },
    },
};

export { ADMIN_FORM_STYLES } from '@/views/components/admin/adminFormStepperMixin.js';
