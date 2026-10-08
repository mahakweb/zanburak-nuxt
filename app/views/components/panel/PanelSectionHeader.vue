<template>
    <div class="flex items-center justify-between gap-3 mb-5">
        <div class="flex items-center gap-3 min-w-0">
            <span
                v-if="icon"
                class="w-10 h-10 rounded-xl bg-amber-400/15 text-amber-500 flex items-center justify-center shrink-0"
                v-html="icon"
            />
            <h2 v-if="title" class="text-gray-800 dark:text-white font-bold text-base md:text-lg truncate">
                {{ title }}
            </h2>
            <slot v-else name="title" />
        </div>
        <slot name="extra" />
    </div>
</template>

<script>
export default {
    props: {
        title: { type: String, default: "" },
        icon: { type: String, default: "" },
    },
};
</script>
