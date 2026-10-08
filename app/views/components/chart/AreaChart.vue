<template>
	<div>
		<Line id="area-chart" :options="computedOptions" :data="formattedChartData" />
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
	Filler
} from "chart.js";

ChartJS.register(
	Title,
	Tooltip,
	Legend,
	LineElement,
	CategoryScale,
	LinearScale,
	PointElement,
	Filler
);

export default {
	name: "AreaChart",
	components: { Line },
	props: {
		rawData: {
			type: Object,
			required: true,
			default: () => ({ labels: [], data: [] }) 
			// format: { labels: [...], data: [...] }
		},
		parseLabelsAsDates: {
			type: Boolean,
			default: true,
		},
		chartTitle: {
			type: String,
			default: ""
		},
		showTitle: {
			type: Boolean,
			default: true
		},
		showLegend: {
			type: Boolean,
			default: true
		},
		lineColor: {
			type: String,
			default: "rgba(54, 162, 235, 1)"
		},
		fillColor: {
			type: String,
			default: "rgba(54, 162, 235, 0.4)"
		},
		fontFamily: {
			type: String,
			default: "YekanBakh, sans-serif"
		},
		locale: {
			type: String,
			default: "fa" // fa = فارسی، en = انگلیسی
		},
		showGrid: {
			type: Boolean,
			default: true
		},
		showFill: {
			type: Boolean,
			default: true
		},
		showPoints: {
			type: Boolean,
			default: true,
		},
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
		return {
			isDarkMode: false
		};
	},
	computed: {
		formattedChartData() {
			const labels = this.parseLabelsAsDates
				? (this.rawData.labels || []).map((date) => {
					const parsed = new Date(date);
					if (Number.isNaN(parsed.getTime())) return date;
					return parsed.toLocaleDateString(
						this.locale === "fa" ? "fa-IR" : "en-US",
						this.dateFormatOptions
					);
				})
				: (this.rawData.labels || []);

			return {
				labels,
				datasets: [
					{
						label: this.chartTitle || "Line Chart",
						backgroundColor: this.fillColor,
						borderColor: this.lineColor,
						data: this.rawData.data,
						fill: this.showFill,
						tension: 0.4,
						pointRadius: this.showPoints ? 2 : 0,
						pointHoverRadius: this.showPoints ? 4 : 0,
					}
				]
			};
		},
		computedOptions() {
			const textColor = this.isDarkMode ? "#f3f4f6" : "#1f2937";
			const gridColor = this.isDarkMode ? "#374151" : "#e5e7eb";

			return {
				responsive: true,
				plugins: {
					legend: this.showLegend
						? {
							labels: {
								color: textColor,
								font: {
									family: this.fontFamily,
									size: 14
								}
							}
						}
						: false,
					title: this.showTitle
						? {
							display: true,
							text: this.chartTitle,
							color: textColor,
							font: {
								family: this.fontFamily,
								size: 16,
								weight: "bold"
							}
						}
						: false
				},
				scales: {
					x: {
						grid: {
							drawOnChartArea: this.showGrid,
							color: gridColor,
							drawTicks: true
						},
						ticks: {
							color: textColor,
							font: {
								family: this.fontFamily,
								size: 12
							}
						}
					},
					y: {
						grid: {
							drawOnChartArea: this.showGrid,
							color: gridColor,
							drawTicks: true
						},
						ticks: {
							color: textColor,
							font: {
								family: this.fontFamily,
								size: 12
							}
						}
					}
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
		}
	}
};
</script>

<style scoped></style>