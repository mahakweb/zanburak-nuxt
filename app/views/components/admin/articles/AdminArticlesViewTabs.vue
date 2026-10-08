<template>
    <div :class="compact ? '' : 'mb-4 flex flex-wrap items-center gap-3'">
        <div class="inline-flex p-0.5 rounded-lg bg-gray-100 dark:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700/60"
            :class="compact ? 'h-9' : ''">
            <router-link :to="{ name: 'admin-articles' }" custom v-slot="{ navigate, isExactActive }">
                <button type="button" @click="navigate"
                    class="flex items-center justify-center gap-1.5 rounded-md font-bold transition-all duration-200 whitespace-nowrap"
                    :class="[
                        compact ? 'h-8 px-3 text-xs' : 'flex-1 sm:flex-none px-5 py-2 text-sm rounded-lg',
                        isExactActive
                            ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
                    ]">
                    لیست
                    <span v-if="listBadge != null"
                        class="min-w-[1.125rem] h-4 px-1 flex items-center justify-center rounded text-[10px] font-bold font-anjoman"
                        :class="isExactActive
                            ? 'bg-yellow-400/25 text-amber-800 dark:text-amber-300'
                            : 'bg-gray-200/70 dark:bg-gray-700/70 text-gray-500'">
                        {{ listBadge }}
                    </span>
                </button>
            </router-link>
            <router-link v-if="showStatsTab" :to="{ name: 'admin-articles-stats' }" custom v-slot="{ navigate, isActive }">
                <button type="button" @click="navigate"
                    class="flex items-center justify-center gap-1.5 rounded-md font-bold transition-all duration-200 whitespace-nowrap"
                    :class="[
                        compact ? 'h-8 px-3 text-xs' : 'flex-1 sm:flex-none px-5 py-2 text-sm rounded-lg',
                        isActive
                            ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
                    ]">
                    آمار
                </button>
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        listBadge: { type: [String, Number], default: null },
        compact: { type: Boolean, default: false },
        showStatsTab: { type: Boolean, default: true },
    },
};
</script>
