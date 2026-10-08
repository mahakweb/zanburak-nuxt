<script setup>
definePageMeta({
  name: "discuss-create",
  middleware: ['auth'],
})
</script>

<template>
    <MasterPage>
        <section class="mx-2"></section>
        <section class="mx-2 my-8">
            <!-- <LoadingComponent v-if="initLoading" class="z-50"/> -->
            <div class="">
                <!-- drawer init and toggle -->
                <div class="lg:hidden w-full text-center">
                    <button
                        class="flex items-center mx-auto text-white dark:text-gray-800 bg-amber-400 hover:bg-amber-500/50 focus:ring-2 focus:ring-amber-300 rounded-lg px-5 py-2.5 mb-2 dark:bg-amber-400 dark:hover:bg-amber-400/70 focus:outline-none dark:focus:ring-amber-600 text-sm font-semibold"
                        type="button" data-drawer-target="bottom-sheet" data-drawer-show="bottom-sheet"
                        data-drawer-placement="bottom" data-drawer-edge="true" data-drawer-edge-offset="bottom-[0px]"
                        aria-controls="bottom-sheet">
                        {{ $t('discuss.list.filters') }}
                        <svg class="w-5 h-5 ms-2" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M0.75 11C0.75 13.2475 0.871405 15.0024 1.17704 16.3776C1.48077 17.7443 1.9564 18.6896 2.63339 19.3666C3.31039 20.0436 4.25571 20.5192 5.62241 20.823C6.99762 21.1286 8.75249 21.25 11 21.25C13.2475 21.25 15.0024 21.1286 16.3776 20.823C17.7443 20.5192 18.6896 20.0436 19.3666 19.3666C20.0436 18.6896 20.5192 17.7443 20.823 16.3776C21.1286 15.0024 21.25 13.2475 21.25 11C21.25 8.75249 21.1286 6.99762 20.823 5.62241C20.5192 4.25571 20.0436 3.31039 19.3666 2.63339C18.6896 1.9564 17.7443 1.48077 16.3776 1.17704C15.0024 0.871405 13.2475 0.75 11 0.75C8.75249 0.75 6.99762 0.871405 5.62241 1.17704C4.25571 1.48077 3.31039 1.9564 2.63339 2.63339C1.9564 3.31039 1.48077 4.25571 1.17704 5.62241C0.871405 6.99762 0.75 8.75249 0.75 11Z"
                                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            </path>
                            <path opacity="0.4"
                                d="M11.0001 6.41663V15.5833M15.5834 10.0833V15.5833M6.41675 11.9166V15.5833"
                                stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            </path>
                        </svg>
                    </button>
                </div>
                <div class="mx-auto max-w-screen-xl md:grid lg:grid-cols-12 gap-3 md:gap-5 lg:gap-7 mb-20">
                    <div class="xl:col-span-9 lg:col-span-8">
                        <div class="p-1 rounded-xl border border-gray-300/30 dark:border-gray-500/30">
                            <div
                                class="overflow-hidden w-full rounded-xl p-3 md:p-5 lg:p-7 bg-white dark:bg-slate-900/40">
                                <div class="flex items-center justify-between rtl:space-x-reverse mb-8">
                                    <div class="relative flex items-center" style="">
                                        <div
                                            class="w-16 h-16 flex me-2 bg-gray-300 group relative rounded-full overflow-hidden border-4 border-solid border-amber-500">
                                            <router-link
                                                :to="{ name: 'profile-page', params: { username: currentUser.username } }">
                                                <SeoImage
                                                    :src="currentUser.profile_pic"
                                                    alt="user-avatar"
                                                    :width="64"
                                                    :height="64"
                                                    sizes-preset="avatar"
                                                    img-class="transition duration-200 transform group-hover:scale-110 w-full h-full object-cover"
                                                />
                                                <div
                                                    class="w-full h-full absolute top-0 right-0 bg-biscay-700 bg-opacity-20 z-0">
                                                </div>
                                            </router-link>
                                        </div>
                                        <div class="">
                                            <div class="space-y-1">
                                                <span class="flex flex-col">
                                                    <router-link
                                                        :to="{ name: 'profile-page', params: { username: currentUser.username } }"
                                                        class="line-clamp-1 text-lg font-semibold dark:text-gray-50 text-gray-800 hover:text-amber-500">
                                                        {{ currentUser.first_name + " " + currentUser.last_name }}
                                                    </router-link>
                                                </span>
                                                <div class="flex text-sm space-x-2 space-x-reverse">
                                                    <div
                                                        class="dark:hover:text-blue-450 dark:text-gray-920 text-gray-400 hover:text-gray-500 ltr">
                                                        <router-link
                                                            :to="{ name: 'profile-page', params: { username: currentUser.username } }"
                                                            dir="ltr" class="line-clamp-1">@{{ currentUser.username
                                                            }}</router-link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div></div>
                                </div>
                                <div
                                    class="font-anjoman dark:bg-slate-900 bg-gray-400 bg-opacity-10 rounded-xl p-4 mb-8">
                                    <div
                                        class="font-bold dark:text-gray-300 text-gray-700 text-xs leading-7">
                                        <span class="text-lg text-yellow-400">*</span>
                                        {{ $t('discuss.form.beforeSubmit') }} 
                                        <span class="text-lg text-yellow-400">*</span>
                                        <p class="mt-2 font-medium dark:text-gray-400 text-gray-600">{{ $t('discuss.form.beforeSubmitDescription') }}</p>
                                    </div>

                                    <ul class="mt- text-xs">
                                        <li class="font-medium dark:text-gray-400 text-gray-600 leading-7">{{ $t('discuss.form.tipNoDuplicate') }}</li>
                                        <li class="font-medium dark:text-gray-400 text-gray-600 leading-7">{{ $t('discuss.form.tipPreview') }}
                                        </li>
                                    </ul>
                                </div>
                                <form class="">
                                    <div>
                                        <label for="subject"
                                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ $t('discuss.form.subjectLabel') }}</label>
                                        <div class="relative">
                                            <div v-if="similarLoading"
                                                class="absolute inset-y-0 end-0 flex items-center pe-3.5 pointer-events-none">
                                                <svg class="w-5 h-5" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="25 25 50 50">
                                                    <circle class="stroke-current text-rose-500 text-opacity-30" cx="50"
                                                        cy="50" r="20" fill="none" stroke-width="8"
                                                        stroke-linecap="round" stroke-dashoffset="0"
                                                        stroke-dasharray="200, 300"></circle>
                                                    <circle class="stroke-current text-rose-500" cx="50" cy="50" r="20"
                                                        fill="none" stroke-width="8" stroke-linecap="round"
                                                        stroke-dashoffset="0" stroke-dasharray="100, 200">
                                                        <animateTransform attributeName="transform" attributeType="XML"
                                                            type="rotate" from="0 50 50" to="360 50 50" dur="2.5s"
                                                            repeatCount="indefinite"></animateTransform>
                                                        <animate attributeName="stroke-dashoffset" values="0;-30;-124"
                                                            dur="1.25s" repeatCount="indefinite"></animate>
                                                        <animate attributeName="stroke-dasharray"
                                                            values="0,200;110,200;110,200" dur="1.25s"
                                                            repeatCount="indefinite"></animate>
                                                    </circle>
                                                </svg>
                                            </div>
                                            <input @keyup="getSimilarQuestions" v-model="subject" autocomplete="off"
                                                type="text" id="subject" aria-describedby="helper-text-explanation"
                                                class="pe-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-amber-500 focus:border-transparent dark:focus:border-transparent block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 dark:focus:ring-amber-500 dark:focus:outline-none"
                                                placeholder="" />
                                        </div>
                                        <span v-if="errors && errors.subject"
                                            class="mt-2 text-red-500 text-xs font-semibold">
                                            {{ errors.subject[0] }}
                                        </span>
                                        <p id="helper-text-explanation"
                                            class="mt-2 text-xs text-gray-500 dark:text-gray-400">{{ $t('discuss.form.subjectHelper') }}</p>
                                        <!-- similar questions -->
                                        <div v-show="similarQuestions && similarQuestions.length > 0"
                                            class="my-4 p-2 md:p-4 max-h-72 overflow-y-auto rounded-xl border border-gray-300/60 dark:border-gray-500/50">
                                            <div class="text-sm font-bold dark:text-gray-50 text-gray-800">{{ $t('discuss.form.similarQuestions') }}</div>
                                            <ul
                                                class="mt-4 space-y-2 text-gray-600 dark:text-gray-400 font-semibold text-sm">
                                                <li v-for="(question, i) in similarQuestions" :key="i"
                                                    class="hover:text-amber-500 duration-150 flex flex-col md:flex-row md:items-center md:justify-between rounded-xl border border-gray-300/60 dark:border-gray-500/50 p-3 hover:shadow hover:shadow-amber-400 dark:hover:shadow-slate-700">
                                                    <span class="line-clamp-1 leading-6 flex items-center">
                                                        <svg class="w-5 h-5 me-2" viewBox="0 0 24 24" fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                                d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22ZM12 7.75C11.3787 7.75 10.875 8.25368 10.875 8.875C10.875 9.28921 10.5392 9.625 10.125 9.625C9.71079 9.625 9.375 9.28921 9.375 8.875C9.375 7.42525 10.5503 6.25 12 6.25C13.4497 6.25 14.625 7.42525 14.625 8.875C14.625 9.58584 14.3415 10.232 13.883 10.704C13.7907 10.7989 13.7027 10.8869 13.6187 10.9708C13.4029 11.1864 13.2138 11.3753 13.0479 11.5885C12.8289 11.8699 12.75 12.0768 12.75 12.25V13C12.75 13.4142 12.4142 13.75 12 13.75C11.5858 13.75 11.25 13.4142 11.25 13V12.25C11.25 11.5948 11.555 11.0644 11.8642 10.6672C12.0929 10.3733 12.3804 10.0863 12.6138 9.85346C12.6842 9.78321 12.7496 9.71789 12.807 9.65877C13.0046 9.45543 13.125 9.18004 13.125 8.875C13.125 8.25368 12.6213 7.75 12 7.75ZM12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z"
                                                                fill="currentColor"></path>
                                                        </svg>
                                                        {{ question.subject }}
                                                    </span>
                                                    <router-link target="_blank"
                                                        :to="{ name: 'question-show', params: { questionSlug: question.slug } }"
                                                        class="ms-3 md:ms-6 whitespace-nowrap flex items-center justify-end mt-3 md:mt-0">
                                                        {{ $t('discuss.form.viewQuestion') }}
                                                        <svg class="ltr:rotate-180 w-5 h-5 ms-2" fill="none"
                                                            version="1.1" xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 512 512" xml:space="preserve">
                                                            <path fill="currentColor"
                                                                d="M298.667,204.799H204.8v-85.333c0-3.209-1.8-6.153-4.659-7.603c-2.85-1.459-6.289-1.178-8.892,0.7L3.516,249.096 C1.306,250.708,0,253.268,0,255.999s1.306,5.291,3.516,6.903l187.733,136.533c1.485,1.084,3.251,1.63,5.018,1.63 c1.323,0,2.654-0.307,3.874-0.93c2.859-1.451,4.659-4.395,4.659-7.603v-85.333h93.867c4.719,0,8.533-3.814,8.533-8.533v-85.333 C307.2,208.613,303.386,204.799,298.667,204.799z">
                                                            </path>
                                                            <path fill="currentColor"
                                                                d="M349.867,204.799c-14.114,0-25.6,11.486-25.6,25.6v51.2c0,14.114,11.486,25.6,25.6,25.6s25.6-11.486,25.6-25.6v-51.2 C375.467,216.285,363.981,204.799,349.867,204.799z">
                                                            </path>
                                                            <path fill="currentColor"
                                                                d="M418.133,204.799c-14.114,0-25.6,11.486-25.6,25.6v51.2c0,14.114,11.486,25.6,25.6,25.6s25.6-11.486,25.6-25.6v-51.2 C443.733,216.285,432.247,204.799,418.133,204.799z">
                                                            </path>
                                                            <path fill="currentColor"
                                                                d="M486.4,204.799c-14.114,0-25.6,11.486-25.6,25.6v51.2c0,14.114,11.486,25.6,25.6,25.6s25.6-11.486,25.6-25.6v-51.2 C512,216.285,500.514,204.799,486.4,204.799z">
                                                            </path>
                                                        </svg>
                                                    </router-link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div class="mt-8">
                                        <label for="category"
                                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ $t('discuss.form.categoryLabel') }}</label>
                                        <div v-if="initLoading"
                                            class="mb-3 animate-shimmer shimmer-gray-100 dark:shimmer-slate-500 rounded-lg w-full h-11 bg-gray-200 dark:bg-gray-600">
                                        </div>
                                        <select v-else-if="initData.categories" id="category" v-model="category"
                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-amber-500 focus:border-transparent dark:focus:border-transparent block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 dark:focus:ring-amber-500 dark:focus:outline-none">
                                            <option selected></option>
                                            <option v-for="(category, i) in initData.categories" :key="i"
                                                :value="category.id">{{ category.title }}</option>
                                        </select>
                                        <span v-if="errors && errors.category"
                                            class="mt-2 text-red-500 text-xs font-semibold">
                                            {{ errors.category[0] }}
                                        </span>
                                    </div>

                                    <div class="mt-4">
                                        <EditorComponent
                                            :previewClass="['bg-gray-100', 'dark:bg-gray-800']"
                                            :bodyClass="['bg-gray-50', 'dark:bg-gray-700', 'rounded-xl', 'text-gray-700', 'dark:text-gray-100']"
                                            :focusedBorder="'1px #f59e0b solid'" :errorBorder="'1px #ef4444 solid'"
                                            :submitButton="false" :cancelButton="false"
                                            :errors="errors && errors.question ? errors.question[0] : ''"
                                            v-model="question"> </EditorComponent>
                                    </div>
                                    <div class="mt-10">
                                        <label for="tags"
                                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ $t('discuss.form.tagsLabel') }}</label>

                                        <vue3-tags-input
                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:border-none dark:focus:outline-none dark:focus:border-none focus-within:border-transparent dark:focus-within:border-transparent focus-within:ring-amber-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus-within:ring-1 dark:text-white dark:focus-within:ring-amber-500"
                                            :placeholder="$t('discuss.form.tagsPlaceholder')"
                                            :limit="3" :loading="true" :tags="tags"
                                            @on-tags-changed="handleChangeTag" />
                                        <span v-if="errors && errors.tags"
                                            class="mt-2 text-red-500 text-xs font-semibold">
                                            {{ errors.tags[0] }}
                                        </span>
                                        <div v-for="(messages, key) in errors" :key="key">
                                            <template v-if="key.startsWith('tags.')">
                                                <div v-for="(message, index) in messages" :key="index"
                                                    class="mt-2 text-red-500 text-xs font-semibold">{{ $t('discuss.form.tagError', { message: message.replace(key, tags[key.split(".")[1]]) }) }}</div>
                                            </template>
                                        </div>
                                    </div>
                                    <div class="mt-10">
                                        <label for="meta_keywords"
                                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ $t('discuss.form.keywordsLabel') }}
                                            <span class="text-gray-400">{{ $t('discuss.form.keywordsLimit') }}</span>
                                        </label>
                                        <textarea id="meta_keywords" rows="3" v-model="meta_keywords"
                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-amber-500 focus:border-transparent dark:focus:border-transparent block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 dark:focus:ring-amber-500 dark:focus:outline-none"
                                            :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.meta_keywords }"
                                            placeholder=""></textarea>
                                        <span v-if="errors && errors.meta_keywords"
                                            class="mt-2 text-red-500 text-xs font-semibold">
                                            {{ errors.meta_keywords[0] }}
                                        </span>
                                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                            {{ $t('discuss.form.keywordsHelper') }}
                                            <span class="block mt-1" :class="metaKeywordsCount < 3 || metaKeywordsCount > 10 ? 'text-rose-500' : 'text-green-500'">
                                                {{ $t('discuss.form.keywordsCount', { count: metaKeywordsCount }) }}
                                            </span>
                                        </p>
                                    </div>
                                    <!-- <hr class="my-2 h-0.5 border border-gray-200 dark:border-gray-500"> -->
                                    <div class="my-8">
                                        <label for="mentions"
                                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ $t('discuss.form.typeLabel') }}</label>
                                        <div
                                            class="my-4 flex items-center text-sm font-semibold text-gray-600 dark:text-gray-100">
                                            <span class="">{{ $t('discuss.form.public') }}</span>
                                            <label class="mx-2 relative inline-flex items-center me-2 cursor-pointer">
                                                <input type="checkbox" value="" v-model="is_private"
                                                    class="sr-only peer" />
                                                <div
                                                    class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-2 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-400">
                                                </div>
                                            </label>
                                            <span class="">{{ $t('discuss.form.private') }}</span>
                                            <div v-if="errors && errors.is_private"
                                                class="mt-2 text-red-500 text-xs font-semibold">
                                                {{ errors.is_private[0] }}
                                            </div>
                                        </div>
                                        <div class="mention-users">
                                            <TransitionRoot appear :show="is_private" as="div"
                                                enter="transform transition duration-[400ms]"
                                                enter-from="opacity-0 scale-50"
                                                enter-to="opacity-100 rotate-0 scale-100"
                                                leave="transform duration-200 transition ease-in-out"
                                                leave-from="opacity-100 rotate-0 scale-100 "
                                                leave-to="opacity-0 scale-95 ">
                                                <div class="mt-4 dark:bg-slate-900/80 dark:border-opacity-0 border-blue-700 bg-blue-700 bg-opacity-5 rounded-md p-4"
                                                    style="">
                                                    <ul class="text-sm">
                                                        <li
                                                            class="font-semibold dark:text-blue-600 text-blue-700 leading-7">
                                                            {{ $t('discuss.form.privateTip1') }}</li>
                                                        <li
                                                            class="font-semibold dark:text-blue-600 text-blue-700 leading-7">
                                                            {{ $t('discuss.form.privateTip2') }}</li>
                                                    </ul>
                                                </div>

                                                <vue3-tags-input
                                                    class="mt-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:border-none dark:focus:outline-none dark:focus:border-none focus-within:border-transparent dark:focus-within:border-transparent focus-within:ring-amber-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 focus-within:ring-1 dark:text-white dark:focus-within:ring-amber-500"
                                                    :placeholder="$t('discuss.form.mentionPlaceholder')"
                                                    :loading="true" :tags="mention_users"
                                                    @on-tags-changed="handleChangeMentionUsers" />

                                                <span v-if="errors && errors.mention_users"
                                                    class="mt-2 text-red-500 text-xs font-semibold">
                                                    {{ errors.mention_users[0] }}
                                                </span>
                                                <div v-for="(messages, key) in errors" :key="key">
                                                    <template v-if="key.startsWith('mention_users.')">
                                                        <div v-for="(message, index) in messages" :key="index"
                                                            class="mt-2 text-red-500 text-xs font-semibold">{{ $t('discuss.form.userError', { message: message.replace(key, mention_users[key.split(".")[1]]) }) }}
                                                        </div>
                                                    </template>
                                                </div>
                                            </TransitionRoot>
                                        </div>
                                    </div>
                                    <hr class="my-2 h-0.5 border border-gray-200 dark:border-gray-500" />
                                    <div>
                                        <div class="flex justify-between sm:flex-row flex-col items-center mt-7">
                                            <div
                                                class="flex flex-col text-sm font-normal dark:text-gray-300 text-gray-600 space-y-2">
                                                <span class="">{{ $t('discuss.form.mentionHint') }}</span>
                                                <span class="">{{ $t('discuss.form.editorHint') }}</span>
                                            </div>

                                            <div>
                                                <button v-if="!submitLoading" type="submit"
                                                    @click.prevent="submitQuestion"
                                                    class="w-24 h-10 dark:hover:bg-transparent bg-amber-500 border-amber-500 border text-white text-sm font-semibold rounded-md transition duration-200 hover:bg-transparent hover:text-amber-500">{{ $t('discuss.form.submitDiscussion') }}</button>
                                                <button v-else type="button" disabled
                                                    class="disabled w-24 items-center justify-center flex h-10 bg-amber-500 border-amber-500 border text-white text-sm font-semibold rounded-md transition duration-200">
                                                    <svg class="w-5 h-5" version="1.1"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        xmlns:xlink="http://www.w3.org/1999/xlink"
                                                        viewBox="25 25 50 50">
                                                        <circle class="stroke-current text-white text-opacity-30"
                                                            cx="50" cy="50" r="20" fill="none" stroke-width="8"
                                                            stroke-linecap="round" stroke-dashoffset="0"
                                                            stroke-dasharray="200, 300">
                                                        </circle>
                                                        <circle class="stroke-current text-white" cx="50" cy="50" r="20"
                                                            fill="none" stroke-width="8" stroke-linecap="round"
                                                            stroke-dashoffset="0" stroke-dasharray="100, 200">
                                                            <animateTransform attributeName="transform"
                                                                attributeType="XML" type="rotate" from="0 50 50"
                                                                to="360 50 50" dur="2.5s" repeatCount="indefinite">
                                                            </animateTransform>
                                                            <animate attributeName="stroke-dashoffset"
                                                                values="0;-30;-124" dur="1.25s"
                                                                repeatCount="indefinite"></animate>
                                                            <animate attributeName="stroke-dasharray"
                                                                values="0,200;110,200;110,200" dur="1.25s"
                                                                repeatCount="indefinite"></animate>
                                                        </circle>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="xl:col-span-3 lg:col-span-4 lg:order-first order-last">
                        <div class="hidden lg:block">
                            <div v-if="initLoading" class="flex flex-col">
                                <div class="w-full">
                                    <div class="bg-white dark:bg-gray-900 p-2 rounded-xl">
                                        <div>
                                            <div
                                                class="flex w-full justify-between items-center text-gray-800 dark:text-gray-50 rounded-lg px-4 py-2 text-start text-base font-bold focus:outline-none">
                                                <div
                                                    class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-full w-32 h-2">
                                                </div>
                                                <div
                                                    class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-lg h-5 w-5">
                                                </div>
                                            </div>
                                            <div class="px-4 pb-2 pt-2 text-sm text-gray-500">
                                                <div
                                                    class="pt-4 flex flex-col border-t space-y-6 border-gray-100 dark:border-opacity-20">
                                                    <div v-for="i in 6" :key="i" class="flex items-center">
                                                        <div
                                                            class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-lg h-6 w-6 me-3">
                                                        </div>
                                                        <div
                                                            class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-full w-32 h-1.5">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-6 w-full">
                                    <div class="bg-white dark:bg-gray-900 p-2 rounded-xl">
                                        <div>
                                            <div
                                                class="flex w-full justify-between items-center text-gray-800 dark:text-gray-50 rounded-lg px-4 py-2 text-start text-base font-bold focus:outline-none">
                                                <div
                                                    class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-full w-32 h-2">
                                                </div>
                                                <div
                                                    class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-lg h-5 w-5">
                                                </div>
                                            </div>
                                            <div class="px-4 pb-2 pt-2 text-sm text-gray-500">
                                                <div
                                                    class="pt-4 flex flex-col border-t space-y-6 border-gray-100 dark:border-opacity-20">
                                                    <div v-for="i in 6" :key="i" class="flex items-center">
                                                        <div
                                                            class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-full h-6 w-6 me-3">
                                                        </div>
                                                        <div
                                                            class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-full w-32 h-1.5">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <SideBar v-else :showLinkFilterQuestions="true" :showLinkCategories="true"
                                :categories="initData.categories" :showPopularTags="true"
                                :popularTags="initData.popularTags" :showMyTags="false" :showTopUsers="true"
                                :topUsers="initData.topUsers" />
                        </div>
                    </div>

                    <!-- bottom sheet component -->
                    <div id="bottom-sheet"
                        class="lg:hidden fixed z-40 w-full overflow-y-auto bg-white shadow-xl border-t border-gray-200 rounded-t-xl dark:border-gray-800 dark:bg-gray-900 transition-transform bottom-0 left-0 right-0 translate-y-full"
                        tabindex="-1" aria-labelledby="bottom-sheet-label">
                        <div class="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                            data-drawer-toggle="bottom-sheet">
                            <span
                                class="absolute w-24 h-1 -translate-x-1/2 bg-gray-300 rounded-lg top-3 left-1/2 dark:bg-gray-600"></span>
                            <!-- <span id="bottom-sheet-label"
								class="mt-6 mb-3 inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
								<svg class="w-4 h-4 me-2 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24"
									fill="none" xmlns="http://www.w3.org/2000/svg">
									<path opacity="0.2"
										d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22Z"
										fill="currentColor"></path>
									<path
										d="M12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75Z"
										fill="currentColor"></path>
									<path
										d="M12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z"
										fill="currentColor"></path>
								</svg>
								از منوی زیر برای فیلتر و دسته بندی های خود استفاده کنید.
							</span>
							<hr class="mx-2 border-t border-gray-300 dark:border-gray-300/20 h-1" /> -->
                        </div>

                        <div class="max-h-[60vh] overflow-auto mx-1 px-1.5">
                            <div v-if="initLoading" class="flex flex-col">
                                <div class="w-full">
                                    <div class="bg-white dark:bg-gray-900 p-2 rounded-xl">
                                        <div>
                                            <div
                                                class="flex w-full justify-between items-center text-gray-800 dark:text-gray-50 rounded-lg px-4 py-2 text-start text-base font-bold focus:outline-none">
                                                <div
                                                    class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-full w-32 h-2">
                                                </div>
                                                <div
                                                    class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-lg h-5 w-5">
                                                </div>
                                            </div>
                                            <div class="px-4 pb-2 pt-2 text-sm text-gray-500">
                                                <div
                                                    class="pt-4 flex flex-col border-t space-y-6 border-gray-100 dark:border-opacity-20">
                                                    <div v-for="i in 6" :key="i" class="flex items-center">
                                                        <div
                                                            class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-lg h-6 w-6 me-3">
                                                        </div>
                                                        <div
                                                            class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-full w-32 h-1.5">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-6 w-full">
                                    <div class="bg-white dark:bg-gray-900 p-2 rounded-xl">
                                        <div>
                                            <div
                                                class="flex w-full justify-between items-center text-gray-800 dark:text-gray-50 rounded-lg px-4 py-2 text-start text-base font-bold focus:outline-none">
                                                <div
                                                    class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-full w-32 h-2">
                                                </div>
                                                <div
                                                    class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-lg h-5 w-5">
                                                </div>
                                            </div>
                                            <div class="px-4 pb-2 pt-2 text-sm text-gray-500">
                                                <div
                                                    class="pt-4 flex flex-col border-t space-y-6 border-gray-100 dark:border-opacity-20">
                                                    <div v-for="i in 6" :key="i" class="flex items-center">
                                                        <div
                                                            class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-full h-6 w-6 me-3">
                                                        </div>
                                                        <div
                                                            class="animate-shimmer shimmer-gray-200 dark:shimmer-gray-500 bg-gray-300 dark:bg-gray-600 rounded-full w-32 h-1.5">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <SideBar v-else :showLinkFilterQuestions="true" :showLinkCategories="true"
                                :categories="initData.categories" :showPopularTags="true"
                                :popularTags="initData.popularTags" :showMyTags="false" :showTopUsers="true"
                                :topUsers="initData.topUsers" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </MasterPage>
