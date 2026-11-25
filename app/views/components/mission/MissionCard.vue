<template>
	<!-- Card -->
	<div @click="missionDetails" class="cursor-pointer relative w-full p-1 z-10">
		<div :class="[
			'h-full bg-white/70 dark:bg-gray-900/70 border border-gray-100 dark:border-gray-800 rounded-2xl p-3.5 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200',
			'before:absolute before:hover:rotate-3 before:hover:shadow-xl before:hover:shadow-gray-200/50 before:hover:dark:shadow-gray-900/50 before:duration-200 before:top-1.5 before:left-2 before:w-[calc(100%-1rem)] before:h-[calc(100%-1.8rem)] before:bg-white/30 before:dark:bg-gray-950/30 before:-z-10 before:rounded-2xl',
		]">
			<div class="w-full flex flex-col">
				<div class="flex items-center">
					<div
						class="me-3 sm:me-3.5 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 shrink-0 rounded-2xl hover:rounded-full transition-all duration-200 border-2 border-gray-100 dark:border-gray-800 overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-800/80 shadow-sm">
						<img onerror="this.style.display='none'" class="w-full h-full object-cover hover:scale-105 transition-all duration-150"
							:src="mission.icon" />
					</div>
					<div class="flex flex-col min-w-0 flex-1">
						<div
							class="text-xs sm:text-sm md:text-base font-bold text-gray-900 dark:text-white line-clamp-1">
							{{ mission.title }}
						</div>
						<div
							class="flex items-center mt-1 sm:mt-1.5 text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400">
							<svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 me-1 shrink-0" viewBox="0 0 24 24" fill="none"
								xmlns="http://www.w3.org/2000/svg">
								<path
									d="M11.8114 6.7267C12.8247 4.9089 13.3314 4 14.0889 4C14.8464 4 15.353 4.9089 16.3663 6.7267L16.6285 7.19699C16.9164 7.71355 17.0604 7.97183 17.2849 8.14225C17.5094 8.31266 17.789 8.37592 18.3482 8.50244L18.8572 8.61762C20.825 9.06284 21.8089 9.28545 22.0429 10.0382C22.277 10.7909 21.6063 11.5753 20.2648 13.1439L19.9177 13.5498C19.5365 13.9955 19.3459 14.2184 19.2602 14.4942C19.1744 14.7699 19.2032 15.0673 19.2609 15.662L19.3133 16.2035C19.5162 18.2965 19.6176 19.343 19.0047 19.8082C18.3919 20.2734 17.4707 19.8492 15.6283 19.0009L15.1517 18.7815C14.6281 18.5404 14.3664 18.4199 14.0889 18.4199C13.8114 18.4199 13.5496 18.5404 13.0261 18.7815L12.5494 19.0009C10.707 19.8492 9.78581 20.2734 9.17299 19.8082C8.56016 19.343 8.66157 18.2965 8.86438 16.2035L8.91685 15.662C8.97449 15.0673 9.0033 14.7699 8.91756 14.4942C8.83181 14.2184 8.64121 13.9955 8.26 13.5498L7.91295 13.1439C6.57147 11.5753 5.90073 10.7909 6.1348 10.0382C6.36888 9.28545 7.35275 9.06284 9.3205 8.61762L9.82958 8.50244C10.3887 8.37592 10.6683 8.31266 10.8928 8.14225C11.1173 7.97183 11.2613 7.71355 11.5492 7.19699L11.8114 6.7267Z"
									fill="currentColor"></path>
								<path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd"
									d="M8.74549 5.20241C6.76387 4.63138 4.63821 4.933 2.58729 6.13407L2.37913 6.25598C2.0217 6.4653 1.56226 6.34523 1.35293 5.9878C1.14361 5.63037 1.26368 5.17092 1.62111 4.9616L1.82927 4.8397C4.18969 3.45737 6.73702 3.0626 9.16083 3.76106L9.36871 3.82096C9.76673 3.93566 9.99641 4.35129 9.88171 4.74931C9.76702 5.14733 9.35139 5.37701 8.95337 5.26231L8.74549 5.20241ZM4.83628 9.93646C4.87144 10.3492 4.56537 10.7123 4.15265 10.7474C3.99949 10.7605 3.88206 10.7679 3.78365 10.7742C3.60627 10.7854 3.49069 10.7928 3.33902 10.8219C3.14253 10.8596 2.8874 10.9394 2.4244 11.1709C2.05391 11.3562 1.60341 11.206 1.41817 10.8355C1.23293 10.465 1.38309 10.0145 1.75358 9.8293C2.29057 9.5608 2.68032 9.42092 3.05627 9.34876C3.30317 9.30137 3.55804 9.28477 3.78724 9.26984C3.87053 9.26441 3.95043 9.25921 4.02533 9.25283C4.43804 9.21767 4.80112 9.52374 4.83628 9.93646ZM5.91788 15.8561C4.73392 15.5786 3.48653 15.8538 2.55316 16.5892C2.22781 16.8456 1.75624 16.7896 1.49988 16.4643C1.24353 16.1389 1.29946 15.6674 1.62482 15.411C2.92261 14.3884 4.63911 14.0158 6.2601 14.3956C6.66339 14.4901 6.91371 14.8937 6.81921 15.297C6.72471 15.7003 6.32117 15.9506 5.91788 15.8561Z"
									fill="currentColor"></path>
							</svg>
							{{ mission.totalExp.toLocaleString() }} {{ $t('mission.exp') }}
						</div>

					</div>
				</div>
				<div dir="ltr"
					class="flex items-center my-2.5 h-2 md:h-2.5 p-[1.5px] overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
					<div class="h-full rounded-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-500" :style="{ width: `${mission.progressPercent}%` }"></div>
					<div class="flex items-center justify-center absolute -mt-7 lg:-mt-8 rounded px-2 py-0.5 text-[8px] md:text-[10px] font-semibold text-gray-700 dark:text-white bg-gray-200 dark:bg-gray-900 shadow-sm">{{ mission.progressPercent }}%</div>
				</div>
				
				<div class="my-2 mx-1 h-[1px] bg-gray-100 dark:bg-gray-800"></div>
				<div
					class="flex items-center rounded-xl bg-gray-50 dark:bg-gray-800/60 text-gray-800 dark:text-gray-50 p-2 text-xs sm:text-sm">
					<div
						class="w-4/12 text-xs font-semibold flex items-center border-e border-gray-200 dark:border-gray-700 pe-2">
						<span class="hidden sm:inline me-1 text-[11px] text-gray-500 dark:text-gray-400">{{ $t('mission.level') }}</span>
						<span class="font-bold text-amber-600 dark:text-amber-400">{{ mission.currentLevel + '/' + mission.maxLevel }}</span>
					</div>
					<div v-if="mission.completed"
						class="w-8/12 flex items-center text-green-500 text-xs font-bold text-center justify-center gap-1">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
						{{ $t('mission.completed') }}
					</div>
					<div v-else dir="ltr" class="w-8/12 space-x-1 font-medium flex items-center justify-center">
						<svg v-for="i in mission.maxLevel" :key="i" :class="[
							'hover:scale-110 focus:scale-110 duration-150 text-amber-400',
							i <= mission.currentLevel ? 'w-3 h-3 sm:w-3.5 sm:h-3.5' : 'w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-300 dark:text-gray-600',
							i <= mission.currentLevel ? 'fill-current' : 'stroke-current'
						]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z"
								:fill="i <= mission.currentLevel ? 'currentColor' : 'none'"
								:stroke="i > mission.currentLevel ? 'currentColor' : 'none'" stroke-width="1.5"></path>
						</svg>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- End Card -->
</template>

<script>
export default {
	props: {
		mission: Object,
	},
	methods: {
		missionDetails() {
			this.$emit("mission-details", this.mission.id);
		}
	},
};
</script>

<style></style>
