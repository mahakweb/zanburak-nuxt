<template>
	<AdminMasterPage>
		<template #breadcrumb-actions>
			<router-link :to="{ name: 'admin-user-activity-report' }"
				class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100">
				<span class="flex items-center">گزارش فعالیت</span>
			</router-link>
			<button type="button" @click="refreshData"
				class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100">
				<span class="flex items-center">بروزرسانی</span>
			</button>
			<router-link :to="{ name: 'admin-create-user' }"
				class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100">
				<span class="flex items-center">
					ایجاد کاربر
					<svg class="w-4 h-4 ms-2" viewBox="0 0 24 24" fill="none"><path d="M12.2 12a5.2 5.2 0 100-10.4 5.2 5.2 0 000 10.4zM3 22c.57-1.967 1.748-3.703 3.364-4.96C7.98 15.783 9.953 15.07 12 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M19 22v-8M15 18h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
				</span>
			</router-link>
		</template>

		<div class="min-w-0">
			<!-- Stats -->
			<div v-if="stats" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3 mb-5">
				<AdminReportStatCard title="کل کاربران" :value="formatNumber(stats.total_users)" accent="amber" />
				<AdminReportStatCard title="فعال" :value="formatNumber(stats.active_users)" accent="emerald" />
				<AdminReportStatCard title="غیرفعال" :value="formatNumber(stats.inactive_users)" accent="rose" />
				<AdminReportStatCard title="VIP" :value="formatNumber(stats.vip_users)" accent="violet" />
				<AdminReportStatCard title="مدیر/کارمند" :value="formatNumber(stats.staff_users)" accent="blue" />
				<AdminReportStatCard title="ایمیل تأییدنشده" :value="formatNumber(stats.email_unverified)" accent="rose" subtitle="نیاز به تأیید" />
				<AdminReportStatCard title="امروز" :value="formatNumber(stats.created_today)" accent="cyan" subtitle="عضو جدید" />
				<AdminReportStatCard title="این ماه" :value="formatNumber(stats.created_this_month)" accent="amber" />
			</div>

			<div v-if="stats?.recent_users?.length" class="mb-4 p-3 rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900">
				<h3 class="text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">عضویت‌های اخیر</h3>
				<div class="flex flex-wrap gap-2">
					<router-link v-for="u in stats.recent_users" :key="u.id"
						:to="{ name: 'admin-user-details', params: { username: u.username } }"
						class="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
						<span class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0">
							<img v-if="u.profile_pic" :src="u.profile_pic" class="w-full h-full object-cover" onerror="this.style.display='none'" />
						</span>
						{{ u.first_name }} {{ u.last_name }}
					</router-link>
				</div>
			</div>

			<AdminBulkActionBar :count="selectedIds.length">
				<button v-can="'users.delete'" type="button" @click.prevent="openDeleteUserModal(selectedIds, true)"
					class="h-8 px-3 text-xs font-semibold text-rose-700 bg-rose-100 dark:bg-rose-900/30 rounded-lg hover:bg-rose-200 dark:hover:bg-rose-900/50">
					حذف
				</button>
				<button type="button" @click="selectedIds = []"
					class="h-8 px-3 text-xs font-semibold text-gray-600 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
					لغو انتخاب
				</button>
			</AdminBulkActionBar>

			<AdminListFilterBar
				v-model:search="searchQuery"
				search-placeholder="جستجو نام، ایمیل، نام‌کاربری..."
				@search="debouncedSearch"
				@clear-search="clearSearch"
				@clear-filters="clearFilters"
			>
				<AdminFilterSelect v-model="subscription" label="اشتراک" :options="subscriptionOptions" @change="onFilterChange" />
				<AdminFilterSelect v-model="role" label="نقش" :options="roleOptions" min-width="sm" @change="onFilterChange" />
				<AdminFilterSelect v-model="status" label="وضعیت" :options="statusOptions" min-width="sm" @change="onFilterChange" />
				<AdminFilterSelect v-model="verified" label="تأیید" :options="verifiedOptions" min-width="lg" @change="onFilterChange" />
				<AdminFilterSelect v-model="sort" label="مرتب‌سازی" :options="sortOptions" @change="onFilterChange" />
				<AdminFilterSelect v-model="dataView" label="نمایش" :options="viewOptions" @change="onFilterChange" />
			</AdminListFilterBar>

			<div id="data-list">
				<!-- Grid -->
				<div v-if="dataView === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 pt-4">
					<div v-for="item in items" v-show="!loading" :key="item.id"
						class="rounded-2xl flex flex-col items-center bg-white dark:bg-slate-900 p-4 border border-gray-100 dark:border-gray-800 hover:border-amber-200 dark:hover:border-amber-500/30 transition-colors">
						<div class="w-full flex items-center justify-between mb-2">
							<AdminBulkCheckbox v-model="selectedIds" :value="item.id" />
							<svg v-if="item.subscription === 'vip'" class="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="currentColor"><path d="M11.2 1.4c.4-.53 1.2-.53 1.6 0L15.5 5h4.65c1.15 0 1.72 1.4.91 2.23l-8.36 14.87c-.48.85-1.68.85-2.16 0L2.55 7.23C1.74 6.4 2.31 5 3.46 5H8.1l3.1-3.6z"/></svg>
						</div>
						<router-link :to="{ name: 'admin-user-details', params: { username: item.username } }"
							class="relative w-20 h-20 ring-2 ring-amber-400/80 rounded-full overflow-hidden">
							<img onerror="this.style.display='none'" :src="item.profile_pic" class="w-full h-full object-cover" />
						</router-link>
						<div class="mt-3 text-center min-w-0 w-full px-2">
							<div class="font-semibold text-gray-800 dark:text-gray-50 line-clamp-1">{{ item.first_name }} {{ item.last_name }}</div>
							<div dir="ltr" class="text-xs text-gray-400 line-clamp-1">@{{ item.username }}</div>
						</div>
						<div class="mt-3 flex flex-wrap gap-1 justify-center">
							<span class="text-[10px] font-semibold px-2 py-0.5 rounded-md" :class="statusBadgeClass(item)">{{ statusLabel(item) }}</span>
							<span class="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">{{ roleLabel(item.role) }}</span>
						</div>
					</div>
					<p v-if="!loading && !items.length" class="col-span-full py-12 text-center text-sm text-gray-400">کاربری یافت نشد</p>
				</div>

				<!-- Table -->
				<div v-else class="overflow-x-auto md:custom-scrollbar pt-4">
					<table class="min-w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
						<thead class="bg-amber-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
							<tr class="text-xs font-semibold text-start">
								<th class="px-1 py-3 w-8">
									<AdminBulkCheckbox :checked="isAllSelected" :indeterminate="isIndeterminate" @change="toggleSelectAll" />
								</th>
								<th class="px-1 py-3 text-start lg:min-w-[12rem]">کاربر</th>
								<th class="px-1 py-3 text-start">ایمیل</th>
								<th class="px-1 py-3 text-start">موبایل</th>
								<th class="px-1 py-3 text-start">اشتراک</th>
								<th class="px-1 py-3 text-start">نقش</th>
								<th class="px-1 py-3 text-start">دوره‌ها</th>
								<th class="px-1 py-3 text-start">آخرین بازدید</th>
								<th class="px-1 py-3 text-start">عضویت</th>
								<th class="px-1 py-3 text-center w-12">عملیات</th>
							</tr>
						</thead>
						<tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
							<tr v-for="(item, i) in items" v-show="!loading" :key="item.id"
								class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-amber-50/40 dark:hover:bg-gray-800/60 transition-colors">
								<td class="relative ps-2 pe-2 py-3" @click.stop>
									<div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg"
										:class="item.status === 'active' ? 'bg-emerald-400 dark:bg-emerald-600' : 'bg-gray-400 dark:bg-gray-600'"></div>
									<AdminBulkCheckbox v-model="selectedIds" :value="item.id" />
								</td>
								<td class="px-1 py-3 text-start">
									<router-link :to="{ name: 'admin-user-details', params: { username: item.username } }"
										class="flex items-center gap-2 min-w-0 group">
										<div class="shrink-0 w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700 overflow-hidden">
											<img onerror="this.style.display='none'" :src="item.profile_pic" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
										</div>
										<div class="min-w-0">
											<div class="text-xs font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-amber-600">{{ item.first_name }} {{ item.last_name }}</div>
											<div class="text-[11px] text-gray-500 line-clamp-1">@{{ item.username }}</div>
										</div>
									</router-link>
								</td>
								<td class="px-1 py-3 text-start">
									<div class="flex items-center gap-1.5 min-w-0 max-w-[11rem]">
										<span dir="ltr" class="text-[11px] font-medium text-gray-800 dark:text-gray-100 truncate flex-1" :title="item.email">{{ shortenEmail(item.email) }}</span>
										<span class="shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-full"
											:class="item.email_verified ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400'"
											:title="item.email_verified ? 'ایمیل تأیید شده' : 'ایمیل تأیید نشده'">
											<svg v-if="item.email_verified" class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
											<svg v-else class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
										</span>
									</div>
								</td>
								<td class="px-1 py-3 text-start whitespace-nowrap">
									<div v-if="item.mobile" class="flex items-center gap-1.5">
										<span dir="ltr" class="text-[11px] text-gray-700 dark:text-gray-200">{{ item.mobile }}</span>
										<span class="shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-full"
											:class="item.mobile_verified ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'"
											:title="item.mobile_verified ? 'موبایل تأیید شده' : 'موبایل تأیید نشده'">
											<svg v-if="item.mobile_verified" class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
											<svg v-else class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/></svg>
										</span>
									</div>
									<span v-else class="text-[11px] text-gray-400">—</span>
								</td>
								<td class="px-1 py-3 whitespace-nowrap">
									<Popover v-if="item.subscription === 'vip'" class="group relative">
										<PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-50" />
										<PopoverButton class="text-xs font-semibold px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
											VIP
										</PopoverButton>
										<transition enter-active-class="transition duration-200 ease-out" enter-from-class="translate-y-1 opacity-0" enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-1 opacity-0">
											<PopoverPanel v-if="item.active_plan?.pivot?.expired_at"
												class="z-30 top-8 start-0 absolute p-2 bg-white dark:bg-gray-900 rounded-lg shadow text-[11px] whitespace-nowrap">
												تا {{ formatDateTime(item.active_plan.pivot.expired_at) }}
											</PopoverPanel>
										</transition>
									</Popover>
									<span v-else class="text-[11px] text-gray-400">عادی</span>
								</td>
								<td class="px-1 py-3 whitespace-nowrap">
									<span class="text-xs font-medium px-2 py-1 rounded-lg bg-gray-100/70 dark:bg-gray-800/50">{{ roleLabel(item.role) }}</span>
								</td>
								<td class="px-1 py-3 whitespace-nowrap">
									<span class="text-xs font-anjoman font-semibold px-2 py-1 rounded-lg bg-gray-100/70 dark:bg-gray-800/50">{{ item.courses_count || 0 }}</span>
								</td>
								<td class="px-1 py-3 whitespace-nowrap text-[11px] text-gray-500">{{ formatRelative(item.last_seen) }}</td>
								<td class="px-1 py-3 whitespace-nowrap text-[11px] text-gray-500">{{ formatDate(item.created_at) }}</td>
								<td class="px-1 py-3 text-center" @click.stop>
									<Popover class="group relative flex items-center justify-center">
										<PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-50" />
										<PopoverButton class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
											<svg class="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><path d="M8 12a2 2 0 100 4 2 2 0 000-4zM8 6a2 2 0 100 4 2 2 0 000-4zM8 0a2 2 0 100 4 2 2 0 000-4z"/></svg>
										</PopoverButton>
										<transition enter-active-class="transition duration-200 ease-out" enter-from-class="translate-y-1 opacity-0" enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-1 opacity-0">
											<PopoverPanel :class="i + 1 === items.length && items.length > 1 ? 'bottom-1' : ''"
												class="text-start z-30 end-10 absolute p-2 bg-white dark:bg-gray-900 rounded-lg shadow w-max min-w-[8rem]">
												<ul class="text-xs font-semibold text-gray-700 dark:text-gray-200">
													<li><router-link :to="{ name: 'admin-user-details', params: { username: item.username } }" class="block px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">مشخصات</router-link></li>
													<li><router-link :to="{ name: 'admin-user-details', params: { username: item.username }, query: { section: 'security' } }" class="block px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">دسترسی‌ها</router-link></li>
													<li><router-link :to="{ name: 'admin-user-details', params: { username: item.username }, query: { editInfo: true } }" class="block px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">ویرایش</router-link></li>
													<li v-can="'users.delete'">
														<button type="button" @click="openDeleteUserModal(item.id)" class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-rose-500">حذف</button>
													</li>
												</ul>
											</PopoverPanel>
										</transition>
									</Popover>
								</td>
							</tr>
							<tr v-if="!loading && !items.length">
								<td colspan="10" class="px-4 py-12 text-center text-sm text-gray-400">کاربری یافت نشد</td>
							</tr>
							<tr class="h-20"></tr>
						</tbody>
					</table>
				</div>
			</div>

			<div class="flex lg:flex-row flex-col items-center justify-between gap-4" :class="dataView === 'list' ? '-mt-16' : 'mt-4'">
				<PaginationComponent v-if="pagination && pagination.last_page > 1" dir="ltr" :pagination="pagination" @updatePage="updatePage" />
				<select :value="perPage" @change="selectPerpage(parseInt($event.target.value))"
					class="h-8 px-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
					<option v-for="per in perPages" :key="per" :value="per">{{ per }}</option>
				</select>
			</div>
		</div>

		<AdminDeleteUserModal v-model="showDeleteUserModal" :user-ids="usersIdForDelete" @deleted="onUsersDeleted" />
		<LoadingComponent v-if="loading" />
	</AdminMasterPage>
