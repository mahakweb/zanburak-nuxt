<template>
    <div class="min-w-0">
        <button
            ref="trigger"
            type="button"
            class="group w-full text-start focus:outline-none"
            :class="wide ? 'max-w-none' : 'max-w-[16.5rem]'"
            @click="onClick"
            @mouseenter="onEnter"
            @mouseleave="onLeave">
            <div
                class="rounded-lg bg-gray-50/90 px-2 py-1.5 transition group-hover:bg-gray-100/90 dark:bg-gray-800/40 dark:group-hover:bg-gray-800/70">
                <p dir="auto" class="text-[11px] leading-5 text-gray-600 dark:text-gray-300 line-clamp-2">
                    {{ previewText }}
                </p>
            </div>
        </button>

        <Teleport to="body">
            <div
                v-if="hoverOpen && previewText !== emptyLabel"
                ref="card"
                :style="cardStyle"
                class="pointer-events-none fixed z-[320] w-72 max-w-[min(18rem,calc(100vw-1rem))] rounded-xl border border-gray-100 bg-white p-2.5 shadow-xl shadow-slate-900/15 dark:border-white/10 dark:bg-gray-900"
                @mouseenter="onEnter"
                @mouseleave="onLeave">
                <p dir="auto" class="text-[11px] leading-5 text-gray-600 dark:text-gray-300 line-clamp-6 whitespace-pre-wrap">
                    {{ previewText }}
                </p>
            </div>
        </Teleport>
    </div>
</template>

<script>
function stripCommentText(text) {
    if (!text) return '';
    return String(text)
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/<\/?[^>]+>/g, ' ')
        .replace(/[#>*_~|]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

export default {
    props: {
        text: { type: String, default: '' },
        wide: { type: Boolean, default: false },
    },
    emits: ['open'],
    data() {
        return {
            hoverOpen: false,
            cardStyle: {},
            hoverTimer: null,
            emptyLabel: 'بدون متن',
        };
    },
    computed: {
        previewText() {
            return stripCommentText(this.text) || this.emptyLabel;
        },
    },
    mounted() {
        window.addEventListener('scroll', this.onScrollOrResize, true);
        window.addEventListener('resize', this.onScrollOrResize);
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.onScrollOrResize, true);
        window.removeEventListener('resize', this.onScrollOrResize);
        clearTimeout(this.hoverTimer);
    },
    methods: {
        onClick() {
            clearTimeout(this.hoverTimer);
            this.hoverOpen = false;
            this.$emit('open');
        },
        onEnter() {
            clearTimeout(this.hoverTimer);
            this.hoverTimer = setTimeout(() => {
                this.hoverOpen = true;
                this.$nextTick(() => this.updateCardPosition());
            }, 140);
        },
        onLeave() {
            clearTimeout(this.hoverTimer);
            this.hoverTimer = setTimeout(() => {
                this.hoverOpen = false;
            }, 80);
        },
        updateCardPosition() {
            const trigger = this.$refs.trigger;
            if (!trigger) return;

            const rect = trigger.getBoundingClientRect();
            const cardWidth = this.$refs.card?.offsetWidth || 288;
            const cardHeight = this.$refs.card?.offsetHeight || 140;
            const gap = 8;
            const padding = 8;

            let top = rect.bottom + gap;
            let left = rect.left;

            if (left + cardWidth > window.innerWidth - padding) {
                left = rect.right - cardWidth;
            }
            if (left < padding) left = padding;
            if (top + cardHeight > window.innerHeight - padding) {
                top = Math.max(padding, rect.top - cardHeight - gap);
            }

            this.cardStyle = {
                top: `${top}px`,
                left: `${left}px`,
            };
        },
        onScrollOrResize() {
            if (this.hoverOpen) this.updateCardPosition();
        },
    },
};
</script>
