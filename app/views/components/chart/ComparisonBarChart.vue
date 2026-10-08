<template>
    <div>
        <Bar :options="computedOptions" :data="formattedChartData" />
    </div>
</template>

<script>
import { Bar } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
    name: "ComparisonBarChart",
    components: { Bar },
    props: {
        labels: { type: Array, default: () => [] },
        datasets: {
            type: Array,
            default: () => [],
            // [{ label, data, color, hoverColor }]
        },
        horizontal: { type: Boolean, default: false },
        showLegend: { type: Boolean, default: true },
        fontFamily: { type: String, default: "YekanBakh, sans-serif" },
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
                    backgroundColor: ds.color || "rgba(245, 158, 11, 0.85)",
                    hoverBackgroundColor: ds.hoverColor || ds.color || "rgba(245, 158, 11, 1)",
                    borderRadius: 6,
                    maxBarThickness: this.horizontal ? 22 : 40,
                })),
            };
        },
        computedOptions() {
            const textColor = this.isDarkMode ? "#f3f4f6" : "#1f2937";
            const gridColor = this.isDarkMode ? "#374151" : "#e5e7eb";
            return {
                indexAxis: this.horizontal ? "y" : "x",
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: this.showLegend
                        ? { labels: { color: textColor, font: { family: this.fontFamily, size: 12 } } }
                        : false,
                },
                scales: {
                    x: {
                        grid: { drawOnChartArea: !this.horizontal, color: gridColor },
                        ticks: { color: textColor, font: { family: this.fontFamily, size: 11 }, maxRotation: this.horizontal ? 0 : 35 },
                    },
                    y: {
                        grid: { drawOnChartArea: this.horizontal, color: gridColor },
                        ticks: { color: textColor, font: { family: this.fontFamily, size: 11 } },
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
    },
};
</script>