</template>

<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import AdminDeleteUserModal from "@/views/components/admin/AdminDeleteUserModal.vue";
import AdminBulkCheckbox from "@/views/components/admin/AdminBulkCheckbox.vue";
import AdminBulkActionBar from "@/views/components/admin/AdminBulkActionBar.vue";
import AdminReportStatCard from "@/views/components/admin/report/AdminReportStatCard.vue";
import { Popover, PopoverButton, PopoverPanel, PopoverOverlay } from "@headlessui/vue";
import axiosInstance from "@/store/axiosInstance";
import debounce from "lodash/debounce";
import AdminListFilterBar from "@/views/components/admin/AdminListFilterBar.vue";
import AdminFilterSelect from "@/views/components/admin/AdminFilterSelect.vue";

export default {
	name: "AdminUsers",
	components: {
		AdminMasterPage,
		LoadingComponent,
		PaginationComponent,
		AdminDeleteUserModal,
		AdminBulkCheckbox,
		AdminBulkActionBar,
		AdminReportStatCard,
		AdminListFilterBar,
		AdminFilterSelect,
		Popover,
		PopoverButton,
		PopoverPanel,
		PopoverOverlay,
	},
	data() {
		const urlParams = new URLSearchParams(window.location.search);
		return {
			loading: false,
			stats: null,
			items: [],
			selectedIds: [],
			pagination: {},
			currentPage: parseInt(urlParams.get("page") || "1", 10) || 1,
			perPage: 10,
			perPages: [10, 20, 30, 50, 100],
			searchQuery: urlParams.get("search") || "",
			subscription: urlParams.get("subscription") || "all",
			role: urlParams.get("role") || "all",
			status: urlParams.get("status") || "all",
			verified: urlParams.get("verified") || "all",
			sort: urlParams.get("sort") || "newest",
			dataView: urlParams.get("dataView") || "list",
			showDeleteUserModal: false,
			usersIdForDelete: null,
			mounted: false,
		};
	},
	computed: {
		subscriptionOptions() {
			return [
				{ value: "all", label: "همه" },
				{ value: "vip", label: "دارای اشتراک" },
				{ value: "normal", label: "بدون اشتراک" },
			];
		},
		roleOptions() {
			return [
				{ value: "all", label: "همه" },
				{ value: "superuser", label: "مدیرکل" },
				{ value: "administrator", label: "مدیر" },
				{ value: "user", label: "کاربر" },
			];
		},
		statusOptions() {
			return [
				{ value: "all", label: "همه" },
				{ value: "active", label: "فعال" },
				{ value: "inactive", label: "غیرفعال" },
			];
		},
		verifiedOptions() {
			return [
				{ value: "all", label: "همه" },
				{ value: "email_verified", label: "ایمیل تأییدشده" },
				{ value: "email_unverified", label: "ایمیل تأییدنشده" },
				{ value: "mobile_verified", label: "موبایل تأییدشده" },
			];
		},
		sortOptions() {
			return [
				{ value: "newest", label: "جدیدترین" },
				{ value: "oldest", label: "قدیمی‌ترین" },
				{ value: "last_seen", label: "آخرین بازدید" },
				{ value: "name", label: "نام" },
			];
		},
		viewOptions() {
			return [
				{ value: "list", label: "لیست" },
				{ value: "grid", label: "شبکه‌ای" },
			];
		},
		isAllSelected() {
			return this.items.length > 0 && this.selectedIds.length === this.items.length;
		},
		isIndeterminate() {
			return this.selectedIds.length > 0 && !this.isAllSelected;
		},
	},
	created() {
		this.debouncedSearch = debounce(() => {
			this.currentPage = 1;
			this.updateUrlAndFetch();
		}, 400);
	},
	mounted() {
		document.title = "لیست کاربران";
		this.fetchStats();
		this.getData();
	},
	methods: {
		formatNumber(v) {
			return Number(v || 0).toLocaleString("fa-IR");
		},
		refreshData() {
			this.fetchStats();
			this.getData();
		},
		async fetchStats() {
			try {
				const res = await axiosInstance.get("/admin/users/stats");
				this.stats = res.data.stats;
			} catch (e) {
				console.error(e);
			}
		},
		onFilterChange() {
			this.currentPage = 1;
			this.updateUrlAndFetch();
		},
		clearSearch() {
			this.searchQuery = "";
			this.currentPage = 1;
			this.updateUrlAndFetch();
		},
		clearFilters() {
			this.searchQuery = "";
			this.subscription = "all";
			this.role = "all";
			this.status = "all";
			this.verified = "all";
			this.sort = "newest";
			this.dataView = "list";
			this.currentPage = 1;
			this.updateUrlAndFetch();
		},
		updatePage(page) {
			this.currentPage = page;
			this.updateUrlAndFetch();
		},
		selectPerpage(value) {
			this.perPage = value;
			this.currentPage = 1;
			this.updateUrlAndFetch();
		},
		updateUrlAndFetch() {
			const query = {};
			if (this.subscription !== "all") query.subscription = this.subscription;
			if (this.role !== "all") query.role = this.role;
			if (this.status !== "all") query.status = this.status;
			if (this.verified !== "all") query.verified = this.verified;
			if (this.sort !== "newest") query.sort = this.sort;
			if (this.dataView !== "list") query.dataView = this.dataView;
			if (this.searchQuery.trim()) query.search = this.searchQuery.trim();
			if (this.currentPage > 1) query.page = this.currentPage;

			const qs = new URLSearchParams(query).toString();
			window.history.pushState(null, "", qs ? `${window.location.pathname}?${qs}` : window.location.pathname);
			this.getData();
		},
		async getData() {
			this.loading = true;
			const params = {
				page: this.currentPage,
				perPage: this.perPage,
				subscription: this.subscription !== "all" ? this.subscription : undefined,
				role: this.role !== "all" ? this.role : undefined,
				status: this.status !== "all" ? this.status : undefined,
				verified: this.verified !== "all" ? this.verified : undefined,
				sort: this.sort,
				search: this.searchQuery.trim() || undefined,
			};
			Object.keys(params).forEach((k) => params[k] === undefined && delete params[k]);

			try {
				const res = await axiosInstance.post("/admin/users", params);
				this.items = res.data.users || [];
				this.pagination = res.data.pagination || {};
				this.currentPage = res.data.pagination?.current_page || 1;
				this.selectedIds = [];
				if (this.mounted) {
					setTimeout(() => document.getElementById("data-list")?.scrollIntoView({ behavior: "smooth" }), 200);
				}
			} catch (e) {
				console.error(e);
			} finally {
				this.loading = false;
				this.mounted = true;
			}
		},
		toggleSelectAll(event) {
			this.selectedIds = event.target.checked ? this.items.map((i) => i.id) : [];
		},
		openDeleteUserModal(value) {
			this.usersIdForDelete = value;
			this.showDeleteUserModal = true;
		},
		onUsersDeleted({ deletedIds }) {
			const ids = deletedIds || [];
			this.items = this.items.filter((i) => !ids.includes(i.id));
			this.selectedIds = this.selectedIds.filter((id) => !ids.includes(id));
			this.usersIdForDelete = null;
			this.showDeleteUserModal = false;
			this.fetchStats();
			this.getData();
		},
		shortenEmail(email, maxLength = 28) {
			if (!email) return "—";
			return email.length <= maxLength ? email : `${email.slice(0, 12)}…${email.slice(-8)}`;
		},
		roleLabel(role) {
			return { superuser: "مدیرکل", staff: "مدیر", user: "کاربر" }[role] || role;
		},
		statusLabel(item) {
			return item.status === "active" ? "فعال" : "غیرفعال";
		},
		statusBadgeClass(item) {
			return item.status === "active"
				? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
				: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
		},
		formatDate(date) {
			if (!date) return "—";
			return new Date(date).toLocaleDateString("fa-IR", { year: "numeric", month: "short", day: "2-digit" });
		},
		formatDateTime(date) {
			if (!date) return "—";
			return new Date(date).toLocaleString("fa-IR", { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" })
				.replace("بعدازظهر", "ب.ظ").replace("قبل‌ازظهر", "ق.ظ");
		},
		formatRelative(date) {
			if (!date) return "—";
			const diff = Date.now() - new Date(date).getTime();
			const mins = Math.floor(diff / 60000);
			if (mins < 1) return "همین الان";
			if (mins < 60) return `${mins.toLocaleString("fa-IR")} دقیقه پیش`;
			const hours = Math.floor(mins / 60);
			if (hours < 24) return `${hours.toLocaleString("fa-IR")} ساعت پیش`;
			const days = Math.floor(hours / 24);
			if (days < 30) return `${days.toLocaleString("fa-IR")} روز پیش`;
			return this.formatDate(date);
		},
	},
};
</script>
