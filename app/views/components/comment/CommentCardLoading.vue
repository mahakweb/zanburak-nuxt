<template>
	<!-- Card -->
	<div class="relative w-full p-[18px] z-10">
		<div :class="[
			'h-full bg-white/60 dark:bg-gray-950/60 rounded-2xl p-5',
			'before:absolute before:hover:rotate-3 before:hover:shadow-xl before:hover:shadow-gray-100/80 before:hover:dark:shadow-gray-900/80 before:duration-150 before:top-1.5 before:left-2 before:w-[calc(100%-1rem)] before:h-[calc(100%-2.2rem)] before:bg-white/30 before:dark:bg-gray-950/30 before:-z-10 before:rounded-2xl',
		]">
			<div class="w-full flex flex-col">
				<div class="flex items-center">
					<div
						class="animate-pulse flex items-center justify-center bg-gray-300 dark:bg-gray-700 me-4 w-24 md:w-32 h-16 md:h-20 rounded-box border-2 border-gray-200 dark:border-opacity-20 overflow-hidden">
						<svg class="w-6 h-6 text-gray-200 dark:text-gray-600" aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
							<path
								d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
						</svg>
					</div>
					<div class="flex-1 flex-col ">
						<div class="animate-pulse rounded-full w-[calc(100%-1rem)] md:w-48 h-1.5 bg-gray-200 dark:bg-gray-600 mb-4">
						</div>
						<div class="mt-1.5 md:mt-3 flex items-center">
							<div
								class="me-2 w-7 h-7 animate-pulse border-gray-200 dark:border-gray-600 border-2 rounded-full overflow-hidden flex items-center justify-center justify-items-center">
								<svg class="w-5 h-4 fill-gray-200 dark:fill-gray-600" viewBox="0 0 512 512" id="_x30_1"
									version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"
									xmlns:xlink="http://www.w3.org/1999/xlink">
									<ellipse cx="256" cy="130" rx="110" ry="130"></ellipse>
									<path
										d="M36,478.191C36,390.825,134.497,320,256,320s220,70.825,220,158.191v0C476,496.863,460.863,512,442.192,512H69.808 C51.137,512,36,496.863,36,478.191L36,478.191z">
									</path>
								</svg>
							</div>
							<span class="">
								<div class="animate-pulse rounded-full w-16 h-1 bg-gray-200 dark:bg-gray-600"></div>
							</span>
						</div>
					</div>
				</div>
				<div class="my-3 mx-2 h-[1.5px] bg-gray-200 dark:bg-opacity-10"></div>
				<div
					class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-50 font-light text-sm pb-1 pt-3 px-2">
					<div
						class="animate-pulse rounded-full ms-auto w-[calc(100%-1rem)] h-1 bg-gray-200 dark:bg-gray-600">
					</div>
					<div class="animate-pulse rounded-full w-full h-1 bg-gray-200 dark:bg-gray-600 my-3"></div>
					<div class="animate-pulse rounded-full w-full h-1 bg-gray-200 dark:bg-gray-600 mb-2"></div>
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
