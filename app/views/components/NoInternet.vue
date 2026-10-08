<template>
	<TransitionRoot appear :show="!isOnline" as="template">
		<Dialog as="div" class="relative z-50 select-none">
			<TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
				<div class="fixed inset-0 bg-black/25 backdrop-blur-sm" />
			</TransitionChild>

			<div class="fixed inset-0 overflow-y-auto">
				<div class="flex min-h-full items-center justify-center p-4 text-center">
					<TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
						<DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl align-middle bg-gray-100 dark:bg-slate-900 shadow-xl shadow-gray-300 dark:shadow-gray-800 transition-all ">
							<div class="relative rounded-lg  ">
								<div class="p-4 md:p-5 text-center">
									<svg class="mx-auto my-4 w-12 h-12 fill-rose-500" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
										<path d="M40.7,26.5a2,2,0,0,0-.2-2.6A23,23,0,0,0,24.3,17L29,21.7a18.6,18.6,0,0,1,8.7,5A1.9,1.9,0,0,0,40.7,26.5Z"></path>
										<path d="M45.4,17.4A31.2,31.2,0,0,0,17.1,9.8l3.4,3.4L24,13a27.4,27.4,0,0,1,18.6,7.3,2,2,0,0,0,3-.2h0A2.1,2.1,0,0,0,45.4,17.4Z"></path>
										<circle cx="24" cy="38" r="5"></circle>
										<path d="M5.4,3.6a1.9,1.9,0,0,0-2.8,0,1.9,1.9,0,0,0,0,2.8L9,12.8H8.7L6.8,14.1l-.3.3L4.7,15.7l-.3.2L2.6,17.4a2.1,2.1,0,0,0-.2,2.7h0a2,2,0,0,0,3,.2l1.7-1.4.4-.3,1.8-1.3.3-.2,2-1.1h0l.4-.2,3,3-.5.2-.6.3-.8.4-.6.3-.8.5-.5.4-.8.5-.5.4-.9.7-.4.3a11.4,11.4,0,0,1-1.1,1.1,2,2,0,0,0-.6,1.4,2.8,2.8,0,0,0,.4,1.2,1.9,1.9,0,0,0,3,.2l1.2-1,.3-.3.9-.7.4-.3,1.1-.7h.2l1.4-.8h.4l1.1-.5.5-.2h.3l3.3,3.3a16,16,0,0,0-9.1,5.3,1.9,1.9,0,0,0-.4,1.2,2,2,0,0,0,.4,1.3,2,2,0,0,0,3.1,0A11.5,11.5,0,0,1,24,29h1.2L38.6,42.4a1.9,1.9,0,0,0,2.8,0,1.9,1.9,0,0,0,0-2.8Z"></path>
									</svg>
									<p class="text-sm font-semibold text-rose-500 dark:text-rose-500">{{ $t('noInternet.connecting') }}</p>
									<span class="loading loading-dots loading-md text-rose-500"></span> 
								</div>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>

<script>
	import { TransitionRoot, TransitionChild, Dialog, DialogPanel } from "@headlessui/vue";
	export default {
		components: {
			TransitionRoot,
			TransitionChild,
			Dialog,
			DialogPanel
		},
		data() {
			return {
				isOnline: navigator.onLine
			};
		},
		created() {
			window.addEventListener("online", this.updateOnlineStatus);
			window.addEventListener("offline", this.updateOnlineStatus);
		},
		unmounted() {
			window.removeEventListener("online", this.updateOnlineStatus);
			window.removeEventListener("offline", this.updateOnlineStatus);
		},
		methods: {
			updateOnlineStatus() {
				this.isOnline = navigator.onLine;
			}
		}
	};
</script>

<style></style>
