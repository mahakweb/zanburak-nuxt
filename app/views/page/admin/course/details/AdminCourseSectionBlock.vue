<template>
    <Disclosure v-slot="{ open }" defaultOpen as="div"
        class="section-card"
        :class="open ? 'section-card--open' : 'section-card--closed'">
        <div class="section-accent" :class="{ 'section-accent--visible': open }"></div>

        <DisclosureButton
            class="section-head w-full text-start"
            :class="open ? 'section-head--open' : 'section-head--closed'"
        >
            <div class="section-head-main">
                <span class="section-badge tabular-nums">{{ sectionNumber }}</span>
                <div class="section-head-body min-w-0">
                    <div class="section-title-row">
                        <h4 class="section-title" :title="section.title">{{ section.title }}</h4>
                        <span class="episode-count-pill">
                            <svg class="w-3 h-3 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                <polygon points="8,5 19,12 8,19" fill="currentColor" stroke="none"/><rect x="4" y="5" width="3" height="14" rx="0.5" fill="currentColor" stroke="none"/>
                            </svg>
                            {{ (section.episodes?.length || 0).toLocaleString('fa-IR') }} جلسه
                        </span>
                    </div>
                    <div class="section-meta-row">
                        <span class="meta-chip">
                            <svg class="w-3 h-3 opacity-60 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                            {{ formatDate(section.start_date) || 'بدون شروع' }}
                        </span>
                        <span class="meta-chip">
                            <svg class="w-3 h-3 opacity-60 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                            {{ formatDate(section.end_date) || 'بدون پایان' }}
                        </span>
                        <span class="status-pill" :class="section.publish ? 'status-pill--active' : 'status-pill--inactive'">
                            <span class="status-dot" :class="section.publish ? 'status-dot--active' : 'status-dot--inactive'"></span>
                            {{ section.publish ? 'فعال' : 'غیرفعال' }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="section-head-actions">
                <router-link
                    :to="{ name: 'admin-episode-create', params: { courseSlug: course.slug, sectionSlug: section.slug } }"
                    class="btn-add-episode"
                    @click.stop
                >
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
                    <span>جلسه</span>
                </router-link>
                <span class="btn-chevron" :class="{ 'btn-chevron--open': open }" aria-hidden="true">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
                <button
                    type="button"
                    class="btn-menu section-menu-trigger"
                    :class="{ 'section-menu-trigger--active': openSectionMenu }"
                    @click.stop="toggleSectionMenu($event)"
                >
                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                    </svg>
                </button>
            </div>
        </DisclosureButton>

        <transition
            enter-active-class="transition-all duration-300 ease-out overflow-hidden"
            enter-from-class="max-h-0 opacity-0"
            enter-to-class="max-h-[4000px] opacity-100"
            leave-active-class="transition-all duration-300 ease-in overflow-hidden"
            leave-from-class="max-h-[4000px] opacity-100"
            leave-to-class="max-h-0 opacity-0"
        >
            <DisclosurePanel
                v-if="open"
                class="section-panel"
                :class="{ 'episode-panel': section.episodes && section.episodes.length > 0 }"
            >
                <div class="episode-list-wrapper">
                    <Container
                        group-name="episodes"
                        :get-child-payload="getPayload"
                        @drop="(r) => $emit('drop', r)"
                        drag-class="opacity-50 scale-[0.98]"
                        drop-class="bg-amber-50/80 dark:bg-amber-500/10"
                        :drop-placeholder="{
                            animationDuration: 150,
                            showOnTop: false,
                            className: 'episode-drop-placeholder'
                        }"
                        class="episode-list space-y-2.5"
                        :class="{ 'episode-list--empty': !section.episodes?.length }"
                    >
                        <Draggable
                            v-for="(episode, episodeIndex) in section.episodes"
                            :key="episode.id"
                            class="episode-item cursor-move"
                        >
                        <div
                            class="episode-line group"
                            :class="{ 'last-episode': episodeIndex === section.episodes.length - 1 }"
                        >
                            <div class="episode-card">
                                <div class="episode-card-top">
                                    <div class="episode-card-leading min-w-0">
                                        <span class="episode-order tabular-nums">{{ episode.order }}</span>
                                        <span v-if="episode.lock" title="قفل" class="episode-lock episode-lock--locked">
                                            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.25 10.0546V8C5.25 4.27208 8.27208 1.25 12 1.25C15.7279 1.25 18.75 4.27208 18.75 8V10.0546C19.8648 10.1379 20.5907 10.348 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.40931 10.348 4.13525 10.1379 5.25 10.0546V8C5.25 4.27208 8.27208 1.25 12 1.25C15.1463 1.25 17.788 3.4019 18.5373 6.31306C18.6405 6.7142 18.3991 7.12308 17.9979 7.22633C17.5968 7.32957 17.1879 7.08808 17.0846 6.68694C16.5018 4.42242 14.4453 2.75 12 2.75ZM6.75 8C6.75 5.10051 9.10051 2.75 12 2.75C14.8995 2.75 17.25 5.10051 17.25 8V10.0036C16.867 10 16.4515 10 16 10H8C7.54849 10 7.13301 10 6.75 10.0036V8ZM12 13.25C12.4142 13.25 12.75 13.5858 12.75 14V18C12.75 18.4142 12.4142 18.75 12 18.75C11.5858 18.75 11.25 18.4142 11.25 18V14C11.25 13.5858 11.5858 13.25 12 13.25Z" fill="currentColor"/></svg>
                                        </span>
                                        <span v-else title="باز" class="episode-lock episode-lock--open">
                                            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2.75C9.10051 2.75 6.75 5.10051 6.75 8V10.0036C7.13301 10 7.54849 10 8 10H16C18.8284 10 20.2426 10 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.40931 10.348 4.13525 10.1379 5.25 10.0546V8C5.25 4.27208 8.27208 1.25 12 1.25C15.1463 1.25 17.788 3.4019 18.5373 6.31306C18.6405 6.7142 18.3991 7.12308 17.9979 7.22633C17.5968 7.32957 17.1879 7.08808 17.0846 6.68694C16.5018 4.42242 14.4453 2.75 12 2.75ZM12.75 14C12.75 13.5858 12.4142 13.25 12 13.25C11.5858 13.25 11.25 13.5858 11.25 14V18C11.25 18.4142 11.5858 18.75 12 18.75C12.4142 18.75 12.75 18.4142 12.75 18V14Z" fill="currentColor"/></svg>
                                        </span>
                                        <router-link
                                            :to="{ name: 'admin-episode-details', params: { courseSlug: course.slug, sectionSlug: section.slug, episodeSlug: episode.slug } }"
                                            class="episode-title"
                                        >{{ episode.title }}</router-link>
                                    </div>
                                    <button
                                        type="button"
                                        class="btn-menu btn-menu--sm episode-menu-trigger shrink-0"
                                        :class="{ 'episode-menu-trigger--active': openEpisodeMenu?.episode.id === episode.id }"
                                        @click.stop="toggleEpisodeMenu(episode, $event)"
                                    >
                                        <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                                        </svg>
                                    </button>
                                </div>
                                <div class="episode-meta">
                                    <span class="episode-meta-chip font-mono">
                                        <svg class="w-3 h-3 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                                        {{ formatDuration(episode.total_time) }}
                                    </span>
                                    <span class="episode-meta-chip">
                                        <span class="status-dot" :class="episode.publish ? 'status-dot--active' : 'status-dot--inactive'"></span>
                                        {{ episode.publish_date ? formatPublishDate(episode.publish_date) : 'بدون تاریخ' }}
                                    </span>
                                    <span v-if="episode.attached" title="پیوست دارد" class="episode-meta-chip">
                                        <svg class="w-3.5 h-3.5 opacity-60" viewBox="0 0 24 24" fill="none"><path d="M20 15V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18L4 15M8 11L12 15M12 15L16 11M12 15V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                        پیوست
                                    </span>
                                </div>
                            </div>
                        </div>
                        </Draggable>
                    </Container>
                    <div v-if="!section.episodes?.length" class="empty-episodes empty-episodes--overlay">
                        <div class="empty-episodes-icon">
                            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                                <polygon points="8,5 19,12 8,19" fill="currentColor" stroke="none" opacity="0.35"/><rect x="4" y="5" width="3" height="14" rx="0.5" fill="currentColor" stroke="none" opacity="0.35"/>
                                <path d="M12 8v8M8 12h8"/>
                            </svg>
                        </div>
                        <p class="empty-episodes-text">هنوز جلسه‌ای در این فصل نیست</p>
                        <router-link :to="{ name: 'admin-episode-create', params: { courseSlug: course.slug, sectionSlug: section.slug } }" class="empty-episodes-link">
                            افزودن اولین جلسه
                        </router-link>
                    </div>
                </div>
                <Teleport to="body">
                    <transition
                        enter-active-class="transition duration-200 ease-out"
                        enter-from-class="translate-y-1 opacity-0 scale-95"
                        enter-to-class="translate-y-0 opacity-100 scale-100"
                        leave-active-class="transition duration-150 ease-in"
                        leave-from-class="translate-y-0 opacity-100 scale-100"
                        leave-to-class="translate-y-1 opacity-0 scale-95"
                    >
                        <div
                            v-if="openEpisodeMenu"
                            class="menu-panel menu-panel--fixed episode-menu-portal"
                            :style="{ top: openEpisodeMenu.top, left: openEpisodeMenu.left }"
                            @click.stop
                        >
                            <ul class="menu-list">
                                <li>
                                    <router-link
                                        :to="{ name: 'admin-episode-details', params: { courseSlug: course.slug, sectionSlug: section.slug, episodeSlug: openEpisodeMenu.episode.slug } }"
                                        class="menu-item"
                                        @click="closeEpisodeMenu"
                                    >
                                        <svg class="w-4 h-4 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                        جزئیات
                                    </router-link>
                                </li>
                                <li>
                                    <router-link
                                        :to="{ name: 'admin-episode-edit', params: { courseSlug: course.slug, sectionSlug: section.slug, episodeSlug: openEpisodeMenu.episode.slug } }"
                                        class="menu-item"
                                        @click="closeEpisodeMenu"
                                    >
                                        <svg class="w-4 h-4 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                        ویرایش
                                    </router-link>
                                </li>
                                <li>
                                    <router-link
                                        :to="episodeQuizCreateRoute(openEpisodeMenu.episode)"
                                        class="menu-item"
                                        @click="closeEpisodeMenu"
                                    >
                                        <svg class="w-4 h-4 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>
                                        ایجاد آزمون
                                    </router-link>
                                </li>
                                <li>
                                    <button type="button" @click.prevent="onDeleteEpisode(openEpisodeMenu.episode)" class="menu-item menu-item--danger">
                                        <svg class="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg>
                                        حذف
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </transition>
                </Teleport>
            </DisclosurePanel>
        </transition>

        <Teleport to="body">
            <BottomSheetDrawer
                v-model="showSectionQuizzesSheet"
                :initialHeight="0.75"
                :maxHeight="0.95"
                :minHeight="0.5"
                :autoCloseOnMin="true"
                :closeOnBackdrop="true"
                :lockScroll="true"
                :panelClass="bs.ADMIN_BS_PANEL"
                :contentClass="bs.ADMIN_BS_CONTENT"
                :backdropClass="bs.ADMIN_BS_BACKDROP"
            >
                <AdminBottomSheetHeader
                    title="آزمون‌های فصل"
                    :subtitle="section.title"
                    accent="sky"
                    @close="showSectionQuizzesSheet = false"
                />
                <div :class="bs.ADMIN_BS_SCROLL">
                    <AdminCourseQuizzes
                        v-if="showSectionQuizzesSheet"
                        entity-type="section"
                        :entity-id="section.id"
                        :entity-title="section.title || ''"
                    />
                </div>
            </BottomSheetDrawer>
        </Teleport>

        <Teleport to="body">
            <transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="translate-y-1 opacity-0 scale-95"
                enter-to-class="translate-y-0 opacity-100 scale-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="translate-y-0 opacity-100 scale-100"
                leave-to-class="translate-y-1 opacity-0 scale-95"
            >
                <div
                    v-if="openSectionMenu"
                    class="menu-panel menu-panel--fixed section-menu-portal"
                    :style="{ top: openSectionMenu.top, left: openSectionMenu.left }"
                    @click.stop
                >
                    <ul class="menu-list">
                        <li>
                            <button type="button" @click.prevent="onEditSection" class="menu-item">
                                <svg class="w-4 h-4 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                ویرایش فصل
                            </button>
                        </li>
                        <li>
                            <button type="button" class="menu-item" @click.prevent="openSectionQuizzesSheet">
                                <svg class="w-4 h-4 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>
                                آزمون‌ها
                            </button>
                        </li>
                        <li>
                            <button type="button" @click.prevent="onDeleteSection" class="menu-item menu-item--danger">
                                <svg class="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg>
                                حذف فصل
                            </button>
                        </li>
                    </ul>
                </div>
            </transition>
        </Teleport>
    </Disclosure>
