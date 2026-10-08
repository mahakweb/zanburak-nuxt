<template>
	<div>
		<Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
	</div>
</template>

<script>
	import { Bar } from "vue-chartjs";
	import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

	ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

	export default {
		name: "BarChart",
		components: { Bar },
		data() {
			return {
				chartData: {
					labels: ["January", "February", "March"],
					backgroundColor: "#fed700",
					datasets: [
						{
							label: "Bar chart",
							hoverBackgroundColor: "#fed700",
							hoverBorderColor: "#545454",
							hoverBorderWidth: "5",
							borderAlign: "center", //inner also exists
							weight: "5",
							cutoutPercentage: 20,
							data: [40, 20, 12]
						},
						// {
						// 	label: "Bar chart 2",
						// 	hoverBackgroundColor: "#fed200",
						// 	hoverBorderColor: "#656565",
						// 	hoverBorderWidth: "5",
						// 	borderAlign: "center", //inner also exists
						// 	weight: "5",
						// 	cutoutPercentage: 20,
						// 	data: [21, 10, 42]
						// }
					]
				},
				chartOptions: {
					responsive: true
				}
			};
		}
	};
</script>

<style></style>
