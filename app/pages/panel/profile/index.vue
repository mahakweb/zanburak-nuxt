<script setup>
definePageMeta({
  name: "panel-profile",
  middleware: ['auth'],
})
</script>

<template>
    <ProfileMasterPage>
        <div class="">
            <div v-if="loading">
                <div class="mb-5 last:mb-0 bg-white dark:bg-gray-900 rounded-xl md:p-6 px-3 py-3">
                    <div class="animate-pulse h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-4"></div>
                    <div>
                        <div class="relative mb-20">
                            <div>
                                <div class="relative rounded-2xl overflow-hidden">
                                    <div class="animate-pulse flex items-center justify-center h-40 md:h-44 lg:h-52 xl:h-60 w-full mb-4 bg-gray-300 rounded-xl dark:bg-gray-700">
                                        <svg class="w-8 h-8 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div class="animate-pulse flex absolute w-20 md:w-24 lg:w-28 h-20 md:h-24 lg:h-28 rounded-full md:border-4 md:start-6 start-1/2 transform sm:translate-x-0 translate-x-1/2 -bottom-8 border-2 dark:border-gray-600 border-solid bg-gray-300 dark:bg-gray-700 overflow-hidden">
                                    <svg class="m-auto w-10 h-10 text-gray-400 dark:text-gray-600" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="6" r="4" fill="currentColor"></circle>
                                        <ellipse cx="12" cy="17" rx="7" ry="4" fill="currentColor"></ellipse>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="grid md:grid-cols-2 grid-cols-1 md:gap-x-14 gap-y-6">
                            <div class="animate-pulse flex flex-col">
                                <div class="h-1.5 bg-gray-200 rounded-full dark:bg-gray-700 w-24 mb-3"></div>
                                <div class="h-10 bg-gray-200 rounded-lg dark:bg-gray-700 w-full"></div>
                            </div>
                            <div class="animate-pulse flex flex-col">
                                <div class="h-1.5 bg-gray-200 rounded-full dark:bg-gray-700 w-24 mb-3"></div>
                                <div class="h-10 bg-gray-200 rounded-lg dark:bg-gray-700 w-full"></div>
                            </div>
                            <div class="animate-pulse flex flex-col">
                                <div class="h-1.5 bg-gray-200 rounded-full dark:bg-gray-700 w-24 mb-3"></div>
                                <div class="h-10 bg-gray-200 rounded-lg dark:bg-gray-700 w-full"></div>
                            </div>
                            <div class="animate-pulse flex flex-col">
                                <div class="h-1.5 bg-gray-200 rounded-full dark:bg-gray-700 w-24 mb-3"></div>
                                <div class="h-10 bg-gray-200 rounded-lg dark:bg-gray-700 w-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="flex flex-col">
                <div>
                    <div class="mb-5 last:mb-0 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm md:p-6 p-4">
                        <div class="flex items-center gap-3 mb-5">
                            <span class="w-10 h-10 rounded-xl bg-amber-400/15 text-amber-500 flex items-center justify-center shrink-0">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </span>
                            <h2 class="text-gray-800 dark:text-white font-bold text-base md:text-lg">{{ $t('profile.account.title') }}</h2>
                        </div>
                        <div>
                            <div class="relative mb-16">
                                <!-- Cover -->
                                <div
                                    class="relative rounded-2xl overflow-hidden group transition-all"
                                    :class="isDefaultCover
                                        ? 'border-2 border-dashed border-gray-300/80 dark:border-gray-600/80 hover:border-amber-400/60 dark:hover:border-amber-500/40'
                                        : 'ring-1 ring-gray-200/80 dark:ring-gray-700/80 shadow-sm'"
                                >
                                    <div v-if="isDefaultCover"
                                        class="cover-empty-bg h-40 md:h-44 lg:h-52 xl:h-60 w-full flex flex-col items-center justify-center gap-3 cursor-pointer"
                                        @click="openFileInputCover">
                                        <div class="w-14 h-14 rounded-2xl bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm flex items-center justify-center shadow-sm ring-1 ring-white/50 dark:ring-gray-700/50">
                                            <svg class="w-7 h-7 text-amber-500/80 dark:text-amber-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div class="text-center px-4">
                                            <p class="text-sm font-semibold text-gray-600 dark:text-gray-300">{{ $t('profile.account.coverAlt', { name: userData.user.first_name }) }}</p>
                                            <p class="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{{ $t('profile.account.cropHint') }}</p>
                                        </div>
                                    </div>
                                    <template v-else>
                                        <div class="h-40 md:h-44 lg:h-52 xl:h-60 w-full">
                                            <SeoImage
                                                :key="coverPicDisplayUrl"
                                                :src="coverPicDisplayUrl"
                                                :alt="$t('profile.account.coverAlt', { name: userData.user.first_name })"
                                                :width="1200"
                                                :height="400"
                                                sizes-preset="hero"
                                                :priority="true"
                                                img-class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                                @error="onCoverPicError"
                                            />
                                        </div>
                                        <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                                        <div class="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/15 transition-colors pointer-events-none" />
                                        <button
                                            type="button"
                                            @click.stop="openFileInputCover"
                                            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-sm font-semibold text-gray-800 dark:text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                            {{ $t('profile.account.cropTitleCover') }}
                                        </button>
                                    </template>

                                    <input ref="fileInputCover" @change="onImageFileSelected($event, 'cover')" accept=".gif,.jpg,.jpeg,.GIF,.png,.PNG,.JPG,.JPEG,.bmp,.BMP" class="hidden" type="file" />

                                    <div v-if="uploadInProgressCover" class="absolute inset-0 z-30 flex items-center justify-center bg-black/40">
                                        <div class="w-16 h-16 p-1 rounded-full bg-white/20 backdrop-blur-sm">
                                            <svg class="w-full h-full" viewBox="25 25 50 50">
                                                <circle class="stroke-current text-white/30" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-linecap="round" stroke-dasharray="200, 300" />
                                                <circle class="stroke-current text-white" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-linecap="round" stroke-dasharray="100, 200">
                                                    <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite" />
                                                </circle>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <!-- Profile avatar -->
                                <div
                                    class="absolute z-20 w-20 md:w-24 lg:w-28 h-20 md:h-24 lg:h-28 rounded-full md:start-6 start-1/2 transform sm:translate-x-0 translate-x-1/2 -bottom-12 border-4 overflow-hidden shadow-xl group/avatar transition-all"
                                    :class="isDefaultProfile
                                        ? 'border-white dark:border-slate-900 border-dashed'
                                        : 'border-white dark:border-slate-900'"
                                >
                                    <div v-if="isDefaultProfile"
                                        class="profile-empty-bg w-full h-full flex flex-col items-center justify-center cursor-pointer"
                                        @click="openFileInputProfile">
                                        <span v-if="userInitials !== '?'" class="text-2xl md:text-3xl font-bold text-gray-500/70 dark:text-gray-400/80 select-none">{{ userInitials }}</span>
                                        <svg v-else class="w-10 h-10 text-gray-400/70 dark:text-gray-500/80" viewBox="0 0 24 24" fill="currentColor">
                                            <circle cx="12" cy="8" r="4" />
                                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                                        </svg>
                                        <div class="absolute inset-0 flex items-center justify-center bg-gray-900/0 group-hover/avatar:bg-gray-900/20 transition-colors">
                                            <span class="w-9 h-9 rounded-full bg-white/90 dark:bg-gray-900/90 flex items-center justify-center shadow-md opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                                                <svg class="w-4 h-4 text-gray-700 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                    <template v-else>
                                        <SeoImage
                                            :key="profilePicDisplayUrl"
                                            :src="profilePicDisplayUrl"
                                            :alt="$t('profile.account.profilePicAlt', { name: userData.user.first_name })"
                                            :width="112"
                                            :height="112"
                                            sizes-preset="avatar"
                                            img-class="w-full h-full object-cover"
                                            @error="onProfilePicError"
                                        />
                                        <div class="absolute inset-0 bg-gray-900/0 group-hover/avatar:bg-gray-900/25 transition-colors pointer-events-none" />
                                        <button
                                            type="button"
                                            @click.stop="openFileInputProfile"
                                            class="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity"
                                        >
                                            <span class="w-9 h-9 rounded-full bg-white/90 dark:bg-gray-900/90 flex items-center justify-center shadow-md">
                                                <svg class="w-4 h-4 text-gray-700 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </span>
                                        </button>
                                    </template>

                                    <input ref="fileInputProfile" @change="onImageFileSelected($event, 'profile')" accept=".gif,.jpg,.jpeg,.GIF,.png,.PNG,.JPG,.JPEG,.bmp,.BMP" class="hidden" type="file" />

                                    <div v-if="uploadInProgressProfile" class="absolute inset-0 z-30 flex items-center justify-center bg-black/40">
                                        <div class="w-14 h-14 p-1 rounded-full bg-white/20 backdrop-blur-sm">
                                            <svg class="w-full h-full" viewBox="25 25 50 50">
                                                <circle class="stroke-current text-white/30" cx="50" cy="50" r="20" fill="none" stroke-width="4" stroke-linecap="round" stroke-dasharray="200, 300" />
                                                <circle class="stroke-current text-white" cx="50" cy="50" r="20" fill="none" stroke-width="4" stroke-linecap="round" stroke-dasharray="100, 200">
                                                    <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite" />
                                                </circle>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="grid md:grid-cols-2 grid-cols-1 md:gap-x-8 gap-y-5">
                                <div class="flex flex-col">
                                    <label class="text-gray-600 dark:text-gray-300 text-xs font-semibold mb-1.5 ps-1" for="">{{ $t('profile.account.firstNameFa') }}</label>
                                    <input
                                        v-model="userData.user.first_name"
                                        :class="errors && errors['user.first_name'] ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/30' : 'border-gray-200 dark:border-gray-700 focus:border-amber-400 focus:ring-amber-400/30'"
                                        class="h-11 w-full rounded-xl bg-gray-50 dark:bg-gray-800/60 border px-3.5 text-sm font-medium text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 outline-none focus:ring-2 focus:bg-white dark:focus:bg-gray-800"
                                        :placeholder="$t('profile.account.firstNamePlaceholder')"
                                        type="text"
                                    />
                                    <span v-if="errors && errors['user.first_name']" class="mt-1.5 text-rose-500 text-xs font-semibold">
                                        {{ errors["user.first_name"][0] }}
                                    </span>
                                </div>
                                <div class="flex flex-col">
                                    <label class="text-gray-600 dark:text-gray-300 text-xs font-semibold mb-1.5 ps-1" for="">{{ $t('profile.account.lastNameFa') }}</label>
                                    <input
                                        v-model="userData.user.last_name"
                                        :class="errors && errors['user.last_name'] ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/30' : 'border-gray-200 dark:border-gray-700 focus:border-amber-400 focus:ring-amber-400/30'"
                                        class="h-11 w-full rounded-xl bg-gray-50 dark:bg-gray-800/60 border px-3.5 text-sm font-medium text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 outline-none focus:ring-2 focus:bg-white dark:focus:bg-gray-800"
                                        :placeholder="$t('profile.account.lastNamePlaceholder')"
                                        type="text"
                                    />
                                    <span v-if="errors && errors['user.last_name']" class="mt-1.5 text-rose-500 text-xs font-semibold">
                                        {{ errors["user.last_name"][0] }}
                                    </span>
                                </div>
                                <div class="flex flex-col">
                                    <label class="text-gray-600 dark:text-gray-300 text-xs font-semibold mb-1.5 ps-1 flex items-center gap-1.5" for="">
                                        {{ $t('profile.account.email') }}
                                        <svg class="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    </label>
                                    <input
                                        v-model="userData.user.email"
                                        style="direction: ltr"
                                        disabled="disabled"
                                        class="cursor-not-allowed h-11 w-full rounded-xl bg-gray-100 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/60 px-3.5 text-sm font-medium text-gray-500 dark:text-gray-400 outline-none"
                                        type="email"
                                    />
                                    <span class="text-gray-400 dark:text-gray-500 ps-1 text-xs mt-1.5">{{ $t('profile.account.emailNotEditable') }}</span>
                                    <span v-if="errors && errors['user.email']" class="mt-1.5 text-rose-500 text-xs font-semibold">
                                        {{ errors["user.email"][0] }}
                                    </span>
                                </div>
                                <div class="flex flex-col">
                                    <label class="text-gray-600 dark:text-gray-300 text-xs font-semibold mb-1.5 ps-1" for="">{{ $t('profile.account.profileAddress') }}</label>
                                    <div class="relative items-center group">
                                        <span
                                            style="direction: ltr"
                                            :class="{ 'text-rose-500 dark:text-rose-500': errors && errors['user.username'] }"
                                            class="absolute top-1/2 text-gray-400 dark:text-gray-500 transform start-3.5 font-medium text-sm -translate-y-1/2 transition-colors"
                                            >https://zanburak.ir/@</span
                                        >
                                        <input
                                            v-model="userData.user.username"
                                            :class="errors && errors['user.username'] ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/30' : 'border-gray-200 dark:border-gray-700 focus:border-amber-400 focus:ring-amber-400/30'"
                                            style="direction: ltr"
                                            class="h-11 ps-[10.8rem] w-full rounded-xl bg-gray-50 dark:bg-gray-800/60 border px-3.5 text-sm font-medium text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 outline-none focus:ring-2 focus:bg-white dark:focus:bg-gray-800"
                                            placeholder="miladmahaki"
                                            type="text"
                                            onfocus="this.parentNode.querySelector('span').classList.add('!text-amber-500')"
                                            onblur="this.parentNode.querySelector('span').classList.remove('!text-amber-500')"
                                        />
                                    </div>
                                    <span v-if="errors && errors['user.username']" class="mt-1.5 text-rose-500 text-xs font-semibold">
                                        {{ errors["user.username"][0] }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mb-5 last:mb-0 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm md:p-6 p-4">
                        <div class="flex items-center gap-3 mb-5">
                            <span class="w-10 h-10 rounded-xl bg-amber-400/15 text-amber-500 flex items-center justify-center shrink-0">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </span>
                            <h2 class="text-gray-800 dark:text-white font-bold text-base md:text-lg">{{ $t('profile.account.personalInfo') }}</h2>
                        </div>
                        <div>
                            <div class="grid md:grid-cols-2 grid-cols-1 md:gap-x-8 gap-y-5">
                                <div class="flex flex-col">
                                    <label class="text-gray-600 dark:text-gray-300 text-xs font-semibold mb-1.5 ps-1" for="">{{ $t('profile.account.birthDate') }}</label>
                                    <div
                                        dir="ltr"
                                        :class="errors && errors['info.birth_date'] ? 'border-rose-400' : 'border-gray-200 dark:border-gray-700 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/30'"
                                        class="h-11 bg-gray-50 dark:bg-gray-800/60 border rounded-xl flex justify-around items-center transition-all duration-200"
                                    >
                                        <input v-model="userData.info.birth_date.year" ref="yearInput" class="w-14 text-gray-700 dark:text-gray-100 outline-none ring-0 h-11 bg-transparent px-1 border-none placeholder-gray-400 dark:placeholder-gray-500 text-center font-medium text-sm" :placeholder="$t('profile.account.year')" type="tel" maxlength="4" @focus="$event.target.select()" @input="handleOnlyNumbers($event, 4, 'monthInput')" />
                                        <span class="text-gray-300 dark:text-gray-600">/</span>
                                        <input v-model="userData.info.birth_date.month" ref="monthInput" class="w-12 h-11 text-gray-700 dark:text-gray-100 outline-none ring-0 bg-transparent px-1 border-none placeholder-gray-400 dark:placeholder-gray-500 text-center font-medium text-sm" :placeholder="$t('profile.account.month')" type="tel" maxlength="2" @focus="$event.target.select()" @input="handleOnlyNumbers($event, 2, 'dayInput')" />
                                        <span class="text-gray-300 dark:text-gray-600">/</span>
                                        <input v-model="userData.info.birth_date.day" ref="dayInput" class="w-12 h-11 text-gray-700 dark:text-gray-100 outline-none ring-0 bg-transparent px-1 border-none placeholder-gray-400 dark:placeholder-gray-500 text-center font-medium text-sm" :placeholder="$t('profile.account.day')" type="tel" maxlength="2" @focus="$event.target.select()" @input="handleOnlyNumbers($event, 2, '')" />
                                    </div>
                                    <span class="text-gray-400 dark:text-gray-500 text-xs mt-1.5 ps-1">{{ $t('profile.account.birthDateFormat') }}</span>
                                    <span v-if="errors && errors['info.birth_date']" class="mt-1.5 text-rose-500 text-xs font-semibold">
                                        {{ errors["info.birth_date"][0] }}
                                    </span>
                                </div>
                                <div class="flex flex-col">
                                    <label class="text-gray-600 dark:text-gray-300 text-xs font-semibold mb-1.5 ps-1" for="">{{ $t('profile.account.jobTitle') }}</label>
                                    <input
                                        v-model="userData.info.job"
                                        :class="errors && errors['info.job'] ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/30' : 'border-gray-200 dark:border-gray-700 focus:border-amber-400 focus:ring-amber-400/30'"
                                        class="h-11 w-full rounded-xl bg-gray-50 dark:bg-gray-800/60 border px-3.5 text-sm font-medium text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 outline-none focus:ring-2 focus:bg-white dark:focus:bg-gray-800"
                                        :placeholder="$t('profile.account.jobPlaceholder')"
                                        type="text"
                                    />
                                    <span v-if="errors && errors['info.job']" class="mt-1.5 text-rose-500 text-xs font-semibold">
                                        {{ errors["info.job"][0] }}
                                    </span>
                                </div>

                                <div class="flex flex-col md:col-span-2">
                                    <label class="text-gray-600 dark:text-gray-300 text-xs font-semibold mb-1.5 ps-1" for="">{{ $t('profile.account.about') }}</label>
                                    <textarea
                                        v-model="userData.info.about"
                                        :class="errors && errors['info.about'] ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/30' : 'border-gray-200 dark:border-gray-700 focus:border-amber-400 focus:ring-amber-400/30'"
                                        :placeholder="$t('profile.account.aboutPlaceholder')"
                                        class="h-36 w-full rounded-xl bg-gray-50 dark:bg-gray-800/60 border p-3.5 text-sm font-medium text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 leading-6 transition-all duration-200 outline-none focus:ring-2 focus:bg-white dark:focus:bg-gray-800 resize-none"
                                        cols="30"
                                        rows="10"
                                    ></textarea>
                                    <span v-if="errors && errors['info.about']" class="mt-1.5 text-rose-500 text-xs font-semibold">
                                        {{ errors["info.about"][0] }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mb-5 last:mb-0 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm md:p-6 p-4">
                        <div class="flex items-center gap-3 mb-5">
                            <span class="w-10 h-10 rounded-xl bg-amber-400/15 text-amber-500 flex items-center justify-center shrink-0">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </span>
                            <h2 class="text-gray-800 dark:text-white font-bold text-base md:text-lg">{{ $t('profile.account.contactInfo') }}</h2>
                        </div>
                        <div>
                            <div class="grid sm:grid-cols-2 grid-cols-1 gap-x-8 gap-y-5">
                                <div class="flex flex-col">
                                    <label class="text-gray-600 dark:text-gray-300 text-xs font-semibold mb-1.5 ps-1" for="">{{ $t('profile.account.website') }}</label>
                                    <input
                                        v-model="userData.info.website"
                                        :class="errors && errors['info.website'] ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/30' : 'border-gray-200 dark:border-gray-700 focus:border-amber-400 focus:ring-amber-400/30'"
                                        style="direction: ltr"
                                        class="h-11 w-full rounded-xl bg-gray-50 dark:bg-gray-800/60 border px-3.5 text-sm font-medium text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 outline-none focus:ring-2 focus:bg-white dark:focus:bg-gray-800"
                                        placeholder="https://zanburak.ir"
                                        type="text"
                                    />
                                    <span v-if="errors && errors['info.website']" class="mt-1.5 text-rose-500 text-xs font-semibold">
                                        {{ errors["info.website"][0] }}
                                    </span>
                                </div>
                                <div class="flex flex-col">
                                    <label class="text-gray-600 dark:text-gray-300 text-xs font-semibold mb-1.5 ps-1" for="">{{ $t('profile.account.github') }}</label>
                                    <div class="relative items-center group">
                                        <span
                                            style="direction: ltr"
                                            :class="{ 'text-rose-500 dark:text-rose-500': errors && errors['info.github'] }"
                                            class="absolute top-1/2 text-gray-400 dark:text-gray-500 transform start-3.5 font-medium text-sm -translate-y-1/2 transition-colors"
                                            >https://github.com/</span
                                        >
                                        <input
                                            v-model="userData.info.github"
                                            :class="errors && errors['info.github'] ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/30' : 'border-gray-200 dark:border-gray-700 focus:border-amber-400 focus:ring-amber-400/30'"
                                            style="direction: ltr"
                                            class="h-11 ps-[8.2rem] w-full rounded-xl bg-gray-50 dark:bg-gray-800/60 border px-3.5 text-sm font-medium text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 outline-none focus:ring-2 focus:bg-white dark:focus:bg-gray-800"
                                            placeholder=""
                                            type="text"
                                            onfocus="this.parentNode.querySelector('span').classList.add('!text-amber-500')"
                                            onblur="this.parentNode.querySelector('span').classList.remove('!text-amber-500')"
                                        />
                                    </div>
                                    <span v-if="errors && errors['info.github']" class="mt-1.5 text-rose-500 text-xs font-semibold">
                                        {{ errors["info.github"][0] }}
                                    </span>
                                </div>
                                <div class="flex flex-col">
                                    <label class="text-gray-600 dark:text-gray-300 text-xs font-semibold mb-1.5 ps-1" for="">{{ $t('profile.account.linkedin') }}</label>
                                    <div class="relative items-center group">
                                        <span
                                            style="direction: ltr"
                                            :class="{ 'text-rose-500 dark:text-rose-500': errors && errors['info.linkedin'] }"
                                            class="absolute top-1/2 text-gray-400 dark:text-gray-500 transform start-3.5 font-medium text-sm -translate-y-1/2 transition-colors"
                                            >https://linkedin.com/in/</span
                                        >
                                        <input
                                            v-model="userData.info.linkedin"
                                            style="direction: ltr"
                                            :class="errors && errors['info.linkedin'] ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/30' : 'border-gray-200 dark:border-gray-700 focus:border-amber-400 focus:ring-amber-400/30'"
                                            class="h-11 ps-40 w-full rounded-xl bg-gray-50 dark:bg-gray-800/60 border px-3.5 text-sm font-medium text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 outline-none focus:ring-2 focus:bg-white dark:focus:bg-gray-800"
                                            placeholder=""
                                            type="text"
                                            onfocus="this.parentNode.querySelector('span').classList.add('!text-amber-500')"
                                            onblur="this.parentNode.querySelector('span').classList.remove('!text-amber-500')"
                                        />
                                    </div>
                                    <span v-if="errors && errors['info.linkedin']" class="mt-1.5 text-rose-500 text-xs font-semibold">
                                        {{ errors["info.linkedin"][0] }}
                                    </span>
                                </div>
                                <div class="flex flex-col">
                                    <label class="text-gray-600 dark:text-gray-300 text-xs font-semibold mb-1.5 ps-1" for="">{{ $t('profile.account.telegram') }}</label>
                                    <div class="relative items-center group">
                                        <span
                                            style="direction: ltr"
                                            :class="{ 'text-rose-500 dark:text-rose-500': errors && errors['info.telegram'] }"
                                            class="absolute top-1/2 text-gray-400 dark:text-gray-500 transform start-3.5 font-medium text-sm -translate-y-1/2 transition-colors"
                                            >https://t.me/</span
                                        >
                                        <input
                                            v-model="userData.info.telegram"
                                            :class="errors && errors['info.telegram'] ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/30' : 'border-gray-200 dark:border-gray-700 focus:border-amber-400 focus:ring-amber-400/30'"
                                            style="direction: ltr"
                                            class="h-11 ps-24 w-full rounded-xl bg-gray-50 dark:bg-gray-800/60 border px-3.5 text-sm font-medium text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 outline-none focus:ring-2 focus:bg-white dark:focus:bg-gray-800"
                                            placeholder=""
                                            type="text"
                                            onfocus="this.parentNode.querySelector('span').classList.add('!text-amber-500')"
                                            onblur="this.parentNode.querySelector('span').classList.remove('!text-amber-500')"
                                        />
                                    </div>
                                    <span v-if="errors && errors['info.telegram']" class="mt-1.5 text-rose-500 text-xs font-semibold">
                                        {{ errors["info.telegram"][0] }}
                                    </span>
                                </div>
                                <div class="flex flex-col">
                                    <label class="text-gray-600 dark:text-gray-300 text-xs font-semibold mb-1.5 ps-1" for="">{{ $t('profile.account.instagram') }}</label>
                                    <div class="relative items-center group">
                                        <span
                                            style="direction: ltr"
                                            :class="{ 'text-rose-500 dark:text-rose-500': errors && errors['info.instagram'] }"
                                            class="absolute top-1/2 text-gray-400 dark:text-gray-500 transform start-3.5 font-medium text-sm -translate-y-1/2 transition-colors"
                                            >https://instagram.com/</span
                                        >
                                        <input
                                            v-model="userData.info.instagram"
                                            :class="errors && errors['info.instagram'] ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/30' : 'border-gray-200 dark:border-gray-700 focus:border-amber-400 focus:ring-amber-400/30'"
                                            style="direction: ltr"
                                            class="h-11 ps-[9.5rem] w-full rounded-xl bg-gray-50 dark:bg-gray-800/60 border px-3.5 text-sm font-medium text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 outline-none focus:ring-2 focus:bg-white dark:focus:bg-gray-800"
                                            placeholder=""
                                            type="text"
                                            onfocus="this.parentNode.querySelector('span').classList.add('!text-amber-500')"
                                            onblur="this.parentNode.querySelector('span').classList.remove('!text-amber-500')"
                                        />
                                    </div>
                                    <span v-if="errors && errors['info.instagram']" class="mt-1.5 text-rose-500 text-xs font-semibold">
                                        {{ errors["info.instagram"][0] }}
                                    </span>
                                </div>
                                <div class="flex flex-col">
                                    <label class="text-gray-600 dark:text-gray-300 text-xs font-semibold mb-1.5 ps-1" for="">{{ $t('profile.account.twitter') }}</label>
                                    <div class="relative items-center group">
                                        <span
                                            style="direction: ltr"
                                            :class="{ 'text-rose-500 dark:text-rose-500': errors && errors['info.twitter'] }"
                                            class="absolute top-1/2 text-gray-400 dark:text-gray-500 transform start-3.5 font-medium text-sm -translate-y-1/2 transition-colors"
                                            >https://twitter.com/</span
                                        >
                                        <input
                                            v-model="userData.info.twitter"
                                            :class="errors && errors['info.twitter'] ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/30' : 'border-gray-200 dark:border-gray-700 focus:border-amber-400 focus:ring-amber-400/30'"
                                            style="direction: ltr"
                                            class="h-11 ps-[8.5rem] w-full rounded-xl bg-gray-50 dark:bg-gray-800/60 border px-3.5 text-sm font-medium text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 outline-none focus:ring-2 focus:bg-white dark:focus:bg-gray-800"
                                            placeholder=""
                                            type="text"
                                            onfocus="this.parentNode.querySelector('span').classList.add('!text-amber-500')"
                                            onblur="this.parentNode.querySelector('span').classList.remove('!text-amber-500')"
                                        />
                                    </div>
                                    <span v-if="errors && errors['info.twitter']" class="mt-1.5 text-rose-500 text-xs font-semibold">
                                        {{ errors["info.twitter"][0] }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex justify-end mt-8">
                    <button
                        @click.prevent="updateProfile"
                        :disabled="updateLoading"
                        type="submit"
                        class="inline-flex items-center justify-center gap-2 min-w-[10rem] h-11 px-6 text-sm font-bold text-gray-900 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-xl shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md"
                    >
                        <svg v-if="updateLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{{ updateLoading ? $t('profile.common.loading') : $t('profile.common.saveChanges') }}</span>
                    </button>
                </div>
            </div>
            <!-- <div class="fixed bottom-5 end-10 z-50 w-full md:max-w-[15rem] lg:max-w-[17rem] bg-gray-300 dark:bg-gray-600 p-2 rounded-xl text-black">
				<div dir="ltr">
					<div class="flex justify-between items-center">
						<div class="flex items-center gap-x-3">
							<span class="w-7 h-7 flex justify-center items-center bg-amber-400 text-white p-1 rounded-lg">
								<svg class="w-full h-full flex-shrink-0" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="17 8 12 3 7 8"></polyline>
                                    <line x1="12" x2="12" y1="3" y2="15"></line>
                                  </svg>
							</span>
							<div>
								<p class="text-sm font-medium">preline-ui.xls</p>
								<p class="text-xs">7 KB</p>
							</div>
						</div>
						<div class="inline-flex items-center gap-x-2">
							<a class="text-gray-500 hover:text-gray-800" href="#">
								<svg class="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<rect width="4" height="16" x="6" y="4"></rect>
									<rect width="4" height="16" x="14" y="4"></rect>
								</svg>
							</a>
							<a class="text-gray-500 hover:text-rose-500" href="#">
								<svg class="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M3 6h18"></path>
									<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
									<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
									<line x1="10" x2="10" y1="11" y2="17"></line>
									<line x1="14" x2="14" y1="11" y2="17"></line>
								</svg>
							</a>
						</div>
					</div>

					<div class="flex items-center gap-x-3 whitespace-nowrap">
						<div class="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow="1" aria-valuemin="0" aria-valuemax="100">
							<div class="flex flex-col justify-center rounded-full overflow-hidden bg-amber-400 text-xs text-white text-center whitespace-nowrap transition duration-500" style="width: 1%"></div>
						</div>
						<div class="w-6 text-end">
							<span class="text-sm ">0%</span>
						</div>
					</div>
				</div>
			</div> -->

            <ProfileImageCropModal
                v-model="cropModalOpen"
                :image-src="cropImageSrc"
                :source-mime-type="cropSourceMime"
                :crop-type="cropType"
                :uploading="cropUploading"
                :upload-percentage="cropUploadPercentage"
                @confirm="onCropConfirm"
                @cancel="closeCropModal"
            />
        </div>
    </ProfileMasterPage>
</template>

<script>
import ProfileMasterPage from "@/views/page/panel/profile/ProfileMasterPage.vue";
import ProfileImageCropModal from "@/views/components/profile/ProfileImageCropModal.vue";
import SeoImage from "@/views/components/seo/SeoImage.vue";
import axiosInstance from "@/store/axiosInstance";
import { ref } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const DEFAULT_PROFILE_PIC = "https://static.zanburak.ir/images/avatar/default.png";
const DEFAULT_COVER_PIC = "https://static.zanburak.ir/images/cover/default.png";

export default {
    components: {
        ProfileMasterPage,
        ProfileImageCropModal,
        SeoImage,
    },
    data() {
        return {
            uploadInProgressCover: false,
            uploadPercentageCover: 0,
            uploadInProgressProfile: false,
            uploadPercentageProfile: 0,
            cropModalOpen: false,
            cropImageSrc: "",
            cropSourceMime: "",
            cropType: "profile",
            cropUploading: false,
            cropUploadPercentage: 0,
            imageVersion: {
                profile: 0,
                cover: 0,
            },
            loading: false,
            updateLoading: false,
            errors: ref(null),
            userData: {
                user: {
                    first_name: "",
                    last_name: "",
                    email: "",
                    username: "",
                    profile_pic: "",
                    cover_pic: "",
                },
                info: {
                    birth_date: {
                        year: "",
                        month: "",
                        day: "",
                    },
                    job: "",
                    about: "",
                    telegram: "",
                    website: "",
                    github: "",
                    linkedin: "",
                    twitter: "",
                    instagram: "",
                },
            },
        };
    },
    computed: {
        profilePicDisplayUrl() {
            return this.withImageCacheBust(this.userData.user.profile_pic, "profile");
        },
        coverPicDisplayUrl() {
            return this.withImageCacheBust(this.userData.user.cover_pic, "cover");
        },
        isDefaultCover() {
            const url = this.userData.user.cover_pic || "";
            return !url || url.includes("cover/default") || url === DEFAULT_COVER_PIC;
        },
        isDefaultProfile() {
            const url = this.userData.user.profile_pic || "";
            return !url || url.includes("avatar/default") || url === DEFAULT_PROFILE_PIC;
        },
        userInitials() {
            const f = this.userData.user.first_name?.trim()?.[0] || "";
            const l = this.userData.user.last_name?.trim()?.[0] || "";
            return (f + l).toUpperCase() || "?";
        },
    },
    methods: {
        withImageCacheBust(url, type) {
            if (!url) return "";
            const version = this.imageVersion[type];
            if (!version) return url;
            const separator = url.includes("?") ? "&" : "?";
            return `${url}${separator}v=${version}`;
        },
        bumpImageVersion(type) {
            this.imageVersion[type] = Date.now();
        },
        onProfilePicError(event) {
            const img = event.target;
            if (img.dataset.fallbackApplied === "1") return;
            img.dataset.fallbackApplied = "1";
            img.style.removeProperty("display");
            img.src = DEFAULT_PROFILE_PIC;
        },
        onCoverPicError(event) {
            const img = event.target;
            if (img.dataset.fallbackApplied === "1") return;
            img.dataset.fallbackApplied = "1";
            img.style.removeProperty("display");
            img.src = DEFAULT_COVER_PIC;
        },
        getUserData() {
            this.loading = true;
            axiosInstance
                .post("panel/profile/userData")
                .then((response) => {
                    this.userData.user = response.data.user;
                    this.userData.info = response.data.info;
                    if (response.data.info.birth_date) {
                        const birthDateParts = response.data.info.birth_date.split("/");
                        const birth_date = {
                            year: birthDateParts[0],
                            month: birthDateParts[1],
                            day: birthDateParts[2],
                        };
                        this.userData.info.birth_date = birth_date;
                    } else {
                        const birth_date = {
                            year: "",
                            month: "",
                            day: "",
                        };
                        this.userData.info.birth_date = birth_date;
                    }
                    this.loading = false;
                })

                .catch((error) => {
                    console.error(error.response.data.message);
                    this.loading = false;
                });
        },
        updateProfile() {
            this.updateLoading = true;
            this.errors = null;
            let birth_date = null;

            if (this.userData.info.birth_date.year || this.userData.info.birth_date.month || this.userData.info.birth_date.day) {
                birth_date = `${this.userData.info.birth_date.year || ""}/${this.userData.info.birth_date.month || ""}/${this.userData.info.birth_date.day || ""}`;
            }
            axiosInstance
                .post("panel/profile/update", {
                    user: this.userData.user,
                    info: {
                        ...this.userData.info,
                        birth_date: birth_date,
                    },
                })
                .then(() => {
                    toast.success(this.$t("profile.account.updateSuccess"), {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                    this.$store.dispatch("auth/getUser");
                })
                .catch((error) => {
                    if (error.response.status === 422) {
                        this.errors = error.response.data.errors;
                    }
                    console.error(this.errors);
                })
                .finally(() => {
                    this.updateLoading = false;
                });
        },
        handleOnlyNumbers(event, maxLength, nextInputRef) {
            const input = event.target;

            if ([46, 8, 9, 27, 13].includes(event.keyCode) || (event.keyCode >= 35 && event.keyCode <= 40) || (event.ctrlKey && event.keyCode === 65)) {
                return;
            }

            if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                event.preventDefault();
                return;
            }

            let newValue = input.value.replace(/\D/g, "");

            input.value = newValue;

            if (newValue.length >= maxLength) {
                if (nextInputRef) {
                    this.$refs[nextInputRef].focus();
                }
            }
        },

        openFileInputCover() {
            this.$refs.fileInputCover.click();
        },
        openFileInputProfile() {
            this.$refs.fileInputProfile.click();
        },
        getUploadErrorMessage(error, field) {
            const data = error?.response?.data;
            if (data?.errors?.[field]?.[0]) {
                return data.errors[field][0];
            }
            if (data?.message && data.message !== "Error" && data.message !== "Validation error") {
                return data.message;
            }
            return this.$t("profile.account.uploadError");
        },
        showUploadToast(type, message, isError = false) {
            const options = {
                theme: "colored",
                hideProgressBar: false,
                rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                bodyClassName: "font-YekanBakh",
                toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                transition: toast.TRANSITIONS.BOUNCE,
                position: toast.POSITION.BOTTOM_RIGHT,
            };

            if (isError) {
                toast.error(message, options);
                return;
            }

            toast.success(message, options);
        },
        resetFileInput(type) {
            const refName = type === "cover" ? "fileInputCover" : "fileInputProfile";
            if (this.$refs[refName]) {
                this.$refs[refName].value = null;
            }
        },
        onImageFileSelected(event, type) {
            const file = event.target.files?.[0];
            this.resetFileInput(type);

            if (!file) return;

            if (!file.type.startsWith("image/")) {
                this.showUploadToast(type, this.$t("profile.account.uploadError"), true);
                return;
            }

            if (file.size > MAX_IMAGE_SIZE_BYTES) {
                this.showUploadToast(type, this.$t("profile.account.uploadError"), true);
                return;
            }

            this.closeCropModal();
            this.cropType = type;
            this.cropSourceMime = file.type || "";
            this.cropImageSrc = URL.createObjectURL(file);
            this.cropUploading = false;
            this.cropUploadPercentage = 0;
            this.cropModalOpen = true;
        },
        closeCropModal() {
            if (this.cropImageSrc) {
                URL.revokeObjectURL(this.cropImageSrc);
            }
            this.cropImageSrc = "";
            this.cropSourceMime = "";
            this.cropUploading = false;
            this.cropUploadPercentage = 0;
            this.cropModalOpen = false;
        },
        async onCropConfirm(file) {
            if (this.cropType === "cover") {
                await this.uploadCoverImage(file);
            } else {
                await this.uploadProfileImage(file);
            }
        },
        async uploadCoverImage(file) {
            const formData = new FormData();
            formData.append("coverPic", file);
            this.uploadInProgressCover = true;
            this.cropUploading = true;
            this.cropUploadPercentage = 0;
            this.uploadPercentageCover = 0;

            try {
                const response = await axiosInstance.post("panel/profile/change-cover-pic", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        this.uploadPercentageCover = percentage;
                        this.cropUploadPercentage = percentage;
                    },
                });

                if (response?.data?.coverPic) {
                    this.userData.user.cover_pic = response.data.coverPic;
                    this.bumpImageVersion("cover");
                }
                await this.$store.dispatch("auth/getUser");
                this.getUserData();
                this.showUploadToast("cover", this.$t("profile.account.coverUpdateSuccess"));
                this.closeCropModal();
            } catch (error) {
                console.error(error?.response?.data || error);
                this.showUploadToast("cover", this.getUploadErrorMessage(error, "coverPic"), true);
                this.cropUploading = false;
                this.cropUploadPercentage = 0;
            } finally {
                this.uploadInProgressCover = false;
                this.resetFileInput("cover");
            }
        },
        async uploadProfileImage(file) {
            const formData = new FormData();
            formData.append("profilePic", file);
            this.uploadInProgressProfile = true;
            this.cropUploading = true;
            this.cropUploadPercentage = 0;
            this.uploadPercentageProfile = 0;

            try {
                const response = await axiosInstance.post("panel/profile/change-profile-pic", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        this.uploadPercentageProfile = percentage;
                        this.cropUploadPercentage = percentage;
                    },
                });

                if (response?.data?.profilePic) {
                    this.userData.user.profile_pic = response.data.profilePic;
                    this.bumpImageVersion("profile");
                }
                await this.$store.dispatch("auth/getUser");
                this.getUserData();
                this.showUploadToast("profile", this.$t("profile.account.profilePicUpdateSuccess"));
                this.closeCropModal();
            } catch (error) {
                console.error(error?.response?.data || error);
                this.showUploadToast("profile", this.getUploadErrorMessage(error, "profilePic"), true);
                this.cropUploading = false;
                this.cropUploadPercentage = 0;
            } finally {
                this.uploadInProgressProfile = false;
                this.resetFileInput("profile");
            }
        },
    },
    mounted() {
        document.title = this.$t("profile.account.title");
        this.getUserData();
    },
    beforeUnmount() {
        this.closeCropModal();
    },
};
</script>
<style>
input[type="number"] {
    -moz-appearance: textfield;
}

.cover-empty-bg {
    background:
        radial-gradient(circle at 20% 80%, rgba(251, 191, 36, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.12) 0%, transparent 50%),
        linear-gradient(135deg, #fef9c3 0%, #fef3c7 40%, #fde68a 100%);
}
.dark .cover-empty-bg {
    background:
        radial-gradient(circle at 20% 80%, rgba(251, 191, 36, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.06) 0%, transparent 50%),
        linear-gradient(135deg, #1f2937 0%, #111827 50%, #1c1917 100%);
}

.profile-empty-bg {
    background:
        radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, transparent 60%),
        linear-gradient(145deg, #e5e7eb 0%, #d1d5db 50%, #9ca3af 100%);
}
.dark .profile-empty-bg {
    background:
        radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 60%),
        linear-gradient(145deg, #374151 0%, #1f2937 50%, #111827 100%);
}
</style>
