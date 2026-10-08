<template>
    <AdminMasterPage :breadcrumb-title-override="tag ? `#${tag.name}` : ''" :breadcrumb-last-override="tag ? `#${tag.name}` : ''">
        <template #breadcrumb-actions>
            <router-link :to="{ name: 'admin-tags' }"
                class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100">
                <span class="flex items-center">بازگشت به لیست</span>
            </router-link>
            <router-link v-if="tag" :to="{ name: 'tag-show', params: { tagSlug: tag.slug } }" target="_blank"
                class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100">
                <span class="flex items-center">مشاهده در سایت</span>
            </router-link>
            <button v-if="tag" @click="openEditModal"
                class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100">
                <span class="flex items-center">ویرایش</span>
            </button>
            <button @click="refreshData"
                class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100">
                <span class="flex items-center">بروزرسانی</span>
            </button>
        </template>

        <div class="min-w-0">
            <div v-if="loading" class="py-20 text-center text-sm text-gray-400">در حال بارگذاری...</div>

            <template v-else-if="tag">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                    <div class="bg-white dark:bg-gray-900 rounded-xl p-4">
                        <p class="text-xs text-gray-500">سوالات منتشرشده</p>
                        <p class="text-lg font-bold font-anjoman text-gray-900 dark:text-white mt-1">{{ tag.questions_count }}</p>
                    </div>
                    <div class="bg-white dark:bg-gray-900 rounded-xl p-4">
                        <p class="text-xs text-gray-500">کل سوالات</p>
                        <p class="text-lg font-bold font-anjoman text-gray-900 dark:text-white mt-1">{{ tag.questions_total_count }}</p>
                    </div>
                    <div class="bg-white dark:bg-gray-900 rounded-xl p-4">
                        <p class="text-xs text-gray-500">دوره‌ها</p>
                        <p class="text-lg font-bold font-anjoman text-gray-900 dark:text-white mt-1">{{ tag.courses_count }}</p>
                    </div>
                    <div class="bg-white dark:bg-gray-900 rounded-xl p-4">
                        <p class="text-xs text-gray-500">دنبال‌کننده</p>
                        <p class="text-lg font-bold font-anjoman text-gray-900 dark:text-white mt-1">{{ tag.followers_count }}</p>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-900 rounded-xl p-4 mb-4">
                    <div class="flex flex-wrap items-center gap-3">
                        <span class="text-xl font-extrabold text-amber-600 dark:text-amber-400">#{{ tag.name }}</span>
                        <span class="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">{{ tag.slug }}</span>
                        <span class="text-xs text-gray-400">ایجاد: {{ formatDate(tag.created_at) }}</span>
                    </div>
                </div>

                <div class="flex gap-1.5 mb-4">
                    <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
                        :class="activeTab === tab.key ? 'bg-amber-400 text-gray-900' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'"
                        class="rounded-lg py-2 px-3.5 text-xs font-semibold transition">
                        {{ tab.label }}
                    </button>
                </div>

                <div v-if="activeTab === 'questions'" class="space-y-2">
                    <div v-if="questionsLoading" class="py-8 text-center text-xs text-gray-400">در حال بارگذاری...</div>
                    <div v-for="q in questions" :key="q.id"
                        class="bg-white dark:bg-gray-900 rounded-xl p-4 flex items-start justify-between gap-3">
                        <div class="min-w-0">
                            <router-link :to="{ name: 'admin-question-details', params: { id: q.id } }"
                                class="text-sm font-semibold text-gray-900 dark:text-white hover:text-amber-600 line-clamp-2">{{ q.subject }}</router-link>
                            <div class="text-xs text-gray-400 mt-1">
                                {{ q.user ? `${q.user.first_name || ''} ${q.user.last_name || ''}`.trim() || q.user.username : '—' }}
                                · {{ formatDate(q.created_at) }}
                            </div>
                        </div>
                        <span :class="q.publish ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'"
                            class="text-xs font-semibold px-2 py-1 rounded-lg shrink-0">{{ q.publish ? 'منتشر' : 'پیش‌نویس' }}</span>
                    </div>
                    <p v-if="!questionsLoading && questions.length === 0" class="py-8 text-center text-sm text-gray-400">سوالی با این تگ نیست</p>
                    <PaginationComponent v-if="questionsPagination.last_page > 1" dir="ltr" :pagination="questionsPagination" @updatePage="loadQuestions" />
                </div>

                <div v-else class="space-y-2">
                    <div v-if="coursesLoading" class="py-8 text-center text-xs text-gray-400">در حال بارگذاری...</div>
                    <div v-for="c in courses" :key="c.id"
                        class="bg-white dark:bg-gray-900 rounded-xl p-4 flex items-center justify-between gap-3">
                        <div class="min-w-0">
                            <div class="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{{ c.title }}</div>
                            <div class="text-xs text-gray-400 mt-0.5">{{ c.english_title }} · {{ formatDate(c.created_at) }}</div>
                        </div>
                        <router-link :to="{ name: 'admin-course-details', params: { courseSlug: c.slug } }"
                            class="text-xs font-semibold text-amber-600 hover:underline shrink-0">مشاهده</router-link>
                    </div>
                    <p v-if="!coursesLoading && courses.length === 0" class="py-8 text-center text-sm text-gray-400">دوره‌ای با این تگ نیست</p>
                    <PaginationComponent v-if="coursesPagination.last_page > 1" dir="ltr" :pagination="coursesPagination" @updatePage="loadCourses" />
                </div>
            </template>

            <div v-else class="py-20 text-center text-sm text-gray-400">تگ یافت نشد</div>
        </div>

        <BottomSheetDrawer v-model="showEditModal" :initialHeight="0.4" :panelClass="'bg-white dark:bg-gray-900 rounded-t-2xl lg:w-[32rem]'"
            :contentClass="'px-4 pb-4'" :backdropClass="'bg-gray-300/30 backdrop-blur-sm'">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-4">ویرایش تگ</h3>
            <form @submit.prevent="submitEdit">
                <input v-model="editName" type="text" maxlength="20" @input="onEditNameInput"
                    class="bg-gray-100 text-sm rounded-lg w-full p-2.5 dark:bg-gray-700 dark:text-white mb-2" />
                <p v-if="editError" class="text-xs text-rose-500 mb-2">{{ editError }}</p>
                <div class="flex justify-end gap-2">
                    <button type="button" @click="showEditModal = false" class="h-9 px-4 text-sm font-semibold rounded-lg bg-gray-100">انصراف</button>
                    <button type="submit" :disabled="editLoading" class="h-9 px-4 text-sm font-semibold rounded-lg bg-amber-400 text-gray-900">ذخیره</button>
                </div>
            </form>
        </BottomSheetDrawer>
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import axiosInstance from "@/store/axiosInstance";
import { toast } from "vue3-toastify";
import { sanitizeTagInput, validateTagName } from "@/utils/tagFormat";

