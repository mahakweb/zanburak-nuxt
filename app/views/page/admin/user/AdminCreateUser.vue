<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <router-link :to="{ name: 'admin-users-list' }" :class="BTN_SECONDARY">
                <span class="flex items-center gap-1.5">
                    لیست کاربران
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </span>
            </router-link>
        </template>

        <div class="min-w-0">
            <LoadingComponent v-if="loading" />

            <form v-else id="create-user-form" @submit.prevent="submitForm">
                <!-- 2-column: stepper | content -->
                <div class="grid grid-cols-1 gap-4 items-start user-form-layout">

                    <!-- Vertical stepper -->
                    <aside class="lg:sticky lg:top-4 space-y-2">
                        <nav class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-2 shadow-sm">
                            <ol class="space-y-0.5">
                                <li v-for="(step, index) in STEPS" :key="step.id">
                                    <button
                                        type="button"
                                        @click="goToStep(index)"
                                        class="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-start transition-all"
                                        :class="mainStepButtonClass(index)"
                                    >
                                        <span class="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold" :class="mainStepIndexClass(index)">
                                            <svg v-if="index < currentStep" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <svg v-else-if="step.id === 'confirm'" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span v-else>{{ index + 1 }}</span>
                                        </span>
                                        <span class="min-w-0">
                                            <span class="block text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{{ step.label }}</span>
                                            <span class="block text-[10px] text-gray-400 truncate">{{ step.hint }}</span>
                                        </span>
                                    </button>
                                </li>
                            </ol>

                            <!-- Step nav -->
                            <div class="flex items-center justify-between gap-2 pt-2 mt-2 border-t border-gray-100 dark:border-gray-800 px-1">
                                <button
                                    type="button"
                                    @click="prevStep"
                                    :disabled="currentStep === 0"
                                    title="مرحله قبل"
                                    class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                <span class="text-[10px] font-medium text-gray-400 text-center leading-tight px-1">{{ footerStepLabel }}</span>
                                <button
                                    type="button"
                                    @click="nextStep"
                                    :disabled="currentStep >= STEPS.length - 1"
                                    title="مرحله بعد"
                                    class="flex h-8 w-8 items-center justify-center rounded-lg text-gray-900 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            </div>

                            <!-- Submit on confirm step -->
                            <button
                                v-if="currentStepId === 'confirm'"
                                type="submit"
                                :disabled="submitLoading"
                                class="w-full mt-2 flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-bold text-gray-900 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 transition-colors"
                            >
                                <svg v-if="!submitLoading" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                {{ submitLoading ? 'در حال ثبت...' : 'تایید و ایجاد کاربر' }}
                            </button>
                        </nav>
                    </aside>

                    <!-- Main content -->
                    <div class="min-w-0 min-h-[420px]">

                        <!-- Step 1: Images -->
                        <section v-show="currentStepId === 'images'" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5 shadow-sm">
                            <div class="mb-5">
                                <h3 class="text-sm font-bold text-gray-900 dark:text-white">تصاویر پروفایل</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">تصویر کاور و آواتار را انتخاب و برش دهید</p>
                            </div>

                            <div class="relative mb-16">
                                <!-- Cover -->
                                <div
                                    class="relative rounded-2xl overflow-hidden group transition-all"
                                    :class="coverPicPreview
                                        ? 'ring-1 ring-gray-200/80 dark:ring-gray-700/80 shadow-sm'
                                        : 'border-2 border-dashed border-gray-300/80 dark:border-gray-600/80 hover:border-amber-400/60 dark:hover:border-amber-500/40'"
                                >
                                    <!-- Empty cover -->
                                    <div
                                        v-if="!coverPicPreview"
                                        class="cover-empty-bg h-44 md:h-52 lg:h-56 w-full flex flex-col items-center justify-center gap-3 cursor-pointer"
                                        @click="openFileInput('cover')"
                                    >
                                        <div class="w-14 h-14 rounded-2xl bg-white/70 dark:bg-gray-900/50 backdrop-blur-sm flex items-center justify-center shadow-sm ring-1 ring-white/50 dark:ring-gray-700/50">
                                            <svg class="w-7 h-7 text-amber-500/80 dark:text-amber-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div class="text-center px-4">
                                            <p class="text-sm font-semibold text-gray-600 dark:text-gray-300">انتخاب تصویر کاور</p>
                                            <p class="text-[10px] text-gray-400 dark:text-gray-500 mt-1">برای آپلود کلیک کنید — اختیاری</p>
                                        </div>
                                    </div>

                                    <!-- Selected cover -->
                                    <template v-else>
                                        <div class="h-44 md:h-52 lg:h-56 w-full">
                                            <img
                                                :src="coverPicPreview"
                                                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                                alt="کاور"
                                            />
                                        </div>
                                        <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                                        <div class="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/15 transition-colors pointer-events-none" />

                                        <button
                                            type="button"
                                            @click.stop="removeCoverPic"
                                            title="حذف کاور"
                                            class="absolute top-3 end-3 z-30 w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg hover:bg-rose-600 hover:scale-105 transition-all"
                                        >
                                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>

                                        <button
                                            type="button"
                                            @click.stop="openFileInput('cover')"
                                            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-sm font-semibold text-gray-800 dark:text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                            تغییر کاور
                                        </button>
                                    </template>

                                    <input
                                        ref="fileInputCover"
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                                        class="hidden"
                                        @change="onImageFileSelected($event, 'cover')"
                                    />

                                    <div v-if="coverPicUploadProgress > 0" class="absolute bottom-3 left-3 right-3 z-20">
                                        <div class="h-1.5 bg-white/30 rounded-full overflow-hidden">
                                            <div class="h-full bg-yellow-400 rounded-full transition-all" :style="{ width: coverPicUploadProgress + '%' }" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Profile avatar -->
                                <div
                                    class="absolute z-20 w-24 md:w-28 h-24 md:h-28 rounded-full start-6 -bottom-12 border-4 overflow-hidden shadow-xl group/avatar transition-all"
                                    :class="profilePicPreview
                                        ? 'border-white dark:border-gray-900'
                                        : 'border-white dark:border-gray-900 border-dashed'"
                                >
                                    <!-- Empty profile -->
                                    <div
                                        v-if="!profilePicPreview"
                                        class="profile-empty-bg w-full h-full flex flex-col items-center justify-center cursor-pointer"
                                        @click="openFileInput('profile')"
                                    >
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

                                    <!-- Selected profile -->
                                    <template v-else>
                                        <img :src="profilePicPreview" class="w-full h-full object-cover" alt="پروفایل" />
                                        <div class="absolute inset-0 bg-gray-900/0 group-hover/avatar:bg-gray-900/25 transition-colors pointer-events-none" />

                                        <button
                                            type="button"
                                            @click.stop="removeProfilePic"
                                            title="حذف آواتار"
                                            class="absolute top-1 end-1 z-30 w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md hover:bg-rose-600 hover:scale-105 transition-all"
                                        >
                                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>

                                        <button
                                            type="button"
                                            @click.stop="openFileInput('profile')"
                                            class="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity"
                                        >
                                            <span class="w-9 h-9 rounded-full bg-white/90 dark:bg-gray-900/90 flex items-center justify-center shadow-md">
                                                <svg class="w-4 h-4 text-gray-700 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </span>
                                        </button>
                                    </template>

                                    <input
                                        ref="fileInputProfile"
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                                        class="hidden"
                                        @change="onImageFileSelected($event, 'profile')"
                                    />

                                    <div v-if="profilePicUploadProgress > 0" class="absolute inset-0 z-30 flex items-center justify-center bg-black/40">
                                        <span class="text-white text-xs font-bold">{{ profilePicUploadProgress }}%</span>
                                    </div>
                                </div>
                            </div>

                            <p class="text-[11px] text-gray-400 mt-2 leading-relaxed">
                                JPG، PNG، WEBP یا GIF — حداکثر ۵ مگابایت. پس از انتخاب، می‌توانید تصویر را برش دهید و فیلتر اعمال کنید. در صورت عدم انتخاب، تصویر پیش‌فرض استفاده می‌شود.
                            </p>
                        </section>

                        <!-- Step 2: Basic info -->
                        <section v-show="currentStepId === 'basic'" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5 space-y-5 shadow-sm">
                            <div>
                                <h3 class="text-sm font-bold text-gray-900 dark:text-white">اطلاعات پایه</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">نام، ایمیل، رمز عبور و وضعیت حساب</p>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label for="first_name" class="field-label">نام</label>
                                    <input type="text" id="first_name" v-model="form.first_name" class="form-input"
                                        :class="{ 'ring-2 ring-rose-500': errors && errors.first_name }" />
                                    <span v-if="errors && errors.first_name" class="mt-1 text-rose-500 text-xs font-medium block">{{ errors.first_name[0] }}</span>
                                </div>
                                <div>
                                    <label for="last_name" class="field-label">نام خانوادگی</label>
                                    <input type="text" id="last_name" v-model="form.last_name" class="form-input"
                                        :class="{ 'ring-2 ring-rose-500': errors && errors.last_name }" />
                                    <span v-if="errors && errors.last_name" class="mt-1 text-rose-500 text-xs font-medium block">{{ errors.last_name[0] }}</span>
                                </div>
                                <div>
                                    <label for="username" class="field-label">نام کاربری</label>
                                    <input type="text" id="username" v-model="form.username" @input="filterInputUsername" class="form-input" style="direction: ltr"
                                        :class="{ 'ring-2 ring-rose-500': errors && errors.username }" />
                                    <span v-if="errors && errors.username" class="mt-1 text-rose-500 text-xs font-medium block">{{ errors.username[0] }}</span>
                                    <p class="text-[10px] text-gray-400 mt-1">فقط حروف انگلیسی، اعداد و آندرلاین</p>
                                </div>
                                <div>
                                    <label for="email" class="field-label">ایمیل</label>
                                    <input type="email" id="email" v-model="form.email" class="form-input" style="direction: ltr"
                                        :class="{ 'ring-2 ring-rose-500': errors && errors.email }" />
                                    <span v-if="errors && errors.email" class="mt-1 text-rose-500 text-xs font-medium block">{{ errors.email[0] }}</span>
                                </div>
                                <div>
                                    <label for="phone" class="field-label">شماره موبایل</label>
                                    <input type="tel" id="phone" @input="handleMobileInputChange" v-model="form.phone" class="form-input" style="direction: ltr"
                                        :class="{ 'ring-2 ring-rose-500': errors && errors.phone }" />
                                    <span v-if="errors && errors.phone" class="mt-1 text-rose-500 text-xs font-medium block">{{ errors.phone[0] }}</span>
                                </div>
                                <div>
                                    <label for="password" class="field-label">رمز عبور</label>
                                    <div class="relative">
                                        <button type="button" @click="passwordVisible = !passwordVisible"
                                            class="absolute end-3 top-1/2 -translate-y-1/2 focus:outline-none z-10">
                                            <span v-show="!passwordVisible">
                                                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none">
                                                    <path opacity="0.5" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25ZM9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z"/>
                                                    <path opacity="0.5" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12 3.25C7.48587 3.25 4.44529 5.9542 2.68057 8.24686L2.64874 8.2882C2.24964 8.80653 1.88206 9.28392 1.63269 9.8484C1.36564 10.4529 1.25 11.1117 1.25 12C1.25 12.8883 1.36564 13.5471 1.63269 14.1516C1.88206 14.7161 2.24964 15.1935 2.64875 15.7118L2.68057 15.7531C4.44529 18.0458 7.48587 20.75 12 20.75C16.5141 20.75 19.5547 18.0458 21.3194 15.7531L21.3512 15.7118C21.7504 15.1935 22.1179 14.7161 22.3673 14.1516C22.6344 13.5471 22.75 12.8883 22.75 12C22.75 11.1117 22.6344 10.4529 22.3673 9.8484C22.1179 9.28391 21.7504 8.80652 21.3512 8.28818L21.3194 8.24686C19.5547 5.9542 16.5141 3.25 12 3.25ZM3.86922 9.1618C5.49864 7.04492 8.15036 4.75 12 4.75C15.8496 4.75 18.5014 7.04492 20.1308 9.1618C20.5694 9.73159 20.8263 10.0721 20.9952 10.4545C21.1532 10.812 21.25 11.2489 21.25 12C21.25 12.7511 21.1532 13.188 20.9952 13.5455C20.8263 13.9279 20.5694 14.2684 20.1308 14.8382C18.5014 16.9551 15.8496 19.25 12 19.25C8.15036 19.25 5.49864 16.9551 3.86922 14.8382C3.43064 14.2684 3.17374 13.9279 3.00476 13.5455C2.84684 13.188 2.75 12.7511 2.75 12C2.75 11.2489 2.84684 10.812 3.00476 10.4545C3.17374 10.0721 3.43063 9.73159 3.86922 9.1618Z"/>
                                                </svg>
                                            </span>
                                            <span v-show="passwordVisible">
                                                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" viewBox="0 0 20 17" fill="none">
                                                    <path d="M7.94557 10.1681C7.41849 9.64191 7.09766 8.92691 7.09766 8.12482C7.09766 6.51791 8.39199 5.22266 9.99799 5.22266C10.7927 5.22266 11.5242 5.54441 12.0422 6.07057" stroke="currentColor" stroke-opacity="0.58" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M12.8451 8.64062C12.6324 9.82312 11.7011 10.7563 10.5195 10.9708" stroke="currentColor" stroke-opacity="0.58" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M5.09911 13.0145C3.64436 11.8724 2.41236 10.204 1.51953 8.1241C2.42153 6.03502 3.66178 4.35752 5.1257 3.20619C6.58045 2.05485 8.25887 1.42969 9.9987 1.42969C11.7486 1.42969 13.4261 2.06402 14.89 3.2236" stroke="currentColor" stroke-opacity="0.58" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M16.8241 5.24023C17.4548 6.07807 18.0094 7.04515 18.4759 8.12407C16.6729 12.3013 13.4865 14.8176 9.99678 14.8176C9.2057 14.8176 8.42561 14.6892 7.67578 14.439" stroke="currentColor" stroke-opacity="0.58" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M17.229 0.894531L2.76953 15.354" stroke="currentColor" stroke-opacity="0.58" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                            </span>
                                        </button>
                                        <input :type="passwordVisible ? 'text' : 'password'" id="password" v-model="form.password" class="form-input pe-10"
                                            :class="{ 'ring-2 ring-rose-500': errors && errors.password }" />
                                    </div>
                                    <span v-if="errors && errors.password" class="mt-1 text-rose-500 text-xs font-medium block">{{ errors.password[0] }}</span>
                                </div>
                                <div>
                                    <label for="password_confirmation" class="field-label">تکرار رمز عبور</label>
                                    <div class="relative">
                                        <button type="button" @click="passwordVisible = !passwordVisible"
                                            class="absolute end-3 top-1/2 -translate-y-1/2 focus:outline-none z-10">
                                            <span v-show="!passwordVisible">
                                                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none">
                                                    <path opacity="0.5" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25ZM9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z"/>
                                                    <path opacity="0.5" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M12 3.25C7.48587 3.25 4.44529 5.9542 2.68057 8.24686L2.64874 8.2882C2.24964 8.80653 1.88206 9.28392 1.63269 9.8484C1.36564 10.4529 1.25 11.1117 1.25 12C1.25 12.8883 1.36564 13.5471 1.63269 14.1516C1.88206 14.7161 2.24964 15.1935 2.64875 15.7118L2.68057 15.7531C4.44529 18.0458 7.48587 20.75 12 20.75C16.5141 20.75 19.5547 18.0458 21.3194 15.7531L21.3512 15.7118C21.7504 15.1935 22.1179 14.7161 22.3673 14.1516C22.6344 13.5471 22.75 12.8883 22.75 12C22.75 11.1117 22.6344 10.4529 22.3673 9.8484C22.1179 9.28391 21.7504 8.80652 21.3512 8.28818L21.3194 8.24686C19.5547 5.9542 16.5141 3.25 12 3.25ZM3.86922 9.1618C5.49864 7.04492 8.15036 4.75 12 4.75C15.8496 4.75 18.5014 7.04492 20.1308 9.1618C20.5694 9.73159 20.8263 10.0721 20.9952 10.4545C21.1532 10.812 21.25 11.2489 21.25 12C21.25 12.7511 21.1532 13.188 20.9952 13.5455C20.8263 13.9279 20.5694 14.2684 20.1308 14.8382C18.5014 16.9551 15.8496 19.25 12 19.25C8.15036 19.25 5.49864 16.9551 3.86922 14.8382C3.43064 14.2684 3.17374 13.9279 3.00476 13.5455C2.84684 13.188 2.75 12.7511 2.75 12C2.75 11.2489 2.84684 10.812 3.00476 10.4545C3.17374 10.0721 3.43063 9.73159 3.86922 9.1618Z"/>
                                                </svg>
                                            </span>
                                            <span v-show="passwordVisible">
                                                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" viewBox="0 0 20 17" fill="none">
                                                    <path d="M7.94557 10.1681C7.41849 9.64191 7.09766 8.92691 7.09766 8.12482C7.09766 6.51791 8.39199 5.22266 9.99799 5.22266C10.7927 5.22266 11.5242 5.54441 12.0422 6.07057" stroke="currentColor" stroke-opacity="0.58" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M12.8451 8.64062C12.6324 9.82312 11.7011 10.7563 10.5195 10.9708" stroke="currentColor" stroke-opacity="0.58" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M5.09911 13.0145C3.64436 11.8724 2.41236 10.204 1.51953 8.1241C2.42153 6.03502 3.66178 4.35752 5.1257 3.20619C6.58045 2.05485 8.25887 1.42969 9.9987 1.42969C11.7486 1.42969 13.4261 2.06402 14.89 3.2236" stroke="currentColor" stroke-opacity="0.58" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M16.8241 5.24023C17.4548 6.07807 18.0094 7.04515 18.4759 8.12407C16.6729 12.3013 13.4865 14.8176 9.99678 14.8176C9.2057 14.8176 8.42561 14.6892 7.67578 14.439" stroke="currentColor" stroke-opacity="0.58" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M17.229 0.894531L2.76953 15.354" stroke="currentColor" stroke-opacity="0.58" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                            </span>
                                        </button>
                                        <input :type="passwordVisible ? 'text' : 'password'" id="password_confirmation" v-model="form.password_confirmation" class="form-input pe-10"
                                            :class="{ 'ring-2 ring-rose-500': errors && errors.password_confirmation }" />
                                    </div>
                                    <span v-if="errors && errors.password_confirmation" class="mt-1 text-rose-500 text-xs font-medium block">{{ errors.password_confirmation[0] }}</span>
                                </div>
                                <div>
                                    <label class="field-label">وضعیت</label>
                                    <ul class="h-10 grid w-full grid-cols-2 gap-2 p-1 rounded-xl bg-gray-100 dark:bg-gray-800">
                                        <li>
                                            <input v-model="form.status" type="radio" id="status-active" name="status" value="active" class="hidden peer" />
                                            <label for="status-active" class="h-full inline-flex items-center justify-center w-full p-1.5 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400 text-xs font-semibold transition-colors">
                                                فعال
                                            </label>
                                        </li>
                                        <li>
                                            <input v-model="form.status" type="radio" id="status-inactive" name="status" value="inactive" class="hidden peer" />
                                            <label for="status-inactive" class="h-full inline-flex items-center justify-center w-full p-1.5 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400 text-xs font-semibold transition-colors">
                                                غیرفعال
                                            </label>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <!-- Step 3: Roles & Permissions -->
                        <section v-show="currentStepId === 'access'" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5 shadow-sm">
                            <div class="mb-5">
                                <h3 class="text-sm font-bold text-gray-900 dark:text-white">نقش‌ها و دسترسی‌ها</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">نقش‌ها و دسترسی‌های مورد نظر را جستجو و انتخاب کنید</p>
                            </div>

                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                <!-- Roles -->
                                <div class="flex flex-col">
                                    <div class="flex items-center gap-2 mb-3 shrink-0">
                                        <div class="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400">
                                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                                                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </div>
                                        <div class="min-w-0">
                                            <p class="text-xs font-bold text-gray-900 dark:text-white">نقش‌ها</p>
                                            <p class="text-[10px] text-gray-400">سطح کلی دسترسی کاربر</p>
                                        </div>
                                        <span v-if="form.selectedRoles.length" class="ms-auto text-[10px] font-bold px-2 py-0.5 rounded-md bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                                            {{ form.selectedRoles.length }}
                                        </span>
                                    </div>
                                    <div v-if="loadingRoles" class="flex-1 flex items-center justify-center rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-sm text-gray-400">
                                        در حال بارگذاری نقش‌ها...
                                    </div>
                                    <AdvancedMultiSelect
                                        v-else
                                        v-model="selectedRoleItems"
                                        layout="panel"
                                        panel-accent="violet"
                                        search-placeholder="جستجوی نقش..."
                                        empty-selection-text="هنوز نقشی انتخاب نشده — از لیست بالا انتخاب کنید"
                                        :options="roleOptions"
                                        option-label="__display"
                                        option-value="id"
                                        :close-on-select="false"
                                        :enable-search="true"
                                        :enable-select-all="true"
                                        :enable-clear-all="true"
                                        class="w-full"
                                    />
                                </div>

                                <!-- Permissions -->
                                <div class="flex flex-col">
                                    <div class="flex items-center gap-2 mb-3 shrink-0">
                                        <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                                                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </div>
                                        <div class="min-w-0">
                                            <p class="text-xs font-bold text-gray-900 dark:text-white">دسترسی‌ها</p>
                                            <p class="text-[10px] text-gray-400">دسترسی‌های جزئی و اختصاصی</p>
                                        </div>
                                        <span v-if="form.selectedPermissions.length" class="ms-auto text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                                            {{ form.selectedPermissions.length }}
                                        </span>
                                    </div>
                                    <div v-if="loadingPermissions" class="flex-1 flex items-center justify-center rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-sm text-gray-400">
                                        در حال بارگذاری دسترسی‌ها...
                                    </div>
                                    <AdvancedMultiSelect
                                        v-else
                                        v-model="selectedPermissionItems"
                                        layout="panel"
                                        panel-accent="emerald"
                                        search-placeholder="جستجوی دسترسی..."
                                        empty-selection-text="هنوز دسترسی انتخاب نشده — از لیست بالا انتخاب کنید"
                                        :options="permissionOptions"
                                        option-label="__display"
                                        option-value="id"
                                        :close-on-select="false"
                                        :enable-search="true"
                                        :enable-select-all="true"
                                        :enable-clear-all="true"
                                        class="w-full"
                                    />
                                </div>
                            </div>
                        </section>

                        <!-- Step 4: Extra info -->
                        <section v-show="currentStepId === 'extra'" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5 space-y-5 shadow-sm">
                            <div>
                                <h3 class="text-sm font-bold text-gray-900 dark:text-white">اطلاعات تکمیلی</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">شغل، تاریخ تولد و بیوگرافی (اختیاری)</p>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label for="job" class="field-label">شغل</label>
                                    <input type="text" id="job" v-model="form.job" class="form-input" />
                                </div>
                                <div>
                                    <label for="birthdate" class="field-label">تاریخ تولد</label>
                                    <DatePicker id="birthdate" v-model="form.birthdate" locale="fa,en" :clearable="true"
                                        format="YYYY-MM-DD" display-format="jYYYY-jMM-jDD" color="gray"
                                        input-class="form-input h-10 border-none"
                                        wrapper-class="w-full" />
                                </div>
                                <div class="md:col-span-2">
                                    <label for="bio" class="field-label">بیوگرافی</label>
                                    <textarea id="bio" v-model="form.bio" rows="4" class="form-input resize-none" />
                                </div>
                            </div>
                        </section>

                        <!-- Step 5: Social -->
                        <section v-show="currentStepId === 'social'" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5 space-y-5 shadow-sm">
                            <div>
                                <h3 class="text-sm font-bold text-gray-900 dark:text-white">شبکه‌های اجتماعی</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">فقط نام کاربری یا ID را وارد کنید — مانند: zanburak</p>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div v-for="field in socialFields" :key="field.key">
                                    <label :for="field.key" class="field-label">{{ field.label }}</label>
                                    <div class="relative">
                                        <span v-if="field.prefix" class="absolute top-1/2 -translate-y-1/2 start-3 text-gray-400 text-xs pointer-events-none" style="direction: ltr">{{ field.prefix }}</span>
                                        <input
                                            :id="field.key"
                                            v-model="form[field.key]"
                                            type="text"
                                            class="form-input"
                                            :class="field.prefix ? 'ps-[4.5rem]' : ''"
                                            :placeholder="field.placeholder"
                                            :style="field.ltr ? 'direction: ltr' : ''"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Step 6: Confirm -->
                        <section v-show="currentStepId === 'confirm'" class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5 shadow-sm space-y-5">
                            <div>
                                <h3 class="text-sm font-bold text-gray-900 dark:text-white">بررسی و تایید نهایی</h3>
                                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">اطلاعات وارد شده را بررسی کنید</p>
                            </div>

                            <!-- Preview card -->
                            <div class="relative rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 pb-10">
                                <div class="h-32 md:h-36 relative">
                                    <img v-if="coverPicPreview" :src="coverPicPreview" class="w-full h-full object-cover" alt="" />
                                    <div v-else class="cover-empty-bg w-full h-full" />
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                                </div>
                                <div class="absolute bottom-12 start-20 md:start-24 end-3">
                                    <p class="text-white font-bold text-sm truncate drop-shadow">{{ form.first_name || '—' }} {{ form.last_name }}</p>
                                    <p class="text-white/80 text-xs truncate drop-shadow">@{{ form.username || '—' }}</p>
                                </div>
                                <div class="absolute bottom-0 start-4 w-16 h-16 rounded-full border-4 border-white dark:border-gray-900 overflow-hidden shadow-lg">
                                    <img v-if="profilePicPreview" :src="profilePicPreview" class="w-full h-full object-cover" alt="" />
                                    <div v-else class="profile-empty-bg w-full h-full flex items-center justify-center">
                                        <span class="text-lg font-bold text-gray-500/80">{{ userInitials }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="pt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div v-for="item in confirmSummary" :key="item.label" class="rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 px-4 py-3">
                                    <p class="text-[10px] font-medium text-gray-400 mb-0.5">{{ item.label }}</p>
                                    <p class="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate" :style="item.ltr ? 'direction: ltr' : ''">{{ item.value || '—' }}</p>
                                </div>
                            </div>

                            <div v-if="selectedRolesList.length || selectedPermissionsList.length" class="space-y-4">
                                <div v-if="selectedRolesList.length">
                                    <p class="text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-2">نقش‌ها</p>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <div v-for="role in selectedRolesList" :key="'cr-' + role.id"
                                            class="flex items-center gap-2.5 rounded-xl border border-violet-200/60 bg-gradient-to-r from-violet-50/50 to-white p-3 dark:border-violet-800/30 dark:from-violet-900/10 dark:to-gray-900/50">
                                            <div class="shrink-0 w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                                                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 52 52"><path d="m27.3 37.6c-3-1.2-3.5-2.3-3.5-3.5 0-1.2 0.8-2.3 1.8-3.2 1.8-1.5 2.6-3.9 2.6-6.4 0-4.7-2.9-8.5-8.3-8.5s-8.3 3.8-8.3 8.5c0 2.5 0.8 4.9 2.6 6.4 1 0.9 1.8 2 1.8 3.2 0 1.2-0.5 2.3-3.5 3.5-4.4 1.8-8.6 3.8-8.7 7.6 0.2 2.6 2.2 4.8 4.7 4.8h23c2.5 0 4.5-2.2 4.5-4.7-0.1-3.8-4.3-5.9-8.7-7.7z"/></svg>
                                            </div>
                                            <div class="min-w-0">
                                                <p class="text-xs font-bold text-gray-800 dark:text-gray-100 truncate">{{ role.label }}</p>
                                                <p class="text-[10px] text-gray-400 truncate" dir="ltr">{{ role.name }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="selectedPermissionsList.length">
                                    <p class="text-[11px] font-bold text-gray-500 dark:text-gray-400 mb-2">دسترسی‌ها</p>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <div v-for="permission in selectedPermissionsList" :key="'cp-' + permission.id"
                                            class="flex items-center gap-2.5 rounded-xl border border-emerald-200/60 bg-gradient-to-r from-emerald-50/50 to-white p-3 dark:border-emerald-800/30 dark:from-emerald-900/10 dark:to-gray-900/50">
                                            <div class="shrink-0 w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 52 52"><path d="m45.2 29.2h-8.8c-2.6 0-4.8-2.2-4.8-4.8 0.4-7.1 3.7-7.5 4-12.1 0.3-4.8-2.7-9.1-7.4-10.1-6.2-1.3-11.8 3.4-11.8 9.4 0 5.3 3.6 5.3 4 12.8 0 2.6-2.2 4.8-4.8 4.8h-8.8c-2.6 0-4.8 2.1-4.8 4.8v3.2c0 0.9 0.7 1.6 1.6 1.6h44.8c0.9 0 1.6-0.7 1.6-1.6v-3.2c0-2.7-2.2-4.8-4.8-4.8z"/></svg>
                                            </div>
                                            <div class="min-w-0">
                                                <p class="text-xs font-bold text-gray-800 dark:text-gray-100 truncate">{{ permission.label }}</p>
                                                <p class="text-[10px] text-gray-400 truncate" dir="ltr">{{ permission.name }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </form>

            <ProfileImageCropModal
                v-model="cropModalOpen"
                :image-src="cropImageSrc"
                :source-mime-type="cropSourceMime"
                :crop-type="cropType"
                :uploading="false"
                :upload-percentage="0"
                @confirm="onCropConfirm"
                @cancel="closeCropModal"
            />
        </div>
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import ProfileImageCropModal from "@/views/components/profile/ProfileImageCropModal.vue";
import AdvancedMultiSelect from "@/views/components/multiselect/AdvancedMultiSelect.vue";
import axiosInstance from "@/store/axiosInstance";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import DatePicker from "vue3-persian-datetime-picker";

const BTN_SECONDARY = "flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 dark:bg-gray-900 dark:text-gray-100 dark:shadow-none dark:border dark:border-gray-700 dark:hover:bg-gray-800";

const STEPS = [
    { id: "images", label: "تصاویر پروفایل", hint: "آواتار و کاور" },
    { id: "basic", label: "اطلاعات پایه", hint: "نام و حساب کاربری" },
    { id: "access", label: "نقش و دسترسی", hint: "سطوح دسترسی" },
    { id: "extra", label: "اطلاعات تکمیلی", hint: "بیو و شغل" },
    { id: "social", label: "شبکه‌های اجتماعی", hint: "لینک‌ها" },
    { id: "confirm", label: "تایید و ثبت", hint: "بررسی نهایی" },
];

const DEFAULT_PROFILE_PIC = "https://static.zanburak.ir/images/avatar/default.png";
const DEFAULT_COVER_PIC = "https://static.zanburak.ir/images/cover/default.png";
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export default {
    components: {
        AdminMasterPage,
        LoadingComponent,
        ProfileImageCropModal,
        AdvancedMultiSelect,
        DatePicker,
    },
    data() {
        return {
            BTN_SECONDARY,
            STEPS,
            currentStep: 0,
            loading: false,
            submitLoading: false,
            errors: null,
            profilePicPreview: null,
            coverPicPreview: null,
            profilePicUploadProgress: 0,
            coverPicUploadProgress: 0,
            profilePicObjectUrl: null,
            coverPicObjectUrl: null,
            profilePicFile: null,
            coverPicFile: null,
            cropModalOpen: false,
            cropImageSrc: "",
            cropSourceMime: "",
            cropType: "profile",
            passwordVisible: false,
            allRoles: [],
            loadingRoles: false,
            allPermissions: [],
            loadingPermissions: false,
            socialFields: [
                { key: "telegram", label: "تلگرام", placeholder: "zanburak" },
                { key: "instagram", label: "اینستاگرام", placeholder: "zanburak" },
                { key: "twitter", label: "ایکس (توییتر)", placeholder: "zanburak" },
                { key: "linkedin", label: "لینکدین", placeholder: "zanburak" },
                { key: "github", label: "گیت‌هاب", placeholder: "zanburak" },
                { key: "website", label: "وبسایت", placeholder: "https://example.com", prefix: "https://", ltr: true },
            ],
            form: {
                first_name: "",
                last_name: "",
                username: "",
                email: "",
                phone: "",
                password: "",
                password_confirmation: "",
                status: "active",
                profile_pic: "",
                cover_pic: "",
                job: "",
                birthdate: "",
                bio: "",
                telegram: "",
                instagram: "",
                twitter: "",
                linkedin: "",
                github: "",
                website: "",
                selectedRoles: [],
                selectedPermissions: [],
            },
        };
    },
    computed: {
        currentStepId() {
            return this.STEPS[this.currentStep]?.id || "images";
        },
        footerStepLabel() {
            const step = this.STEPS[this.currentStep];
            return `${step?.label} (${this.currentStep + 1}/${this.STEPS.length})`;
        },
        userInitials() {
            const f = this.form.first_name?.trim()?.[0] || "";
            const l = this.form.last_name?.trim()?.[0] || "";
            return (f + l).toUpperCase() || "?";
        },
        selectedRolesList() {
            return this.allRoles.filter((r) => this.form.selectedRoles.includes(r.id));
        },
        selectedPermissionsList() {
            return this.allPermissions.filter((p) => this.form.selectedPermissions.includes(p.id));
        },
        roleOptions() {
            return this.allRoles.map((r) => ({
                ...r,
                __display: `${r.name} — ${r.label}`,
            }));
        },
        permissionOptions() {
            return this.allPermissions.map((p) => ({
                ...p,
                __display: `${p.name} — ${p.label}`,
            }));
        },
        selectedRoleItems: {
            get() {
                return this.roleOptions.filter((r) => this.form.selectedRoles.includes(r.id));
            },
            set(items) {
                this.form.selectedRoles = items.map((r) => r.id);
            },
        },
        selectedPermissionItems: {
            get() {
                return this.permissionOptions.filter((p) => this.form.selectedPermissions.includes(p.id));
            },
            set(items) {
                this.form.selectedPermissions = items.map((p) => p.id);
            },
        },
        confirmSummary() {
            return [
                { label: "نام کامل", value: `${this.form.first_name} ${this.form.last_name}`.trim() },
                { label: "نام کاربری", value: this.form.username ? `@${this.form.username}` : "", ltr: true },
                { label: "ایمیل", value: this.form.email, ltr: true },
                { label: "موبایل", value: this.form.phone, ltr: true },
                { label: "وضعیت", value: this.form.status === "active" ? "فعال" : "غیرفعال" },
                { label: "شغل", value: this.form.job },
                { label: "تاریخ تولد", value: this.form.birthdate },
                { label: "بیوگرافی", value: this.form.bio },
            ];
        },
    },
    methods: {
        mainStepButtonClass(index) {
            if (index === this.currentStep) return "bg-yellow-400/15 ring-1 ring-yellow-400/40";
            if (index < this.currentStep) return "hover:bg-gray-50 dark:hover:bg-gray-800/60";
            return "hover:bg-gray-50 dark:hover:bg-gray-800/40 opacity-80";
        },
        mainStepIndexClass(index) {
            if (index === this.currentStep) return "bg-yellow-400 text-gray-900";
            if (index < this.currentStep) return "bg-gray-800 dark:bg-gray-600 text-white";
            return "bg-gray-100 dark:bg-gray-800 text-gray-500";
        },
        goToStep(index) {
            if (index >= 0 && index < this.STEPS.length) {
                if (index > this.currentStep && !this.validateStep(this.currentStep)) return;
                this.currentStep = index;
            }
        },
        nextStep() {
            if (!this.validateStep(this.currentStep)) return;
            if (this.currentStep < this.STEPS.length - 1) {
                this.currentStep += 1;
            }
        },
        prevStep() {
            if (this.currentStep > 0) this.currentStep -= 1;
        },
        validateStep(stepIndex) {
            const stepId = this.STEPS[stepIndex]?.id;
            if (stepId === "basic") {
                const missing = [];
                if (!this.form.first_name?.trim()) missing.push("نام");
                if (!this.form.last_name?.trim()) missing.push("نام خانوادگی");
                if (!this.form.username?.trim()) missing.push("نام کاربری");
                if (!this.form.email?.trim()) missing.push("ایمیل");
                if (!this.form.password) missing.push("رمز عبور");
                if (!this.form.password_confirmation) missing.push("تکرار رمز عبور");
                if (this.form.password && this.form.password !== this.form.password_confirmation) {
                    this.showToast("رمز عبور و تکرار آن یکسان نیستند", true);
                    return false;
                }
                if (missing.length) {
                    this.showToast(`لطفاً فیلدهای الزامی را تکمیل کنید: ${missing.join("، ")}`, true);
                    return false;
                }
            }
            return true;
        },
        showToast(message, isError = false) {
            const opts = {
                theme: "colored",
                hideProgressBar: false,
                rtl: localStorage.getItem("direction") === "rtl",
                bodyClassName: "font-YekanBakh",
                toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                transition: toast.TRANSITIONS.BOUNCE,
                position: toast.POSITION.BOTTOM_RIGHT,
            };
            isError ? toast.error(message, opts) : toast.success(message, opts);
        },
        filterInputUsername(event) {
            event.target.value = event.target.value.replace(/[^a-zA-Z0-9_]/g, "");
        },
        handleMobileInputChange(event) {
            let value = event.target.value;
            value = value.replace(/[^\d+]/g, "");
            if (value.length < this.form.phone.length) { this.form.phone = value; return; }
            if (value.length === 0) { this.form.phone = value; return; }
            if (value === "+" || value === "+9" || value === "+98") { this.form.phone = value; return; }
            if (value.includes("+")) {
                const plusCount = (value.match(/\+/g) || []).length;
                if (plusCount > 1) {
                    const i = value.indexOf("+");
                    value = value.substring(0, i + 1) + value.substring(i + 1).replace(/\+/g, "");
                }
                if (!value.startsWith("+")) value = "+" + value.replace(/\+/g, "");
            }
            if (value.startsWith("+")) {
                if (value === "+") { this.form.phone = "+98"; return; }
                if (value.startsWith("+98") && /^\+98\d*$/.test(value)) {
                    const digits = value.substring(3);
                    this.form.phone = digits.length <= 10 ? value : "+98" + digits.substring(0, 10);
                    return;
                }
                this.form.phone = value;
                return;
            }
            if (value.startsWith("0") || value.startsWith("9")) {
                let digits = value.replace(/[^\d]/g, "");
                if (digits.startsWith("0")) digits = digits.substring(1);
                this.form.phone = digits.length <= 10 ? "+98" + digits : "+98" + digits.substring(0, 10);
                return;
            }
            this.form.phone = value;
        },
        async getAllRoles() {
            this.loadingRoles = true;
            try {
                const response = await axiosInstance.get("admin/roles/all");
                this.allRoles = response.data.roles || [];
            } catch {
                try {
                    const response = await axiosInstance.post("admin/roles", { perPage: 1000 });
                    this.allRoles = response.data.roles || [];
                } catch {
                    this.allRoles = [];
                }
            } finally {
                this.loadingRoles = false;
            }
        },
        async getAllPermissions() {
            this.loadingPermissions = true;
            try {
                const response = await axiosInstance.get("admin/permissions/all");
                this.allPermissions = response.data.permissions || [];
            } catch {
                this.allPermissions = [];
            } finally {
                this.loadingPermissions = false;
            }
        },
        openFileInput(type) {
            const ref = type === "cover" ? "fileInputCover" : "fileInputProfile";
            this.$refs[ref]?.click();
        },
        resetFileInput(type) {
            const ref = type === "cover" ? "fileInputCover" : "fileInputProfile";
            if (this.$refs[ref]) this.$refs[ref].value = "";
        },
        onImageFileSelected(event, type) {
            const file = event.target.files?.[0];
            this.resetFileInput(type);
            if (!file) return;

            if (!file.type.startsWith("image/")) {
                this.showToast("فرمت فایل نامعتبر است", true);
                return;
            }
            if (file.size > MAX_IMAGE_SIZE_BYTES) {
                this.showToast("حجم فایل نباید بیشتر از ۵ مگابایت باشد", true);
                return;
            }

            this.closeCropModal();
            this.cropType = type;
            this.cropSourceMime = file.type || "";
            this.cropImageSrc = URL.createObjectURL(file);
            this.cropModalOpen = true;
        },
        closeCropModal() {
            if (this.cropImageSrc) URL.revokeObjectURL(this.cropImageSrc);
            this.cropImageSrc = "";
            this.cropSourceMime = "";
            this.cropModalOpen = false;
        },
        onCropConfirm(file) {
            if (this.cropType === "cover") {
                if (this.coverPicObjectUrl) URL.revokeObjectURL(this.coverPicObjectUrl);
                this.coverPicFile = file;
                this.coverPicObjectUrl = URL.createObjectURL(file);
                this.coverPicPreview = this.coverPicObjectUrl;
            } else {
                if (this.profilePicObjectUrl) URL.revokeObjectURL(this.profilePicObjectUrl);
                this.profilePicFile = file;
                this.profilePicObjectUrl = URL.createObjectURL(file);
                this.profilePicPreview = this.profilePicObjectUrl;
            }
            this.closeCropModal();
        },
        removeProfilePic() {
            if (this.profilePicObjectUrl) URL.revokeObjectURL(this.profilePicObjectUrl);
            this.profilePicObjectUrl = null;
            this.profilePicFile = null;
            this.profilePicPreview = null;
            this.profilePicUploadProgress = 0;
            this.resetFileInput("profile");
        },
        removeCoverPic() {
            if (this.coverPicObjectUrl) URL.revokeObjectURL(this.coverPicObjectUrl);
            this.coverPicObjectUrl = null;
            this.coverPicFile = null;
            this.coverPicPreview = null;
            this.coverPicUploadProgress = 0;
            this.resetFileInput("cover");
        },
        async uploadImageToServer(userId, file, type) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", type);
            const progressKey = type === "profile_pic" ? "profilePicUploadProgress" : "coverPicUploadProgress";
            this[progressKey] = 0;
            try {
                await axiosInstance.post(`admin/user/${userId}/upload-image`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (e) => {
                        if (e.total) this[progressKey] = Math.round((e.loaded * 100) / e.total);
                    },
                });
                this[progressKey] = 100;
            } catch (error) {
                console.error(`Error uploading ${type}:`, error);
                this[progressKey] = 0;
            }
        },
        async submitForm() {
            if (!this.validateStep(1)) {
                this.currentStep = 1;
                return;
            }
            this.errors = null;
            this.submitLoading = true;

            const formData = {
                first_name: this.form.first_name,
                last_name: this.form.last_name,
                username: this.form.username,
                email: this.form.email,
                phone: this.form.phone || null,
                password: this.form.password,
                password_confirmation: this.form.password_confirmation,
                status: this.form.status,
                profile_pic: DEFAULT_PROFILE_PIC,
                cover_pic: DEFAULT_COVER_PIC,
                roles: this.form.selectedRoles,
                permissions: this.form.selectedPermissions,
                job: this.form.job || null,
                birthdate: this.form.birthdate || null,
                bio: this.form.bio || null,
                telegram: this.form.telegram || null,
                instagram: this.form.instagram || null,
                twitter: this.form.twitter || null,
                linkedin: this.form.linkedin || null,
                github: this.form.github || null,
                website: this.form.website || null,
            };

            try {
                const createResponse = await axiosInstance.post("admin/user/create", formData);
                const userId = createResponse.data.user.id;

                const uploads = [];
                if (this.profilePicFile) uploads.push(this.uploadImageToServer(userId, this.profilePicFile, "profile_pic"));
                if (this.coverPicFile) uploads.push(this.uploadImageToServer(userId, this.coverPicFile, "cover_pic"));
                if (uploads.length) await Promise.all(uploads);

                this.profilePicUploadProgress = 0;
                this.coverPicUploadProgress = 0;
                this.showToast("کاربر جدید با موفقیت ایجاد شد.");
                setTimeout(() => this.$router.push({ name: "admin-users-list" }), 2000);
            } catch (error) {
                this.errors = error.response?.data?.errors;
                const msg = error.response?.data?.message || "خطا! لطفا خطاها را برطرف کنید و دوباره اقدام کنید.";
                this.showToast(msg, true);
                if (this.errors) {
                    const basicFields = ["first_name", "last_name", "username", "email", "phone", "password", "password_confirmation"];
                    if (basicFields.some((f) => this.errors[f])) this.currentStep = 1;
                }
            } finally {
                this.submitLoading = false;
            }
        },
    },
    mounted() {
        document.title = "ایجاد کاربر جدید";
        this.getAllRoles();
        this.getAllPermissions();
    },
    beforeUnmount() {
        if (this.profilePicObjectUrl) URL.revokeObjectURL(this.profilePicObjectUrl);
        if (this.coverPicObjectUrl) URL.revokeObjectURL(this.coverPicObjectUrl);
        if (this.cropImageSrc) URL.revokeObjectURL(this.cropImageSrc);
    },
};
</script>

<style scoped>
.form-input {
    display: block;
    width: 100%;
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
    border-radius: 0.75rem;
    outline: none;
    background: #f3f4f6;
    color: #111827;
    border: 1px solid transparent;
    transition: box-shadow 0.15s, border-color 0.15s;
}
.form-input:focus {
    box-shadow: 0 0 0 2px #facc15;
}
.dark .form-input {
    background: #374151;
    color: #fff;
}
.field-label {
    display: block;
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
    margin-bottom: 0.375rem;
}
.dark .field-label { color: #9ca3af; }

@media (min-width: 1024px) {
    .user-form-layout {
        grid-template-columns: 14rem minmax(0, 1fr);
    }
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
