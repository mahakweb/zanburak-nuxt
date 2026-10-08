<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { OPEN_CLICK_GRACE_MS } from "@/views/components/messenger/interactionManagers";

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
    /**
     * ارتفاع اولیه:
     * - بین 0 و 1 → نسبت به ارتفاع صفحه (مثلاً 0.5 = 50vh)
     * - بیشتر از 1 → بر حسب پیکسل (مثلاً 400 = 400px)
     */
    initialHeight: {
        type: Number,
        default: 0.4,
    },
    minHeight: {
        type: Number,
        default: 0.2,
    },
    maxHeight: {
        type: Number,
        default: 0.7,
    },
    /**
     * ارتفاع تقریبی بخش هدر برای محاسبه ارتفاع اسکرول محتوا
     */
    headerHeight: {
        type: Number,
        default: 80,
    },
    /**
     * آیا کلیک روی بک‌دراپ دراور را ببندد؟
     */
    closeOnBackdrop: {
        type: Boolean,
        default: true,
    },
    /**
     * امکان درگ برای تغییر ارتفاع
     */
    draggable: {
        type: Boolean,
        default: true,
    },
    /**
     * اگر ارتفاع از حداقل کمتر شد دراور خودکار بسته شود
     */
    autoCloseOnMin: {
        type: Boolean,
        default: false,
    },
    /**
     * اگر ارتفاع از حداکثر بیشتر شد فول‌اسکرین شود
     */
    autoFullscreenOnMax: {
        type: Boolean,
        default: false,
    },
    /**
     * قفل کردن اسکرول صفحه اصلی هنگام باز بودن دراور
     */
    lockScroll: {
        type: Boolean,
        default: true,
    },
    /**
     * کلاس‌های اضافی برای استایل‌دهی بدنه دراور
     */
    panelClass: {
        type: [String, Array, Object],
        default: "",
    },

    showHandle: {
        type: Boolean,
        default: true,
    },
    /**
     * کلاس‌های اضافی برای استایل‌دهی هندل (خط بالای دراور)
     */
    handleClass: {
        type: [String, Array, Object],
        default: "",
    },
    /**
     * کلاس‌های اضافی برای استایل‌دهی محتوای داخل دراور
     */
    contentClass: {
        type: [String, Array, Object],
        default: "",
    },
    /**
     * کلاس‌های اضافی برای استایل‌دهی بک‌دراپ
     */
    backdropClass: {
        type: [String, Array, Object],
        default: "",
    },
    /**
     * کلاس z-index بک‌دراپ (برای نمایش روی اورلی‌های تمام‌صفحه قابل تنظیم است)
     */
    backdropZClass: {
        type: String,
        // بالاتر از ویجت گفتینو (z-index: 2000000002)
        default: "z-[2000000010]",
    },
    /**
     * کلاس z-index خود شیت
     */
    panelZClass: {
        type: String,
        default: "z-[2000000020]",
    },
    /**
     * ارتفاع اولیه بر اساس محتوا تنظیم شود (با رعایت min/max)
     */
    fitContent: {
        type: Boolean,
        default: true,
    },
});

const emit = defineEmits(["update:modelValue", "open", "close"]);

const isOpen = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit("update:modelValue", value);
    },
});

/** Open/close slide durations — snappy ease-out so enter still feels quick. */
const SHEET_ENTER_MS = 340;
const SHEET_LEAVE_MS = 260;
const SHEET_EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const SHEET_EASE_LEAVE = "cubic-bezier(0.2, 0, 0, 1)";

const panelStyle = computed(() => {
    const style = {
        height: `${Math.max(sheetHeightPx.value, 0)}px`,
    };
    // Never set `transition` inline here — it overrides Vue Transition transform
    // and makes the sheet pop in instantly.
    if (keyboardInsetPx.value > 80) {
        style.bottom = `${keyboardInsetPx.value}px`;
    }
    return style;
});

const sheetHeightPx = ref(0);
const minHeightPx = ref(0);
const maxHeightPx = ref(0);
/** Soft-keyboard inset from Visual Viewport — lift the sheet above it. */
const keyboardInsetPx = ref(0);

const panelRef = ref(null);
const contentRef = ref(null);