</template>

<script>
import { Container, Draggable } from 'vue3-smooth-dnd';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import BottomSheetDrawer from '@/views/components/common/BottomSheetDrawer.vue';
import AdminBottomSheetHeader from '@/views/components/admin/bottomSheet/AdminBottomSheetHeader.vue';
import AdminCourseQuizzes from '@/views/page/admin/course/details/AdminCourseQuizzes.vue';
import * as bs from '@/views/components/admin/bottomSheet/adminBottomSheetStyles.js';

export default {
    name: 'AdminCourseSectionBlock',
    components: {
        Container, Draggable,
        Disclosure, DisclosureButton, DisclosurePanel,
        BottomSheetDrawer, AdminBottomSheetHeader, AdminCourseQuizzes,
    },
    props: {
        section: { type: Object, required: true },
        course: { type: Object, required: true },
        sectionNumber: { type: String, required: true },
        getPayload: { type: Function, required: true },
    },
    emits: ['delete-section', 'edit-section', 'delete-episode', 'drop'],
    data() {
        return {
            bs,
            openEpisodeMenu: null,
            openSectionMenu: null,
            showSectionQuizzesSheet: false,
        };
    },
    mounted() {
        document.addEventListener('click', this.onMenuDocumentClick);
        document.addEventListener('keydown', this.onMenuKeydown);
        window.addEventListener('scroll', this.onMenuScroll, true);
        window.addEventListener('resize', this.onMenuScroll);
        window.addEventListener('admin-close-episode-menus', this.closeEpisodeMenu);
        window.addEventListener('admin-close-section-menus', this.closeSectionMenu);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.onMenuDocumentClick);
        document.removeEventListener('keydown', this.onMenuKeydown);
        window.removeEventListener('scroll', this.onMenuScroll, true);
        window.removeEventListener('resize', this.onMenuScroll);
        window.removeEventListener('admin-close-episode-menus', this.closeEpisodeMenu);
        window.removeEventListener('admin-close-section-menus', this.closeSectionMenu);
    },
    methods: {
        episodeQuizCreateRoute(episode) {
            return {
                name: 'admin-quiz-create',
                query: {
                    quizzableType: 'episode',
                    episodeId: episode.id,
                    episodeTitle: episode.title || episode.english_title || '',
                },
            };
        },
        openSectionQuizzesSheet() {
            this.closeSectionMenu();
            this.showSectionQuizzesSheet = true;
        },
        closeAllMenus() {
            this.openEpisodeMenu = null;
            this.openSectionMenu = null;
        },
        toggleSectionMenu(event) {
            if (this.openSectionMenu) {
                this.closeSectionMenu();
                return;
            }
            window.dispatchEvent(new CustomEvent('admin-close-section-menus'));
            window.dispatchEvent(new CustomEvent('admin-close-episode-menus'));
            const rect = event.currentTarget.getBoundingClientRect();
            const menu = {
                top: `${rect.bottom + 4}px`,
                left: `${rect.left}px`,
            };
            this.$nextTick(() => {
                this.openSectionMenu = menu;
            });
        },
        closeSectionMenu() {
            this.openSectionMenu = null;
        },
        onEditSection() {
            this.closeSectionMenu();
            this.$emit('edit-section', this.section);
        },
        onDeleteSection() {
            this.closeSectionMenu();
            this.$emit('delete-section', this.section);
        },
        toggleEpisodeMenu(episode, event) {
            if (this.openEpisodeMenu?.episode.id === episode.id) {
                this.closeEpisodeMenu();
                return;
            }
            window.dispatchEvent(new CustomEvent('admin-close-episode-menus'));
            window.dispatchEvent(new CustomEvent('admin-close-section-menus'));
            const rect = event.currentTarget.getBoundingClientRect();
            const menu = {
                episode,
                top: `${rect.bottom + 4}px`,
                left: `${rect.left}px`,
            };
            this.$nextTick(() => {
                this.openEpisodeMenu = menu;
            });
        },
        closeEpisodeMenu() {
            this.openEpisodeMenu = null;
        },
        onMenuDocumentClick(event) {
            if (!this.openEpisodeMenu && !this.openSectionMenu) return;
            if (event.target.closest('.episode-menu-trigger') || event.target.closest('.episode-menu-portal')) return;
            if (event.target.closest('.section-menu-trigger') || event.target.closest('.section-menu-portal')) return;
            this.closeAllMenus();
        },
        onMenuKeydown(event) {
            if (event.key === 'Escape') this.closeAllMenus();
        },
        onMenuScroll() {
            if (this.openEpisodeMenu || this.openSectionMenu) this.closeAllMenus();
        },
        onDeleteEpisode(episode) {
            this.closeEpisodeMenu();
            this.$emit('delete-episode', episode, this.section);
        },
        formatDate(value) {
            if (!value) return '';
            return new Date(value).toLocaleDateString('fa-IR', { year: 'numeric', month: 'short', day: '2-digit' });
        },
        formatPublishDate(value) {
            return new Date(value).toLocaleDateString('fa-IR', { day: 'numeric', month: 'short', year: 'numeric' });
        },
        formatDuration(totalTime) {
            return new Date((totalTime || 0) * 1000).toISOString().slice(11, 19);
        },
    },
};
</script>

