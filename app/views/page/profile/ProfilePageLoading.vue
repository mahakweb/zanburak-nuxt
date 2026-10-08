<template>
    <div class="mx-auto max-w-screen-xl px-3 md:px-4 pb-16">
        <!-- Cover -->
        <div class="mt-6 h-40 sm:h-52 md:h-60 lg:h-72 w-full rounded-3xl bg-gray-200 dark:bg-gray-800 animate-shimmer shimmer-gray-200 dark:shimmer-gray-600"></div>

        <!-- Identity card -->
        <div class="relative z-10 -mt-14 md:-mt-16 mx-1 sm:mx-4 rounded-3xl bg-white dark:bg-gray-900 p-5 md:p-6 shadow-sm ring-1 ring-gray-100 dark:ring-gray-800">
            <div class="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
                <!-- Avatar -->
                <div class="-mt-20 md:-mt-24 mx-auto md:mx-0 shrink-0 w-28 h-28 md:w-36 md:h-36 rounded-3xl ring-4 ring-white dark:ring-gray-900 bg-gray-200 dark:bg-gray-700 animate-shimmer shimmer-gray-200 dark:shimmer-gray-600"></div>

                <!-- Name + meta -->
                <div class="flex-1 min-w-0 w-full flex flex-col items-center md:items-start gap-3">
                    <div class="h-5 w-44 rounded-lg bg-gray-200 dark:bg-gray-700 animate-shimmer shimmer-gray-200 dark:shimmer-gray-600"></div>
                    <div class="h-3 w-56 rounded-full bg-gray-200 dark:bg-gray-700 animate-shimmer shimmer-gray-200 dark:shimmer-gray-600"></div>
                </div>

                <!-- Actions -->
                <div class="flex flex-col items-center md:items-end gap-3 shrink-0">
                    <div class="h-11 w-32 rounded-xl bg-gray-200 dark:bg-gray-700 animate-shimmer shimmer-gray-200 dark:shimmer-gray-600"></div>
                    <div class="flex items-center gap-1.5">
                        <div v-for="i in 4" :key="i" class="w-9 h-9 rounded-xl bg-gray-200 dark:bg-gray-700 animate-shimmer shimmer-gray-200 dark:shimmer-gray-600"></div>
                    </div>
                </div>
            </div>

            <!-- Quick stats -->
            <div class="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                <div v-for="i in 4" :key="i" class="flex flex-col items-center justify-center gap-2 py-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 ring-1 ring-gray-100 dark:ring-gray-800">
                    <div class="h-4 w-10 rounded bg-gray-200 dark:bg-gray-700 animate-shimmer shimmer-gray-200 dark:shimmer-gray-600"></div>
                    <div class="h-2 w-14 rounded-full bg-gray-200 dark:bg-gray-700 animate-shimmer shimmer-gray-200 dark:shimmer-gray-600"></div>
                </div>
            </div>
        </div>

        <!-- Body -->
        <div class="mt-6 grid grid-cols-12 gap-5">
            <!-- Main -->
            <div class="col-span-12 lg:col-span-8">
                <!-- Tabs -->
                <div class="flex gap-2 p-1.5 rounded-2xl bg-white dark:bg-gray-900 ring-1 ring-gray-100 dark:ring-gray-800 shadow-sm w-max">
                    <div v-for="i in 3" :key="i" class="h-11 w-24 sm:w-28 rounded-xl bg-gray-200 dark:bg-gray-700 animate-shimmer shimmer-gray-200 dark:shimmer-gray-600"></div>
                </div>

                <!-- Content -->
                <div class="mt-5 rounded-3xl bg-white dark:bg-gray-900 ring-1 ring-gray-100 dark:ring-gray-800 shadow-sm p-6">
                    <div class="h-4 w-32 rounded-lg bg-gray-200 dark:bg-gray-700 animate-shimmer shimmer-gray-200 dark:shimmer-gray-600"></div>
                    <div class="mt-6 space-y-4">
                        <div class="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 animate-shimmer shimmer-gray-200 dark:shimmer-gray-600"></div>
                        <div class="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 animate-shimmer shimmer-gray-200 dark:shimmer-gray-600"></div>
                        <div class="h-2.5 w-[85%] rounded-full bg-gray-200 dark:bg-gray-700 animate-shimmer shimmer-gray-200 dark:shimmer-gray-600"></div>
                        <div class="h-2.5 w-[70%] rounded-full bg-gray-200 dark:bg-gray-700 animate-shimmer shimmer-gray-200 dark:shimmer-gray-600"></div>
                    </div>
                    <div class="mt-8 h-4 w-28 rounded-lg bg-gray-200 dark:bg-gray-700 animate-shimmer shimmer-gray-200 dark:shimmer-gray-600"></div>
                    <div class="mt-6 space-y-4">
                        <div class="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 animate-shimmer shimmer-gray-200 dark:shimmer-gray-600"></div>
                        <div class="h-2.5 w-[90%] rounded-full bg-gray-200 dark:bg-gray-700 animate-shimmer shimmer-gray-200 dark:shimmer-gray-600"></div>
                    </div>
                </div>
            </div>

            <!-- Sidebar -->
            <aside class="col-span-12 lg:col-span-4">
                <div class="rounded-3xl bg-white dark:bg-gray-900 p-5 shadow-sm ring-1 ring-gray-100 dark:ring-gray-800">
                    <div class="h-4 w-28 rounded-lg bg-gray-200 dark:bg-gray-700 animate-shimmer shimmer-gray-200 dark:shimmer-gray-600 mb-5"></div>
                    <div class="space-y-2">
                        <div v-for="i in 5" :key="i" class="flex items-center gap-3 px-3 py-2.5">
                            <div class="w-10 h-10 shrink-0 rounded-xl bg-gray-200 dark:bg-gray-700 animate-shimmer shimmer-gray-200 dark:shimmer-gray-600"></div>
                            <div class="flex-1 flex flex-col gap-2">
                                <div class="h-2.5 w-28 rounded-full bg-gray-200 dark:bg-gray-700 animate-shimmer shimmer-gray-200 dark:shimmer-gray-600"></div>
                                <div class="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700 animate-shimmer shimmer-gray-200 dark:shimmer-gray-600"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </div>
</template>

<script>
export default {};
</script>
