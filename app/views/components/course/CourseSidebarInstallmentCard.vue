<template>
    <div
        v-if="visible"
        class="installment-card group relative mb-4 overflow-hidden rounded-[1.25rem] border border-sky-200/80 bg-white shadow-[0_10px_40px_-12px_rgba(14,165,233,0.12)] dark:border-sky-500/25 dark:bg-gray-900 dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.55)]">
        <div
            class="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-500/[0.07] via-transparent to-transparent dark:from-sky-950/70 dark:via-gray-900 dark:to-gray-900"
            aria-hidden="true"></div>
        <div
            class="pointer-events-none absolute -top-12 -end-12 h-32 w-32 rounded-full bg-sky-400/20 blur-3xl dark:bg-sky-600/10"
            aria-hidden="true"></div>

        <div class="relative p-4">
            <div class="mb-3 flex items-center justify-between gap-3">
                <div class="min-w-0">
                    <p class="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500">
                        {{ $t('course.sidebar.installmentCard.label') }}
                    </p>
                    <div class="mt-1.5 inline-flex max-w-full items-center gap-2 rounded-full border border-sky-200/80 bg-sky-50 px-2.5 py-1 text-sky-800 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300">
                        <span class="relative flex h-2 w-2 shrink-0 rounded-full bg-sky-500 dark:bg-sky-400"></span>
                        <span class="truncate text-[11px] font-bold">{{ $t('course.installment.badge') }}</span>
                    </div>
                </div>

                <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-sky-200/70 bg-white dark:border-sky-500/35 dark:bg-gray-800">
                    <img
                        :src="digipayIcon"
                        alt="DigiPay"
                        class="h-7 w-7 object-contain"
                        loading="lazy" />
                </div>
            </div>

            <h3 class="text-[15px] font-bold leading-snug tracking-tight text-gray-900 dark:text-gray-50">
                {{ $t('course.sidebar.installmentCard.headline') }}
            </h3>
            <p class="mt-2 text-xs leading-6 text-gray-500 dark:text-gray-400">
                {{ $t('course.sidebar.installmentCard.description') }}
            </p>
        </div>
    </div>
</template>

<script>
import digipayIcon from '@/assets/image/gateways/has-bg/digipay.png';

export default {
    props: {
        course: {
            type: Object,
            required: true,
        },
    },
    data() {
        return { digipayIcon };
    },
    computed: {
        visible() {
            return Boolean(this.course?.allows_installment && Number(this.course?.price) > 0);
        },
    },
};
</script>
