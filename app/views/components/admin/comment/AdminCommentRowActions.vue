<template>
    <div class="inline-flex items-center justify-center">
        <button
            ref="trigger"
            type="button"
            class="inline-flex h-8 w-8 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            :class="open ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white' : ''"
            aria-label="عملیات نظر"
            @click.stop="toggleOpen">
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
                @click.stop>
                <button type="button" class="comment-menu-item" @click="emitAction('view')">
                    <span class="comment-menu-icon">
                        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" stroke="currentColor" stroke-width="1.8" /><circle cx="12" cy="12" r="2.4" stroke="currentColor" stroke-width="1.8" /></svg>
                    </span>
                    مشاهده
                </button>
                <button type="button" class="comment-menu-item" @click="emitAction('edit')">
                    <span class="comment-menu-icon">
                        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                            <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                            <path d="M13.5 6.5l3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                        </svg>
                    </span>
                    ویرایش
                </button>
                <button type="button" class="comment-menu-item" @click="emitAction('reply')">
                    <span class="comment-menu-icon">
                        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                            <path d="M20 12.5v3.2A3.3 3.3 0 0 1 16.7 19H7.8L4 21.2V8.3A3.3 3.3 0 0 1 7.3 5h4.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M15 4.5h5M17.5 2v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                        </svg>
                    </span>
                    پاسخ
                </button>
                <button
                    v-if="status !== 'approved'"
                    type="button"
                    class="comment-menu-item"
                    :disabled="approving"
                    @click="emitStatus('approved')">
                    <span class="comment-menu-icon text-emerald-600 dark:text-emerald-400">
                        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><path d="M5 12.5 9.2 16.5 19 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
                    </span>
                    تایید
                </button>
                <button
                    v-if="status !== 'rejected'"
                    type="button"
                    class="comment-menu-item text-rose-600 dark:text-rose-400"
                    :disabled="approving"
                    @click="emitStatus('rejected')">
                    <span class="comment-menu-icon">
                        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
                    </span>
                    رد
                </button>
                <button
                    v-if="status !== 'pending'"
                    type="button"
                    class="comment-menu-item"
                    :disabled="approving"
                    @click="emitStatus('pending')">
                    <span class="comment-menu-icon text-amber-600 dark:text-amber-400">
                        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.8" /><path d="M12 8v4l2.5 1.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
                    </span>
                    در انتظار بررسی
                </button>
                <div class="my-1 h-px bg-gray-100 dark:bg-white/10"></div>
                <button
                    type="button"
                    class="comment-menu-item text-rose-600 dark:text-rose-400"
                    :disabled="deleting"
                    @click="emitAction('delete')">
                    <span class="comment-menu-icon">
                        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M9 7V5h6v2M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
                    </span>
                    حذف
                </button>
            </div>
        </Teleport>
    </div>
</template>

<script>
import { normalizeCommentStatus } from "@/utils/commentStatus";

export default {
    props: {
        item: { type: Object, required: true },
        approving: { type: Boolean, default: false },
        deleting: { type: Boolean, default: false },
    },
    emits: ['view', 'edit', 'reply', 'set-status', 'delete'],
    computed: {
        status() {
            return normalizeCommentStatus(this.item);
        },
    },
    data() {
        return {
            open: false,
            menuStyle: {},
        };
    },
    watch: {
        open(val) {
            if (val) {
                this.$nextTick(() => {
                    this.updateMenuPosition();
                    this.$nextTick(() => this.updateMenuPosition());
                });
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
        emitAction(name) {
            this.close();
            this.$emit(name, this.item);
        },
        emitStatus(status) {
            this.close();
            this.$emit('set-status', this.item, status);
        },
        updateMenuPosition() {
            const trigger = this.$refs.trigger;
            if (!trigger) return;

            const rect = trigger.getBoundingClientRect();
            const menuWidth = 208;
            const menuHeight = this.$refs.menu?.offsetHeight || 320;
            const gap = 6;
            const padding = 8;

            let top = rect.bottom + gap;
            let left = rect.left;

            if (left + menuWidth > window.innerWidth - padding) {
                left = rect.right - menuWidth;
            }
            if (left < padding) left = padding;
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
    },
};
</script>

<style scoped>
.comment-menu-item {
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
.comment-menu-item:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
.dark .comment-menu-item {
    color: rgb(226 232 240);
}
.comment-menu-item:hover:not(:disabled) {
    background: rgb(248 250 252);
}
.dark .comment-menu-item:hover:not(:disabled) {
    background: rgb(31 41 55);
}
.comment-menu-icon {
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
.dark .comment-menu-icon {
    background: rgb(17 24 39);
}
</style>
