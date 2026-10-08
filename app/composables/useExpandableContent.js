import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';

export function useExpandableContent(contentRef, { maxLines = 5, source = null } = {}) {
    const expanded = ref(false);
    const isTruncatable = ref(false);
    const collapsedHeight = ref(0);
    const fullHeight = ref(0);

    function measure() {
        const el = contentRef.value;
        if (!el) return;

        const style = window.getComputedStyle(el);
        let lineHeight = parseFloat(style.lineHeight);
        if (Number.isNaN(lineHeight)) {
            lineHeight = parseFloat(style.fontSize) * 2;
        }

        const maxCollapsed = Math.ceil(lineHeight * maxLines);
        const full = el.scrollHeight;

        collapsedHeight.value = maxCollapsed;
        fullHeight.value = full;
        isTruncatable.value = full > maxCollapsed + 2;

        if (!isTruncatable.value) {
            expanded.value = false;
        }
    }

    function toggle() {
        expanded.value = !expanded.value;
    }

    function collapse() {
        expanded.value = false;
    }

    const maxHeightStyle = computed(() => {
        if (!isTruncatable.value) return null;
        const height = expanded.value ? fullHeight.value : collapsedHeight.value;
        return `${height}px`;
    });

    let resizeObserver = null;

    onMounted(async () => {
        await nextTick();
        measure();

        if (contentRef.value) {
            resizeObserver = new ResizeObserver(() => measure());
            resizeObserver.observe(contentRef.value);
        }

        window.addEventListener('resize', measure);
    });

    onBeforeUnmount(() => {
        resizeObserver?.disconnect();
        window.removeEventListener('resize', measure);
    });

    if (source) {
        watch(source, async () => {
            expanded.value = false;
            await nextTick();
            measure();
        });
    }

    watch(expanded, async () => {
        await nextTick();
        measure();
    });

    return {
        expanded,
        isTruncatable,
        toggle,
        collapse,
        maxHeightStyle,
        measure,
    };
}
