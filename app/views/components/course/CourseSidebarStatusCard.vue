<template>
    <div
        v-if="hasStatus"
        class="status-card group relative mb-4 overflow-hidden rounded-[1.25rem] border border-gray-200/80 bg-white shadow-[0_10px_40px_-12px_rgba(15,23,42,0.1)] dark:border-gray-800 dark:bg-gray-900 dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.55)]">
        <div
            class="status-card__mesh pointer-events-none absolute inset-0"
            :class="theme.mesh"
            aria-hidden="true"></div>
        <div
            class="status-card__glow pointer-events-none absolute -top-12 -end-12 h-32 w-32 rounded-full blur-3xl"
            :class="theme.glow"
            aria-hidden="true"></div>

        <div class="relative p-4">
            <div class="mb-3 flex items-center justify-between gap-3">
                <div class="min-w-0">
                    <p class="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500">
                        {{ $t('course.sidebar.statusCard.label') }}
                    </p>
                    <div class="mt-1.5 inline-flex max-w-full items-center gap-2 rounded-full border px-2.5 py-1" :class="theme.badge">
                        <span class="relative flex h-2 w-2 shrink-0">
                            <span
                                v-if="theme.live"
                                class="status-card__live absolute inline-flex h-full w-full rounded-full opacity-75"
                                :class="theme.dot"></span>
                            <span class="relative inline-flex h-2 w-2 rounded-full" :class="theme.dot"></span>
                        </span>
                        <span class="truncate text-[11px] font-bold">{{ statusTitle }}</span>
                    </div>
                </div>

                <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl border"
                    :class="theme.iconBox">
                    <img
                        v-if="customStatusIcon"
                        :src="customStatusIcon"
                        :alt="statusTitle"
                        class="h-full w-full object-cover"
                        @error="onCustomIconError" />
                    <span v-else class="status-card__icon" v-html="theme.icon"></span>
                </div>
            </div>

            <h3 class="text-[15px] font-bold leading-snug tracking-tight text-gray-900 dark:text-gray-50">
                {{ headline }}
            </h3>
            <p v-if="description" class="mt-2 text-xs leading-6 text-gray-500 dark:text-gray-400">
                {{ description }}
            </p>

            <div
                v-if="formattedStartDate"
                class="mt-4 flex items-center gap-2.5 rounded-2xl border px-3 py-2.5"
                :class="theme.datePanel">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl" :class="theme.dateIcon">
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                            d="M8 2V5M16 2V5M4 9H20M6 5H18C19.1046 5 20 5.89543 20 7V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V7C4 5.89543 4.89543 5 6 5Z"
                            stroke="currentColor"
                            stroke-width="1.8"
                            stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </div>
                <p class="min-w-0 text-xs font-semibold leading-5 tabular-nums" :class="theme.dateText">
                    {{ formattedStartDate }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
const ICONS = {
    ongoing: `<svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 5V19M16 7V19M8 12L12 9.5V14.5L8 12Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    completed: `<svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 12.75L11.25 15 15 9.75M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    upcoming: `<svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 8V12L15 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    presale: `<svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3L14.09 8.26L20 9.27L16 13.14L16.91 19.02L12 16.44L7.09 19.02L8 13.14L4 9.27L9.91 8.26L12 3Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    archive: `<svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7H20M10 11V17M14 11V17M6 7L7 20H17L18 7M9 7V4H15V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    default: `<svg class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path opacity="0.4" d="M2.449 14.97C3.519 18.41 6.399 21.06 9.979 21.79" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2.051 10.98C2.561 5.93 6.821 2 12.001 2C17.181 2 21.441 5.94 21.951 10.98" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.01 21.8C17.58 21.07 20.45 18.45 21.54 15.02" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

const THEMES = {
    ongoing: {
        mesh: 'bg-gradient-to-br from-emerald-500/[0.06] via-transparent to-transparent dark:from-emerald-950/70 dark:via-gray-900 dark:to-gray-900',
        glow: 'bg-emerald-400/15 dark:bg-emerald-600/10',
        badge: 'border-emerald-200/80 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300',
        badgeText: '',
        dot: 'bg-emerald-500 dark:bg-emerald-400',
        live: true,
        iconBox: 'border-emerald-200/70 bg-emerald-50/50 text-emerald-600 dark:border-emerald-500/35 dark:bg-gray-800 dark:text-emerald-400',
        datePanel: 'border-emerald-100/80 bg-emerald-50/40 dark:border-gray-800 dark:bg-gray-800/80',
        dateIcon: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
        dateText: 'text-emerald-900 dark:text-emerald-200',
        icon: ICONS.ongoing,
    },
    completed: {
        mesh: 'bg-gradient-to-br from-indigo-500/[0.06] via-transparent to-transparent dark:from-indigo-950/70 dark:via-gray-900 dark:to-gray-900',
        glow: 'bg-indigo-400/15 dark:bg-indigo-600/10',
        badge: 'border-indigo-200/80 bg-indigo-50 text-indigo-800 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300',
        badgeText: '',
        dot: 'bg-indigo-500 dark:bg-indigo-400',
        live: false,
        iconBox: 'border-indigo-200/70 bg-indigo-50/50 text-indigo-600 dark:border-indigo-500/35 dark:bg-gray-800 dark:text-indigo-400',
        datePanel: 'border-indigo-100/80 bg-indigo-50/40 dark:border-gray-800 dark:bg-gray-800/80',
        dateIcon: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400',
        dateText: 'text-indigo-900 dark:text-indigo-200',
        icon: ICONS.completed,
    },
    upcoming: {
        mesh: 'bg-gradient-to-br from-sky-500/[0.07] via-transparent to-transparent dark:from-sky-950/70 dark:via-gray-900 dark:to-gray-900',
        glow: 'bg-sky-400/18 dark:bg-sky-600/10',
        badge: 'border-sky-200/80 bg-sky-50 text-sky-800 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300',
        badgeText: '',
        dot: 'bg-sky-500 dark:bg-sky-400',
        live: true,
        iconBox: 'border-sky-200/70 bg-sky-50/50 text-sky-600 dark:border-sky-500/35 dark:bg-gray-800 dark:text-sky-400',
        datePanel: 'border-sky-100/80 bg-sky-50/40 dark:border-gray-800 dark:bg-gray-800/80',
        dateIcon: 'bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400',
        dateText: 'text-sky-900 dark:text-sky-200',
        icon: ICONS.upcoming,
    },
    presale: {
        mesh: 'bg-gradient-to-br from-amber-500/[0.07] via-transparent to-transparent dark:from-amber-950/60 dark:via-gray-900 dark:to-gray-900',
        glow: 'bg-amber-400/18 dark:bg-amber-600/10',
        badge: 'border-amber-200/80 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300',
        badgeText: '',
        dot: 'bg-amber-500 dark:bg-amber-400',
        live: false,
        iconBox: 'border-amber-200/70 bg-amber-50/50 text-amber-700 dark:border-amber-500/35 dark:bg-gray-800 dark:text-amber-400',
        datePanel: 'border-amber-100/80 bg-amber-50/40 dark:border-gray-800 dark:bg-gray-800/80',
        dateIcon: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
        dateText: 'text-amber-950 dark:text-amber-200',
        icon: ICONS.presale,
    },
    archive: {
        mesh: 'bg-gradient-to-br from-slate-400/[0.06] via-transparent to-transparent dark:from-slate-800/80 dark:via-gray-900 dark:to-gray-900',
        glow: 'bg-slate-300/20 dark:bg-slate-600/8',
        badge: 'border-slate-200/80 bg-slate-100 text-slate-700 dark:border-slate-600/50 dark:bg-slate-800/80 dark:text-slate-300',
        badgeText: '',
        dot: 'bg-slate-400 dark:bg-slate-500',
        live: false,
        iconBox: 'border-slate-200/70 bg-slate-50/50 text-slate-500 dark:border-slate-600/50 dark:bg-gray-800 dark:text-slate-400',
        datePanel: 'border-slate-200/80 bg-slate-50/40 dark:border-gray-800 dark:bg-gray-800/80',
        dateIcon: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
        dateText: 'text-slate-800 dark:text-slate-200',
        icon: ICONS.archive,
    },
    default: {
        mesh: 'bg-gradient-to-br from-zinc-400/[0.06] via-transparent to-transparent dark:from-zinc-800/80 dark:via-gray-900 dark:to-gray-900',
        glow: 'bg-zinc-300/20 dark:bg-zinc-600/8',
        badge: 'border-zinc-200/80 bg-zinc-50 text-zinc-700 dark:border-zinc-600/50 dark:bg-zinc-800/80 dark:text-zinc-300',
        dot: 'bg-zinc-400 dark:bg-zinc-500',
        live: false,
        iconBox: 'border-zinc-200/70 bg-zinc-50/50 text-zinc-500 dark:border-zinc-600/50 dark:bg-gray-800 dark:text-zinc-400',
        datePanel: 'border-zinc-200/80 bg-zinc-50/40 dark:border-gray-800 dark:bg-gray-800/80',
        dateIcon: 'bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300',
        dateText: 'text-zinc-800 dark:text-zinc-200',
        icon: ICONS.default,
    },
};

const KNOWN_SLUGS = ['ongoing', 'completed', 'upcoming', 'presale', 'archive'];

export default {
    props: {
        course: {
            type: Object,
            required: true,
        },
        availability: {
            type: Object,
            default: null,
        },
    },
    data() {
        return {
            customIconBroken: false,
        };
    },
    computed: {
        hasStatus() {
            return Boolean(this.course?.status);
        },
        statusSlug() {
            return this.course?.status?.english_title
                || this.course?.status?.slug
                || null;
        },
        isKnownStatus() {
            return KNOWN_SLUGS.includes(this.statusSlug);
        },
        theme() {
            if (this.isKnownStatus) {
                return THEMES[this.statusSlug];
            }
            return THEMES.default;
        },
        customStatusIcon() {
            if (this.isKnownStatus || this.customIconBroken) {
                return null;
            }
            return this.course?.status?.icon || null;
        },
        statusTitle() {
            if (this.isKnownStatus) {
                return this.$t(`course.sidebar.statusCard.${this.statusSlug}.title`);
            }
            return this.course?.status?.title || this.$t('course.sidebar.statusCard.default.title');
        },
        headline() {
            if (this.isKnownStatus) {
                return this.$t(`course.sidebar.statusCard.${this.statusSlug}.headline`);
            }
            return this.course?.status?.title || this.$t('course.sidebar.statusCard.default.headline');
        },
        description() {
            if (this.isKnownStatus) {
                return this.$t(`course.sidebar.statusCard.${this.statusSlug}.description`);
            }
            return this.course?.status?.description
                || this.$t('course.sidebar.statusCard.default.description');
        },
        showStartDate() {
            return ['upcoming', 'presale'].includes(this.statusSlug)
                || (this.availabilityMeta?.course_started === false && this.availabilityMeta?.start_date);
        },
        availabilityMeta() {
            return this.availability || this.course?.availability || null;
        },
        formattedStartDate() {
            if (!this.showStartDate) {
                return null;
            }
            const raw = this.availabilityMeta?.start_date || this.course?.start_date;
            if (!raw) {
                return null;
            }
            const locale = this.$i18n?.locale === 'en' ? 'en-US' : 'fa-IR';
            const formatted = new Date(raw).toLocaleString(locale, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            });
            return this.$t('course.sidebar.statusCard.startDate', { date: formatted });
        },
    },
    methods: {
        onCustomIconError() {
            this.customIconBroken = true;
        },
    },
    watch: {
        'course.status.icon'() {
            this.customIconBroken = false;
        },
    },
};
</script>

<style scoped>
.status-card__icon :deep(svg) {
    display: block;
}

.status-card__live {
    animation: status-card-live 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes status-card-live {
    0% {
        transform: scale(1);
        opacity: 0.65;
    }
    70% {
        transform: scale(2.4);
        opacity: 0;
    }
    100% {
        transform: scale(2.4);
        opacity: 0;
    }
}
</style>