<style scoped>
/* ── کارت فصل ── */
.section-card {
    position: relative;
    min-width: 0;
    border-radius: 1.25rem;
    border: 1px solid rgb(229 231 235 / 0.85);
    background: white;
    box-shadow: 0 1px 3px rgb(0 0 0 / 0.04), 0 4px 12px rgb(0 0 0 / 0.02);
    overflow: hidden;
    transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
}

.dark .section-card {
    border-color: rgb(55 65 81 / 0.8);
    background: rgb(17 24 39);
    box-shadow: 0 1px 3px rgb(0 0 0 / 0.2);
}

.section-card--closed:hover {
    border-color: rgb(209 213 219 / 0.9);
    box-shadow: 0 4px 16px rgb(0 0 0 / 0.06);
}

.dark .section-card--closed:hover {
    border-color: rgb(75 85 99 / 0.7);
}

.section-card--open {
    border-color: rgb(251 191 36 / 0.4);
    box-shadow: 0 4px 20px rgb(251 191 36 / 0.1), 0 1px 3px rgb(0 0 0 / 0.04);
}

.dark .section-card--open {
    border-color: rgb(251 191 36 / 0.22);
    box-shadow: 0 4px 24px rgb(0 0 0 / 0.25);
}

.section-accent {
    position: absolute;
    top: 0;
    inset-inline: 0;
    height: 3px;
    background: linear-gradient(to left, rgb(251 191 36), rgb(252 211 77));
    opacity: 0;
    transition: opacity 0.25s;
    z-index: 1;
}

