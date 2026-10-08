<template>
	<div class="relative flex flex-col border border-gray-100 dark:border-gray-300/10 p-1.5 rounded-xl bg-white dark:bg-gray-900" :class="{ 'ring-2 ring-amber-400 dark:ring-yellow-400': isSelected }">
		<div v-if="!notification.read_at" class="absolute start-0 top-8 w-1 h-8 rounded-e-lg bg-yellow-400"></div>
		<div class="-mt-5 w-full flex items-center justify-between">
			<div class="flex items-center gap-2">
				<input 
					v-if="showCheckbox"
					type="checkbox" 
					:checked="isSelected"
					@change="toggleSelection"
					class="shrink-0 appearance-none w-5 h-5 rounded-lg bg-gray-200 checked:bg-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-800 focus:outline-none transition relative custom-checkbox"
					:class="isSelected ? 'is-checked' : ''"
				/>
				<div v-html="notification.data.icon" class="border-gray-100 dark:border-gray-300/10 flex items-center justify-center rounded-full w-7 h-7 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400" :class="{ 'text-gray-700 dark:text-zinc-800 bg-yellow-400 dark:bg-yellow-400': !notification.read_at }"></div>
			</div>
			<div class="flex items-center">
				<button @click="deleteNotification(notification.id)" class="border-gray-100 dark:border-gray-300/10 flex items-center justify-center rounded-full w-7 h-7 bg-white dark:bg-gray-900 text-rose-500 hover:bg-rose-400 hover:text-white dark:hover:text-white dark:hover:bg-rose-500 duration-200">
					<svg v-if="!isDeleting" class="w-4 h-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path opacity="0.5" d="M16.1041 7.89014C16.1041 7.89014 15.6516 13.5026 15.3891 15.8668C15.2641 16.996 14.5666 17.6576 13.4241 17.6785C11.2499 17.7176 9.07326 17.7201 6.89993 17.6743C5.80076 17.6518 5.11493 16.9818 4.99243 15.8726C4.72826 13.4876 4.27826 7.89014 4.27826 7.89014" stroke="currentColor" stroke-opacity="0.9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
						<path d="M17.2569 5.19975H3.12518" stroke="currentColor" stroke-opacity="0.9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
						<path d="M14.5339 5.19974C13.8797 5.19974 13.3164 4.73724 13.188 4.0964L12.9855 3.08307C12.8605 2.61557 12.4372 2.29224 11.9547 2.29224H8.42719C7.94469 2.29224 7.52136 2.61557 7.39636 3.08307L7.19386 4.0964C7.06552 4.73724 6.50219 5.19974 5.84802 5.19974" stroke="currentColor" stroke-opacity="0.9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
					</svg>
					<svg v-else class="w-4 h-4" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="25 25 50 50">
						<circle class="stroke-current text-rose-700 text-opacity-50" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="200, 300"></circle>
						<circle class="stroke-current text-rose-700" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="100, 200">
							<animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite"></animateTransform>
							<animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s" repeatCount="indefinite"></animate>
							<animate attributeName="stroke-dasharray" values="0,200;110,200;110,200" dur="1.25s" repeatCount="indefinite"></animate>
						</circle>
					</svg>
				</button>
				<button @click="notificationDetails(notification.id)" class="ms-2 border-gray-100 dark:border-gray-300/10 flex items-center justify-center rounded-xl bg-white dark:bg-gray-900 text-xs font-semibold py-1 px-2 text-gray-500 duration-500 dark:text-gray-200 hover:from-yellow-300 hover:bg-gradient-to-r hover:to-red-400 dark:hover:from-yellow-300 dark:hover:bg-gradient-to-r dark:hover:to-red-400 hover:text-gray-900 dark:hover:text-gray-900">
					<span class="rtl:mt-0.5">{{ $t('notification.read') }}</span>
					<svg class="ms-1 w-4 h-4" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path class="fill-current" d="M11.9994 10.5886C10.6694 10.5886 9.58838 11.6706 9.58838 13.0006C9.58838 14.3296 10.6694 15.4106 11.9994 15.4106C13.3294 15.4106 14.4114 14.3296 14.4114 13.0006C14.4114 11.6706 13.3294 10.5886 11.9994 10.5886ZM11.9994 16.9106C9.84238 16.9106 8.08838 15.1566 8.08838 13.0006C8.08838 10.8436 9.84238 9.08862 11.9994 9.08862C14.1564 9.08862 15.9114 10.8436 15.9114 13.0006C15.9114 15.1566 14.1564 16.9106 11.9994 16.9106Z" fill-opacity="0.7"></path>
						<path class="fill-current" fill-rule="evenodd" clip-rule="evenodd" d="M3.56975 12.9998C5.42975 17.1088 8.56275 19.5518 11.9998 19.5528C15.4368 19.5518 18.5697 17.1088 20.4298 12.9998C18.5697 8.89177 15.4368 6.44877 11.9998 6.44777C8.56375 6.44877 5.42975 8.89177 3.56975 12.9998ZM12.0017 21.0528H11.9978H11.9967C7.86075 21.0498 4.14675 18.1508 2.06075 13.2958C1.97975 13.1068 1.97975 12.8928 2.06075 12.7038C4.14675 7.84977 7.86175 4.95077 11.9967 4.94777C11.9987 4.94677 11.9987 4.94677 11.9998 4.94777C12.0017 4.94677 12.0017 4.94677 12.0028 4.94777C16.1388 4.95077 19.8527 7.84977 21.9387 12.7038C22.0208 12.8928 22.0208 13.1068 21.9387 13.2958C19.8537 18.1508 16.1388 21.0498 12.0028 21.0528H12.0017Z" fill-opacity="0.7"></path>
					</svg>
				</button>
			</div>
		</div>
		<div @click="notificationDetails(notification.id)" v-html="notification.data.message" class="cursor-pointer mt-3 md:mt-4 w-full rounded-xl bg-gray-100/50 p-1.5 px-3 md:px-1.5 dark:bg-gray-600/10 text-start text-xs text-gray-600 dark:text-gray-400 line-clamp-3 md:line-clamp-2 leading-6 min-h-[5rem] md:min-h-[3.4rem] " :class="{ 'font-semibold text-gray-700 dark:text-zinc-300': !notification.read_at }"></div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
			};
		},
	props: {
		notification: Object,
		isDeleting: Boolean,
		deleteNotificationFunc: Function,
		showCheckbox: {
			type: Boolean,
			default: false
		},
		isSelected: {
			type: Boolean,
			default: false
		}
	},

	methods: {
		notificationDetails() {
			this.$emit("notification-details", this.notification.id);
		},
		deleteNotification(notificationId) {
			this.deleteNotificationFunc(notificationId)
		},
		toggleSelection() {
			this.$emit("toggle-selection", this.notification.id);
		}
	},
		mounted() {}
	};
</script>

<style></style>
