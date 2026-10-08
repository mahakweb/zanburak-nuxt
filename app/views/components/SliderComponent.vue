<script setup>
	import { onMounted } from "vue";
	import CourseCard from "@/views/components/course/CourseCard.vue";
	// Import Swiper Vue.js components
	import { Swiper, SwiperSlide } from "swiper/vue";

	// Import Swiper styles
	import "swiper/css";

	// import "swiper/css/pagination";
	// import "swiper/css/navigation";

	// import './style.css';

	// import required modules
	import { Navigation } from "swiper/modules";
	import { ref } from "vue";
	const direction = ref(localStorage.getItem("direction"));
	const modules = [Navigation];

	onMounted(() => {
		document.documentElement.addEventListener("onChangeLanguage", () => {
			var slider = document.querySelector(".swiper");
			if (slider) {
				slider.classList.toggle("swiper-rtl");
				var slides = slider.querySelectorAll(".swiper-slide");
				slides.forEach((slide) => {
					slide.setAttribute(
						"dir",
						localStorage.getItem("direction")
					);
				});
			}
		});
	});
</script>
<template>
	<hr />
	<div class="flex justify-between items-center my-2">
		<h1 class="text-lg text-emerald-950 dark:text-white font-bold">
			{{ $t('common.slider') }}
		</h1>
		<!--Custom navigation button -->
		<div class="">
			<div class="swiper-navigation inline-flex">
				<div class="custom-prev swiper-button-prev rtl:ml-2 ltr:mr-2">
					<button
						type="button"
						class="text-yellow-400 bg-yellow-400 bg-opacity-20 hover:bg-opacity-80 p-2 transition duration-200 hover:text-gray-800 items-center rounded"
					>
						<svg
							class="w-5 h-5 rtl:rotate-180"
							viewBox="0 0 23 15"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill="currentColor"
								opacity="0.4"
								d="M16.5073 5.95329L21.0752 5.54932C22.1003 5.54932 22.9315 6.38856 22.9315 7.42367C22.9315 8.45878 22.1003 9.29802 21.0752 9.29802L16.5073 8.89404C15.7031 8.89404 15.0511 8.23571 15.0511 7.42367C15.0511 6.61027 15.7031 5.95329 16.5073 5.95329"
							></path>
							<path
								fill="currentColor"
								d="M1.16786 6.02753C1.23926 5.95544 1.50598 5.65076 1.75653 5.39776C3.21811 3.81313 7.03437 1.22195 9.03073 0.428959C9.33382 0.302461 10.1003 0.0331419 10.5112 0.0140991C10.9032 0.0140991 11.2776 0.105232 11.6346 0.284778C12.0805 0.536415 12.4361 0.933592 12.6328 1.4015C12.7581 1.72523 12.9548 2.69777 12.9548 2.71545C13.1501 3.77776 13.2565 5.50521 13.2565 7.41493C13.2565 9.23215 13.1501 10.8889 12.9898 11.9689C12.9723 11.9879 12.7756 13.1944 12.5614 13.6079C12.1694 14.3642 11.4029 14.8321 10.5826 14.8321H10.5112C9.97638 14.8144 8.85292 14.3451 8.85292 14.3288C6.96297 13.5358 3.23697 11.0698 1.73902 9.43074C1.73902 9.43074 1.31604 9.00908 1.13284 8.74656C0.84726 8.36843 0.70447 7.90052 0.70447 7.43261C0.70447 6.9103 0.864772 6.42471 1.16786 6.02753"
							></path>
						</svg>
					</button>
				</div>
				<div class="custom-next swiper-button-next">
					<button
						type="button"
						class="text-yellow-400 bg-yellow-400 bg-opacity-20 hover:bg-opacity-80 p-2 transition duration-200 hover:text-gray-800 items-center rounded"
					>
						<svg
							class="w-5 h-5 ltr:rotate-180"
							viewBox="0 0 23 15"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill="currentColor"
								opacity="0.4"
								d="M16.5073 5.95329L21.0752 5.54932C22.1003 5.54932 22.9315 6.38856 22.9315 7.42367C22.9315 8.45878 22.1003 9.29802 21.0752 9.29802L16.5073 8.89404C15.7031 8.89404 15.0511 8.23571 15.0511 7.42367C15.0511 6.61027 15.7031 5.95329 16.5073 5.95329"
							></path>
							<path
								fill="currentColor"
								d="M1.16786 6.02753C1.23926 5.95544 1.50598 5.65076 1.75653 5.39776C3.21811 3.81313 7.03437 1.22195 9.03073 0.428959C9.33382 0.302461 10.1003 0.0331419 10.5112 0.0140991C10.9032 0.0140991 11.2776 0.105232 11.6346 0.284778C12.0805 0.536415 12.4361 0.933592 12.6328 1.4015C12.7581 1.72523 12.9548 2.69777 12.9548 2.71545C13.1501 3.77776 13.2565 5.50521 13.2565 7.41493C13.2565 9.23215 13.1501 10.8889 12.9898 11.9689C12.9723 11.9879 12.7756 13.1944 12.5614 13.6079C12.1694 14.3642 11.4029 14.8321 10.5826 14.8321H10.5112C9.97638 14.8144 8.85292 14.3451 8.85292 14.3288C6.96297 13.5358 3.23697 11.0698 1.73902 9.43074C1.73902 9.43074 1.31604 9.00908 1.13284 8.74656C0.84726 8.36843 0.70447 7.90052 0.70447 7.43261C0.70447 6.9103 0.864772 6.42471 1.16786 6.02753"
							></path>
						</svg>
					</button>
				</div>
			</div>
		</div>
	</div>
	<swiper
		:dir="direction"
		:slidesPerView="1"
		:spaceBetween="5"
		:navigation="{
			prevEl: '.custom-prev',
			nextEl: '.custom-next',
		}"
		:breakpoints="{
			'@0.00': {
				slidesPerView: 1,
				spaceBetween: 10,
			},
			'@0.25': {
				slidesPerView: 1,
				spaceBetween: 10,
			},
			'@0.50': {
				slidesPerView: 1,
				spaceBetween: 10,
			},
			'@0.75': {
				slidesPerView: 2,
				spaceBetween: 10,
			},
			'@1.00': {
				slidesPerView: 3,
				spaceBetween: 10,
			},
			'@1.25': {
				slidesPerView: 3,
				spaceBetween: 10,
			},
			'@1.50': {
				slidesPerView: 4,
				spaceBetween: 10,
			},
		}"
		:modules="modules"
		class="mySwiper"
	>
		<swiper-slide v-for="i in 10" :key="i" class="py-6 px-1">
			<CourseCard />
		</swiper-slide>
	</swiper>
</template>
