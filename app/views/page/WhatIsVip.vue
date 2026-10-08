<template>
    <MasterPage>
        <div class="relative overflow-hidden">
            <!-- Decorative background glow -->
            <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div class="absolute -top-40 start-1/2 -translate-x-1/2 h-[38rem] w-[38rem] rounded-full bg-amber-300/30 dark:bg-amber-500/10 blur-3xl"></div>
                <div class="absolute top-1/3 -end-40 h-96 w-96 rounded-full bg-yellow-200/40 dark:bg-yellow-500/5 blur-3xl"></div>
                <div class="absolute bottom-0 -start-40 h-96 w-96 rounded-full bg-orange-200/30 dark:bg-orange-500/5 blur-3xl"></div>
            </div>

            <div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">

                <!-- ===================== HERO ===================== -->
                <section class="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 pt-16 pb-20 md:pt-24">
                    <div class="text-center lg:text-start">
                        <span class="inline-flex items-center gap-2 rounded-full border border-amber-300/60 dark:border-amber-500/30 bg-amber-100/70 dark:bg-amber-500/10 px-4 py-1.5 text-sm font-bold text-amber-700 dark:text-amber-300">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path fill-rule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z" clip-rule="evenodd"></path>
                            </svg>
                            {{ $t('vip.benefits.subtitle') }}
                        </span>

                        <h1 class="mt-6 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-gray-800 dark:text-white">
                            {{ $t('vip.about.title') }}
                        </h1>

                        <p class="mt-6 mx-auto lg:mx-0 max-w-xl text-base md:text-lg leading-8 text-gray-500 dark:text-gray-400 font-medium">
                            {{ $t('vip.about.desc') }}
                        </p>

                        <div class="mt-9 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                            <a href="#plans-list"
                                class="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 px-7 py-3.5 text-base font-bold text-gray-900 shadow-lg shadow-amber-500/30 transition hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-0.5">
                                {{ $t('vip.plans.title') }}
                                <svg class="w-5 h-5 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </a>
                            <a href="#why-vip"
                                class="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 px-7 py-3.5 text-base font-bold text-gray-700 dark:text-gray-200 backdrop-blur transition hover:bg-white dark:hover:bg-gray-800">
                                {{ $t('vip.benefits.subtitle') }}
                            </a>
                        </div>
                    </div>

                    <!-- Hero visual -->
                    <div class="relative">
                        <div class="relative mx-auto max-w-md rounded-[2.5rem] border border-white/60 dark:border-white/10 bg-white/60 dark:bg-gray-800/40 p-8 shadow-2xl shadow-amber-500/10 backdrop-blur">
                            <div class="flex items-center justify-center">
                                <div class="relative flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 shadow-xl shadow-amber-500/40">
                                    <svg class="h-20 w-20 text-white" viewBox="0 0 24 24" fill="currentColor">
                                        <path fill-rule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z" clip-rule="evenodd"></path>
                            </svg>
                                </div>
                            </div>
                            <div class="mt-8 space-y-3">
                                <div class="flex items-center gap-3 rounded-2xl bg-white/80 dark:bg-gray-900/50 px-4 py-3 shadow-sm">
                                    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400">
                                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                    </span>
                                    <span class="text-sm font-bold text-gray-700 dark:text-gray-200">{{ $t('vip.card1.title') }}</span>
                                </div>
                                <div class="flex items-center gap-3 rounded-2xl bg-white/80 dark:bg-gray-900/50 px-4 py-3 shadow-sm">
                                    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-orange-500">
                                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                    </span>
                                    <span class="text-sm font-bold text-gray-700 dark:text-gray-200">{{ $t('vip.card2.title') }}</span>
                                </div>
                                <div class="flex items-center gap-3 rounded-2xl bg-white/80 dark:bg-gray-900/50 px-4 py-3 shadow-sm">
                                    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/15 text-green-600 dark:text-green-400">
                                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                    </span>
                                    <span class="text-sm font-bold text-gray-700 dark:text-gray-200">{{ $t('vip.card3.title') }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- ===================== WHY VIP ===================== -->
                <section id="why-vip" class="scroll-mt-24 py-16">
                    <div class="text-center max-w-2xl mx-auto">
                        <h2 class="text-2xl md:text-4xl font-extrabold text-gray-800 dark:text-white">
                            {{ $t('vip.why.before') }}
                            <span class="relative mx-1 inline-block">
                                <span class="relative z-10 text-amber-500">{{ $t('vip.why.highlight') }}</span>
                                <span class="absolute inset-x-0 bottom-1 h-3 bg-amber-400/40 dark:bg-amber-400/25 -z-0 rounded"></span>
                            </span>
                            {{ $t('vip.why.after') }}
                        </h2>
                    </div>

                    <div class="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <!-- Card 1 -->
                        <div class="group relative rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/10">
                            <span class="absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 transition group-hover:opacity-100"></span>
                            <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 transition group-hover:scale-110">
                                <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                            </div>
                            <h3 class="mt-6 text-xl font-extrabold text-gray-800 dark:text-white">{{ $t('vip.card1.title') }}</h3>
                            <p class="mt-3 text-sm leading-7 text-gray-500 dark:text-gray-400 font-medium" v-html="$t('vip.card1.desc')"></p>
                        </div>

                        <!-- Card 2 -->
                        <div class="group relative rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-orange-500/10">
                            <span class="absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-amber-400 to-orange-500 opacity-0 transition group-hover:opacity-100"></span>
                            <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 transition group-hover:scale-110">
                                <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none">
                                    <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                            </div>
                            <h3 class="mt-6 text-xl font-extrabold text-gray-800 dark:text-white">{{ $t('vip.card2.title') }}</h3>
                            <p class="mt-3 text-sm leading-7 text-gray-500 dark:text-gray-400 font-medium" v-html="$t('vip.card2.desc')"></p>
                        </div>

                        <!-- Card 3 -->
                        <div class="group relative rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-green-500/10">
                            <span class="absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-green-400 to-emerald-600 opacity-0 transition group-hover:opacity-100"></span>
                            <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 text-green-600 dark:text-green-400 transition group-hover:scale-110">
                                <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6l-8-4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                                    <path d="m9 12 2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                            </div>
                            <h3 class="mt-6 text-xl font-extrabold text-gray-800 dark:text-white">{{ $t('vip.card3.title') }}</h3>
                            <p class="mt-3 text-sm leading-7 text-gray-500 dark:text-gray-400 font-medium" v-html="$t('vip.card3.desc')"></p>
                        </div>
                    </div>
                </section>

                <!-- ===================== CTA ===================== -->
                <section class="py-12">
                    <div class="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 px-6 py-14 md:px-16 md:py-16 text-center shadow-2xl">
                        <div class="pointer-events-none absolute -top-16 -end-16 h-56 w-56 rounded-full bg-amber-500/20 blur-3xl"></div>
                        <div class="pointer-events-none absolute -bottom-16 -start-16 h-56 w-56 rounded-full bg-yellow-500/10 blur-3xl"></div>

                        <div class="relative mx-auto flex max-w-3xl flex-col items-center">
                            <span class="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-400">
                                <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                                    <path fill-rule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5z" clip-rule="evenodd"></path>
                                </svg>
                            </span>
                            <h2 class="mt-6 text-2xl md:text-4xl font-extrabold text-white">{{ $t('vip.cta.title') }}</h2>
                            <p class="mt-5 text-base leading-8 text-gray-300 font-medium" v-html="$t('vip.cta.desc')"></p>
                            <a href="#plans-list"
                                class="group mt-9 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 px-8 py-3.5 text-base font-bold text-gray-900 shadow-lg shadow-amber-500/30 transition hover:-translate-y-0.5 hover:shadow-xl">
                                {{ $t('vip.plans.title') }}
                                <svg class="w-5 h-5 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </section>

                <!-- ===================== PLANS ===================== -->
                <section id="plans-list" class="scroll-mt-24 pt-8 pb-24">
                    <div class="text-center mb-12">
                        <h2 class="inline-flex items-center gap-3 text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white">
                            <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/15 text-amber-500">
                                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none">
                                    <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L3 13V3h10l7.59 7.59a2 2 0 0 1 0 2.82Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                                    <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor"/>
                                </svg>
                            </span>
                            {{ $t('vip.plans.title') }}
                        </h2>
                    </div>

                    <!-- Loading -->
                        <div v-if="loadPlansLoading"
                        class="flex items-center justify-center gap-3 rounded-2xl border border-dashed border-amber-300 bg-amber-50 dark:bg-amber-400/10 px-4 py-6 font-semibold text-amber-600 dark:text-amber-400">
                        <svg class="w-8 h-8" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="25 25 50 50">
                            <circle class="stroke-current text-amber-500/30" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dasharray="200, 300"></circle>
                            <circle class="stroke-current text-amber-500" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dasharray="100, 200">
                                <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite"></animateTransform>
                                <animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s" repeatCount="indefinite"></animate>
                                <animate attributeName="stroke-dasharray" values="0,200;110,200;110,200" dur="1.25s" repeatCount="indefinite"></animate>
                                </circle>
                            </svg>
                            <p>{{ $t('vip.plans.loading') }}</p>
                        </div>

                        <div v-else>
                        <div v-if="plans && plans.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div v-for="(plan, index) in mergedPlans" :key="index"
                                class="group relative flex flex-col rounded-3xl border bg-white dark:bg-gray-900 p-6 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                                :class="plan.popular ? 'border-amber-400 dark:border-amber-500/60 ring-2 ring-amber-400/40' : 'border-gray-100 dark:border-gray-800'">

                                <!-- Popular ribbon -->
                                <span v-if="plan.popular"
                                    class="absolute -top-3 start-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-1 text-xs font-extrabold text-gray-900 shadow-md">
                                    {{ $t('vip.why.highlight') }}
                                </span>
                                <span v-if="plan.allows_installment"
                                    class="absolute top-3 end-3 rounded-full bg-sky-500/10 px-2.5 py-1 text-[10px] font-bold text-sky-700 ring-1 ring-sky-500/25 dark:text-sky-300">
                                    {{ $t('course.installment.badge') }}
                                </span>

                                <!-- Title -->
                                <h3 class="text-center text-base font-bold text-gray-700 dark:text-gray-100">
                                    {{ $t('vip.plans.subscription', { title: plan.title }) }}
                                </h3>

                                            <!-- Price -->
                                <div class="mx-auto mt-5 mb-7 flex h-16 w-full items-center justify-center rounded-2xl px-4 text-2xl font-bold text-white"
                                                :class="plan.gradient"
                                    :style="{ boxShadow: `0 8px 22px ${plan.shadow}` }">
                                                {{ plan.price.toLocaleString() }}
                                    <svg class="ms-1.5 w-4 h-4" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.14878 6.91843C1.44428 6.91843 1.70285 6.87142 1.92447 6.77739C2.15282 6.68337 2.34422 6.55577 2.49869 6.39458C2.65316 6.2334 2.77069 6.04535 2.85128 5.83044C2.93187 5.62224 2.97888 5.40062 2.99231 5.16556H1.98492C1.6424 5.16556 1.36033 5.12862 1.1387 5.05474C0.917077 4.98087 0.742461 4.87341 0.614858 4.73238C0.487254 4.59134 0.396588 4.42344 0.34286 4.22868C0.295849 4.0272 0.272343 3.80221 0.272343 3.55372C0.272343 3.29852 0.309281 3.05674 0.383156 2.8284C0.457032 2.60005 0.564488 2.39857 0.705523 2.22396C0.846559 2.04934 1.02117 1.91167 1.22937 1.81093C1.44428 1.70347 1.68941 1.64974 1.96477 1.64974C2.1864 1.64974 2.39795 1.68668 2.59943 1.76056C2.80091 1.83443 2.97888 1.95196 3.13335 2.11315C3.28782 2.26761 3.40871 2.47245 3.49601 2.72766C3.59004 2.97615 3.63705 3.27837 3.63705 3.63431V4.47045H4.60415C4.68474 4.47045 4.73847 4.50068 4.76533 4.56112C4.79891 4.61485 4.8157 4.6988 4.8157 4.81297C4.8157 4.93386 4.79891 5.02452 4.76533 5.08497C4.73847 5.13869 4.68474 5.16556 4.60415 5.16556H3.6169C3.60347 5.49464 3.53631 5.80693 3.41542 6.10244C3.30125 6.39794 3.14007 6.65651 2.93187 6.87813C2.72368 7.09976 2.47518 7.27438 2.1864 7.40198C1.89761 7.5363 1.57188 7.60346 1.20922 7.60346H0.141381L0.0809373 6.91843H1.14878ZM0.896929 3.51343C0.896929 3.68133 0.913719 3.82572 0.947299 3.94661C0.987594 4.0675 1.0514 4.16823 1.1387 4.24883C1.23273 4.3227 1.35697 4.37979 1.51144 4.42008C1.66591 4.45366 1.86067 4.47045 2.09573 4.47045H3.00239V3.71491C3.00239 3.21792 2.90501 2.86198 2.71024 2.64707C2.51548 2.43215 2.24684 2.3247 1.90433 2.3247C1.58196 2.3247 1.33347 2.43215 1.15885 2.64707C0.984237 2.86198 0.896929 3.15076 0.896929 3.51343ZM6.26895 4.47045C6.35626 4.47045 6.41335 4.50068 6.44021 4.56112C6.47379 4.61485 6.49058 4.6988 6.49058 4.81297C6.49058 4.93386 6.47379 5.02452 6.44021 5.08497C6.41335 5.13869 6.35626 5.16556 6.26895 5.16556H4.60675C4.51944 5.16556 4.46235 5.13869 4.43549 5.08497C4.40191 5.03124 4.38512 4.94729 4.38512 4.83312C4.38512 4.71223 4.40191 4.62156 4.43549 4.56112C4.46235 4.50068 4.51944 4.47045 4.60675 4.47045H6.26895ZM7.93155 4.47045C8.01886 4.47045 8.07594 4.50068 8.10281 4.56112C8.13639 4.61485 8.15318 4.6988 8.15318 4.81297C8.15318 4.93386 8.13639 5.02452 8.10281 5.08497C8.07594 5.13869 8.01886 5.16556 7.93155 5.16556H6.26935C6.18204 5.16556 6.12495 5.13869 6.09809 5.08497C6.06451 5.03124 6.04772 4.94729 6.04772 4.83312C6.04772 4.71223 6.06451 4.62156 6.09809 4.56112C6.12495 4.50068 6.18204 4.47045 6.26935 4.47045H7.93155ZM9.59415 4.47045C9.68146 4.47045 9.73854 4.50068 9.76541 4.56112C9.79899 4.61485 9.81578 4.6988 9.81578 4.81297C9.81578 4.93386 9.79899 5.02452 9.76541 5.08497C9.73854 5.13869 9.68146 5.16556 9.59415 5.16556H7.93194C7.84464 5.16556 7.78755 5.13869 7.76069 5.08497C7.72711 5.03124 7.71032 4.94729 7.71032 4.83312C7.71032 4.71223 7.72711 4.62156 7.76069 4.56112C7.78755 4.50068 7.84464 4.47045 7.93194 4.47045H9.59415ZM11.2567 4.47045C11.3441 4.47045 11.4011 4.50068 11.428 4.56112C11.4616 4.61485 11.4784 4.6988 11.4784 4.81297C11.4784 4.93386 11.4616 5.02452 11.428 5.08497C11.4011 5.13869 11.3441 5.16556 11.2567 5.16556H9.59454C9.50723 5.16556 9.45015 5.13869 9.42328 5.08497C9.3897 5.03124 9.37291 4.94729 9.37291 4.83312C9.37291 4.71223 9.3897 4.62156 9.42328 4.56112C9.45015 4.50068 9.50723 4.47045 9.59454 4.47045H11.2567ZM12.1638 4.47045C12.4257 4.47045 12.6339 4.39994 12.7884 4.2589C12.9496 4.11787 13.0302 3.9231 13.0302 3.67461V2.2844H13.685V3.67461C13.685 4.15144 13.5506 4.52082 13.282 4.78275C13.0201 5.03795 12.6608 5.16556 12.2041 5.16556H11.2571C11.1698 5.16556 11.1127 5.13869 11.0859 5.08497C11.0523 5.03124 11.0355 4.94729 11.0355 4.83312C11.0355 4.71223 11.0523 4.62156 11.0859 4.56112C11.1127 4.50068 11.1698 4.47045 11.2571 4.47045H12.1638ZM13.7857 0.994934H12.9798V0.279683H13.7857V0.994934ZM12.5063 0.994934H11.7004V0.279683H12.5063V0.994934ZM5.64177 12.9641C5.64177 13.3267 5.58468 13.6659 5.47051 13.9815C5.35634 14.3039 5.1918 14.5826 4.97689 14.8177C4.76198 15.0595 4.50005 15.2509 4.19112 15.3919C3.8889 15.5329 3.54638 15.6035 3.16357 15.6035H2.56921C1.81702 15.6035 1.23273 15.3718 0.816337 14.9084C0.399946 14.445 0.191751 13.8103 0.191751 13.0044V11.2414H0.836485V12.9842C0.836485 13.273 0.870065 13.5349 0.937225 13.77C1.0111 14.0051 1.12191 14.2065 1.26967 14.3744C1.42413 14.549 1.61554 14.6834 1.84388 14.7774C2.07223 14.8714 2.34758 14.9184 2.66995 14.9184H3.1132C3.42885 14.9184 3.70421 14.8647 3.93927 14.7572C4.17433 14.6565 4.36909 14.5188 4.52356 14.3442C4.68474 14.1696 4.80227 13.9648 4.87615 13.7297C4.95674 13.4946 4.99703 13.2495 4.99703 12.9943V10.2844H5.64177V12.9641ZM3.21394 10.0628H2.36773V9.32738H3.21394V10.0628ZM8.24526 13.1656C8.07064 13.1656 7.90274 13.1421 7.74156 13.095C7.58038 13.0413 7.43598 12.954 7.30838 12.8331C7.18749 12.7122 7.09011 12.5544 7.01624 12.3596C6.94236 12.1582 6.90542 11.9097 6.90542 11.6142V6.9197H7.56023V11.4933C7.56023 11.7754 7.62067 12.0104 7.74156 12.1985C7.86916 12.3798 8.074 12.4705 8.35607 12.4705H8.52733C8.67508 12.4705 8.74896 12.5846 8.74896 12.813C8.74896 13.048 8.67508 13.1656 8.52733 13.1656H8.24526ZM8.69324 12.4705C8.95516 12.4705 9.15328 12.4067 9.2876 12.279C9.42192 12.1514 9.48908 11.9802 9.48908 11.7653V11.3825C9.48908 10.7982 9.63683 10.3415 9.93233 10.0124C10.2346 9.68332 10.6509 9.51878 11.1815 9.51878C11.4569 9.51878 11.6986 9.56243 11.9068 9.64974C12.115 9.73705 12.2863 9.8613 12.4206 10.0225C12.5616 10.1837 12.6657 10.3751 12.7329 10.5967C12.8001 10.8183 12.8336 11.0635 12.8336 11.3321C12.8336 11.9097 12.6825 12.3596 12.3803 12.682C12.0781 13.0044 11.6651 13.1656 11.1412 13.1656C10.8726 13.1656 10.614 13.1152 10.3655 13.0144C10.117 12.907 9.92226 12.7189 9.78123 12.4503C9.72078 12.6048 9.64691 12.729 9.5596 12.823C9.47229 12.9171 9.38162 12.9909 9.2876 13.0447C9.19358 13.0917 9.09284 13.1253 8.98538 13.1454C8.88464 13.1588 8.78726 13.1656 8.69324 13.1656H8.53205C8.44475 13.1656 8.38766 13.1387 8.3608 13.085C8.32722 13.0312 8.31043 12.9473 8.31043 12.8331C8.31043 12.7122 8.32722 12.6216 8.3608 12.5611C8.38766 12.5007 8.44475 12.4705 8.53205 12.4705H8.69324ZM12.1889 11.3925C12.1889 11.0433 12.1117 10.7612 11.9572 10.5463C11.8027 10.3247 11.5375 10.2139 11.1614 10.2139C10.4629 10.2139 10.1137 10.6202 10.1137 11.4328C10.1137 11.7754 10.2077 12.0339 10.3957 12.2085C10.5905 12.3831 10.839 12.4705 11.1412 12.4705C11.4837 12.4705 11.7423 12.3764 11.9169 12.1884C12.0982 12.0003 12.1889 11.7351 12.1889 11.3925Z" fill="currentColor"></path>
                                                </svg>
                                            </div>

                                            <!-- Features -->
                                <ul class="mb-8 flex-1 space-y-2.5 text-xs text-gray-500 dark:text-gray-400">
                                    <li v-for="(f, i) in plan.features" :key="i" class="flex items-start gap-2.5">
                                        <span class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                                            :class="plan.gradient">
                                            <svg class="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="none"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                        </span>
                                        <span class="leading-6">{{ f }}</span>
                                                </li>
                                            </ul>

                                        <!-- Button -->
                                <div class="mt-auto">
                                            <router-link :to="{ name: 'login' }" v-if="!loggedIn"
                                        class="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-5 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 transition hover:bg-gray-100 dark:hover:bg-gray-700">
                                        {{ $t('vip.plans.loginToBuy') }}
                                        <svg class="h-4 w-4 rtl:rotate-180" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                            </router-link>

                                    <template v-else>
                                        <button v-if="addToCartLoading[index]" disabled
                                            class="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-5 py-3 text-sm font-bold text-gray-200 opacity-70">
                                            {{ $t('vip.plans.pleaseWait') }}
                                            <svg class="h-5 w-5 animate-spin" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1.90321 7.29677C1.90321 10.341 4.11041 12.4147 6.58893 12.8439C6.87255 12.893 7.06266 13.1627 7.01355 13.4464C6.96444 13.73 6.69471 13.9201 6.41109 13.871C3.49942 13.3668 0.86084 10.9127 0.86084 7.29677C0.860839 5.76009 1.55996 4.55245 2.37639 3.63377C2.96124 2.97568 3.63034 2.44135 4.16846 2.03202L2.53205 2.03202C2.25591 2.03202 2.03205 1.80816 2.03205 1.53202C2.03205 1.25588 2.25591 1.03202 2.53205 1.03202L5.53205 1.03202C5.80819 1.03202 6.03205 1.25588 6.03205 1.53202L6.03205 4.53202C6.03205 4.80816 5.80819 5.03202 5.53205 5.03202C5.25591 5.03202 5.03205 4.80816 5.03205 4.53202L5.03205 2.68645C4.45896 3.11868 3.76059 3.64538 3.15554 4.3262C2.44102 5.13021 1.90321 6.10154 1.90321 7.29677ZM13.0109 7.70321C13.0109 4.69115 10.8505 2.6296 8.40384 2.17029C8.12093 2.11718 7.93465 1.84479 7.98776 1.56188C8.04087 1.27898 8.31326 1.0927 8.59616 1.14581C11.4704 1.68541 14.0532 4.12605 14.0532 7.70321C14.0532 9.23988 13.3541 10.4475 12.5377 11.3662C11.9528 12.0243 11.2837 12.5586 10.7456 12.968L12.3821 12.968C12.6582 12.968 12.8821 13.1918 12.8821 13.468C12.8821 13.7441 12.6582 13.968 12.3821 13.968L9.38205 13.968C9.10591 13.968 8.88205 13.7441 8.88205 13.468L8.88205 10.468C8.88205 10.1918 9.10591 9.96796 9.38205 9.96796C9.65819 9.96796 9.88205 10.1918 9.88205 10.468L9.88205 12.3135C10.4551 11.8813 11.1535 11.3546 11.7585 10.6738C12.4731 9.86976 13.0109 8.89844 13.0109 7.70321Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
                                                    </svg>
                                                </button>
                                                <button v-else @click="addToCart('vip', plan.id, index)"
                                            class="group/btn flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 px-5 py-3 text-sm font-bold text-white transition hover:from-amber-400 hover:to-yellow-500 hover:text-gray-900">
                                            {{ $t('vip.plans.addToCart') }}
                                            <svg class="h-4 w-4 rtl:rotate-180 transition-transform group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                                </button>
                                    </template>
                                </div>
                            </div>
                        </div>

                            <div v-else
                            class="flex items-center justify-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 py-16 text-sm font-semibold text-gray-500 dark:text-gray-400">
                            {{ $t('vip.plans.empty') }}
                        </div>
                    </div>
                </section>

                </div>
        </div>
    </MasterPage>
</template>
<script>
import MasterPage from "@/views/page/layouts/MasterPage.vue";
import axiosInstance from "@/store/axiosInstance";
import { useSEO } from "@/composables/useSEO";
export default {
    components: {
        MasterPage,
    },
    data() {
        return {
            plans: [],
            loadPlansLoading: false,
            addToCartLoading: [],
            colorSchemes: [
                {
                    gradient: "bg-gradient-to-r from-gray-700 to-black",
                    shadow: "rgba(0, 0, 0, 0.6)", // black
                },
                {
                    gradient: "bg-gradient-to-r from-yellow-400 to-yellow-600",
                    shadow: "rgba(202, 138, 4, 0.6)", // yellow
                },
                {
                    gradient: "bg-gradient-to-r from-green-400 to-emerald-600",
                    shadow: "rgba(34, 197, 94, 0.6)", // green
                },
                {
                    gradient: "bg-gradient-to-r from-red-500 to-red-700",
                    shadow: "rgba(239, 68, 68, 0.6)", // red
                },
                {
                    gradient: "bg-gradient-to-r from-purple-500 to-pink-500",
                    shadow: "rgba(168, 85, 247, 0.6)", // pink -> purple
                },
                {
                    gradient: "bg-gradient-to-r from-sky-500 to-blue-600",
                    shadow: "rgba(14, 165, 233, 0.6)", // blue
                },
                {
                    gradient: "bg-gradient-to-r from-orange-400 to-red-500",
                    shadow: "rgba(249, 115, 22, 0.6)", // red -> orange
                },
                {
                    gradient: "bg-gradient-to-r from-green-400 to-emerald-600",
                    shadow: "rgba(34, 197, 94, 0.6)", // green
                },

            ],
        };
    },
    computed: {
        loggedIn() {
            return this.$store.state.auth.status.loggedIn;
        },

        isPlanInCart(id) {
            return this.$store.getters["cart/isItemInCart"]("vip", id);
        },
        mergedPlans() {
            return this.plans.map((plan, index) => {
                const color = this.colorSchemes[index % this.colorSchemes.length];
                return {
                    ...plan,
                    ...color,
                };
            });
        },
    },
    methods: {
        async addToCart(type, itemId, index) {
            this.addToCartLoading[index] = true;
            try {
                await this.$store.dispatch("cart/addToCart", { type, itemId });
            } catch (error) {
                console.error("Error adding to cart:", error);
            } finally {
                this.addToCartLoading[index] = false;
            }
        },
        async getPlansList() {
            try {
                this.loadPlansLoading = true;

                const response = await axiosInstance.post("/get-plans-list");
                this.plans = response.data.plans;
            } catch (error) {
                console.error("Error loading plans:", error);
            } finally {
                this.loadPlansLoading = false;
            }
        },
    },
    mounted() {
        this.getPlansList();
        
        useSEO({
            title: this.$t('vip.seo.title'),
            description: this.$t('vip.seo.description'),
            url: '/what-is-vip',
            keywords: ['عضویت ویژه', 'VIP', 'اشتراک ویژه', 'عضویت زنبورک', 'پلن ویژه', 'اشتراک'],
            noindex: false
        });
    },
};
</script>

<style></style>