</template>
<script>
import MasterPage from "@/views/page/discuss/layouts/MasterPage.vue";
// import LoadingComponent from "@/views/components/LoadingComponent.vue";
import SideBar from "@/views/page/discuss/layouts/SideBar.vue";
import EditorComponent from "@/views/components/editor/EditorComponent.vue";
import { TransitionRoot } from "@headlessui/vue";
import Vue3TagsInput from "vue3-tags-input";
import axiosInstance from "@/store/axiosInstance";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { useSEO } from "@/composables/useSEO";
import { ref } from "vue";
import debounce from "lodash/debounce";
import SeoImage from "@/views/components/seo/SeoImage.vue";
export default {
    components: {
        MasterPage,
        // LoadingComponent,
        SideBar,
        EditorComponent,
        TransitionRoot,
        Vue3TagsInput,
        SeoImage,
    },
    data() {
        return {
            initLoading: false,
            initData: [],
            similarQuestions: [],
            similarLoading: false,
            similarTimeout: null,
            searchKeyword: "",
            subject: "",
            category: "",
            question: this.$route.query.contact_us === 'true' ? this.$t('discuss.form.contactDefaultBody') : undefined,
            tags: [],
            meta_keywords: "",
            // is_private: false,
            is_private: this.$route.query.private === "true" ? true : false,
            mention_users: this.$route.query.private === "true" ? ["zanburak", "miladmahaki"] : [],
            errors: ref(null),
            submitLoading: false,
        };
    },

    computed: {
        isLoggedin() {
            return this.$store.state.auth.status.loggedIn;
        },
        currentUser() {
            return this.$store.state.auth.status.userInfo;
        },
        metaKeywordsCount() {
            if (!this.meta_keywords) return 0;
            const keywords = this.meta_keywords.split(',').map(k => k.trim()).filter(k => k);
            return keywords.length;
        },
    },
    methods: {
        handleChangeTag(tags) {
            this.tags = tags;
        },
        handleChangeMentionUsers(users) {
            this.mention_users = users;
        },
        getInitData() {
            this.initLoading = true;
            axiosInstance
                .post("/discuss/layouts/getInitData")
                .then((response) => {
                    this.initData = response.data.initData;
                })
                .catch((error) => {
                    console.error(error.response.data.errors);
                })
                .finally(() => {
                    this.initLoading = false;
                });
        },
        getSimilarQuestions: debounce(function () {
            if (this.subject.length >= 3 && this.subject !== this.searchKeyword) {
                this.searchKeyword = this.subject;
                this.similarLoading = true;

                axiosInstance
                    .post("/discuss/layouts/similarQuestions", {
                        keyword: this.subject,
                    })
                    .then((response) => {
                        this.similarQuestions = response.data.similarQuestions;
                    })
                    .catch((error) => {
                        console.error(error.response.data);
                    })
                    .finally(() => {
                        this.similarLoading = false;
                    });
            } else {
                this.similarQuestions = [];
            }
        }, 1500),
        submitQuestion() {
            this.submitLoading = true;
            this.errors = null;
            if (!this.is_private) this.mention_users = [];
            if (this.mention_users.length == 0) this.is_private = false;
            axiosInstance
                .post("/discuss/layouts/create", {
                    subject: this.subject,
                    category: this.category,
                    question: this.question,
                    tags: this.tags,
                    meta_keywords: this.meta_keywords || null,
                    is_private: this.is_private,
                    mention_users: this.mention_users,
                })
                .then(() => {
                    toast.success(this.$t('discuss.form.createSuccess'), {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                })
                .catch((error) => {
                    if (error.response.status === 422) {
                        this.errors = error.response.data.errors;
                    }
                    console.error(error.response.data.errors);
                })
                .finally(() => {
                    this.submitLoading = false;
                });
        },
    },
    watch: {
        subject() {
            this.getSimilarQuestions();
        },
        "initData.categories": {
            handler(newCategories) {
                if (this.$route.query.contact_us === "true") {
                    const foundCategory = newCategories.find((item) => item.slug === "site-feedback");
                    this.category = foundCategory ? foundCategory.id : "";
                }
            },
            deep: true,
        },
    },
    mounted() {
        this.getInitData();
        
        useSEO({
            title: this.$t('discuss.form.createSeoTitle'),
            description: this.$t('discuss.form.createSeoDescription'),
            url: '/discuss/create',
            keywords: [this.$t('discuss.form.createSeoTitle'), this.$t('discuss.list.seoTitle'), this.$t('discuss.question.seoProgrammingQuestion'), this.$t('discuss.list.seoKeyword.programmingForum'), this.$t('common.zanburak'), 'discuss'],
            noindex: true,
            nofollow: true,
        });
    },
};
</script>

<style>
.v3ti-tag {
    @apply bg-gray-600 text-white hover:bg-opacity-90 dark:hover:bg-opacity-90 duration-200 dark:bg-gray-800 dark:text-gray-50 rounded-lg px-3 py-1 !important;
}

.v3ti-remove-tag {
    @apply hover:text-pink-500 hover:scale-125 px-0 ms-2 !important;
}

.mention-users .v3ti-tag-content {
    direction: ltr !important;
}
</style>