.section-accent--visible {
    opacity: 1;
}

/* ── هدر فصل ── */
.section-head {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.875rem;
    transition: background 0.2s;
}

.section-head-main {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    min-width: 0;
}

.section-head-body {
    flex: 1;
    min-width: 0;
}

.section-title-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.375rem 0.5rem;
}

.section-meta-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.375rem;
    margin-top: 0.5rem;
}

.section-head-actions {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    width: 100%;
}

.section-head-actions .btn-add-episode {
    flex: 1;
    justify-content: center;
    min-height: 2.25rem;
}

.section-head-actions .btn-chevron,
.section-head-actions .btn-menu {
    flex-shrink: 0;
}

@media (min-width: 640px) {
    .section-head {
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        gap: 0.75rem;
        padding: 1rem 1rem 1rem 0.875rem;
    }

    .section-head-main {
        flex: 1;
        min-width: 0;
    }

    .section-head-actions {
        width: auto;
        flex-shrink: 0;
        padding-top: 0.125rem;
    }

    .section-head-actions .btn-add-episode {
        flex: initial;
        min-height: auto;
    }
}

.section-head--closed:hover {
    background: linear-gradient(to bottom, rgb(249 250 251 / 0.9), transparent);
}

.dark .section-head--closed:hover {
    background: linear-gradient(to bottom, rgb(31 41 55 / 0.6), transparent);
}

