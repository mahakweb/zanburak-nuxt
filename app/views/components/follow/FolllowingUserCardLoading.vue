<template>
	<!-- Card -->
	<div class="relative w-full p-[18px] z-10">
		<div :class="[
			'h-full bg-white/60 dark:bg-gray-950/60 rounded-2xl p-5',
			'before:absolute before:top-1.5 before:left-2 before:w-[calc(100%-1rem)] before:h-[calc(100%-2.2rem)] before:bg-white/30 before:dark:bg-gray-950/30 before:-z-10 before:rounded-2xl',
		]">
			<div class="flex">
				<div class="flex items-start me-4">
					<div class="animate-pulse border-gray-200 dark:border-gray-600 border-2 rounded-full w-16 h-16 overflow-hidden flex items-center justify-center justify-items-center">
						<svg class="w-7 h-7 fill-gray-200 dark:fill-gray-600" viewBox="0 0 512 512" id="_x30_1" version="1.1" xml:space="preserve"
							xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
							<ellipse cx="256" cy="130" rx="110" ry="130"></ellipse>
							<path
								d="M36,478.191C36,390.825,134.497,320,256,320s220,70.825,220,158.191v0C476,496.863,460.863,512,442.192,512H69.808 C51.137,512,36,496.863,36,478.191L36,478.191z">
							</path>
						</svg>
					</div>
				</div>
				<div class="flex-1 flex-col">
					<div class="mb-8 mt-4">
						<div class="animate-pulse rounded-full w-28 h-2 bg-gray-200 dark:bg-gray-600 mb-3"></div>
						<div class="animate-pulse rounded-full w-16 h-1.5 bg-gray-200 dark:bg-gray-600"></div>
					</div>
					<div class="animate-pulse rounded-full ms-auto w-[calc(100%-1rem)] h-1 bg-gray-200 dark:bg-gray-600 mb-2"></div>
					<div class="animate-pulse rounded-full w-full h-1 bg-gray-200 dark:bg-gray-600 mb-2"></div>
					<div class="flex items-center justify-start mt-6">
						<div class="justify-start items-center flex-col md:pe-2">
							<div class="animate-pulse rounded-full w-6 md:w-8 h-2 bg-gray-200 dark:bg-gray-600 mb-3"></div>
							<div class="animate-pulse rounded-full w-10 md:w-16 h-1 bg-gray-200 dark:bg-gray-600"></div>
						</div>
						<svg class="w-4 fill-gray-600 dark:fill-gray-400" viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg">
							<path d="M7.8 10a2.2 2.2 0 0 0 4.4 0 2.2 2.2 0 0 0-4.4 0z"></path>
						</svg>
						<div class="justify-start items-center flex-col md:px-2">
							<div class="animate-pulse rounded-full w-6 md:w-8 h-2 bg-gray-200 dark:bg-gray-600 mb-3"></div>
							<div class="animate-pulse rounded-full w-10 md:w-16 h-1 bg-gray-200 dark:bg-gray-600"></div>
						</div>
						<svg class="w-4 fill-gray-600 dark:fill-gray-400" viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg">
							<path d="M7.8 10a2.2 2.2 0 0 0 4.4 0 2.2 2.2 0 0 0-4.4 0z"></path>
						</svg>
						<div class="justify-start items-center flex-col md:ps-2">
							<div class="animate-pulse rounded-full w-6 md:w-8 h-2 bg-gray-200 dark:bg-gray-600 mb-3"></div>
							<div class="animate-pulse rounded-full w-10 md:w-16 h-1 bg-gray-200 dark:bg-gray-600"></div>
						</div>
					</div>
					<div class="mt-4 flex items-center">
						<button
							class="me-3 align-middle select-none font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 dark:hover:shadow-gray-700/30 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
							type="button">
							<div class="animate-pulse rounded-full w-8 h-1.5 bg-gray-200 dark:bg-gray-600"></div>
						</button>
						<button
							class="select-none rounded-lg border border-gray-900 dark:border-gray-50 py-3 px-6 text-center align-middle text-xs font-bold uppercase text-gray-900 dark:text-gray-50 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
							type="button">
							<div class="animate-pulse rounded-full w-8 h-1.5 bg-gray-200 dark:bg-gray-600"></div>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- End Card -->
</template>

<script>
export default {};
</script>

<style></style>
