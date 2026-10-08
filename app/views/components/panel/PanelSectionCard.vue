<template>
    <div
        class="mb-5 last:mb-0 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm md:p-6 p-4"
        :class="$attrs.class"
    >
        <PanelSectionHeader v-if="title" :title="title" :icon="icon">
            <template v-if="$slots['header-extra']" #extra>
                <slot name="header-extra" />
            </template>
        </PanelSectionHeader>
        <slot />
    </div>
</template>

<script>
import PanelSectionHeader from "@/views/components/panel/PanelSectionHeader.vue";

export default {
    inheritAttrs: false,
    components: { PanelSectionHeader },
    props: {
        title: { type: String, default: "" },
        icon: { type: String, default: "" },
    },
};
</script>
