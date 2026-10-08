<template>
	<section ref="sectionRef" class="zb-stats" aria-label="Platform statistics">
		<div class="zb-stats__panel rounded-3xl bg-white px-4 py-8 dark:bg-gray-900 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
			<div class="zb-stats__layout">
				<div class="zb-stats__copy">
					<p class="text-sm font-medium text-violet-600 dark:text-violet-300">{{ $t("index.statsEyebrow") }}</p>
					<h2 class="mt-3 text-3xl font-extrabold leading-tight text-gray-700 dark:text-white">
						<span class="block">{{ $t("index.statsTitleLine1") }}</span>
						<span class="block">{{ $t("index.statsTitleLine2") }}</span>
					</h2>
					<p class="mt-3 text-base font-light leading-8 text-gray-600 dark:text-gray-400">{{ $t("index.statsDesc") }}</p>
					<router-link :to="{ name: 'courses' }"
						class="zb-stats__cta mt-5 inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80">
						{{ $t("index.statsCta") }}
					</router-link>
				</div>

				<div class="zb-stats__board" :class="{ 'is-in': hasAnimated && !loading }">
					<div class="zb-stats__col">
						<article
							v-for="(item, index) in columnOne"
							:key="item.key"
							class="zb-stats__card rounded-2xl bg-[#f4f0ff] p-4 text-start dark:bg-gray-800 sm:p-5"
							:style="{ '--i': index }"
						>
							<template v-if="loading">
								<span class="zb-stats__skel zb-stats__skel--icon bg-violet-200 dark:bg-gray-700" />
								<span class="zb-stats__skel zb-stats__skel--num bg-violet-200 dark:bg-gray-700" />
								<span class="zb-stats__skel zb-stats__skel--label bg-violet-200 dark:bg-gray-700" />
							</template>
							<template v-else>
								<svg class="zb-stats__icon text-violet-600 dark:text-violet-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
									<template v-if="item.icon === 'chat'">
										<path d="M7.2 17.6 5.4 19.2c-.7.6-1.8.1-1.8-.8V7.2A2.2 2.2 0 0 1 5.8 5h12.4A2.2 2.2 0 0 1 20.4 7.2v7.2a2.2 2.2 0 0 1-2.2 2.2H7.2Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
										<path d="M8 9.2h8M8 12.4h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
									</template>
									<template v-else-if="item.icon === 'people'">
										<circle cx="8.6" cy="8.6" r="2.15" stroke="currentColor" stroke-width="1.6" />
										<circle cx="15.3" cy="9.1" r="1.7" stroke="currentColor" stroke-width="1.6" />
										<path d="M4.6 17.4c.55-2.15 2.05-3.35 3.95-3.35 1.9 0 3.4 1.2 3.95 3.35" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
										<path d="M13.1 14.3c.75-.4 1.55-.6 2.35-.6 1.5 0 2.75.95 3.2 2.7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
									</template>
								</svg>
								<p class="mt-4 text-3xl font-extrabold leading-none text-gray-800 dark:text-white" dir="ltr">{{ displayValues[item.key] }}+</p>
								<p class="mt-1 text-sm font-light text-gray-500 dark:text-gray-400">{{ $t(item.labelKey) }}</p>
							</template>
						</article>
					</div>
					<div class="zb-stats__col zb-stats__col--offset">
						<article
							v-for="(item, index) in columnTwo"
							:key="item.key"
							class="zb-stats__card rounded-2xl bg-[#f4f0ff] p-4 text-start dark:bg-gray-800 sm:p-5"
							:style="{ '--i': index + 2 }"
						>
							<template v-if="loading">
								<span class="zb-stats__skel zb-stats__skel--icon bg-violet-200 dark:bg-gray-700" />
								<span class="zb-stats__skel zb-stats__skel--num bg-violet-200 dark:bg-gray-700" />
								<span class="zb-stats__skel zb-stats__skel--label bg-violet-200 dark:bg-gray-700" />
							</template>
							<template v-else>
								<svg class="zb-stats__icon text-violet-600 dark:text-violet-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
									<template v-if="item.icon === 'file'">
										<path d="M8 4.5h6.2L18 8.3V19a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 7 19V6A1.5 1.5 0 0 1 8.5 4.5H8Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
										<path d="M14 4.7V8.2h3.4" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
										<path d="M9.5 12.2h5.2M9.5 15.4h3.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
									</template>
									<template v-else>
										<path d="M5.2 18.6V6.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
										<path d="M5.2 18.6H19" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
										<path d="M8.4 18.6v-4.1M12.1 18.6V9.4M15.8 18.6v-6.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
									</template>
								</svg>
								<p class="mt-4 text-3xl font-extrabold leading-none text-gray-800 dark:text-white" dir="ltr">{{ displayValues[item.key] }}+</p>
								<p class="mt-1 text-sm font-light text-gray-500 dark:text-gray-400">{{ $t(item.labelKey) }}</p>
							</template>
						</article>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
const STAT_ITEMS = [
	{ key: "instructors", labelKey: "index.statsInstructorsLabel", icon: "chat", column: 1 },
	{ key: "students", labelKey: "index.statsStudentsLabel", icon: "people", column: 1 },
	{ key: "courses", labelKey: "index.statsCoursesLabel", icon: "file", column: 2 },
	{ key: "paths", labelKey: "index.statsPathsLabel", icon: "chart", column: 2 },
];

