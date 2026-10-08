<template>
    <AdminMasterPage>
        <div class="pb-10">
            <div class="grid grid-cols-12 gap-2 p-2 md:p-4">
                <div class="col-span-12 md:col-span-3">
                    <div class="mb-3">
                        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">جزئیات پایه</h3>
                        <p class="text-gray-500 dark:text-gray-400 leading-6 text-sm">
                            اطلاعات ابتدایی رویداد را وارد کنید و کانال‌های اطلاع‌رسانی را فعال کنید.
                        </p>
                    </div>
                </div>
                <div class="col-span-12 md:col-span-9">
                    <div class="rounded-xl bg-white dark:bg-gray-900/60 p-2 md:p-4">
                        <form @submit.prevent="submitForm">
                            <div class="grid gap-x-6 gap-y-3 mb-6 grid-cols-1 md:grid-cols-2">
                                <div>
                                    <label for="title"
                                        class="block mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">
                                        عنوان فارسی
                                        <span class="text-rose-500">*</span>
                                    </label>
                                    <input type="text" id="title" v-model="formData.title"
                                        class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
                                        :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.title }"
                                        placeholder="" required />
                                    <span v-if="errors && errors.title" class="mt-1 text-rose-500 text-xs font-medium">
                                        {{ errors.title[0] }}
                                    </span>
                                </div>
                                <div>
                                    <label for="english_title"
                                        class="block mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">
                                        عنوان انگلیسی
                                        <span class="text-rose-500">*</span>
                                    </label>
                                    <input type="text" id="english_title" v-model="formData.english_title"
                                        class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
                                        :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.english_title }"
                                        placeholder="" required />
                                    <span v-if="errors && errors.english_title" class="mt-1 text-rose-500 text-xs font-medium">
                                        {{ errors.english_title[0] }}
                                    </span>
                                </div>
                                <div>
                                    <label for="event_group_id"
                                        class="block mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">
                                        گروه رویداد
                                        <span class="text-rose-500">*</span>
                                    </label>
                                    <select id="event_group_id" v-model="formData.event_group_id"
                                        class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
                                        :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.event_group_id }">
                                        <option value="" disabled selected>انتخاب گروه</option>
                                        <option v-for="group in eventGroups" :key="group.id" :value="group.id">{{ group.title }}</option>
                                    </select>
                                    <span v-if="errors && errors.event_group_id" class="mt-1 text-rose-500 text-xs font-medium">
                                        {{ errors.event_group_id[0] }}
                                    </span>
                                </div>
                                <div class="md:col-span-2">
                                    <label for="description"
                                        class="block mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">
                                        توضیحات
                                    </label>
                                    <textarea id="description" v-model="formData.description" rows="4"
                                        class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
                                        :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.description }"
                                        placeholder=""></textarea>
                                    <span v-if="errors && errors.description" class="mt-1 text-rose-500 text-xs font-medium">
                                        {{ errors.description[0] }}
                                    </span>
                                </div>
                                <div class="md:col-span-2">
                                    <label for="icon"
                                        class="block mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">
                                        آیکون (HTML)
                                    </label>
                                    <textarea id="icon" v-model="formData.icon" rows="3"
                                        class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white font-mono"
                                        :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.icon }"
                                        placeholder='مثال: <svg>...</svg>'></textarea>
                                    <span v-if="errors && errors.icon" class="mt-1 text-rose-500 text-xs font-medium">
                                        {{ errors.icon[0] }}
                                    </span>
                                </div>
                                <div class="md:col-span-2">
                                    <div class="mb-3">
                                        <label class="block mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">
                                            کانال‌های اطلاع‌رسانی
                                        </label>
                                        <p class="text-xs text-gray-400 mt-1 mb-4">
                                            کانال‌هایی که می‌خواهید برای این رویداد فعال باشند را انتخاب کنید. کاربران می‌توانند از بین کانال‌های فعال، انتخاب کنند.
                                        </p>
                                    </div>
                                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div @click="formData.is_email_enabled = !formData.is_email_enabled"
                                            class="group relative flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105"
                                            :class="formData.is_email_enabled 
                                                ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/20 shadow-lg shadow-yellow-200/50 dark:shadow-yellow-900/20' 
                                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800/50 hover:shadow-md'">
                                            <div class="flex items-center gap-2">
                                                <svg class="w-5 h-5 transition-colors duration-300" 
                                                    :class="formData.is_email_enabled ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'"
                                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                                </svg>
                                                <span class="text-sm font-semibold transition-colors duration-300"
                                                    :class="formData.is_email_enabled ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-700 dark:text-gray-300'">ایمیل</span>
                                            </div>
                                        </div>
                                        <div @click="formData.is_sms_enabled = !formData.is_sms_enabled"
                                            class="group relative flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105"
                                            :class="formData.is_sms_enabled 
                                                ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/20 shadow-lg shadow-yellow-200/50 dark:shadow-yellow-900/20' 
                                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800/50 hover:shadow-md'">
                                            <div class="flex items-center gap-2">
                                                <svg class="w-5 h-5 transition-colors duration-300" 
                                                    :class="formData.is_sms_enabled ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'"
                                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                                </svg>
                                                <span class="text-sm font-semibold transition-colors duration-300"
                                                    :class="formData.is_sms_enabled ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-700 dark:text-gray-300'">پیامک</span>
                                            </div>
                                        </div>
                                        <div @click="formData.is_telegram_enabled = !formData.is_telegram_enabled"
                                            class="group relative flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105"
                                            :class="formData.is_telegram_enabled 
                                                ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/20 shadow-lg shadow-yellow-200/50 dark:shadow-yellow-900/20' 
                                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800/50 hover:shadow-md'">
                                            <div class="flex items-center gap-2">
                                                <svg class="w-4 h-4 transition-colors duration-300" 
                                                    :class="formData.is_telegram_enabled ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'"
                                                    fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                                </svg>
                                                <span class="text-sm font-semibold transition-colors duration-300"
                                                    :class="formData.is_telegram_enabled ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-700 dark:text-gray-300'">تلگرام</span>
                                            </div>
                                        </div>
                                        <div @click="formData.is_site_enabled = !formData.is_site_enabled"
                                            class="group relative flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105"
                                            :class="formData.is_site_enabled 
                                                ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/20 shadow-lg shadow-yellow-200/50 dark:shadow-yellow-900/20' 
                                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800/50 hover:shadow-md'">
                                            <div class="flex items-center gap-2">
                                                <svg class="w-5 h-5 transition-colors duration-300" 
                                                    :class="formData.is_site_enabled ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'"
                                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                                                </svg>
                                                <span class="text-sm font-semibold transition-colors duration-300"
                                                    :class="formData.is_site_enabled ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-700 dark:text-gray-300'">سایت</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <router-link :to="{ name: 'admin-events' }"
                                    class="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors">
                                    انصراف
                                </router-link>
                                <button type="submit" :disabled="loading"
                                    class="px-6 py-2 text-sm font-semibold text-white bg-yellow-400 rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow">
                                    <span v-if="loading">در حال ایجاد...</span>
                                    <span v-else>ایجاد رویداد</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <LoadingComponent v-if="loading" class="" />
    </AdminMasterPage>
