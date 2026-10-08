<script setup>
definePageMeta({
  name: "admin-api-routes",
  middleware: ['auth'],
})
</script>

﻿<template>
    <AdminMasterPage>
        <template #breadcrumb-actions>
            <button @click="refreshData"
                class="flex shrink-0 group h-9 select-none rounded-lg bg-white px-3 text-sm font-semibold leading-8 text-gray-800 shadow-[0_-3px_0_0px_#d4d4d5_inset,0_0_0_1px_#f4f4f8_inset,0_0.5px_0_1.5px_#fff_inset] hover:bg-zinc-100 hover:via-zinc-900 hover:to-zinc-800 active:shadow-[-1px_0px_1px_0px_#e4e4e7_inset,1px_0px_1px_0px_#e4e4e7_inset,0px_0.125rem_1px_0px_#d4d4d8_inset]">
                <span class="block group-active:[transform:translate3d(0,1px,0)]">
                    <span class="flex items-center">
                        بروزرسانی داده‌ها
                        <svg class="w-5 h-5 rtl:ms-1 -mt-0.5" xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" version="1.1">
                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <rect x="0" y="0" width="24" height="24" />
                                <path
                                    d="M12,8 L8,8 C5.790861,8 4,9.790861 4,12 L4,13 C4,14.6568542 5.34314575,16 7,16 L7,18 C4.23857625,18 2,15.7614237 2,13 L2,12 C2,8.6862915 4.6862915,6 8,6 L12,6 L12,4.72799742 C12,4.62015048 12.0348702,4.51519416 12.0994077,4.42878885 C12.264656,4.2075478 12.5779675,4.16215674 12.7992086,4.32740507 L15.656242,6.46136716 C15.6951359,6.49041758 15.7295917,6.52497737 15.7585249,6.56395854 C15.9231063,6.78569617 15.876772,7.09886961 15.6550344,7.263451 L12.798001,9.3840407 C12.7118152,9.44801079 12.607332,9.48254921 12.5,9.48254921 C12.2238576,9.48254921 12,9.25869158 12,8.98254921 L12,8 Z"
                                    fill="currentColor" />
                                <path
                                    d="M12.0583175,16 L16,16 C18.209139,16 20,14.209139 20,12 L20,11 C20,9.34314575 18.6568542,8 17,8 L17,6 C19.7614237,6 22,8.23857625 22,11 L22,12 C22,15.3137085 19.3137085,18 16,18 L12.0583175,18 L12.0583175,18.9825492 C12.0583175,19.2586916 11.8344599,19.4825492 11.5583175,19.4825492 C11.4509855,19.4825492 11.3465023,19.4480108 11.2603165,19.3840407 L8.40328311,17.263451 C8.18154548,17.0988696 8.13521119,16.7856962 8.29979258,16.5639585 C8.32872576,16.5249774 8.36318164,16.4904176 8.40207551,16.4613672 L11.2591089,14.3274051 C11.48035,14.1621567 11.7936615,14.2075478 11.9589099,14.4287888 C12.0234473,14.5151942 12.0583175,14.6201505 12.0583175,14.7279974 L12.0583175,16 Z"
                                    fill="currentColor" opacity="0.3" />
                            </g>
                        </svg>
                    </span>
                </span>
            </button>
        </template>
        <div class="min-w-0">
            <div class="gap-y-2 flex flex-col lg:flex-row lg:items-end lg:justify-between">
                <div class="min-w-[12rem] flex-1 max-w-md">
                    <div class="relative w-full">
                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="text" v-model.trim="search" @input="onSearchInput"
                            class="bg-white text-gray-900 text-xs font-medium rounded-lg focus:ring-0 focus:outline-none block w-full h-8 ps-10 pe-8 p-2.5 dark:bg-gray-600 dark:placeholder-gray-400 dark:text-white"
                            placeholder="جستجو در نام یا مسیر روت..." />
                        <button v-if="search" @click="clearSearch"
                            class="absolute inset-y-0 end-0 flex items-center pe-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div class="mt-4 flex flex-wrap items-center justify-end gap-4">
                <div class="flex items-center gap-2">
                    <div class="w-6 h-1 rounded bg-gray-400 dark:bg-gray-600"></div>
                    <span class="text-xs font-medium text-gray-400 dark:text-gray-500">بدون نام</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-6 h-1 rounded bg-emerald-400 dark:bg-emerald-600"></div>
                    <span class="text-xs font-medium text-gray-400 dark:text-gray-500">نام‌گذاری شده</span>
                </div>
            </div>

            <div id="data-list">
                <div class="overflow-x-auto md:custom-scrollbar pt-4">
                    <table
                        class="min-w-full lg:table-fixed lg:w-full text-sm text-gray-700 dark:text-gray-300 rounded-lg divide-y-4 divide-gray-100 dark:divide-gray-800">
                        <colgroup class="hidden lg:table-column-group">
                            <col />
                            <col class="w-48" />
                            <col class="w-28" />
                            <col class="w-24" />
                            <col class="w-12" />
                        </colgroup>
                        <thead class="bg-amber-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            <tr class="text-xs font-semibold text-start">
                                <th class="px-1 py-3 text-start">نام روت</th>
                                <th class="px-1 py-3 text-start lg:w-48">URI</th>
                                <th class="px-1 py-3 text-start lg:w-28">Method</th>
                                <th class="px-1 py-3 text-start lg:w-24">پرمیشن‌ها</th>
                                <th class="px-1 py-3 text-center lg:w-12">عملیات</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y-4 divide-gray-100 dark:divide-gray-800">
                            <tr v-for="(route, i) in routes" :key="route.name || route.uri + i"
                                class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                                <td class="relative ps-3 pe-1 py-3 text-start min-w-0">
                                    <div class="absolute w-1 h-[60%] start-0 top-[20%] rounded-e-lg"
                                        :class="route.is_named ? 'bg-emerald-400 dark:bg-emerald-600' : 'bg-gray-400 dark:bg-gray-600'">
                                    </div>
                                    <div class="min-w-0" dir="ltr">
                                        <div class="text-xs font-semibold text-gray-900 dark:text-white truncate"
                                            :class="!route.is_named ? 'opacity-60' : ''"
                                            :title="route.name || '—'">
                                            {{ route.name || '—' }}
                                        </div>
                                    </div>
                                </td>
                                <td class="px-1 py-3 text-start min-w-0 lg:w-48">
                                    <div class="text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg truncate font-mono"
                                        dir="ltr" :title="'/' + route.uri">
                                        /{{ route.uri }}
                                    </div>
                                </td>
                                <td class="px-1 py-3 text-start lg:w-28">
                                    <div class="flex flex-wrap gap-1">
                                        <span v-for="method in route.methods" :key="method"
                                            class="text-[10px] font-semibold uppercase text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-1.5 py-0.5 rounded-md">
                                            {{ method }}
                                        </span>
                                    </div>
                                </td>
                                <td class="px-1 py-3 text-start lg:w-24">
                                    <div
                                        class="text-xs font-medium text-gray-800 dark:text-gray-100 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-1 rounded-lg w-max font-anjoman">
                                        {{ route.permissions?.length || 0 }}
                                    </div>
                                </td>
                                <td class="relative px-1 py-3 whitespace-nowrap text-center lg:w-12">
                                    <Popover class="group flex items-center justify-center">
                                        <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-50" />
                                        <PopoverButton
                                            class="text-gray-900 dark:text-white relative group-focus-within:z-30 focus:outline-none flex items-center justify-center p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M8 12C9.10457 12 10 12.8954 10 14C10 15.1046 9.10457 16 8 16C6.89543 16 6 15.1046 6 14C6 12.8954 6.89543 12 8 12Z"
                                                    fill="currentColor" />
                                                <path
                                                    d="M8 6C9.10457 6 10 6.89543 10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6Z"
                                                    fill="currentColor" />
                                                <path
                                                    d="M10 2C10 0.89543 9.10457 0 8 0C6.89543 0 6 0.895431 6 2C6 3.10457 6.89543 4 8 4C9.10457 4 10 3.10457 10 2Z"
                                                    fill="currentColor" />
                                            </svg>
                                        </PopoverButton>
                                        <transition enter-active-class="transition duration-200 ease-out"
                                            enter-from-class="translate-y-1 opacity-0"
                                            enter-to-class="translate-y-0 opacity-100"
                                            leave-active-class="transition duration-150 ease-in"
                                            leave-from-class="translate-y-0 opacity-100"
                                            leave-to-class="translate-y-1 opacity-0">
                                            <PopoverPanel
                                                class="text-start flex flex-col z-30 end-0 absolute p-2 bg-white rounded-lg shadow w-max min-w-[10rem] dark:bg-gray-900">
                                                <ul class="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                                    <li>
                                                        <button type="button" :disabled="!route.is_named"
                                                            @click="openEditModal(route)"
                                                            class="block w-full text-start px-4 py-2 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed">
                                                            ویرایش دسترسی
                                                        </button>
                                                    </li>
                                                </ul>
                                            </PopoverPanel>
                                        </transition>
                                    </Popover>
                                </td>
                            </tr>
                            <tr v-if="!loading && routes.length === 0">
                                <td colspan="5" class="px-4 py-12 text-center">
                                    <div class="text-sm font-medium text-gray-400 dark:text-gray-500">روتی یافت نشد.
                                    </div>
                                </td>
                            </tr>
                            <tr class="h-24"></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="flex lg:flex-row flex-col items-center justify-between gap-4 -mt-20">
                <div>
                    <PaginationComponent v-if="pagination && pagination.last_page > 1" dir="ltr"
                        :pagination="pagination" @updatePage="updatePage" />
                </div>
                <div>
                    <select :value="perPage" @change="selectPerpage(parseInt($event.target.value))"
                        class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none">
                        <option v-for="per in perPages" :key="per" :value="per">{{ per }}</option>
                    </select>
                </div>
            </div>

            <!-- Edit Permissions Bottom Sheet -->
            <BottomSheetDrawer v-model="showEdit" :initialHeight="0.85" :maxHeight="0.95" :minHeight="0.65"
                :fitContent="false"
                :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
                :panelClass="bs.ADMIN_BS_PANEL"
                :contentClass="bs.ADMIN_BS_CONTENT"
                :backdropClass="bs.ADMIN_BS_BACKDROP">
                <AdminBottomSheetHeader
                    title="دسترسی‌های روت"
                    :subtitle="selectedRoute ? `${selectedRoute.name} — /${selectedRoute.uri}` : ''"
                    accent="indigo"
                    @close="closeEditModal">
                    <template #icon>
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                            <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </template>
                </AdminBottomSheetHeader>
                <div class="flex flex-col flex-1 min-h-0 overflow-hidden">
                    <div class="shrink-0 mb-3 rounded-xl border border-indigo-200/60 dark:border-indigo-800/40 bg-indigo-50/30 dark:bg-indigo-900/10 overflow-hidden">
                        <div class="flex items-center justify-between gap-2 px-3 py-2 border-b border-indigo-100/80 dark:border-indigo-800/30">
                            <div class="flex items-center gap-2 min-w-0">
                                <span class="inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-50">
                                    {{ selectedRoutePermissions.length }}
                                </span>
                                <span class="text-[11px] font-semibold text-gray-600 dark:text-gray-300">پرمیشن فعال روی روت</span>
                            </div>
                            <button v-if="selectedRoutePermissions.length" type="button"
                                @click.prevent="removeAllPermissionsFromRoute" :disabled="removeLoading"
                                class="text-[10px] font-semibold text-rose-500 hover:text-rose-600 dark:text-rose-400 disabled:opacity-60">
                                حذف همه
                            </button>
                        </div>
                        <div class="px-3 py-2.5 max-h-24 overflow-y-auto custom-scrollbar">
                            <div v-if="selectedRoutePermissions.length" class="flex flex-wrap gap-1.5">
                                <span v-for="permission in selectedRoutePermissions" :key="permission.id"
                                    class="inline-flex items-center gap-1 rounded-lg px-2 py-1 bg-indigo-100 text-indigo-900 dark:bg-indigo-950/75 dark:text-indigo-50 dark:ring-1 dark:ring-indigo-600/45 text-[10px] font-semibold max-w-full">
                                    <span class="truncate max-w-[10rem]" dir="ltr">{{ permission.name }}</span>
                                    <span v-if="permission.label" class="text-indigo-600/90 dark:text-indigo-200/90 font-normal truncate max-w-[6rem]">{{ permission.label }}</span>
                                    <button type="button" @click.stop.prevent="removeRoutePermission(permission)"
                                        :disabled="deletePermissionLoading"
                                        class="shrink-0 opacity-60 hover:opacity-100 disabled:opacity-40">
                                        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </button>
                                </span>
                            </div>
                            <p v-else class="text-xs text-gray-400 dark:text-gray-500 text-center py-2">پرمیشنی ثبت نشده</p>
                        </div>
                    </div>

                    <AdvancedMultiSelect v-model="permissionsToAdd"
                        layout="panel"
                        panel-accent="indigo"
                        search-placeholder="جستجو برای افزودن پرمیشن..."
                        empty-selection-text="پرمیشن جدید انتخاب کنید — از لیست بالا"
                        :options="availablePermissionsForAdd"
                        :closeOnSelect="false"
                        optionLabel="__display"
                        optionValue="id"
                        :enableSearch="true"
                        :enableSelectAll="true"
                        :enableClearAll="true"
                        class="flex-1 min-h-0" />

                    <AdminBottomSheetActions
                        cancel-label="بستن"
                        submit-label="افزودن انتخاب‌شده‌ها"
                        :loading="addLoading"
                        :disabled="permissionsToAdd.length === 0"
                        @cancel="closeEditModal"
                        @submit="addPermissionsToRoute" />
                </div>
            </BottomSheetDrawer>

            <LoadingComponent v-if="loading" />
        </div>
    </AdminMasterPage>
