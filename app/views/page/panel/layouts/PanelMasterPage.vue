<template>
	<main
		class="select-none transition-all duration-300 bg-white dark:bg-gray-900 grid lg:grid-cols-12 min-h-screen grid-cols-1">
		<PanelSidebar />
		<section class="xl:col-span-10 lg:col-span-10 flex flex-col min-h-screen">
			<PanelHeader />
			<div class="lg:p-0 lg:pe-8 md:px-4 w-full h-full">
				<div
					class="bg-[url(@/assets/image/bg/bg-pattern.png)] dark:bg-[url(@/assets/image/bg/bg-pattern-3.png)] w-full h-full bg-gray-400 dark:bg-slate-800 md:rounded-t-3xl md:border-2 md:border-b-0 border-yellow-400 px-2 md:px-4 xl:px-9 pt-10 pb-14">
					<div class="w-full h-full max-w-screen-xl mx-auto">
						<slot></slot>
					</div>
				</div>
			</div>
			<PanelFooter />
		</section>
		<!-- <NoInternet /> -->
	</main>
</template>

<script>
import PanelSidebar from "@/views/components/panel/PanelSidebar.vue";
import PanelHeader from "@/views/components/panel/PanelHeader.vue";
import PanelFooter from "@/views/components/panel/PanelFooter.vue";
// import NoInternet from "@/views/components/NoInternet.vue";
export default {
	components: {
		PanelSidebar,
		PanelHeader,
		PanelFooter,
		// NoInternet
	}
};
</script>

<style></style>
