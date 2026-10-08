<template>
    <AdminInlineLoading v-if="loading" />
    <div v-else class="space-y-2">
        <div v-if="views && views.length > 0" class="space-y-1">
            <div v-for="view in views" :key="view.id"
                class="flex flex-col md:flex-row md:items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 first:rounded-t-lg last:rounded-b-lg">
                <!-- آیکون OS و IP/مرورگر (در موبایل کنار هم) -->
                <div class="flex items-start md:items-center gap-3 flex-1 min-w-0">
                    <!-- آیکون OS -->
                    <div v-if="view.deviceInfo && view.deviceInfo.os" v-html="getOSIconSVG(view.deviceInfo.os)"
                        class="shrink-0 rounded-lg flex items-center text-white justify-center w-10 h-10">
                    </div>
                    <div v-else class="w-10 h-10 shrink-0 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                        <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                    </div>
                    
                    <!-- IP و مرورگر (در موبایل دو سطر، در دسکتاپ کنار هم) -->
                    <div class="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 flex-1 min-w-0">
                        <!-- IP و شهر -->
                        <div class="flex items-center gap-2 shrink-0">
                            <country-flag v-if="view.ipInfo && view.ipInfo.countryCode" :country="view.ipInfo.countryCode" size="small" class="mask mask-circle" />
                            <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ view.ip_address || 'IP نامشخص' }}</span>
                            <span v-if="view.ipInfo && view.ipInfo.cityName" class="text-xs text-gray-500 dark:text-gray-400">({{ view.ipInfo.cityName }})</span>
                        </div>
                        
                        <!-- مرورگر/User Agent -->
                        <div class="text-xs text-gray-500 dark:text-gray-400 truncate min-w-0" :title="view.user_agent">
                            <span v-if="view.deviceInfo && view.deviceInfo.os">{{ view.deviceInfo.os.name }} {{ view.deviceInfo.os.version }} - {{ view.deviceInfo.browser.name }}</span>
                            <span v-else class="truncate block">{{ view.user_agent || 'User Agent نامشخص' }}</span>
                        </div>
                    </div>
                </div>
                
                <!-- کاربر و تاریخ/ساعت (در دسکتاپ با justify-between) -->
                <div class="flex items-center justify-between md:justify-between gap-3 md:min-w-0 md:max-w-md md:flex-1">
                    <!-- کاربر (اگر وجود دارد) -->
                     <div>
                        <router-link v-if="view.user" :to="{ name: 'admin-user-details', params: { username: view.user.username } }"
                        class="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity">
                        <img v-if="view.user.profile_pic" :src="view.user.profile_pic" :alt="view.user.name"
                            class="w-8 h-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600">
                        <div v-else class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                            <span class="text-xs font-semibold text-gray-600 dark:text-gray-300">{{ (view.user.name || view.user.username || '').charAt(0).toUpperCase() }}</span>
                        </div>
                        <div class="min-w-0 hidden md:block">
                            <div class="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{{ view.user.name || view.user.username }}</div>
                            <!-- <div class="text-xs text-gray-500 dark:text-gray-400 truncate">@{{ view.user.username }}</div> -->
                        </div>
                        <div class="md:hidden">
                            <div class="font-medium text-sm text-gray-900 dark:text-gray-100">{{ view.user.name || view.user.username }}</div>
                            <!-- <div class="text-xs text-gray-500 dark:text-gray-400">@{{ view.user.username }}</div> -->
                        </div>
                    </router-link>
                     </div>
                    
                    
                    <!-- تاریخ و ساعت -->
                    <div class="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                        {{ new Date(view.created_at).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="flex items-center justify-center h-24 text-gray-500 font-semibold">
            هیچ بازدیدی ثبت نشده است
        </div>
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
</template>
<script>
import axiosInstance from "@/store/axiosInstance";
import AdminInlineLoading from "@/views/components/admin/AdminInlineLoading.vue";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import UAParser from "ua-parser-js";
import CountryFlag from "vue-country-flag-next";

