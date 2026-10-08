<template>
    <div
        class="flex flex-wrap items-center justify-center gap-x-1 gap-y-1 font-anjoman text-xs sm:text-sm font-semibold tabular-nums"
        role="timer"
        :aria-label="accessibleLabel"
    >
        <span class="inline-flex items-center gap-1 rounded-md bg-black/10 dark:bg-white/10 px-1.5 py-0.5">
            <span>{{ padded.days }}</span>
            <span class="text-[10px] font-medium opacity-80">{{ $t('promo.days') }}</span>
        </span>
        <span aria-hidden="true">:</span>
        <span class="inline-flex items-center gap-1 rounded-md bg-black/10 dark:bg-white/10 px-1.5 py-0.5">
            <span>{{ padded.hours }}</span>
            <span class="text-[10px] font-medium opacity-80">{{ $t('promo.hours') }}</span>
        </span>
        <span aria-hidden="true">:</span>
        <span class="inline-flex items-center gap-1 rounded-md bg-black/10 dark:bg-white/10 px-1.5 py-0.5">
            <span>{{ padded.minutes }}</span>
            <span class="text-[10px] font-medium opacity-80">{{ $t('promo.minutes') }}</span>
        </span>
        <span aria-hidden="true">:</span>
        <span class="inline-flex items-center gap-1 rounded-md bg-black/10 dark:bg-white/10 px-1.5 py-0.5">
            <span>{{ padded.seconds }}</span>
            <span class="text-[10px] font-medium opacity-80">{{ $t('promo.seconds') }}</span>
        </span>
        <span class="sr-only" aria-live="polite">{{ accessibleLabel }}</span>
    </div>
</template>

<script>
export default {
    name: "CountdownTimer",
    props: {
        endsAt: { type: String, required: true },
        serverNow: { type: String, default: null },
    },
    emits: ["expired"],
    data() {
        const clientNow = Date.now();
        const serverMs = this.serverNow ? Date.parse(this.serverNow) : clientNow;
        return {
            skew: Number.isFinite(serverMs) ? clientNow - serverMs : 0,
            remainingMs: 0,
            expiredEmitted: false,
            timer: null,
        };
    },
    computed: {
        parts() {
            const total = Math.max(0, this.remainingMs);
            const seconds = Math.floor(total / 1000);
            return {
                days: Math.floor(seconds / 86400),
                hours: Math.floor((seconds % 86400) / 3600),
                minutes: Math.floor((seconds % 3600) / 60),
                seconds: seconds % 60,
            };
        },
        padded() {
            const pad = (n) => String(n).padStart(2, "0");
            return {
                days: pad(this.parts.days),
                hours: pad(this.parts.hours),
                minutes: pad(this.parts.minutes),
                seconds: pad(this.parts.seconds),
            };
        },
        accessibleLabel() {
            return `${this.padded.days} ${this.$t("promo.days")} ${this.padded.hours} ${this.$t("promo.hours")} ${this.padded.minutes} ${this.$t("promo.minutes")} ${this.padded.seconds} ${this.$t("promo.seconds")}`;
        },
    },
    mounted() {
        this.tick();
        this.timer = setInterval(this.tick, 1000);
    },
    beforeUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    },
    methods: {
        tick() {
            const end = Date.parse(this.endsAt);
            if (!Number.isFinite(end)) {
                this.remainingMs = 0;
                this.emitExpired();
                return;
            }
            this.remainingMs = end - (Date.now() - this.skew);
            if (this.remainingMs <= 0) {
                this.remainingMs = 0;
                this.emitExpired();
            }
        },
        emitExpired() {
            if (this.expiredEmitted) {
                return;
            }
            this.expiredEmitted = true;
            this.$emit("expired");
        },
    },
};
</script>
