<template>
	<div>
		<Doughnut :id="chartId" :options="computedOptions" :data="formattedChartData" />
	</div>
</template>

<script>
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default {
	name: "DoughnutChart",
	components: { Doughnut },
	props: {
		rawData: {
			type: Object,
			required: true,
			default: () => ({ labels: [], data: [], colors: [] }) 
		},
		chartId: { type: String, default: "doughnut-chart" },
		chartTitle: { type: String, default: "" },
		showTitle: { type: Boolean, default: true },
		showLegend: { type: Boolean, default: true },
		fontFamily: { type: String, default: "YekanBakh, sans-serif" },
		locale: { type: String, default: "fa" },
		legendPosition: { type: String, default: "left" }, // left, top, bottom, right
		valueFormat: { type: String, default: "" },
		dateFormatOptions: {
			type: Object,
			default: () => ({
				day: "numeric",
				month: "long",
				year: "numeric"
			})
		}
	},
	data() {
		return { isDarkMode: false };
	},
	computed: {
		formattedChartData() {
			const labels = (this.rawData.labels || []).map((item) => {
				if (isNaN(Date.parse(item))) {
					return item;
				}
				return new Date(item).toLocaleDateString(
					this.locale === "fa" ? "fa-IR" : "en-US",
					this.dateFormatOptions
				);
			});

			const colors =
				this.rawData.colors?.length > 0
					? this.rawData.colors
					: this.generateColors((this.rawData.data || []).length);

			return {
				labels,
				datasets: [
					{
						label: this.chartTitle || "Doughnut Chart",
						data: this.rawData.data || [],
						backgroundColor: colors,
						borderColor: this.isDarkMode ? "#111827" : "#ffffff",
						borderWidth: 2
					}
				]
			};
		},
		computedOptions() {
			const textColor = this.isDarkMode ? "#e5e7eb" : "#374151";
			return {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					tooltip: {
						callbacks: {
							label: (context) => {
								const formatted = this.formatChartValue(context.parsed);
								return `${context.label}: ${formatted}`;
							},
						},
					},
					legend: this.showLegend
						? {
							position: this.legendPosition,
							labels: {
								color: textColor,
								boxWidth: 12,
								padding: 14,
								font: { family: this.fontFamily, size: 12 }
							}
						}
						: false,
					title: this.showTitle
						? {
							display: true,
							text: this.chartTitle,
							color: textColor,
							font: { family: this.fontFamily, size: 16, weight: "bold" }
						}
						: false
				}
			};
		}
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
		formatChartValue(value) {
			const number = Number(value || 0);
			if (!this.valueFormat) return number;
			const formatted = new Intl.NumberFormat("fa-IR").format(number);
			return this.valueFormat === "currency" ? `${formatted} تومان` : formatted;
		},
		generateColors(count) {
			return Array.from(
				{ length: count },
				(_, i) => `hsl(${(i * 360) / count}, 70%, 50%)`
			);
		}
	}
};
</script>

<style scoped></style>
