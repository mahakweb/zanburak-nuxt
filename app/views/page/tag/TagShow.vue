<template>
	<MasterPage>
		<div class="mx-auto max-w-screen-xl px-2 pb-16">
			<!-- Loading skeleton -->
			<template v-if="loading">
				<!-- Hero skeleton — mirrors loaded hero layout -->
				<section class="relative my-5 md:my-7 rounded-2xl overflow-hidden border border-gray-100 dark:border-[#1e2a3f]">
					<div class="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-[#0f1524] dark:via-[#151c2c] dark:to-[#1a1220]"></div>
					<div class="absolute -top-20 -start-20 w-56 h-56 rounded-full bg-amber-400/20 dark:bg-amber-400/10 blur-3xl"></div>
					<div class="absolute -bottom-12 -end-12 w-48 h-48 rounded-full bg-orange-400/15 dark:bg-rose-500/10 blur-3xl"></div>

					<div class="relative grid lg:grid-cols-12 gap-5 px-4 py-6 md:px-8 md:py-8 items-center">
						<div class="lg:col-span-8 flex flex-col justify-center text-center lg:text-start">
							<div class="h-3.5 w-28 bg-gray-200 dark:bg-gray-700 rounded mx-auto lg:mx-0 mb-3 animate-pulse"></div>
							<div class="h-6 w-24 bg-amber-200/60 dark:bg-amber-900/40 rounded-full mx-auto lg:mx-0 mb-3 animate-pulse"></div>
							<div class="h-9 md:h-11 w-48 md:w-60 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto lg:mx-0 mb-3 animate-pulse"></div>
							<div class="flex justify-center lg:justify-start gap-1 mb-4">
								<span class="block w-16 h-0.5 bg-amber-300/70 dark:bg-amber-600/40 rounded-full animate-pulse"></span>
								<span class="block w-2 h-0.5 bg-amber-300/70 dark:bg-amber-600/40 rounded-full animate-pulse"></span>
								<span class="block w-1 h-0.5 bg-amber-300/70 dark:bg-amber-600/40 rounded-full animate-pulse"></span>
							</div>
							<div class="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-5">
								<div v-for="n in 4" :key="'sk-stat-' + n" class="h-9 w-[5.5rem] bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
							</div>
							<div class="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
								<div class="h-9 w-28 bg-amber-200/70 dark:bg-amber-900/50 rounded-full animate-pulse"></div>
								<div class="h-9 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
							</div>
						</div>

						<div class="lg:col-span-4">
							<div class="relative overflow-hidden rounded-2xl border border-white/80 dark:border-[#2a3850]/80 bg-gradient-to-br from-white/95 via-amber-50/50 to-orange-50/35 dark:from-[#1e2a3f]/95 dark:via-[#151c2c] dark:to-amber-950/20 p-4 md:p-5 ring-1 ring-amber-400/10">
								<div class="pointer-events-none absolute -top-8 -end-8 w-28 h-28 rounded-full bg-amber-400/15 blur-2xl"></div>
								<div class="relative flex items-center justify-center min-h-[7.5rem] max-h-40 animate-pulse">
									<div class="w-4/5 h-24 rounded-xl bg-gray-200/50 dark:bg-gray-700/30"></div>
								</div>
							</div>
						</div>
					</div>
				</section>

				<!-- Content skeleton -->
				<section class="relative my-6 md:my-8 rounded-2xl border border-blue-100/60 dark:border-[#1e2a3f]">
					<div class="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50/90 via-slate-50/80 to-sky-50/70 dark:from-[#0a0f18] dark:via-[#0f1524] dark:to-[#131b28]"></div>
					<div class="relative p-3 md:p-5">
						<div class="rounded-2xl bg-white/70 dark:bg-[#151c2c]/95 border border-gray-200/50 dark:border-[#2a3850]/60 p-3 md:p-4 mb-5 animate-pulse">
							<div class="flex items-center justify-between gap-2 mb-3">
								<div class="flex flex-wrap gap-1.5">
									<div class="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
									<div class="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
									<div class="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
								</div>
								<div class="flex gap-2 shrink-0">
									<div class="h-11 w-36 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
									<div class="h-11 w-36 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
								</div>
							</div>
							<div class="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
						</div>
						<div class="rounded-2xl bg-white/50 dark:bg-[#151c2c]/80 border border-gray-200/40 dark:border-[#2a3850]/50 p-3 md:p-4 space-y-3">
							<div v-for="n in 3" :key="'sk-q-' + n" class="rounded-2xl bg-white dark:bg-[#1a2332] border border-gray-100/80 dark:border-[#2a3850]/50 p-4 animate-pulse">
								<div class="flex items-center gap-3 mb-3">
									<div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0"></div>
									<div class="flex-1 space-y-2">
										<div class="h-3.5 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
										<div class="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
									</div>
								</div>
								<div class="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
								<div class="h-3 w-4/5 bg-gray-200 dark:bg-gray-700 rounded"></div>
							</div>
						</div>
					</div>
				</section>
			</template>

			<template v-else-if="tag">
				<!-- Hero -->
				<section class="relative my-5 md:my-7 rounded-2xl overflow-hidden border border-gray-100 dark:border-[#1e2a3f]">
					<div class="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-[#0f1524] dark:via-[#151c2c] dark:to-[#1a1220]"></div>
					<div class="absolute -top-20 -start-20 w-56 h-56 rounded-full bg-amber-400/20 dark:bg-amber-400/10 blur-3xl"></div>
					<div class="absolute -bottom-12 -end-12 w-48 h-48 rounded-full bg-orange-400/15 dark:bg-rose-500/10 blur-3xl"></div>

					<div class="relative grid lg:grid-cols-12 gap-5 px-4 py-6 md:px-8 md:py-8 items-center">
						<div class="lg:col-span-8 flex flex-col justify-center text-center lg:text-start">
							<router-link :to="{ name: 'tags-index' }" class="inline-flex w-fit mx-auto lg:mx-0 items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition mb-3">
								<svg class="w-3.5 h-3.5 rtl:rotate-180" viewBox="0 0 24 24" fill="none">
									<path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
								{{ $t("tags.viewAll") }}
							</router-link>

							<span class="inline-flex w-fit mx-auto lg:mx-0 items-center gap-1.5 rounded-full bg-amber-400/15 dark:bg-amber-400/10 text-amber-700 dark:text-amber-300 px-3 py-1 text-[11px] font-bold mb-3 ring-1 ring-amber-400/20">
								<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
									<path d="M7.049 3.062A3.5 3.5 0 0 1 10.5 0h3A3.5 3.5 0 0 1 17 3.062l.19.95a2 2 0 0 0 1.632 1.588l.958.192A3.5 3.5 0 0 1 22.938 9.05l-.95.19a2 2 0 0 0-1.588 1.632l-.192.958A3.5 3.5 0 0 1 17 15.938l-.95-.19a2 2 0 0 0-1.632 1.588l-.192.958A3.5 3.5 0 0 1 10.5 24h-3A3.5 3.5 0 0 1 4.062 20.95l-.19-.958a2 2 0 0 0-1.632-1.588l-.958-.192A3.5 3.5 0 0 1 1.062 14.95l.95-.19a2 2 0 0 0 1.588-1.632l.192-.958A3.5 3.5 0 0 1 6.05 7.012l.958.19a2 2 0 0 0 1.632-1.588l.19-.958A3.5 3.5 0 0 1 10.5 3h3c.34 0 .672.049.988.141z" fill="currentColor" />
								</svg>
								{{ $t("tags.tagPage") }}
							</span>

							<h1 class="text-2xl md:text-4xl xl:text-5xl font-extrabold tracking-tight text-gray-800 dark:text-white mb-2"># {{ tag.name }}</h1>

							<div class="flex justify-center lg:justify-start mb-3">
								<span class="inline-block w-20 h-0.5 bg-amber-400 rounded-full"></span>
								<span class="inline-block w-2 h-0.5 mx-1 bg-amber-400 rounded-full"></span>
								<span class="inline-block w-1 h-0.5 bg-amber-400 rounded-full"></span>
							</div>

							<p class="max-w-2xl mx-auto lg:mx-0 mb-5 text-sm md:text-base leading-relaxed text-gray-600 dark:text-gray-300 text-center lg:text-start">
								{{ tag.description || $t("tags.seo.intro", { name: tag.name }) }}
							</p>

							<div class="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-5">
								<span class="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-[#1e2a3f]/80 border border-gray-200/80 dark:border-[#2a3850] px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-200">
									{{ $t("tags.articlesCount", { count: tag.articles_count || 0 }) }}
								</span>
								<span class="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-[#1e2a3f]/80 border border-gray-200/80 dark:border-[#2a3850] px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-200">
									{{ $t("tags.questionsCount", { count: tag.questions_count }) }}
								</span>
								<span class="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-[#1e2a3f]/80 border border-gray-200/80 dark:border-[#2a3850] px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-200">
									{{ $t("tags.coursesCount", { count: tag.courses_count }) }}
								</span>
								<span class="inline-flex items-center gap-1.5 rounded-xl bg-white/80 dark:bg-[#1e2a3f]/80 border border-gray-200/80 dark:border-[#2a3850] px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-200">
									<svg class="w-3.5 h-3.5 opacity-70" viewBox="0 0 24 24" fill="none">
										<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
										<circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" />
										<path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
									</svg>
									{{ $t("tags.followersCount", { count: localFollowersCount }) }}
								</span>
							</div>

							<div class="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
								<button v-if="isLoggedin" @click="toggleFollow" :disabled="followLoading" :class="localFollowing ? 'bg-gray-100/90 dark:bg-white/5 text-gray-600 dark:text-gray-300 ring-1 ring-gray-200/90 dark:ring-white/10 hover:ring-gray-300 dark:hover:ring-white/20 hover:bg-gray-200/80 dark:hover:bg-white/10' : 'bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 shadow-md shadow-amber-400/30 hover:shadow-amber-400/40 hover:from-amber-300 hover:to-amber-400'" class="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-bold rounded-full transition-all duration-200 disabled:opacity-60">
									<span v-if="followLoading" class="inline-flex">
										<svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
											<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
											<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
										</svg>
									</span>
									<template v-else>
										<svg v-if="localFollowing" class="w-3.5 h-3.5 opacity-80" viewBox="0 0 24 24" fill="none">
											<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
										</svg>
										<svg v-else class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
											<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
										</svg>
										<span>{{ localFollowing ? $t("tags.unfollow") : $t("tags.follow") }}</span>
									</template>
								</button>
								<router-link v-else :to="{ name: 'login', query: { redirect: $route.fullPath } }" class="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-bold rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 shadow-md shadow-amber-400/30 hover:shadow-amber-400/40 hover:from-amber-300 hover:to-amber-400 transition-all">
									<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
										<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
									</svg>
									{{ $t("tags.follow") }}
								</router-link>
								<router-link :to="{ name: 'discuss-index' }" class="h-9 px-4 text-sm font-semibold rounded-full flex items-center justify-center text-gray-700 dark:text-gray-200 bg-white/80 dark:bg-[#1e2a3f] border border-gray-200 dark:border-[#2a3850] hover:border-amber-400/50 transition">
									{{ $t("tags.goToDiscuss") }}
								</router-link>
							</div>
						</div>

						<div class="lg:col-span-4">
							<div class="relative overflow-hidden rounded-2xl border border-white/80 dark:border-[#2a3850]/80 bg-gradient-to-br from-white/95 via-amber-50/50 to-orange-50/35 dark:from-[#1e2a3f]/95 dark:via-[#151c2c] dark:to-amber-950/20 backdrop-blur-md p-4 md:p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ring-1 ring-amber-400/10">
								<div class="pointer-events-none absolute -top-8 -end-8 w-28 h-28 rounded-full bg-amber-400/20 dark:bg-amber-400/10 blur-2xl" aria-hidden="true"></div>
								<div class="pointer-events-none absolute -bottom-6 -start-6 w-24 h-24 rounded-full bg-orange-400/15 dark:bg-orange-500/10 blur-2xl" aria-hidden="true"></div>
								<div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.08),transparent_70%)]" aria-hidden="true"></div>
								<div class="relative flex items-center justify-center min-h-[7.5rem] max-h-40 py-1">
								<svg class="w-full h-auto max-h-36 object-contain drop-shadow-sm opacity-95 dark:opacity-90" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 751.13137 401.78485" role="img" aria-hidden="true">
									<path d="M282.11788,650.08478l-.1333-.71387a83.88193,83.88193,0,0,1,17.75391-68.25586,81.38534,81.38534,0,0,1,14.95459-13.89648l.52881-.38184.23144.60938c2.75977,7.27636,6.24316,14.56347,7.83057,17.78906l1.07129-24.07813.61132-.32422a15.90844,15.90844,0,0,1,17.7334,1.83008,16.18094,16.18094,0,0,1,5.34326,17.32617c-.83252,2.82911-1.61865,5.76368-2.37939,8.60157-2.61279,9.75195-5.31445,19.83593-10.55029,28.32715a50.70223,50.70223,0,0,1-36.89942,23.3125Z" transform="translate(-223.9704 -248.96033)" fill="#f2f2f2" />
									<path d="M514.79043,347.35093H275.82022a6.305,6.305,0,0,1-6.29786-6.29785V278.08775a6.305,6.305,0,0,1,6.29786-6.29785H514.79043a6.305,6.305,0,0,1,6.29785,6.29785v62.96533A6.305,6.305,0,0,1,514.79043,347.35093Z" transform="translate(-223.9704 -248.96033)" fill="#f2f2f2" />
									<path d="M561.79043,454.35093H322.82022a6.305,6.305,0,0,1-6.29786-6.29785V385.08775a6.305,6.305,0,0,1,6.29786-6.29785H561.79043a6.305,6.305,0,0,1,6.29785,6.29785v62.96533A6.305,6.305,0,0,1,561.79043,454.35093Z" transform="translate(-223.9704 -248.96033)" fill="#f2f2f2" />
									<path d="M968.81834,464.70045H902.36045l15.3573-99.05469a3.4998,3.4998,0,1,0-6.917-1.07226L895.2772,464.70045H806.61729l15.3573-99.05469a3.4998,3.4998,0,1,0-6.917-1.07226L799.534,464.70045H743.28758a3.5,3.5,0,0,0,0,7h55.16119l-13.43677,86.667H721.50437a3.5,3.5,0,0,0,0,7h62.42237L771.49168,645.5735a3.4998,3.4998,0,1,0,6.917,1.07226L791.01,565.36744H879.6699L867.23484,645.5735a3.49981,3.49981,0,1,0,6.917,1.07226l12.60131-81.27832h60.282a3.5,3.5,0,0,0,0-7H887.83842l13.43671-86.667h67.54321a3.5,3.5,0,0,0,0-7Zm-88.06317,93.667H792.09526l13.4367-86.667h88.66Z" transform="translate(-223.9704 -248.96033)" fill="#e6e6e6" />
									<polygon points="481.414 378.041 469.966 378.041 464.52 333.882 481.416 333.883 481.414 378.041" fill="#9e616a" />
									<path d="M711.54368,648.73961H703.42l-1.45-7.66971-3.71377,7.66971H676.71028a4.84333,4.84333,0,0,1-2.75214-8.82893l17.20593-11.883v-7.75382l18.09765,1.08019Z" transform="translate(-223.9704 -248.96033)" fill="#2f2e41" />
									<polygon points="483.721 121.423 482.599 126.768 483.07 150.149 522.07 155.149 522.9 118.467 518.834 111.785 483.721 121.423" fill="#9e616a" />
									<polygon points="539.354 378.041 527.905 378.041 522.459 333.882 539.356 333.883 539.354 378.041" fill="#9e616a" />
									<path d="M763.7595,589.02731l-17.38,1.7351-.098-.75346-9.21853-46.76327-2.15267-5.66445L721.4101,473.51392l-7,16s.53554,16.94783-.92492,18.682c0,0-2.31626,16.38644-5.668,17.00391l0,0a120.512,120.512,0,0,1,1.24609,56.9829l-1.87588,8.51359-15.852.22033c-5.17015-.813-3.18222-28.31749-9.96877-53.75114-.8555-3.20612,4.38451-128.31956,25.593-141.02673l39.41762.96463.533.55412c.19343.20019,14.49983,21.8564,13.49983,44.8564l-2,47,.89837,7.94615,3.2991,21.442,2.6425,9.9595,0,0a114.42625,114.42625,0,0,1,1.37277,40.25722Z" transform="translate(-223.9704 -248.96033)" fill="#2f2e41" />
									<path d="M769.48292,648.73961h-8.12368l-1.45-7.66971-3.71376,7.66971H734.64951a4.84333,4.84333,0,0,1-2.75214-8.82893l17.20594-11.883v-7.75382L767.201,621.354Z" transform="translate(-223.9704 -248.96033)" fill="#2f2e41" />
									<path id="a535f923-d253-4cd0-8492-9156d4611884-225" data-name="Path 9" d="M725.498,289.22009l-.0159-.00417a3.2951,3.2951,0,0,1-2.34245-4.02845l4.69331-17.77994a24.57462,24.57462,0,0,1,4.32226-8.77839,24.971,24.971,0,0,1,16.05187-9.40324,24.58883,24.58883,0,0,1,9.84249.53895c13.13579,3.44537,16.8047,7.78981,17.54606,30.02285s-4.70046,17.807-4.70046,17.807a3.30049,3.30049,0,0,1-.58167,1.18081,3.35457,3.35457,0,0,1-2.16068,1.26156,3.31134,3.31134,0,0,1-1.31595-.07244c-16.40382-1.68861-33.01683-3.22624-41.34153-10.74527Z" transform="translate(-223.9704 -248.96033)" fill="#2f2e41" />
									<path id="b0ed392d-e28e-41ab-913e-3eea91058667-226" data-name="Ellipse 1" d="M764.06616,270.44924a18.12654,18.12654,0,0,1-26.93033,19.89645,17.91537,17.91537,0,0,1-8.21607-11.09792,18.12654,18.12654,0,0,1,26.91471-19.89351A17.91536,17.91536,0,0,1,764.066,270.4499Z" transform="translate(-223.9704 -248.96033)" fill="#9e616a" />
									<path id="f63de286-de7c-4407-a1c4-23ed0a8d5112-227" data-name="Path 10" d="M721.81173,267.36594a19.44009,19.44009,0,0,1,3.41858-6.94261c2.26343-5.64269,5.81392-10.20339,12.69315-7.43453a19.44868,19.44868,0,0,1,7.73511.41627l3.56334.92151.12.03135A19.40713,19.40713,0,0,1,763.13854,278.084l-.094.35613-7.53625-1.95681-.67387-7.849-2.41006,7.0498-3.89286-1.00921-.3393-3.95976-1.21594,3.55418c-7.38118,2.8677-15.93584.0227-25.25538-6.54572Z" transform="translate(-223.9704 -248.96033)" fill="#2f2e41" />
									<path id="fb48cedc-59e8-4080-98a2-7877a59d0df4-228" data-name="Path 13" d="M739.10205,292.21178a3.24245,3.24245,0,0,0-.32219,1.75606,3.31623,3.31623,0,0,0,.2118.90048,3.35441,3.35441,0,0,0,.37292.69706,3.28955,3.28955,0,0,0,1.86843,1.29678q.07088.018.14244.03336t.144.02741q.07293.0129.14624.02165t.148.015l2.80014.21968,5.75565-6.89111-1.901,7.20184,12.72526,1.01968,8.06722-30.56154-20.39114-5.278.34912.71763a14.487,14.487,0,0,1,1.352,7.72978,23.61537,23.61537,0,0,1-2.19684,7.728,42.58589,42.58589,0,0,1-4.17068,7.01264,62.76389,62.76389,0,0,1-4.57491,5.59349A3.31125,3.31125,0,0,0,739.10205,292.21178Z" transform="translate(-223.9704 -248.96033)" fill="#2f2e41" />
									<path d="M651.77537,393.74a7.5677,7.5677,0,0,0,9.34334-6.8817l57.444-20.66568-10.54224-9.174-54.5225,21.70853A7.60869,7.60869,0,0,0,651.77537,393.74Z" transform="translate(-223.9704 -248.96033)" fill="#9e616a" />
									<path d="M734.61,314.99644s9.6749.21319,10.53506,11.25862-20.25032,38.3661-23.52107,42.87149-39.60073,10.05074-39.60073,10.05074l-12.35-8.96572c12.9769-8.40862,24.82-14.856,32.768-14.566Z" transform="translate(-223.9704 -248.96033)" fill="#fed700" />
									<path d="M751.72447,299.60271l-14.89572-.87951a3.024,3.024,0,0,0-2.97374,1.8656l-4.20948,10.20476-17.495,14.45985s-6.92672,8.81455-6.94284,20.19831-2.45755,37.7327-2.45755,37.7327,38.857,2.61348,39.69482,1.73913c1.645-1.71669,3.6406-10.48883,3.6406-10.48883l13.635-50.09793a18.55472,18.55472,0,0,0-2.63847-15.613c-.95256-1.34114-1.95061-2.33889-2.8781-2.50391C752.12154,305.77651,753.22928,301.109,751.72447,299.60271Z" transform="translate(-223.9704 -248.96033)" fill="#fed700" />
									<path d="M691.83223,480.29764a4.71,4.71,0,0,1-3.527-.854L619.36867,429.0899a4.74592,4.74592,0,0,1-1.03233-6.62711l35.20521-48.19715a4.74649,4.74649,0,0,1,6.62759-1.03241L729.10522,423.587a4.74592,4.74592,0,0,1,1.03233,6.62711l-35.20521,48.19715A4.71008,4.71008,0,0,1,691.83223,480.29764Z" transform="translate(-223.9704 -248.96033)" fill="#fff" />
									<path d="M691.83223,480.29764a4.71,4.71,0,0,1-3.527-.854L619.36867,429.0899a4.74592,4.74592,0,0,1-1.03233-6.62711l35.20521-48.19715a4.74649,4.74649,0,0,1,6.62759-1.03241L729.10522,423.587a4.74592,4.74592,0,0,1,1.03233,6.62711l-35.20521,48.19715A4.71008,4.71008,0,0,1,691.83223,480.29764ZM656.94935,374.35448a2.7195,2.7195,0,0,0-1.79246,1.09065L619.9512,423.64235a2.74665,2.74665,0,0,0,.597,3.83269l68.93657,50.35371a2.81451,2.81451,0,0,0,3.83268-.597l35.20521-48.19716a2.74664,2.74664,0,0,0-.597-3.83268l-68.93657-50.35371A2.72146,2.72146,0,0,0,656.94935,374.35448Z" transform="translate(-223.9704 -248.96033)" fill="#ccc" />
									<path d="M683.89221,413.7432l-6.61068,2.55016-2.40736-11.0582a1.50008,1.50008,0,1,0-2.93136.63886l2.50622,11.512-8.35633,3.22357-2.40753-11.05814a1.50008,1.50008,0,1,0-2.93136.63886l2.50634,11.512-5.72388,2.20807a1.5,1.5,0,0,0,1.07974,2.799l5.29-2.04068,1.87987,8.63446-6.57259,2.53547a1.5,1.5,0,0,0,1.07974,2.799l6.13866-2.36808,1.89923,8.7233a1.50015,1.50015,0,0,0,1.78465,1.14642,1.561,1.561,0,0,0,.22271-.06708,1.5,1.5,0,0,0,.924-1.7182l-1.998-9.17714,8.3561-3.22348,1.89911,8.72334a1.50015,1.50015,0,0,0,1.78465,1.14642,1.56118,1.56118,0,0,0,.22272-.06708,1.5,1.5,0,0,0,.924-1.7182l-1.9979-9.17718,6.19606-2.39022a1.5,1.5,0,1,0-1.07974-2.799l-5.76208,2.22281-1.87976-8.63451,7.0446-2.71755a1.5,1.5,0,1,0-1.07974-2.799Zm-6.91766,15.24372-8.35616,3.2235-1.87987-8.63446,8.35627-3.22355Z" transform="translate(-223.9704 -248.96033)" fill="#fed700" />
									<path d="M729.72837,425.858a7.56766,7.56766,0,0,0,3.38186-11.10039l33.72191-50.88923-13.93479-1.05928-30.756,49.98029a7.60868,7.60868,0,0,0,7.58705,13.06861Z" transform="translate(-223.9704 -248.96033)" fill="#9e616a" />
									<path d="M749.11737,313.225s7.88616-5.60869,15.17437,2.73537,6.67966,42.86508,6.74814,48.43209c.02145,1.74324-2.49581,5.50476-5.964,9.84963-1.557,1.9506-3.30565,4.01878-5.10228,6.07469-1.03968,1.18973-.14384,3.66606-1.18782,4.82242-1.03824,1.15-4.01644.98035-5.004,2.0477-4.68754,5.06629-8.49565,8.92278-8.49565,8.92278l-15.26009.18766c-.17216-11.34406,7.59641-21.46991,17.57679-31.25646Z" transform="translate(-223.9704 -248.96033)" fill="#fed700" />
									<path d="M973.91108,650.43785l-748.75.30733a1.19069,1.19069,0,0,1,0-2.38137l748.75-.30733a1.19069,1.19069,0,1,1,0,2.38137Z" transform="translate(-223.9704 -248.96033)" fill="#cacaca" />
									<path d="M572.7902,387.35088H333.82012a5.304,5.304,0,0,1-5.29794-5.29794v-62.9653a5.30383,5.30383,0,0,1,5.29794-5.29774H572.7902a5.30383,5.30383,0,0,1,5.29794,5.29774v62.9653A5.304,5.304,0,0,1,572.7902,387.35088Z" transform="translate(-223.9704 -248.96033)" fill="#fff" />
									<path d="M572.79043,388.35093H333.82022a6.305,6.305,0,0,1-6.29786-6.29785V319.08775a6.305,6.305,0,0,1,6.29786-6.29785H572.79043a6.305,6.305,0,0,1,6.29785,6.29785v62.96533A6.305,6.305,0,0,1,572.79043,388.35093Zm-238.97021-73.561a4.303,4.303,0,0,0-4.29786,4.29785v62.96533a4.303,4.303,0,0,0,4.29786,4.29785H572.79043a4.303,4.303,0,0,0,4.29785-4.29785V319.08775a4.303,4.303,0,0,0-4.29785-4.29785Z" transform="translate(-223.9704 -248.96033)" fill="#ccc" />
									<path d="M558.50574,356.70205H348.10362a2.56,2.56,0,1,1,0-5.12H558.50574a2.56,2.56,0,1,1,0,5.12Z" transform="translate(-223.9704 -248.96033)" fill="#fed700" />
									<path d="M537.59969,366.818H348.10362a2.56015,2.56015,0,0,1,0-5.12029H537.59969a2.56014,2.56014,0,1,1,0,5.12029Z" transform="translate(-223.9704 -248.96033)" fill="#fed700" />
									<circle cx="135.06962" cy="84.1493" r="13" fill="#fed700" />
									<path d="M364.28452,327.23113l-3.08157,1.18876-1.1222-5.1548a.69927.69927,0,1,0-1.36646.29781l1.16828,5.36634-3.89531,1.50268-1.12228-5.15477a.69926.69926,0,1,0-1.36645.2978l1.16833,5.36633-2.6682,1.02929a.69923.69923,0,0,0,.50333,1.30474l2.46592-.95126.8763,4.025-3.06382,1.18192a.69922.69922,0,1,0,.50332,1.30473l2.86155-1.10388.88532,4.06638a.6993.6993,0,0,0,.83192.5344.72749.72749,0,0,0,.10382-.03126.69924.69924,0,0,0,.43072-.801l-.93138-4.27793,3.89521-1.50263.88527,4.06639a.69929.69929,0,0,0,.83192.53441.72751.72751,0,0,0,.10382-.03127.69922.69922,0,0,0,.43071-.80094l-.93132-4.278,2.8883-1.1142a.69923.69923,0,1,0-.50332-1.30474l-2.686,1.03617-.87625-4.025,3.28386-1.26679a.69923.69923,0,0,0-.50333-1.30474Zm-3.22467,7.10588-3.89524,1.50264-.8763-4.025,3.89528-1.50266Z" transform="translate(-223.9704 -248.96033)" fill="#f2f2f2" />
									<path d="M706.41011,594.51392h-16a7,7,0,0,1-7-7v0a7,7,0,0,1,7-7l20-5c3.866,0,3,8.134,3,12v0A7,7,0,0,1,706.41011,594.51392Z" transform="translate(-223.9704 -248.96033)" fill="#2f2e41" />
									<path d="M763.41011,594.51392h-16a7,7,0,0,1-7-7v0c0-3.866-.866-12,3-12l20,5a7,7,0,0,1,7,7v0A7,7,0,0,1,763.41011,594.51392Z" transform="translate(-223.9704 -248.96033)" fill="#2f2e41" />
								</svg>
								</div>
							</div>
						</div>
					</div>
				</section>

                <!-- Tabs + Content -->
                <section id="tag-content" class="relative my-6 md:my-8 rounded-2xl border border-blue-100/60 dark:border-[#1e2a3f] shadow-[0_4px_24px_-4px_rgba(59,130,246,0.1)] dark:shadow-none">
                    <div class="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                    <div class="absolute inset-0 bg-gradient-to-br from-blue-50/90 via-slate-50/80 to-sky-50/70 dark:from-[#0a0f18] dark:via-[#0f1524] dark:to-[#131b28]" aria-hidden="true"></div>
                    <div class="pointer-events-none absolute -top-16 -end-12 w-44 h-44 rounded-full bg-amber-400/12 dark:bg-amber-500/8 blur-3xl" aria-hidden="true"></div>
                    <div class="pointer-events-none absolute -bottom-12 -start-10 w-36 h-36 rounded-full bg-blue-400/10 dark:bg-blue-600/8 blur-3xl" aria-hidden="true"></div>
                    <div class="pointer-events-none absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.06),transparent_65%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.04),transparent_65%)]" aria-hidden="true"></div>
                    </div>

                    <div class="relative z-10 p-3 md:p-5">
						<TabGroup :selectedIndex="selectedTabIndex" @change="onTabChange">
							<div class="relative z-20 overflow-visible rounded-2xl bg-white/70 dark:bg-[#151c2c]/95 backdrop-blur-sm border border-gray-200/50 dark:border-[#2a3850]/60 shadow-sm dark:shadow-none p-3 md:p-4 mb-5">
							<div class="flex items-center justify-between gap-2 mb-3 min-w-0">
								<TabList class="flex flex-wrap gap-1.5 min-w-0 flex-1">
									<Tab v-for="tab in tabs" :key="tab.slug" v-slot="{ selected }" as="template">
										<button :class="selected ? 'bg-amber-400 text-gray-900 shadow-sm shadow-amber-400/25' : 'bg-white dark:bg-[#1a2332] text-gray-600 dark:text-gray-400 border border-gray-200/80 dark:border-[#2a3850]/70 hover:border-amber-400/40 dark:hover:border-amber-400/30 hover:text-amber-600 dark:hover:text-amber-400'" class="rounded-lg py-2 px-3.5 text-xs md:text-sm font-semibold outline-none transition whitespace-nowrap">
											{{ tab.title }}
											<span v-if="tab.count != null" class="ms-1 opacity-75">({{ tab.count }})</span>
										</button>
									</Tab>
								</TabList>

								<div class="flex items-center gap-2 shrink-0">
									<TagFilterDropdown v-model="timeFilter" :label="$t('tags.timeFilterLabel')" :options="timeFilterOptions" @change="onContentFilterChange" />
									<TagFilterDropdown v-model="displayFilter" :label="$t('tags.displayFilterLabel')" :options="displayFilterOptions" @change="onContentFilterChange" />
								</div>
							</div>

							<div class="relative w-full">
								<svg class="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" viewBox="0 0 24 24" fill="none">
									<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" />
									<path d="M20 20L16.5 16.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
								</svg>
								<input v-model="activeTabState.search" @input="onTabSearchInput" @keydown.esc="clearTabSearch" type="text" role="searchbox" :placeholder="tabSearchPlaceholder" autocomplete="off" spellcheck="false" class="tag-page-search-input w-full h-10 rounded-lg border border-gray-200/80 dark:border-[#2a3850]/70 bg-white dark:bg-[#1a2332] ps-10 pe-10 text-sm font-semibold text-gray-600 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition" />
								<button v-if="activeTabState.search.trim()" type="button" @click="clearTabSearch" class="absolute end-2 top-1/2 -translate-y-1/2 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#243044] transition" :aria-label="$t('tags.searchClear')">
									<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
										<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
									</svg>
								</button>
							</div>
							</div>

							<div class="rounded-2xl bg-white/50 dark:bg-[#151c2c]/80 border border-gray-200/40 dark:border-[#2a3850]/50 p-3 md:p-4">
							<TabPanels>
								<TabPanel>
									<TagTabContent type="questions" :loading="activeTabState.loading" :items="activeTabState.items" :pagination="activeTabState.pagination" :empty-text="$t('tags.noQuestions')" @update-page="onTabPageChange">
										<QuestionCard2 v-for="item in activeTabState.items" :key="item.id" :question="item" />
									</TagTabContent>
								</TabPanel>
								<TabPanel>
									<TagTabContent type="courses" :loading="activeTabState.loading" :items="activeTabState.items" :pagination="activeTabState.pagination" :empty-text="$t('tags.noCourses')" @update-page="onTabPageChange">
										<CourseCard2 v-for="item in activeTabState.items" :key="item.id" :course="item" />
									</TagTabContent>
								</TabPanel>
								<TabPanel>
									<TagTabContent type="articles" :loading="activeTabState.loading" :items="activeTabState.items" :pagination="activeTabState.pagination" :empty-text="$t('tags.noArticles')" @update-page="onTabPageChange">
										<ArticleCard v-for="item in activeTabState.items" :key="item.id" :article="item" />
									</TagTabContent>
								</TabPanel>
							</TabPanels>
							</div>
						</TabGroup>
					</div>
				</section>
			</template>

			<section v-else class="my-16 text-center rounded-2xl bg-white dark:bg-[#151c2c] border border-gray-100 dark:border-[#1e2a3f] p-12">
				<div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-[#1e2a3f] flex items-center justify-center">
					<svg class="w-8 h-8 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none">
						<path d="M7.049 3.062A3.5 3.5 0 0 1 10.5 0h3A3.5 3.5 0 0 1 17 3.062l.19.95a2 2 0 0 0 1.632 1.588l.958.192A3.5 3.5 0 0 1 22.938 9.05l-.95.19a2 2 0 0 0-1.588 1.632l-.192.958A3.5 3.5 0 0 1 17 15.938l-.95-.19a2 2 0 0 0-1.632 1.588l-.192.958A3.5 3.5 0 0 1 10.5 24h-3A3.5 3.5 0 0 1 4.062 20.95l-.19-.958a2 2 0 0 0-1.632-1.588l-.958-.192A3.5 3.5 0 0 1 1.062 14.95l.95-.19a2 2 0 0 0 1.588-1.632l.192-.958A3.5 3.5 0 0 1 6.05 7.012l.958.19a2 2 0 0 0 1.632-1.588l.19-.958A3.5 3.5 0 0 1 10.5 3h3c.34 0 .672.049.988.141z" fill="currentColor" />
					</svg>
				</div>
				<p class="text-gray-600 dark:text-gray-300 font-bold mb-4">{{ $t("tags.notFound") }}</p>
				<router-link :to="{ name: 'tags-index' }" class="inline-flex h-9 px-5 items-center rounded-full text-sm font-bold bg-amber-400 text-gray-900 hover:bg-amber-300 transition">
					{{ $t("tags.viewAll") }}
				</router-link>
			</section>
		</div>
	</MasterPage>
</template>

<script>
import MasterPage from "@/views/page/discuss/layouts/MasterPage.vue";
import TagTabContent from "@/views/components/tag/TagTabContent.vue";
import TagFilterDropdown from "@/views/components/tag/TagFilterDropdown.vue";
import QuestionCard2 from "@/views/components/discuss/QuestionCard2.vue";
import CourseCard2 from "@/views/components/course/CourseCard2.vue";
import ArticleCard from "@/views/components/articles/ArticleCard.vue";
import { tagService } from "@/services/tag.service";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import { toast } from "vue3-toastify";
import { useSEO, generateBreadcrumbSchema } from "@/composables/useSEO";

function emptyTabState() {
	return {
		items: [],
		loading: false,
		search: "",
		searchTimer: null,
		initialized: false,
		pagination: {
			current_page: 1,
			last_page: 1,
			total: 0,
			per_page: 10,
		},
	};
}

export default {
	components: {
		MasterPage,
		TagTabContent,
		TagFilterDropdown,
		QuestionCard2,
		CourseCard2,
		ArticleCard,
		TabGroup,
		TabList,
		Tab,
		TabPanels,
		TabPanel,
	},
	props: { tagSlug: String },
	data() {
		return {
			tag: null,
			loading: true,
			selectedTabIndex: 0,
			followLoading: false,
			localFollowing: false,
			localFollowersCount: 0,
			timeFilter: "newest",
			displayFilter: "all",
			tabStates: {
				questions: emptyTabState(),
				courses: emptyTabState(),
				articles: emptyTabState(),
			},
		};
	},
	computed: {
		isLoggedin() {
			return this.$store.state.auth.status.loggedIn;
		},
		activeType() {
			return this.tabs[this.selectedTabIndex]?.slug || "questions";
		},
		activeTabState() {
			return this.tabStates[this.activeType] || emptyTabState();
		},
		tabs() {
			return [
				{ slug: "questions", title: this.$t("tags.tabQuestions"), count: this.tag?.questions_count },
				{ slug: "courses", title: this.$t("tags.tabCourses"), count: this.tag?.courses_count },
				{ slug: "articles", title: this.$t("tags.tabArticles"), count: this.tag?.articles_count },
			];
		},
		tabSearchPlaceholder() {
			if (this.activeType === "courses") {
				return this.$t("tags.tabSearchCourses");
			}
			if (this.activeType === "articles") {
				return this.$t("tags.tabSearchArticles");
			}
			return this.$t("tags.tabSearchQuestions");
		},
		totalContentCount() {
			if (!this.tag) return 0;
			return (this.tag.questions_count || 0) + (this.tag.courses_count || 0) + (this.tag.articles_count || 0);
		},
		timeFilterOptions() {
			return [
				{ value: "newest", label: this.$t("tags.timeNewest") },
				{ value: "oldest", label: this.$t("tags.timeOldest") },
				{ value: "week", label: this.$t("tags.timeWeek") },
				{ value: "month", label: this.$t("tags.timeMonth") },
				{ value: "year", label: this.$t("tags.timeYear") },
			];
		},
		displayFilterOptions() {
			return [
				{ value: "all", label: this.$t("tags.displayAll") },
				{ value: "popular", label: this.$t("tags.displayPopular") },
				{ value: "most_viewed", label: this.$t("tags.displayMostViewed") },
			];
		},
	},
	watch: {
		tagSlug: {
			immediate: true,
			handler() {
				this.loadTag();
			},
		},
	},
	methods: {
		async loadTag() {
			this.loading = true;
			this.tabStates = { questions: emptyTabState(), courses: emptyTabState(), articles: emptyTabState() };
			try {
				const response = await tagService.show(this.tagSlug);
				this.tag = response.data.tag;
				this.localFollowing = this.tag.is_following;
				this.localFollowersCount = this.tag.followers_count;
				this.applySeo();
				await this.fetchTabContent("questions", 1);
			} catch {
				this.tag = null;
			} finally {
				this.loading = false;
			}
		},
		applySeo() {
			if (!this.tag) return;
			const name = this.tag.name;
			const breadcrumb = generateBreadcrumbSchema([
				{ name: "خانه", url: "/" },
				{ name: this.$t("tags.listTitle"), url: "/tags" },
				{ name: `#${name}`, url: `/tag/${this.tag.slug}` },
			]);
			useSEO({
				title: this.$t("tags.seo.showTitle", { name }),
				description: this.tag.description || this.$t("tags.seo.showDescription", { name }),
				url: `/tag/${this.tag.slug}`,
				keywords: [name, "تگ", "برنامه‌نویسی", "آموزش", "زنبورک"],
				schema: [breadcrumb].filter(Boolean),
			});
		},
		async fetchTabContent(type, page = 1) {
			const state = this.tabStates[type];
			if (!state || state.loading) return;

			state.loading = true;

			try {
				const response = await tagService.content(this.tagSlug, {
					type,
					page,
					search: state.search.trim() || undefined,
					timeFilter: this.timeFilter,
					displayFilter: this.displayFilter,
					perPage: 10,
				});

				state.items = response.data.items;
				state.pagination = response.data.pagination;
				state.initialized = true;
			} catch (error) {
				console.error(error);
			} finally {
				state.loading = false;
			}
		},
		onContentFilterChange() {
			const type = this.activeType;
			const state = this.tabStates[type];
			if (!state) return;
			state.initialized = false;
			this.fetchTabContent(type, 1);
		},
		onTabPageChange(page) {
			const type = this.activeType;
			this.fetchTabContent(type, page);
			this.scrollToContent();
		},
		goToTab(index) {
			this.selectedTabIndex = index;
			const type = this.tabs[index]?.slug;
			if (type && !this.tabStates[type]?.initialized) {
				this.fetchTabContent(type, 1);
			}
			this.scrollToContent();
		},
		scrollToContent() {
			const el = document.getElementById("tag-content");
			if (el) {
				el.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		},
		onTabChange(index) {
			this.selectedTabIndex = index;
			const type = this.activeType;
			if (!this.tabStates[type]?.initialized) {
				this.fetchTabContent(type, 1);
			}
		},
		onTabSearchInput() {
			const type = this.activeType;
			const state = this.tabStates[type];
			if (!state) return;
			clearTimeout(state.searchTimer);
			state.searchTimer = setTimeout(() => {
				state.initialized = false;
				this.fetchTabContent(type, 1);
			}, 350);
		},
		clearTabSearch() {
			const type = this.activeType;
			const state = this.tabStates[type];
			if (!state || !state.search.trim()) return;
			state.search = "";
			state.initialized = false;
			this.fetchTabContent(type, 1);
		},
		async toggleFollow() {
			this.followLoading = true;
			try {
				const response = await tagService.toggleFollow(this.tag.id);
				this.localFollowing = response.data.hasFlollow;
				if (response.data.numberOfFollowers != null) {
					this.localFollowersCount = response.data.numberOfFollowers;
				}
				toast.success(this.localFollowing ? this.$t("tags.followSuccess") : this.$t("tags.unfollowSuccess"), { theme: "colored", rtl: localStorage.getItem("direction") === "rtl", bodyClassName: "font-YekanBakh", toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0", position: toast.POSITION.BOTTOM_RIGHT });
			} finally {
				this.followLoading = false;
			}
		},
	},
	beforeUnmount() {
		Object.values(this.tabStates).forEach((s) => clearTimeout(s.searchTimer));
	},
};
</script>

<style scoped>
.tag-page-search-input:focus {
	outline: none;
	border-color: rgb(251 191 36 / 0.5);
	box-shadow: 0 0 0 2px rgb(251 191 36 / 0.25);
}
</style>
