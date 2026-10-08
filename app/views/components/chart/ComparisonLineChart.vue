<template>
    <div>
        <Line :options="computedOptions" :data="formattedChartData" />
    </div>
</template>

<script>
import { Line } from "vue-chartjs";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Filler,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler);

export default {
    name: "ComparisonLineChart",
    components: { Line },
    props: {
        labels: { type: Array, default: () => [] },
        datasets: {
            type: Array,
            default: () => [],
            // [{ label, data, lineColor, fillColor }]
        },
        showLegend: { type: Boolean, default: true },
        fontFamily: { type: String, default: "YekanBakh, sans-serif" },
        showGrid: { type: Boolean, default: true },
        valueFormat: { type: String, default: "" },
    },
    data() {
        return { isDarkMode: false };
    },
    computed: {
        formattedChartData() {
            return {
                labels: this.labels,
                datasets: this.datasets.map((ds) => ({
                    label: ds.label,
                    data: ds.data || [],
                    borderColor: ds.lineColor || ds.borderColor || "rgba(59, 130, 246, 1)",
                    backgroundColor: ds.fillColor || ds.backgroundColor || "rgba(59, 130, 246, 0.12)",
                    fill: ds.fill !== false,
                    tension: 0.35,
                    pointRadius: 2,
                    pointHoverRadius: 4,
                })),
            };
        },
        computedOptions() {
            const textColor = this.isDarkMode ? "#e5e7eb" : "#374151";
            const gridColor = this.isDarkMode ? "rgba(55, 65, 81, 0.55)" : "rgba(229, 231, 235, 0.95)";
            return {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: "index", intersect: false },
                plugins: {
                    legend: this.showLegend
                        ? {
                            position: "bottom",
                            labels: {
                                color: textColor,
                                boxWidth: 12,
                                boxHeight: 8,
                                padding: 16,
                                font: { family: this.fontFamily, size: 12 },
                            },
                        }
                        : false,
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.dataset.label}: ${this.formatChartValue(context.parsed.y, true)}`,
                        },
                    },
                },
                scales: {
                    x: {
                        border: { display: false },
                        grid: { drawOnChartArea: this.showGrid, color: gridColor, tickLength: 0 },
                        ticks: { color: textColor, font: { family: this.fontFamily, size: 11 }, maxRotation: 0, padding: 8 },
                    },
                    y: {
                        border: { display: false },
                        grid: { drawOnChartArea: this.showGrid, color: gridColor, tickLength: 0 },
                        ticks: {
                            color: textColor,
                            font: { family: this.fontFamily, size: 11 },
                            padding: 8,
                            callback: (value) => this.formatChartValue(value, false),
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
            const number = Number(value || 0);
            if (!this.valueFormat) return number;
            const formatted = new Intl.NumberFormat("fa-IR", withUnit
                ? { maximumFractionDigits: 0 }
                : { notation: "compact", maximumFractionDigits: 1 }).format(number);
            return this.valueFormat === "currency" && withUnit ? `${formatted} تومان` : formatted;
        },
    },
};
</script>
