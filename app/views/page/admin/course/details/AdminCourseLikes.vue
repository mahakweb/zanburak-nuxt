<template>
    <div>
        <AdminTabPanelToolbar>
            <AdminFilterSelect v-model="filters.type" label="نوع" :options="typeOptions" @change="onFilterChange" />
            <AdminFilterSelect v-model="filters.sort" label="مرتب‌سازی" :options="sortOptions" @change="onFilterChange" />
        </AdminTabPanelToolbar>
        <AdminInlineLoading v-if="loading" />
        <div v-else id="data-list">
            <div v-if="likes && likes.length > 0" class="space-y-2">
                <div v-for="like in likes" :key="like.id"
                    class="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-amber-200/60 dark:hover:border-amber-500/20 transition-colors">
                    <div class="flex items-center space-x-3 rtl:space-x-reverse">
                        <router-link v-if="like.user" :to="{ name: 'profile-page', params: { username: like.user.username } }"
                            class="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600 bg-gray-300">
                            <img onerror="this.style.display='none'" class="w-full h-full object-cover"
                                :src="like.user.profile_pic" :alt="like.user.username" />
                        </router-link>
                        <div v-else class="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                            <span class="text-gray-600 dark:text-gray-300 text-xs">?</span>
                        </div>
                        <div class="flex-1">
                            <div class="font-medium text-gray-900 dark:text-gray-100">
                                <router-link v-if="like.user"
                                    :to="{ name: 'profile-page', params: { username: like.user.username } }">
                                    {{ like.user.name || (like.user.first_name + ' ' + like.user.last_name) }}
                                </router-link>
                                <span v-else>کاربر ناشناس</span>
                            </div>
                            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {{ new Date(like.created_at).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="px-2 py-1 rounded text-xs font-semibold"
                            :class="like.type === 'like' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'">
                            {{ like.type === 'like' ? 'لایک' : 'دیسلایک' }}
                        </span>
                    </div>
                </div>
            </div>
            <AdminEmptyState v-else message="هیچ لایکی ثبت نشده است" />
        </div>

        <!-- Pagination -->
        <div v-if="pagination && pagination.last_page > 1"
            class="flex lg:flex-row flex-col items-center justify-between gap-4 mt-6">
            <div class="">
                <PaginationComponent dir="ltr" :pagination="pagination" @updatePage="updatePage" />
            </div>
            <div class="w-max">
                <select v-model="perPage" @change="selectPerpage(perPage)"
                    class="w-full px-3 py-1.5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none">
                    <option v-for="(per, index) in perPages" :key="index" :value="per">{{ per }}</option>
                </select>
            </div>
        </div>
    </div>
</template>
<script>
import AdminInlineLoading from "@/views/components/admin/AdminInlineLoading.vue";
import axiosInstance from "@/store/axiosInstance";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import AdminTabPanelToolbar from "@/views/components/admin/AdminTabPanelToolbar.vue";
import AdminFilterSelect from "@/views/components/admin/AdminFilterSelect.vue";
import AdminEmptyState from "@/views/components/admin/AdminEmptyState.vue";

export default {
    components: {
        AdminInlineLoading,
        PaginationComponent,
        AdminTabPanelToolbar,
        AdminFilterSelect,
        AdminEmptyState,
    },
    props: {
        courseSlug: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            filters: {
                type: 'all',
                sort: 'desc'
            },
            likes: [],
            loading: false,
            pagination: {},
            perPage: 20,
            perPages: [10, 20, 30, 50, 100],
            currentPage: 1,
        };
    },
    computed: {
        typeOptions() {
            return [
                { value: "all", label: "همه" },
                { value: "like", label: "لایک" },
                { value: "dislike", label: "دیسلایک" },
            ];
        },
        sortOptions() {
            return [
                { value: "desc", label: "جدیدترین" },
                { value: "asc", label: "قدیمی‌ترین" },
            ];
        },
    },
    methods: {
        onFilterChange() {
            this.currentPage = 1;
            this.getCourseLikes();
        },
        selectPerpage(value) {
            this.perPage = value;
            this.currentPage = 1;
            this.getCourseLikes();
        },
        updatePage(page) {
            this.currentPage = page;
            this.getCourseLikes();
        },
        async getCourseLikes() {
            this.loading = true;
            try {
                const response = await axiosInstance.post(
                    `admin/course/${this.courseSlug}/details`,
                    {
                        data_type: 'likes',
                        page: this.currentPage,
                        perPage: this.perPage,
                        sort: this.filters.sort,
                        filter: this.filters.type
                    }
                );
                this.likes = response.data.likes || [];
                this.pagination = response.data.pagination || {};
            } catch (error) {
                console.error("Error fetching course likes:", error);
                this.likes = [];
                this.pagination = {};
            } finally {
                this.loading = false;
            }
        },
    },
    mounted() {
        this.getCourseLikes();
    },
}
</script>
<style></style>

