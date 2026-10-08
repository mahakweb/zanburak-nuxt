<template>
    <div class="mx-auto max-w-screen-xl px-2 pb-20">
        <div class="my-5 md:my-8 animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 h-3 w-28 rounded bg-gray-200/80 dark:bg-gray-700"></div>

        <section class="mb-20">
            <div class="grid lg:grid-cols-12 gap-6">
                <div class="order-2 lg:order-1 lg:col-span-9 col-span-12 space-y-5">
                    <div class="relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 p-5 sm:p-8 lg:p-10">
                        <div class="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50/40 via-white to-sky-50/30 dark:from-[#0f1524] dark:via-gray-900 dark:to-[#0f1a2e]" aria-hidden="true"></div>
                        <div class="relative space-y-5">
                            <div class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 rounded-xl w-full md:h-52 sm:h-44 h-36 bg-gray-200/80 dark:bg-gray-700"></div>
                            <div class="flex items-center justify-between gap-3">
                                <div class="flex items-center gap-2">
                                    <div class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 w-6 h-6 rounded-full bg-gray-200/80 dark:bg-gray-700"></div>
                                    <div class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 h-2.5 w-24 rounded-lg bg-gray-200/80 dark:bg-gray-700"></div>
                                </div>
                                <div class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 h-5 w-20 rounded-lg bg-gray-200/80 dark:bg-gray-700"></div>
                            </div>
                            <div class="space-y-2.5">
                                <div class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 h-7 sm:h-8 w-full rounded-lg bg-gray-200/80 dark:bg-gray-700"></div>
                                <div class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 h-7 sm:h-8 w-4/5 rounded-lg bg-gray-200/80 dark:bg-gray-700"></div>
                                <div class="flex gap-1 pt-1">
                                    <div class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 h-0.5 w-14 rounded bg-gray-200/80 dark:bg-gray-700"></div>
                                </div>
                            </div>
                            <div class="space-y-2 pt-1">
                                <div v-for="i in 6" :key="'line-' + i" class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 h-3 rounded bg-gray-200/80 dark:bg-gray-700" :class="i === 6 ? 'w-2/3' : 'w-full'"></div>
                            </div>
                            <div class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 h-12 rounded-xl bg-gray-200/80 dark:bg-gray-700"></div>
                            <div class="border-t border-gray-100 dark:border-gray-800 pt-5 flex items-center justify-between gap-3">
                                <div class="flex items-center gap-2">
                                    <div v-for="i in 3" :key="'action-' + i" class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 h-5 rounded-lg bg-gray-200/80 dark:bg-gray-700" :class="i === 3 ? 'w-5' : 'w-10'"></div>
                                </div>
                                <div class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 h-2 w-24 rounded-lg bg-gray-200/80 dark:bg-gray-700"></div>
                            </div>
                        </div>
                    </div>

                    <div class="rounded-2xl border border-gray-100 dark:border-gray-800 px-6 sm:px-10 py-6 flex items-center gap-4">
                        <div class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 w-14 h-14 rounded-full bg-gray-200/80 dark:bg-gray-700 shrink-0"></div>
                        <div class="flex-1 space-y-2.5">
                            <div class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 h-5 w-36 rounded-lg bg-gray-200/80 dark:bg-gray-700"></div>
                            <div class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 h-3 w-52 rounded-lg bg-gray-200/80 dark:bg-gray-700"></div>
                        </div>
                    </div>

                    <div class="rounded-2xl border border-gray-100 dark:border-gray-800 px-5 sm:px-10 py-6">
                        <div class="flex items-center justify-between gap-3 mb-5">
                            <div class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 h-6 w-32 rounded-lg bg-gray-200/80 dark:bg-gray-700"></div>
                            <div class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 h-9 w-36 rounded-lg bg-gray-200/80 dark:bg-gray-700"></div>
                        </div>
                        <div v-for="i in 3" :key="'comment-' + i" class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 h-14 rounded-xl bg-gray-200/80 dark:bg-gray-700 mb-3 last:mb-0"></div>
                    </div>
                </div>

                <div class="order-3 lg:order-2 hidden lg:block lg:col-span-3">
                    <div class="relative overflow-hidden rounded-xl border border-blue-100/70 dark:border-gray-700/80 pt-8 pb-9 px-5">
                        <div class="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50/95 via-white to-sky-50/90 dark:from-[#111827] dark:via-gray-900 dark:to-[#0f172a]" aria-hidden="true"></div>
                        <div class="relative z-10 space-y-3">
                            <div class="rounded-xl bg-white/55 dark:bg-gray-800/35 p-4">
                                <div class="flex items-center gap-3">
                                    <div class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 w-12 h-12 rounded-full bg-gray-200/80 dark:bg-gray-700"></div>
                                    <div class="flex-1 space-y-2">
                                        <div class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 h-3 w-24 rounded bg-gray-200/80 dark:bg-gray-700"></div>
                                        <div class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 h-2.5 w-full rounded bg-gray-200/80 dark:bg-gray-700"></div>
                                    </div>
                                </div>
                            </div>
                            <div v-for="i in 3" :key="'sb-' + i" class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 h-10 rounded-lg bg-gray-200/80 dark:bg-gray-700"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>