.section-head--open {
    background: linear-gradient(to bottom, rgb(254 243 199 / 0.45), transparent);
    border-bottom: 1px solid rgb(243 244 246 / 0.9);
}

.dark .section-head--open {
    background: linear-gradient(to bottom, rgb(250 204 21 / 0.08), transparent);
    border-bottom-color: rgb(55 65 81 / 0.8);
}

.section-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    margin-top: 0.125rem;
    border-radius: 0.75rem;
    background: rgb(250 204 21 / 0.2);
    color: rgb(161 98 7);
    font-size: 0.75rem;
    font-weight: 800;
    box-shadow: inset 0 0 0 1px rgb(250 204 21 / 0.35);
    flex-shrink: 0;
}

.dark .section-badge {
    color: rgb(250 204 21);
    background: rgb(250 204 21 / 0.12);
    box-shadow: inset 0 0 0 1px rgb(250 204 21 / 0.2);
}

@media (min-width: 640px) {
    .section-badge {
        width: 2.25rem;
        height: 2.25rem;
        font-size: 0.8125rem;
        border-radius: 0.875rem;
    }
}

.section-title {
    font-size: 0.8125rem;
    font-weight: 700;
    color: rgb(17 24 39);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-width: 0;
}

.dark .section-title {
    color: white;
}

