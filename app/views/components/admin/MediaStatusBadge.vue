<template>
    <span
        class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap shadow-xs transition-colors"
        :class="toneClass"
    >
        <svg v-if="spinning" class="w-3.5 h-3.5 animate-spin shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <span v-else class="w-2 h-2 rounded-full shrink-0" :class="dotClass"></span>
        {{ label }}
    </span>
</template>

<script>
const STATUS_MAP = {
    idle: { label: 'آماده', tone: 'muted' },
    pending: { label: 'در انتظار آپلود', tone: 'warn' },
    'local-pending': { label: 'آماده پردازش محلی', tone: 'info' },
    'local-processing': { label: 'در حال پردازش محلی', tone: 'info', spin: true },
    uploading: { label: 'در حال آپلود', tone: 'info', spin: true },
    uploaded: { label: 'آپلود شد', tone: 'ok' },
    queued: { label: 'در صف پردازش', tone: 'info' },
    processing: { label: 'در حال پردازش', tone: 'info', spin: true },
    processed: { label: 'پردازش شد', tone: 'ok' },
    error: { label: 'ناموفق', tone: 'bad' },
    'upload-error': { label: 'خطا در آپلود', tone: 'bad' },
    'processing-error': { label: 'خطا در پردازش', tone: 'bad' },
    failed: { label: 'پردازش ناموفق', tone: 'bad' },
};

export default {
    name: 'MediaStatusBadge',
    props: {
        status: { type: String, default: 'idle' },
        percent: { type: [Number, String], default: null },
        extra: { type: String, default: '' },
    },
    computed: {
        meta() {
            return STATUS_MAP[this.status] || STATUS_MAP.idle;
        },
        spinning() {
            return !!this.meta.spin;
        },
        label() {
            const parts = [this.meta.label];
            if (this.status === 'uploading' && this.percent != null && this.percent !== '') {
                parts[0] = `${this.meta.label} ${Math.round(Number(this.percent) || 0)}٪`;
            }
            if (this.extra) parts.push(this.extra);
            return parts.join(' · ');
        },
        toneClass() {
            switch (this.meta.tone) {
                case 'ok':
                    return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/25 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/30';
                case 'warn':
                    return 'bg-amber-50 text-amber-800 ring-1 ring-amber-500/25 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-400/30';
                case 'info':
                    return 'bg-sky-50 text-sky-700 ring-1 ring-sky-500/25 dark:bg-sky-500/15 dark:text-sky-300 dark:ring-sky-400/30';
                case 'bad':
                    return 'bg-rose-50 text-rose-700 ring-1 ring-rose-500/25 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-400/30';
                default:
                    return 'bg-gray-100 text-gray-600 ring-1 ring-gray-400/25 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-600/30';
            }
        },
        dotClass() {
            switch (this.meta.tone) {
                case 'ok':
                    return 'bg-emerald-500 ring-2 ring-emerald-300/50 dark:ring-emerald-400/30';
                case 'warn':
                    return 'bg-amber-500 ring-2 ring-amber-300/50 dark:ring-amber-400/30';
                case 'info':
                    return 'bg-sky-500 ring-2 ring-sky-300/50 dark:ring-sky-400/30';
                case 'bad':
                    return 'bg-rose-500 ring-2 ring-rose-300/50 dark:ring-rose-400/30';
                default:
                    return 'bg-gray-400 ring-2 ring-gray-300/50 dark:ring-gray-600/30';
            }
        },
    },
};
</script>
