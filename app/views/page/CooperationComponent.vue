<template>
    <MasterPage>
        <div class="mx-auto max-w-screen-xl px-2 mb-20">
            <section class="bg-white dark:bg-gray-900 my-10 md:my-20 rounded-xl">
                <div class="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
                    <div class="md:ps-10 mt-8 md:mt-0 order-last md:order-first col-span-12 md:col-span-7 text-gray-800 dark:text-gray-50 flex flex-col gap-3">
                        <h1 class="max-w-2xl mb-4 text-center ltr:md:text-left rtl:md:text-right text-3xl font-extrabold tracking-tight leading-none md:text-4xl xl:text-5xl text-gray-800 dark:text-white">
                            {{ $t('coop.hero.title1') }}
                            {{ $t('coop.hero.title2') }}
                        </h1>
                        <p class="text-lg font-light text-gray-500 dark:text-gray-400 text-center md:text-start md:me-16">
                            {{ $t('coop.hero.desc') }}
                        </p>
                        <div class="flex items-center mt-auto gap-2 justify-center md:justify-start">
                            <a
                                href="#coop-roles"
                                class="whitespace-nowrap h-10 rounded-lg flex items-center justify-center px-4 text-sm font-semibold focus:outline-none focus:ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-gray-900 text-gray-800 bg-amber-400 hover:shadow-md shadow-amber-400 hover:opacity-90"
                            >
                                {{ $t('coop.hero.cta') }}
                                <svg class="ms-1 w-4 h-4" viewBox="0 0 23 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path opacity="0.4" d="M16.5073 6.34863L21.0752 5.94466C22.1003 5.94466 22.9315 6.7839 22.9315 7.81901C22.9315 8.85412 22.1003 9.69336 21.0752 9.69336L16.5073 9.28938C15.7031 9.28938 15.0511 8.63105 15.0511 7.81901C15.0511 7.00561 15.7031 6.34863 16.5073 6.34863" fill="currentColor"></path>
                                    <path d="M1.16786 6.42292C1.23926 6.35083 1.50598 6.04614 1.75653 5.79314C3.21811 4.20852 7.03437 1.61734 9.03073 0.824345C9.33382 0.697847 10.1003 0.428528 10.5112 0.409485C10.9032 0.409485 11.2776 0.500618 11.6346 0.680164C12.0805 0.931801 12.4361 1.32898 12.6328 1.79689C12.7581 2.12061 12.9548 3.09315 12.9548 3.11084C13.1501 4.17315 13.2565 5.9006 13.2565 7.81032C13.2565 9.62754 13.1501 11.2843 12.9898 12.3643C12.9723 12.3833 12.7756 13.5898 12.5614 14.0033C12.1694 14.7596 11.4029 15.2275 10.5826 15.2275H10.5112C9.97638 15.2098 8.85292 14.7405 8.85292 14.7242C6.96297 13.9312 3.23697 11.4652 1.73902 9.82613C1.73902 9.82613 1.31604 9.40447 1.13284 9.14195C0.84726 8.76381 0.70447 8.29591 0.70447 7.828C0.70447 7.30568 0.864772 6.82009 1.16786 6.42292" fill="currentColor"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div class="flex lg:mt-0 lg:col-span-5 items-center mt-8 md:mt-0">
                        <SeoImage
                            priority
                            img-class="mx-auto w-80 h-auto md:scale-110"
                            :src="engineering_team"
                            :alt="$t('coop.seo.title')"
                        />
                    </div>
                </div>
            </section>

            <div id="coop-roles" class="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                    <article
                        v-for="(item, idx) in roles"
                        :key="idx"
                        class="group relative flex overflow-hidden rounded-2xl bg-white dark:bg-gray-900 ring-1 ring-transparent transition hover:ring-yellow-400/50"
                    >
                        <div class="flex w-16 shrink-0 flex-col items-center justify-center bg-gray-50 px-2 py-4 dark:bg-gray-800/80 sm:w-[4.75rem]">
                            <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400 text-gray-900 sm:h-12 sm:w-12">
                                <span v-html="item.icon" class="flex h-6 w-6 items-center justify-center [&>svg]:h-6 [&>svg]:w-6"></span>
                            </span>
                        </div>

                        <div class="min-w-0 flex-1 p-3 sm:p-4">
                            <div class="flex items-start justify-between gap-3">
                                <h3 class="min-w-0 text-[15px] font-bold leading-7 text-gray-800 dark:text-white sm:text-lg">
                                    {{ item.title }}
                                </h3>
                                <button
                                    type="button"
                                    class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                    :title="$t('coop.details.responsibilities')"
                                    @click.prevent="openDetails(item.key)"
                                >
                                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
                                        <path d="M12 11v5M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                    </svg>
                                </button>
                            </div>
                            <p class="mt-1.5 line-clamp-2 text-sm font-medium leading-7 text-gray-500 dark:text-gray-400">
                                {{ item.subtitle }}
                            </p>
                            <div class="mt-4 flex items-center gap-2">
                                <button
                                    type="button"
                                    class="inline-flex h-8 flex-1 items-center justify-center rounded-xl bg-gray-100 px-3 text-xs font-semibold text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                                    @click.prevent="openDetails(item.key)"
                                >
                                    {{ $t('coop.details.responsibilities') }}
                                </button>
                                <button
                                    type="button"
                                    class="inline-flex h-8 flex-1 items-center justify-center rounded-xl bg-yellow-400 px-3 text-xs font-semibold text-gray-900 transition hover:bg-opacity-80"
                                    @click.prevent="openForm(item.key)"
                                >
                                    {{ $t('coop.submitRequest') }}
                                </button>
                            </div>
                        </div>
                    </article>
            </div>

            <!-- bottom sheet drawer component for form-->
            <BottomSheetDrawer class="" v-model="showModal" :initial-height="0.8" :min-height="0.5" :max-height="0.95"
                :header-height="8" :show-handle="true" :auto-close-on-min="true" :auto-fullscreen-on-max="false"
                :backdrop-class="['backdrop-blur-sm bg-gray-500/10']">
                <div class="font-anjoman p-3 md:p-4 flex items-center justify-between flex-none">
                    <div class="flex items-center">
                        <div
                            class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 text-gray-900">
                            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path
                                    d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z">
                                </path>
                            </svg>
                        </div>
                        <div class="ms-2">
                            <h4 class="text-base font-semibold text-gray-800 dark:text-gray-100">{{
                                currentRoleTitle }}</h4>
                            <p class="text-xs font-light mt-1 text-gray-500 dark:text-gray-400">{{ $t('coop.form.fillBelow') }}</p>
                        </div>
                    </div>
                    <div class="">
                        <!-- <button @click.prevent="closeForm"
                            class="w-8 h-8 rounded-md inline-flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M6.225 4.811 4.811 6.225 10.586 12l-5.775 5.775 1.414 1.414L12 13.414l5.775 5.775 1.414-1.414L13.414 12l5.775-5.775-1.414-1.414L12 10.586 6.225 4.811Z">
                                </path>
                            </svg>
                        </button> -->
                    </div>
                </div>
                <hr class="mx-6 border-b border-dashed border-gray-200/70 dark:border-gray-700/70" />
                <div class="font-anjoman p-3 md:p-5 flex-1 overflow-y-auto">
                    <VerticalStepper :key="stepperKey" :multiple="false" :defaultOpened="[0]">
                        <StepItem :isLast="false">
                            <template #header>
                                <div class="text-sm font-semibold">{{ $t('coop.step.personal') }}</div>
                            </template>
                            <template #content>
                                <div class="grid md:grid-cols-2 gap-3">
                                    <div
                                        class="rounded-xl p-3 md:p-4 bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800/70">
                                        <label for="name"
                                            class="ms-1 text-xs font-medium text-gray-600 dark:text-gray-400">{{ $t('coop.label.fullName') }}</label>
                                        <input v-model="form.name" id="name" type="text"
                                            class="h-10 placeholder-gray-400 dark:placeholder-gray-500 w-full bg-slate-400 dark:bg-slate-800 bg-opacity-10 rounded-lg transition duration-200 text-sm text-gray-600 focus:text-gray-800 font-semibold dark:text-gray-300 focus:dark:text-white px-3 focus:ring-2 ring-yellow-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 outline-none"
                                            :class="{ 'border-rose-500 text-rose-500 border-opacity-100 dark:text-rose-500': errors && errors.name }" />
                                        <span v-if="errors && errors.name"
                                            class="mt-2 text-red-500 text-xs font-semibold">{{
                                                errors.name[0] }}</span>
                                    </div>
                                    <div
                                        class="rounded-xl p-3 md:p-4 bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800/70">
                                        <label for="melli_code"
                                            class="ms-1 text-xs font-medium text-gray-600 dark:text-gray-400">{{ $t('coop.label.melliCode') }}
                                        </label>
                                        <input v-model="form.melli_code" id="melli_code" type="tel" maxlength="10"
                                            class="h-10 placeholder-gray-400 dark:placeholder-gray-500 w-full bg-slate-400 dark:bg-slate-800 bg-opacity-10 rounded-lg transition duration-200 text-sm text-gray-600 focus:text-gray-800 font-semibold dark:text-gray-300 focus:dark:text-white px-3 focus:ring-2 ring-yellow-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 outline-none"
                                            :class="{ 'border-rose-500 text-rose-500 border-opacity-100 dark:text-rose-500': errors && errors.melli_code }" />
                                        <span v-if="errors && errors.melli_code"
                                            class="mt-2 text-red-500 text-xs font-semibold">{{
                                                errors.melli_code[0] }}</span>
                                    </div>
                                </div>
                            </template>
                            <template #buttons="{ next }">
                                <div class="flex items-center justify-end mt-2">
                                    <button @click.prevent="goNextIfValid('personal', next)"
                                        class="h-9 px-3 whitespace-nowrap rounded-lg flex items-center text-sm font-semibold text-gray-800 dark:text-black bg-yellow-400 dark:bg-yellow-500 hover:bg-opacity-80 dark:hover:bg-opacity-75">{{ $t('coop.btn.next') }}</button>
                                </div>
                            </template>
                        </StepItem>

                        <StepItem :isLast="false">
                            <template #header>
                                <div class="text-sm font-semibold">{{ $t('coop.step.contact') }}</div>
                            </template>
                            <template #content>
                                <div class="grid md:grid-cols-2 gap-3">
                                    <div
                                        class="rounded-xl p-3 md:p-4 bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800/70">
                                        <label for="mobile"
                                            class="ms-1 text-xs font-medium text-gray-600 dark:text-gray-400">{{ $t('coop.label.mobile') }}</label>
                                        <input v-model="form.mobile" id="mobile" dir="ltr" type="text"
                                            class="h-10 placeholder-gray-400 dark:placeholder-gray-500 w-full bg-slate-400 dark:bg-slate-800 bg-opacity-10 rounded-lg transition duration-200 text-sm text-gray-600 focus:text-gray-800 font-semibold dark:text-gray-300 focus:dark:text-white px-3 focus:ring-2 ring-yellow-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 outline-none"
                                            :class="{ 'border-rose-500 text-rose-500 border-opacity-100 dark:text-rose-500': errors && errors.mobile }" />
                                        <span v-if="errors && errors.mobile"
                                            class="mt-2 text-red-500 text-xs font-semibold">{{ errors.mobile[0]
                                            }}</span>
                                    </div>
                                    <div
                                        class="rounded-xl p-3 md:p-4 bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800/70">
                                        <label for="email"
                                            class="ms-1 text-xs font-medium text-gray-600 dark:text-gray-400">{{ $t('coop.label.email') }}</label>
                                        <input v-model="form.email" id="email" dir="ltr" type="email"
                                            class="h-10 placeholder-gray-400 dark:placeholder-gray-500 w-full bg-slate-400 dark:bg-slate-800 bg-opacity-10 rounded-lg transition duration-200 text-sm text-gray-600 focus:text-gray-800 font-semibold dark:text-gray-300 focus:dark:text-white px-3 focus:ring-2 ring-yellow-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 outline-none"
                                            :class="{ 'border-rose-500 text-rose-500 border-opacity-100 dark:text-rose-500': errors && errors.email }" />
                                        <span v-if="errors && errors.email"
                                            class="mt-2 text-red-500 text-xs font-semibold">{{ errors.email[0]
                                            }}</span>
                                    </div>
                                </div>
                            </template>
                            <template #buttons="{ next, prev }">
                                <div class="flex items-center justify-between mt-2">
                                    <button @click.prevent="prev"
                                        class="h-9 px-3 whitespace-nowrap rounded-lg flex items-center text-sm font-semibold text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-opacity-80 dark:hover:bg-opacity-75">{{ $t('coop.btn.prev') }}</button>
                                    <button @click.prevent="goNextIfValid('connection', next)"
                                        class="h-9 px-3 whitespace-nowrap rounded-lg flex items-center text-sm font-semibold text-gray-800 dark:text-black bg-yellow-400 dark:bg-yellow-500 hover:bg-opacity-80 dark:hover:bg-opacity-75">{{ $t('coop.btn.next') }}</button>
                                </div>
                            </template>
                        </StepItem>

                        <!-- <StepItem :isLast="false">
                            <template #header>
                                <div class="text-sm font-semibold">اطلاعات مالی</div>
                            </template>
                            <template #content>
                                <div
                                    class="rounded-xl p-3 md:p-4 bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800/70">
                                    <label for="iban"
                                        class="ms-1 text-xs font-medium text-gray-600 dark:text-gray-400">شماره
                                        شبا (IBAN)</label>
                                    <input v-model="form.iban" @input="onInputIban" id="iban" dir="ltr"
                                        placeholder="IR" type="text"
                                        class="font-mono h-10 placeholder-gray-400 dark:placeholder-gray-500 w-full bg-slate-400 dark:bg-slate-800 bg-opacity-10 rounded-lg transition duration-200 text-sm text-gray-600 focus:text-gray-800 font-semibold dark:text-gray-300 focus:dark:text-white px-3 focus:ring-2 ring-yellow-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 outline-none"
                                        :class="{ 'border-rose-500 text-rose-500 border-opacity-100 dark:text-rose-500': errors && errors.iban }" />
                                    <span v-if="errors && errors.iban"
                                        class="mt-2 text-red-500 text-xs font-semibold">{{ errors.iban[0]
                                        }}</span>
                                    <div v-if="ibanCheckLoading"
                                        class="mt-2 text-[0.7rem] text-gray-500 dark:text-gray-400">در حال بررسی
                                        شبا...</div>
                                    <div v-else-if="bankInfo && bankInfo.name"
                                        class="mt-2 text-[0.7rem] font-semibold text-green-600 dark:text-green-400 flex items-center">
                                        <svg class="w-4 h-4 me-1.5 text-green-600 dark:text-green-400"
                                            viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2 3 7v2h18V7L12 2Zm7 7H5v10h14V9ZM3 21h18v1H3v-1Z">
                                            </path>
                                        </svg>
                                        <span>{{ bankInfo.name }}</span>
                                    </div>
                                </div>
                            </template>
                            <template #buttons="{ next, prev }">
                                <div class="flex items-center justify-between mt-2">
                                    <button @click.prevent="prev"
                                        class="h-9 px-3 whitespace-nowrap rounded-lg flex items-center text-sm font-semibold text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-opacity-80 dark:hover:bg-opacity-75">{{ $t('coop.btn.prev') }}</button>
                                    <button @click.prevent="goNextIfValid('finance', next)"
                                        class="h-9 px-3 whitespace-nowrap rounded-lg flex items-center text-sm font-semibold text-gray-800 dark:text-black bg-yellow-400 dark:bg-yellow-500 hover:bg-opacity-80 dark:hover:bg-opacity-75">{{ $t('coop.btn.next') }}</button>
                                </div>
                            </template>
                        </StepItem> -->

                        <StepItem :isLast="false">
                            <template #header>
                                <div class="text-sm font-semibold">{{ $t('coop.step.descLinks') }}</div>
                            </template>
                            <template #content>
                                <div class="space-y-4">
                                    <div
                                        class="rounded-xl p-3 md:p-4 bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800/70">
                                        <label
                                            class="ms-1 text-xs font-medium text-gray-600 dark:text-gray-400">{{ $t('coop.label.description') }}</label>
                                        <textarea v-model="form.description" rows="5"
                                            class="mt-2 placeholder-gray-400 dark:placeholder-gray-500 w-full bg-slate-400 dark:bg-slate-800 bg-opacity-10 rounded-lg transition duration-200 text-sm text-gray-600 focus:text-gray-800 font-semibold dark:text-gray-300 focus:dark:text-white p-3 focus:ring-2 ring-yellow-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 outline-none"
                                            :class="{ 'border-rose-500 text-rose-500 border-opacity-100 dark:text-rose-500': errors && errors.description }"></textarea>
                                        <span v-if="errors && errors.description"
                                            class="mt-2 text-red-500 text-xs font-semibold">{{
                                                errors.description[0] }}</span>
                                    </div>
                                    <div
                                        class="rounded-xl p-3 md:p-4 bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800/70">
                                        <label class="ms-1 text-xs font-medium text-gray-600 dark:text-gray-400">{{ $t('coop.label.linksOptional') }}</label>
                                        <input v-model="form.links" dir="ltr" placeholder="https://example.com"
                                            type="text"
                                            class="mt-2 h-10 placeholder-gray-400 dark:placeholder-gray-500 w-full bg-slate-400 dark:bg-slate-800 bg-opacity-10 rounded-lg transition duration-200 text-sm text-gray-600 focus:text-gray-800 font-semibold dark:text-gray-300 focus:dark:text-white px-3 focus:ring-2 ring-yellow-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 outline-none" />
                                    </div>
                                </div>
                            </template>
                            <template #buttons="{ next, prev }">
                                <div class="flex items-center justify-between mt-2">
                                    <button @click.prevent="prev"
                                        class="h-9 px-3 whitespace-nowrap rounded-lg flex items-center text-sm font-semibold text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-opacity-80 dark:hover:bg-opacity-75">{{ $t('coop.btn.prev') }}</button>
                                    <button @click.prevent="goNextIfValid('desc', next)"
                                        class="h-9 px-3 whitespace-nowrap rounded-lg flex items-center text-sm font-semibold text-gray-800 dark:text-black bg-yellow-400 dark:bg-yellow-500 hover:bg-opacity-80 dark:hover:bg-opacity-75">{{ $t('coop.btn.next') }}</button>
                                </div>
                            </template>
                        </StepItem>

                        <StepItem :isLast="true">
                            <template #header>
                                <div class="text-sm font-semibold">{{ $t('coop.step.documents') }}</div>
                            </template>
                            <template #content>
                                <div class="space-y-4">
                                    <div
                                        class="rounded-xl p-3 md:p-4 bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800/70">
                                        <label class="ms-1 text-xs font-medium text-gray-600 dark:text-gray-400">{{ $t('coop.label.melliCardImage') }}</label>
                                        <DropzoneComponent ref="dz_melli_card_image" :showDesc="false"
                                            :errors="errors && errors.melli_card_image ? errors.melli_card_image[0] : ''"
                                            @uploaded-files="files => handleDZ('melli_card_image', files)"
                                            :headers="dropzoneHeader"
                                            :uploadUrl="`${apiBaseUrl}/cooperation/upload-file`" :xhrTimeout="60000"
                                            :maxSize="10485760" :allowedFormats="['jpg', 'jpeg', 'png', 'pdf']"
                                            :maxFiles="2" :parallelUpload="false" :maxParallelUploads="2"
                                            :retryOnError="false" :bulkUpload="false" />
                                    </div>
                                    <div
                                        class="rounded-xl p-3 md:p-4 bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800/70">
                                        <label class="ms-1 text-xs font-medium text-gray-600 dark:text-gray-400">{{ $t('coop.label.resume') }}</label>
                                        <DropzoneComponent ref="dz_resume" :showDesc="false"
                                            :errors="errors && errors.resume ? errors.resume[0] : ''"
                                            @uploaded-files="files => handleDZ('resume', files)"
                                            :headers="dropzoneHeader"
                                            :uploadUrl="`${apiBaseUrl}/cooperation/upload-file`" :xhrTimeout="60000"
                                            :maxSize="10485760" :allowedFormats="['pdf', 'doc', 'docx']" :maxFiles="1"
                                            :parallelUpload="false" :maxParallelUploads="1" :retryOnError="false"
                                            :bulkUpload="false" />
                                    </div>
                                    <div v-if="selectedRole === 'teacher'"
                                        class="rounded-xl p-3 md:p-4 bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800/70">
                                        <label class="ms-1 text-xs font-medium text-gray-600 dark:text-gray-400">{{ $t('coop.label.teachingSample') }}</label>
                                        <DropzoneComponent ref="dz_samples" :showDesc="false"
                                            :errors="errors && errors.samples ? errors.samples[0] : ''"
                                            @uploaded-files="files => handleDZ('samples', files)"
                                            :headers="dropzoneHeader"
                                            :uploadUrl="`${apiBaseUrl}/cooperation/upload-file`" :xhrTimeout="60000"
                                            :maxSize="20971520"
                                            :allowedFormats="['jpg', 'jpeg', 'png', 'pdf', 'zip', 'rar', 'mp4']"
                                            :maxFiles="5" :parallelUpload="true" :maxParallelUploads="3"
                                            :retryOnError="false" :bulkUpload="false" />
                                    </div>
                                </div>
                            </template>
                            <template #buttons="{ prev }">
                                <div class="flex items-center justify-between mt-2">
                                    <button @click.prevent="prev"
                                        class="h-9 px-3 whitespace-nowrap rounded-lg flex items-center text-sm font-semibold text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-opacity-80 dark:hover:bg-opacity-75">{{ $t('coop.btn.prev') }}</button>
                                    <div class="flex items-center gap-2">
                                        <button @click.prevent="resetForm"
                                            class="h-9 px-3 whitespace-nowrap rounded-lg flex items-center text-sm font-semibold text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-opacity-80 dark:hover:bg-opacity-75">{{ $t('coop.btn.clearForm') }}</button>
                                        <button @click.prevent="submitForm" :disabled="loading"
                                            class="disabled:opacity-75 disabled:cursor-not-allowed h-9 px-3 whitespace-nowrap rounded-lg flex items-center text-sm font-semibold text-gray-800 dark:text-black bg-yellow-400 dark:bg-yellow-500 hover:bg-opacity-80 dark:hover:bg-opacity-75">
                                            <svg v-if="loading" class="w-4 h-4 me-2" version="1.1"
                                                xmlns="http://www.w3.org/2000/svg" viewBox="25 25 50 50">
                                                <circle class="stroke-current text-black/40 dark:text-white/40" cx="50"
                                                    cy="50" r="20" fill="none" stroke-width="6" stroke-linecap="round"
                                                    stroke-dasharray="100, 200">
                                                    <animateTransform attributeName="transform" attributeType="XML"
                                                        type="rotate" from="0 50 50" to="360 50 50" dur="1.7s"
                                                        repeatCount="indefinite">
                                                    </animateTransform>
                                                </circle>
                                            </svg>
                                            <span>{{ $t('coop.submitRequest') }}</span>
                                        </button>
                                    </div>
                                </div>
                            </template>
                        </StepItem>
                    </VerticalStepper>
                </div>
            </BottomSheetDrawer>

            <!-- bottom sheet drawer component for details-->
            <BottomSheetDrawer class="" v-model="showDetailsModal" :initial-height="0.7" :min-height="0.5"
                :max-height="0.95" :header-height="8" :show-handle="true" :auto-close-on-min="true"
                :auto-fullscreen-on-max="false" :backdrop-class="['backdrop-blur-sm bg-gray-500/10']">
                <div class="flex flex-none items-center justify-between gap-3 p-3 md:px-5 md:pt-4">
                    <h4 class="min-w-0 truncate text-base font-bold text-gray-800 dark:text-white">{{ currentRoleTitle }}</h4>
                    <button
                        type="button"
                        class="inline-flex h-8 shrink-0 items-center rounded-xl bg-yellow-400 px-3 text-xs font-semibold text-gray-900 transition hover:bg-opacity-80"
                        @click.prevent="openForm(selectedRole); closeDetails()"
                    >
                        {{ $t('coop.submitRequest') }}
                    </button>
                </div>
                <div class="flex-1 overflow-y-auto p-3 md:p-5 pt-0">
                    <div class="space-y-4">
                        <div
                            class="rounded-xl p-3 md:p-4 bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800/70">
                            <p class="text-sm md:text-[0.95rem] leading-7 text-gray-600 dark:text-gray-300">
                                {{ currentRoleDescription }}
                            </p>
                            <div v-if="roleDetails && roleDetails.highlights && roleDetails.highlights.length"
                                class="mt-3 flex flex-wrap gap-2">
                                <span v-for="(tag, i) in roleDetails.highlights" :key="i"
                                    class="inline-flex h-7 items-center rounded-lg bg-gray-100 px-2.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                    {{ tag }}
                                </span>
                            </div>
                        </div>

                        <div class="grid md:grid-cols-2 gap-3">
                            <div v-if="roleDetails && roleDetails.responsibilities && roleDetails.responsibilities.length"
                                class="rounded-xl p-3 md:p-4 bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800/70">
                                <h5 class="text-sm font-extrabold text-gray-800 dark:text-gray-100 mb-2">
                                    {{ $t('coop.details.responsibilities') }}</h5>
                                <ul
                                    class="space-y-2 ps-4 list-disc marker:text-yellow-400 text-[0.9rem] leading-7 text-gray-600 dark:text-gray-300">
                                    <li v-for="(item, i) in roleDetails.responsibilities" :key="'r-' + i" class="ps-1">
                                        {{ item }}
                                    </li>
                                </ul>
                            </div>
                            <div v-if="roleDetails && roleDetails.requirements && roleDetails.requirements.length"
                                class="rounded-xl p-3 md:p-4 bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800/70">
                                <h5 class="text-sm font-extrabold text-gray-800 dark:text-gray-100 mb-2">
                                    {{ $t('coop.details.requirements') }}</h5>
                                <ul
                                    class="space-y-2 ps-4 list-disc marker:text-yellow-400 text-[0.9rem] leading-7 text-gray-600 dark:text-gray-300">
                                    <li v-for="(item, i) in roleDetails.requirements" :key="'q-' + i" class="ps-1">
                                        {{ item }}
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div v-if="roleDetails && roleDetails.benefits && roleDetails.benefits.length"
                            class="rounded-xl p-3 md:p-4 bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800/70">
                            <h5 class="text-sm font-extrabold text-gray-800 dark:text-gray-100 mb-2">
                                {{ $t('coop.details.benefits') }}</h5>
                            <ul
                                class="space-y-2 ps-4 list-disc marker:text-yellow-400 text-[0.9rem] leading-7 text-gray-600 dark:text-gray-300">
                                <li v-for="(item, i) in roleDetails.benefits" :key="'b-' + i" class="ps-1">
                                    {{ item }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </BottomSheetDrawer>
        </div>
    </MasterPage>
</template>
<script>
import engineering_team from '@/assets/image/other/engineering-team.svg'
import MasterPage from "@/views/page/layouts/MasterPage.vue";
import { useSEO } from "@/composables/useSEO";
import DropzoneComponent from "@/views/components/dropzone/DropzoneComponent.vue";
import VerticalStepper from "@/views/components/stepper/VerticalStepper.vue";
import StepItem from "@/views/components/stepper/StepItem.vue";
import axiosInstance from "@/store/axiosInstance";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import config from "@/store/config";
import { getAuthTokenSync } from "@/utils/authToken";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import SeoImage from "@/views/components/seo/SeoImage.vue";
export default {
    components: {
        MasterPage,
        DropzoneComponent,
        VerticalStepper,
        StepItem,
        BottomSheetDrawer,
        SeoImage,
    },
    data() {
        return {
            apiBaseUrl: config.apiBaseUrl,
            dropzoneHeader: {
                Authorization: "",
            },
            stepperKey: 0,
            ibanCheckLoading: false,
            bankInfo: null,
            showModal: false,
            showDetailsModal: false,
            selectedRole: "",
            form: {
                name: "",
                mobile: "",
                email: "",
                melli_code: "",
                iban: "",
                description: "",
                links: "",
                melli_card_image: "",
                resume: "",
                samples: "",
            },
            loading: false,
            errors: null,
        };
    },
    computed: {
        roles() {
            const meta = {
                support: {
                    icon: '<svg viewBox="0 0 24 24" fill="none" class="w-6 h-6"><path d="M3 18v-6a9 9 0 0 1 18 0v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5ZM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
                },
                teacher: {
                    icon: '<svg viewBox="0 0 24 24" fill="none" class="w-6 h-6"><path d="m22 10-10-5L2 10l10 5 10-5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M6 12v5c0 1 2.7 3 6 3s6-2 6-3v-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                },
                content_creator: {
                    icon: '<svg viewBox="0 0 24 24" fill="none" class="w-6 h-6"><path d="M12 20h9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
                },
                dev: {
                    icon: '<svg viewBox="0 0 24 24" fill="none" class="w-6 h-6"><path d="m8 9-3 3 3 3M16 9l3 3-3 3M13 7l-2 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                },
                marketing: {
                    icon: '<svg viewBox="0 0 24 24" fill="none" class="w-6 h-6"><path d="m3 11 18-5v12L3 13v-2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
                },
                design: {
                    icon: '<svg viewBox="0 0 24 24" fill="none" class="w-6 h-6"><circle cx="13.5" cy="6.5" r="1.5" fill="currentColor"/><circle cx="17.5" cy="10.5" r="1.5" fill="currentColor"/><circle cx="8.5" cy="7.5" r="1.5" fill="currentColor"/><circle cx="6.5" cy="12.5" r="1.5" fill="currentColor"/><path d="M12 2a10 10 0 0 0 0 20 2.5 2.5 0 0 0 2-4 2.5 2.5 0 0 1 2-4h1a5 5 0 0 0 5-5c0-4.4-4.5-7-10-7Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
                },
            };
            return [
                { key: "support", title: this.$t("coop.roles.support.title"), subtitle: this.$t("coop.roles.support.subtitle"), description: this.$t("coop.roles.support.description"), ...meta.support },
                { key: "teacher", title: this.$t("coop.roles.teacher.title"), subtitle: this.$t("coop.roles.teacher.subtitle"), description: this.$t("coop.roles.teacher.description"), ...meta.teacher },
                { key: "content_creator", title: this.$t("coop.roles.content_creator.title"), subtitle: this.$t("coop.roles.content_creator.subtitle"), description: this.$t("coop.roles.content_creator.description"), ...meta.content_creator },
                { key: "dev", title: this.$t("coop.roles.dev.title"), subtitle: this.$t("coop.roles.dev.subtitle"), description: this.$t("coop.roles.dev.description"), ...meta.dev },
                { key: "marketing", title: this.$t("coop.roles.marketing.title"), subtitle: this.$t("coop.roles.marketing.subtitle"), description: this.$t("coop.roles.marketing.description"), ...meta.marketing },
                { key: "design", title: this.$t("coop.roles.design.title"), subtitle: this.$t("coop.roles.design.subtitle"), description: this.$t("coop.roles.design.description"), ...meta.design },
            ];
        },
        currentUser() {
            const info = this.$store?.state?.auth?.status?.userInfo;
            return info && info.value ? info.value : info;
        },
        currentRoleTitle() {
            const r = this.roles.find((r) => r.key === this.selectedRole);
            return r ? r.title : "";
        },
        currentRoleDescription() {
            const r = this.roles.find((r) => r.key === this.selectedRole);
            return r ? r.description : "";
        },
        roleDetails() {
            const key = this.selectedRole;
            const known = ["teacher", "support", "content_creator", "dev", "marketing", "design"];
            const base = known.includes(key) ? key : "default";
            const tmArr = (field) => {
                const arr = this.$tm(`coop.roleDetails.${base}.${field}`);
                if (!Array.isArray(arr)) return [];
                return arr.map((item) => (typeof item === "string" ? item : this.$rt(item)));
            };
            return {
                highlights: tmArr("highlights"),
                responsibilities: tmArr("responsibilities"),
                requirements: tmArr("requirements"),
                benefits: tmArr("benefits"),
            };
        },
    },
    watch: {
        showModal(newValue) {
            if (newValue === false) {
                this.resetForm();
                this.errors = null;
            }
        }
    },
    methods: {
        openForm(roleKey) {
            this.selectedRole = roleKey;
            this.stepperKey++; // reset stepper to first step
            // Prefill from profile if exists
            const u = this.currentUser;
            if (u) {
                this.form.name = [u.first_name, u.last_name].filter(Boolean).join(" ") || this.form.name;
                this.form.mobile = u.mobile || this.form.mobile;
                this.form.email = u.email || this.form.email;
            }
            this.showModal = true;
        },
        closeForm() {
            this.showModal = false;
            this.resetForm();
            this.errors = null;
        },
        openDetails(roleKey) {
            this.selectedRole = roleKey;
            this.showDetailsModal = true;
        },
        closeDetails() {
            this.showDetailsModal = false;
        },
        handleDZ(which, files) {
            if (which === "melli_card_image") {
                this.form.melli_card_image = Array.isArray(files) ? files.map((f) => f.url) : [];
            } else if (which === "resume") {
                this.form.resume = Array.isArray(files) && files[0] ? files[0].url : "";
            } else if (which === "samples") {
                this.form.samples = Array.isArray(files) ? files.map((f) => f.url) : [];
            }
        },
        onInputIban() {
            let raw = (this.form.iban || '').toString();
            raw = raw.replace(/\s+/g, '').toUpperCase();

            // Normalize partial "I" or "R" to "IR"
            if (raw.startsWith('I') && !raw.startsWith('IR')) {
                raw = 'IR' + raw.slice(1).replace(/^R/, '');
            }
            if (!raw.startsWith('IR')) raw = 'IR' + raw.replace(/^IR/i, '');

            // Digits only after IR, up to 24
            let digits = raw.slice(2).replace(/\D/g, '');
            if (digits.length > 24) digits = digits.slice(0, 24);

            const formatted = 'IR' + digits;
            this.form.iban = formatted;

            // Clear previous info/errors while editing
            this.bankInfo = null;
            if (this.errors && this.errors.iban) {
                delete this.errors.iban;
            }

            // Show bank name as soon as digit 4 and 5 (of BBAN) are available
            if (digits.length >= 5) {
                const infoEarly = this.getBankInfoByDigits(digits);
                if (infoEarly && infoEarly.name) {
                    this.bankInfo = { name: infoEarly.name, code: infoEarly.code };
                }
            }

            // Auto-validate and detect bank when complete
            if (formatted.length === 26) {
                if (!this.isValidIranIban(formatted)) {
                    this.errors = { ...(this.errors || {}), iban: [this.$t("coop.validation.ibanInvalid")] };
                    return;
                }
                const info = this.getBankInfoFromIban(formatted);
                this.bankInfo = { name: (info && info.name) ? info.name : this.$t("coop.bankUnknown"), code: info ? info.code : null };
            }
        },
        isValidIranIban(iban) {
            if (!/^IR[0-9]{24}$/.test(iban)) return false;
            const rearranged = iban.slice(4) + iban.slice(0, 4);
            const converted = rearranged.replace(/[A-Z]/g, (ch) => (ch.charCodeAt(0) - 55).toString());
            let remainder = 0;
            for (let i = 0; i < converted.length; i++) {
                const digit = parseInt(converted[i], 10);
                if (Number.isNaN(digit)) return false;
                remainder = (remainder * 10 + digit) % 97;
            }
            return remainder === 1;
        },
        getBankInfoFromIban(iban) {
            // According to https://almico.ir/blog/sheba the bank identifier is digits 4 and 5 of IBAN (excluding IR)
            if (!/^IR[0-9]{24}$/.test(iban)) return null;
            const digits = iban.slice(2); // 24 digits
            const bankCode2 = digits.slice(3, 5); // 4th and 5th digits (1-indexed)
            const map2 = {
                '11': 'بانک صنعت و معدن',
                '12': 'بانک ملت',
                '13': 'بانک رفاه کارگران',
                '14': 'بانک مسکن',
                '15': 'بانک سپه',
                '16': 'بانک کشاورزی',
                '17': 'بانک ملی ایران',
                '18': 'بانک تجارت',
                '19': 'بانک صادرات ایران',
                '20': 'بانک توسعه صادرات',
                '21': 'پست بانک',
                '22': 'بانک توسعه تعاون',
                '52': 'بانک قوامین',
                '53': 'بانک کارآفرین',
                '54': 'بانک پارسیان',
                '55': 'بانک اقتصاد نوین',
                '56': 'بانک سامان',
                '57': 'بانک پاسارگاد',
                '58': 'بانک سرمایه',
                '59': 'بانک سینا',
                '60': 'بانک قرض الحسنه مهر ایران',
                '61': 'بانک شهر',
                '62': 'بانک آینده',
                '63': 'بانک انصار',
                '64': 'بانک گردشگری',
                '65': 'بانک حکمت ایرانیان',
                '66': 'بانک دی',
                '69': 'بانک ایران زمین',
                '70': 'بانک قرض الحسنه رسالت',
                '75': 'مؤسسه اعتباری ملل',
                '79': 'بانک مهر اقتصاد',
                '80': 'بانک خاورمیانه',
            };
            return { code: bankCode2, name: map2[bankCode2] || null };
        },
        getBankInfoByDigits(digits) {
            // digits: 24-length BBAN (partial allowed). Needs at least first 5 digits to read digit 4&5.
            if (!digits || digits.length < 5) return null;
            const bankCode2 = digits.slice(3, 5);
            const map2 = {
                '11': 'بانک صنعت و معدن',
                '12': 'بانک ملت',
                '13': 'بانک رفاه کارگران',
                '14': 'بانک مسکن',
                '15': 'بانک سپه',
                '16': 'بانک کشاورزی',
                '17': 'بانک ملی ایران',
                '18': 'بانک تجارت',
                '19': 'بانک صادرات ایران',
                '20': 'بانک توسعه صادرات',
                '21': 'پست بانک',
                '22': 'بانک توسعه تعاون',
                '52': 'بانک قوامین',
                '53': 'بانک کارآفرین',
                '54': 'بانک پارسیان',
                '55': 'بانک اقتصاد نوین',
                '56': 'بانک سامان',
                '57': 'بانک پاسارگاد',
                '58': 'بانک سرمایه',
                '59': 'بانک سینا',
                '60': 'بانک قرض الحسنه مهر ایران',
                '61': 'بانک شهر',
                '62': 'بانک آینده',
                '63': 'بانک انصار',
                '64': 'بانک گردشگری',
                '65': 'بانک حکمت ایرانیان',
                '66': 'بانک دی',
                '69': 'بانک ایران زمین',
                '70': 'بانک قرض الحسنه رسالت',
                '75': 'مؤسسه اعتباری ملل',
                '79': 'بانک مهر اقتصاد',
                '80': 'بانک خاورمیانه',
            };
            const name = map2[bankCode2] || null;
            return name ? { code: bankCode2, name } : null;
        },
        // isValidMelliCode(melliCode) {
        //     if (!/^\d{10}$/.test(melliCode)) {
        //         return false;
        //     }

        //     let sum = 0;
        //     for (let i = 0; i < 10; i++) {
        //         sum += parseInt(melliCode[i]) * (10 - i);
        //     }
        //     let remainder = sum % 11;
        //     let controlDigit = 11 - remainder;
        //     if (controlDigit === 10) {
        //         controlDigit = 0;
        //     } else if (controlDigit === 11) {
        //         controlDigit = 1;
        //     }

        //     return parseInt(melliCode[9]) === controlDigit;
        // },
        isValidMelliCode(melliCode) {
            if (!/^\d{10}$/.test(melliCode)) {
                return false;
            }

            let sum = 0;
            for (let i = 0; i < 10; i++) {
                sum += parseInt(melliCode[i]) * (10 - i);
            }
            let remainder = sum % 11;
            let controlDigit = 11 - remainder;

            if (controlDigit >= 10) {
                controlDigit = 0;
            }

            return parseInt(melliCode[9]) === controlDigit;
        },
        resetForm() {
            this.form = {
                name: "",
                mobile: "",
                email: "",
                melli_code: "",
                iban: "",
                description: "",
                links: "",
                melli_card_image: [],
                resume: "",
                samples: [],
            };
            this.errors = null;
            this.loading = false;
            this.$refs.dz_melli_card_image?.reset();
            this.$refs.dz_resume?.reset();
            this.$refs.dz_samples?.reset();
        },
        async ensureUploadsFinished() {
            const dzs = ["dz_melli_card_image", "dz_resume", "dz_samples"]
                .map((k) => this.$refs[k])
                .filter(Boolean);
            for (const dz of dzs) {
                if (dz && Array.isArray(dz.selectedFiles) && dz.selectedFiles.length > 0) {
                    const pending = dz.selectedFiles.filter((f) => f.status !== "uploaded");
                    if (pending.length > 0) {
                        await dz.uploadAll();
                        const notUploaded = dz.selectedFiles.filter((f) => f.status !== "uploaded");
                        if (notUploaded.length > 0) {
                            throw new Error(this.$t("coop.validation.uploadFailed"));
                        }
                    }
                }
            }
        },
        async goNextIfValid(section, next) {
            // step validations
            if (section === "personal") {
                const errs = {};
                const name = (this.form.name || "").trim();
                const melli_code = (this.form.melli_code || "").trim();
                if (!name || name.length < 3) errs.name = [this.$t("coop.validation.name")];
                if (!/^\d{10}$/.test(melli_code)) errs.melli_code = [this.$t("coop.validation.melliCode")];
                if (Object.keys(errs).length > 0) {
                    this.errors = { ...(this.errors || {}), ...errs };
                    return;
                }
            }

            if (section === "connection") {
                const errs = {};
                const mobile = (this.form.mobile || "").trim();
                const email = (this.form.email || "").trim();
                if (!mobile || !/^(\+98|0)?9\d{9}$/.test(mobile)) errs.mobile = [this.$t("coop.validation.mobile")];
                if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = [this.$t("coop.validation.email")];
                if (Object.keys(errs).length > 0) {
                    this.errors = { ...(this.errors || {}), ...errs };
                    return;
                }
            }

            if (section === "finance") {
                const iban = (this.form.iban || "").toUpperCase();
                if (!this.isValidIranIban(iban)) {
                    this.errors = { ...(this.errors || {}), iban: [this.$t("coop.validation.ibanInvalid")] };
                    return;
                }
                // set bank name if not set (client-side)
                if (!this.bankInfo || !this.bankInfo.name) {
                    this.bankInfo = { name: this.getBankNameFromIban(iban) || this.$t("coop.bankUnknown") };
                }
            }

            if (section === "desc") {
                if (!this.form.description || (this.form.description || "").trim().length < 20) {
                    this.errors = { ...(this.errors || {}), description: [this.$t("coop.validation.descriptionMin")] };
                    return;
                }
            }

            next();
        },
        // async submitForm() {
        //     this.loading = true;
        //     this.errors = null;
        //     try {
        //         // required documents
        //         const errs = {};

        //         if (!this.form.name || !this.form.name.trim()) {
        //             errs.name = ["نام الزامی است"];
        //         }
        //         if (!this.form.mobile || !this.form.mobile.trim()) {
        //             errs.mobile = ["شماره موبایل الزامی است"];
        //         } else if (!/^(\+98|0)?9\d{9}$/.test(this.form.mobile)) {
        //             errs.mobile = ["شماره موبایل نامعتبر است"];
        //         }
        //         if (!this.form.email || !this.form.email.trim()) {
        //             errs.email = ["ایمیل الزامی است"];
        //         } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
        //             errs.email = ["ایمیل نامعتبر است"];
        //         }
        //         if (!this.form.melli_code || this.form.melli_code.length !== 10 || !/^\d{10}$/.test(this.form.melli_code)) {
        //             errs.melli_code = ["کد ملی باید 10 رقم باشد"];
        //         }
        //         if (!this.form.description || this.form.description.length < 20) {
        //             errs.description = ["توضیحات باید حداقل 20 کاراکتر باشد"];
        //         }

        //         if (!this.form.melli_card_image || this.form.melli_card_image.length === 0) {
        //             errs.melli_card_image = ["تصویر کارت ملی الزامی است"];
        //         }
        //         if (this.selectedRole === "teacher" && (!this.form.samples || this.form.samples.length === 0)) {
        //             errs.samples = ["نمونه تدریس الزامی است"];
        //         }
        //         if (Object.keys(errs).length > 0) {
        //             this.errors = { ...(this.errors || {}), ...errs };
        //             this.loading = false;
        //             return;
        //         }

        //         await this.ensureUploadsFinished();

        //         const formData = new FormData();
        //         formData.append("role", this.selectedRole);
        //         formData.append("name", this.form.name || "");
        //         formData.append("mobile", this.form.mobile || "");
        //         formData.append("email", this.form.email || "");
        //         formData.append("melli_code", this.form.melli_code || "");
        //         // formData.append("iban", this.form.iban || "");
        //         formData.append("description", this.form.description || "");
        //         formData.append("links", this.form.links || "");
        //         formData.append("melli_card_image", this.form.melli_card_image || "");
        //         formData.append("resume", this.form.resume || "");
        //         formData.append("samples", this.form.samples || "");

        //         await axiosInstance.post("/cooperation", formData).then(
        //             () => {
        //                 toast.success("درخواست همکاری شما با موفقیت ثبت شد. متشکریم!", {
        //                     theme: "colored",
        //                     hideProgressBar: false,
        //                     rtl: localStorage.getItem("direction") == "rtl",
        //                     bodyClassName: "font-YekanBakh",
        //                     toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
        //                     transition: toast.TRANSITIONS.BOUNCE,
        //                     position: toast.POSITION.BOTTOM_RIGHT,
        //                 });
        //                 this.resetForm();
        //                 this.closeForm();
        //             },
        //             (error) => {
        //                 this.errors = error?.response?.data?.errors || null;
        //             }
        //         ).catch((error) => {
        //             const response = error?.response;

        //             if (response?.status === 422) {
        //                 const data = response.data;

        //                 if (data.error_type === 'duplicate_cooperation_request') {
        //                     // نمایش پیام خاص برای درخواست تکراری
        //                     toast.error(data.message, {
        //                         theme: "colored",
        //                         hideProgressBar: false,
        //                         rtl: localStorage.getItem("direction") == "rtl",
        //                         bodyClassName: "font-YekanBakh",
        //                         toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
        //                         transition: toast.TRANSITIONS.BOUNCE,
        //                         position: toast.POSITION.BOTTOM_RIGHT,
        //                     });
        //                     this.errors = null; // پاک کردن خطاها فیلد
        //                 } else if (data.errors) {
        //                     // ولیدیشن فیلدها
        //                     this.errors = data.errors;
        //                 } else {
        //                     // پیام عمومی (اگر message داشت ولی error_type نداشت)
        //                     toast.error(data.message || "لطفاً فیلدهای خطا دار را بررسی کنید.", {
        //                         theme: "colored",
        //                         hideProgressBar: false,
        //                         rtl: localStorage.getItem("direction") == "rtl",
        //                         bodyClassName: "font-YekanBakh",
        //                         toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
        //                         transition: toast.TRANSITIONS.BOUNCE,
        //                         position: toast.POSITION.BOTTOM_RIGHT,
        //                     });
        //                     this.errors = null;
        //                 }
        //             } else {
        //                 // خطای سرور یا شبکه
        //                 toast.error("خطا در ارسال درخواست. لطفاً دوباره تلاش کنید.", {
        //                     theme: "colored",
        //                     hideProgressBar: false,
        //                     rtl: localStorage.getItem("direction") == "rtl",
        //                     bodyClassName: "font-YekanBakh",
        //                     toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
        //                     transition: toast.TRANSITIONS.BOUNCE,
        //                     position: toast.POSITION.BOTTOM_RIGHT,
        //                 });
        //                 this.errors = null;
        //             }
        //         });
        //     } catch (e) {
        //         toast.error(e?.message || "خطا در ثبت درخواست همکاری", {
        //             theme: "colored",
        //             hideProgressBar: false,
        //             rtl: localStorage.getItem("direction") == "rtl",
        //             bodyClassName: "font-YekanBakh",
        //             toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
        //             transition: toast.TRANSITIONS.BOUNCE,
        //             position: toast.POSITION.BOTTOM_RIGHT,
        //         });
        //     } finally {
        //         this.loading = false;
        //     }
        // },
        async submitForm() {
            this.loading = true;
            this.errors = null;

            try {
                const errs = {};

                // ولیدیشن فیلدهای اجباری
                if (!this.form.name || !this.form.name.trim()) {
                    errs.name = [this.$t("coop.validation.nameRequired")];
                }

                if (!this.form.mobile || !this.form.mobile.trim()) {
                    errs.mobile = [this.$t("coop.validation.mobileRequired")];
                } else if (!/^(\+98|0)?9\d{9}$/.test(this.form.mobile)) {
                    errs.mobile = [this.$t("coop.validation.mobile")];
                }

                if (!this.form.email || !this.form.email.trim()) {
                    errs.email = [this.$t("coop.validation.emailRequired")];
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
                    errs.email = [this.$t("coop.validation.email")];
                }

                if (!this.form.melli_code || !/^\d{10}$/.test(this.form.melli_code)) {
                    errs.melli_code = [this.$t("coop.validation.melliCodeLen")];
                }

                if (!this.form.description || this.form.description.length < 20) {
                    errs.description = [this.$t("coop.validation.descriptionMinChars")];
                }

                if (!this.form.melli_card_image || this.form.melli_card_image.length === 0) {
                    errs.melli_card_image = [this.$t("coop.validation.melliCardRequired")];
                }

                // نمونه تدریس فقط برای معلم الزامی است
                if (this.selectedRole === "teacher" && (!this.form.samples || this.form.samples.length === 0)) {
                    errs.samples = [this.$t("coop.validation.samplesRequired")];
                }

                // اگر خطایی وجود داشت، متوقف شو
                if (Object.keys(errs).length > 0) {
                    this.errors = { ...(this.errors || {}), ...errs };
                    this.loading = false;
                    return;
                }

                // اطمینان از آپلود فایل‌ها (اگر آپلود مستقیم نباشد)
                await this.ensureUploadsFinished();

                // ارسال فرم
                const formData = new FormData();
                formData.append("role", this.selectedRole);
                formData.append("name", this.form.name.trim());
                formData.append("mobile", this.form.mobile.trim());
                formData.append("email", this.form.email.trim());
                formData.append("melli_code", this.form.melli_code.trim());
                formData.append("description", this.form.description.trim());
                formData.append("links", this.form.links?.trim() || "");
                formData.append("melli_card_image", this.form.melli_card_image);
                formData.append("resume", this.form.resume || "");
                formData.append("samples", this.form.samples || "");

                await axiosInstance.post("/cooperation", formData)
                    .then(() => {
                        toast.success(this.$t("coop.toast.success"), {
                            theme: "colored",
                            hideProgressBar: false,
                            rtl: localStorage.getItem("direction") === "rtl",
                            bodyClassName: "font-YekanBakh",
                            toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                            transition: toast.TRANSITIONS.BOUNCE,
                            position: toast.POSITION.BOTTOM_RIGHT,
                        });
                        this.resetForm();
                        this.closeForm();
                    })
                    .catch((error) => {
                        const response = error?.response;

                        if (response?.status === 422) {
                            const data = response.data;

                            if (data.error_type === 'duplicate_cooperation_request') {
                                // نمایش پیام خاص برای درخواست تکراری
                                toast.error(data.message, {
                                    theme: "colored",
                                    hideProgressBar: false,
                                    rtl: localStorage.getItem("direction") === "rtl",
                                    bodyClassName: "font-YekanBakh",
                                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                                    transition: toast.TRANSITIONS.BOUNCE,
                                    position: toast.POSITION.BOTTOM_RIGHT,
                                });
                                this.errors = null; // خطاها پاک می‌شوند
                            } else if (data.errors) {
                                // خطاها در فیلدها (ولیدیشن)
                                this.errors = data.errors;
                            } else {
                                // پیام عمومی خطا
                                toast.error(data.message || this.$t("coop.toast.checkErrors"), {
                                    theme: "colored",
                                    hideProgressBar: false,
                                    rtl: localStorage.getItem("direction") === "rtl",
                                    bodyClassName: "font-YekanBakh",
                                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                                    transition: toast.TRANSITIONS.BOUNCE,
                                    position: toast.POSITION.BOTTOM_RIGHT,
                                });
                                this.errors = null;
                            }
                        } else {
                            // خطای شبکه یا سرور
                            toast.error(this.$t("coop.toast.submitError"), {
                                theme: "colored",
                                hideProgressBar: false,
                                rtl: localStorage.getItem("direction") === "rtl",
                                bodyClassName: "font-YekanBakh",
                                toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                                transition: toast.TRANSITIONS.BOUNCE,
                                position: toast.POSITION.BOTTOM_RIGHT,
                            });
                            this.errors = null;
                        }
                    });

            } catch (e) {
                toast.error(e?.message || this.$t("coop.toast.genericError"), {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") === "rtl",
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            } finally {
                this.loading = false;
            }
        }

    },
    mounted() {
        const token = getAuthTokenSync()
        this.dropzoneHeader = {
            Authorization: token ? `Bearer ${token}` : "",
        }
        useSEO({
            title: this.$t('coop.seo.title'),
            description: this.$t('coop.seo.description'),
            url: '/cooperation',
            keywords: ['همکاری با ما', 'همکاری', 'تدریس', 'تولید محتوا', 'مشارکت', 'زنبورک'],
            noindex: false
        });
    },
};
</script>

<style></style>
