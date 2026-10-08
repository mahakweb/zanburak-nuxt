<template>
	<div>
		<Pie id="my-chart-id" :options="chartOptions" :data="chartData" />
	</div>
</template>

<script>
	import { Pie } from "vue-chartjs";
	import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from "chart.js";

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

	export default {
		name: "PieChart",
		components: { Pie },
		data() {
			return {
				chartData: {
					labels: ["January", "February", "March"],

					datasets: [
						{
							label: "Pie chart",
							backgroundColor: ["#fed700", "#36A2EB", "FFCE56"],
							data: [40, 20, 12]
						}
					]
				},
				chartOptions: {
					responsive: true,
					plugins: {
						legend: {
							position: "left",
							align: "center"
						}
					}
				}
			};
		}
	};
</script>

<style></style>