</template>
<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import axiosInstance from "@/store/axiosInstance";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
    components: {
        AdminMasterPage,
        LoadingComponent
    },
    data() {
        return {
            loading: false,
            errors: null,
            eventGroups: [],
            formData: {
                title: '',
                english_title: '',
                description: '',
                icon: '',
                event_group_id: '',
                is_email_enabled: true,
                is_sms_enabled: true,
                is_telegram_enabled: true,
                is_site_enabled: true,
            }
        };
    },
    methods: {
        async fetchEventGroups() {
            try {
                const response = await axiosInstance.get('admin/notification-management/event-groups/all');
                this.eventGroups = response.data.event_groups;
            } catch (error) {
                console.error('Error fetching event groups:', error);
            }
        },
        async submitForm() {
            this.loading = true;
            this.errors = null;

            try {
                await axiosInstance.post('admin/notification-management/event/create', this.formData);
                
                toast.success("رویداد با موفقیت ایجاد شد", {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });

                this.$router.push({ name: 'admin-events' });
            } catch (error) {
                if (error.response?.data?.errors) {
                    this.errors = error.response.data.errors;
                } else {
                    toast.error("خطا در ایجاد رویداد", {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                }
            } finally {
                this.loading = false;
            }
        }
    },
    mounted() {
        document.title = "ایجاد رویداد جدید";
        this.fetchEventGroups();
    }
};
</script>
<style scoped>
/* Modern checkbox styles are handled inline with Tailwind classes */
</style>

