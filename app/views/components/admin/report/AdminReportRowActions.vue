<template>
    <div class="inline-flex items-center justify-center">
        <button
            ref="trigger"
            type="button"
            class="inline-flex h-8 w-8 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            :class="open ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white' : ''"
            aria-label="عملیات گزارش"
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
                <button type="button" class="report-menu-item" @click="emitAction('view')">
                    <span class="report-menu-icon">
                        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" stroke="currentColor" stroke-width="1.8" /><circle cx="12" cy="12" r="2.4" stroke="currentColor" stroke-width="1.8" /></svg>
                    </span>
                    نمایش گزارش
                </button>
                <button v-if="canGoToContent" type="button" class="report-menu-item" @click="emitAction('goto')">
                    <span class="report-menu-icon">
                        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><path d="M7 17 17 7M8 7h9v9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
                    </span>
                    رفتن به محتوا
                </button>
                <button v-if="!item.status" type="button" class="report-menu-item" @click="emitAction('resolve')">
                    <span class="report-menu-icon">
                        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><path d="M5 12.5 9.2 16.5 19 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
                    </span>
                    بررسی‌شده
                </button>
                <button v-else type="button" class="report-menu-item" @click="emitAction('unresolve')">
                    <span class="report-menu-icon">
                        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><path d="M6 12h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
                    </span>
                    بررسی‌نشده
                </button>
                <div v-if="item.reportable" class="my-1 h-px bg-gray-100 dark:bg-white/10"></div>
                <button v-if="item.reportable && !deactivated" type="button" class="report-menu-item text-amber-600 dark:text-amber-400" @click="emitAction('deactivate')">
                    <span class="report-menu-icon">
                        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.8" /><path d="M8 8l8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" /></svg>
                    </span>
                    غیرفعال کردن محتوا
                </button>
                <button v-if="item.reportable && deactivated" type="button" class="report-menu-item text-emerald-600 dark:text-emerald-400" @click="emitAction('activate')">
                    <span class="report-menu-icon">
                        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><path d="M5 12.5 9.2 16.5 19 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
                    </span>
                    فعال کردن محتوا
                </button>
                <button v-if="item.reportable" type="button" class="report-menu-item text-rose-600 dark:text-rose-400" @click="emitAction('delete-content')">
                    <span class="report-menu-icon">
                        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M9 7V5h6v2M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
                    </span>
                    حذف محتوا
                </button>
                <button type="button" class="report-menu-item text-rose-600 dark:text-rose-400" @click="emitAction('delete-report')">
                    <span class="report-menu-icon">
                        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M9 7V5h6v2M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
                    </span>
                    حذف گزارش
                </button>
            </div>
        </Teleport>
    </div>
</template>

<script>
export default {
    props: {
        item: { type: Object, required: true },
        canGoToContent: { type: Boolean, default: false },
        deactivated: { type: Boolean, default: false },
    },
    emits: ['view', 'goto', 'resolve', 'unresolve', 'deactivate', 'activate', 'delete-content', 'delete-report'],
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
        updateMenuPosition() {
            const trigger = this.$refs.trigger;
            if (!trigger) return;

            const rect = trigger.getBoundingClientRect();
            const menuWidth = 208;
            const menuHeight = this.$refs.menu?.offsetHeight || 280;
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
.report-menu-item {
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
.dark .report-menu-item {
    color: rgb(226 232 240);
}
.report-menu-item:hover {
    background: rgb(248 250 252);
}
.dark .report-menu-item:hover {
    background: rgb(31 41 55);
}
.report-menu-icon {
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
.dark .report-menu-icon {
    background: rgb(17 24 39);
}
</style>
