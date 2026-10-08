<template>
    <div class="relative" :class="wrapperClass">
        <div
            v-show="canScrollStart"
            class="pointer-events-none absolute inset-y-0 start-0 w-8 md:w-12 z-10"
            :class="fadeStartClass"
        />
        <div
            v-show="canScrollEnd"
            class="pointer-events-none absolute inset-y-0 end-0 w-8 md:w-12 z-10"
            :class="fadeEndClass"
        />
        <div
            ref="scroller"
            class="admin-h-scroll overflow-x-auto"
            :class="[
                scrollerClass,
                isScrollable && !isDragging ? 'cursor-grab' : '',
                isDragging ? 'cursor-grabbing' : '',
            ]"
            @wheel="onWheel"
            @mousedown="onMouseDown"
            @click.capture="onClickCapture"
            @scroll="updateScrollState"
        >
            <slot />
        </div>
    </div>
</template>

<script>
const FADE_VARIANTS = {
    card: {
        start: 'bg-gradient-to-r from-white dark:from-gray-900 to-transparent',
        end: 'bg-gradient-to-l from-white dark:from-gray-900 to-transparent',
    },
    muted: {
        start: 'bg-gradient-to-r from-gray-50 dark:from-gray-800/80 to-transparent',
        end: 'bg-gradient-to-l from-gray-50 dark:from-gray-800/80 to-transparent',
    },
    surface: {
        start: 'bg-gradient-to-r from-gray-100/90 dark:from-gray-800 to-transparent',
        end: 'bg-gradient-to-l from-gray-100/90 dark:from-gray-800 to-transparent',
    },
};

export default {
    props: {
        wrapperClass: { type: String, default: '' },
        scrollerClass: { type: String, default: '' },
        fadeVariant: {
            type: String,
            default: 'card',
            validator: (v) => ['card', 'muted', 'surface'].includes(v),
        },
    },
    data() {
        return {
            isDragging: false,
            dragStartX: 0,
            scrollStartLeft: 0,
            dragMoved: false,
            canScrollStart: false,
            canScrollEnd: false,
            isScrollable: false,
        };
    },
    computed: {
        fadeStartClass() {
            return FADE_VARIANTS[this.fadeVariant]?.start || FADE_VARIANTS.card.start;
        },
        fadeEndClass() {
            return FADE_VARIANTS[this.fadeVariant]?.end || FADE_VARIANTS.card.end;
        },
    },
    methods: {
        getScroller() {
            return this.$refs.scroller;
        },
        updateScrollState() {
            const el = this.getScroller();
            if (!el) return;

            const maxScroll = el.scrollWidth - el.clientWidth;
            this.isScrollable = maxScroll > 2;
            this.canScrollStart = el.scrollLeft > 2;
            this.canScrollEnd = el.scrollLeft < maxScroll - 2;
        },
        onWheel(e) {
            const el = this.getScroller();
            if (!el || el.scrollWidth <= el.clientWidth + 1) return;

            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                el.scrollLeft += e.deltaY;
            }
        },
        onMouseDown(e) {
            if (e.button !== 0) return;

            const el = this.getScroller();
            if (!el || el.scrollWidth <= el.clientWidth + 1) return;

            this.isDragging = true;
            this.dragMoved = false;
            this.dragStartX = e.pageX;
            this.scrollStartLeft = el.scrollLeft;
            document.addEventListener('mousemove', this.onMouseMove);
            document.addEventListener('mouseup', this.onMouseUp);
        },
        onMouseMove(e) {
            if (!this.isDragging) return;

            const el = this.getScroller();
            const dx = e.pageX - this.dragStartX;
            if (Math.abs(dx) > 4) this.dragMoved = true;
            el.scrollLeft = this.scrollStartLeft - dx;
        },
        onMouseUp() {
            this.isDragging = false;
            document.removeEventListener('mousemove', this.onMouseMove);
            document.removeEventListener('mouseup', this.onMouseUp);
            this.updateScrollState();
        },
        onClickCapture(e) {
            if (this.dragMoved) {
                e.preventDefault();
                e.stopPropagation();
                this.dragMoved = false;
            }
        },
    },
    mounted() {
        this.$nextTick(() => this.updateScrollState());
        this._resizeObserver = new ResizeObserver(() => this.updateScrollState());
        if (this.$refs.scroller) {
            this._resizeObserver.observe(this.$refs.scroller);
        }
    },
    beforeUnmount() {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
        this._resizeObserver?.disconnect();
    },
};
</script>

<style scoped>
.admin-h-scroll {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.admin-h-scroll::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
}
</style>
