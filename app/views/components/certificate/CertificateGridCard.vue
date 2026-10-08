<template>
    <article
        class="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white transition-all duration-300 hover:border-amber-300/60 hover:shadow-lg hover:shadow-amber-500/5 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-amber-500/25"
    >
        <div
            class="h-1 transition-colors"
            :class="isIssued ? 'bg-gradient-to-l from-emerald-400 via-emerald-300 to-emerald-200/60' : 'bg-gradient-to-l from-amber-400 via-amber-300 to-amber-200/60'"
        />

        <!-- Certificate preview -->
        <div class="relative px-3 pt-3 pb-0">
            <div class="relative h-36 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 ring-1 ring-gray-200/60 dark:ring-gray-700/60 overflow-hidden flex items-center justify-center">
                <div class="absolute inset-0 cert-preview-shimmer opacity-40 pointer-events-none" />

                <img
                    v-if="templatePreviewUrl"
                    :src="templatePreviewUrl"
                    :alt="item.template?.name || 'قالب گواهینامه'"
                    class="relative z-[1] max-h-[7.5rem] max-w-[88%] w-auto object-contain rounded shadow-md ring-1 ring-gray-200/50 dark:ring-gray-700/50 bg-white dark:bg-gray-900 transition-transform duration-500 group-hover:scale-[1.02]"
                    onerror="this.style.display='none'"
                />
                <div
                    v-else
                    class="relative z-[1] rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-900/70 flex flex-col items-center justify-center gap-1.5 p-3 shadow-sm w-28 h-20"
                >
                    <div class="w-8 h-1 rounded-full bg-amber-400"></div>
                    <div class="w-16 h-1.5 rounded bg-gray-200 dark:bg-gray-700"></div>
                    <div class="w-12 h-1 rounded bg-gray-100 dark:bg-gray-800"></div>
                    <div class="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 ring-2 ring-amber-400/30 mt-0.5"></div>
                </div>

                <!-- Issued stamp animation -->
                <div
                    v-if="isIssued"
                    class="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
                >
                    <div class="cert-issued-stamp">
                        <div class="cert-issued-stamp-inner">
                            <svg class="w-8 h-8 text-emerald-600/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span class="text-[10px] font-black tracking-wider text-emerald-700/90 mt-0.5">صادر شده</span>
                        </div>
                    </div>
                </div>

                <div class="absolute top-2 start-2 z-20" @click.stop>
                    <AdminBulkCheckbox
                        :model-value="selectedIds"
                        :value="item.id"
                        @update:model-value="$emit('update:selectedIds', $event)"
                    />
                </div>

                <span
                    class="absolute top-2 end-2 z-20 text-[10px] font-bold px-2 py-0.5 rounded-lg backdrop-blur-sm shadow-sm"
                    :class="isIssued
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-amber-400/90 text-gray-900'"
                >
                    {{ isIssued ? 'صادر شده' : 'در انتظار' }}
                </span>

                <span
                    v-if="item.template?.name"
                    class="absolute bottom-2 start-2 z-20 max-w-[70%] truncate text-[9px] font-semibold px-2 py-0.5 rounded-md bg-black/55 text-white backdrop-blur-sm"
                    :title="item.template.name"
                >
                    {{ item.template.name }}
                </span>
            </div>
        </div>

        <!-- Body -->
        <div class="flex flex-1 flex-col p-3.5 pt-3">
            <div class="flex items-start gap-2.5">
                <div class="shrink-0 w-9 h-9 rounded-full border-2 border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                        v-if="item.user?.profile_pic"
                        :src="item.user.profile_pic"
                        :alt="displayUserName"
                        class="w-full h-full object-cover"
                        onerror="this.style.display='none'"
                    />
                    <div v-else class="flex h-full w-full items-center justify-center text-[10px] font-bold text-gray-400">
                        {{ userInitials }}
                    </div>
                </div>
                <div class="min-w-0 flex-1">
                    <h3 class="text-[13px] font-bold text-gray-900 dark:text-white line-clamp-1" :title="displayUserName">
                        {{ displayUserName }}
                    </h3>
                    <p class="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-1">{{ item.user?.email || '—' }}</p>
                </div>
                <div class="shrink-0" @click.stop>
                    <Popover class="relative flex items-center justify-center">
                        <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-30" />
                        <PopoverButton class="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 focus:outline-none group-focus-within:z-30 dark:hover:bg-gray-800 dark:hover:text-gray-200">
                            <svg class="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                            </svg>
                        </PopoverButton>
                        <transition
                            enter-active-class="transition duration-200 ease-out"
                            enter-from-class="translate-y-1 opacity-0"
                            enter-to-class="translate-y-0 opacity-100"
                            leave-active-class="transition duration-150 ease-in"
                            leave-from-class="translate-y-0 opacity-100"
                            leave-to-class="translate-y-1 opacity-0"
                        >
                            <PopoverPanel class="absolute top-full end-0 z-30 mt-2 flex w-max min-w-[8.5rem] flex-col rounded-lg bg-white p-2 text-start shadow-lg dark:bg-gray-900">
                                <ul class="text-xs font-semibold text-gray-700 dark:text-gray-200">
                                    <li>
                                        <button type="button" class="block w-full px-4 py-2 text-start hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" @click="$emit('details', item.uuid)">جزئیات</button>
                                    </li>
                                    <li v-if="!isIssued">
                                        <button type="button" class="block w-full px-4 py-2 text-start hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" @click="$emit('issue', item.uuid)">صدور گواهینامه</button>
                                    </li>
                                    <li>
                                        <button type="button" class="block w-full px-4 py-2 text-start hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" @click="$emit('edit', item)">ویرایش</button>
                                    </li>
                                    <li>
                                        <button type="button" class="block w-full px-4 py-2 text-start text-red-500 hover:rounded-lg hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-600" @click="$emit('delete', item.uuid)">حذف</button>
                                    </li>
                                </ul>
                            </PopoverPanel>
                        </transition>
                    </Popover>
                </div>
            </div>

            <div class="mt-2.5 flex items-center gap-2 rounded-xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 p-2">
                <div class="shrink-0 w-10 h-7 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                    <img v-if="item.course?.poster" :src="item.course.poster" :alt="displayCourseTitle" class="w-full h-full object-cover" onerror="this.style.display='none'" />
                </div>
                <p class="text-[11px] font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 leading-4">{{ displayCourseTitle }}</p>
            </div>

            <div class="mt-3 flex flex-wrap items-center gap-1.5">
                <span v-if="item.serial_number" class="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 max-w-full truncate" :title="item.serial_number">
                    {{ item.serial_number }}
                </span>
                <span class="inline-flex items-center text-[10px] font-medium px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    {{ formatDuration(item.time_completed) }}
                </span>
                <span v-if="isIssued" dir="ltr" class="inline-flex items-center text-[10px] font-medium px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-900/25 dark:text-emerald-400">
                    {{ formatDate(item.issued_at) }}
                </span>
            </div>
        </div>
    </article>
