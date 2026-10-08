<template>
    <div class="relative overflow-hidden rounded-2xl border shadow-sm" :class="theme.container">
        <div class="pointer-events-none absolute -top-8 -start-8 h-28 w-28 rounded-full opacity-30 blur-2xl" :class="theme.glow"></div>
        <div class="pointer-events-none absolute -bottom-10 -end-6 h-24 w-24 rounded-full opacity-20 blur-2xl" :class="theme.glowSecondary"></div>

        <div class="relative flex items-start gap-3.5 p-4 pb-5 md:p-5 md:pb-6">
            <div class="shrink-0 flex h-11 w-11 items-center justify-center rounded-xl shadow-md ring-1 ring-white/20" :class="theme.iconWrap">
                <svg v-if="slug === 'archive'" class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 7H20M10 11V17M14 11V17M6 7L7 20H17L18 7M9 7V4H15V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                <svg v-else-if="slug === 'upcoming'" class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 8V12L15 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                <svg v-else class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H12.01M12 16H12.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
            </div>

            <div class="min-w-0 flex-1 pt-0.5">
                <span v-if="title" class="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide" :class="theme.badge">
                    {{ title }}
                </span>
                <p class="text-sm font-medium leading-relaxed" :class="[theme.message, title ? 'mt-2' : '']">
                    {{ message }}
                </p>
            </div>
        </div>

        <div
            class="absolute bottom-0 left-1/2 h-1.5 w-[90%] -translate-x-1/2 rounded-t-full"
            :class="theme.accentBar"></div>
    </div>
</template>

<script>
const THEMES = {
    archive: {
        container: 'border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 dark:border-slate-700/80',
        glow: 'bg-slate-400',
        glowSecondary: 'bg-slate-500',
        iconWrap: 'bg-gradient-to-br from-slate-500 to-slate-700',
        badge: 'bg-slate-600/10 text-slate-700 ring-1 ring-slate-600/20 dark:bg-slate-400/10 dark:text-slate-200 dark:ring-slate-400/20',
        message: 'text-slate-700 dark:text-slate-200',
        accentBar: 'bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600',
    },
    upcoming: {
        container: 'border-sky-200/80 bg-gradient-to-br from-sky-50 via-white to-cyan-50 dark:from-sky-950/40 dark:via-slate-900 dark:to-cyan-950/30 dark:border-sky-800/60',
        glow: 'bg-sky-400',
        glowSecondary: 'bg-cyan-400',
        iconWrap: 'bg-gradient-to-br from-sky-400 to-cyan-600',
        badge: 'bg-sky-500/10 text-sky-800 ring-1 ring-sky-500/25 dark:bg-sky-400/10 dark:text-sky-200 dark:ring-sky-400/25',
        message: 'text-sky-900 dark:text-sky-100',
        accentBar: 'bg-gradient-to-r from-sky-400 via-sky-500 to-cyan-500',
    },
    presale: {
        container: 'border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-orange-100 dark:from-amber-950/50 dark:via-slate-900 dark:to-orange-950/25 dark:border-amber-800/60',
        glow: 'bg-amber-400',
        glowSecondary: 'bg-orange-400',
        iconWrap: 'bg-gradient-to-br from-amber-400 to-orange-600',
        badge: 'bg-amber-500/10 text-amber-900 ring-1 ring-amber-500/25 dark:bg-amber-400/10 dark:text-amber-100 dark:ring-amber-400/25',
        message: 'text-amber-950 dark:text-amber-50',
        accentBar: 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500',
    },
};

export default {
    props: {
        statusSlug: {
            type: String,
            default: 'presale',
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
    },
    computed: {
        slug() {
            if (['archive', 'upcoming', 'presale'].includes(this.statusSlug)) {
                return this.statusSlug;
            }
            return 'presale';
        },
        theme() {
            return THEMES[this.slug];
        },
    },
};
</script>
