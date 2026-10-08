<template>
    <div class="w-max shrink-0">
        <div class="text-xs font-light text-gray-400 px-1 mb-1">{{ label }}:</div>
        <select
            :value="modelValue"
            class="w-full h-8 px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs focus:ring-0 focus:outline-none"
            :class="minWidthClass"
            @change="onChange"
        >
            <option v-for="opt in normalizedOptions" :key="String(opt.value)" :value="opt.value">
                {{ opt.label }}
            </option>
        </select>
    </div>
</template>

<script>
export default {
    name: "AdminFilterSelect",
    props: {
        modelValue: { type: [String, Number], default: "" },
        label: { type: String, required: true },
        options: { type: Array, default: () => [] },
        minWidth: { type: String, default: "7rem" },
    },
    emits: ["update:modelValue", "change"],
    computed: {
        normalizedOptions() {
            return this.options.map((opt) => ({
                value: opt.value ?? opt.slug ?? opt.id,
                label: opt.label ?? opt.title ?? String(opt.value ?? opt.slug ?? ""),
            }));
        },
        minWidthClass() {
            const widths = {
                sm: "min-w-[6rem]",
                md: "min-w-[7rem]",
                lg: "min-w-[8rem]",
            };
            return widths[this.minWidth] || widths.md;
        },
    },
    methods: {
        onChange(event) {
            this.$emit("update:modelValue", event.target.value);
            this.$emit("change", event);
        },
    },
};
</script>
