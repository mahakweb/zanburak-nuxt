<template>
	<div class="flex flex-col p-3 rounded-xl bg-white dark:bg-gray-900 overflow-hidden">
		<div class="z-10 flex justify-between items-center">
			<div class="flex items-center">
				<router-link :to="{ name: 'profile-page', params: { username: answer.user.username } }"
					class="w-11 h-11 me-2 text-gray-900 bg-gray-200 hover:bg-gray-700 hover:text-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-300 dark:hover:text-gray-900 border-2 rounded-full overflow-hidden">
					<SeoImage
						:src="answer.user.profile_pic"
						:alt="answer.user.username || 'user'"
						:width="44"
						:height="44"
						sizes-preset="avatar"
						img-class="w-full h-full object-cover transform transition duration-200 hover:scale-110"
					/>
				</router-link>
				<div class="flex flex-col">
					<router-link :to="{ name: 'profile-page', params: { username: answer.user.username } }"
						class="font-bold text-sm text-gray-700 dark:text-gray-200">{{ answer.user.first_name + " " +
							answer.user.last_name }}</router-link>
					<span dir="ltr" class="text-gray-500 dark:text-gray-400 italic text-xs">
						@{{ answer.user.username }}
					</span>
				</div>
			</div>
			<div class="">
				<button @click="openViewAnswerModal"
					class="ms-1 flex items-center rounded-lg transition duration-200 bg-gray-200/40 hover:bg-gray-200/90 dark:bg-gray-200/10 dark:hover:bg-gray-200/20 text-gray-700 dark:text-gray-50 px-2 py-1 justify-center text-xs font-semibold h-6">

					<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M3.9074 8.65134L3.26013 8.27246H3.26013L3.9074 8.65134ZM20.0926 8.65134L20.7399 8.27246V8.27246L20.0926 8.65134ZM20.0926 15.3487L19.4453 14.9698L20.0926 15.3487ZM3.9074 15.3487L4.55466 14.9698L3.9074 15.3487ZM4.55466 9.03021C7.89524 3.32326 16.1048 3.32326 19.4453 9.03021L20.7399 8.27246C16.82 1.57585 7.18 1.57585 3.26013 8.27246L4.55466 9.03021ZM19.4453 9.03021C20.5182 10.8631 20.5182 13.1369 19.4453 14.9698L20.7399 15.7275C22.0867 13.4266 22.0867 10.5734 20.7399 8.27246L19.4453 9.03021ZM19.4453 14.9698C16.1048 20.6767 7.89523 20.6767 4.55466 14.9698L3.26013 15.7275C7.18 22.4242 16.82 22.4242 20.7399 15.7275L19.4453 14.9698ZM4.55466 14.9698C3.48178 13.1369 3.48178 10.8631 4.55466 9.03021L3.26013 8.27246C1.91329 10.5734 1.91329 13.4266 3.26013 15.7275L4.55466 14.9698ZM14.8067 12.0607C14.8067 13.6528 13.5387 14.9233 11.9994 14.9233V16.4233C14.3887 16.4233 16.3067 14.4595 16.3067 12.0607H14.8067ZM11.9994 14.9233C10.4605 14.9233 9.19331 13.6531 9.19331 12.0607H7.69331C7.69331 14.4592 9.60988 16.4233 11.9994 16.4233V14.9233ZM9.19331 12.0607C9.19331 10.467 10.4606 9.19699 11.9994 9.19699V7.69699C9.60973 7.69699 7.69331 9.66125 7.69331 12.0607H9.19331ZM11.9994 9.19699C13.5385 9.19699 14.8067 10.4673 14.8067 12.0607H16.3067C16.3067 9.66094 14.3888 7.69699 11.9994 7.69699V9.19699Z"
							fill="currentColor"></path>
					</svg>
					<span class="ms-1">{{ $t('discuss.answer.viewFull') }}</span>
				</button>
			</div>
		</div>
		<div class="my-4 text-sm font-medium text-gray-600 dark:text-gray-400 line-clamp-3 leading-7"
			v-text="answer.answer"></div>
		<div
			class="mt-auto line-clamp-1 flex items-start justify-start bg-gray-50 dark:bg-cyan-700/10 rounded-t-2xl rounded-b-lg w-full p-2 md:p-3 text-sm font-semibold text-gray-600 dark:text-cyan-300/80">
			<span class="font-medium me-2">{{ $t('discuss.answer.relatedTo') }} </span>
			<router-link :to="{ name: 'question-show', params: { questionSlug: answer.question.slug } }"
				class="text-amber-500 dark:text-gray-50 dark:hover:text-amber-400">{{ answer.question.subject
				}}</router-link>
		</div>
	</div>
	<BottomSheetDrawer v-model="isOpenViewAnswerModal" :initialHeight="0.7" :maxHeight="0.95" :minHeight="0.6"
		:autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
		:panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
		:contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
		:backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
		<div class="flex-shrink-0 flex items-center justify-between mb-4">
			<h6 class="text-base font-bold text-gray-900 dark:text-white">{{ $t('discuss.answer.viewText') }}</h6>
			<button type="button"
				class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none p-1.5 transition-colors"
				@click="closeViewAnswerModal">
				<span class="sr-only">{{ $t('discuss.common.close') }}</span>
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
					aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>
		<div class="relative flex flex-col">

								<router-link
									:to="{ name: 'question-show', params: { questionSlug: answer.question.slug } }"
									class="my-2 text-start leading-6 bg-gray-50 dark:bg-cyan-700/10 rounded-t-2xl rounded-b-lg w-full p-2 md:p-3 text-sm font-semibold text-gray-600 dark:text-cyan-300/80">
									<span class="inline-block align-middle me-1">
										<svg class="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="none"
											xmlns="http://www.w3.org/2000/svg">
											<path fill-rule="evenodd" clip-rule="evenodd"
												d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22ZM12 7.75C11.3787 7.75 10.875 8.25368 10.875 8.875C10.875 9.28921 10.5392 9.625 10.125 9.625C9.71079 9.625 9.375 9.28921 9.375 8.875C9.375 7.42525 10.5503 6.25 12 6.25C13.4497 6.25 14.625 7.42525 14.625 8.875C14.625 9.58584 14.3415 10.232 13.883 10.704C13.7907 10.7989 13.7027 10.8869 13.6187 10.9708C13.4029 11.1864 13.2138 11.3753 13.0479 11.5885C12.8289 11.8699 12.75 12.0768 12.75 12.25V13C12.75 13.4142 12.4142 13.75 12 13.75C11.5858 13.75 11.25 13.4142 11.25 13V12.25C11.25 11.5948 11.555 11.0644 11.8642 10.6672C12.0929 10.3733 12.3804 10.0863 12.6138 9.85346C12.6842 9.78321 12.7496 9.71789 12.807 9.65877C13.0046 9.45543 13.125 9.18004 13.125 8.875C13.125 8.25368 12.6213 7.75 12 7.75ZM12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z"
												fill="currentColor"></path>
										</svg>
									</span>
									{{ answer.question.subject }}
								</router-link>
								<!-- Modal Body (Scrollable part) -->
								<div
									class="flex-grow overflow-y-auto mb-4 min-h-[30vh] max-h-[60vh] bg-gray-50 dark:bg-cyan-700/10 p-2 md:p-3 rounded-xl text-gray-500 dark:text-gray-300 text-sm font-light text-start">
									<MarkdownRenderer startClass="rendered-content leading-7" :source="answer.answer" />
								</div>

								<!-- Modal Footer -->
								<div class="flex-shrink-0 flex items-center justify-between">
									<button @click="closeViewAnswerModal" type="button"
										class="h-8 py-2 px-3 text-xs font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-2 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
										{{ $t('discuss.answer.cancelClose') }}
									</button>
									<div
										class="text-xs font-medium py-2 px-3 rounded-lg bg-gray-50 dark:bg-cyan-700/10 text-gray-500 dark:text-gray-400">
										{{ $t('discuss.answer.submittedAt', { time: timeAgo(answer.created_at) }) }}
									</div>
				</div>
		</div>
	</BottomSheetDrawer>

</template>

<script>
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import MarkdownRenderer from "@/views/components/home/MarkdownRenderer.vue"
import moment from 'moment';
import 'moment/locale/fa';
import SeoImage from "@/views/components/seo/SeoImage.vue";
export default {
	components: {
		BottomSheetDrawer,
		MarkdownRenderer,
		SeoImage,
	},
	data() {
		return {
			isOpenViewAnswerModal: false,
		};
	},
	props: {
		answer: Object,
		locked: Boolean
	},
	methods: {
		timeAgo(date) {
			moment.locale('fa');
			return moment(date).fromNow();
		},
		closeViewAnswerModal() {
			this.isOpenViewAnswerModal = false;
		},
		openViewAnswerModal() {
			this.isOpenViewAnswerModal = true;
		},
	},
	mounted() { }
};
</script>

<style></style>