export default {
    name: "AdminTagDetails",
    components: { AdminMasterPage, PaginationComponent, BottomSheetDrawer },
    props: { id: { type: [String, Number], required: true } },
    data() {
        return {
            loading: true,
            tag: null,
            activeTab: "questions",
            tabs: [
                { key: "questions", label: "سوالات" },
                { key: "courses", label: "دوره‌ها" },
            ],
            questions: [],
            questionsPagination: {},
            questionsPage: 1,
            questionsLoading: false,
            courses: [],
            coursesPagination: {},
            coursesPage: 1,
            coursesLoading: false,
            showEditModal: false,
            editName: "",
            editError: "",
            editLoading: false,
        };
    },
    watch: {
        activeTab(tab) {
            if (tab === "questions" && this.questions.length === 0) this.loadQuestions(1);
            if (tab === "courses" && this.courses.length === 0) this.loadCourses(1);
        },
    },
    mounted() {
        this.fetchTag();
    },
    methods: {
        refreshData() {
            this.fetchTag();
            if (this.activeTab === "questions") this.loadQuestions(this.questionsPage);
            else this.loadCourses(this.coursesPage);
        },
        formatDate(date) {
            if (!date) return "-";
            return new Date(date).toLocaleDateString("fa-IR", { year: "numeric", month: "short", day: "2-digit" });
        },
        async fetchTag() {
            this.loading = true;
            try {
                const res = await axiosInstance.get(`/admin/tag/${this.id}`);
                this.tag = res.data.tag;
                this.loadQuestions(1);
            } catch (e) {
                this.tag = null;
            } finally {
                this.loading = false;
            }
        },
        async loadQuestions(page = 1) {
            this.questionsPage = page;
            this.questionsLoading = true;
            try {
                const res = await axiosInstance.post(`/admin/tag/${this.id}/questions`, { page, perPage: 10 });
                this.questions = res.data.questions.data || [];
                this.questionsPagination = res.data.questions;
            } catch (e) {
                console.error(e);
            } finally {
                this.questionsLoading = false;
            }
        },
        async loadCourses(page = 1) {
            this.coursesPage = page;
            this.coursesLoading = true;
            try {
                const res = await axiosInstance.post(`/admin/tag/${this.id}/courses`, { page, perPage: 10 });
                this.courses = res.data.courses.data || [];
                this.coursesPagination = res.data.courses;
            } catch (e) {
                console.error(e);
            } finally {
                this.coursesLoading = false;
            }
        },
        openEditModal() {
            this.editName = this.tag.name;
            this.editError = "";
            this.showEditModal = true;
        },
        onEditNameInput() {
            this.editName = sanitizeTagInput(this.editName);
            this.editError = validateTagName(this.editName, (k) => this.$t(k)) || "";
        },
        async submitEdit() {
            const err = validateTagName(this.editName, (k) => this.$t(k));
            if (err) {
                this.editError = err;
                return;
            }
            this.editLoading = true;
            try {
                await axiosInstance.post(`/admin/tag/${this.id}/update`, { name: this.editName.trim() });
                toast.success("تگ بروزرسانی شد", { theme: "colored", rtl: localStorage.getItem("direction") === "rtl", position: toast.POSITION.BOTTOM_RIGHT });
                this.showEditModal = false;
                this.fetchTag();
            } catch (e) {
                this.editError = e.response?.data?.errors?.name?.[0] || "خطا در ذخیره";
            } finally {
                this.editLoading = false;
            }
        },
    },
};
</script>