@media (min-width: 640px) {
    .section-title {
        font-size: 0.875rem;
    }
}

.episode-count-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    flex-shrink: 0;
    font-size: 10px;
    font-weight: 600;
    padding: 0.2rem 0.5rem;
    border-radius: 9999px;
    background: rgb(243 244 246);
    color: rgb(75 85 99);
    box-shadow: inset 0 0 0 1px rgb(229 231 235);
}

.dark .episode-count-pill {
    background: rgb(31 41 55);
    color: rgb(156 163 175);
    box-shadow: inset 0 0 0 1px rgb(55 65 81);
}

.meta-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    max-width: 100%;
    font-size: 10px;
    font-weight: 500;
    line-height: 1.2;
    padding: 0.25rem 0.45rem;
    border-radius: 0.5rem;
    background: rgb(243 244 246 / 0.95);
    color: rgb(75 85 99);
}

.dark .meta-chip {
    background: rgb(31 41 55 / 0.95);
    color: rgb(156 163 175);
}

.status-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 10px;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
}

.status-pill--active {
    background: rgb(220 252 231 / 0.9);
    color: rgb(21 128 61);
}

.status-pill--inactive {
    background: rgb(254 243 199 / 0.95);
    color: rgb(161 98 7);
}

.dark .status-pill--active {
    background: rgb(20 83 45 / 0.35);
    color: rgb(74 222 128);
}

.dark .status-pill--inactive {
    background: rgb(113 63 18 / 0.35);
    color: rgb(250 204 21);
}

.status-dot {
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 9999px;
    flex-shrink: 0;
}

.status-dot--active { background: rgb(34 197 94); }
.status-dot--inactive { background: rgb(234 179 8); }

/* ── دکمه‌ها ── */
.btn-add-episode {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    border-radius: 0.75rem;
    padding: 0.4rem 0.7rem;
    font-size: 11px;
    font-weight: 700;
    background: rgb(250 204 21);
    color: rgb(17 24 39);
    box-shadow: 0 1px 3px rgb(250 204 21 / 0.35);
    transition: transform 0.15s, box-shadow 0.15s, background 0.15s;
}

.btn-add-episode:hover {
    background: rgb(251 191 36);
    box-shadow: 0 2px 8px rgb(250 204 21 / 0.4);
}

.btn-chevron {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 0.75rem;
    background: rgb(243 244 246);
    color: rgb(107 114 128);
    transition: transform 0.25s, background 0.2s, color 0.2s;
}

.btn-chevron--open {
    transform: rotate(180deg);
    background: rgb(254 243 199);
    color: rgb(161 98 7);
}

.dark .btn-chevron {
    background: rgb(31 41 55);
    color: rgb(156 163 175);
}

.dark .btn-chevron--open {
    background: rgb(250 204 21 / 0.15);
    color: rgb(250 204 21);
}

.btn-menu {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 0.75rem;
    color: rgb(75 85 99);
    background: rgb(243 244 246 / 0.7);
    transition: background 0.15s;
}

.btn-menu:hover {
    background: rgb(243 244 246);
}

.dark .btn-menu {
    color: rgb(209 213 219);
    background: rgb(31 41 55 / 0.8);
}

.dark .btn-menu:hover {
    background: rgb(55 65 81);
}

