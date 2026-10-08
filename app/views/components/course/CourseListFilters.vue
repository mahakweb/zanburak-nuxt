<template>
    <div class="space-y-3">
        <section class="rounded-2xl bg-white dark:bg-gray-900 ring-1 ring-slate-200/80 dark:ring-white/10 p-4">
            <h3 class="text-sm font-extrabold text-gray-800 dark:text-gray-50">{{ $t('course.list.courseType') }}</h3>
            <div class="mt-3 space-y-0.5">
                <label v-for="item in typeOptions" :key="item.value" :for="fieldId(item.value)" class="filter-row">
                    <input
                        :id="fieldId(item.value)"
                        class="course-filter-checkbox"
                        type="checkbox"
                        :value="item.value"
                        v-model="filters.type"
                        @change="$emit('change')" />
                    <span class="min-w-0 flex-1 text-sm font-medium text-gray-800 dark:text-gray-200">{{ item.label }}</span>
                    <span v-if="item.count != null" class="count-pill">{{ item.count }}</span>
                </label>
            </div>
        </section>

        <section v-if="statuses.length" class="rounded-2xl bg-white dark:bg-gray-900 ring-1 ring-slate-200/80 dark:ring-white/10 p-4">
            <h3 class="text-sm font-extrabold text-gray-800 dark:text-gray-50">{{ $t('course.list.courseStatus') }}</h3>
            <div class="mt-3 space-y-0.5">
                <label v-for="status in statuses" :key="status.slug || status.title" :for="fieldId(`status-${status.slug}`)" class="filter-row">
                    <input
                        :id="fieldId(`status-${status.slug}`)"
                        class="course-filter-checkbox"
                        type="checkbox"
                        :value="status.title"
                        v-model="filters.status"
                        @change="$emit('change')" />
                    <span class="min-w-0 flex-1 text-sm font-medium text-gray-800 dark:text-gray-200">{{ status.title }}</span>
                </label>
            </div>
        </section>

        <section class="rounded-2xl bg-white dark:bg-gray-900 ring-1 ring-slate-200/80 dark:ring-white/10 p-4">
            <h3 class="text-sm font-extrabold text-gray-800 dark:text-gray-50">{{ $t('course.list.sortBy') }}</h3>
            <div class="mt-3 space-y-0.5">
                <label class="filter-row" :for="fieldId('order-newest')">
                    <input
                        :id="fieldId('order-newest')"
                        class="course-filter-radio"
                        type="radio"
                        value="newest"
                        v-model="filters.order"
                        @change="$emit('change')" />
                    <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ $t('course.list.newest') }}</span>
                </label>
                <label class="filter-row" :for="fieldId('order-oldest')">
                    <input
                        :id="fieldId('order-oldest')"
                        class="course-filter-radio"
                        type="radio"
                        value="oldest"
                        v-model="filters.order"
                        @change="$emit('change')" />
                    <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ $t('course.list.oldest') }}</span>
                </label>
            </div>
        </section>

        <section v-if="categories.length" class="rounded-2xl bg-white dark:bg-gray-900 ring-1 ring-slate-200/80 dark:ring-white/10 p-4">
            <h3 class="text-sm font-extrabold text-gray-800 dark:text-gray-50">{{ $t('course.list.courseCategory') }}</h3>
            <div class="mt-3 space-y-0.5">
                <label
                    v-for="(category, index) in visibleCategories"
                    :key="`${category.title}-${index}`"
                    class="filter-row"
                    :for="fieldId(`category-${index}`)">
                    <input
                        :id="fieldId(`category-${index}`)"
                        class="course-filter-checkbox"
                        type="checkbox"
                        :value="category.title"
                        v-model="filters.cat"
                        @change="$emit('change')" />
                    <span class="min-w-0 flex-1 text-sm font-medium text-gray-800 dark:text-gray-200">{{ category.title }}</span>
                </label>
            </div>
            <button
                v-if="categories.length > categoryPreviewCount"
                type="button"
                class="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition"
                @click="$emit('update:categoriesExpanded', !categoriesExpanded)">
                <svg class="w-4 h-4 transition-transform duration-300" :class="categoriesExpanded ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                {{ categoriesExpanded ? $t('discuss.sidebar.showLess') : $t('discuss.sidebar.showMore') }}
            </button>
        </section>
    </div>
</template>

<script>
export default {
    name: "CourseListFilters",
    props: {
        sidebarData: {
            type: Object,
            default: null,
        },
        filters: {
            type: Object,
            required: true,
        },
        idPrefix: {
            type: String,
            default: "filter",
        },
        categoriesExpanded: {
            type: Boolean,
            default: false,
        },
        categoryPreviewCount: {
            type: Number,
            default: 8,
        },
    },
    emits: ["change", "update:categoriesExpanded"],
    computed: {
        statuses() {
            return this.sidebarData?.statuses || [];
        },
        categories() {
            return this.sidebarData?.categories || [];
        },
        visibleCategories() {
            if (this.categoriesExpanded) return this.categories;
            return this.categories.slice(0, this.categoryPreviewCount);
        },
        typeOptions() {
            const data = this.sidebarData || {};
            return [
                { value: "free", label: this.$t("course.list.free"), count: data.numberOfFreeCourse },
                { value: "cash", label: this.$t("course.list.cashOnly"), count: data.numberOfCashCourse },
                { value: "cash-vip", label: this.$t("course.list.cashAndVip"), count: data.numberOfCashvipCourse },
                { value: "installment", label: this.$t("course.list.installmentCourses"), count: data.numberOfInstallmentCourse },
                { value: "discounted", label: this.$t("course.list.discountedCourses"), count: data.numberOfDiscountedCourse },
            ];
        },
    },
    methods: {
        fieldId(name) {
            return `${this.idPrefix}-${name}`;
        },
    },
};
</script>

<style scoped>
.filter-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-height: 2.5rem;
    margin-inline: -0.35rem;
    padding-inline: 0.35rem;
    border-radius: 0.85rem;
    cursor: pointer;
}

.filter-row:hover {
    background: rgba(148, 163, 184, 0.12);
}

.count-pill {
    flex-shrink: 0;
    min-width: 1.5rem;
    height: 1.35rem;
    padding-inline: 0.4rem;
    border-radius: 9999px;
    background: #f1f5f9;
    color: #64748b;
    font-size: 11px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

:global(.dark) .count-pill {
    background: rgba(255, 255, 255, 0.06);
    color: #94a3b8;
}

.course-filter-checkbox {
    appearance: none;
    position: relative;
    width: 1.125rem;
    height: 1.125rem;
    border-radius: 0.4rem;
    background-color: #e2e8f0;
    cursor: pointer;
    flex-shrink: 0;
    transition: background-color 0.2s ease;
}

:global(.dark) .course-filter-checkbox {
    background-color: #374151;
}

.course-filter-checkbox:checked {
    background-color: #fbbf24;
}

.course-filter-checkbox:checked::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 42%;
    width: 0.28rem;
    height: 0.55rem;
    border: solid #1f2937;
    border-width: 0 2px 2px 0;
    transform: translate(-50%, -50%) rotate(45deg);
}

.course-filter-radio {
    appearance: none;
    position: relative;
    width: 1.125rem;
    height: 1.125rem;
    border-radius: 9999px;
    border: 2px solid #94a3b8;
    background-color: transparent;
    cursor: pointer;
    flex-shrink: 0;
}

.course-filter-radio:checked {
    border-color: #fbbf24;
}

.course-filter-radio:checked::after {
    content: "";
    position: absolute;
    inset: 0;
    margin: auto;
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 9999px;
    background-color: #fbbf24;
}
</style>
