<template>
    <MasterPage>
        <div class="relative overflow-hidden">
            <!-- Decorative background glow -->
            <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div class="absolute -top-40 start-1/2 -translate-x-1/2 h-[38rem] w-[38rem] rounded-full bg-amber-300/25 dark:bg-amber-500/10 blur-3xl"></div>
                <div class="absolute top-1/3 -end-40 h-96 w-96 rounded-full bg-yellow-200/40 dark:bg-yellow-500/5 blur-3xl"></div>
                <div class="absolute bottom-0 -start-40 h-96 w-96 rounded-full bg-orange-200/30 dark:bg-orange-500/5 blur-3xl"></div>
            </div>

            <div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">

                <!-- ===================== HERO ===================== -->
                <section class="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 pt-16 md:pt-24 pb-16">
                    <div class="text-center lg:text-start">
                        <span class="inline-flex items-center gap-2 rounded-full border border-amber-300/60 dark:border-amber-500/30 bg-amber-100/70 dark:bg-amber-500/10 px-4 py-1.5 text-sm font-bold text-amber-700 dark:text-amber-300">
                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M4 4h16v12H5.17L4 17.17V4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
                            {{ $t('contact.seo.title') }}
                        </span>
                        <h1 class="mt-6 text-3xl md:text-5xl font-extrabold leading-tight text-gray-800 dark:text-white">{{ $t('contact.hero.title') }}</h1>
                        <p class="mt-6 mx-auto lg:mx-0 max-w-xl text-base md:text-lg leading-8 text-gray-500 dark:text-gray-400 font-medium">{{ $t('contact.hero.desc') }}</p>
                    </div>
                    <div class="flex justify-center">
                        <SeoImage
                            priority
                            img-class="w-80 md:w-96 drop-shadow-xl"
                            :src="contact_us"
                            :alt="$t('contact.seo.title')"
                        />
                    </div>
                </section>

                <!-- ===================== CHANNELS & SOCIAL ===================== -->
                <section class="pb-16">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Channels -->
                        <div class="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-7 shadow-sm">
                            <h2 class="mb-6 text-lg font-extrabold text-gray-800 dark:text-white">{{ $t('contact.channels.title') }}</h2>
                            <div class="flex flex-wrap gap-3">
                                <a class="group flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/10 transition duration-200 hover:bg-amber-400 hover:-translate-y-1" href="https://t.me/zanburak" target="_blank" rel="noopener">
                                    <svg class="w-6 h-6" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path class="fill-current text-amber-500 transition duration-200 group-hover:text-white" d="M27.6063 1.36634C28.4988 2.27333 28.7658 3.53542 28.8669 4.45219C28.9798 5.47544 28.941 6.64933 28.813 7.85804C28.5556 10.2886 27.9014 13.186 27.0255 15.9748C26.1507 18.76 25.0187 21.5521 23.7562 23.7449C23.1271 24.8375 22.4229 25.8568 21.647 26.6607C20.9056 27.4288 19.883 28.2257 18.5944 28.4429L18.5873 28.4441C18.3448 28.4842 18.1084 28.4932 18.0251 28.4963L18.0092 28.4969C17.1678 28.5311 16.4412 28.2344 15.9452 27.968C15.4149 27.6831 14.9172 27.3071 14.4735 26.9129C13.5839 26.1225 12.717 25.0854 12.0115 24.0036C11.625 23.4108 11.2587 22.7616 10.9594 22.0896C10.5154 21.0929 10.7864 19.9603 11.458 19.0994L15.5328 14.2981C15.7414 14.0523 15.7262 13.6881 15.4979 13.4605C15.2695 13.2328 14.9043 13.2177 14.6577 13.4256L9.84211 17.4883C8.92423 18.2001 7.7103 18.4758 6.66051 17.9772C5.98926 17.6584 5.34208 17.2741 4.75088 16.8675C3.63451 16.0997 2.56486 15.1472 1.78043 14.1544C1.38906 13.659 1.01931 13.0916 0.767472 12.4777C0.524124 11.8846 0.313986 11.0581 0.512432 10.154L0.51276 10.1525C0.783943 8.91801 1.59665 7.94051 2.36691 7.22854C3.17804 6.47881 4.19792 5.79052 5.29295 5.17022C7.49017 3.92559 10.2726 2.79696 13.0471 1.92011C15.823 1.04281 18.7039 0.381914 21.1202 0.121652C22.3213 -0.0077328 23.4919 -0.0476991 24.5144 0.0680539C25.4326 0.171996 26.7026 0.447971 27.6063 1.36634Z"></path>
                                    </svg>
                                </a>
                                <a class="group flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/10 transition duration-200 hover:bg-amber-400 hover:-translate-y-1" href="mailto:info@zanburak.ir">
                                    <svg class="w-6 h-6" viewBox="0 0 32 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path class="fill-current text-amber-500 transition duration-200 group-hover:text-white" d="M15.979 28.4996C3.17737 28.4996 0.433594 25.9845 0.433594 14.2496C0.433594 11.0245 0.640843 8.49572 1.20718 6.5242C2.65728 7.978 4.48714 9.72621 6.47465 11.2834C9.29349 13.4919 12.7074 15.5451 15.979 15.5451C19.2507 15.5451 22.6646 13.4919 25.4835 11.2834C27.471 9.72621 29.3008 7.978 30.7509 6.5242C31.3173 8.49572 31.5245 11.0245 31.5245 14.2496C31.5245 25.9845 28.7807 28.4996 15.979 28.4996Z"></path>
                                        <path class="fill-current text-amber-500 transition duration-200 group-hover:text-white" d="M29.6219 3.98071C28.104 5.52774 26.0906 7.51629 23.8856 9.24387C21.108 11.42 18.3038 12.9542 15.979 12.9542C13.6543 12.9542 10.8501 11.42 8.07254 9.24387C5.86751 7.51629 3.85413 5.52774 2.33618 3.98071C4.39367 0.870955 8.44417 -0.000366211 15.979 -0.000366211C23.5139 -0.000366211 27.5644 0.870955 29.6219 3.98071Z"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <!-- Social -->
                        <div class="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-7 shadow-sm">
                            <h2 class="mb-6 text-lg font-extrabold text-gray-800 dark:text-white">{{ $t('contact.social.title') }}</h2>
                            <div class="flex flex-wrap gap-3">
                                <a class="group flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/10 transition duration-200 hover:bg-amber-400 hover:-translate-y-1" href="https://www.youtube.com/channel/zanburak" target="_blank" rel="noopener">
                                    <svg class="w-6 h-6" viewBox="0 0 35 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path class="fill-current text-amber-500 transition duration-200 group-hover:text-white" d="M34.1845 5.59278C34.1845 5.59278 33.8547 3.26471 32.8391 2.24247C31.553 0.897065 30.1153 0.89047 29.4558 0.811329C24.7337 0.468384 17.644 0.468384 17.644 0.468384H17.6308C17.6308 0.468384 10.541 0.468384 5.81894 0.811329C5.15943 0.89047 3.7217 0.897065 2.43566 2.24247C1.42001 3.26471 1.09685 5.59278 1.09685 5.59278C1.09685 5.59278 0.753906 8.32974 0.753906 11.0601V13.619C0.753906 16.3494 1.09026 19.0864 1.09026 19.0864C1.09026 19.0864 1.42001 21.4144 2.42906 22.4367C3.71511 23.7821 5.40345 23.7359 6.15529 23.881C8.85928 24.1382 17.6374 24.2173 17.6374 24.2173C17.6374 24.2173 24.7337 24.2042 29.4558 23.8678C30.1153 23.7887 31.553 23.7821 32.8391 22.4367C33.8547 21.4144 34.1845 19.0864 34.1845 19.0864C34.1845 19.0864 34.5208 16.356 34.5208 13.619V11.0601C34.5208 8.32974 34.1845 5.59278 34.1845 5.59278ZM14.1486 16.7253V7.23496L23.2696 11.9966L14.1486 16.7253Z"></path>
                                    </svg>
                                </a>
                                <a class="group flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/10 transition duration-200 hover:bg-amber-400 hover:-translate-y-1" href="https://www.facebook.com/" target="_blank" rel="noopener">
                                    <svg class="w-6 h-6" viewBox="0 0 30 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path class="fill-current text-amber-500 transition duration-200 group-hover:text-white" d="M29.6143 14.4298C29.6143 6.51203 23.1957 0.0933838 15.2779 0.0933838C7.36005 0.0933838 0.941406 6.51203 0.941406 14.4298C0.941406 21.5855 6.18401 27.5166 13.0378 28.5921V18.574H9.39767V14.4298H13.0378V11.2713C13.0378 7.67827 15.1782 5.69356 18.4529 5.69356C20.0209 5.69356 21.6621 5.97357 21.6621 5.97357V9.50168H19.8543C18.0735 9.50168 17.5179 10.6069 17.5179 11.7418V14.4298H21.4941L20.8584 18.574H17.5179V28.5921C24.3717 27.5166 29.6143 21.5855 29.6143 14.4298Z"></path>
                                    </svg>
                                </a>
                                <a class="group flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/10 transition duration-200 hover:bg-amber-400 hover:-translate-y-1" href="https://twitter.com/zanburakcom" target="_blank" rel="noopener">
                                    <svg class="w-6 h-6" viewBox="0 0 33 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path class="fill-current text-amber-500 transition duration-200 group-hover:text-white" d="M10.4895 26.5915C22.619 26.5915 29.2552 16.5398 29.2552 7.82572C29.2552 7.54314 29.249 7.25428 29.2364 6.97171C30.5273 6.03811 31.6414 4.88173 32.5262 3.55689C31.324 4.09181 30.0474 4.44116 28.7403 4.59302C30.1166 3.76803 31.1471 2.47202 31.6408 0.94523C30.3461 1.71256 28.9301 2.25385 27.4536 2.54589C26.4588 1.48885 25.1435 0.788961 23.711 0.554438C22.2786 0.319914 20.8087 0.563814 19.5288 1.24843C18.2488 1.93304 17.23 3.02024 16.6299 4.34194C16.0298 5.66363 15.8819 7.1462 16.2089 8.56043C13.5871 8.42887 11.0223 7.74781 8.68071 6.56143C6.33909 5.37504 4.27293 3.7098 2.61617 1.67366C1.77411 3.12546 1.51645 4.84341 1.89553 6.47836C2.27461 8.11331 3.262 9.54258 4.65702 10.4757C3.60972 10.4424 2.58537 10.1605 1.66859 9.65307V9.7347C1.66765 11.2583 2.19436 12.7351 3.15918 13.9142C4.124 15.0934 5.46739 15.902 6.96098 16.2026C5.99082 16.4681 4.9726 16.5067 3.98511 16.3157C4.40657 17.6259 5.22659 18.7719 6.33071 19.5937C7.43484 20.4155 8.76798 20.8721 10.1441 20.8997C7.80786 22.7349 4.92196 23.7302 1.95116 23.7255C1.42432 23.7247 0.897992 23.6924 0.375 23.6288C3.39301 25.565 6.90375 26.5934 10.4895 26.5915Z"></path>
                                    </svg>
                                </a>
                                <a class="group flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/10 transition duration-200 hover:bg-amber-400 hover:-translate-y-1" href="https://www.instagram.com/zanburak" target="_blank" rel="noopener">
                                    <svg class="w-6 h-6" viewBox="0 0 30 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path class="fill-current text-amber-500 transition duration-200 group-hover:text-white" d="M14.8147 2.65989C18.6227 2.65989 19.0736 2.67659 20.5712 2.74339C21.963 2.80463 22.7146 3.03846 23.2156 3.23331C23.8781 3.48941 24.3569 3.80117 24.8524 4.29666C25.3535 4.79771 25.6597 5.27093 25.9158 5.93343C26.1106 6.43448 26.3444 7.19163 26.4057 8.57787C26.4725 10.081 26.4892 10.532 26.4892 14.3344C26.4892 18.1424 26.4725 18.5934 26.4057 20.0909C26.3444 21.4828 26.1106 22.2343 25.9158 22.7354C25.6597 23.3979 25.3479 23.8767 24.8524 24.3722C24.3514 24.8732 23.8781 25.1794 23.2156 25.4355C22.7146 25.6304 21.9574 25.8642 20.5712 25.9254C19.068 25.9922 18.6171 26.0089 14.8147 26.0089C11.0067 26.0089 10.5557 25.9922 9.05812 25.9254C7.66631 25.8642 6.91473 25.6304 6.41368 25.4355C5.75118 25.1794 5.27239 24.8676 4.77691 24.3722C4.27586 23.8711 3.96966 23.3979 3.71356 22.7354C3.51871 22.2343 3.28489 21.4772 3.22365 20.0909C3.15684 18.5878 3.14014 18.1368 3.14014 14.3344C3.14014 10.5264 3.15684 10.0755 3.22365 8.57787C3.28489 7.18606 3.51871 6.43448 3.71356 5.93343C3.96966 5.27093 4.28142 4.79214 4.77691 4.29666C5.27796 3.7956 5.75118 3.48941 6.41368 3.23331C6.91473 3.03846 7.67188 2.80463 9.05812 2.74339C10.5557 2.67659 11.0067 2.65989 14.8147 2.65989ZM14.8147 0.0933838C10.9454 0.0933838 10.4611 0.110086 8.94121 0.176893C7.42692 0.2437 6.38584 0.488658 5.48395 0.839395C4.54308 1.20683 3.74697 1.69118 2.95642 2.4873C2.1603 3.27785 1.67595 4.07397 1.30851 5.00927C0.957775 5.91673 0.712816 6.95223 0.646009 8.46653C0.579202 9.99195 0.5625 10.4763 0.5625 14.3455C0.5625 18.2148 0.579202 18.6991 0.646009 20.219C0.712816 21.7333 0.957775 22.7744 1.30851 23.6763C1.67595 24.6171 2.1603 25.4132 2.95642 26.2038C3.74697 26.9943 4.54308 27.4842 5.47838 27.8461C6.38584 28.1969 7.42135 28.4418 8.93564 28.5086C10.4555 28.5754 10.9399 28.5921 14.8091 28.5921C18.6783 28.5921 19.1627 28.5754 20.6825 28.5086C22.1968 28.4418 23.2379 28.1969 24.1398 27.8461C25.0751 27.4842 25.8712 26.9943 26.6618 26.2038C27.4523 25.4132 27.9422 24.6171 28.3041 23.6818C28.6548 22.7744 28.8998 21.7388 28.9666 20.2246C29.0334 18.7047 29.0501 18.2203 29.0501 14.3511C29.0501 10.4819 29.0334 9.99752 28.9666 8.47766C28.8998 6.96337 28.6548 5.92229 28.3041 5.0204C27.9534 4.07397 27.469 3.27785 26.6729 2.4873C25.8824 1.69675 25.0862 1.20683 24.1509 0.844962C23.2435 0.494226 22.208 0.249267 20.6937 0.18246C19.1682 0.110086 18.6839 0.0933838 14.8147 0.0933838Z"></path>
                                        <path class="fill-current text-amber-500 transition duration-200 group-hover:text-white" d="M14.8147 7.02461C10.7728 7.02461 7.49373 10.3037 7.49373 14.3455C7.49373 18.3874 10.7728 21.6665 14.8147 21.6665C18.8565 21.6665 22.1356 18.3874 22.1356 14.3455C22.1356 10.3037 18.8565 7.02461 14.8147 7.02461ZM14.8147 19.0944C12.1925 19.0944 10.0658 16.9677 10.0658 14.3455C10.0658 11.7234 12.1925 9.59668 14.8147 9.59668C17.4368 9.59668 19.5635 11.7234 19.5635 14.3455C19.5635 16.9677 17.4368 19.0944 14.8147 19.0944Z"></path>
                                        <path class="fill-current text-amber-500 transition duration-200 group-hover:text-white" d="M24.1342 6.73496C24.1342 7.68139 23.366 8.44411 22.4251 8.44411C21.4787 8.44411 20.7159 7.67583 20.7159 6.73496C20.7159 5.78853 21.4842 5.02581 22.4251 5.02581C23.366 5.02581 24.1342 5.79409 24.1342 6.73496Z"></path>
                                    </svg>
                                </a>
                                <a class="group flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/10 transition duration-200 hover:bg-amber-400 hover:-translate-y-1" href="https://t.me/zanburakcom" target="_blank" rel="noopener">
                                    <svg class="w-6 h-6" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path class="stroke-current text-amber-500 transition duration-200 group-hover:text-white" d="M12.0502 17.9195L15.2016 14.772M12.0502 17.9195C9.74004 20.2311 0.0218845 16.1675 1.76708 11.0284C3.51228 5.88928 22.624 -0.386194 26.4872 3.47943C30.3505 7.34506 24.0504 26.5287 18.9371 28.209C13.8239 29.8893 9.74004 20.2311 12.0502 17.9195Z" stroke-width="2.84987" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- ===================== SUGGESTIONS / STEPS ===================== -->
                <section class="mx-auto max-w-4xl pb-16">
                    <div class="mb-10 text-center">
                        <h2 class="text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white">{{ $t('contact.suggestions.title') }}</h2>
                        <p class="mx-auto mt-4 max-w-2xl text-base font-medium leading-8 text-gray-500 dark:text-gray-400">{{ $t('contact.suggestions.desc') }}</p>
                    </div>

                    <div class="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 md:p-8 shadow-sm">
                        <div class="relative ps-8 md:ps-10">
                            <!-- vertical line -->
                            <span class="absolute top-2 bottom-2 start-[13px] md:start-[17px] w-0.5 bg-gradient-to-b from-amber-400 to-amber-400/10"></span>

                            <div v-for="(step, index) in displayedSteps" :key="index" :ref="`step-${index}`" class="relative mb-6 last:mb-0">
                                <!-- number dot -->
                                <span class="absolute -start-8 md:-start-10 top-0 flex h-7 w-7 md:h-9 md:w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-xs md:text-sm font-extrabold text-gray-900 shadow-md ring-4 ring-white dark:ring-gray-900">
                                    {{ index + 1 }}
                                </span>
                                <div class="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40 p-4 md:p-5">
                                    <span class="inline-block rounded-md bg-amber-400/15 px-2 py-0.5 text-[0.7rem] font-bold text-amber-600 dark:text-amber-400">{{ step.label }}</span>
                                    <h3 class="mt-2 text-base md:text-lg font-bold text-gray-800 dark:text-white">{{ step.title }}</h3>
                                    <p class="mt-2 text-sm leading-7 font-medium text-gray-500 dark:text-gray-400">{{ step.description }}</p>
                                </div>
                            </div>
                        </div>

                        <div class="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 dark:border-gray-800 pt-6">
                            <div class="flex items-center gap-2">
                                <button @click="previousStep" :disabled="currentStep === 0" :title="$t('contact.prevStep')"
                                    class="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 transition hover:border-amber-400 hover:text-amber-500 disabled:opacity-40 disabled:hover:border-gray-200 dark:disabled:hover:border-gray-700 disabled:hover:text-gray-600">
                                    <svg class="w-5 h-5 rtl:rotate-180" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                </button>
                                <span class="text-xs font-semibold text-gray-400 dark:text-gray-500">{{ currentStep + 1 }} / {{ steps.length }}</span>
                                <button @click="nextStep" :disabled="currentStep === steps.length - 1" :title="$t('contact.nextStep')"
                                    class="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 transition hover:border-amber-400 hover:text-amber-500 disabled:opacity-40 disabled:hover:border-gray-200 dark:disabled:hover:border-gray-700 disabled:hover:text-gray-600">
                                    <svg class="w-5 h-5 rtl:rotate-180" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                </button>
                            </div>
                            <router-link :to="{ name: 'discuss-create', query: { private: true, contact_us: true } }"
                                class="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-3 text-sm font-bold text-gray-900 shadow-lg shadow-amber-500/30 transition hover:-translate-y-0.5 hover:shadow-xl">
                                {{ $t('contact.createPrivateChat') }}
                                <svg class="w-4 h-4 rtl:rotate-180 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            </router-link>
                        </div>
                    </div>
                </section>

                <!-- ===================== OFFICE INFO + MAP ===================== -->
                <section class="pb-24">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <!-- Info -->
                        <div class="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-7 md:p-8 shadow-sm flex flex-col justify-center gap-7">
                            <div class="flex gap-4">
                                <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-500">
                                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M7.10456 3C6.76773 3 6.43316 3.05136 6.11069 3.15205L5.86419 3.22902C4.42827 3.67739 3.38837 4.95989 3.11805 6.494C2.96065 7.38721 2.96065 8.3051 3.11805 9.19831C3.12424 9.23344 3.13083 9.26843 3.13782 9.30329C4.26404 15.1571 8.84285 19.7359 14.6966 20.8622C14.7315 20.8692 14.7665 20.8758 14.8017 20.882C15.6949 21.0394 16.6128 21.0393 17.506 20.882C19.0401 20.6116 20.3226 19.5717 20.771 18.1358L20.8479 17.8893C20.9486 17.5668 21 17.2323 21 16.8954C21 15.2764 19.5743 14.0769 17.9621 14.0769H14.3456C12.7333 14.0769 11.3077 15.2764 11.3077 16.8954C11.3077 17.2323 11.359 17.5668 11.4597 17.8893L11.5367 18.1358C11.563 18.22 11.5921 18.3028 11.624 18.3842C9.01591 17.0999 6.9001 14.9841 5.61584 12.376C5.69721 12.4079 5.78002 12.437 5.86418 12.4633L6.11069 12.5403C6.43316 12.641 6.76772 12.6923 7.10456 12.6923C8.72358 12.6923 9.92308 11.2667 9.92308 9.65441L9.92308 6.03791C9.92309 4.42565 8.72359 3 7.10456 3Z"/></svg>
                                </span>
                                <div>
                                    <h3 class="text-lg font-bold text-gray-800 dark:text-white">{{ $t('contact.office.phoneTitle') }}</h3>
                                    <a href="tel:+986633416935" dir="ltr" class="mt-1 block text-gray-500 dark:text-gray-400 font-semibold hover:text-amber-500 transition">06633416935</a>
                                </div>
                            </div>
                            <div class="h-px bg-gray-100 dark:bg-gray-800"></div>
                            <div class="flex gap-4">
                                <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-500">
                                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C7.56777 3 4 6.70292 4 11.2389C4 13.4908 4.87829 15.9032 6.28347 17.757C7.68543 19.6066 9.69437 21 12 21C14.3056 21 16.3146 19.6066 17.7165 17.757C19.1217 15.9032 20 13.4908 20 11.2389C20 6.70292 16.4322 3 12 3ZM9.16571 10.6154C9.16571 9.035 10.4347 7.75385 12 7.75385C13.5653 7.75385 14.8343 9.035 14.8343 10.6154C14.8343 12.1958 13.5653 13.4769 12 13.4769C10.4347 13.4769 9.16571 12.1958 9.16571 10.6154Z"/></svg>
                                </span>
                                <div>
                                    <h3 class="text-lg font-bold text-gray-800 dark:text-white">{{ $t('contact.office.addressTitle') }}</h3>
                                    <p class="mt-1 text-gray-500 dark:text-gray-400 font-medium leading-8">{{ $t('contact.office.addressValue') }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Map link -->
                        <a target="_blank" rel="noopener" href="https://www.google.com/maps/dir//33.4511423,48.3613157/@33.4512278,48.3591612,17.5z?hl=fa&entry=ttu"
                            class="group relative overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-amber-50 to-white dark:from-gray-800 dark:to-gray-900 p-8 shadow-sm flex flex-col items-center justify-center text-center transition hover:shadow-xl">
                            <div class="pointer-events-none absolute -top-10 -end-10 h-40 w-40 rounded-full bg-amber-300/20 blur-2xl"></div>
                            <SeoImage
                                img-class="w-52 md:w-60 transition duration-300 group-hover:scale-105"
                                :src="earth_map"
                                :alt="$t('contact.mapAlt')"
                            />
                            <span class="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gray-900 dark:bg-white px-6 py-3 text-sm font-bold text-white dark:text-gray-900 transition group-hover:bg-amber-500 dark:group-hover:bg-amber-400">
                                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-6.5-7-11a7 7 0 1 1 14 0c0 4.5-7 11-7 11Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" stroke-width="2"/></svg>
                                {{ $t('contact.mapAlt') }}
                            </span>
                        </a>
                    </div>
                </section>
            </div>
        </div>
    </MasterPage>
</template>

<script>
import contact_us from '@/assets/image/other/contact-us.svg'
import earth_map from '@/assets/image/other/earth-map.svg'
import MasterPage from "@/views/page/layouts/MasterPage.vue";
import { useSEO } from "@/composables/useSEO";
import SeoImage from "@/views/components/seo/SeoImage.vue";
export default {
    components: {
        MasterPage,
        SeoImage,
    },
    data() {
        return {
            contact_us,
            earth_map,
            currentStep: 0,
            displayedSteps: [],
        };
    },
    computed: {
        steps() {
            return [
                {
                    label: this.$t("contact.steps.step1.label"),
                    title: this.$t("contact.steps.step1.title"),
                    description: this.$t("contact.steps.step1.description"),
                },
                {
                    label: this.$t("contact.steps.step2.label"),
                    title: this.$t("contact.steps.step2.title"),
                    description: this.$t("contact.steps.step2.description"),
                },
                {
                    label: this.$t("contact.steps.step3.label"),
                    title: this.$t("contact.steps.step3.title"),
                    description: this.$t("contact.steps.step3.description"),
                },
                {
                    label: this.$t("contact.steps.step4.label"),
                    title: this.$t("contact.steps.step4.title"),
                    description: this.$t("contact.steps.step4.description"),
                },
                {
                    label: this.$t("contact.steps.step5.label"),
                    title: this.$t("contact.steps.step5.title"),
                    description: this.$t("contact.steps.step5.description"),
                },
            ];
        },
    },
    methods: {
        nextStep() {
            if (this.currentStep < this.steps.length - 1) {
                this.currentStep++;
                this.updateDisplayedSteps();
                this.scrollToLastStep();
            }
        },
        previousStep() {
            if (this.currentStep > 0) {
                this.currentStep--;
                this.updateDisplayedSteps();
                this.scrollToLastStep();
            }
        },
        updateDisplayedSteps() {
            this.displayedSteps = this.steps.slice(0, this.currentStep + 1);
        },
        scrollToLastStep() {
            this.$nextTick(() => {
                const lastStep = this.$refs[`step-${this.displayedSteps.length - 1}`];
                if (lastStep && lastStep[0]) {
                    lastStep[0].scrollIntoView({ behavior: "smooth" });
                }
            });
        },
    },
    mounted() {
        this.updateDisplayedSteps();

        useSEO({
            title: this.$t('contact.seo.title'),
            description: this.$t('contact.seo.description'),
            url: '/contact',
            keywords: ['تماس با ما', 'ارتباط با ما', 'پشتیبانی', 'آدرس زنبورک', 'شماره تماس', 'زنبورک'],
            noindex: false
        });
    },
};
</script>

<style></style>
