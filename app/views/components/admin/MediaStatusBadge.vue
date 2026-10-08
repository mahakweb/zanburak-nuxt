<template>
    <span
        class="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap"
        :class="toneClass"
    >
        <svg v-if="spinning" class="w-3 h-3 animate-spin shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <span v-else class="w-1.5 h-1.5 rounded-full shrink-0" :class="dotClass"></span>
        {{ label }}
    </span>
</template>

<script>
const STATUS_MAP = {
    idle: { label: 'آماده', tone: 'muted' },
    pending: { label: 'در انتظار آپلود', tone: 'warn' },
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
                    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300';
                case 'warn':
                    return 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300';
                case 'info':
                    return 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300';
                case 'bad':
                    return 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300';
                default:
                    return 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400';
            }
        },
        dotClass() {
            switch (this.meta.tone) {
                case 'ok':
                    return 'bg-emerald-500';
                case 'warn':
                    return 'bg-amber-500';
                case 'info':
                    return 'bg-sky-500';
                case 'bad':
                    return 'bg-rose-500';
                default:
                    return 'bg-gray-400';
            }
        },
    },
};
</script>
