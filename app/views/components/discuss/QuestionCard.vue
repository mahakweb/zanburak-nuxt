<template>
	<div class="relative flex flex-col p-3 rounded-xl bg-white dark:bg-gray-900 overflow-hidden">
		<div class="z-10 flex justify-between items-center">
			<div class="flex items-center">
				<router-link :to="{ name: 'profile-page', params: { username: question.user.username } }"
					class="w-11 h-11 me-2 text-gray-900 bg-gray-200 hover:bg-gray-700 hover:text-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-300 dark:hover:text-gray-900 border-2 rounded-full overflow-hidden">
					<SeoImage
						:src="question.user.profile_pic"
						:alt="question.user.username || 'user'"
						:width="44"
						:height="44"
						sizes-preset="avatar"
						img-class="w-full h-full object-cover transform transition duration-200 hover:scale-110"
					/>
				</router-link>
				<div class="flex flex-col">
					<router-link :to="{ name: 'profile-page', params: { username: question.user.username } }"
						class="font-bold text-sm text-gray-700 dark:text-gray-200">{{ question.user.first_name + " " +
							question.user.last_name }}</router-link>
					<span v-if="question.last_answer" class="text-gray-500 dark:text-gray-400 italic text-xs">
						{{ $t('discuss.common.updatedBy', { time: timeAgo(question.last_answer.created_at), name: question.last_answer.user.first_name }) }}
					</span>
					<span v-else class="text-gray-500 dark:text-gray-400 italic text-xs">
						{{ $t('discuss.common.postedBy', { time: timeAgo(question.created_at), name: question.user.first_name }) }}
					</span>
				</div>
			</div>
			<div class="">
				<router-link :to="{ name: 'question-show', params: { questionSlug: question.slug } }"
					class="ms-1 flex items-center rounded-lg transition duration-200 bg-gray-200/40 hover:bg-gray-200/90 dark:bg-gray-200/10 dark:hover:bg-gray-200/20 text-gray-700 dark:text-gray-50 px-2 py-1 justify-center text-xs font-semibold h-6">
					<svg class="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 32 32"
						xmlns="http://www.w3.org/2000/svg">
						<path
							d="M 12.28125 5.28125 L 4.28125 13.28125 L 3.59375 14 L 4.28125 14.71875 L 12.28125 22.71875 L 13.71875 21.28125 L 7.4375 15 L 21 15 C 23.773438 15 26 17.226563 26 20 C 26 22.773438 23.773438 25 21 25 L 21 27 C 24.855469 27 28 23.855469 28 20 C 28 16.144531 24.855469 13 21 13 L 7.4375 13 L 13.71875 6.71875 Z">
						</path>
					</svg>
					<span class="mx-1">{{ question.answers_count }}</span>
					<span class="hidden md:block">{{ $t('discuss.common.answers') }}</span>
				</router-link>
			</div>
		</div>
		<div
			class="mt-4 line-clamp-1 flex items-start justify-start bg-gray-50 dark:bg-cyan-700/10 rounded-t-2xl rounded-b-lg w-full h-full p-2 md:p-3 text-sm font-semibold text-gray-600 dark:text-cyan-300/80">
			<router-link :to="{ name: 'question-show', params: { questionSlug: question.slug } }">{{ question.subject
				}}</router-link>
		</div>
		<svg v-if="locked" class="z-0 -end-14 absolute h-full -mt-3 opacity-10" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000">

			<path style="fill:#FF7855;"
				d="M0,256c0,141.384,114.615,256,256,256l22.261-256L256,0C114.615,0,0,114.615,0,256z"></path>
			<path style="fill:#FF562B;" d="M256,0v512c141.384,0,256-114.616,256-256S397.384,0,256,0z"></path>
			<path style="fill:#FFFFFF;"
				d="M66.783,256c0,40.19,12.541,77.446,33.907,108.089L256,208.778l22.261-70.998L256,66.783 C151.499,66.783,66.783,151.497,66.783,256z">
			</path>
			<path style="fill:#FFEAC3;"
				d="M256,66.783v141.995l108.089-108.089C333.446,79.323,296.19,66.783,256,66.783z"></path>
			<path style="fill:#FFFFFF;"
				d="M147.911,411.311c30.643,21.366,67.899,33.907,108.089,33.907l22.261-70.998L256,303.222 L147.911,411.311z">
			</path>
			<path style="fill:#FFEAC3;"
				d="M411.311,147.911L256,303.222v141.995c104.501,0,189.217-84.716,189.217-189.217 C445.217,215.81,432.677,178.554,411.311,147.911z">
			</path>
		</svg>
	</div>
</template>

<script>
import moment from 'moment';
import 'moment/locale/fa';
import SeoImage from "@/views/components/seo/SeoImage.vue";
export default {
	components: { SeoImage },
	data() {
		return {};
	},
	props: {
		question: Object,
		locked: Boolean
	},
	methods: {
		timeAgo(date) {
			moment.locale('fa');
			return moment(date).fromNow();
		},
	},
	mounted() { }
};
</script>

<style></style>
