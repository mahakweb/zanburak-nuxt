<template>
    <div ref="root" class="inline-flex items-center justify-center">
        <button
            ref="trigger"
            type="button"
            @click.stop="toggleOpen"
            class="flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            :class="open ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : ''"
            aria-label="عملیات مقاله">
            <svg class="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="3" r="1.5" />
                <circle cx="8" cy="8" r="1.5" />
                <circle cx="8" cy="13" r="1.5" />
            </svg>
        </button>

        <Teleport to="body">
            <div v-if="open" class="fixed inset-0 z-[190]" @click="close" />
            <div
                v-if="open"
                ref="menu"
                :style="menuStyle"
                class="fixed z-[200] py-1.5 rounded-xl bg-white dark:bg-gray-900 shadow-xl ring-1 ring-gray-200/80 dark:ring-gray-700/80 overflow-hidden"
                @click.stop>
                <button type="button" @click="onView"
                    class="menu-item">
                    <svg class="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    مشاهده جزئیات
                </button>

                <template v-if="!trashed">
                    <router-link v-can="['articles.update', 'articles.update.own', 'articles.update.any']"
                        :to="{ name: 'admin-article-edit', params: { id: article.id } }"
                        class="menu-item" @click="close">
                        <svg class="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        ویرایش
                    </router-link>
                    <button v-can="['articles.publish', 'articles.publish.own', 'articles.publish.any', 'articles.unpublish']"
                        type="button" @click="onTogglePublish" class="menu-item">
                        <svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ article.publish ? 'تبدیل به پیش‌نویس' : 'انتشار مقاله' }}
                    </button>
                    <div class="my-1 mx-2 border-t border-gray-100 dark:border-gray-800" />
                    <button v-can="['articles.delete', 'articles.delete.own', 'articles.delete.any']"
                        type="button" @click="onDelete" class="menu-item menu-item-danger">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        انتقال به سطل زباله
                    </button>
                </template>

                <template v-else>
                    <button v-can="['articles.update', 'articles.update.own', 'articles.update.any']"
                        type="button" @click="onRestore" class="menu-item">
                        <svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        بازیابی
                    </button>
                    <div class="my-1 mx-2 border-t border-gray-100 dark:border-gray-800" />
                    <button v-can="['articles.delete.any']"
                        type="button" @click="onForceDelete" class="menu-item menu-item-danger">
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        حذف دائمی
                    </button>
                </template>
            </div>
        </Teleport>
    </div>
</template>

<script>
export default {
    props: {
        article: { type: Object, required: true },
        trashed: { type: Boolean, default: false },
    },
    emits: ['view', 'toggle-publish', 'restore', 'force-delete', 'delete'],
    data() {
        return {
            open: false,
            menuStyle: {},
        };
    },
    watch: {
        open(val) {
            if (val) {
                this.$nextTick(() => this.updateMenuPosition());
            }
        },
    },
    mounted() {
        window.addEventListener('scroll', this.onScrollOrResize, true);
        window.addEventListener('resize', this.onScrollOrResize);
        document.addEventListener('keydown', this.onEscape);
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.onScrollOrResize, true);
        window.removeEventListener('resize', this.onScrollOrResize);
        document.removeEventListener('keydown', this.onEscape);
    },
    methods: {
        toggleOpen() {
            this.open = !this.open;
        },
        close() {
            this.open = false;
        },
        updateMenuPosition() {
            const trigger = this.$refs.trigger;
            if (!trigger) return;

            const rect = trigger.getBoundingClientRect();
            const menuWidth = 208;
            const menuHeight = this.$refs.menu?.offsetHeight || 220;
            const gap = 6;
            const padding = 8;

            let top = rect.bottom + gap;
            let left = rect.right - menuWidth;

            if (left < padding) left = padding;
            if (left + menuWidth > window.innerWidth - padding) {
                left = window.innerWidth - menuWidth - padding;
            }
            if (top + menuHeight > window.innerHeight - padding) {
                top = Math.max(padding, rect.top - menuHeight - gap);
            }

            this.menuStyle = {
                top: `${top}px`,
                left: `${left}px`,
                width: `${menuWidth}px`,
            };
        },
        onScrollOrResize() {
            if (this.open) this.updateMenuPosition();
        },
        onEscape(e) {
            if (e.key === 'Escape') this.close();
        },
        onView() {
            this.close();
            this.$emit('view', this.article);
        },
        onTogglePublish() {
            this.close();
            this.$emit('toggle-publish', this.article);
        },
        onRestore() {
            this.close();
            this.$emit('restore', this.article);
        },
        onForceDelete() {
            this.close();
            this.$emit('force-delete', this.article);
        },
        onDelete() {
            this.close();
            this.$emit('delete', this.article);
        },
    },
};
</script>

<style scoped>
.menu-item {
    @apply flex w-full items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/80 transition-colors text-start;
}
.menu-item-danger {
    @apply text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30;
}
</style>
