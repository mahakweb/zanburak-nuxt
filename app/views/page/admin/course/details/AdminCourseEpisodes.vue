<template>
    <AdminInlineLoading v-if="loading" />
    <div v-else-if="course" class="space-y-4 pb-20">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            <AdminReportStatCard class="section-stat-card" title="کل فصل‌ها" :value="formatNumber(course.sections?.length || 0)" accent="amber">
                <template #icon>
                    <svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                        <path d="M4 6h16M4 12h10M4 18h6"/>
                    </svg>
                </template>
            </AdminReportStatCard>
            <AdminReportStatCard class="section-stat-card" title="کل جلسات" :value="formatNumber(totalEpisodes)" accent="blue">
                <template #icon>
                    <svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                        <polygon points="8,5 19,12 8,19" fill="currentColor" stroke="none"/><rect x="4" y="5" width="3" height="14" rx="0.5" fill="currentColor" stroke="none"/>
                    </svg>
                </template>
            </AdminReportStatCard>
            <AdminReportStatCard class="section-stat-card" title="فصل فعال" :value="formatNumber(publishedSectionCount)" accent="emerald" subtitle="منتشر شده">
                <template #icon>
                    <svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                        <path d="M3 14C3 9.02944 7.02944 5 12 5C16.9706 5 21 9.02944 21 14M17 14C17 16.7614 14.7614 19 12 19C9.23858 19 7 16.7614 7 14C7 11.2386 9.23858 9 12 9C14.7614 9 17 11.2386 17 14Z"/>
                    </svg>
                </template>
            </AdminReportStatCard>
            <AdminReportStatCard class="section-stat-card" title="میانگین جلسه" :value="formatNumber(avgEpisodesPerSection)" accent="violet" subtitle="به ازای هر فصل">
                <template #icon>
                    <svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                        <path d="M18 20V10M12 20V4M6 20v-6"/>
                    </svg>
                </template>
            </AdminReportStatCard>
        </div>

        <AdminTabPanelToolbar>
            <template #leading>
                <span class="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    <span class="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                    {{ formatNumber(course.sections?.length || 0) }} فصل · {{ formatNumber(totalEpisodes) }} جلسه
                </span>
            </template>
            <template #actions>
            <button
                type="button"
                @click.prevent="openCreateSectionModal"
                class="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 sm:py-2 text-xs font-bold bg-yellow-400 text-gray-900 hover:bg-yellow-300 shadow-sm transition"
            >
                افزودن فصل جدید
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.03 3.344A9 9 0 0114.97 3.344 9 9 0 0120.656 9.03a9 9 0 01-3.344 5.94 9 9 0 01-5.94 3.344A9 9 0 013.344 14.97 9 9 0 013.344 9.03 9 9 0 019.03 3.344zm3.57 6.263a.6.6 0 00-.6.6V11.4H9.607a.6.6 0 000 1.2H11.4v1.786a.6.6 0 001.2 0V12.6h1.793a.6.6 0 000-1.2H12.6V9.607a.6.6 0 00-.6-.6z" fill="currentColor"/></svg>
            </button>
            </template>
        </AdminTabPanelToolbar>

        <div v-if="course.sections.length > 0" class="course-sections-layout">
            <div
                v-for="(column, colIndex) in masonryLayout"
                :key="'section-col-' + colIndex"
                class="course-sections-column"
            >
            <div v-for="{ section } in column" :key="section.id" class="course-section-card">
                <AdminCourseSectionBlock
                    :section="section"
                    :course="course"
                    :section-number="displaySectionNumber(section)"
                    :get-payload="(index) => getChildPayload(section, index)"
                    @drop="(dropResult) => onDrop(section, dropResult)"
                    @delete-section="openDeleteSectionModal"
                    @edit-section="openEditSectionModal"
                    @delete-episode="openDeleteEpisodeModal"
                />
            </div>
            </div>
        </div>
        <AdminEmptyState v-else message="هنوز فصلی برای این دوره ایجاد نشده است">
            <button
                type="button"
                class="mt-4 w-full sm:w-auto inline-flex h-10 px-5 items-center justify-center gap-2 rounded-xl bg-yellow-400 text-sm font-bold text-gray-900 hover:bg-yellow-300 shadow-sm transition"
                @click.prevent="openCreateSectionModal"
            >
                افزودن اولین فصل
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.03 3.344A9 9 0 0114.97 3.344 9 9 0 0120.656 9.03a9 9 0 01-3.344 5.94 9 9 0 01-5.94 3.344A9 9 0 013.344 14.97 9 9 0 013.344 9.03 9 9 0 019.03 3.344zm3.57 6.263a.6.6 0 00-.6.6V11.4H9.607a.6.6 0 000 1.2H11.4v1.786a.6.6 0 001.2 0V12.6h1.793a.6.6 0 000-1.2H12.6V9.607a.6.6 0 00-.6-.6z" fill="currentColor"/></svg>
            </button>
        </AdminEmptyState>
    </div>

    <BottomSheetDrawer v-model="showSectionModal" :initialHeight="0.7" :maxHeight="0.95" :minHeight="0.6"
        :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
        :panelClass="bs.ADMIN_BS_PANEL"
        :contentClass="bs.ADMIN_BS_CONTENT"
        :backdropClass="bs.ADMIN_BS_BACKDROP">
        <AdminBottomSheetHeader
            :title="mode === 'create' ? 'ایجاد فصل جدید' : `ویرایش فصل: ${form.title}`"
            subtitle="اطلاعات فصل را تکمیل کنید"
            @close="closeSectionModal"
        />
        <div :class="bs.ADMIN_BS_SCROLL">
        <div :class="bs.ADMIN_BS_FORM_BODY">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                                <div>
                                    <label for="title" :class="bs.ADMIN_BS_FORM_LABEL">عنوان فارسی فصل</label>
                                    <input type="text" id="title" v-model="form.title"
                                        :class="[bs.ADMIN_BS_INPUT, errors && errors.title ? bs.ADMIN_BS_INPUT_ERROR : '']"
                                        placeholder="" required />
                                    <span v-if="errors && errors.title" class="mt-1 text-rose-500 text-xs font-medium">
                                        {{ errors.title[0] }}
                                    </span>
                                </div>

                                <div>
                                    <label for="english_title"
                                        class="block mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">عنوان
                                        انگلیسی فصل</label>
                                    <input type="text" id="english_title" v-model="form.english_title"
                                        @input="filterInputEnglishTitle"
                                        class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
                                        :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.english_title }"
                                        placeholder="" required />
                                    <span v-if="errors && errors.english_title"
                                        class="mt-1 text-rose-500 text-xs font-medium">
                                        {{ errors.english_title[0] }}
                                    </span>
                                    <p class="text-xs text-gray-400 mt-1">این فیلد برای ساخت آدرس (slug) فصل استفاده
                                        می‌شود.</p>
                                </div>

                                <div>
                                    <label for="publish"
                                        class="block mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">وضعیت
                                        انتشار</label>
                                    <ul class="h-10 grid w-full gap-3 grid-cols-2 p-1 rounded-lg bg-gray-100 dark:bg-gray-700"
                                        :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.publish }">
                                        <li>
                                            <input v-model="form.publish" type="radio" id="publish-0" name="publish"
                                                value="0" checked class="hidden peer" required />
                                            <label for="publish-0"
                                                class="h-full inline-flex items-center justify-between w-full p-1.5 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">
                                                <div class="block text-xs font-semibold text-center w-full">
                                                    پیش‌نویس
                                                </div>
                                            </label>
                                        </li>
                                        <li>
                                            <input v-model="form.publish" type="radio" id="publish-1" name="publish"
                                                value="1" class="hidden peer">
                                            <label for="publish-1"
                                                class="h-full inline-flex items-center justify-between w-full p-1.5 text-gray-700 dark:text-gray-200 rounded-lg cursor-pointer peer-checked:text-black peer-checked:bg-yellow-400">
                                                <div class="block text-xs font-semibold text-center w-full">
                                                    منتشر شده
                                                </div>
                                            </label>
                                        </li>
                                    </ul>
                                    <span v-if="errors && errors.publish"
                                        class="mt-1 text-rose-500 text-xs font-medium">
                                        {{ errors.publish[0] }}
                                    </span>
                                    <p class="text-xs text-gray-400 mt-1">اگر در حالت "منتشر شده" باشد، فصل برای عموم
                                        قابل
                                        مشاهده خواهد بود.</p>
                                </div>

                                <div></div>

                                <div>
                                    <label for="start_date"
                                        class="block mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">تاریخ
                                        شروع</label>
                                    <input type="datetime-local" id="start_date" v-model="form.start_date"
                                        class="text-center bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:text-white"
                                        :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.start_date }" />
                                    <span v-if="errors && errors.start_date"
                                        class="mt-1 text-rose-500 text-xs font-medium">
                                        {{ errors.start_date[0] }}
                                    </span>
                                    <p class="text-xs text-gray-400 mt-1">برای مدیریت طول فصل، تاریخ پایان را نیز مشخص
                                        کنید.</p>
                                </div>

                                <div>
                                    <label for="end_date"
                                        class="block mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">تاریخ
                                        پایان</label>
                                    <input type="datetime-local" id="end_date" v-model="form.end_date"
                                        class="text-center bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:text-white"
                                        :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.end_date }" />
                                    <span v-if="errors && errors.end_date"
                                        class="mt-1 text-rose-500 text-xs font-medium">
                                        {{ errors.end_date[0] }}
                                    </span>
                                </div>

                                <div class="md:col-span-2">
                                    <label for="short_description"
                                        class="block mb-1 text-xs font-medium text-gray-900 dark:text-gray-300">توضیحات</label>
                                    <textarea id="short_description" rows="5" v-model="form.description"
                                        class="bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"
                                        :class="{ 'text-rose-500 dark:text-rose-500 ring-2 ring-rose-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900': errors && errors.description }"
                                        placeholder=""></textarea>
                                    <span v-if="errors && errors.description"
                                        class="mt-1 text-rose-500 text-xs font-medium">
                                        {{ errors.description[0] }}
                                    </span>
                                    <p class="text-xs text-gray-400 mt-1">توضیح مختصر در ۲-۳ جمله که فصل را معرفی
                                        می‌کند.
                                    </p>
                                </div>
                            </div>
        </div>
        </div>
        <AdminBottomSheetActions
            cancel-label="انصراف"
            :submit-label="mode === 'create' ? 'ثبت و ایجاد' : 'ذخیره تغییرات'"
            :loading="submitLoading"
            @cancel="closeSectionModal"
            @submit="sectionSubmit"
        />
    </BottomSheetDrawer>

    <BottomSheetDrawer v-model="showDeleteSectionModal" :initialHeight="0.4" :maxHeight="0.6" :minHeight="0.4"
        :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
        :panelClass="bs.ADMIN_BS_PANEL_SM"
        :contentClass="bs.ADMIN_BS_CONTENT"
        :backdropClass="bs.ADMIN_BS_BACKDROP">
        <AdminBottomSheetConfirm
            variant="danger"
            message="از حذف این فصل اطمینان دارید؟"
            description="تمام جلسات این فصل نیز حذف خواهند شد."
            cancel-label="انصراف"
            confirm-label="بله، حذف شود"
            :loading="deleteSectionLoading"
            @cancel="closeDeleteSectionModal"
            @confirm="deleteSection"
        />
    </BottomSheetDrawer>

    <BottomSheetDrawer v-model="showDeleteEpisodeModal" :initialHeight="0.4" :maxHeight="0.6" :minHeight="0.4"
        :autoCloseOnMin="true" :closeOnBackdrop="true" :lockScroll="true"
        :panelClass="bs.ADMIN_BS_PANEL_SM"
        :contentClass="bs.ADMIN_BS_CONTENT"
        :backdropClass="bs.ADMIN_BS_BACKDROP">
        <AdminBottomSheetConfirm
            variant="danger"
            message="از حذف این جلسه اطمینان دارید؟"
            description="تمام اطلاعات مرتبط با این جلسه نیز حذف خواهند شد."
            cancel-label="انصراف"
            confirm-label="بله، حذف شود"
            :loading="deleteEpisodeLoading"
            @cancel="closeDeleteEpisodeModal"
            @confirm="deleteEpisode"
        />
    </BottomSheetDrawer>