</template>

<script>
import AdminBulkCheckbox from '@/views/components/admin/AdminBulkCheckbox.vue';
import { Popover, PopoverButton, PopoverPanel, PopoverOverlay } from '@headlessui/vue';
import { formatCertificateDuration } from '@/utils/certificateDisplay';

export default {
    components: { AdminBulkCheckbox, Popover, PopoverButton, PopoverPanel, PopoverOverlay },
    props: {
        item: { type: Object, required: true },
        selectedIds: { type: Array, required: true },
    },
    emits: ['update:selectedIds', 'details', 'issue', 'edit', 'delete'],
    computed: {
        isIssued() {
            return !!this.item.issued_at;
        },
        templatePreviewUrl() {
            return this.item.template?.background_image_url || null;
        },
        displayUserName() {
            if (this.item.user_name) return this.item.user_name;
            if (this.item.user) return `${this.item.user.first_name || ''} ${this.item.user.last_name || ''}`.trim();
            return 'نامشخص';
        },
        displayCourseTitle() {
            return this.item.course_title || this.item.course?.title || 'نامشخص';
        },
        userInitials() {
            const name = this.displayUserName;
            const parts = name.split(' ').filter(Boolean);
            if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
            return (name[0] || '?').toUpperCase();
        },
    },
    methods: {
        formatDuration(minutes) {
            return formatCertificateDuration(minutes, 'fa');
        },
        formatDate(dateString) {
            if (!dateString) return '—';
            const date = new Date(dateString);
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        },
    },
};
</script>

<style scoped>
.line-clamp-1, .line-clamp-2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.line-clamp-1 { -webkit-line-clamp: 1; }
.line-clamp-2 { -webkit-line-clamp: 2; }

.cert-preview-shimmer {
    background: linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.35) 50%, transparent 60%);
    background-size: 200% 100%;
    animation: cert-shimmer 4s ease-in-out infinite;
}

.cert-issued-stamp {
    animation: cert-stamp-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.cert-issued-stamp-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 5.5rem;
    height: 5.5rem;
    border-radius: 9999px;
    border: 3px solid rgba(16, 185, 129, 0.55);
    background: rgba(255, 255, 255, 0.82);
    backdrop-filter: blur(4px);
    transform: rotate(-12deg);
    box-shadow: 0 4px 20px rgba(16, 185, 129, 0.25);
    animation: cert-stamp-pulse 2.5s ease-in-out 0.8s infinite;
}

@keyframes cert-shimmer {
    0%, 100% { background-position: 200% 0; }
    50% { background-position: -200% 0; }
}

@keyframes cert-stamp-in {
    0% { opacity: 0; transform: scale(2.2) rotate(-30deg); }
    100% { opacity: 1; transform: scale(1) rotate(0deg); }
}

@keyframes cert-stamp-pulse {
    0%, 100% { transform: rotate(-12deg) scale(1); }
    50% { transform: rotate(-12deg) scale(1.04); }
}
</style>
