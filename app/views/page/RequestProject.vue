<template>
    <MasterPage>
        <div class="relative overflow-hidden">
            <!-- Decorative background glow -->
            <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div class="absolute -top-40 start-1/2 -translate-x-1/2 h-[36rem] w-[36rem] rounded-full bg-amber-300/25 dark:bg-amber-500/10 blur-3xl"></div>
                <div class="absolute top-1/3 -end-40 h-96 w-96 rounded-full bg-yellow-200/40 dark:bg-yellow-500/5 blur-3xl"></div>
                <div class="absolute bottom-0 -start-40 h-96 w-96 rounded-full bg-orange-200/30 dark:bg-orange-500/5 blur-3xl"></div>
            </div>

            <div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">

                <!-- ===================== HERO ===================== -->
                <section class="mx-auto max-w-3xl text-center pt-16 md:pt-24 pb-10">
                    <span class="inline-flex items-center gap-2 rounded-full border border-amber-300/60 dark:border-amber-500/30 bg-amber-100/70 dark:bg-amber-500/10 px-4 py-1.5 text-sm font-bold text-amber-700 dark:text-amber-300">
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path fill-rule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z" clip-rule="evenodd"></path>
                        </svg>
                        {{ $t('req.seoTitle') }}
                    </span>

                    <h1 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-4xl lg:text-5xl leading-tight">
                        {{ $t('req.heroTitle') }}
                        <span class="relative mx-1 inline-block">
                            <span class="relative z-10 text-amber-500">{{ $t('req.heroHighlight') }}</span>
                            <span class="absolute inset-x-0 bottom-1 h-3 md:h-4 bg-amber-400/40 dark:bg-amber-400/25 rounded"></span>
                        </span>
                    </h1>

                    <p class="mx-auto mt-8 max-w-2xl text-base font-medium leading-8 text-gray-500 dark:text-gray-400">{{ $t('req.intro') }}</p>
                </section>

                <!-- ===================== FORM ===================== -->
                <section class="pb-24">
                    <!-- Verification alert -->
                    <div v-if="currentUser && (!isEmailVerified || !isMobileVerified)" class="mb-6">
                        <div class="flex gap-3 rounded-2xl border border-red-200 dark:border-red-700/40 bg-red-50 dark:bg-red-900/20 p-5" role="alert">
                            <span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-red-600 dark:text-red-400">
                                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                </svg>
                            </span>
                            <div class="min-w-0">
                                <p class="text-sm font-bold text-red-800 dark:text-red-300">{{ $t('req.fixErrors') }}</p>
                                <ul class="mt-2 space-y-2 text-red-700 dark:text-red-300/90">
                                    <li v-if="!isEmailVerified" class="flex items-center gap-1.5 text-xs font-medium">
                                        <span class="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                        <span>{{ $t('req.emailNotVerified') }}</span>
                                        <button @click.prevent="sendVerificationEmail" :disabled="sendVerificationEmailLoading" class="ms-1 inline-flex items-center underline font-bold underline-offset-4 hover:text-red-900 dark:hover:text-red-200">
                                            <svg v-if="sendVerificationEmailLoading" class="w-3.5 h-3.5" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="25 25 50 50">
                                                <circle class="stroke-current text-red-400/50" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dasharray="200, 300"></circle>
                                                <circle class="stroke-current text-red-500" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dasharray="100, 200">
                                                    <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite"></animateTransform>
                                                    <animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s" repeatCount="indefinite"></animate>
                                                    <animate attributeName="stroke-dasharray" values="0,200;110,200;110,200" dur="1.25s" repeatCount="indefinite"></animate>
                                                </circle>
                                            </svg>
                                            <span v-else>{{ $t('req.verifyEmail') }}</span>
                                        </button>
                                </li>
                                    <li v-if="!isMobileVerified" class="flex items-center gap-1.5 text-xs font-medium">
                                        <span class="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                        <span>{{ $t('req.mobileNotVerified') }}</span>
                                        <router-link :to="{ name: 'panel-profile-manage-phone' }" class="ms-1 underline font-bold underline-offset-4 hover:text-red-900 dark:hover:text-red-200">{{ $t('req.verifyMobile') }}</router-link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        <!-- ===== MAIN COLUMN ===== -->
                        <div class="lg:col-span-8 space-y-6">

                            <!-- Card: basics -->
                            <div class="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 md:p-8 shadow-sm">
                                <div class="flex items-center gap-3 mb-6">
                                    <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/15 text-amber-500">
                                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2M9 20h6M12 4v16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            </span>
                                    <h2 class="text-lg font-extrabold text-gray-800 dark:text-white">{{ $t('req.formHeading') }}</h2>
                                </div>

                                <!-- Title -->
                                <div>
                                    <label for="title" class="mb-2 block text-sm font-bold text-gray-600 dark:text-gray-300">{{ $t('req.projectTitle') }}</label>
                                    <input v-model="title" id="title" type="text"
                                        class="h-11 w-full rounded-xl border bg-gray-50 dark:bg-gray-800/60 px-4 text-sm font-semibold text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
                                        :class="errors && errors.title ? 'border-rose-400 text-rose-500 focus:border-rose-400 focus:ring-rose-400/30' : 'border-gray-200 dark:border-gray-700'" />
                                    <span v-if="errors && errors.title" class="mt-2 block text-xs font-semibold text-rose-500">{{ errors.title[0] }}</span>
                                </div>

                                <!-- Type -->
                                <div class="mt-6">
                                    <label class="mb-3 block text-sm font-bold text-gray-600 dark:text-gray-300">{{ $t('req.projectType') }}</label>
                                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <label class="relative cursor-pointer">
                                            <input v-model="type" value="website" name="type" type="radio" class="peer sr-only" />
                                            <div class="flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 transition hover:border-amber-300 peer-checked:border-amber-400 peer-checked:bg-amber-50 peer-checked:text-amber-600 dark:peer-checked:bg-amber-400/10 dark:peer-checked:text-amber-400"
                                                :class="errors && errors.type ? 'border-rose-300 dark:border-rose-500/40' : 'border-gray-200 dark:border-gray-700'">
                                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 8h18M8 21h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                                    {{ $t('req.typeWebsite') }}
                                            </div>
                                </label>
                                        <label class="relative cursor-pointer">
                                            <input v-model="type" value="app" name="type" type="radio" class="peer sr-only" />
                                            <div class="flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 transition hover:border-amber-300 peer-checked:border-amber-400 peer-checked:bg-amber-50 peer-checked:text-amber-600 dark:peer-checked:bg-amber-400/10 dark:peer-checked:text-amber-400"
                                                :class="errors && errors.type ? 'border-rose-300 dark:border-rose-500/40' : 'border-gray-200 dark:border-gray-700'">
                                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><rect x="7" y="2" width="10" height="20" rx="2" stroke="currentColor" stroke-width="2"/><path d="M11 18h2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                                    {{ $t('req.typeApp') }}
                                            </div>
                                </label>
                                        <label class="relative cursor-pointer">
                                            <input v-model="type" value="websiteAndApp" name="type" type="radio" class="peer sr-only" />
                                            <div class="flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 transition hover:border-amber-300 peer-checked:border-amber-400 peer-checked:bg-amber-50 peer-checked:text-amber-600 dark:peer-checked:bg-amber-400/10 dark:peer-checked:text-amber-400"
                                                :class="errors && errors.type ? 'border-rose-300 dark:border-rose-500/40' : 'border-gray-200 dark:border-gray-700'">
                                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M12 3 2 8.5 12 14l10-5.5L12 3ZM2 15.5 12 21l10-5.5" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
                                    {{ $t('req.typeBoth') }}
                                            </div>
                                </label>
                                    </div>
                                    <div v-if="errors && errors.type" class="mt-3 text-xs font-semibold text-rose-500">{{ errors.type[0] }}</div>
                                </div>
                            </div>

                            <!-- Card: description -->
                            <div class="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 md:p-8 shadow-sm">
                                <div class="flex items-center gap-3 mb-5">
                                    <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/15 text-amber-500">
                                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                                    </span>
                                    <h2 class="text-lg font-extrabold text-gray-800 dark:text-white">{{ $t('req.description') }}</h2>
                                </div>
                                <EditorComponent ref="editor" :focusedBorder="'1px #fbbf24 solid'" :errorBorder="'1px #f43f5e solid'" :submitButton="false" :cancelButton="false" :errors="errors && errors.description ? errors.description[0] : ''" v-model="description"></EditorComponent>
                            </div>

                            <!-- Card: attachment -->
                            <div class="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 md:p-8 shadow-sm">
                                <div class="flex items-center gap-3 mb-5">
                                    <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/15 text-amber-500">
                                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                    </span>
                                    <h2 class="text-lg font-extrabold text-gray-800 dark:text-white">{{ $t('req.attachFile') }}</h2>
                                </div>
                                <DropzoneComponent ref="dropzone" :errors="errors && errors.attach_file ? errors.attach_file[0] : ''" @uploaded-files="handleUploadedFiles" :headers="dropzoneHeader" :uploadUrl="`${apiBaseUrl}/request-project/upload-file`" :xhrTimeout="60000" :maxSize="10485760" :allowedFormats="['jpg', 'jpeg', 'png', 'pdf', 'txt', 'rar', 'zip']" :maxFiles="1" :parallelUpload="false" :maxParallelUploads="3" :retryOnError="false" :bulkUpload="false" />
                            </div>
                        </div>

                        <!-- ===== SIDEBAR ===== -->
                        <div class="lg:col-span-4 space-y-6">

                            <!-- Card: budget -->
                            <div class="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 md:p-7 shadow-sm">
                                <div class="flex items-center gap-3 mb-6">
                                    <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-500">
                                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                    </span>
                                    <h2 class="text-lg font-extrabold text-gray-800 dark:text-white">{{ $t('req.minBudget') }} / {{ $t('req.maxBudget') }}</h2>
                                </div>

                                <!-- Min -->
                                <label for="min_price" class="mb-2 block text-sm font-bold text-gray-600 dark:text-gray-300">{{ $t('req.minBudget') }}</label>
                                <div class="relative">
                                    <input v-model="formattedMinPrice" @input="onInputMinPrice" id="min_price" type="text" dir="ltr"
                                        class="h-11 w-full rounded-xl border bg-gray-50 dark:bg-gray-800/60 px-4 pe-16 text-center tracking-wider text-sm font-bold text-gray-700 dark:text-gray-200 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
                                        :class="errors && errors.min_price ? 'border-rose-400 text-rose-500 focus:border-rose-400 focus:ring-rose-400/30' : 'border-gray-200 dark:border-gray-700'" />
                                    <span class="pointer-events-none absolute inset-y-0 end-4 flex items-center text-xs font-bold text-gray-400 dark:text-gray-500">{{ $t('req.toman') }}</span>
                                </div>
                                <div v-if="minPriceInWords" class="mt-1.5 text-[0.68rem] font-medium text-gray-500 dark:text-gray-400">{{ minPriceInWords }} {{ $t('req.toman') }}</div>
                                <span v-if="errors && errors.min_price" class="mt-2 block text-xs font-semibold text-rose-500">{{ errors.min_price[0] }}</span>

                                <div class="my-5 flex items-center gap-3">
                                    <span class="h-px flex-1 bg-gray-200 dark:bg-gray-700"></span>
                                    <span class="text-xs font-bold text-gray-400 dark:text-gray-500">{{ $t('req.to') }}</span>
                                    <span class="h-px flex-1 bg-gray-200 dark:bg-gray-700"></span>
                                </div>

                                <!-- Max -->
                                <label for="max_price" class="mb-2 block text-sm font-bold text-gray-600 dark:text-gray-300">{{ $t('req.maxBudget') }}</label>
                                <div class="relative">
                                    <input v-model="formattedMaxPrice" @input="onInputMaxPrice" id="max_price" type="text" dir="ltr"
                                        class="h-11 w-full rounded-xl border bg-gray-50 dark:bg-gray-800/60 px-4 pe-16 text-center tracking-wider text-sm font-bold text-gray-700 dark:text-gray-200 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
                                        :class="errors && errors.max_price ? 'border-rose-400 text-rose-500 focus:border-rose-400 focus:ring-rose-400/30' : 'border-gray-200 dark:border-gray-700'" />
                                    <span class="pointer-events-none absolute inset-y-0 end-4 flex items-center text-xs font-bold text-gray-400 dark:text-gray-500">{{ $t('req.toman') }}</span>
                                </div>
                                <div v-if="maxPriceInWords" class="mt-1.5 text-[0.68rem] font-medium text-gray-500 dark:text-gray-400">{{ maxPriceInWords }} {{ $t('req.toman') }}</div>
                                <span v-if="errors && errors.max_price" class="mt-2 block text-xs font-semibold text-rose-500">{{ errors.max_price[0] }}</span>
                            </div>

                            <!-- Card: deadline + sample -->
                            <div class="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 md:p-7 shadow-sm">
                                <div class="flex items-center gap-3 mb-6">
                                    <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/15 text-sky-500">
                                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            </span>
                                    <h2 class="text-lg font-extrabold text-gray-800 dark:text-white">{{ $t('req.deadline') }}</h2>
                                </div>

                                <label for="deadline" class="mb-2 block text-sm font-bold text-gray-600 dark:text-gray-300">{{ $t('req.deadline') }}</label>
                                <input v-model="deadline" id="deadline" type="number" min="1" dir="ltr"
                                    class="h-11 w-full rounded-xl border bg-gray-50 dark:bg-gray-800/60 px-4 text-center tracking-wider text-sm font-bold text-gray-700 dark:text-gray-200 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
                                    :class="errors && errors.deadline ? 'border-rose-400 text-rose-500 focus:border-rose-400 focus:ring-rose-400/30' : 'border-gray-200 dark:border-gray-700'" />
                                <span v-if="errors && errors.deadline" class="mt-2 block text-xs font-semibold text-rose-500">{{ errors.deadline[0] }}</span>

                                <div class="my-5 h-px bg-gray-100 dark:bg-gray-800"></div>

                                <label for="sample" class="mb-2 block text-sm font-bold text-gray-600 dark:text-gray-300">{{ $t('req.sample') }}</label>
                                <input v-model="sample" id="sample" dir="ltr" type="url" placeholder="https://zanburak.ir"
                                    class="h-11 w-full rounded-xl border bg-gray-50 dark:bg-gray-800/60 px-4 text-sm font-semibold text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30"
                                    :class="errors && errors.sample ? 'border-rose-400 text-rose-500 focus:border-rose-400 focus:ring-rose-400/30' : 'border-gray-200 dark:border-gray-700'" />
                                <span v-if="errors && errors.sample" class="mt-2 block text-xs font-semibold text-rose-500">{{ errors.sample[0] }}</span>
                            </div>

                            <!-- Card: actions -->
                            <div class="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 md:p-7 shadow-sm lg:sticky lg:top-6">
                                <div class="flex flex-col gap-3">
                                    <button @click="sendRequest" :disabled="loading || !isEmailVerified || !isMobileVerified"
                                        class="group flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 px-5 text-sm font-bold text-gray-900 shadow-lg shadow-amber-500/30 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-lg">
                                        <svg v-if="loading" class="w-5 h-5" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="25 25 50 50">
                                            <circle class="stroke-current text-gray-900/30" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dasharray="200, 300"></circle>
                                            <circle class="stroke-current text-gray-900" cx="50" cy="50" r="20" fill="none" stroke-width="8" stroke-linecap="round" stroke-dasharray="100, 200">
                                                <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite"></animateTransform>
                                                <animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s" repeatCount="indefinite"></animate>
                                                <animate attributeName="stroke-dasharray" values="0,200;110,200;110,200" dur="1.25s" repeatCount="indefinite"></animate>
                                            </circle>
                                    </svg>
                                        <template v-else>
                                            {{ $t('req.submit') }}
                                            <svg class="w-4 h-4 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                        </template>
                                    </button>
                                    <button @click.prevent="resetForm"
                                        class="flex h-12 items-center justify-center gap-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-5 text-sm font-bold text-gray-600 dark:text-gray-300 transition hover:bg-gray-100 dark:hover:bg-gray-700">
                                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M3 12a9 9 0 1 0 3-6.7L3 8m0-5v5h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                        {{ $t('req.resetForm') }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </MasterPage>
</template>
<script>
import MasterPage from "@/views/page/layouts/MasterPage.vue";
import EditorComponent from "@/views/components/editor/EditorComponent.vue";
import DropzoneComponent from "@/views/components/dropzone/DropzoneComponent.vue";
import axiosInstance from "@/store/axiosInstance";
import PN from "persian-number";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import config from "@/store/config";
import { useSEO } from "@/composables/useSEO";
export default {
    components: {
        MasterPage,
        EditorComponent,
        DropzoneComponent,
    },
    data() {
        return {
            dropzoneHeader: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
            },
            apiBaseUrl: config.apiBaseUrl,
            title: "",
            type: "",
            min_price: "",
            formattedMinPrice: "",
            max_price: "",
            formattedMaxPrice: "",
            deadline: "",
            sample: "",
            description: "",
            attach_file: "",
            loading: false,
            errors: null,
            
            sendVerificationEmailLoading: false,
        };
    },
    methods: {
        async sendVerificationEmail() {
            this.sendVerificationEmailLoading = true;
            try {
                const response = await axiosInstance.post("/email/resend");
                toast.success(this.$t("req.toastEmailSent"), {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                console.log(response.data.message);
            } catch (error) {
                console.error(error);
            } finally {
                this.sendVerificationEmailLoading = false;
            }
        },
        handleUploadedFiles(files) {
            if (files && files.length > 0) this.attach_file = files[0].url;
            else this.attach_file = "";
        },
        onInputMinPrice() {
            const rawNumber = this.formattedMinPrice.replace(/[^0-9]/g, "");
            this.formattedMinPrice = rawNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            this.min_price = rawNumber;
        },
        onInputMaxPrice() {
            const rawNumber = this.formattedMaxPrice.replace(/[^0-9]/g, "");
            this.formattedMaxPrice = rawNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            this.max_price = rawNumber;
        },
        resetForm() {
            this.title = "";
            this.type = "";
            this.min_price = "";
            this.formattedMinPrice = "";
            this.max_price = "";
            this.formattedMaxPrice = "";
            this.deadline = "";
            this.sample = "";
            this.description = "";
            this.attach_file = "";
            this.loading = false;
            this.errors = null;
            this.$refs.dropzone.reset();
            this.$refs.editor.reset();
        },
        async sendRequest() {
            this.loading = true;
            this.errors = null;

            try {
                const dz = this.$refs.dropzone;
                if (dz && Array.isArray(dz.selectedFiles) && dz.selectedFiles.length > 0) {
                    const pending = dz.selectedFiles.filter((f) => f.status !== "uploaded");
                    if (pending.length > 0) {
                        await dz.uploadAll();
                    }

                    const notUploaded = dz.selectedFiles.filter((f) => f.status !== "uploaded");
                    if (notUploaded.length > 0) {
                        toast.error(this.$t("req.toastUploadFailed"), {
                            theme: "colored",
                            hideProgressBar: false,
                            rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                            bodyClassName: "font-YekanBakh",
                            toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                            transition: toast.TRANSITIONS.BOUNCE,
                            position: toast.POSITION.BOTTOM_RIGHT,
                        });
                        this.loading = false;
                        return;
                    }

                    if (!this.attach_file && dz.selectedFiles[0] && dz.selectedFiles[0].fileUrl) {
                        this.attach_file = dz.selectedFiles[0].fileUrl;
                    }
                }

                const formData = new FormData();
                formData.append("title", this.title);
                formData.append("type", this.type);
                formData.append("min_price", this.min_price);
                formData.append("max_price", this.max_price);
                formData.append("sample", this.sample);
                formData.append("deadline", this.deadline);
                formData.append("description", this.description);
                formData.append("attach_file", this.attach_file);

                await axiosInstance.post("/request-project", formData).then(
                    (response) => {
                        toast.success(this.$t("req.toastSubmitted"), {
                            theme: "colored",
                            hideProgressBar: false,
                            rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                            bodyClassName: "font-YekanBakh",
                            toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                            transition: toast.TRANSITIONS.BOUNCE,
                            position: toast.POSITION.BOTTOM_RIGHT,
                        });
                        this.resetForm();
                        console.log(response.data);
                    },
                    (error) => {
                        this.errors = error.response.data.errors;
                        console.error(error.response.data.errors);
                    }
                );
            } finally {
                this.loading = false;
            }
        },
    },
    computed: {
        currentUser() {
            const info = this.$store?.state?.auth?.status?.userInfo;
            return info && info.value ? info.value : info;
        },
        isEmailVerified() {
            const user = this.currentUser;
            return !!(user && user.email_verified_at);
        },
        isMobileVerified() {
            const user = this.currentUser;
            return !!(user && user.mobile && user.mobile_verified_at);
        },
        maxPriceInWords() {
            return this.max_price ? PN.convert(parseInt(this.max_price.replace(/,/g, ""))) : "";
        },
        minPriceInWords() {
            return this.min_price ? PN.convert(parseInt(this.min_price.replace(/,/g, ""))) : "";
        },
    },
    mounted() {
        useSEO({
            title: this.$t('req.seoTitle'),
            description: this.$t('req.seoDescription'),
            url: '/request-project',
            keywords: ['درخواست پروژه', 'سفارش پروژه', 'طراحی سایت', 'برنامه‌نویسی', 'توسعه وب', 'زنبورک'],
            noindex: false
        });
    },
};
</script>

<style></style>