const isDragging = ref(false);
const dragStartY = ref(0);
const startHeightPx = ref(0);
const previousBodyOverflow = ref(null);
/** Ignore leftover click from the gesture that opened the sheet (e.g. context-menu item). */
const openedAtMs = ref(0);
const userAdjustedHeight = ref(false);

let contentResizeObserver = null;
let contentMutationObserver = null;
let measureRaf = 0;
let enterAnimationTimer = null;
/** True until the first content-fit height is applied for this open cycle. */
let hasFittedOpenHeight = false;

/**
 * Skip observer-driven remeasure while the slide-in runs.
 * Initial fit is forced separately so the sheet never opens oversized then shrinks.
 */
const isPanelEntering = ref(false);

// const contentHeightPx = computed(() => {
//     const h = sheetHeightPx.value - props.headerHeight;
//     return h > 0 ? h : 0;
// });

function parseHeight(value, fallbackFraction) {
    const vh = typeof window !== "undefined" ? window.innerHeight : 0;
    if (!vh) return 0;

    if (typeof value !== "number") {
        return Math.round(vh * fallbackFraction);
    }

    if (value > 0 && value <= 1) {
        return Math.round(vh * value);
    }

    return value;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function setupHeights() {
    const vh = typeof window !== "undefined" ? window.innerHeight : 0;
    if (!vh) return;

    minHeightPx.value = parseHeight(props.minHeight, 0.2);
    maxHeightPx.value = parseHeight(props.maxHeight, 0.9);

    if (!props.fitContent) {
        const initial = parseHeight(props.initialHeight, 0.4);
        sheetHeightPx.value = clamp(initial, minHeightPx.value, maxHeightPx.value);
    }
}

function measureNaturalPanelHeight() {
    const panel = panelRef.value;
    if (!panel) return null;

    const previousHeight = panel.style.height;
    const previousMaxHeight = panel.style.maxHeight;
    const previousOverflow = panel.style.overflow;

    // Let the panel shrink/grow to intrinsic content size (ignore current fixed height).
    panel.style.height = "auto";
    panel.style.maxHeight = "none";
    panel.style.overflow = "visible";

    const rectHeight = Math.ceil(panel.getBoundingClientRect().height);
    const scrollHeight = Math.ceil(panel.scrollHeight);
    const natural = Math.max(rectHeight, scrollHeight);

    panel.style.height = previousHeight;
    panel.style.maxHeight = previousMaxHeight;
    panel.style.overflow = previousOverflow;

    return natural > 0 ? natural : null;
}

function ensureOpenHeight() {
    setupHeights();
    const fallback = parseHeight(props.initialHeight, 0.4);
    const next = clamp(
        sheetHeightPx.value || fallback,
        minHeightPx.value || fallback,
        maxHeightPx.value || fallback
    );
    sheetHeightPx.value = next > 0 ? next : fallback;
}

/**
 * Prepare height before the panel paints.
 * With fitContent, start at min (never initialHeight / previous tall size) so the
 * sheet cannot slide in oversized and then collapse after measure.
 */
function prepareOpenHeight() {
    setupHeights();

    if (!props.fitContent) {
        ensureOpenHeight();
        return;
    }

    sheetHeightPx.value = minHeightPx.value || parseHeight(props.minHeight, 0.2);
}

function applyContentBasedHeight({ force = false } = {}) {
    if (
        !props.fitContent ||
        userAdjustedHeight.value ||
        isDragging.value ||
        !isOpen.value ||
        (!force && isPanelEntering.value)
    ) {
        return false;
    }

    setupHeights();

    const natural = measureNaturalPanelHeight();
    if (!natural) {
        if (!hasFittedOpenHeight) {
            const fallback = minHeightPx.value || parseHeight(props.minHeight, 0.2);
            sheetHeightPx.value = clamp(fallback, minHeightPx.value, maxHeightPx.value);
        }
        return false;
    }

    const next = clamp(natural, minHeightPx.value, maxHeightPx.value);
    sheetHeightPx.value = next;
    hasFittedOpenHeight = true;
    return true;
}

function scheduleContentMeasure() {
    if (!props.fitContent || userAdjustedHeight.value || !isOpen.value || isPanelEntering.value) {
        return;
    }

    if (measureRaf) {
        cancelAnimationFrame(measureRaf);
    }

    measureRaf = requestAnimationFrame(() => {
        measureRaf = 0;
        applyContentBasedHeight();
    });
}

function waitFrames(count = 1) {
    return new Promise((resolve) => {
        const step = () => {
            if (count <= 1) {
                resolve();
                return;
            }
            count -= 1;
            requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    });
}

/**
 * Fit height while the panel is still off-screen (translateY 100%),
 * so the slide-up never starts from an oversized height.
 */
async function fitHeightWhileOffscreen() {
    if (!props.fitContent || !isOpen.value) return;

    await nextTick();
    applyContentBasedHeight({ force: true });
    await waitFrames(2);
    applyContentBasedHeight({ force: true });
}

function observeContentElement(element) {
    if (!element || !contentResizeObserver) return;
    contentResizeObserver.observe(element);

    for (const child of element.children) {
        observeContentElement(child);
    }
}

function startContentObservers() {
    stopContentObservers();
    if (!props.fitContent || typeof window === "undefined" || !contentRef.value) return;

    contentResizeObserver = new ResizeObserver(() => {
        scheduleContentMeasure();
    });
    observeContentElement(contentRef.value);

    contentMutationObserver = new MutationObserver(() => {
        observeContentElement(contentRef.value);
        scheduleContentMeasure();
    });
    contentMutationObserver.observe(contentRef.value, {
        childList: true,
        subtree: true,
        characterData: true,
    });
}

function stopContentObservers() {
    if (measureRaf) {
        cancelAnimationFrame(measureRaf);
        measureRaf = 0;
    }

    if (enterAnimationTimer) {
        clearTimeout(enterAnimationTimer);
        enterAnimationTimer = null;
    }

    contentResizeObserver?.disconnect();
    contentResizeObserver = null;

    contentMutationObserver?.disconnect();
    contentMutationObserver = null;
}

function clearInlineTransform(el) {
    if (!el?.style) return;
    el.style.transition = "";
    el.style.transform = "";
}

function onPanelBeforeEnter(el) {
    // Hold off-screen with no transition until height is fitted.
    isPanelEntering.value = true;
    el.style.transition = "none";
    el.style.transform = "translate3d(0, 100%, 0)";
}

async function onPanelEnter(el, done) {
    let finished = false;
    const finish = (event) => {
        if (finished) return;
        if (event && event.propertyName && event.propertyName !== "transform") return;
        finished = true;
        el.removeEventListener("transitionend", finish);
        if (enterAnimationTimer) {
            clearTimeout(enterAnimationTimer);
            enterAnimationTimer = null;
        }
        done();
    };

    try {
        await fitHeightWhileOffscreen();
    } catch {
        // still animate even if measure fails
    }

    // Reflow, then slide up at the already-correct height.
    void el.offsetHeight;
    el.style.transition = `transform ${SHEET_ENTER_MS}ms ${SHEET_EASE_OUT}`;
    el.style.transform = "translate3d(0, 0, 0)";

    el.addEventListener("transitionend", finish);
    enterAnimationTimer = setTimeout(finish, SHEET_ENTER_MS + 80);
}

function onPanelAfterEnter(el) {
    clearInlineTransform(el);
    isPanelEntering.value = false;
    if (enterAnimationTimer) {
        clearTimeout(enterAnimationTimer);
        enterAnimationTimer = null;
    }
    startContentObservers();
    applyContentBasedHeight();
}

function onPanelLeave(el, done) {
    isPanelEntering.value = false;
    let finished = false;
    const finish = (event) => {
        if (finished) return;
        if (event && event.propertyName && event.propertyName !== "transform") return;
        finished = true;
        el.removeEventListener("transitionend", finish);
        done();
    };

    el.style.transition = `transform ${SHEET_LEAVE_MS}ms ${SHEET_EASE_LEAVE}`;
    el.style.transform = "translate3d(0, 0, 0)";
    void el.offsetHeight;
    el.style.transform = "translate3d(0, 100%, 0)";

    el.addEventListener("transitionend", finish);
    setTimeout(finish, SHEET_LEAVE_MS + 80);
}

function onPanelAfterLeave(el) {
    clearInlineTransform(el);
}

function getClientY(event) {
    if (event.touches && event.touches.length) {
        return event.touches[0].clientY;
    }
    return event.clientY;
}

function startDrag(event) {
    if (!props.draggable) return;
    isDragging.value = true;
    dragStartY.value = getClientY(event);
    startHeightPx.value = sheetHeightPx.value;

    window.addEventListener("mousemove", onDrag, { passive: false });
    window.addEventListener("mouseup", stopDrag, { passive: false });
    window.addEventListener("touchmove", onDrag, { passive: false });
    window.addEventListener("touchend", stopDrag, { passive: false });
}

function onDrag(event) {
    if (!isDragging.value) return;
    event.preventDefault();
    const currentY = getClientY(event);
    const deltaY = dragStartY.value - currentY; // کشیدن رو به بالا → ارتفاع بیشتر
    const nextHeight = startHeightPx.value + deltaY;

    const vh = typeof window !== "undefined" ? window.innerHeight : 0;
    const maxVisualHeight = vh || maxHeightPx.value;

    // در حین درگ، فقط داخل محدوده صفحه نگه می‌داریم
    sheetHeightPx.value = clamp(nextHeight, 0, maxVisualHeight);
}

function stopDrag() {
    if (!isDragging.value) return;
    isDragging.value = false;
    userAdjustedHeight.value = true;

    const vh = typeof window !== "undefined" ? window.innerHeight : 0;

    // اگر پایین‌تر از حداقل کشیده شده و اجازه داده شده، ببند
    if (props.autoCloseOnMin && sheetHeightPx.value <= minHeightPx.value) {
        close();
    } else if (props.autoFullscreenOnMax && vh && sheetHeightPx.value >= maxHeightPx.value) {
        // اگر بالاتر از حداکثر کشیده شده و اجازه فول‌اسکرین هست، تمام صفحه کن
        sheetHeightPx.value = vh;
    } else {
        // در غیر این صورت، داخل بازه عادی قفل کن
        sheetHeightPx.value = clamp(sheetHeightPx.value, minHeightPx.value, maxHeightPx.value);
    }

    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", stopDrag);
    window.removeEventListener("touchmove", onDrag);
    window.removeEventListener("touchend", stopDrag);
}

function close() {
    if (!isOpen.value) return;
    isOpen.value = false;
    emit("close");
}

function handleBackdropClick() {
    if (!props.closeOnBackdrop) return;
    // Ghost click after opening from a context-menu pointerdown would otherwise
    // close the sheet immediately.
    if (Date.now() - openedAtMs.value < OPEN_CLICK_GRACE_MS) return;
    close();
}

function handleResize() {
    syncKeyboardInset();
    if (props.fitContent) {
        scheduleContentMeasure();
        return;
    }

    setupHeights();
}

function syncKeyboardInset() {
    if (typeof window === "undefined") {
        keyboardInsetPx.value = 0;
        return;
    }
    const vv = window.visualViewport;
    if (!vv) {
        keyboardInsetPx.value = 0;
        return;
    }
    keyboardInsetPx.value = Math.max(
        0,
        Math.round(window.innerHeight - vv.height - (vv.offsetTop || 0))
    );
}

function handleEsc(event) {
    if (event.key === "Escape" && isOpen.value && props.closeOnBackdrop) {
        close();
    }
}

function lockBodyScroll() {
    if (!props.lockScroll || typeof document === "undefined") return;
    if (previousBodyOverflow.value === null) {
        previousBodyOverflow.value = document.body.style.overflow || "";
        document.body.style.overflow = "hidden";
    }
}

function unlockBodyScroll() {
    if (typeof document === "undefined") return;
    if (previousBodyOverflow.value !== null) {
        document.body.style.overflow = previousBodyOverflow.value;
        previousBodyOverflow.value = null;
    }
}

onMounted(() => {
    setupHeights();
    syncKeyboardInset();
    prepareOpenHeight();

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleEsc);
    if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", syncKeyboardInset);
        window.visualViewport.addEventListener("scroll", syncKeyboardInset);
    }

    if (isOpen.value) {
        hasFittedOpenHeight = false;
        lockBodyScroll();
        // Enter hooks handle fit + slide when Transition mounts the panel.
    }
});

onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
    window.removeEventListener("keydown", handleEsc);
    if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", syncKeyboardInset);
        window.visualViewport.removeEventListener("scroll", syncKeyboardInset);
    }
    stopDrag();
    stopContentObservers();
    unlockBodyScroll();
});

watch(
    () => props.modelValue,
    (val) => {
        if (val) {
            openedAtMs.value = Date.now();
            userAdjustedHeight.value = false;
            hasFittedOpenHeight = false;
            emit("open");
            prepareOpenHeight();
            lockBodyScroll();
            // Height fit + slide run in Transition enter hooks (off-screen first).
        } else {
            isPanelEntering.value = false;
            hasFittedOpenHeight = false;
            stopContentObservers();
            unlockBodyScroll();
        }
    }
);

watch(
    () => [props.initialHeight, props.minHeight, props.maxHeight, props.fitContent],
    () => {
        if (!isOpen.value) return;

        if (props.fitContent) {
            scheduleContentMeasure();
            return;
        }

        setupHeights();
    }
);
</script>

<template>
    <Teleport to="body">
        <!-- Backdrop fade -->
        <transition name="bottom-sheet-fade">
            <div v-if="isOpen" :class="[
                'fixed inset-0',
                backdropZClass,
                backdropClass && backdropClass.length !== 0
                    ? backdropClass
                    : 'messenger-sheet-backdrop'
            ]" @click="handleBackdropClick"></div>
        </transition>

        <!-- Sheet slide from bottom (JS hooks: fit height off-screen, then animate) -->
        <Transition
            :css="false"
            @before-enter="onPanelBeforeEnter"
            @enter="onPanelEnter"
            @after-enter="onPanelAfterEnter"
            @leave="onPanelLeave"
            @after-leave="onPanelAfterLeave"
        >
            <div v-if="isOpen" ref="panelRef" :class="[
                'bottom-sheet-panel fixed inset-x-0 bottom-0 md:bottom-3 mx-auto w-full max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg overflow-hidden flex flex-col',
                isDragging && 'bottom-sheet-panel--dragging',
                panelZClass,
                panelClass && panelClass.length !== 0
                    ? panelClass
                    : 'messenger-sheet-panel rounded-t-2xl md:rounded-b-2xl'
            ]" :style="panelStyle">
                <!-- Drag handle (always visible) -->
                <div v-if="showHandle" class="relative shrink-0 pt-2.5 pb-1.5 px-4 select-none group cursor-grab active:cursor-grabbing"
                    @mousedown.stop.prevent="startDrag" @touchstart.stop.prevent="startDrag">
                    <div :class="[
                        handleClass && handleClass.length !== 0
                            ? handleClass
                            : 'mx-auto h-1 w-10 rounded-full bg-gray-300 dark:bg-gray-600 transition-colors duration-150 group-hover:bg-gray-400 group-active:bg-gray-500 dark:group-hover:bg-gray-500 dark:group-active:bg-gray-400'
                    ]"></div>
                </div>

                <!-- Content -->
                <div ref="contentRef" class="flex-1 min-h-0 flex flex-col" :class="[
                    contentClass && contentClass.length !== 0
                        ? contentClass
                        : 'px-4 pb-4 overflow-auto custom-scrollbar'
                ]">
                <!-- ]" :style="{ height: contentHeightPx + 'px' }"> -->
                    <slot />
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.bottom-sheet-panel {
    /* Height / keyboard inset after open — open/close transform is JS-driven */
    transition:
        height 0.22s cubic-bezier(0.22, 1, 0.36, 1),
        bottom 0.22s cubic-bezier(0.22, 1, 0.36, 1);
    will-change: transform;
    backface-visibility: hidden;
}

.bottom-sheet-panel--dragging {
    transition: none !important;
}

.bottom-sheet-fade-enter-active,
.bottom-sheet-fade-leave-active {
    transition: opacity 0.35s ease-out;
}

.bottom-sheet-fade-enter-from,
.bottom-sheet-fade-leave-to {
    opacity: 0;
}
</style>
