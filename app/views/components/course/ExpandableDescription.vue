<template>
    <div class="relative">
        <div class="relative">
            <div
                :id="elementId"
                ref="contentRef"
                class="desc font-medium text-gray-500 dark:text-gray-200 leading-loose overflow-hidden transition-[max-height] duration-300 ease-in-out"
                :style="heightStyle"
            >
                <MarkdownRenderer startClass="desc" :source="source" />
            </div>
            <div
                v-if="isTruncatable && !expanded"
                class="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/90 dark:from-gray-900 dark:via-gray-900/90 to-transparent"
            />
        </div>
        <div v-if="isTruncatable" class="relative flex items-center justify-center w-full pt-2">
            <button
                type="button"
                @click="onToggle"
                class="z-10 flex items-center justify-center min-w-32 h-8 px-3 text-sm font-medium rounded-md bg-yellow-400 text-black hover:bg-opacity-80 focus:ring-2 ring-yellow-600/70"
            >
                {{ expanded ? $t('course.show.showLess') : $t('course.show.showMore') }}
                <svg
                    class="w-4 h-4 ms-2 transition-transform duration-300"
                    :class="{ 'rotate-180': expanded }"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, toRef } from 'vue';
import MarkdownRenderer from '@/views/components/home/MarkdownRenderer.vue';
import { useExpandableContent } from '@/composables/useExpandableContent';

const props = defineProps({
    source: {
        type: String,
        required: true,
    },
    elementId: {
        type: String,
        default: 'desc',
    },
    maxLines: {
        type: Number,
        default: 5,
    },
});

const emit = defineEmits(['expanded-change']);

const contentRef = ref(null);
const sourceRef = toRef(props, 'source');

const { expanded, isTruncatable, toggle, maxHeightStyle } = useExpandableContent(contentRef, {
    maxLines: props.maxLines,
    source: sourceRef,
});

const heightStyle = computed(() => {
    if (!maxHeightStyle.value) return {};
    return { maxHeight: maxHeightStyle.value };
});

function onToggle() {
    toggle();
    emit('expanded-change', expanded.value);
}
</script>
