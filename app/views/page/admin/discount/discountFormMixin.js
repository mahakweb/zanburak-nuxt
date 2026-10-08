import axiosInstance from "@/store/axiosInstance";
import { createStepperMixin, BTN_SECONDARY } from "@/views/components/admin/adminFormStepperMixin.js";
import { showToastError } from "@/utils/toastConfig";

export const DISCOUNT_FORM_STEPS = [
    { id: "basic", label: "اطلاعات پایه", hint: "کد، نوع و مقدار" },
    { id: "limits", label: "محدودیت‌ها", hint: "استفاده و زمان" },
    { id: "promotion", label: "پروموشن", hint: "نمایش عمومی" },
    { id: "eligibilities", label: "واجد شرایط", hint: "قوانین دسترسی" },
    { id: "conditions", label: "شرایط اعمال", hint: "قوانین سبد خرید" },
    { id: "confirm", label: "تایید و ثبت", hint: "بررسی نهایی" },
];

export const BANNER_ICON_OPTIONS = ["🔥", "🎁", "💥", "⭐", "🏷️", "🎉", "⏰", "💎", "🚀", "📢"];

export function toDatetimeLocalValue(value) {
    if (!value) return "";
    const raw = value instanceof Date ? value : String(value);
    if (typeof raw === "string") {
        const localMatch = raw.match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/);
        if (localMatch && !/[zZ]|[+-]\d{2}:?\d{2}$/.test(raw.trim()) && !raw.includes(".")) {
            return `${localMatch[1]}T${localMatch[2]}`;
        }
    }
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function createEmptyDiscountForm() {
    const now = toDatetimeLocalValue(new Date());
    const weekLater = toDatetimeLocalValue(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    return {
        code: "",
        title: "",
        description: "",
        type: "",
        value: null,
        max_discount_amount: null,
        usage_limit: null,
        per_user_limit: null,
        starts_at: now,
        ends_at: weekLater,
        is_active: true,
        stackable: true,
        apply_automatically: false,
        is_public: false,
        banner_title: "",
        banner_description: "",
        banner_icon: "🔥",
        cta_text: "",
        destination_type: "promotion",
        destination_url: "",
        priority: 0,
        eligibilities: [],
        conditions: [],
    };
}

export const discountFormHelpers = {
    methods: {
        errorAt(path) {
            if (!this.errors) return false;
            if (path.includes(".")) {
                const parts = path.split(".");
                let current = this.errors;
                for (const part of parts) {
                    if (current && typeof current === "object" && part in current) {
                        current = current[part];
                    } else {
                        return false;
                    }
                }
                return current;
            }
            return this.errors[path];
        },
        clearDateField(field) {
            if (this.form && field in this.form) {
                this.form[field] = "";
            }
        },
        searchResultLabel(result) {
            if (!result) return "";
            const fullName = [result.first_name, result.last_name].filter(Boolean).join(" ").trim();
            return result.label
                || result.title
                || result.name
                || fullName
                || result.username
                || result.email
                || (result.id != null ? `#${result.id}` : "");
        },
        selectedTargetDisplay(item) {
            if (!item) return "";
            return item.search_query || item.target_label || "";
        },
        addEligibility() {
            this.form.eligibilities.push({
                type: "inclusion",
                target_type: "user",
                target_id: "",
                search_query: "",
                target_label: "",
                searchResults: [],
                searching: false,
            });
        },
        removeEligibility(index) {
            this.form.eligibilities.splice(index, 1);
        },
        addCondition() {
            this.form.conditions.push({
                condition_type: "min_cart_total",
                operator: ">=",
                value: null,
                item_type: undefined,
                target_id: "",
                search_query: "",
                target_label: "",
                searchResults: [],
                searching: false,
                extra: {},
            });
        },
        removeCondition(index) {
            this.form.conditions.splice(index, 1);
        },
        handleTargetSearch(index, event) {
            const query = event.target.value;
            const eligibility = this.form.eligibilities[index];
            eligibility.search_query = query;
            eligibility.searchResults = [];
            if (eligibility.target_label !== query) {
                eligibility.target_id = "";
                eligibility.target_label = "";
            }
            if (query.length < 2) return;
            clearTimeout(eligibility.searchTimeout);
            eligibility.searchTimeout = setTimeout(() => {
                eligibility.searching = true;
                this.performSearch(index, query);
            }, 800);
        },
        async performSearch(index, query) {
            const eligibility = this.form.eligibilities[index];
            try {
                const params = { search: query, type: eligibility.target_type, limit: 10 };
                const response = await axiosInstance.get("admin/discount/search/eligibility", { params });
                eligibility.searchResults = response.data.data || response.data;
            } catch (error) {
                console.error("Search error:", error);
                eligibility.searchResults = [];
            } finally {
                eligibility.searching = false;
            }
        },
        selectSearchResult(index, result) {
            const eligibility = this.form.eligibilities[index];
            const label = this.searchResultLabel(result);
            eligibility.target_id = result.id;
            eligibility.target_label = label;
            eligibility.search_query = label;
            eligibility.searchResults = [];
        },
        clearTargetSearch(index) {
            const eligibility = this.form.eligibilities[index];
            eligibility.target_id = "";
            eligibility.search_query = "";
            eligibility.target_label = "";
            eligibility.searchResults = [];
            eligibility.searching = false;
            if (eligibility.searchTimeout) clearTimeout(eligibility.searchTimeout);
        },
        handleConditionSearch(index, event) {
            const query = event.target.value;
            const condition = this.form.conditions[index];
            condition.search_query = query;
            condition.searchResults = [];
            if (condition.target_label !== query) {
                condition.target_id = "";
                condition.target_label = "";
            }
            if (query.length < 2) return;
            clearTimeout(condition.searchTimeout);
            condition.searchTimeout = setTimeout(() => {
                condition.searching = true;
                this.performConditionSearch(index, query);
            }, 800);
        },
        async performConditionSearch(index, query) {
            const condition = this.form.conditions[index];
            try {
                const params = { search: query, type: condition.item_type, limit: 10 };
                const response = await axiosInstance.get("admin/discount/search/eligibility", { params });
                condition.searchResults = response.data.data || response.data;
            } catch (error) {
                console.error("Condition search error:", error);
                condition.searchResults = [];
            } finally {
                condition.searching = false;
            }
        },
        selectConditionSearchResult(index, result) {
            const condition = this.form.conditions[index];
            const label = this.searchResultLabel(result);
            condition.target_id = result.id;
            condition.target_label = label;
            condition.search_query = label;
            condition.searchResults = [];
        },
        clearConditionSearch(index) {
            const condition = this.form.conditions[index];
            condition.target_id = "";
            condition.search_query = "";
            condition.target_label = "";
            condition.searchResults = [];
            condition.searching = false;
            if (condition.searchTimeout) clearTimeout(condition.searchTimeout);
        },
        getConditionTypeName(conditionType) {
            const conditionNames = {
                min_cart_total: "حداقل مبلغ سبد",
                max_cart_total: "حداکثر مبلغ سبد",
                min_item_price: "حداقل قیمت آیتم",
                max_item_price: "حداکثر قیمت آیتم",
                min_item_count: "حداقل تعداد آیتم",
                max_item_count: "حداکثر تعداد آیتم",
                first_purchase: "اولین خرید",
                no_purchase_since: "عدم خرید از روزهای اخیر",
                min_orders_count: "حداقل تعداد سفارش‌های قبلی",
                max_orders_count: "حداکثر تعداد سفارش‌های قبلی",
                day_of_week: "روز هفته",
                time_range: "بازه زمانی ساعت",
                date_range: "بازه تاریخی",
                required_item: "وجود آیتم الزامی",
                forbidden_item: "وجود آیتم ممنوعه",
                required_category: "وجود دسته‌بندی الزامی",
                forbidden_category: "وجود دسته‌بندی ممنوعه",
                min_total_spent: "حداقل مجموع هزینه‌های گذشته",
                max_total_spent: "حداکثر مجموع هزینه‌های گذشته",
                purchased_product_before: "خرید آیتم مشخص قبلاً",
                not_purchased_product_before: "عدم خرید آیتم مشخص",
                new_user: "کاربر جدید",
            };
            return conditionNames[conditionType] || conditionType;
        },
        getOperatorName(operator) {
            const operatorNames = {
                "=": "مساوی",
                "!=": "نامساوی",
                ">": "بزرگتر",
                "<": "کوچکتر",
                ">=": "بزرگتر یا مساوی",
                "<=": "کوچکتر یا مساوی",
            };
            return operatorNames[operator] || operator;
        },
        shouldShowOperator(conditionType) {
            const noOperatorConditions = [
                "day_of_week", "time_range", "date_range", "required_item", "forbidden_item",
                "required_category", "forbidden_category", "purchased_product_before",
                "not_purchased_product_before", "first_purchase", "new_user",
            ];
            return !noOperatorConditions.includes(conditionType);
        },
        formatPersianDate(dateString) {
            if (!dateString) return "------";
            try {
                return new Date(dateString).toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "2-digit" });
            } catch {
                return dateString;
            }
        },
        formatPersianDateTime(dateString) {
            if (!dateString) return "------";
            try {
                return new Date(dateString).toLocaleDateString("fa-IR", {
                    year: "numeric", month: "long", day: "2-digit", hour: "2-digit", minute: "2-digit",
                });
            } catch {
                return dateString;
            }
        },
        formatTimeRange(condition) {
            if (!condition.extra) return "";
            const start = condition.extra.start;
            const end = condition.extra.end;
            if (!start && !end) return "";
            let result = "";
            if (start) result += `از ${start}`;
            if (start && end) result += " ";
            if (end) result += `تا ${end}`;
            return result;
        },
        formatDateRange(condition) {
            if (!condition.extra) return "";
            const startDate = condition.extra.start_date;
            const endDate = condition.extra.end_date;
            if (!startDate && !endDate) return "";
            let result = "";
            if (startDate) result += `از ${this.formatPersianDate(startDate)}`;
            if (startDate && endDate) result += " ";
            if (endDate) result += `تا ${this.formatPersianDate(endDate)}`;
            return result;
        },
        formatDayOfWeek(condition) {
            if (!condition.extra || !condition.extra.days) return "";
            const dayNames = { 0: "یکشنبه", 1: "دوشنبه", 2: "سه‌شنبه", 3: "چهارشنبه", 4: "پنج‌شنبه", 5: "جمعه", 6: "شنبه" };
            const days = condition.extra.days.split(",").map((d) => d.trim());
            return days.map((day) => dayNames[day] || day).join("، ");
        },
        getItemTypeName(itemType) {
            const typeNames = { course: "دوره", path: "مسیر", vip: "اشتراک" };
            return typeNames[itemType] || itemType;
        },
        getItemNameById(itemId, itemType) {
            if (itemId && itemType) return `${this.getItemTypeName(itemType)} (ID: ${itemId})`;
            return itemId ? `ID: ${itemId}` : "";
        },
        getCategoryNameById(categoryId) {
            return categoryId ? `دسته‌بندی (ID: ${categoryId})` : "";
        },
        getConditionDisplayValue(condition) {
            const conditionType = condition.condition_type;
            switch (conditionType) {
                case "date_range": return this.formatDateRange(condition);
                case "time_range": return this.formatTimeRange(condition);
                case "day_of_week": return this.formatDayOfWeek(condition);
                case "required_item":
                case "forbidden_item":
                case "purchased_product_before":
                case "not_purchased_product_before": {
                    const label = this.selectedTargetDisplay(condition);
                    if (label) return label;
                    if (condition.target_id && condition.item_type) return this.getItemNameById(condition.target_id, condition.item_type);
                    return condition.target_id ? `ID: ${condition.target_id}` : "";
                }
                case "required_category":
                case "forbidden_category":
                    return this.getCategoryNameById(condition.value);
                case "first_purchase": return "فقط برای اولین خرید";
                case "new_user": return condition.value ? `کاربران جدید (${condition.value} روز)` : "کاربران جدید";
                case "no_purchase_since": return condition.value ? `عدم خرید از ${condition.value} روز گذشته` : "";
                default: return condition.value || "";
            }
        },
        getTypeLabel(type) {
            if (type === "percent") return "درصدی";
            if (type === "fixed") return "مبلغ ثابت";
            if (type === "free") return "رایگان";
            return type;
        },
        getValueDisplay(type, value) {
            if (type === "free") return "رایگان";
            if (type === "percent") return `${value}%`;
            if (type === "fixed") return `${Number(value).toLocaleString()} تومان`;
            return value;
        },
        prepareFormData() {
            const asBool = (value) => value === true || value === "true" || value === 1 || value === "1";
            const toId = (value) => {
                if (value === null || value === undefined || value === "") return null;
                const n = Number(value);
                return Number.isInteger(n) && n > 0 ? n : null;
            };
            return {
                code: this.form.code,
                title: this.form.title,
                description: this.form.description,
                type: this.form.type,
                value: this.form.value,
                max_discount_amount: this.form.max_discount_amount || null,
                usage_limit: this.form.usage_limit || null,
                per_user_limit: this.form.per_user_limit || null,
                starts_at: this.form.starts_at || null,
                ends_at: this.form.ends_at || null,
                is_active: asBool(this.form.is_active),
                stackable: asBool(this.form.stackable),
                apply_automatically: asBool(this.form.apply_automatically),
                is_public: asBool(this.form.is_public),
                banner_title: this.form.banner_title || null,
                banner_description: this.form.banner_description || null,
                banner_icon: this.form.banner_icon || null,
                cta_text: this.form.cta_text,
                destination_type: this.form.destination_type,
                destination_url: this.form.destination_url,
                priority: this.form.priority,
                eligibilities: this.form.eligibilities
                    .filter((el) => el.type && el.target_type)
                    .map((el) => ({
                        type: el.type,
                        target_type: el.target_type,
                        target_id: toId(el.target_id),
                    })),
                conditions: this.form.conditions
                    .filter((cond) => cond.condition_type)
                    .map((cond) => ({
                        condition_type: cond.condition_type,
                        operator: cond.operator,
                        value: cond.value,
                        item_type: cond.item_type,
                        target_id: toId(cond.target_id),
                        extra: cond.extra || {},
                    })),
            };
        },
        validateFormStep(stepIndex) {
            const stepId = this.DISCOUNT_FORM_STEPS[stepIndex]?.id;
            if (stepId === "basic") {
                if (!this.form.code?.trim()) {
                    showToastError("کد تخفیف الزامی است.");
                    return false;
                }
                if (!this.form.type) {
                    showToastError("نوع تخفیف را انتخاب کنید.");
                    return false;
                }
                if (this.form.type !== "free" && (this.form.value === null || this.form.value === "")) {
                    showToastError("مقدار تخفیف الزامی است.");
                    return false;
                }
            }
            if (stepId === "promotion") {
                if (this.form.banner_description?.trim() && !this.form.banner_title?.trim()) {
                    showToastError("در صورت وارد کردن توضیح بنر، عنوان بنر الزامی است.");
                    return false;
                }
            }
            return true;
        },
        mapErrorsToStep() {
            if (!this.errors) return 0;
            const stepMap = {
                code: 0, title: 0, type: 0, value: 0, is_active: 0, description: 0, max_discount_amount: 0, stackable: 0, apply_automatically: 0,
                usage_limit: 1, per_user_limit: 1, starts_at: 1, ends_at: 1,
                is_public: 2, banner_title: 2, banner_description: 2, banner_icon: 2, cta_text: 2, destination_type: 2, destination_url: 2, priority: 2,
                eligibilities: 3, conditions: 4,
            };
            for (const key of Object.keys(this.errors)) {
                const base = key.split(".")[0];
                if (base in stepMap) return stepMap[base];
            }
            return 0;
        },
        resetForm() {
            this.form = createEmptyDiscountForm();
            this.errors = null;
            this.currentStep = 0;
        },
        setupClickOutsideHandler() {
            this.clickOutsideHandler = (event) => {
                if (!event.target.closest(".search-dropdown-container")) {
                    this.form.eligibilities.forEach((el) => { el.searchResults = []; });
                    this.form.conditions.forEach((cond) => { cond.searchResults = []; });
                }
            };
            document.addEventListener("click", this.clickOutsideHandler);
        },
        teardownClickOutsideHandler() {
            if (this.clickOutsideHandler) document.removeEventListener("click", this.clickOutsideHandler);
            this.form.eligibilities.forEach((el) => { if (el.searchTimeout) clearTimeout(el.searchTimeout); });
            this.form.conditions.forEach((cond) => { if (cond.searchTimeout) clearTimeout(cond.searchTimeout); });
        },
        normalizeTargetType(targetType) {
            const map = {
                "App\\Models\\User": "user",
                "App\\Models\\Course": "course",
                "App\\Models\\Path": "path",
                "App\\Models\\Plan": "vip",
                "App\\Models\\Category": "category",
            };
            return map[targetType] || targetType;
        },
        normalizeItemType(itemType) {
            const map = {
                "App\\Models\\Course": "course",
                "App\\Models\\Path": "path",
                "App\\Models\\Plan": "vip",
            };
            return map[itemType] || itemType;
        },
    },
};

export const discountFormMixin = {
    mixins: [createStepperMixin("DISCOUNT_FORM_STEPS"), discountFormHelpers],
    data() {
        return {
            DISCOUNT_FORM_STEPS,
            BTN_SECONDARY,
            form: createEmptyDiscountForm(),
            errors: null,
            submitLoading: false,
            pageLoading: false,
        };
    },
    provide() {
        return { discountFormRoot: this };
    },
};

export { ADMIN_FORM_STYLES } from "@/views/components/admin/adminFormStepperMixin.js";
