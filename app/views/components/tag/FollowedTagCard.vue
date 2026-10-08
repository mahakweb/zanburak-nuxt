<template>
    <div class="relative flex flex-col rounded-2xl bg-white dark:bg-gray-900 p-4 md:p-5 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition duration-300">
        <div class="before:absolute before:inset-x-4 before:-bottom-1 before:h-4 before:rounded-b-2xl before:bg-gray-200/40 dark:before:bg-gray-800/60 before:-z-10"></div>

        <router-link
            :to="{ name: 'tag-show', params: { tagSlug: tag.slug } }"
            class="text-base font-extrabold text-gray-800 dark:text-white hover:text-amber-500 transition mb-2 line-clamp-1">
            # {{ tag.name }}
        </router-link>

        <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-4">
            <span>{{ $t('tags.questionsCount', { count: tag.questions_count || 0 }) }}</span>
            <span class="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
            <span>{{ $t('tags.followersCount', { count: tag.followers_count || 0 }) }}</span>
        </div>

        <router-link
            :to="{ name: 'tag-show', params: { tagSlug: tag.slug } }"
            class="mt-auto h-9 flex items-center justify-center text-sm font-semibold rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-amber-400 hover:text-gray-900 transition">
            {{ $t('tags.viewTag') }}
        </router-link>
    </div>
</template>

<script>
export default {
    props: {
        tag: {
            type: Object,
            required: true,
        },
    },
};
</script>
