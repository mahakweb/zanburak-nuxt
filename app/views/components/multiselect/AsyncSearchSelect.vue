<template>
    <div class="w-full" ref="root">
        <div class="relative w-full h-full">
            <input
                :placeholder="placeholder"
                v-model="query"
                @input="onInput"
                @focus="onFocus"
                @keydown.esc.prevent.stop="open = false"
                @blur="onBlur"
                :class="[inputClass, showLoadingSpinner ? 'pe-10' : '']"
            />
            <div
                v-if="showLoadingSpinner"
                class="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3"
            >
                <svg class="w-4 h-4 animate-spin text-amber-500" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            </div>
            <div v-if="open && results.length" :class="[
                'absolute',
                asyncResultClass && asyncResultClass.length > 0 ? '' : 'z-10 mt-1 w-full bg-white dark:bg-gray-900 text-xs space-y-1 p-1 rounded-b-xl max-h-64 overflow-auto shadow border border-gray-100 dark:border-gray-800'
            ]">
                <div
                    v-for="(item, i) in results"
                    :key="i"
                    class="px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer flex justify-between items-center gap-2"
                    @mousedown.prevent.stop="toggle(item)"
                >
                    <span class="min-w-0 line-clamp-2">{{ item[optionLabel] }}</span>
                    <span v-if="isSelected(item)" class="text-green-600 shrink-0">✓</span>
                </div>
            </div>
            <div
                v-else-if="open && !loading && query.length >= minQueryLength && searchedOnce"
                class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 text-xs p-3 rounded-xl shadow border border-gray-100 dark:border-gray-800 text-gray-400 text-center"
            >
                نتیجه‌ای یافت نشد
            </div>
        </div>
        <div v-if="!hideSelectedChips && modelValue && modelValue.length" class="flex flex-wrap gap-1 mt-2">
            <span v-for="(sel, si) in modelValue" :key="si" class="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                <span>{{ displayLabel(sel) }}</span>
                <button @click.prevent="remove(sel)" class="text-rose-600">×</button>
            </span>
        </div>
    </div>
</template>

<script>
import axiosInstance from '@/store/axiosInstance'

export default {
    name: 'AsyncSearchSelect',
    props: {
        modelValue: { type: Array, default: () => [] },
        searchApi: { type: String, required: true },
        placeholder: { type: String, default: '' },
        optionLabel: { type: String, default: 'title' },
        optionValue: { type: String, default: 'id' },
        mapper: { type: Function, default: (x) => x },
        closeOnSelect: { type: Boolean, default: true },
        hideSelectedChips: { type: Boolean, default: false },
        minQueryLength: { type: Number, default: 1 },
        debounceMs: { type: Number, default: 350 },
        inputClass: { type: [String, Array, Object], default: "bg-gray-100 text-gray-900 text-sm rounded-lg outline-none focus:ring-2 focus:ring-offset-1 ring-offset-white dark:ring-offset-gray-900 focus:ring-yellow-500 block w-full p-2 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white"},
        asyncResultClass: { type: [String, Array, Object], default: ""},
    },
    data() {
        return { query: '', results: [], open: false, searchTimer: null, loading: false, searchedOnce: false };
    },
    computed: {
        showLoadingSpinner() {
            return this.loading;
        },
    },
    methods: {
        onInput() {
            clearTimeout(this.searchTimer);
            if (this.query.trim().length < this.minQueryLength) {
                this.results = [];
                this.open = false;
                this.searchedOnce = false;
                return;
            }
            this.searchTimer = setTimeout(() => this.search(), this.debounceMs);
        },
        async onFocus() {
            if (this.query.trim().length >= this.minQueryLength) {
                await this.search();
            }
        },
        onBlur() {
            this.open = false;
        },
        async search() {
            const q = this.query.trim();
            if (q.length < this.minQueryLength) return;
            this.loading = true;
            try {
                const res = await this.$axios.get(this.searchApi, { params: { q, perPage: 10 } });
                const items = res.data?.items || res.data?.data || [];
                this.results = items.map(this.mapper).filter(item => !this.isSelected(item));
                this.open = true;
                this.searchedOnce = true;
            } catch (e) {
                console.error('search failed', e);
                this.results = [];
                this.open = false;
                this.searchedOnce = true;
            } finally {
                this.loading = false;
            }
        },
        isSelected(item) {
            const id = item[this.optionValue];
            return (this.modelValue || []).some((sel) => (sel[this.optionValue] ?? sel) === id);
        },
        toggle(item) {
            const selected = Array.isArray(this.modelValue) ? [...this.modelValue] : [];
            if (this.isSelected(item)) {
                const id = item[this.optionValue];
                const idx = selected.findIndex((sel) => (sel[this.optionValue] ?? sel) === id);
                if (idx >= 0) selected.splice(idx, 1);
            } else {
                selected.push(item);
            }
            this.$emit('update:modelValue', selected);
            if (this.closeOnSelect) {
                this.open = false;
                this.query = '';
                this.results = [];
                this.searchedOnce = false;
            }
        },
        remove(item) {
            const id = item[this.optionValue] ?? item;
            const next = (this.modelValue || []).filter((sel) => (sel[this.optionValue] ?? sel) !== id);
            this.$emit('update:modelValue', next);
        },
        displayLabel(sel) {
            return sel[this.optionLabel] ?? sel;
        },
    },
    mounted() {
        if (!this.$axios && this.$root?.$axios) this.$axios = this.$root.$axios;
        if (!this.$axios && window?.axiosInstance) this.$axios = window.axiosInstance;
        if (!this.$axios) this.$axios = axiosInstance;
        this._onClickOutside = (e) => {
            const root = this.$refs.root;
            if (!root) return;
            if (!root.contains(e.target)) this.open = false;
        };
        document.addEventListener('mousedown', this._onClickOutside);
    },
    beforeUnmount() {
        if (this._onClickOutside) document.removeEventListener('mousedown', this._onClickOutside);
        clearTimeout(this.searchTimer);
    },
};
</script>

<style scoped></style>