export default {
    components: {
        AdminInlineLoading,
        PaginationComponent,
        CountryFlag,
    },
    props: {
        courseSlug: {
            type: String,
            required: true,
        },
        episodeSlug: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            views: [],
            loading: false,
            filters: {
                sort: 'desc'
            },
            pagination: {},
            perPage: 20,
            perPages: [10, 20, 30, 50, 100],
            currentPage: 1,
        };
    },
    methods: {
        getOSIconSVG(os) {
            if (os.name === "Windows") {
                return `<svg class="bg-blue-600 fill-white w-8 h-8 p-2 rounded-md" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1863.53 1016.437c31.171 0 56.47 25.299 56.47 56.47v790.589c0 16.376-7.115 31.849-19.313 42.465-10.39 9.149-23.605 14.005-37.158 14.005-2.484 0-5.082-.113-7.567-.452l-903.53-123.331c-28.008-3.84-48.903-27.784-48.903-56.02v-667.256c0-31.171 25.3-56.47 56.471-56.47Zm-1129.412 0c31.171 0 56.47 25.299 56.47 56.47v634.504c0 16.376-7.115 31.85-19.426 42.579-10.39 9.035-23.491 13.891-37.044 13.891-2.485 0-5.196-.113-7.68-.564L48.79 1669.35C20.78 1665.51 0 1641.68 0 1613.444v-540.537c0-31.171 25.299-56.47 56.47-56.47Zm-7.726-859.855c16.151-2.372 32.415 2.597 44.725 13.327 12.424 10.73 19.426 26.315 19.426 42.579V846.99c0 31.285-25.186 56.47-56.47 56.47H56.424c-31.171 0-56.47-25.185-56.47-56.47V306.455c0-28.123 20.781-52.066 48.79-55.906ZM1855.974.474c16.15-2.033 32.414 2.71 44.724 13.44 12.198 10.73 19.313 26.203 19.313 42.466v790.588c0 31.285-25.299 56.471-56.47 56.471H960.01c-31.171 0-56.47-25.186-56.47-56.47V179.711c0-28.235 20.78-52.066 48.903-55.906Z" fill-rule="evenodd"></path>
                </svg>`;
            } else if (os.name === "Mac OS") {
                return `<svg class="bg-gray-600 fill-white w-8 h-8 p-1.5 rounded-md" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve">
                    <path style="display: inline" d="M248.644,123.476c-5.45-29.71,8.598-60.285,25.516-80.89 c18.645-22.735,50.642-40.17,77.986-42.086c4.619,31.149-8.093,61.498-24.826,82.965 C309.37,106.527,278.508,124.411,248.644,123.476z M409.034,231.131c8.461-23.606,25.223-44.845,51.227-59.175 c-26.278-32.792-63.173-51.83-97.99-51.83c-46.065,0-65.542,21.947-97.538,21.947c-32.96,0-57.965-21.947-97.866-21.947 c-39.127,0-80.776,23.848-107.19,64.577c-9.712,15.055-16.291,33.758-19.879,54.59c-9.956,58.439,4.916,134.557,49.279,202.144 c21.57,32.796,50.321,69.737,87.881,70.059c33.459,0.327,42.951-21.392,88.246-21.616c45.362-0.258,53.959,21.841,87.372,21.522 c37.571-0.317,67.906-41.199,89.476-73.991c15.359-23.532,21.167-35.418,33.11-62.023 C414.435,352.487,389.459,285.571,409.034,231.131z"></path>
                </svg>`;
            } else if (os.name === "Linux") {
                return `<svg class="bg-amber-400 fill-gray-900 w-8 h-8 p-1.5 rounded-md" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
                    <path display="inline" d="M242.93,136.455c2.291,0,4.454,0.603,6.408,1.726c1.955,1.098,3.71,2.732,5.19,4.736 c1.455,2.013,2.653,4.425,3.472,7.137c0.823,2.703,1.272,5.697,1.272,8.883c0,3.173-0.453,6.171-1.285,8.891 c-0.831,2.744-2.034,5.189-3.518,7.231c-1.489,2.046-3.277,3.697-5.257,4.841s-4.166,1.768-6.487,1.768 c-2.328,0-4.532-0.624-6.521-1.768c-1.987-1.144-3.768-2.795-5.248-4.841c-1.476-2.042-2.661-4.487-3.46-7.231 c-0.807-2.72-1.23-5.718-1.21-8.891c0.038-3.186,0.512-6.18,1.36-8.883c0.84-2.712,2.063-5.124,3.56-7.137 c1.497-2.004,3.269-3.639,5.248-4.736C238.443,137.058,240.63,136.455,242.93,136.455 M270.464,139.516 c-2.212,0-4.308,0.565-6.213,1.572c-1.908,1.031-3.626,2.503-5.064,4.316c-1.439,1.83-2.604,4.005-3.407,6.421 c-0.803,2.42-1.247,5.094-1.247,7.889c0.004,2.79,0.453,5.451,1.272,7.885c0.819,2.424,1.993,4.641,3.444,6.491 c1.468,1.854,3.197,3.36,5.127,4.399c1.938,1.048,4.059,1.63,6.296,1.63c2.204,0,4.3-0.582,6.213-1.63 c1.905-1.039,3.618-2.553,5.045-4.399c1.435-1.88,2.582-4.084,3.372-6.517c0.795-2.449,1.215-5.14,1.189-7.935 c-0.025-2.782-0.499-5.443-1.322-7.847c-0.823-2.408-2.005-4.574-3.46-6.388c-1.451-1.834-3.169-3.285-5.073-4.316 C274.731,140.081,272.651,139.516,270.464,139.516"></path>
                </svg>`;
            } else if (os.name === "Android") {
                return `<svg class="bg-green-400 fill-white w-8 h-8 p-1.5 rounded-md" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
                    <path display="inline" d="M120.606,169h270.788v220.663c0,13.109-10.628,23.737-23.721,23.737h-27.123v67.203 c0,17.066-13.612,30.897-30.415,30.897c-16.846,0-30.438-13.831-30.438-30.897v-67.203h-47.371v67.203 c0,17.066-13.639,30.897-30.441,30.897c-16.799,0-30.437-13.831-30.437-30.897v-67.203h-27.099 c-13.096,0-23.744-10.628-23.744-23.737V169z M67.541,167.199c-16.974,0-30.723,13.963-30.723,31.2v121.937 c0,17.217,13.749,31.204,30.723,31.204c16.977,0,30.723-13.987,30.723-31.204V198.399 C98.264,181.162,84.518,167.199,67.541,167.199z M391.395,146.764H120.606c3.342-38.578,28.367-71.776,64.392-90.998 l-25.746-37.804c-3.472-5.098-2.162-12.054,2.946-15.525c5.102-3.471,12.044-2.151,15.533,2.943l28.061,41.232 c15.558-5.38,32.446-8.469,50.208-8.469c17.783,0,34.672,3.089,50.229,8.476L334.29,5.395c3.446-5.108,10.41-6.428,15.512-2.957 c5.108,3.471,6.418,10.427,2.946,15.525l-25.725,37.804C363.047,74.977,388.055,108.175,391.395,146.764z M213.865,94.345 c0-8.273-6.699-14.983-14.969-14.983c-8.291,0-14.99,6.71-14.99,14.983c0,8.269,6.721,14.976,14.99,14.976 S213.865,102.614,213.865,94.345z M329.992,94.345c0-8.273-6.722-14.983-14.99-14.983c-8.291,0-14.97,6.71-14.97,14.983 c0,8.269,6.679,14.976,14.97,14.976C323.271,109.321,329.992,102.614,329.992,94.345z M444.48,167.156 c-16.956,0-30.744,13.984-30.744,31.222v121.98c0,17.238,13.788,31.226,30.744,31.226c16.978,0,30.701-13.987,30.701-31.226 v-121.98C475.182,181.14,461.458,167.156,444.48,167.156z"></path>
                </svg>`;
            } else if (os.name === "iOS") {
                return `<svg class="bg-black fill-white w-8 h-8 p-1.5 rounded-md" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
                    <path display="inline" d="M28.346,170.892c-16.568,0-27.846-11.981-27.846-27.837c0-16.218,11.636-27.845,27.846-27.845 c16.917,0,28.186,11.627,28.186,27.845C56.532,159.971,44.555,170.892,28.346,170.892z M54.773,196.62v196.287H2.617V196.62H54.773 z M318.374,254.063c0,94.444-47.928,142.729-115.237,142.729c-71.543,0-112.064-59.916-112.064-138.5 c0-81.058,44.758-140.612,115.583-140.612C281.725,117.679,318.374,181.82,318.374,254.063z M145.695,257.23 c0,53.213,20.797,96.911,59.2,96.911c38.771,0,58.855-43.345,58.855-97.967c0-49.695-18.68-95.858-58.502-95.858 C164.375,160.316,145.695,207.545,145.695,257.23z M356.44,337.582c14.094,8.458,36.649,15.149,58.498,15.149 c28.898,0,44.052-13.744,44.052-33.829c0-19.388-13.037-31.015-42.995-44.052c-40.878-17.62-66.249-42.995-66.249-78.23 c0-44.409,34.881-78.592,93.384-78.592c25.725,0,45.461,5.988,58.148,12.338l-10.925,42.646 c-9.515-4.936-26.082-11.635-48.276-11.635c-27.487,0-39.826,14.804-39.826,29.958c0,19.378,13.395,28.195,46.521,43.349 c43.345,19.379,62.728,44.396,62.728,79.993c0,47.22-35.593,81.753-98.678,81.753c-26.781,0-53.92-7.402-66.599-15.154 L356.44,337.582z"></path>
                </svg>`;
            } else {
                return `<svg class="bg-red-500 text-white w-8 h-8 rounded-md" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" d="M9.5 4.75C8.7574 4.75 8.14227 5.03635 7.7208 5.5105C7.31228 5.97009 7.125 6.56049 7.125 7.125C7.125 8.11777 7.70613 8.80342 8.084 9.24925L8.10422 9.27311C8.55066 9.80024 8.70833 10.0224 8.70833 10.2917C8.70833 10.7289 9.06277 11.0833 9.5 11.0833C9.93723 11.0833 10.2917 10.7289 10.2917 10.2917C10.2917 9.39426 9.73429 8.74298 9.38019 8.32923C9.35663 8.30171 9.33398 8.27524 9.31245 8.24982C8.89774 7.76016 8.70833 7.48237 8.70833 7.125C8.70833 6.89785 8.78494 6.69658 8.9042 6.56241C9.0105 6.44282 9.18705 6.33333 9.5 6.33333C9.81295 6.33333 9.9895 6.44282 10.0958 6.56241C10.2151 6.69658 10.2917 6.89785 10.2917 7.125C10.2917 7.56223 10.6461 7.91667 11.0833 7.91667C11.5206 7.91667 11.875 7.56223 11.875 7.125C11.875 6.56049 11.6877 5.97009 11.2792 5.5105C10.8577 5.03635 10.2426 4.75 9.5 4.75Z"></path>
                    <path fill="currentColor" d="M9.5 11.875C9.06277 11.875 8.70833 12.2294 8.70833 12.6667C8.70833 13.1039 9.06277 13.4583 9.5 13.4583C9.93723 13.4583 10.2917 13.1039 10.2917 12.6667C10.2917 12.2294 9.93723 11.875 9.5 11.875Z"></path>
                </svg>`;
            }
        },
        selectPerpage(value) {
            this.perPage = value;
            this.currentPage = 1;
            this.getEpisodeViews();
        },
        updatePage(page) {
            this.currentPage = page;
            this.getEpisodeViews();
        },
        async getEpisodeViews() {
            this.loading = true;
            try {
                const response = await axiosInstance.post(
                    `admin/course/${this.courseSlug}/episode/${this.episodeSlug}/details`,
                    {
                        data_type: 'views',
                        page: this.currentPage,
                        perPage: this.perPage,
                        sort: this.filters.sort
                    }
                );
                const parser = new UAParser();
                this.views = (response.data.views || []).map(view => {
                    return {
                        ...view,
                        deviceInfo: parser.setUA(view.user_agent).getResult()
                    };
                });
                this.pagination = response.data.pagination || {};
            } catch (error) {
                console.error('Error fetching episode views:', error);
                this.views = [];
                this.pagination = {};
            } finally {
                this.loading = false;
            }
        },
    },
    mounted() {
        this.getEpisodeViews();
    },
}
</script>
<style></style>

