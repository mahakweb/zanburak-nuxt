<template>
    <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-4 mb-6 shadow-sm">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
            <div>
                <h3 class="text-sm font-bold text-gray-900 dark:text-white">{{ title }}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ subtitle }}</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
                <div class="flex items-center gap-0.5 bg-gray-100 dark:bg-gray-800 rounded-full p-0.5">
                    <button type="button" class="px-2.5 py-1 text-xs font-semibold rounded-full transition-colors"
                        :class="metric === 'count' ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300'"
                        @click="setMetric('count')">تعداد</button>
                    <button type="button" class="px-2.5 py-1 text-xs font-semibold rounded-full transition-colors"
                        :class="metric === 'amount' ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300'"
                        @click="setMetric('amount')">مبلغ</button>
                </div>
                <button v-for="preset in presets" :key="preset.value" type="button"
                    class="px-3 py-1.5 text-xs font-semibold rounded-lg"
                    :class="activePreset === preset.value ? 'bg-yellow-400 text-black' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'"
                    @click="applyPreset(preset.value)">
                    {{ preset.label }}
                </button>
                <select v-model="grain" class="text-xs rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 px-2 py-1.5" @change="load">
                    <option value="day">روز</option>
                    <option value="month">ماه</option>
                    <option value="year">سال</option>
                </select>
            </div>
        </div>
        <div v-if="activePreset === 'custom'" class="flex flex-wrap items-center gap-2 mb-4">
            <input v-model="dateFrom" type="date" class="text-xs rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 px-2 py-1.5" />
            <input v-model="dateTo" type="date" class="text-xs rounded-lg bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 px-2 py-1.5" />
            <button type="button" class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-900 text-white dark:bg-white dark:text-gray-900" @click="load">اعمال بازه</button>
        </div>
        <div v-if="loading" class="h-56 flex items-center justify-center text-xs text-gray-400">در حال آماده‌سازی نمودار...</div>
        <div v-else-if="error" class="text-sm text-rose-600">{{ error }}</div>
        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
            <div class="lg:col-span-2 min-h-72">
                <ComparisonLineChart v-if="chartLabels.length" :key="chartKey" class="h-72" :labels="chartLabels" :datasets="datasets" :value-format="valueFormat" />
            </div>
            <div class="flex items-center justify-center">
                <DoughnutChart :key="chartKey" class="h-44 w-full max-w-[11.5rem]" :showTitle="false" legend-position="bottom" :rawData="doughnut" :value-format="valueFormat" />
            </div>
        </div>
    </div>
</template>

<script>
import axiosInstance from "@/store/axiosInstance";
import ComparisonLineChart from "@/views/components/chart/ComparisonLineChart.vue";
import DoughnutChart from "@/views/components/chart/DoughnutChart.vue";

export default {
    name: "FinanceTrendCard",
    components: { ComparisonLineChart, DoughnutChart },
    props: {
        title: { type: String, required: true },
        subtitle: { type: String, default: "" },
        endpoint: { type: String, required: true },
        positiveLabel: { type: String, required: true },
        negativeLabel: { type: String, required: true },
    },
    data() {
        return {
            presets: [
                { value: "today", label: "امروز" },
                { value: "week", label: "این هفته" },
                { value: "month", label: "این ماه" },
                { value: "year", label: "امسال" },
                { value: "custom", label: "بازه دلخواه" },
            ],
            activePreset: "month",
            grain: "day",
            dateFrom: "",
            dateTo: "",
            loading: false,
            error: "",
            series: null,
            responseGrain: "day",
            metric: "count",
        };
    },
    computed: {
        valueFormat() {
            return this.metric === "amount" ? "currency" : "number";
        },
        chartKey() {
            return this.metric;
        },
        chartLabels() {
            return (this.series?.labels || []).map((label) => this.formatLabel(label));
        },
        datasets() {
            const positive = this.metric === "amount" ? this.series?.positive_amounts : this.series?.positive_counts;
            const negative = this.metric === "amount" ? this.series?.negative_amounts : this.series?.negative_counts;
            return [
                {
                    label: this.positiveLabel,
                    data: positive || [],
                    lineColor: "rgba(34, 197, 94, 1)",
                    fillColor: "rgba(34, 197, 94, 0.18)",
                },
                {
                    label: this.negativeLabel,
                    data: negative || [],
                    lineColor: "rgba(245, 158, 11, 1)",
                    fillColor: "rgba(245, 158, 11, 0.16)",
                },
            ];
        },
        doughnut() {
            const positiveKey = this.metric === "amount" ? "positive_amounts" : "positive_counts";
            const negativeKey = this.metric === "amount" ? "negative_amounts" : "negative_counts";
            const paid = (this.series?.[positiveKey] || []).reduce((sum, value) => sum + Number(value || 0), 0);
            const unpaid = (this.series?.[negativeKey] || []).reduce((sum, value) => sum + Number(value || 0), 0);
            return {
                labels: [this.positiveLabel, this.negativeLabel],
                data: [paid, unpaid],
                colors: ["rgba(34, 197, 94, 0.85)", "rgba(245, 158, 11, 0.85)"],
            };
        },
    },
    created() {
        this.load();
    },
    methods: {
        setMetric(metric) {
            this.metric = metric;
            this.$emit("update:metric", metric);
        },
        applyPreset(preset) {
            this.activePreset = preset;
            if (preset === "year") this.grain = "month";
            if (preset === "today" || preset === "week" || preset === "month") this.grain = "day";
            if (preset !== "custom") this.load();
        },
        async load() {
            this.loading = true;
            this.error = "";
            try {
                const response = await axiosInstance.post(this.endpoint, {
                    preset: this.activePreset,
                    grain: this.grain,
                    date_from: this.dateFrom || undefined,
                    date_to: this.dateTo || undefined,
                });
                this.series = response.data.series;
                this.responseGrain = response.data.grain || this.grain;
            } catch (error) {
                this.error = error?.response?.data?.message || "نمودار بارگذاری نشد.";
            } finally {
                this.loading = false;
            }
        },
        formatLabel(value) {
            if (this.responseGrain === "year") return value;
            const date = new Date(this.responseGrain === "month" ? `${value}-01` : value);
            if (Number.isNaN(date.getTime())) return value;
            return new Intl.DateTimeFormat("fa-IR", this.responseGrain === "month"
                ? { month: "short", year: "numeric" }
                : { month: "short", day: "numeric" }).format(date);
        },
    },
};
</script>
