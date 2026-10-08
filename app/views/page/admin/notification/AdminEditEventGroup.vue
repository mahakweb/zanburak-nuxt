<template>
    <AdminMasterPage>
        <div class="pb-10">
            <div class="grid grid-cols-12 gap-2 p-2 md:p-4">
                <div class="col-span-12 md:col-span-3">
                    <div class="mb-3">
                        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">جزئیات پایه</h3>
                        <p class="text-gray-500 dark:text-gray-400 leading-6 text-sm">
                            اطلاعات ابتدایی گروه رویداد را ویرایش کنید.
                        </p>
                    </div>
                </div>
                <div class="col-span-12 md:col-span-9">
                    <div class="rounded-xl bg-white dark:bg-gray-900/60 p-2 md:p-4">
                        <form @submit.prevent="submitForm">
                            <div class="grid gap-x-6 gap-y-3 mb-6 grid-cols-1 md:grid-cols-2">
                                <div>
                                    <label for="title"
                                        class="flex items-center justify-between mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">
                                        عنوان فارسی
                                        <span class="text-rose-500">*</span>
                                    </label>
                                    <input type="text" id="title" v-model="formData.title"
                                        class="w-full px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                        :class="errors && errors.title ? 'border-rose-500' : ''" />
                                    <p v-if="errors && errors.title" class="mt-1 text-xs text-rose-500">{{ errors.title[0] }}</p>
                                </div>
                                <div>
                                    <label for="english_title"
                                        class="flex items-center justify-between mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">
                                        عنوان انگلیسی
                                        <span class="text-rose-500">*</span>
                                    </label>
                                    <input type="text" id="english_title" v-model="formData.english_title"
                                        class="w-full px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                        :class="errors && errors.english_title ? 'border-rose-500' : ''" />
                                    <p v-if="errors && errors.english_title" class="mt-1 text-xs text-rose-500">{{ errors.english_title[0] }}</p>
                                </div>
                                <div class="md:col-span-2">
                                    <label for="description"
                                        class="flex items-center justify-between mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">
                                        توضیحات
                                    </label>
                                    <textarea id="description" v-model="formData.description" rows="4"
                                        class="w-full px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                        :class="errors && errors.description ? 'border-rose-500' : ''"></textarea>
                                    <p v-if="errors && errors.description" class="mt-1 text-xs text-rose-500">{{ errors.description[0] }}</p>
                                </div>
                                <div class="md:col-span-2">
                                    <label for="icon"
                                        class="flex items-center justify-between mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">
                                        آیکون (HTML)
                                    </label>
                                    <textarea id="icon" v-model="formData.icon" rows="3"
                                        class="w-full px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white font-mono"
                                        placeholder='مثال: <svg>...</svg>'></textarea>
                                    <p v-if="errors && errors.icon" class="mt-1 text-xs text-rose-500">{{ errors.icon[0] }}</p>
                                </div>
                            </div>
                            <div class="flex items-center justify-end gap-3">
                                <router-link :to="{ name: 'admin-event-groups' }"
                                    class="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                                    انصراف
                                </router-link>
                                <button type="submit" :disabled="loading"
                                    class="px-4 py-2 text-sm font-semibold text-white bg-yellow-400 rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <span v-if="loading">در حال ذخیره...</span>
                                    <span v-else>ذخیره</span>
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
            eventGroupId: this.$route.params.eventGroupId,
            formData: {
                title: '',
                english_title: '',
                description: '',
                icon: ''
            }
        };
    },
    methods: {
        async fetchEventGroup() {
            this.loading = true;
            try {
                const response = await axiosInstance.get(`admin/notification-management/event-group/${this.eventGroupId}`);
                this.formData = {
                    title: response.data.event_group.title,
                    english_title: response.data.event_group.english_title,
                    description: response.data.event_group.description || '',
                    icon: response.data.event_group.icon || ''
                };
            } catch (error) {
                toast.error("خطا در دریافت اطلاعات", {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
                this.$router.push({ name: 'admin-event-groups' });
            } finally {
                this.loading = false;
            }
        },
        async submitForm() {
            this.loading = true;
            this.errors = null;

            try {
                await axiosInstance.post(`admin/notification-management/event-group/${this.eventGroupId}/update`, this.formData);
                
                toast.success("گروه رویداد با موفقیت به‌روزرسانی شد", {
                    theme: "colored",
                    hideProgressBar: false,
                    rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                    bodyClassName: "font-YekanBakh",
                    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                    transition: toast.TRANSITIONS.BOUNCE,
                    position: toast.POSITION.BOTTOM_RIGHT,
                });

                this.$router.push({ name: 'admin-event-groups' });
            } catch (error) {
                if (error.response?.data?.errors) {
                    this.errors = error.response.data.errors;
                } else {
                    toast.error("خطا در به‌روزرسانی گروه رویداد", {
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
        document.title = "ویرایش گروه رویداد";
        this.fetchEventGroup();
    }
};
</script>

