<template>
    <div class="mb-2 flex flex-col gap-y-2 lg:flex-row lg:items-end lg:justify-between">
        <div v-if="showSearch" class="relative w-full sm:max-w-xs shrink-0">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
            </div>
            <input
                type="text"
                :value="search"
                :placeholder="searchPlaceholder"
                class="bg-white text-gray-900 text-xs font-medium rounded-lg focus:ring-0 focus:outline-none block w-full h-8 ps-10 pe-8 p-2.5 dark:bg-gray-600 dark:text-white"
                @input="onSearchInput"
            />
            <button
                v-if="search"
                type="button"
                class="absolute inset-y-0 end-0 flex items-center pe-3 text-gray-400"
                @click="$emit('clear-search')"
            >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <div
            class="flex flex-wrap items-end gap-1 min-w-0"
            :class="showSearch ? 'lg:justify-end' : 'justify-start lg:justify-end'"
        >
            <slot />
            <button
                v-if="showClear"
                type="button"
                title="پاک کردن فیلترها"
                class="flex items-center justify-center h-8 w-8 bg-rose-400/20 hover:bg-opacity-90 rounded-lg shrink-0"
                @click="$emit('clear-filters')"
            >
                <svg class="w-4 h-4 text-rose-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.88 10c-2.62 0-4.75 2.13-4.75 4.75 0 .89.25 1.73.69 2.45.82 1.38 2.33 2.3 4.06 2.3 1.73 0 3.24-.93 4.06-2.3.44-.72.69-1.56.69-2.45C21.63 12.13 19.51 10 16.88 10z" />
                    <path d="M20.58 4.02V6.24c0 .81-.5 1.82-1 2.33l-.18.16c-.14.13-.35.16-.53.1-.2-.07-.4-.12-.6-.17-.44-.11-.91-.16-1.39-.16-3.45 0-6.25 2.8-6.25 6.25 0 1.14.31 2.26.9 3.22.5.84 1.2 1.54 1.96 2.01.23.15.32.47.12.65-.07.06-.14.11-.21.16l-1.4.91c-1.3.81-3.09-.1-3.09-1.72v-5.35c0-.71-.4-1.62-.8-2.12L4.32 8.47c-.5-.51-.9-1.42-.9-2.02V4.12C3.42 2.91 4.32 2 5.41 2h13.18c1.09 0 1.99.91 1.99 2.02z" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: "AdminListFilterBar",
    props: {
        search: { type: String, default: "" },
        searchPlaceholder: { type: String, default: "جستجو..." },
        showSearch: { type: Boolean, default: true },
        showClear: { type: Boolean, default: true },
    },
    emits: ["update:search", "search", "clear-search", "clear-filters"],
    methods: {
        onSearchInput(event) {
            this.$emit("update:search", event.target.value);
            this.$emit("search", event);
        },
    },
};
</script>