</template>

<script>
import axiosInstance from "@/store/axiosInstance";
import debounce from "lodash/debounce";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import AdminInlineLoading from "@/views/components/admin/AdminInlineLoading.vue";
import AdminTabPanelToolbar from "@/views/components/admin/AdminTabPanelToolbar.vue";
import AdminEmptyState from "@/views/components/admin/AdminEmptyState.vue";
import AdminCourseSectionBlock from "@/views/page/admin/course/details/AdminCourseSectionBlock.vue";
import AdminReportStatCard from "@/views/components/admin/report/AdminReportStatCard.vue";
import AdminBottomSheetHeader from "@/views/components/admin/bottomSheet/AdminBottomSheetHeader.vue";
import AdminBottomSheetActions from "@/views/components/admin/bottomSheet/AdminBottomSheetActions.vue";
import AdminBottomSheetConfirm from "@/views/components/admin/bottomSheet/AdminBottomSheetConfirm.vue";
import * as bs from "@/views/components/admin/bottomSheet/adminBottomSheetStyles.js";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
    components: {
        BottomSheetDrawer,
        AdminTabPanelToolbar,
        AdminInlineLoading,
        AdminEmptyState,
        AdminCourseSectionBlock,
        AdminReportStatCard,
        AdminBottomSheetHeader,
        AdminBottomSheetActions,
        AdminBottomSheetConfirm,
    },
    props: {
        courseSlug: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            bs,
            errors: null,
            course: null,
            loading: false,
            deleteSectionLoading: false,
            showDeleteSectionModal: false,
            sectionForDelete: null,
            showSectionModal: this.$route.query.createSection && this.$route.query.createSection === 'true' ? true : false,
            formSectionLoading: false,
            submitLoading: false,

            mode: 'create', // create or edit
            form: {
                title: '',
                english_title: '',
                status: '',
                publish: false,
                start_date: '',
                end_date: '',
                description: '',
            },
            // Episode delete
            deleteEpisodeLoading: false,
            showDeleteEpisodeModal: false,
            episodeForDelete: null,
            sectionForDeleteEpisode: null,
            viewportWidth: typeof window !== 'undefined' ? window.innerWidth : 1280,
        };
    },
    computed: {
        totalEpisodes() {
            if (!this.course?.sections) return 0;
            return this.course.sections.reduce((sum, section) => sum + (section.episodes?.length || 0), 0);
        },
        masonryLayout() {
            const sections = this.course?.sections || [];
            const items = sections.map((section, sectionIndex) => ({ section, sectionIndex }));
            if (!items.length) return [];

            if (this.viewportWidth < 1024) {
                return [items];
            }

            const columns = [[], []];
            const heights = [0, 0];
            items.forEach((item) => {
                const estimated = this.estimateSectionHeight(item.section);
                const colIndex = heights[0] <= heights[1] ? 0 : 1;
                columns[colIndex].push(item);
                heights[colIndex] += estimated;
            });
            return columns;
        },
        sectionOrderMap() {
            const map = {};
            (this.course?.sections || []).forEach((section, index) => {
                map[section.id] = index + 1;
            });
            return map;
        },
        publishedSectionCount() {
            return (this.course?.sections || []).filter(s => s.publish).length;
        },
        avgEpisodesPerSection() {
            const count = this.course?.sections?.length || 0;
            if (!count) return 0;
            return Math.round((this.totalEpisodes / count) * 10) / 10;
        },
    },
    methods: {
        formatNumber(v) {
            return Number(v || 0).toLocaleString('fa-IR');
        },
        displaySectionNumber(section) {
            const n = this.sectionOrderMap[section.id] ?? 1;
            return n.toLocaleString('fa-IR');
        },
        estimateSectionHeight(section) {
            const header = 112;
            const episodeRow = 78;
            const emptyState = 56;
            const count = section.episodes?.length || 0;
            if (!count) return header + emptyState;
            return header + count * episodeRow + 12;
        },
        async getCourseEpisodes() {
            this.loading = true;
            try {
                const response = await axiosInstance.post(
                    `admin/course/${this.courseSlug}/episodes`
                );
                this.course = response.data.course;
            } catch (error) {
                console.error(error.response?.data?.errors || error);
            } finally {
                this.loading = false;
            }
        },

        getChildPayload(section, index) {
            return { ...section.episodes[index], section_id: section.id };
        },

        applyDrag(arr, dragResult) {
            const { removedIndex, addedIndex, payload } = dragResult;
            if (removedIndex === null && addedIndex === null) return arr;

            const result = [...arr];
            let itemToAdd = payload;

            if (removedIndex !== null) {
                itemToAdd = result.splice(removedIndex, 1)[0];
            }
            if (addedIndex !== null) {
                result.splice(addedIndex, 0, itemToAdd);
            }
            return result;
        },

        onDrop(targetSection, dropResult) {
            if (!dropResult) return;

            targetSection.episodes = this.applyDrag(
                targetSection.episodes || [],
                dropResult
            );

            const movedEpisode = dropResult.payload;

            if (movedEpisode.section_id !== targetSection.id) {
                movedEpisode.section_id = targetSection.id;
            }

            const allEpisodes = [];
            this.course.sections.forEach((section) => {
                section.episodes.forEach((ep) => {
                    ep.section_id = section.id;
                    allEpisodes.push(ep);
                });
            });

            allEpisodes.forEach((ep, idx) => {
                ep.order = idx + 1;
            });


            this.course.sections.forEach((section) => {
                section.episodes = allEpisodes.filter(
                    (ep) => ep.section_id === section.id
                );
            });

            this.reorderEpisodes(allEpisodes)

        },

        reorderEpisodes: debounce(function (episodesList) {
            axiosInstance
                .post(`admin/course/${this.courseSlug}/episodes/reorder`, {
                    episodes: episodesList.map((ep) => ({
                        id: ep.id,
                        section_id: ep.section_id,
                        order: ep.order,
                    })),
                })
                .then(() => {
                    toast.success('شماره جلسات با موفقیت مرتب شد.', {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                })
                .catch((err) => console.error("❌ API Error:", err))
                .finally(() => { });
        }, 1000),

        openDeleteSectionModal(section) {
            this.sectionForDelete = section;
            this.showDeleteSectionModal = true;
        },
        closeDeleteSectionModal() {
            this.sectionForDelete = null;
            this.showDeleteSectionModal = false;
        },

        async deleteSection() {
            this.deleteSectionLoading = true;
            await axiosInstance.delete(
                `admin/course/${this.courseSlug}/section/${this.sectionForDelete.id}/delete`)
                .then(() => {
                    this.course.sections = this.course.sections.filter(section => section.id != this.sectionForDelete.id)
                    toast.success("فصل مورد نظر با موفقیت حذف شد.", {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                    this.closeDeleteSectionModal();
                }).catch((error) => {
                    this.errors = error.response.data.errors;
                    console.error(error.response?.data?.errors || error)
                    toast.error("خطا! لطفا دوباره تلاش کنید.", {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                }).finally(() => {
                    this.deleteSectionLoading = false;
                })
        },

        openCreateSectionModal() {
            this.mode = 'create';
            this.resetSectionForm();
            this.showSectionModal = true;
        },
        openEditSectionModal(section) {
            this.mode = 'edit';
            this.form = {
                id: section.id,
                title: section.title,
                english_title: section.english_title,
                publish: section.publish,
                start_date: section.start_date,
                end_date: section.end_date,
                description: section.description,
            };
            this.showSectionModal = true;
        },
        closeSectionModal() {
            this.showSectionModal = false;
        },
        resetSectionForm() {
            this.form = {
                title: '',
                english_title: '',
                publish: 1,
                start_date: '',
                end_date: '',
                description: '',
            };
        },

        async sectionSubmit() {
            this.errors = null;
            this.submitLoading = true;
            if (this.mode === 'create') {
                await axiosInstance.post(
                    `admin/course/${this.courseSlug}/section/create`, this.form
                ).then((response) => {
                    this.course.sections.push(response.data.section)
                    toast.success("فصل جدید با موفقیت ایجاد شد.", {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                    this.closeSectionModal();
                }).catch((error) => {
                    this.errors = error.response.data.errors;
                    console.error(error.response?.data?.errors || error)
                }).finally(() => {
                    this.submitLoading = false;
                })
            } else {
                await axiosInstance.post(
                    `admin/course/${this.courseSlug}/section/${this.form.id}/edit`, this.form
                ).then((response) => {
                    toast.success("فصل مورد نظر  با موفقیت ویرایش شد.", {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                    const index = this.course.sections.findIndex(s => s.id === response.data.section.id);
                    this.course.sections[index].title = response.data.section.title;
                    this.course.sections[index].english_title = response.data.section.english_title;
                    this.course.sections[index].slug = response.data.section.slug;
                    this.course.sections[index].publish = response.data.section.publish;
                    this.course.sections[index].description = response.data.section.description;
                    this.course.sections[index].start_date = response.data.section.start_date;
                    this.course.sections[index].end_date = response.data.section.end_date;
                    // if (index !== -1) {
                    //     this.course.sections.splice(index, 1, response.data.section)
                    // }
                    this.closeSectionModal();
                }).catch((error) => {
                    this.errors = error.response.data.errors;
                    console.error(error.response?.data?.errors || error)
                }).finally(() => {
                    this.submitLoading = false;
                })
            }
        },

        // Episode Delete Methods
        openDeleteEpisodeModal(episode, section) {
            this.episodeForDelete = episode;
            this.sectionForDeleteEpisode = section;
            this.showDeleteEpisodeModal = true;
        },
        closeDeleteEpisodeModal() {
            this.episodeForDelete = null;
            this.sectionForDeleteEpisode = null;
            this.showDeleteEpisodeModal = false;
        },
        async deleteEpisode() {
            this.deleteEpisodeLoading = true;
            await axiosInstance.delete(
                `admin/course/${this.courseSlug}/episode/${this.episodeForDelete.slug}/delete`)
                .then(() => {
                    // Remove episode from the section
                    const section = this.course.sections.find(s => s.id === this.sectionForDeleteEpisode.id);
                    if (section) {
                        section.episodes = section.episodes.filter(ep => ep.id !== this.episodeForDelete.id);
                    }
                    toast.success("جلسه مورد نظر با موفقیت حذف شد.", {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                    this.closeDeleteEpisodeModal();
                    // Refresh episodes list
                    this.getCourseEpisodes();
                }).catch((error) => {
                    this.errors = error.response?.data?.errors;
                    console.error(error.response?.data?.errors || error)
                    toast.error("خطا! لطفا دوباره تلاش کنید.", {
                        theme: "colored",
                        hideProgressBar: false,
                        rtl: localStorage.getItem("direction") == "rtl" ? true : false,
                        bodyClassName: "font-YekanBakh",
                        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
                        transition: toast.TRANSITIONS.BOUNCE,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                }).finally(() => {
                    this.deleteEpisodeLoading = false;
                })
        },

    },
    mounted() {
        this.getCourseEpisodes();
        this._onResize = () => {
            this.viewportWidth = window.innerWidth;
        };
        window.addEventListener('resize', this._onResize);
    },
    beforeUnmount() {
        if (this._onResize) {
            window.removeEventListener('resize', this._onResize);
        }
    },
};
</script>
<style scoped>
.course-sections-layout {
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
    align-items: stretch;
}

@media (min-width: 1024px) {
    .course-sections-layout {
        flex-direction: row;
        align-items: flex-start;
        gap: 1.25rem;
    }
}

.course-sections-column {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
}

@media (min-width: 1024px) {
    .course-sections-column {
        gap: 1.25rem;
    }
}

.course-section-card {
    position: relative;
    width: 100%;
    min-width: 0;
}

:deep(.section-stat-card) {
    padding: 0.75rem !important;
}

@media (min-width: 640px) {
    :deep(.section-stat-card) {
        padding: 1rem !important;
    }
}

:deep(.section-stat-card .text-xl) {
    font-size: 1.05rem;
    line-height: 1.25;
}

@media (min-width: 640px) {
    :deep(.section-stat-card .text-xl) {
        font-size: 1.25rem;
    }
}

:deep(.section-stat-card .p-2\.5) {
    padding: 0.5rem;
}
</style>