</template>

<script>
import AdminMasterPage from "@/views/page/admin/layouts/AdminMasterPage.vue";
import LoadingComponent from "@/views/components/LoadingComponent.vue";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import AdminBottomSheetHeader from "@/views/components/admin/bottomSheet/AdminBottomSheetHeader.vue";
import AdminBottomSheetActions from "@/views/components/admin/bottomSheet/AdminBottomSheetActions.vue";
import {
    ADMIN_BS_PANEL,
    ADMIN_BS_CONTENT,
    ADMIN_BS_BACKDROP,
} from "@/views/components/admin/bottomSheet/adminBottomSheetStyles";
import axiosInstance from "@/store/axiosInstance";
import { Popover, PopoverButton, PopoverPanel, PopoverOverlay } from "@headlessui/vue";
import AdvancedMultiSelect from "@/views/components/multiselect/AdvancedMultiSelect.vue";
import PaginationComponent from "@/views/components/home/PaginationComponent.vue";
import debounce from "lodash/debounce";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
    components: {
        AdminMasterPage,
        LoadingComponent,
        BottomSheetDrawer,
        AdminBottomSheetHeader,
        AdminBottomSheetActions,
        Popover,
        PopoverButton,
        PopoverPanel,
        PopoverOverlay,
        AdvancedMultiSelect,
        PaginationComponent,
    },
    data() {
        return {
            bs: {
                ADMIN_BS_PANEL,
                ADMIN_BS_CONTENT,
                ADMIN_BS_BACKDROP,
            },
            routes: [],
            pagination: { current_page: 1, last_page: 1, per_page: 20, total: 0 },
            perPage: 20,
            perPages: [10, 20, 30, 50],
            search: "",
            loading: false,
            showEdit: false,
            selectedRoute: null,
            selectedRoutePermissions: [],
            access: null,
            permissionsToAdd: [],
            addLoading: false,
            removeLoading: false,
            debouncedFetch: null,
            deletePermissionLoading: false,
        };
    },
    computed: {
        availablePermissionsForAdd() {
            const permissions = this.access?.permissions || [];
            const selectedIds = new Set(this.selectedRoutePermissions.map(p => p.id));
            return permissions
                .filter(p => !selectedIds.has(p.id))
                .map(p => ({
                    ...p,
                    __display: p.name + (p.label ? " — " + p.label : ""),
                }));
        },
    },
    methods: {
        toastOptions() {
            return {
                theme: "colored",
                hideProgressBar: false,
                rtl: localStorage.getItem("direction") == "rtl",
                bodyClassName: "font-YekanBakh",
                toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                transition: toast.TRANSITIONS.BOUNCE,
                position: toast.POSITION.BOTTOM_RIGHT,
            };
        },
        refreshData() {
            this.fetchRoutes(this.pagination.current_page || 1);
        },
        onSearchInput() {
            if (!this.debouncedFetch) return;
            this.debouncedFetch();
        },
        clearSearch() {
            this.search = "";
            this.fetchRoutes(1);
        },
        selectPerpage(value) {
            this.perPage = value;
            this.fetchRoutes(1);
        },
        async fetchRoutes(page = 1) {
            this.loading = true;
            try {
                const res = await axiosInstance.get("admin/routes", {
                    params: { page, per_page: this.perPage, q: this.search },
                });
                this.routes = res.data.routes || [];
                this.pagination = res.data.pagination || this.pagination;
            } catch (error) {
                console.error(error);
                toast.error("خطا در دریافت روت‌ها", this.toastOptions());
            } finally {
                this.loading = false;
            }
        },
        updatePage(page) {
            this.fetchRoutes(page);
        },
        async fetchAccess() {
            try {
                const res = await axiosInstance.post("admin/security/access");
                this.access = res.data.access;
            } catch (error) {
                console.error(error);
            }
        },
        openEditModal(route) {
            if (!route.is_named) return;
            this.selectedRoute = route;
            this.selectedRoutePermissions = Array.isArray(route.permissions) ? [...route.permissions] : [];
            this.permissionsToAdd = [];
            this.showEdit = true;
            if (!this.access) this.fetchAccess();
        },
        closeEditModal() {
            this.showEdit = false;
            this.selectedRoute = null;
            this.selectedRoutePermissions = [];
            this.permissionsToAdd = [];
        },
        async addPermissionsToRoute() {
            if (!this.selectedRoute?.name || this.permissionsToAdd.length === 0) return;
            this.addLoading = true;
            const ids = this.permissionsToAdd.map(p => p.id ?? p);
            try {
                const res = await axiosInstance.post("admin/route-permissions/add", {
                    route_name: this.selectedRoute.name,
                    permissions: ids,
                });
                const added = res.data.permissions || [];
                this.selectedRoutePermissions.push(...added);
                this.selectedRoute.permissions = [...this.selectedRoutePermissions];
                this.permissionsToAdd = [];
                toast.success("پرمیشن(ها) با موفقیت به روت افزوده شد.", this.toastOptions());
            } catch (error) {
                console.error(error);
                toast.error("خطا در افزودن پرمیشن", this.toastOptions());
            } finally {
                this.addLoading = false;
            }
        },
        async removeRoutePermission(permission) {
            if (!this.selectedRoute?.name || !permission) return;
            this.deletePermissionLoading = true;
            try {
                await axiosInstance.post("admin/route-permissions/remove", {
                    route_name: this.selectedRoute.name,
                    permission: permission.id,
                });
                this.selectedRoutePermissions = this.selectedRoutePermissions.filter(
                    x => x.id !== permission.id
                );
                this.selectedRoute.permissions = [...this.selectedRoutePermissions];
                toast.success("پرمیشن حذف شد.", this.toastOptions());
            } catch (error) {
                console.error(error);
                toast.error("خطا در حذف پرمیشن", this.toastOptions());
            } finally {
                this.deletePermissionLoading = false;
            }
        },
        async removeAllPermissionsFromRoute() {
            if (!this.selectedRoute?.name || this.selectedRoutePermissions.length === 0) return;
            this.removeLoading = true;
            try {
                await axiosInstance.post("admin/route-permissions/remove-all", {
                    route_name: this.selectedRoute.name,
                });
                this.selectedRoutePermissions = [];
                this.selectedRoute.permissions = [];
                toast.success("تمام پرمیشن‌ها از روت حذف شد.", this.toastOptions());
            } catch (error) {
                console.error(error);
                toast.error("خطا در حذف همه پرمیشن‌ها", this.toastOptions());
            } finally {
                this.removeLoading = false;
            }
        },
    },
    mounted() {
        this.debouncedFetch = debounce(() => this.fetchRoutes(1), 500);
        this.fetchRoutes();
    },
};
</script>