.btn-menu--sm {
    width: 2rem;
    height: 2rem;
    opacity: 1;
}

@media (hover: hover) and (pointer: fine) {
    .btn-menu--sm {
        opacity: 0;
        background: transparent;
    }

    .group:hover .btn-menu--sm,
    .group:focus-within .btn-menu--sm,
    .episode-menu-trigger--active {
        opacity: 1;
    }
}

.episode-menu-trigger--active,
.section-menu-trigger--active {
    opacity: 1;
    background: rgb(243 244 246);
}

.dark .episode-menu-trigger--active,
.dark .section-menu-trigger--active {
    background: rgb(55 65 81);
}

.menu-panel {
    position: absolute;
    z-index: 60;
    margin-top: 0.5rem;
    inset-inline-end: 0;
    min-width: 9.5rem;
    padding: 0.375rem;
    border-radius: 0.875rem;
    background: white;
    border: 1px solid rgb(229 231 235 / 0.9);
    box-shadow: 0 10px 40px rgb(0 0 0 / 0.12);
}

.menu-panel--fixed {
    position: fixed;
    margin-top: 0;
    inset-inline-end: auto;
    z-index: 9999;
}

.dark .menu-panel {
    background: rgb(31 41 55);
    border-color: rgb(55 65 81);
    box-shadow: 0 10px 40px rgb(0 0 0 / 0.4);
}

.menu-list {
    font-size: 0.75rem;
    font-weight: 600;
    color: rgb(55 65 81);
}

.dark .menu-list {
    color: rgb(229 231 235);
}

.menu-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    text-align: start;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    transition: background 0.15s;
}

.menu-item:hover {
    background: rgb(243 244 246);
}

.dark .menu-item:hover {
    background: rgb(55 65 81);
}

.menu-item--danger {
    color: rgb(220 38 38);
}

.dark .menu-item--danger {
    color: rgb(248 113 113);
}

.menu-item--danger:hover {
    background: rgb(254 242 242);
}

.dark .menu-item--danger:hover {
    background: rgb(127 29 29 / 0.3);
}

/* ── پنل جلسات ── */
.section-panel {
    padding: 0.75rem;
    background: rgb(249 250 251);
    overflow: visible;
}

@media (min-width: 640px) {
    .section-panel {
        padding: 0.875rem 0.875rem 1rem;
    }
}

.dark .section-panel {
    background: rgb(31 41 55);
}

.episode-list-wrapper {
    position: relative;
}

.episode-list--empty {
    min-height: 7.5rem;
}

.empty-episodes {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1.25rem 1rem;
    border-radius: 1rem;
    border: 2px dashed rgb(229 231 235);
    background: rgb(255 255 255 / 0.6);
    text-align: center;
}

.empty-episodes--overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.empty-episodes--overlay .empty-episodes-link {
    pointer-events: auto;
}

.dark .empty-episodes {
    border-color: rgb(55 65 81);
    background: rgb(17 24 39 / 0.5);
}

.empty-episodes-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 0.875rem;
    background: rgb(243 244 246);
    color: rgb(156 163 175);
}

.dark .empty-episodes-icon {
    background: rgb(31 41 55);
}

.empty-episodes-text {
    font-size: 0.75rem;
    color: rgb(107 114 128);
}

.dark .empty-episodes-text {
    color: rgb(156 163 175);
}

.empty-episodes-link {
    font-size: 0.75rem;
    font-weight: 700;
    color: rgb(202 138 4);
    transition: color 0.15s;
}

.empty-episodes-link:hover {
    color: rgb(161 98 7);
    text-decoration: underline;
}

.dark .empty-episodes-link {
    color: rgb(250 204 21);
}

/* ── خط عمودی + افقی جلسات ── */
.episode-panel {
    position: relative;
}

.episode-panel::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    inset-inline-start: 0.5rem;
    width: 2px;
    background: #d1d5db;
    pointer-events: none;
}

@media (min-width: 640px) {
    .episode-panel::before {
        inset-inline-start: 0.625rem;
    }
}

.dark .episode-panel::before {
    background: #374151;
}

.episode-list {
    position: relative;
}

.episode-item {
    position: relative;
    overflow: visible;
    padding-inline-start: 0.85rem;
}

@media (min-width: 640px) {
    .episode-item {
        padding-inline-start: 1rem;
    }
}

.episode-line {
    position: relative;
}

