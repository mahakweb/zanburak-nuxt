<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <router-link :to="{ name: 'admin-path-create' }" class="shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100">
                <span class="flex items-center gap-1.5">
                    ایجاد مسیر جدید
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 5V19M5 12H19" />
                    </svg>
                </span>
            </router-link>
            <button @click="fetchData" class="shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100">
                بروزرسانی
            </button>
        </template>

        <div class="min-w-0">
            <AdminBulkActionBar :count="selectedIds.length">
                <button v-can="'paths.delete'" type="button" @click="openBulkDeleteModal"
                    class="h-8 px-3 text-xs font-semibold text-rose-700 bg-rose-100 dark:bg-rose-900/30 rounded-lg hover:bg-rose-200 dark:hover:bg-rose-900/50">
                    حذف
                </button>
                <button type="button" @click="selectedIds = []"
                    class="h-8 px-3 text-xs font-semibold text-gray-600 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                    لغو انتخاب
                </button>
            </AdminBulkActionBar>

            <AdminListFilterBar
                v-model:search="searchQuery"
                search-placeholder="جستجو مسیر..."
                @search="handleSearch"
                @clear-search="clearSearch"
                @clear-filters="clearFilters"
            >
                <AdminFilterSelect v-model="filterStatus" label="وضعیت" :options="statusOptions" min-width="sm" @change="onFilterChange" />
                <AdminFilterSelect v-model="filterSort" label="مرتب‌سازی" :options="sortOptions" @change="onFilterChange" />
                <AdminFilterSelect v-model="dataView" label="نمایش" :options="viewOptions" />
            </AdminListFilterBar>

            <div id="data-list">
                <AdminInlineLoading v-if="loading" />

                <template v-else-if="items.length">
                    <div v-if="dataView === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 pt-1">
                        <article
                            v-for="path in items"
                            :key="path.id"
                            class="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white transition-all hover:border-amber-300/60 hover:shadow-lg hover:shadow-amber-500/5 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-amber-500/25"
                        >
                            <div class="h-1 bg-gradient-to-l from-amber-400 via-amber-300 to-amber-200/60 dark:from-amber-500 dark:via-amber-400/80 dark:to-amber-600/40" />

                            <div class="flex flex-1 flex-col p-3.5">
                                <div class="flex items-start gap-3">
                                    <div class="relative shrink-0" @click.stop>
                                        <router-link
                                            :to="{ name: 'path.show', params: { pathSlug: path.slug } }"
                                            class="block h-14 w-14 overflow-hidden rounded-2xl border-2 border-amber-200/80 bg-gradient-to-br from-amber-50 to-white shadow-sm transition group-hover:border-amber-300 dark:border-amber-500/30 dark:from-gray-800 dark:to-gray-900"
                                        >
                                            <img
                                                v-if="path.icon"
                                                :src="path.icon"
                                                :alt="path.title"
                                                class="h-full w-full object-cover"
                                                onerror="this.style.display='none'"
                                            />
                                            <div v-else class="flex h-full w-full items-center justify-center text-amber-400/70 dark:text-amber-500/50">
                                                <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A2 2 0 013 15.382V6.618a2 2 0 011.553-1.946l7-1.75a2 2 0 011.894 0l7 1.75A2 2 0 0121 6.618v8.764a2 2 0 01-1.553 1.946L13 19.236" />
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 10l2 2 4-4" />
                                                </svg>
                                            </div>
                                        </router-link>
                                        <div class="absolute -bottom-1 -start-1 z-10 rounded-md bg-white p-0.5 shadow-sm dark:bg-gray-900">
                                            <AdminBulkCheckbox v-model="selectedIds" :value="path.id" />
                                        </div>
                                    </div>

                                    <div class="min-w-0 flex-1 pt-0.5">
                                        <div class="flex items-start justify-between gap-2">
                                            <router-link :to="{ name: 'admin-path-edit', params: { pathSlug: path.slug } }" class="min-w-0 hover:opacity-80 transition-opacity">
                                                <h3 class="text-[13px] font-bold leading-5 text-gray-900 line-clamp-2 dark:text-white" :title="path.title">{{ path.title }}</h3>
                                            </router-link>
                                            <div class="shrink-0" @click.stop>
                                                <Popover class="relative flex items-center justify-center">
                                                    <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-30" />
                                                    <PopoverButton class="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 focus:outline-none group-focus-within:z-30 dark:hover:bg-gray-800 dark:hover:text-gray-200">
                                                        <svg class="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                                                            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                                                        </svg>
                                                    </PopoverButton>
                                                    <transition
                                                        enter-active-class="transition duration-200 ease-out"
                                                        enter-from-class="translate-y-1 opacity-0"
                                                        enter-to-class="translate-y-0 opacity-100"
                                                        leave-active-class="transition duration-150 ease-in"
                                                        leave-from-class="translate-y-0 opacity-100"
                                                        leave-to-class="translate-y-1 opacity-0"
                                                    >
                                                        <PopoverPanel class="absolute top-full end-0 z-30 mt-2 flex w-max min-w-[8.5rem] flex-col rounded-lg bg-white p-2 text-start shadow-lg dark:bg-gray-900">
                                                            <ul class="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                                                <li>
                                                                    <router-link :to="{ name: 'path.show', params: { pathSlug: path.slug } }" class="block px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">نمایش عمومی</router-link>
                                                                </li>
                                                                <li>
                                                                    <router-link :to="{ name: 'admin-path-edit', params: { pathSlug: path.slug } }" class="block px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">ویرایش مسیر</router-link>
                                                                </li>
                                                                <li v-can="'paths.delete'">
                                                                    <button type="button" class="block w-full px-4 py-2 text-start text-red-500 hover:rounded-lg hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-600" @click="openDeletePathModal(path.slug)">حذف مسیر</button>
                                                                </li>
                                                            </ul>
                                                        </PopoverPanel>
                                                    </transition>
                                                </Popover>
                                            </div>
                                        </div>
                                        <p v-if="path.english_title" class="mt-0.5 text-[10px] text-gray-400 line-clamp-1 font-sans" dir="ltr">{{ path.english_title }}</p>
                                        <span
                                            class="mt-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
                                            :class="path.status ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/25 dark:text-emerald-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'"
                                        >
                                            <span class="h-1.5 w-1.5 rounded-full" :class="path.status ? 'bg-emerald-500' : 'bg-gray-400'" />
                                            {{ path.status ? 'فعال' : 'غیرفعال' }}
                                        </span>
                                    </div>
                                </div>

                                <p v-if="path.short_description" class="mt-2.5 text-[11px] leading-5 text-gray-500 line-clamp-2 dark:text-gray-400">{{ path.short_description }}</p>

                                <div class="mt-3 rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-gray-800 dark:bg-gray-800/40">
                                    <div class="flex items-center gap-0.5" dir="ltr">
                                        <template v-for="(node, idx) in journeyNodes(path)" :key="idx">
                                            <span
                                                class="relative z-[1] flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold transition-colors"
                                                :class="node.filled ? 'bg-amber-400 text-gray-900 ring-2 ring-amber-200/80 dark:ring-amber-500/30' : 'bg-white text-gray-300 ring-1 ring-gray-200 dark:bg-gray-900 dark:text-gray-600 dark:ring-gray-700'"
                                            >
                                                <svg v-if="idx === journeyNodes(path).length - 1" class="h-2.5 w-2.5" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                </svg>
                                                <span v-else>{{ idx + 1 }}</span>
                                            </span>
                                            <span
                                                v-if="idx < journeyNodes(path).length - 1"
                                                class="h-0.5 min-w-[0.75rem] flex-1 rounded-full"
                                                :class="node.filled ? 'bg-amber-300 dark:bg-amber-500/50' : 'bg-gray-200 dark:bg-gray-700'"
                                            />
                                        </template>
                                    </div>
                                    <div class="mt-2.5 flex flex-wrap items-center gap-1.5 text-[10px] font-medium text-gray-600 dark:text-gray-400">
                                        <button type="button" class="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 shadow-sm ring-1 ring-gray-200/80 transition hover:ring-amber-200 dark:bg-gray-900 dark:ring-gray-700 dark:hover:ring-amber-500/30" @click="openItemsModal(path.courses, 'course')">
                                            <svg class="h-3 w-3 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path stroke-linecap="round" stroke-linejoin="round" d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>
                                            {{ path.courses_count || 0 }} دوره
                                        </button>
                                        <button type="button" class="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 shadow-sm ring-1 ring-gray-200/80 transition hover:ring-amber-200 dark:bg-gray-900 dark:ring-gray-700 dark:hover:ring-amber-500/30" @click="openItemsModal(path.prerequisites, 'path')">
                                            <svg class="h-3 w-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                                            {{ path.prerequisites_count || 0 }} پیش‌نیاز
                                        </button>
                                        <button type="button" class="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 shadow-sm ring-1 ring-gray-200/80 transition hover:ring-amber-200 dark:bg-gray-900 dark:ring-gray-700 dark:hover:ring-amber-500/30" @click="openItemsModal(path.next_steps, 'path')">
                                            <svg class="h-3 w-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                                            {{ path.next_steps_count || 0 }} قدم بعدی
                                        </button>
                                    </div>
                                </div>

                                <div class="mt-3 flex items-center justify-between gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
                                    <span class="text-[10px] text-gray-400 font-anjoman" dir="ltr">{{ formatDate(path.created_at) }}</span>
                                    <div class="flex shrink-0 items-center gap-1">
                                        <router-link :to="{ name: 'path.show', params: { pathSlug: path.slug } }" class="inline-flex h-8 items-center justify-center rounded-lg bg-amber-400 px-2.5 text-[11px] font-bold text-gray-900 transition hover:bg-amber-500">مشاهده</router-link>
                                        <router-link :to="{ name: 'admin-path-edit', params: { pathSlug: path.slug } }" class="inline-flex h-8 items-center justify-center rounded-lg bg-gray-100 px-2.5 text-[11px] font-bold text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">ویرایش</router-link>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>

                    <div v-else class="overflow-x-auto md:custom-scrollbar pt-1">
                        <table class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                            <thead class="bg-amber-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                <tr class="text-xs font-semibold text-start">
                                    <th class="px-1 py-2 w-8">
                                        <AdminBulkCheckbox :checked="isAllSelected" :indeterminate="isIndeterminate" @change="toggleSelectAll" />
                                    </th>
                                    <th class="px-1 py-3 whitespace-nowrap text-start">مسیر</th>
                                    <th class="px-1 py-3 whitespace-nowrap text-start">دوره‌ها</th>
                                    <th class="px-1 py-3 whitespace-nowrap text-start">پیش‌نیازها</th>
                                    <th class="px-1 py-3 whitespace-nowrap text-start">قدم‌های بعدی</th>
                                    <th class="px-1 py-3 whitespace-nowrap text-start">ایجاد</th>
                                    <th class="px-1 py-3 whitespace-nowrap text-center">عملیات</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                                <tr v-for="path in items" :key="path.id" class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-amber-50/40 dark:hover:bg-gray-800/60 transition-colors">
                                    <td class="relative ps-2 pe-3 py-3" @click.stop>
                                        <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg" :class="path.status ? 'bg-emerald-400 dark:bg-emerald-600' : 'bg-gray-400 dark:bg-gray-600'" />
                                        <AdminBulkCheckbox v-model="selectedIds" :value="path.id" />
                                    </td>
                                    <td class="px-3 py-3 text-start">
                                        <div class="flex items-center gap-2 min-w-0">
                                            <div class="shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700">
                                                <img v-if="path.icon" :src="path.icon" alt="" class="w-full h-full object-cover" onerror="this.style.display='none'" />
                                            </div>
                                            <div class="min-w-0">
                                                <div class="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">{{ path.title }}</div>
                                                <div v-if="path.english_title" class="text-[10px] text-gray-500 line-clamp-1 font-sans" dir="ltr">{{ path.english_title }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-1 py-3 text-start">
                                        <button type="button" class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg font-anjoman hover:opacity-80" @click="openItemsModal(path.courses, 'course')">{{ path.courses_count || 0 }}</button>
                                    </td>
                                    <td class="px-1 py-3 text-start">
                                        <button type="button" class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg font-anjoman hover:opacity-80" @click="openItemsModal(path.prerequisites, 'path')">{{ path.prerequisites_count || 0 }}</button>
                                    </td>
                                    <td class="px-1 py-3 text-start">
                                        <button type="button" class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg font-anjoman hover:opacity-80" @click="openItemsModal(path.next_steps, 'path')">{{ path.next_steps_count || 0 }}</button>
                                    </td>
                                    <td class="px-1 py-3 text-start">
                                        <span class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg" dir="ltr">{{ formatDate(path.created_at) }}</span>
                                    </td>
                                    <td class="px-1 py-3 text-center">
                                        <Popover class="group relative flex items-center justify-center">
                                            <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-30" />
                                            <PopoverButton class="text-gray-900 dark:text-white relative group-focus-within:z-30 focus:outline-none flex items-center justify-center p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                                                <svg class="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                                                    <path d="M8 12C9.10457 12 10 12.8954 10 14C10 15.1046 9.10457 16 8 16C6.89543 16 6 15.1046 6 14C6 12.8954 6.89543 12 8 12Z" />
                                                    <path d="M8 6C9.10457 6 10 6.89543 10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6Z" />
                                                    <path d="M10 2C10 0.89543 9.10457 0 8 0C6.89543 0 6 0.895431 6 2C6 3.10457 6.89543 4 8 4C9.10457 4 10 3.10457 10 2Z" />
                                                </svg>
                                            </PopoverButton>
                                            <transition enter-active-class="transition duration-200 ease-out" enter-from-class="translate-y-1 opacity-0" enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-1 opacity-0">
                                                <PopoverPanel class="absolute top-full end-0 z-30 mt-2 flex w-max min-w-[8.5rem] flex-col rounded-lg bg-white p-2 text-start shadow-lg dark:bg-gray-900">
                                                    <ul class="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                                        <li><router-link :to="{ name: 'path.show', params: { pathSlug: path.slug } }" class="block px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">نمایش عمومی</router-link></li>
                                                        <li><router-link :to="{ name: 'admin-path-edit', params: { pathSlug: path.slug } }" class="block px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">ویرایش مسیر</router-link></li>
                                                        <li v-can="'paths.delete'"><button type="button" class="block w-full px-4 py-2 text-start text-red-500 hover:rounded-lg hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-600" @click="openDeletePathModal(path.slug)">حذف مسیر</button></li>
                                                    </ul>
                                                </PopoverPanel>
                                            </transition>
                                        </Popover>
                                    </td>
                                </tr>
                                <tr class="h-12" />
                            </tbody>
                        </table>
                    </div>
                </template>

                <p v-else class="py-12 text-center text-sm text-gray-400">مسیر یافت نشد</p>
            </div>

            <div class="flex lg:flex-row flex-col items-center justify-between gap-4 mt-4" :class="dataView === 'list' && items.length ? '-mt-16' : ''">
                <PaginationComponent dir="ltr" :pagination="pagination" @updatePage="updatePage" />
                <div class="w-max">
                    <div class="text-xs font-light text-gray-400 px-1 mb-1">تعداد:</div>
                    <select v-model.number="perPage" @change="onPerPageChange" class="h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none min-w-[4rem]">
                        <option v-for="p in perPages" :key="p" :value="p">{{ p }}</option>
                    </select>
                </div>
            </div>

            <BottomSheetDrawer v-model="isOpenItemsModal" :initialHeight="0.5" :maxHeight="0.95" :minHeight="0.4" :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
                :panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[35rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
                :contentClass="'px-4 pb-4 overflow-auto custom-scrollbar'"
                :backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'">
                <div v-if="itemsForShow?.length" class="space-y-0.5">
                    <router-link
                        v-for="(item, index) in itemsForShow"
                        :key="index"
                        :to="itemTypeForShow === 'course' ? { name: 'course.show', params: { courseSlug: item.slug } } : { name: 'path.show', params: { pathSlug: item.slug } }"
                        class="block px-4 py-3 rounded-lg bg-gray-100/70 dark:bg-gray-800/70 text-sm font-semibold text-gray-800 dark:text-gray-50 hover:opacity-80 line-clamp-1"
                        @click="isOpenItemsModal = false"
                    >{{ item.title }}</router-link>
                </div>
                <div v-else class="flex items-center justify-center text-sm font-semibold text-gray-600 dark:text-gray-200 h-32">موردی جهت نمایش وجود ندارد!</div>
            </BottomSheetDrawer>

            <AdminDeletePathModal v-model="showDeletePathModal" :path-slugs="pathSlugForDelete" @deleted="onPathsDeleted" />
        </div>
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import AdminBulkCheckbox from "@/views/components/admin/AdminBulkCheckbox.vue";
import AdminBulkActionBar from "@/views/components/admin/AdminBulkActionBar.vue";
import AdminInlineLoading from "@/views/components/admin/AdminInlineLoading.vue";
import AdminListFilterBar from "@/views/components/admin/AdminListFilterBar.vue";
import AdminFilterSelect from "@/views/components/admin/AdminFilterSelect.vue";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import AdminDeletePathModal from "@/views/components/admin/AdminDeletePathModal.vue";
import axiosInstance from "@/store/axiosInstance";
import { Popover, PopoverButton, PopoverPanel, PopoverOverlay } from "@headlessui/vue";

export default {
    components: {
        AdminMasterPage,
        AdminBulkCheckbox,
        AdminBulkActionBar,
        AdminInlineLoading,
        AdminListFilterBar,
        AdminFilterSelect,
        PaginationComponent,
        BottomSheetDrawer,
        AdminDeletePathModal,
        Popover,
        PopoverButton,
        PopoverPanel,
        PopoverOverlay,
    },
    data() {
        return {
            loading: false,
            items: [],
            pagination: {},
            perPage: 20,
            perPages: [10, 20, 30, 50, 100],
            searchQuery: "",
            filterStatus: this.$route.query.installment === "yes" ? "installment" : (this.$route.query.status || "all"),
            filterSort: "newest",
            dataView: "grid",
            mounted: false,
            currentPage: this.$route.query.page ? this.$route.query.page : 1,
            showDeletePathModal: false,
            pathSlugForDelete: null,
            isOpenItemsModal: false,
            itemsForShow: null,
            itemTypeForShow: "course",
            selectedIds: [],
        };
    },
    computed: {
        statusOptions() {
            return [
                { value: "all", label: "همه" },
                { value: "active", label: "فعال" },
                { value: "inactive", label: "غیرفعال" },
                { value: "installment", label: "فقط اقساطی" },
            ];
        },
        sortOptions() {
            return [
                { value: "newest", label: "جدیدترین" },
                { value: "oldest", label: "قدیمی‌ترین" },
                { value: "courses_high", label: "بیشترین دوره" },
            ];
        },
        viewOptions() {
            return [
                { value: "grid", label: "شبکه‌ای" },
                { value: "list", label: "لیست" },
            ];
        },
        isAllSelected() {
            return this.items.length > 0 && this.selectedIds.length === this.items.length;
        },
        isIndeterminate() {
            return this.selectedIds.length > 0 && !this.isAllSelected;
        },
    },
    watch: {
        "$route.query": {
            handler() {
                if (this.mounted) {
                    this.currentPage = parseInt(this.$route.query.page) || 1;
                    this.searchQuery = this.$route.query.search || "";
                    this.filterStatus = this.$route.query.installment === "yes"
                        ? "installment"
                        : (this.$route.query.status || "all");
                    this.filterSort = this.$route.query.sort || "newest";
                    this.fetchData();
                }
            },
            deep: true,
        },
    },
    async mounted() {
        document.title = "فهرست مسیرها";
        if (this.$route.query.search) this.searchQuery = this.$route.query.search;
        if (this.$route.query.status) {
            this.filterStatus = this.$route.query.status;
        } else if (this.$route.query.installment === "yes") {
            this.filterStatus = "installment";
        }
        if (this.$route.query.sort) this.filterSort = this.$route.query.sort;
        await this.fetchData();
    },
    methods: {
        journeyNodes(path) {
            const count = path.courses_count || 0;
            const total = Math.min(Math.max(count, 2), 5);
            const filledCount = Math.min(count, total);
            return Array.from({ length: total }, (_, i) => ({
                filled: i < filledCount,
            }));
        },
        openItemsModal(items, type) {
            this.itemsForShow = items || [];
            this.itemTypeForShow = type;
            this.isOpenItemsModal = true;
        },
        toggleSelectAll(event) {
            if (event.target.checked) {
                this.selectedIds = this.items.map((item) => item.id);
            } else {
                this.selectedIds = [];
            }
        },
        openBulkDeleteModal() {
            const slugs = this.items.filter((p) => this.selectedIds.includes(p.id)).map((p) => p.slug);
            if (!slugs.length) return;
            this.pathSlugForDelete = slugs;
            this.showDeletePathModal = true;
        },
        onFilterChange() {
            this.currentPage = 1;
            this.mounted = false;
            this.updateUrlAndFetchData();
        },
        onPerPageChange() {
            this.currentPage = 1;
            this.mounted = false;
            this.updateUrlAndFetchData();
        },
        clearSearch() {
            this.searchQuery = "";
            this.onFilterChange();
        },
        handleSearch() {
            clearTimeout(this._searchTimer);
            this._searchTimer = setTimeout(() => {
                this.currentPage = 1;
                this.mounted = false;
                this.updateUrlAndFetchData();
            }, 800);
        },
        updateUrlAndFetchData() {
            const params = new URLSearchParams();
            if (this.filterStatus === "installment") {
                params.set("installment", "yes");
            } else if (this.filterStatus !== "all") {
                params.set("status", this.filterStatus);
            }
            if (this.filterSort !== "newest") params.set("sort", this.filterSort);
            if (this.currentPage !== 1) params.set("page", this.currentPage);
            if (this.searchQuery) params.set("search", this.searchQuery);
            const queryString = params.toString();
            const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
            window.history.pushState(null, "", newUrl);
            this.fetchData();
        },
        clearFilters() {
            this.filterStatus = "all";
            this.filterSort = "newest";
            this.searchQuery = "";
            this.currentPage = 1;
            this.mounted = false;
            this.updateUrlAndFetchData();
        },
        buildQuery() {
            const params = {
                page: this.currentPage,
                perPage: this.perPage,
                sort: this.filterSort,
            };
            if (this.filterStatus === "installment") {
                params.installment = "yes";
            } else if (this.filterStatus !== "all") {
                params.status = this.filterStatus;
            }
            if (this.searchQuery) params.search = this.searchQuery;
            return params;
        },
        async fetchData() {
            this.loading = true;
            try {
                const res = await axiosInstance.post("/admin/paths", this.buildQuery());
                if (res.data.message === "Success") {
                    this.items = res.data.paths;
                    this.pagination = res.data.pagination;
                }
            } catch (e) {
                console.error("Error fetching paths", e);
            } finally {
                this.loading = false;
                this.mounted = true;
            }
        },
        updatePage(page) {
            this.currentPage = page;
            this.mounted = false;
            this.updateUrlAndFetchData();
        },
        formatDate(dateString) {
            if (!dateString) return "—";
            return new Date(dateString).toLocaleDateString("fa-IR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            });
        },
        openDeletePathModal(slug) {
            this.pathSlugForDelete = slug;
            this.showDeletePathModal = true;
        },
        closeDeletePathModal() {
            this.showDeletePathModal = false;
            this.pathSlugForDelete = null;
        },
        onPathsDeleted() {
            this.selectedIds = [];
            this.closeDeletePathModal();
            this.mounted = false;
            this.fetchData();
        },
    },
};
</script>
