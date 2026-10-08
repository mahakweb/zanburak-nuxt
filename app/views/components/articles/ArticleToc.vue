<template>
    <nav v-if="items.length" class="rounded-xl bg-white/55 dark:bg-gray-800/35 backdrop-blur-sm border border-white/70 dark:border-gray-700/50 p-4 shadow-sm shadow-blue-500/5">
        <div class="flex items-center mb-3">
            <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-400/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-400/20 rtl:ml-2 ltr:mr-2">
                <svg class="w-[15px] h-[15px]" viewBox="0 0 19 19" fill="none">
                    <path d="M0.75 9.5C0.75 11.4387 0.854858 12.9454 1.11637 14.1221C1.37598 15.2903 1.77991 16.0867 2.34661 16.6534C2.91331 17.2201 3.70973 17.624 4.8779 17.8836C6.05459 18.1451 7.56131 18.25 9.5 18.25C11.4387 18.25 12.9454 18.1451 14.1221 17.8836C15.2903 17.624 16.0867 17.2201 16.6534 16.6534C17.2201 16.0867 17.624 15.2903 17.8836 14.1221C18.1451 12.9454 18.25 11.4387 18.25 9.5C18.25 7.56131 18.1451 6.05459 17.8836 4.8779C17.624 3.70973 17.2201 2.91331 16.6534 2.34661C16.0867 1.77991 15.2903 1.37598 14.1221 1.11637C12.9454 0.854858 11.4387 0.75 9.5 0.75C7.56131 0.75 6.05459 0.854858 4.8779 1.11637C3.70973 1.37598 2.91331 1.77991 2.34661 2.34661C1.77991 2.91331 1.37598 3.70973 1.11637 4.8779C0.854858 6.05459 0.75 7.56131 0.75 9.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </span>
            <h3 class="text-sm font-bold text-gray-800 dark:text-white">{{ $t('articles.show.toc') }}</h3>
        </div>
        <ul class="article-toc__tree">
            <li
                v-for="item in items"
                :key="item.id"
                class="article-toc__item"
                :style="{ '--toc-depth': tocDepth(item.level) }">
                <a
                    :href="'#' + item.id"
                    class="article-toc__link"
                    @click.prevent="$emit('navigate', item.id)">
                    {{ item.text }}
                </a>
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
    props: {
        items: { type: Array, default: () => [] },
    },
    emits: ["navigate"],
    methods: {
        tocDepth(level) {
            return Math.max(0, (level || 2) - 2);
        },
    },
};
</script>

<style scoped>
.article-toc__tree {
    --toc-line: rgb(191 219 254);
    --toc-branch: 12px;
    --toc-step: 14px;
    position: relative;
    margin-inline-start: 6px;
    border-inline-start: 2px solid var(--toc-line);
    padding-inline-start: 0;
}

:global(.dark) .article-toc__tree {
    --toc-line: rgb(55 65 81 / 0.65);
}

.article-toc__item {
    position: relative;
}

.article-toc__item::before {
    content: "";
    position: absolute;
    inset-inline-start: 0;
    top: 50%;
    width: calc(var(--toc-branch) + var(--toc-depth, 0) * var(--toc-step));
    height: 2px;
    background-color: var(--toc-line);
    transform: translateY(-50%);
    border-radius: 1px;
}

.article-toc__link {
    display: block;
    margin-inline-start: calc(var(--toc-branch) + 4px + var(--toc-depth, 0) * var(--toc-step));
    padding: 6px 8px;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.35;
    color: rgb(107 114 128);
    transition: color 0.2s, background-color 0.2s;
}

:global(.dark) .article-toc__link {
    color: rgb(156 163 175);
}

.article-toc__link:hover {
    color: rgb(29 78 216);
    background-color: rgb(239 246 255 / 0.8);
}

:global(.dark) .article-toc__link:hover {
    color: rgb(96 165 250);
    background-color: rgb(59 130 246 / 0.1);
}
</style>