.episode-line::before {
    content: '';
    position: absolute;
    top: 1.15rem;
    inset-inline-start: -1rem;
    width: 1rem;
    height: 2px;
    background: #d1d5db;
    pointer-events: none;
}

@media (min-width: 640px) {
    .episode-line::before {
        top: 1.25rem;
        inset-inline-start: -1.2rem;
        width: 1.2rem;
    }
}

.dark .episode-line::before {
    background: #374151;
}

.episode-line.last-episode::after,
.episode-list :deep(.smooth-dnd-draggable-wrapper:last-child) .episode-line::after {
    content: '';
    position: absolute;
    inset-inline-start: -1.15rem;
    top: calc(1.15rem + 2px);
    width: 16px;
    height: 100vh;
    background: rgb(249 250 251);
    pointer-events: none;
    z-index: 1;
}

@media (min-width: 640px) {
    .episode-line.last-episode::after,
    .episode-list :deep(.smooth-dnd-draggable-wrapper:last-child) .episode-line::after {
        inset-inline-start: -1.3rem;
        top: calc(1.25rem + 2px);
        width: 18px;
    }
}

.dark .episode-line.last-episode::after,
.dark .episode-list :deep(.smooth-dnd-draggable-wrapper:last-child) .episode-line::after {
    background: rgb(31 41 55);
}

/* ── کارت جلسه ── */
.episode-card {
    border-radius: 0.875rem;
    border: 1px solid rgb(229 231 235 / 0.9);
    background: white;
    padding: 0.625rem 0.7rem;
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.03);
    transition: border-color 0.2s, box-shadow 0.2s;
}

.dark .episode-card {
    border-color: rgb(55 65 81 / 0.8);
    background: rgb(17 24 39 / 0.7);
}

.group:hover .episode-card {
    border-color: rgb(250 204 21 / 0.45);
    box-shadow: 0 4px 12px rgb(250 204 21 / 0.08);
}

.episode-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
}

.episode-card-leading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
    flex: 1;
}

.episode-order {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 0.5rem;
    background: rgb(250 204 21);
    color: rgb(17 24 39);
    font-size: 10px;
    font-weight: 800;
}

@media (min-width: 640px) {
    .episode-order {
        width: 1.625rem;
        height: 1.625rem;
        font-size: 11px;
    }
}

.episode-lock {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 0.375rem;
}

.episode-lock--locked {
    background: rgb(255 228 230 / 0.9);
    color: rgb(225 29 72);
}

.episode-lock--open {
    background: rgb(220 252 231 / 0.9);
    color: rgb(22 163 74);
}

.dark .episode-lock--locked {
    background: rgb(127 29 29 / 0.35);
    color: rgb(251 113 133);
}

.dark .episode-lock--open {
    background: rgb(20 83 45 / 0.35);
    color: rgb(74 222 128);
}

.episode-title {
    min-width: 0;
    font-size: 0.75rem;
    font-weight: 600;
    color: rgb(31 41 55);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color 0.15s;
}

@media (min-width: 640px) {
    .episode-title {
        font-size: 0.8125rem;
        -webkit-line-clamp: 1;
    }
}

.episode-title:hover {
    color: rgb(202 138 4);
}

.dark .episode-title {
    color: rgb(243 244 246);
}

.dark .episode-title:hover {
    color: rgb(250 204 21);
}

.episode-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.375rem;
    margin-top: 0.5rem;
    padding-inline-start: 0;
}

@media (min-width: 640px) {
    .episode-meta {
        padding-inline-start: 2rem;
    }
}

.episode-meta-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 10px;
    font-weight: 500;
    padding: 0.2rem 0.45rem;
    border-radius: 0.375rem;
    background: rgb(249 250 251);
    color: rgb(107 114 128);
}

.dark .episode-meta-chip {
    background: rgb(31 41 55);
    color: rgb(156 163 175);
}

.episode-drop-placeholder {
    margin-inline-start: 0.85rem;
    min-height: 3rem;
    border-radius: 0.875rem;
    border: 2px dashed rgb(250 204 21 / 0.45);
    background: rgb(250 204 21 / 0.05);
}

@media (min-width: 640px) {
    .episode-drop-placeholder {
        margin-inline-start: 1rem;
    }
}

:deep(.smooth-dnd-draggable-wrapper) {
    overflow: visible !important;
}
</style>
