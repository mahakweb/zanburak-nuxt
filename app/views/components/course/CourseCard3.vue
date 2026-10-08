<template>
	<div class="flex flex-col p-3 rounded-xl bg-white dark:bg-gray-900">
		<div class="w-full h-44 md:h-40 lg:h-32 rounded-xl overflow-hidden relative">
			<SeoImage
				:src="course.poster"
				:alt="course.title || 'دوره آموزشی'"
				:width="640"
				:height="360"
				sizes-preset="card"
				img-class="relative z-0 w-full h-full object-cover transform transition duration-200 hover:scale-110"
			/>
			<CourseStatusRibbon :status="course.status" />
			<InstallmentRibbon
				:allows-installment="course.allows_installment"
				:alternate-corner="hasStatusRibbon"
			/>
		</div>
		<div class="my-2 mx-0.5">
			<router-link :to="{ name: 'course.show', params: { courseSlug: course.slug } }" class="text-sm font-bold text-gray-800 dark:text-gray-50 line-clamp-1">{{ displayTitle }}</router-link>
		</div>
		<div class="flex items-center mx-0.5">
			<div class="w-full bg-gray-200 rounded-full h-1 dark:bg-gray-700">
				<div class="bg-gray-400 h-1 rounded-full dark:bg-gray-500" :style="{ width: `${Math.floor(course.progressPercentage)}%` }"></div>
			</div>
			<div class="ms-5 text-sm font-semibold text-gray-600 dark:text-gray-400">{{ Math.floor(course.progressPercentage) }}%</div>
		</div>
		<div class="w-full mt-3">
			<router-link :to="{ name: 'course.show', params: { courseSlug: course.slug } }" class="w-full mx-0.5 inline-flex rounded-xl px-6 pb-[6px] pt-2 text-xs font-semibold uppercase leading-normal text-black dark:text-gray-100 transition duration-150 ease-in-out focus:outline-none focus:ring-0 motion-reduce:transition-none bg-gray-200 hover:bg-opacity-60 dark:bg-gray-800 dark:hover:bg-opacity-60 items-center justify-center">{{ $t('course.card.continueLearning') }}</router-link>
		</div>
	</div>
</template>

<script>
	import CourseStatusRibbon from "@/views/components/course/CourseStatusRibbon.vue";
	import InstallmentRibbon from "@/views/components/payment/InstallmentRibbon.vue";
	import SeoImage from "@/views/components/seo/SeoImage.vue";
	import { cleanCourseTitle } from "@/utils/courseDisplay";

	export default {
		components: { CourseStatusRibbon, InstallmentRibbon, SeoImage },
		props: {
			course: Object
		},
		computed: {
			displayTitle() {
				return cleanCourseTitle(this.course?.title, this.course?.status);
			},
			hasStatusRibbon() {
				const status = this.course?.status;
				const slug = status?.english_title || status?.slug || null;
				return ['presale', 'upcoming', 'archive'].includes(slug);
			},
		},
	};
</script>

<style></style>
