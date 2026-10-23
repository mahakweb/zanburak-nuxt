<template>
    <div class="inline-flex items-center justify-center">
        <button
            ref="trigger"
            type="button"
            :class="triggerClass"
            :aria-label="'عملیات دوره'"
            @click.stop="toggleOpen"
        >
            <svg class="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="3" r="1.4" />
                <circle cx="8" cy="8" r="1.4" />
                <circle cx="8" cy="13" r="1.4" />
            </svg>
        </button>

        <Teleport to="body">
            <div v-if="open" class="fixed inset-0 z-[300]" @click="close"></div>
            <div
                v-if="open"
                ref="menu"
                :style="menuStyle"
                class="fixed z-[310] w-52 overflow-hidden rounded-2xl border border-gray-100 bg-white p-1.5 shadow-xl shadow-slate-900/15 dark:border-white/10 dark:bg-gray-900"
                @click.stop
            >
                <router-link
                    :to="{ name: 'admin-course-details', params: { courseSlug: course.slug } }"
                    class="course-menu-item"
                    @click="close"
                >
                    <span class="course-menu-icon">
                        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                            <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" stroke="currentColor" stroke-width="1.8" />
                            <circle cx="12" cy="12" r="2.4" stroke="currentColor" stroke-width="1.8" />
                        </svg>
                    </span>
                    مشاهده دوره
                </router-link>
                <router-link
                    :to="{ name: 'admin-course-edit', params: { courseSlug: course.slug } }"
                    class="course-menu-item"
                    @click="close"
                >
                    <span class="course-menu-icon">
                        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                            <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                            <path d="M13.5 6.5l3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                        </svg>
                    </span>
                    ویرایش دوره
                </router-link>
                <router-link
                    :to="{ name: 'admin-course-details', params: { courseSlug: course.slug }, query: { section: 'episodes' } }"
                    class="course-menu-item"
                    @click="close"
                >
                    <span class="course-menu-icon">
                        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                            <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Z" stroke="currentColor" stroke-width="1.8" />
                            <path d="m10 9 5 3-5 3V9Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                        </svg>
                    </span>
                    مدیریت جلسات
                </router-link>

                <div v-if="publishItems.length" class="my-1 h-px bg-gray-100 dark:bg-white/10"></div>

                <button
                    v-for="item in publishItems"
                    :key="item.action"
                    type="button"
                    class="course-menu-item"
                    :class="item.tone === 'danger' ? 'text-rose-600 dark:text-rose-400' : item.tone === 'success' ? 'text-emerald-600 dark:text-emerald-400' : item.tone === 'warning' ? 'text-amber-700 dark:text-amber-400' : ''"
                    @click="emitPublish(item.action)"
                >
                    <span class="course-menu-icon">
                        <svg v-if="item.action === 'publish'" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12.5 9.2 16.5 19 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <svg v-else-if="item.action === 'review'" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                            <path d="M4 19V5a1 1 0 0 1 1-1h9l6 6v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                            <path d="M14 4v6h6" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                        </svg>
                        <svg v-else-if="item.action === 'request'" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                            <path d="M12 19V5M12 5l-5 5M12 5l5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <svg v-else-if="item.action === 'cancel'" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                        </svg>
                        <svg v-else class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.8" />
                            <path d="M8 8l8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                        </svg>
                    </span>
                    {{ item.label }}
                </button>

                <div v-if="deleteItems.length || showHardDelete" class="my-1 h-px bg-gray-100 dark:bg-white/10"></div>
                <button
                    v-for="item in deleteItems"
                    :key="item.action"
                    type="button"
                    class="course-menu-item"
                    :class="item.tone === 'danger' ? 'text-rose-600 dark:text-rose-400' : item.tone === 'warning' ? 'text-amber-700 dark:text-amber-400' : ''"
                    @click="emitPublish(item.action)"
                >
                    <span class="course-menu-icon">
                        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                            <path d="M4 7h16M9 7V5h6v2M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </span>
                    {{ item.label }}
                </button>
                <button
                    v-if="showHardDelete"
                    type="button"
                    class="course-menu-item text-rose-600 dark:text-rose-400"
                    @click="emitDelete"
                >
                    <span class="course-menu-icon">
                        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                            <path d="M4 7h16M9 7V5h6v2M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </span>
                    حذف دوره
                </button>
            </div>
        </Teleport>
    </div>
