<template>
    <MasterPage>
        <div class="mx-2 md:mx-14 space-y-28 py-20">
            <section class="max-w-screen-xl mx-auto">
                <div class="grid grid-cols-12 gap-6 sm:gap-8 py-4 items-center min-w-0">
                    <div class="col-span-12 md:col-span-7 lg:col-span-6 order-1 md:order-0 flex flex-col justify-center text-center md:text-start min-w-0">
                        <div class="cert-hero-badge mx-auto md:mx-0 mb-2">
                            <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-14 h-14">
                                <circle cx="28" cy="28" r="28" fill="url(#heroBadgeBg)" />
                                <path d="M28 14L32.5 22.5H42L34.5 28.5L37 38L28 32.5L19 38L21.5 28.5L14 22.5H23.5L28 14Z" fill="#FACC15" stroke="#CA8A04" stroke-width="1.2" stroke-linejoin="round" />
                                <circle cx="28" cy="28" r="22" stroke="#FDE047" stroke-width="1" stroke-opacity="0.35" />
                                <defs>
                                    <radialGradient id="heroBadgeBg" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(18 12) rotate(55) scale(44)">
                                        <stop stop-color="#422006" />
                                        <stop offset="1" stop-color="#1C1917" />
                                    </radialGradient>
                                </defs>
                            </svg>
                        </div>

                        <h1 class="mt-4 mb-3 text-xl sm:text-2xl font-extrabold text-gray-700 dark:text-white md:text-4xl break-words px-1">
                            {{ $t('cert.guide.hero.title') }}
                        </h1>
                        <div class="mb-6">
                            <div class="flex justify-center md:justify-start">
                                <span class="inline-block w-40 h-1 bg-yellow-400 rounded-full"></span>
                                <span class="inline-block w-3 h-1 mx-1 bg-yellow-400 rounded-full"></span>
                                <span class="inline-block w-1 h-1 bg-yellow-400 rounded-full"></span>
                            </div>
                        </div>

                        <div class="bg-white dark:bg-gray-900 rounded-xl px-4 py-4 sm:p-4 relative overflow-hidden">
                            <i class="hidden sm:flex w-1 h-16 bg-yellow-400 absolute start-0 rounded-se-full rounded-ee-full top-1/2 transform -translate-y-1/2"></i>
                            <p class="text-gray-500 dark:text-gray-400 text-sm sm:text-base leading-7 sm:leading-8 break-words">{{ $t('cert.guide.hero.desc') }}</p>
                            <i class="hidden sm:flex w-1 h-16 bg-yellow-400 absolute end-0 rounded-es-full rounded-ss-full top-1/2 transform -translate-y-1/2"></i>
                        </div>
                    </div>

                    <div class="col-span-12 md:col-span-5 lg:col-span-6 order-0 md:order-1 flex justify-center items-center min-w-0 px-1 sm:px-0">
                        <div class="cert-hero-visual relative w-full max-w-lg mx-auto">
                            <div class="cert-hero-frame relative overflow-hidden rounded-2xl border border-gray-200/80 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 sm:p-5 shadow-sm">
                                <div class="relative rounded-xl overflow-hidden bg-white dark:bg-gray-950/60">
                                    <SeoImage
                                        priority
                                        img-class="w-full h-auto object-contain"
                                        :src="certificate_template"
                                        :alt="$t('cert.guide.preview.title')"
                                    />
                                </div>

                                <div class="mt-3 sm:mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-amber-700/80 dark:text-yellow-400/80">
                                    <span class="inline-flex h-2 w-2 rounded-full bg-yellow-400"></span>
                                    {{ $t('cert.guide.preview.title') }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section class="max-w-screen-xl mx-auto">
                <div class="mt-16 grid divide-x rtl:divide-x-reverse divide-y divide-gray-100 dark:divide-gray-700 rounded-3xl border border-gray-100 text-gray-600 dark:border-gray-700 sm:grid-cols-2 lg:grid-cols-4 lg:divide-y-0">
                    <div
                        v-for="feature in features"
                        :key="feature.id"
                        class="group relative bg-white dark:bg-gray-900/40 transition hover:z-[1] hover:shadow-2xl hover:shadow-yellow-500/5"
                    >
                        <div class="relative space-y-5 sm:space-y-6 py-8 sm:py-10 px-5 sm:p-8">
                            <div
                                class="cert-feature-icon relative w-14 h-14 rounded-2xl flex items-center justify-center transition duration-300 group-hover:scale-110 group-hover:-translate-y-0.5"
                                :class="feature.iconWrap"
                            >
                                <div class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur-md" :class="feature.glow"></div>
                                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="relative w-8 h-8">
                                    <template v-if="feature.id === 'online'">
                                        <rect x="4" y="7" width="24" height="16" rx="3" fill="currentColor" fill-opacity="0.15" :class="feature.iconColor" />
                                        <path d="M4 11H28" :stroke="feature.stroke" stroke-width="1.5" stroke-linecap="round" />
                                        <circle cx="7" cy="9" r="1" :fill="feature.stroke" />
                                        <circle cx="10" cy="9" r="1" :fill="feature.stroke" />
                                        <path d="M13 18L16 21L22 15" :stroke="feature.stroke" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </template>
                                    <template v-else-if="feature.id === 'technical'">
                                        <path d="M16 4L26 10V18C26 23 21.5 26.5 16 28C10.5 26.5 6 23 6 18V10L16 4Z" fill="currentColor" fill-opacity="0.15" :class="feature.iconColor" />
                                        <path d="M16 4L26 10V18C26 23 21.5 26.5 16 28C10.5 26.5 6 23 6 18V10L16 4Z" :stroke="feature.stroke" stroke-width="1.8" stroke-linejoin="round" />
                                        <path d="M12 16L15 19L21 13" :stroke="feature.stroke" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </template>
                                    <template v-else-if="feature.id === 'verify'">
                                        <circle cx="16" cy="16" r="12" fill="currentColor" fill-opacity="0.12" :class="feature.iconColor" />
                                        <circle cx="16" cy="16" r="12" :stroke="feature.stroke" stroke-width="1.8" />
                                        <path d="M11 16L14.5 19.5L21 13" :stroke="feature.stroke" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M16 6V8M16 24V26M6 16H8M24 16H26" :stroke="feature.stroke" stroke-width="1.5" stroke-linecap="round" opacity="0.45" />
                                    </template>
                                    <template v-else>
                                        <path d="M16 4V20M16 20L10 14M16 20L22 14" :stroke="feature.stroke" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M6 24H26" :stroke="feature.stroke" stroke-width="2" stroke-linecap="round" />
                                        <rect x="8" y="26" width="16" height="2" rx="1" fill="currentColor" fill-opacity="0.2" :class="feature.iconColor" />
                                    </template>
                                </svg>
                            </div>

                            <div class="space-y-2">
                                <h2 class="text-xl font-semibold text-gray-700 dark:text-white transition group-hover:text-yellow-500">
                                    {{ $t(feature.titleKey) }}
                                </h2>
                                <p class="text-gray-600 dark:text-gray-300 break-words">{{ $t(feature.descKey) }}</p>
                            </div>

                            <a
                                v-if="feature.link"
                                :href="feature.link"
                                v-smooth-scroll
                                class="flex items-center justify-between group-hover:text-yellow-500 transition"
                            >
                                <span class="text-sm">{{ $t('cert.guide.readMore') }}</span>
                                <svg viewBox="0 0 24 24" fill="none" class="w-5 h-5 -translate-x-4 rtl:translate-x-4 rtl:rotate-180 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                                    <circle cx="12" cy="12" r="10" fill="currentColor" fill-opacity="0.12" />
                                    <path d="M10 8L14 12L10 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </a>
                            <router-link
                                v-else-if="feature.route"
                                :to="feature.route"
                                class="flex items-center justify-between group-hover:text-yellow-500 transition"
                            >
                                <span class="text-sm">{{ $t('cert.guide.readMore') }}</span>
                                <svg viewBox="0 0 24 24" fill="none" class="w-5 h-5 -translate-x-4 rtl:translate-x-4 rtl:rotate-180 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                                    <circle cx="12" cy="12" r="10" fill="currentColor" fill-opacity="0.12" />
                                    <path d="M10 8L14 12L10 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </router-link>
                        </div>
                    </div>
                </div>
            </section>
            <section id="how-to-get" class="max-w-screen-md mx-auto">
                <div class="mb-10 flex flex-col items-center text-center">
                    <div class="cert-section-icon mb-4">
                        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-12 h-12">
                            <rect x="6" y="8" width="36" height="32" rx="6" fill="#FEF9C3" stroke="#EAB308" stroke-width="2" />
                            <path d="M14 18H34M14 24H28M14 30H32" stroke="#CA8A04" stroke-width="2" stroke-linecap="round" />
                            <circle cx="36" cy="12" r="8" fill="#FACC15" stroke="#CA8A04" stroke-width="1.5" />
                            <path d="M33 12L35 14L39 10" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                    <h2 class="text-gray-800 text-2xl md:text-3xl dark:text-white font-extrabold tracking-wide mb-4">
                        {{ $t('cert.guide.how.title') }}
                    </h2>
                    <div class="mb-4">
                        <div class="flex justify-center">
                            <span class="inline-block w-24 h-1 bg-yellow-400 rounded-full"></span>
                            <span class="inline-block w-3 h-1 mx-1 bg-yellow-400 rounded-full"></span>
                            <span class="inline-block w-1 h-1 bg-yellow-400 rounded-full"></span>
                        </div>
                    </div>
                    <p class="text-gray-500 dark:text-gray-400 md:text-lg text-base md:leading-8 leading-7 max-w-2xl">
                        {{ $t('cert.guide.how.desc') }}
                    </p>
                    </div>

                <div class="border-2 border-gray-200 dark:border-gray-300/30 rounded-xl p-3 md:p-6">
                    <!-- Mobile: vertical timeline -->
                    <div class="md:hidden cert-steps-mobile">
                        <div
                            v-for="(step, index) in steps"
                            :key="'mobile-' + step.labelKey"
                            class="cert-step-mobile-row flex gap-3 min-w-0"
                        >
                            <div class="cert-step-mobile-rail flex flex-col items-center shrink-0 pt-1">
                                <div
                                    class="cert-step-mobile-dot flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold text-white shadow-sm"
                                    :style="{ backgroundColor: step.badgeFill }"
                                >
                                    {{ index + 1 }}
                                </div>
                                <div
                                    v-if="index + 1 !== steps.length"
                                    class="cert-step-mobile-line flex-1 w-px min-h-6 my-1 border-s-2 border-dashed"
                                    :style="{ borderColor: step.badgeFill + '55' }"
                                ></div>
                            </div>

                            <div
                                class="cert-step-mobile-card flex-1 min-w-0 mb-4 last:mb-0 bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm"
                            >
                                <div class="h-1 w-full bg-gradient-to-r" :class="step.accentBar"></div>
                                <div class="p-3">
                                    <p
                                        class="text-xs font-bold uppercase mb-1.5"
                                        :style="{ color: step.badgeFill }"
                                    >
                                        {{ $t(step.labelKey) }}
                                    </p>
                                    <h3 class="text-base font-bold text-gray-800 dark:text-white mb-2 break-words">
                                        {{ $t(step.titleKey) }}
                                    </h3>
                                    <p class="font-medium text-sm text-gray-500 dark:text-gray-400 break-words leading-7">
                                        {{ $t(step.descriptionKey) }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Desktop: zigzag timeline -->
                    <div class="hidden md:block">
                    <div v-for="(step, index) in steps" :key="step.labelKey">
                        <div class="flex flex-row" :class="[index % 2 === 0 ? 'flex-row' : 'flex-row-reverse']">
                            <div class="hidden md:flex flex-col items-center">
                                <div
                                    class="w-32 py-3 bg-white dark:bg-gray-900 rounded-xl flex flex-col items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800"
                                    :class="[index % 2 === 0 ? 'me-4' : 'ms-4']"
                                >
                                    <div class="cert-step-badge mb-1.5" :class="step.badgeClass">
                                        <svg viewBox="0 0 40 40" fill="none" class="w-10 h-10">
                                            <circle cx="20" cy="20" r="18" :fill="step.badgeFill" :stroke="step.badgeStroke" stroke-width="2" />
                                            <text x="20" y="25" text-anchor="middle" fill="white" font-size="14" font-weight="700" font-family="system-ui, sans-serif">{{ index + 1 }}</text>
                                        </svg>
                                    </div>
                                    <span class="text-xs font-bold uppercase text-gray-600 dark:text-gray-300 px-2 text-center leading-5">
                                        {{ $t(step.labelKey) }}
                                    </span>
                                </div>
                                <div v-if="index + 1 !== steps.length" class="h-full border-transparent" :class="[index % 2 === 0 ? 'border-s-4' : 'border-e-4']">
                                    <div class="h-full border-yellow-400/40 dark:border-yellow-400/20" :class="[index % 2 === 0 ? 'border-e-4 me-4' : 'border-s-4 ms-4']"></div>
                                </div>
                            </div>
                            <div class="flex-auto bg-white dark:bg-gray-900 rounded-xl overflow-hidden">
                                <div class="flex md:flex-row flex-col">
                                    <div class="hidden sm:flex items-center justify-center w-16 shrink-0 bg-gradient-to-b opacity-80" :class="step.accentBar">
                                        <svg viewBox="0 0 24 24" fill="none" class="w-7 h-7 text-white/90">
                                            <path :d="step.iconPath" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                                            <path v-if="step.iconPath2" :d="step.iconPath2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                    <div class="flex-auto">
                                        <h3 class="p-3 text-base sm:text-lg font-bold text-gray-800 dark:text-yellow-400 break-words">{{ $t(step.titleKey) }}</h3>
                                        <p class="px-3 pb-5 sm:pb-6 font-medium text-sm sm:text-base text-gray-500 dark:text-gray-400 break-words leading-7">{{ $t(step.descriptionKey) }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="index + 1 !== steps.length" class="hidden md:flex items-start" :class="[index % 2 === 0 ? 'flex-row' : 'flex-row-reverse']">
                            <div class="border-t-4 border-transparent" :class="[index % 2 === 0 ? 'border-e-4' : 'border-s-4']">
                                <div class="w-16 h-6 border-yellow-400/50 dark:border-yellow-400/25 border-dashed border-b-4" :class="[index % 2 === 0 ? 'ms-16 border-s-4 rounded-es-full' : 'me-16 border-e-4 rounded-ee-full']"></div>
                            </div>
                            <div class="border-t-4 border-transparent flex-auto">
                                <div class="h-6 border-b-4 border-yellow-400/30 dark:border-yellow-400/15"></div>
                            </div>
                            <div class="w-16 mt-6 h-6 border-yellow-400/50 dark:border-yellow-400/25 border-dashed border-t-4" :class="[index % 2 === 0 ? 'me-16 border-e-4 rounded-se-full' : 'ms-16 border-s-4 rounded-ss-full']"></div>
                        </div>
                    </div>
                    </div>
                </div>
            </section>
            <section class="max-w-screen-lg mx-auto">
                <div class="">
                    <div class="cert-cta-card relative overflow-hidden rounded-3xl border border-yellow-400/20 bg-white dark:bg-gray-900 shadow-lg dark:shadow-black/30">
                        <div class="absolute inset-y-0 start-0 w-1.5 bg-gradient-to-b from-yellow-300 via-yellow-400 to-amber-500"></div>
                        <svg class="absolute -top-8 -end-8 w-40 h-40 opacity-[0.06] dark:opacity-[0.1] text-yellow-500 pointer-events-none" viewBox="0 0 56 56" fill="currentColor" aria-hidden="true">
                            <path d="M28 14L32.5 22.5H42L34.5 28.5L37 38L28 32.5L19 38L21.5 28.5L14 22.5H23.5L28 14Z" />
                        </svg>

                        <div class="relative p-4 sm:p-6 md:p-10 ps-5 sm:ps-8 md:ps-12 min-w-0">
                            <div class="md:grid md:grid-cols-12 md:gap-10 items-center min-w-0">
                                <div class="md:col-span-7 text-center md:text-start mb-6 sm:mb-8 md:mb-0 min-w-0">
                                    <div class="inline-flex items-center gap-2 rounded-full bg-yellow-400/15 px-3 py-1 text-xs font-bold text-amber-700 dark:text-yellow-300 mb-5">
                                        <svg viewBox="0 0 20 20" fill="none" class="w-4 h-4">
                                            <circle cx="10" cy="10" r="7.5" stroke="currentColor" stroke-width="1.5" />
                                            <path d="M7 10L9 12L13 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                        {{ $t('cert.guide.cta.badge') }}
                                    </div>

                                    <h2 class="text-xl sm:text-2xl md:text-[2rem] leading-tight font-extrabold text-gray-900 dark:text-white mb-3 sm:mb-4 tracking-tight break-words">
                                        {{ $t('cert.guide.cta.title') }}
                                    </h2>
                                    <p class="text-gray-600 dark:text-gray-300 text-sm sm:text-base md:text-lg leading-7 sm:leading-8 md:leading-9 font-medium max-w-xl mx-auto md:mx-0 break-words">
                                        {{ $t('cert.guide.cta.desc') }}
                                    </p>
                                </div>

                                <div class="md:col-span-5 flex flex-col gap-3 min-w-0 w-full">
                                    <router-link
                                        :to="{ name: 'verify-certificate' }"
                                        class="cert-cta-btn cert-cta-btn-primary group"
                                    >
                                        <span class="cert-cta-btn-icon">
                                            <svg viewBox="0 0 24 24" fill="none" class="w-5 h-5">
                                                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" />
                                                <path d="M8.5 12L11 14.5L16 9.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </span>
                                        <span class="flex-1 text-start min-w-0 break-words leading-6">{{ $t('cert.guide.cta.verify') }}</span>
                                        <svg class="w-4 h-4 opacity-60 transition group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 rtl:rotate-180" viewBox="0 0 24 24" fill="none">
                                            <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </router-link>

                                    <router-link
                                        :to="{ name: 'courses' }"
                                        class="cert-cta-btn cert-cta-btn-secondary group"
                                    >
                                        <span class="cert-cta-btn-icon cert-cta-btn-icon-muted">
                                            <svg viewBox="0 0 24 24" fill="none" class="w-5 h-5">
                                                <rect x="4" y="5" width="16" height="13" rx="2" stroke="currentColor" stroke-width="1.8" />
                                                <path d="M4 10H20" stroke="currentColor" stroke-width="1.8" />
                                                <path d="M9 14H15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                                            </svg>
                                        </span>
                                        <span class="flex-1 text-start min-w-0 break-words leading-6">{{ $t('cert.guide.cta.courses') }}</span>
                                    </router-link>

                                    <router-link
                                        v-if="isLoggedIn"
                                        :to="{ name: 'panel-certifications' }"
                                        class="cert-cta-btn cert-cta-btn-outline group"
                                    >
                                        <span class="cert-cta-btn-icon cert-cta-btn-icon-outline">
                                            <svg viewBox="0 0 24 24" fill="none" class="w-5 h-5">
                                                <path d="M7 5H17V19H7V5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                                                <path d="M10 3H14V5H10V3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                                                <circle cx="12" cy="13" r="2.5" stroke="currentColor" stroke-width="1.8" />
                                            </svg>
                                        </span>
                                        <span class="flex-1 text-start min-w-0 break-words leading-6">{{ $t('cert.guide.cta.panel') }}</span>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
            </section>
        </div>
    </MasterPage>
</template>

<script>
import certificate_template from '@/assets/image/certificate/certificate-template.svg'
import MasterPage from '@/views/page/layouts/MasterPage.vue';
import { useSEO } from '@/composables/useSEO';
import { mapState } from "@/composables/useStore";
import SeoImage from '@/views/components/seo/SeoImage.vue';

const STEP_STYLES = [
    {
        badgeFill: '#EAB308',
        badgeStroke: '#CA8A04',
        badgeClass: 'cert-step-1',
        accentBar: 'from-yellow-400 to-amber-500',
        iconPath: 'M12 6H20M12 10H20M8 6V18M16 6V18',
        iconPath2: 'M6 18H22',
    },
    {
        badgeFill: '#0EA5E9',
        badgeStroke: '#0284C7',
        badgeClass: 'cert-step-2',
        accentBar: 'from-sky-400 to-blue-500',
        iconPath: 'M8 7L16 12L8 17V7Z',
        iconPath2: 'M5 5H19V19H5V5Z',
    },
    {
        badgeFill: '#10B981',
        badgeStroke: '#059669',
        badgeClass: 'cert-step-3',
        accentBar: 'from-emerald-400 to-green-500',
        iconPath: 'M6 12L10 16L18 8',
        iconPath2: 'M4 6H20V20H4V6Z',
    },
    {
        badgeFill: '#8B5CF6',
        badgeStroke: '#7C3AED',
        badgeClass: 'cert-step-4',
        accentBar: 'from-violet-400 to-purple-500',
        iconPath: 'M10 14L14 10M14 10V14M14 10H10',
        iconPath2: 'M6 6H18V18H6V6Z',
    },
];

export default {
    components: {
        MasterPage,
        SeoImage,
    },
    computed: {
        ...mapState({
            isLoggedIn: (state) => state.auth.status.loggedIn,
        }),
        features() {
            return [
                {
                    id: 'online',
                    titleKey: 'cert.guide.types.online.title',
                    descKey: 'cert.guide.types.online.desc',
                    iconWrap: 'bg-gradient-to-br from-yellow-400/20 to-amber-500/10 ring-1 ring-yellow-400/30',
                    iconColor: 'text-yellow-500',
                    stroke: '#EAB308',
                    glow: 'bg-yellow-400/40',
                    link: '#how-to-get',
                },
                {
                    id: 'technical',
                    titleKey: 'cert.guide.types.technical.title',
                    descKey: 'cert.guide.types.technical.desc',
                    iconWrap: 'bg-gradient-to-br from-emerald-400/20 to-green-500/10 ring-1 ring-emerald-400/30',
                    iconColor: 'text-emerald-500',
                    stroke: '#10B981',
                    glow: 'bg-emerald-400/40',
                    link: '#how-to-get',
                },
                {
                    id: 'verify',
                    titleKey: 'cert.guide.types.verify.title',
                    descKey: 'cert.guide.types.verify.desc',
                    iconWrap: 'bg-gradient-to-br from-sky-400/20 to-blue-500/10 ring-1 ring-sky-400/30',
                    iconColor: 'text-sky-500',
                    stroke: '#0EA5E9',
                    glow: 'bg-sky-400/40',
                    route: { name: 'verify-certificate' },
                },
                {
                    id: 'download',
                    titleKey: 'cert.guide.types.download.title',
                    descKey: 'cert.guide.types.download.desc',
                    iconWrap: 'bg-gradient-to-br from-violet-400/20 to-purple-500/10 ring-1 ring-violet-400/30',
                    iconColor: 'text-violet-500',
                    stroke: '#8B5CF6',
                    glow: 'bg-violet-400/40',
                    route: this.isLoggedIn ? { name: 'panel-certifications' } : { name: 'courses' },
                },
            ];
        },
        steps() {
            const base = [
                {
                    labelKey: 'cert.guide.steps.step1.label',
                    titleKey: 'cert.guide.steps.step1.title',
                    descriptionKey: 'cert.guide.steps.step1.description',
                },
                {
                    labelKey: 'cert.guide.steps.step2.label',
                    titleKey: 'cert.guide.steps.step2.title',
                    descriptionKey: 'cert.guide.steps.step2.description',
                },
                {
                    labelKey: 'cert.guide.steps.step3.label',
                    titleKey: 'cert.guide.steps.step3.title',
                    descriptionKey: 'cert.guide.steps.step3.description',
                },
                {
                    labelKey: 'cert.guide.steps.step4.label',
                    titleKey: 'cert.guide.steps.step4.title',
                    descriptionKey: 'cert.guide.steps.step4.description',
                },
            ];
            return base.map((step, index) => ({ ...step, ...STEP_STYLES[index] }));
        },
    },
    mounted() {
        useSEO({
            title: this.$t('cert.seo.title'),
            description: this.$t('cert.seo.description'),
            url: '/what-is-certification',
            keywords: ['گواهی', 'گواهینامه', 'گواهی پایان دوره', 'certificate', 'گواهی زنبورک', 'گواهی معتبر'],
            noindex: false,
        });
    },
};
</script>

<style scoped>
.cert-hero-badge {
    animation: cert-badge-pulse 3s ease-in-out infinite;
}

.cert-cta-card {
    font-family: inherit;
}

.cert-cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    min-height: 3.25rem;
    padding: 0.75rem 0.875rem;
    border-radius: 1rem;
    font-size: 0.875rem;
    font-weight: 700;
    line-height: 1.4;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}

@media (min-width: 640px) {
    .cert-cta-btn {
        padding: 0.75rem 1rem;
        font-size: 0.9375rem;
    }
}

.cert-guide-page {
    width: 100%;
    box-sizing: border-box;
}

.cert-hero-visual img {
    max-width: 100%;
    height: auto;
}

.cert-steps-mobile .cert-step-mobile-row:last-child .cert-step-mobile-card {
    margin-bottom: 0;
}

.cert-cta-btn:active {
    transform: translateY(1px);
}

.cert-cta-btn-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 0.75rem;
    flex-shrink: 0;
}

.cert-cta-btn-primary {
    color: #1c1917;
    background: linear-gradient(135deg, #fde047 0%, #facc15 45%, #eab308 100%);
    box-shadow: 0 10px 24px -10px rgba(234, 179, 8, 0.9);
}

.cert-cta-btn-primary:hover {
    box-shadow: 0 14px 28px -10px rgba(234, 179, 8, 1);
}

.cert-cta-btn-primary .cert-cta-btn-icon {
    background: rgba(255, 255, 255, 0.35);
}

.cert-cta-btn-secondary {
    color: #374151;
    background: #f9fafb;
    border: 1px solid rgba(209, 213, 219, 0.9);
}

:global(.dark) .cert-cta-btn-secondary {
    color: #f3f4f6;
    background: rgba(31, 41, 55, 0.85);
    border-color: rgba(75, 85, 99, 0.8);
}

.cert-cta-btn-secondary:hover {
    background: #f3f4f6;
}

:global(.dark) .cert-cta-btn-secondary:hover {
    background: rgba(55, 65, 81, 0.95);
}

.cert-cta-btn-secondary .cert-cta-btn-icon-muted {
    background: rgba(234, 179, 8, 0.12);
    color: #ca8a04;
}

.cert-cta-btn-outline {
    color: #a16207;
    background: transparent;
    border: 1.5px solid rgba(234, 179, 8, 0.45);
}

:global(.dark) .cert-cta-btn-outline {
    color: #facc15;
    border-color: rgba(250, 204, 21, 0.35);
}

.cert-cta-btn-outline:hover {
    background: rgba(250, 204, 21, 0.08);
}

.cert-cta-btn-outline .cert-cta-btn-icon-outline {
    background: rgba(250, 204, 21, 0.12);
}

.cert-cta-btn:hover .cert-cta-btn-icon svg {
    transform: scale(1.08);
}

.cert-cta-btn-icon svg {
    transition: transform 0.2s ease;
}

@keyframes cert-badge-pulse {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.05);
    }
}

.cert-feature-icon {
    box-shadow: 0 8px 24px -8px rgba(0, 0, 0, 0.15);
}

:global(.dark) .cert-feature-icon {
    box-shadow: 0 8px 24px -8px rgba(0, 0, 0, 0.45);
}

@media (prefers-reduced-motion: reduce) {
    .cert-hero-badge {
        animation: none;
    }
}
</style>
