<template>
    <div class="flex flex-col  space-y-8">
        <div v-if="showFilterQuestions" class="w-full">
            <div class="bg-white dark:bg-gray-900 p-2  rounded-xl">
                <Disclosure defaultOpen v-slot="{ open }">
                    <DisclosureButton
                        class="flex w-full justify-between items-center text-gray-800 dark:text-gray-50 rounded-lg px-4 py-2 text-start text-base font-bold  focus:outline-none">
                        <span>{{ $t('discuss.sidebar.filterQuestions') }}</span>
                        <ChevronUpIcon :class="open ? 'rotate-180 transform' : ''" class="h-5 w-5 text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-md p-1 justify-center" />
                    </DisclosureButton>
                    <DisclosurePanel class="px-4 pb-2 pt-2 text-sm text-gray-500">
                        <div class="pt-4 flex flex-col border-t space-y-6 border-gray-100 dark:border-opacity-20">
                            <label class="cursor-pointer flex items-center">
                                <input type="radio" value="all" v-model="selectedQuestionFilter" :checked="(selectedQuestionFilter == 'all' || selectedQuestionFilter == '') ? true : false"
                                    @change="emitFilterChange('filter', selectedQuestionFilter)"
                                    class="radio radio-warning bg-gray-300 border-none w-5 h-5 me-3 focus:ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900" />
                                <span class="text-gray-700 dark:text-gray-300 text-sm font-semibold">{{ $t('discuss.sidebar.allQuestions') }}</span>
                            </label>
                            <label v-if="isLoggedin" class="cursor-pointer flex items-center">
                                <input type="radio" value="my-question" v-model="selectedQuestionFilter"
                                    @change="emitFilterChange('filter', selectedQuestionFilter)"
                                    class="radio radio-warning bg-gray-300 border-none w-5 h-5 me-3 focus:ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900" />
                                <span class="text-gray-700 dark:text-gray-300 text-sm font-semibold">{{ $t('discuss.sidebar.myDiscussions') }}</span>
                            </label>
                            <label v-if="isLoggedin" class="cursor-pointer flex items-center">
                                <input type="radio" value="private_discuss" v-model="selectedQuestionFilter"
                                    @change="emitFilterChange('filter', selectedQuestionFilter)"
                                    class="radio radio-warning bg-gray-300 border-none w-5 h-5 me-3 focus:ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900" />
                                <span class="text-gray-700 dark:text-gray-300 text-sm font-semibold">{{ $t('discuss.sidebar.privateDiscussions') }}</span>
                            </label>
                            <label v-if="isLoggedin" class="cursor-pointer flex items-center">
                                <input type="radio" value="followed_discuss" v-model="selectedQuestionFilter"
                                    @change="emitFilterChange('filter', selectedQuestionFilter)"
                                    class="radio radio-warning bg-gray-300 border-none w-5 h-5 me-3 focus:ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900" />
                                <span class="text-gray-700 dark:text-gray-300 text-sm font-semibold">{{ $t('discuss.sidebar.followedDiscussions') }}</span>
                            </label>
                            <label v-if="isLoggedin" class="cursor-pointer flex items-center">
                                <input type="radio" value="contributed_to" v-model="selectedQuestionFilter"
                                    @change="emitFilterChange('filter', selectedQuestionFilter)"
                                    class="radio radio-warning bg-gray-300 border-none w-5 h-5 me-3 focus:ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900" />
                                <span class="text-gray-700 dark:text-gray-300 text-sm font-semibold">{{ $t('discuss.sidebar.myContributions') }}</span>
                            </label>
                            <label class="cursor-pointer flex items-center">
                                <input type="radio" value="best-answer" v-model="selectedQuestionFilter"
                                    @change="emitFilterChange('filter', selectedQuestionFilter)"
                                    class="radio radio-warning bg-gray-300 border-none w-5 h-5 me-3 focus:ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900" />
                                <span class="text-gray-700 dark:text-gray-300 text-sm font-semibold">{{ $t('discuss.sidebar.solved') }}</span>
                            </label>
                            <label class="cursor-pointer flex items-center">
                                <input type="radio" value="no-best-answer" v-model="selectedQuestionFilter"
                                    @change="emitFilterChange('filter', selectedQuestionFilter)"
                                    class="radio radio-warning bg-gray-300 border-none w-5 h-5 me-3 focus:ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900" />
                                <span class="text-gray-700 dark:text-gray-300 text-sm font-semibold">{{ $t('discuss.sidebar.unsolved') }}</span>
                            </label>
                            <label class="cursor-pointer flex items-center">
                                <input type="radio" value="no-answer" v-model="selectedQuestionFilter"
                                    @change="emitFilterChange('filter', selectedQuestionFilter)"
                                    class="radio radio-warning bg-gray-300 border-none w-5 h-5 me-3 focus:ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900" />
                                <span class="text-gray-700 dark:text-gray-300 text-sm font-semibold">{{ $t('discuss.sidebar.noAnswers') }}</span>
                            </label>
                        </div>
                    </DisclosurePanel>
                </Disclosure>
            </div>
        </div>

        <div v-if="showLinkFilterQuestions" class="w-full">
            <div class="bg-white dark:bg-gray-900 p-2  rounded-xl">
                <Disclosure defaultOpen v-slot="{ open }">
                    <DisclosureButton
                        class="flex w-full justify-between items-center text-gray-800 dark:text-gray-50 rounded-lg px-4 py-2 text-start text-base font-bold  focus:outline-none">
                        <span>{{ $t('discuss.sidebar.filterQuestions') }}</span>
                        <ChevronUpIcon :class="open ? 'rotate-180 transform' : ''" class="h-5 w-5 text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-md p-1 justify-center" />
                    </DisclosureButton>
                    <DisclosurePanel class="px-4 pb-2 pt-2 text-sm text-gray-500">
                        <div class="pt-4 flex flex-col border-t space-y-6 border-gray-100 dark:border-opacity-20">
                            <router-link :to="{ name: 'discuss-index', query: { 'filter': 'all' } }"
                                class="cursor-pointer flex items-center">
                                <span class="text-gray-700 dark:text-gray-300 text-sm font-semibold">{{ $t('discuss.sidebar.allQuestions') }}</span>
                            </router-link>
                            <router-link v-if="isLoggedin"
                                :to="{ name: 'discuss-index', query: { 'filter': 'my-question' } }"
                                class="cursor-pointer flex items-center">
                                <span class="text-gray-700 dark:text-gray-300 text-sm font-semibold">{{ $t('discuss.sidebar.myDiscussions') }}</span>
                            </router-link>
                            <router-link v-if="isLoggedin"
                                :to="{ name: 'discuss-index', query: { 'filter': 'private_discuss' } }"
                                class="cursor-pointer flex items-center">
                                <span class="text-gray-700 dark:text-gray-300 text-sm font-semibold">{{ $t('discuss.sidebar.privateDiscussions') }}</span>
                            </router-link>
                            <router-link v-if="isLoggedin"
                                :to="{ name: 'discuss-index', query: { 'filter': 'followed_discuss' } }"
                                class="cursor-pointer flex items-center">
                                <span class="text-gray-700 dark:text-gray-300 text-sm font-semibold">{{ $t('discuss.sidebar.followedDiscussions') }}</span>
                            </router-link>
                            <router-link v-if="isLoggedin"
                                :to="{ name: 'discuss-index', query: { 'filter': 'contributed_to' } }"
                                class="cursor-pointer flex items-center">
                                <span class="text-gray-700 dark:text-gray-300 text-sm font-semibold">{{ $t('discuss.sidebar.myContributions') }}</span>
                            </router-link>
                            <router-link :to="{ name: 'discuss-index', query: { 'filter': 'best-answer' } }"
                                class="cursor-pointer flex items-center">
                                <span class="text-gray-700 dark:text-gray-300 text-sm font-semibold">{{ $t('discuss.sidebar.solved') }}</span>
                            </router-link>
                            <router-link :to="{ name: 'discuss-index', query: { 'filter': 'no-best-answer' } }"
                                class="cursor-pointer flex items-center">
                                <span class="text-gray-700 dark:text-gray-300 text-sm font-semibold">{{ $t('discuss.sidebar.unsolved') }}</span>
                            </router-link>
                            <router-link :to="{ name: 'discuss-index', query: { 'filter': 'no-answer' } }"
                                class="cursor-pointer flex items-center">
                                <span class="text-gray-700 dark:text-gray-300 text-sm font-semibold">{{ $t('discuss.sidebar.noAnswers') }}</span>
                            </router-link>
                        </div>
                    </DisclosurePanel>
                </Disclosure>
            </div>
        </div>

        <div v-if="showCategories" class="w-full">
            <div class="bg-white dark:bg-gray-900 p-2  rounded-xl">
                <Disclosure defaultOpen v-slot="{ open }">
                    <DisclosureButton
                        class="flex w-full justify-between items-center text-gray-800 dark:text-gray-50 rounded-lg px-4 py-2 text-start text-base font-bold  focus:outline-none">
                        <span>{{ $t('discuss.sidebar.categories') }}</span>
                        <ChevronUpIcon :class="open ? 'rotate-180 transform' : ''" class="h-5 w-5 text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-md p-1 justify-center" />
                    </DisclosureButton>
                    <DisclosurePanel class="px-4 pb-2 pt-2 text-sm text-gray-500">
                        <div class="pt-4 flex flex-col border-t border-gray-100 dark:border-opacity-20">
                            <div
                                class="flex flex-col space-y-6 overflow-hidden transition-all duration-300 ease-in-out"
                                :style="{ maxHeight: categoriesExpanded ? `${categories.length * 2.5}rem` : `${Math.min(categories.length, categoryPreviewCount) * 2.5}rem` }">
                                <label v-for="(category, i) in categories" :key="i"
                                    class="cursor-pointer flex items-center shrink-0">
                                    <input type="checkbox" :value="category.title" v-model="selectedCategories"
                                        @change="emitFilterChange('categories', selectedCategories)"
                                        class="appearance-none w-5 h-5 me-3 checked:is-checked rounded-lg bg-gray-200 checked:bg-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ring-offset-white dark:ring-offset-gray-900 focus:outline-none transition relative custom-checkbox" />
                                    <span class="text-gray-700 dark:text-gray-300 text-sm font-semibold">{{ category.title
                                        }}</span>
                                </label>
                            </div>
                            <button
                                v-if="categories.length > categoryPreviewCount"
                                type="button"
                                @click="categoriesExpanded = !categoriesExpanded"
                                class="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:text-amber-600 transition">
                                <svg
                                    class="w-4 h-4 transition-transform duration-300"
                                    :class="categoriesExpanded ? 'rotate-180' : ''"
                                    viewBox="0 0 24 24"
                                    fill="none">
                                    <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                {{ categoriesExpanded ? $t('discuss.sidebar.showLess') : $t('discuss.sidebar.showMore') }}
                            </button>
                        </div>
                    </DisclosurePanel>
                </Disclosure>
            </div>
        </div>

        <div v-if="showLinkCategories" class="w-full">
            <div class="bg-white dark:bg-gray-900 p-2  rounded-xl">
                <Disclosure defaultOpen v-slot="{ open }">
                    <DisclosureButton
                        class="flex w-full justify-between items-center text-gray-800 dark:text-gray-50 rounded-lg px-4 py-2 text-start text-base font-bold  focus:outline-none">
                        <span>{{ $t('discuss.sidebar.categories') }}</span>
                        <ChevronUpIcon :class="open ? 'rotate-180 transform' : ''" class="h-5 w-5 text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-md p-1 justify-center" />
                    </DisclosureButton>
                    <DisclosurePanel class="px-4 pb-2 pt-2 text-sm text-gray-500">
                        <div class="pt-4 flex flex-col border-t border-gray-100 dark:border-opacity-20">
                            <div
                                class="flex flex-col space-y-6 overflow-hidden transition-all duration-300 ease-in-out"
                                :style="{ maxHeight: categoriesExpanded ? `${categories.length * 2.5}rem` : `${Math.min(categories.length, categoryPreviewCount) * 2.5}rem` }">
                                <router-link v-for="(category, i) in categories" :key="i"
                                    :to="{ name: 'discuss-index', query: { 'cat[0]': category.title } }"
                                    class="cursor-pointer flex items-center shrink-0">
                                    <span class="text-gray-700 dark:text-gray-300 text-sm font-semibold">{{ category.title
                                        }}</span>
                                </router-link>
                            </div>
                            <button
                                v-if="categories.length > categoryPreviewCount"
                                type="button"
                                @click="categoriesExpanded = !categoriesExpanded"
                                class="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 hover:text-amber-600 transition">
                                <svg
                                    class="w-4 h-4 transition-transform duration-300"
                                    :class="categoriesExpanded ? 'rotate-180' : ''"
                                    viewBox="0 0 24 24"
                                    fill="none">
                                    <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                {{ categoriesExpanded ? $t('discuss.sidebar.showLess') : $t('discuss.sidebar.showMore') }}
                            </button>
                        </div>
                    </DisclosurePanel>
                </Disclosure>
            </div>
        </div>

        <div v-if="showPopularTags" class="w-full">
            <div class="bg-white dark:bg-gray-900 p-2  rounded-xl">
                <Disclosure defaultOpen v-slot="{ open }">
                    <DisclosureButton
                        class="flex w-full justify-between items-center text-gray-800 dark:text-gray-50 rounded-lg px-4 py-2 text-start text-base font-bold  focus:outline-none">
                        <span>{{ $t('discuss.sidebar.popularTags') }}</span>
                        <ChevronUpIcon :class="open ? 'rotate-180 transform' : ''" class="h-5 w-5 text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-md p-1 justify-center" />
                    </DisclosureButton>
                    <DisclosurePanel class="px-4 pb-2 pt-2 text-sm text-gray-500">
                        <div
                            class="pt-4 gap-1 flex flex-wrap items-center border-t border-gray-100 dark:border-opacity-20">
                            <TagChip
                                v-for="(tag, i) in popularTags"
                                :key="i"
                                :tag="tag"
                                variant="sidebar" />
                                
                        </div>
                        <hr class="mx-4 my-2 border-t border-dashed border-gray-100  dark:border-gray-800"/>
                            <router-link
                                :to="{ name: 'tags-index' }"
                                class="flex items-center justify-center text-xs font-semibold text-amber-500 hover:text-amber-600 px-2 py-1">
                                {{ $t('tags.viewAll') }}
                            </router-link>
                    </DisclosurePanel>
                </Disclosure>
            </div>
        </div>

        <div v-if="showMyTags && isLoggedin" class="w-full">
            <div class="bg-white dark:bg-gray-900 p-2  rounded-xl">
                <Disclosure v-slot="{ open }">
                    <DisclosureButton
                        class="flex w-full justify-between items-center text-gray-800 dark:text-gray-50 rounded-lg px-4 py-2 text-start text-base font-bold  focus:outline-none">
                        <span>{{ $t('discuss.sidebar.myTags') }}</span>
                        <ChevronUpIcon :class="open ? 'rotate-180 transform' : ''" class="h-5 w-5 text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-md p-1 justify-center" />
                    </DisclosureButton>
                    <DisclosurePanel class="px-4 pb-2 pt-2 text-sm text-gray-500">
                        <div
                            class="pt-4 flex flex-wrap items-center gap-1 border-t border-gray-100 dark:border-opacity-20">
                            <template v-if="myTags && myTags.length > 0">
                                <TagChip
                                    v-for="(tag, i) in myTags"
                                    :key="i"
                                    :tag="tag"
                                    variant="sidebar" />
                            </template>
                            <span v-else
                                class="mb-2 whitespace-nowrap bg-gray-100 text-gray-800 text-xs font-semibold me-2 px-2.5 py-1 rounded-full dark:bg-gray-600 dark:text-gray-300">{{ $t('discuss.sidebar.noTags') }}</span>
                        </div>
                        <router-link
                            :to="{ name: 'tags-index' }"
                            class="mt-2 inline-flex text-xs font-semibold text-amber-500 hover:text-amber-600">
                            {{ $t('tags.viewAll') }}
                        </router-link>
                    </DisclosurePanel>
                </Disclosure>
            </div>
        </div>

        <div v-if="showTopUsers" class="w-full">
            <div class="bg-white dark:bg-gray-900 p-2 rounded-xl">
                <Disclosure v-slot="{ open }">
                    <DisclosureButton
                        class="flex w-full justify-between items-center text-gray-800 dark:text-gray-50 rounded-lg px-4 py-2 text-start text-base font-bold focus:outline-none">
                        <span>{{ $t('discuss.sidebar.topUsers') }}</span>
                        <ChevronUpIcon :class="open ? 'rotate-180 transform' : ''" class="h-5 w-5 text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-md p-1 justify-center" />
                    </DisclosureButton>
                    <DisclosurePanel class="px-4 pb-3 pt-2 text-sm text-gray-500">
                        <div class="pt-3 border-t border-gray-100 dark:border-opacity-20 divide-y divide-gray-100 dark:divide-gray-800">
                            <router-link
                                v-for="(user, i) in topUsers"
                                :key="user.id ?? i"
                                :to="{ name: 'profile-page', params: { username: user.username } }"
                                class="group flex items-center gap-2.5 py-3 first:pt-1 last:pb-0"
                            >
                                <span
                                    class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold"
                                    :class="i === 0
                                        ? 'bg-yellow-400 text-gray-900'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'"
                                >
                                    {{ i + 1 }}
                                </span>
                                <div
                                    class="h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 bg-gray-200 dark:bg-gray-700"
                                    :class="i === 0 ? 'border-yellow-400' : 'border-gray-200 dark:border-gray-700 group-hover:border-yellow-400'"
                                >
                                    <SeoImage
                                        :src="user.profile_pic"
                                        :alt="user.username || 'user'"
                                        :width="44"
                                        :height="44"
                                        sizes-preset="avatar"
                                        img-class="h-full w-full object-cover transition duration-200 group-hover:scale-110"
                                    />
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="truncate text-sm font-bold text-gray-800 dark:text-gray-100">
                                        {{ user.first_name + ' ' + user.last_name }}
                                    </div>
                                    <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                        <span dir="ltr">@{{ user.username }}</span>
                                    </div>
                                </div>
                                <span class="inline-flex shrink-0 items-center gap-0.5 rounded-lg bg-yellow-400/15 px-2 py-1 text-xs font-bold text-gray-800 dark:text-yellow-300 font-anjoman">
                                    {{ Number(user.sum_score || 0).toLocaleString() }}
                                    <svg class="ms-0.5 h-3.5 w-3.5" viewBox="0 0 24 26" fill="none" aria-hidden="true">
                                        <circle opacity="0.15" cx="14.2126" cy="15.8822" r="9.06581" fill="#FFA826"></circle>
                                        <path fill-rule="evenodd" clip-rule="evenodd" fill="#FFA826"
                                            d="M7.78577 0.713257C7.48357 0.713257 7.258 0.877878 7.13 0.993884C6.9892 1.12149 6.86517 1.28299 6.75807 1.44444C6.54185 1.77041 6.32975 2.19628 6.13753 2.62986C5.75017 3.50364 5.40041 4.50831 5.2176 5.05677C5.21492 5.06482 5.20702 5.07114 5.19746 5.07147C4.6247 5.09083 3.57503 5.14219 2.66014 5.27637C2.20816 5.34265 1.75296 5.43405 1.39756 5.56639C1.22256 5.63155 1.03172 5.72094 0.874301 5.85062C0.714983 5.98186 0.525391 6.21188 0.525391 6.54358C0.525391 6.77299 0.612186 6.97607 0.690752 7.12099C0.774965 7.27632 0.88626 7.43027 1.0053 7.57563C1.24391 7.867 1.55941 8.1789 1.88561 8.47554C2.54112 9.07165 3.30023 9.6603 3.73213 9.98575C3.73894 9.99088 3.74211 9.99945 3.7393 10.0087C3.57343 10.5532 3.28536 11.5496 3.10211 12.4737C3.01109 12.9328 2.94081 13.3987 2.93025 13.7922C2.925 13.988 2.93362 14.1906 2.97276 14.3764C3.00922 14.5495 3.08933 14.7924 3.29435 14.9736C3.52445 15.177 3.80139 15.2039 3.99314 15.1921C4.18923 15.1799 4.38562 15.1232 4.56063 15.0571C4.91404 14.9237 5.31299 14.7005 5.69551 14.4596C6.46828 13.9727 7.28654 13.3408 7.75189 12.9693C7.76031 12.9625 7.77268 12.9624 7.78152 12.9694C8.24676 13.3413 9.0657 13.9736 9.84425 14.4607C10.2298 14.702 10.6329 14.9252 10.9924 15.0585C11.1709 15.1246 11.3693 15.1803 11.5672 15.1921C11.7614 15.2038 12.0307 15.1765 12.2605 14.9878C12.4758 14.8111 12.5652 14.5683 12.6067 14.3882C12.6505 14.1986 12.6606 13.9926 12.6558 13.7954C12.646 13.399 12.5721 12.9312 12.4763 12.4724C12.2833 11.5481 11.9781 10.5514 11.8014 10.0046C11.7983 9.9949 11.8016 9.98586 11.8087 9.98054C12.2428 9.65327 13.0002 9.06544 13.6535 8.4708C13.9786 8.17489 14.2929 7.86387 14.5305 7.57329C14.6491 7.4283 14.76 7.27473 14.8438 7.11973C14.9221 6.97505 15.0085 6.77245 15.0085 6.54358C15.0085 6.21223 14.8193 5.98233 14.6601 5.85104C14.5029 5.72136 14.3123 5.63197 14.1375 5.56681C13.7826 5.43449 13.328 5.34309 12.8766 5.27679C11.9629 5.14257 10.9141 5.09106 10.34 5.07159C10.3303 5.07126 10.3226 5.06496 10.32 5.05684C10.1413 4.50675 9.80029 3.50294 9.42076 2.63037C9.23245 2.19744 9.0241 1.77198 8.8106 1.44615C8.70486 1.28478 8.58193 1.12296 8.44163 0.994942C8.31372 0.878233 8.0884 0.713257 7.78577 0.713257Z" />
                                    </svg>
                                </span>
                            </router-link>
                        </div>
                    </DisclosurePanel>
                </Disclosure>
            </div>
        </div>
    </div>