</template>

<script>
import { canHardDeleteCourse, getCourseDeleteActions, getCoursePublishActions } from '@/utils/coursePublish'

export default {
    props: {
        course: { type: Object, required: true },
        tone: { type: String, default: 'default' },
        showDelete: { type: Boolean, default: true },
    },
    emits: ['publish-action', 'delete'],
    data() {
        return {
            open: false,
            menuStyle: {},
        }
    },
    computed: {
        publishItems() {
            return getCoursePublishActions(this.course, (perms) => this.$can(perms))
        },
        deleteItems() {
            if (!this.showDelete) return []
            return getCourseDeleteActions(this.course, (perms) => this.$can(perms))
        },
        canDelete() {
            return this.$can(['courses.delete', 'courses.delete.own', 'courses.delete.any'])
        },
        showHardDelete() {
            return this.showDelete && canHardDeleteCourse(this.course, (perms) => this.$can(perms))
        },
        triggerClass() {
            if (this.tone === 'overlay') {
                return [
                    'inline-flex h-7 w-7 items-center justify-center rounded-lg bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/55 focus:outline-none',
                    this.open ? 'bg-black/60' : '',
                ]
            }
            return [
                'inline-flex h-8 w-8 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white',
                this.open ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white' : '',
            ]
        },
    },
    watch: {
        open(val) {
            if (val) {
                this.$nextTick(() => {
                    this.updateMenuPosition()
                    this.$nextTick(() => this.updateMenuPosition())
                })
            }
        },
    },
    mounted() {
        window.addEventListener('scroll', this.onScrollOrResize, true)
        window.addEventListener('resize', this.onScrollOrResize)
        document.addEventListener('keydown', this.onEscape)
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.onScrollOrResize, true)
        window.removeEventListener('resize', this.onScrollOrResize)
        document.removeEventListener('keydown', this.onEscape)
    },
    methods: {
        toggleOpen() {
            this.open = !this.open
        },
        close() {
            this.open = false
        },
        emitPublish(action) {
            this.close()
            this.$emit('publish-action', { action, course: this.course })
        },
        emitDelete() {
            this.close()
            this.$emit('delete', this.course)
        },
        updateMenuPosition() {
            const trigger = this.$refs.trigger
            if (!trigger) return

            const rect = trigger.getBoundingClientRect()
            const menuWidth = 208
            const menuHeight = this.$refs.menu?.offsetHeight || 280
            const gap = 6
            const padding = 8

            let top = rect.bottom + gap
            let left = rect.left

            if (left + menuWidth > window.innerWidth - padding) {
                left = rect.right - menuWidth
            }
            if (left < padding) left = padding
            if (top + menuHeight > window.innerHeight - padding) {
                top = Math.max(padding, rect.top - menuHeight - gap)
            }

            this.menuStyle = {
                top: `${top}px`,
                left: `${left}px`,
                width: `${menuWidth}px`,
            }
        },
        onScrollOrResize() {
            if (this.open) this.updateMenuPosition()
        },
        onEscape(e) {
            if (e.key === 'Escape') this.close()
        },
    },
}
</script>

<style scoped>
.course-menu-item {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 0.6rem;
    border-radius: 0.8rem;
    padding: 0.55rem 0.7rem;
    text-align: start;
    font-size: 12px;
    font-weight: 400;
    color: rgb(51 65 85);
    transition: background-color 0.15s ease;
}
.dark .course-menu-item {
    color: rgb(226 232 240);
}
.course-menu-item:hover {
    background: rgb(248 250 252);
}
.dark .course-menu-item:hover {
    background: rgb(31 41 55);
}
.course-menu-icon {
    display: flex;
    height: 1.5rem;
    width: 1.5rem;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border-radius: 0.55rem;
    background: rgb(241 245 249);
    color: currentColor;
}
.dark .course-menu-icon {
    background: rgb(17 24 39);
}
</style>
