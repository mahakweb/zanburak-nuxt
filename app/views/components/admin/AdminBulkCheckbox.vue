<template>
    <input
        type="checkbox"
        class="admin-bulk-checkbox"
        :class="stateClass"
        :checked="resolvedChecked"
        :indeterminate.prop="indeterminate"
        :value="value"
        :disabled="disabled"
        @change="onChange"
    />
</template>

<script>
export default {
    name: "AdminBulkCheckbox",
    props: {
        modelValue: { type: Array, default: null },
        value: { type: [Number, String], default: null },
        checked: { type: Boolean, default: undefined },
        indeterminate: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
    },
    emits: ["update:modelValue", "change"],
    computed: {
        resolvedChecked() {
            if (this.modelValue && this.value != null) {
                return this.modelValue.includes(this.value);
            }
            return !!this.checked;
        },
        stateClass() {
            if (this.indeterminate) return "is-indeterminate";
            if (this.resolvedChecked) return "is-checked";
            return "";
        },
    },
    methods: {
        onChange(event) {
            if (this.modelValue && this.value != null) {
                const next = [...this.modelValue];
                if (event.target.checked) {
                    if (!next.includes(this.value)) next.push(this.value);
                } else {
                    const idx = next.indexOf(this.value);
                    if (idx > -1) next.splice(idx, 1);
                }
                this.$emit("update:modelValue", next);
            }
            this.$emit("change", event);
        },
    },
};
</script>