</template>
<script>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { ChevronUpIcon } from '@heroicons/vue/20/solid'
import TagChip from '@/views/components/tag/TagChip.vue'
import SeoImage from '@/views/components/seo/SeoImage.vue'
export default {
    components: {
        Disclosure,
        DisclosureButton,
        DisclosurePanel,
        ChevronUpIcon,
        TagChip,
        SeoImage,
    },
    props: {
        showFilterQuestions: {
            type: Boolean,
            default: false,
        },
        showLinkFilterQuestions: {
            type: Boolean,
            default: false,
        },
        showCategories: {
            type: Boolean,
            default: false,
        },
        categories: {
            type: Array,
            default: () => []
        },
        showLinkCategories: {
            type: Boolean,
            default: false
        },
        showPopularTags: {
            type: Boolean,
            default: false,
        },
        popularTags: {
            type: Array,
            default: () => []
        },
        myTags: {
            type: Array,
            default: () => []
        },
        showMyTags: {
            type: Boolean,
            default: false,
        },
        showTopUsers: {
            type: Boolean,
            default: false,
        },
        topUsers: {
            type: Array,
            default: () => []
        },
        initialSelectedCategories: {
            type: Array,
            default: () => []
        },
        initialSelectedQuestionFilter: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            selectedQuestionFilter: '',
            selectedCategories: [],
            categoriesExpanded: false,
            categoryPreviewCount: 10,
        }
    },
    computed: {
        isLoggedin() {
            return this.$store.state.auth.status.loggedIn;
        },
        currentUser() {
            return this.$store.state.auth.status.userInfo;
        }
    },
    created() {

    },
    mounted() {
        this.selectedCategories = this.initialSelectedCategories.length ? this.initialSelectedCategories : [];
        this.selectedQuestionFilter = this.initialSelectedQuestionFilter ? this.initialSelectedQuestionFilter : '';
    },
    methods: {
        emitFilterChange(filterType, value) {
            this.$emit('filter-change', { filterType, value });
        }
    }
}
</script>
<style scoped>
.custom-checkbox::after {
    content: '';
    position: absolute;
    inset: 0;
    margin: auto;
    display: none;
    color: white;
    font-size: 13px;
    font-weight: bold;
    line-height: 1;
    text-align: center;
    user-select: none;
}

.custom-checkbox.is-checked::after {
    content: '✔';
    display: block;
    margin-top: 5px;
}

.custom-checkbox:indeterminate::after,
.custom-checkbox.is-indeterminate::after {
    content: '';
    display: block;
    margin-top: 9px;
    width: 14px;
    height: 3px;
    background-color: white;
    border-radius: 3px;
}
</style>