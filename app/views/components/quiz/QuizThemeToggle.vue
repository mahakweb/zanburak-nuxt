<template>
    <button
        type="button"
        class="quiz-theme-toggle"
        :title="isDark ? $t('theme.light') : $t('theme.dark')"
        :aria-label="isDark ? $t('theme.light') : $t('theme.dark')"
        @click="toggle"
    >
        <svg v-if="isDark" class="h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.5"/>
            <path d="M12 2V4M12 20V22M4 12H2M22 12H20M5.6 5.6L4.2 4.2M19.8 19.8L18.4 18.4M5.6 18.4L4.2 19.8M19.8 4.2L18.4 5.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none">
            <path d="M21 14.5A7.5 7.5 0 0110.5 4 9.5 9.5 0 0014.5 21 7.5 7.5 0 0021 14.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        </svg>
    </button>
</template>

<script>
export default {
    data() {
        return { isDark: false };
    },
    mounted() {
        this.syncFromDom();
    },
    methods: {
        syncFromDom() {
            this.isDark = document.documentElement.classList.contains('dark');
        },
        toggle() {
            const nextDark = !document.documentElement.classList.contains('dark');
            document.documentElement.classList.toggle('dark', nextDark);
            localStorage.setItem('theme', nextDark ? 'dark' : 'light');
            document.documentElement.dispatchEvent(new Event('onChangeTheme'));
            this.isDark = nextDark;
        },
    },
};
</script>

<style scoped>
.quiz-theme-toggle {
    display: inline-flex;
    height: 2.25rem;
    width: 2.25rem;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    border: 1px solid rgb(229 231 235);
    background: rgb(255 255 255);
    color: rgb(71 85 105);
    transition: background-color 0.2s, color 0.2s;
}

.quiz-theme-toggle:hover {
    background: rgb(249 250 251);
}

:global(.dark) .quiz-theme-toggle {
    border-color: rgb(55 65 81);
    background: rgb(17 24 39);
    color: rgb(226 232 240);
}

:global(.dark) .quiz-theme-toggle:hover {
    background: rgb(31 41 55);
}
</style>
