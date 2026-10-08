<template>
    <div>
        <Bar :options="computedOptions" :data="formattedChartData" />
    </div>
</template>

<script>
import { Bar } from "vue-chartjs";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
    name: "AdminBarChart",
    components: { Bar },
    props: {
        rawData: {
            type: Object,
            required: true,
            default: () => ({ labels: [], data: [] }),
        },
        chartTitle: { type: String, default: "" },
        showTitle: { type: Boolean, default: false },
        showLegend: { type: Boolean, default: false },
        horizontal: { type: Boolean, default: false },
        barColor: { type: String, default: "rgba(245, 158, 11, 0.85)" },
        hoverColor: { type: String, default: "rgba(245, 158, 11, 1)" },
        colors: { type: Array, default: () => [] },
        fontFamily: { type: String, default: "YekanBakh, sans-serif" },
        showGrid: { type: Boolean, default: true },
        valueFormat: { type: String, default: "" },
    },
    data() {
        return { isDarkMode: false };
    },
    computed: {
        formattedChartData() {
            const data = this.rawData.data || [];
            const backgroundColor = this.colors.length
                ? this.colors
                : data.map(() => this.barColor);

            return {
                labels: this.rawData.labels || [],
                datasets: [
                    {
                        label: this.chartTitle || "Chart",
                        data,
                        backgroundColor,
                        hoverBackgroundColor: this.hoverColor,
                        borderRadius: 6,
                        maxBarThickness: this.horizontal ? 28 : 48,
                    },
                ],
            };
        },
        computedOptions() {
            const textColor = this.isDarkMode ? "#f3f4f6" : "#1f2937";
            const gridColor = this.isDarkMode ? "#374151" : "#e5e7eb";
            const indexAxis = this.horizontal ? "y" : "x";

            return {
                indexAxis,
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => this.formatChartValue(context.parsed[this.horizontal ? "x" : "y"], true),
                        },
                    },
                    legend: this.showLegend
                        ? {
                            labels: {
                                color: textColor,
                                font: { family: this.fontFamily, size: 12 },
                            },
                        }
                        : false,
                    title: this.showTitle
                        ? {
                            display: true,
                            text: this.chartTitle,
                            color: textColor,
                            font: { family: this.fontFamily, size: 14, weight: "bold" },
                        }
                        : false,
                },
                scales: {
                    x: {
                        grid: { drawOnChartArea: this.showGrid && !this.horizontal, color: gridColor },
                        ticks: {
                            color: textColor,
                            font: { family: this.fontFamily, size: 11 },
                            maxRotation: this.horizontal ? 0 : 45,
                            callback: this.horizontal ? (value) => this.formatChartValue(value, false) : undefined,
                        },
                    },
                    y: {
                        grid: { drawOnChartArea: this.showGrid && this.horizontal, color: gridColor },
                        ticks: {
                            color: textColor,
                            font: { family: this.fontFamily, size: 11 },
                            callback: this.horizontal ? undefined : (value) => this.formatChartValue(value, false),
                        },
                        beginAtZero: true,
                    },
                },
            };
        },
    },
    mounted() {
        this.detectDarkMode();
        this.darkObserver = new MutationObserver(this.detectDarkMode);
        this.darkObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });
    },
    beforeUnmount() {
        this.darkObserver?.disconnect();
    },
    methods: {
        detectDarkMode() {
            this.isDarkMode = document.documentElement.classList.contains("dark");
        },
        formatChartValue(value, withUnit) {
            const formatted = new Intl.NumberFormat("fa-IR").format(Number(value) || 0);
            if (!this.valueFormat) return formatted;
            return this.valueFormat === "currency" && withUnit ? `${formatted} تومان` : formatted;
        },
    },
};
</script>