const EMPTY_STATS = { students: 0, courses: 0, fields: 0, instructors: 0, paths: 0 };

export default {
	name: "HomeStatsSection",
	props: {
		stats: { type: Object, default: null },
		loading: { type: Boolean, default: false },
	},
	data() {
		return {
			statItems: STAT_ITEMS,
			targetStats: { ...EMPTY_STATS },
			displayValues: {
				students: "0",
				courses: "0",
				fields: "0",
				instructors: "0",
				paths: "0",
			},
			hasAnimated: false,
			observer: null,
			animationFrame: null,
		};
	},
	computed: {
		columnOne() {
			return this.statItems.filter((item) => item.column === 1);
		},
		columnTwo() {
			return this.statItems.filter((item) => item.column === 2);
		},
	},
	watch: {
		loading(isLoading) {
			if (!isLoading) this.prepareAndObserve();
		},
		stats() {
			if (!this.loading) this.prepareAndObserve();
		},
	},
	methods: {
		formatCount(value) {
			return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(value));
		},
		prepareAndObserve() {
			this.targetStats = { ...EMPTY_STATS, ...(this.stats || {}) };
			this.$nextTick(() => this.setupObserver());
		},
		animateCounters() {
			if (this.hasAnimated) return;
			this.hasAnimated = true;

			const reduced =
				typeof window !== "undefined" &&
				window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
			if (reduced) {
				Object.keys(EMPTY_STATS).forEach((key) => {
					this.displayValues[key] = this.formatCount(this.targetStats[key]);
				});
				return;
			}

			const duration = 1100;
			const start = performance.now();
			const tick = (now) => {
				const progress = Math.min((now - start) / duration, 1);
				const eased = 1 - Math.pow(1 - progress, 3);
				Object.keys(EMPTY_STATS).forEach((key) => {
					this.displayValues[key] = this.formatCount(this.targetStats[key] * eased);
				});
				if (progress < 1) {
					this.animationFrame = requestAnimationFrame(tick);
				}
			};
			this.animationFrame = requestAnimationFrame(tick);
		},
		setupObserver() {
			if (this.hasAnimated || this.loading) return;
			if (typeof IntersectionObserver === "undefined") {
				this.animateCounters();
				return;
			}
			this.observer?.disconnect();
			this.observer = new IntersectionObserver(
				(entries) => {
					if (entries.some((entry) => entry.isIntersecting)) {
						this.animateCounters();
						this.observer?.disconnect();
					}
				},
				{ threshold: 0.28 }
			);
			if (this.$refs.sectionRef) this.observer.observe(this.$refs.sectionRef);
		},
	},
	mounted() {
		if (!this.loading) this.prepareAndObserve();
	},
	beforeUnmount() {
		this.observer?.disconnect();
		if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
	},
};
</script>

<style scoped>
.zb-stats__layout {
	display: grid;
	gap: 2rem;
	align-items: center;
}

.zb-stats__copy {
	text-align: center;
	max-width: 34rem;
	margin-inline: auto;
}

.zb-stats__board {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 0.75rem;
	align-items: start;
}

.zb-stats__col {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	min-width: 0;
}

.zb-stats__col--offset {
	margin-top: 1.35rem;
}

.zb-stats__card {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.zb-stats__board.is-in .zb-stats__card {
	animation: zb-stats-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
	animation-delay: calc(var(--i) * 70ms);
}

.zb-stats__icon {
	width: 1.7rem;
	height: 1.7rem;
	display: block;
	flex-shrink: 0;
}

.zb-stats__skel {
	display: block;
	border-radius: 9999px;
	animation: zb-stats-pulse 1.15s ease-in-out infinite;
}

.zb-stats__skel--icon {
	width: 1.6rem;
	height: 1.6rem;
	border-radius: 0.45rem;
}

.zb-stats__skel--num {
	width: 4.2rem;
	height: 1.35rem;
	margin-top: 1rem;
}

.zb-stats__skel--label {
	width: 6.5rem;
	height: 0.7rem;
	margin-top: 0.55rem;
}

@keyframes zb-stats-in {
	from {
		opacity: 0;
		transform: translateY(12px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes zb-stats-pulse {
	0%,
	100% {
		opacity: 1;
	}
	50% {
		opacity: 0.45;
	}
}

@media (min-width: 1024px) {
	.zb-stats__layout {
		grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
		gap: 2.5rem 3rem;
	}

	.zb-stats__copy {
		text-align: start;
		margin-inline: 0;
		max-width: 26rem;
	}

	.zb-stats__board,
	.zb-stats__col {
		gap: 1.15rem;
	}

	.zb-stats__col--offset {
		margin-top: 2.75rem;
	}

	.zb-stats__icon {
		width: 1.85rem;
		height: 1.85rem;
	}
}

@media (prefers-reduced-motion: reduce) {
	.zb-stats__card,
	.zb-stats__board.is-in .zb-stats__card,
	.zb-stats__skel {
		animation: none !important;
		opacity: 1;
		transform: none;
	}
}
</style>
