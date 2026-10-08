<template>
    <div ref="containerRef" class="w-full min-h-0" :class="layout === 'panel' ? 'flex flex-col flex-1' : ''">
        <!-- Panel layout: search + list first (priority), selected chips compact at bottom -->
        <template v-if="layout === 'panel'">
            <div class="flex flex-col flex-1 min-h-0 rounded-xl border border-gray-200/70 dark:border-gray-700/60 bg-white dark:bg-gray-900/50 shadow-sm overflow-hidden">
                <div class="shrink-0 p-2.5 border-b border-gray-100 dark:border-gray-700/60 bg-gray-50/80 dark:bg-gray-800/30">
                    <div class="flex items-center gap-2">
                        <div v-if="enableSearch" class="relative flex-1 min-w-0">
                            <svg class="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <input type="text" v-model="searchTerm" :placeholder="searchPlaceholder || $t('multiselect.searchPlaceholder')"
                                :class="[panelSearchClass, 'block w-full ps-9 pe-3 py-2.5 text-sm outline-none']" />
                        </div>
                        <button v-if="enableSelectAll" type="button" @click.stop="selectAll"
                            :title="$t('multiselect.selectAll')"
                            class="shrink-0 rounded-lg p-2.5 text-gray-500 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors">
                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.0303 10.0303C16.3232 9.73744 16.3232 9.26256 16.0303 8.96967C15.7374 8.67678 15.2626 8.67678 14.9697 8.96967L10.5 13.4393L9.03033 11.9697C8.73744 11.6768 8.26256 11.6768 7.96967 11.9697C7.67678 12.2626 7.67678 12.7374 7.96967 13.0303L9.96967 15.0303C10.2626 15.3232 10.7374 15.3232 11.0303 15.0303L16.0303 10.0303Z" fill="currentColor"/>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12Z" fill="currentColor"/>
                            </svg>
                        </button>
                    </div>
                    <p v-if="maxSelection >= 0 && maxSelection != Infinity" class="mt-2 text-[10px] text-center text-gray-400">
                        {{ $t('multiselect.maxSelectionHint', { count: maxSelection }) }}
                    </p>
                </div>  
                <div :class="panelListClass">
                    <div v-if="modelValue.length === 0 && filteredOptions.length === 0"
                        class="flex flex-col items-center justify-center py-10 text-center px-4">
                        <p class="text-xs font-medium text-gray-400 dark:text-gray-500">{{ emptySelectionText }}</p>
                    </div>
                    <div v-else-if="filteredOptions.length === 0"
                        class="flex flex-col items-center justify-center py-8 text-center px-4">
                        <p class="text-xs font-medium text-gray-400 dark:text-gray-500">موردی برای انتخاب باقی نمانده</p>
                    </div>
                    <button v-for="option in filteredOptions" :key="getOptionValue(option)" type="button"
                        :class="panelOptionClass"
                        @click.stop="toggleOption(option)">
                        <span class="flex-1 min-w-0 text-start truncate">{{ getOptionLabel(option) }}</span>
                        <svg class="shrink-0 w-4 h-4 opacity-40 group-hover:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 5v14M5 12h14" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
            </div>

            <div v-if="modelValue.length"
                class="shrink-0 mt-2 rounded-xl border border-gray-200/70 dark:border-gray-700/60 bg-white/80 dark:bg-gray-800/40 overflow-hidden">
                <div class="flex items-center justify-between gap-2 px-3 py-2 border-b border-gray-100/80 dark:border-gray-700/50">
                    <div class="flex items-center gap-2 min-w-0">
                        <span class="inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1.5 rounded-md text-[10px] font-bold"
                            :class="panelBadgeClass">
                            {{ modelValue.length }}
                        </span>
                        <span class="text-[11px] font-semibold text-gray-600 dark:text-gray-300">انتخاب شده</span>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                        <button v-if="modelValue.length > 3" type="button" @click.stop="selectedExpanded = !selectedExpanded"
                            class="text-[10px] font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            {{ selectedExpanded ? 'جمع' : 'نمایش' }}
                        </button>
                        <button v-if="enableClearAll" type="button" @click.stop="clearAll"
                            class="text-[10px] font-semibold text-rose-500 hover:text-rose-600 dark:text-rose-400">
                            پاک کردن
                        </button>
                    </div>
                </div>
                <div class="px-3 py-2 overflow-y-auto custom-scrollbar transition-[max-height] duration-200"
                    :class="selectedExpanded ? selectedPanelExpandedClass : selectedPanelCollapsedClass">
                    <div class="flex flex-wrap gap-1.5">
                        <span v-for="option in modelValue" :key="getOptionValue(option)"
                            :class="[panelChipClass, 'text-[10px] font-semibold inline-flex items-center gap-1 max-w-full']">
                            <span class="truncate max-w-[10rem]">{{ getOptionLabel(option) }}</span>
                            <button type="button" @click.stop="removeOption(option)"
                                class="shrink-0 opacity-70 hover:opacity-100 text-current">
                                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        </template>

        <!-- Default dropdown layout -->
        <div v-else ref="rootRef" class="relative w-full" @click.stop="toggleDropdown">

        <div :class="[

            'outline-none border-none block w-full cursor-pointer',

            isOpen ? ['ring-2', 'ring-offset-1', ringColor] : '',

            backgroundColor,

            textColor,

            borderRadius,

            padding

        ]">

            <span v-if="modelValue.length === 0" :class="[placeholderColor, 'text-sm']">{{ placeholder || $t('multiselect.selectItems') }}</span>

            <span v-else class="flex flex-wrap gap-1 max-h-36 overflow-y-auto custom-scrollbar pe-1">

                <span v-for="option in modelValue" :key="getOptionValue(option)"

                    :class="[selectedBgColor, selectedTextColor, selectedBorderRadius, selectedPadding, 'text-xs flex items-center']">

                    {{ getOptionLabel(option) }}

                    <button type="button" @click.stop="removeOption(option)" class="ms-1 text-white hover:text-rose-500 text-xs">

                        <svg class="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">

                            <path stroke="currentColor" d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"/>

                            <path stroke="currentColor" stroke-linecap="round" d="M9 15L15 9M15 15L9 9"/>

                        </svg>

                    </button>

                </span>

            </span>

        </div>



        <Teleport to="body" :disabled="!teleportDropdown">

            <div v-if="isOpen"

                ref="dropdownRef"

                :style="teleportDropdown ? dropdownStyle : null"

                :class="[

                    dropdownBgColor, dropdownBorderRadius, dropdownPadding, dropdownTextColor,

                    teleportDropdown ? 'fixed z-[60] shadow-xl border border-gray-200/80 dark:border-gray-600/80' : 'absolute z-10 w-full shadow-lg mt-2',

                    'max-h-60 overflow-auto custom-scrollbar'

                ]"

                @mousedown.stop>

                <div v-if="maxSelection >= 0 && maxSelection != Infinity" class="text-xs text-center mb-2 font-light text-gray-400">{{ $t('multiselect.maxSelectionHint', { count: maxSelection }) }}</div>

                <div class="flex items-center space-x-1 rtl:space-x-reverse mb-1">

                    <input v-if="enableSearch" type="text" v-model="searchTerm" :placeholder="$t('multiselect.searchPlaceholder')" autofocus

                        @focus="focusSearchInput"

                        :class="[searchBgColor, searchTextColor, searchPadding, searchBorderRadius, 'block w-full outline-none text-sm']" />

                    <button v-if="enableSelectAll" type="button" @click="selectAll" :title="$t('multiselect.selectAll')"

                        class="rounded-lg block p-2.5 text-gray-500 dark:text-gray-200 hover:text-amber-500 dark:hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs">

                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

                            <path d="M16.0303 10.0303C16.3232 9.73744 16.3232 9.26256 16.0303 8.96967C15.7374 8.67678 15.2626 8.67678 14.9697 8.96967L10.5 13.4393L9.03033 11.9697C8.73744 11.6768 8.26256 11.6768 7.96967 11.9697C7.67678 12.2626 7.67678 12.7374 7.96967 13.0303L9.96967 15.0303C10.2626 15.3232 10.7374 15.3232 11.0303 15.0303L16.0303 10.0303Z" fill="currentColor"/>

                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12Z" fill="currentColor"/>

                        </svg>

                    </button>

                    <button v-if="enableClearAll" type="button" @click="clearAll" :title="$t('multiselect.clearAll')"

                        class="rounded-lg block p-2.5 text-gray-500 dark:text-gray-200 hover:text-rose-500 dark:hover:text-rose-500 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs">

                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

                            <path d="M10.0303 8.96965C9.73741 8.67676 9.26253 8.67676 8.96964 8.96965C8.67675 9.26255 8.67675 9.73742 8.96964 10.0303L10.9393 12L8.96966 13.9697C8.67677 14.2625 8.67677 14.7374 8.96966 15.0303C9.26255 15.3232 9.73743 15.3232 10.0303 15.0303L12 13.0607L13.9696 15.0303C14.2625 15.3232 14.7374 15.3232 15.0303 15.0303C15.3232 14.7374 15.3232 14.2625 15.0303 13.9696L13.0606 12L15.0303 10.0303C15.3232 9.73744 15.3232 9.26257 15.0303 8.96968C14.7374 8.67678 14.2625 8.67678 13.9696 8.96968L12 10.9393L10.0303 8.96965Z" fill="currentColor"/>

                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12Z" fill="currentColor"/>

                        </svg>

                    </button>

                </div>

                <div v-for="option in filteredOptions" :key="getOptionValue(option)" :class="[itemClass]"

                    @click="toggleOption(option)">

                    {{ getOptionLabel(option) }}

                </div>

            </div>

        </Teleport>

        </div>
    </div>
</template>



<script>

const PANEL_ACCENTS = {

    amber: {

        badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-50',

        chip: 'rounded-lg px-2 py-1 bg-amber-100 text-amber-900 dark:bg-amber-950/75 dark:text-amber-50 dark:ring-1 dark:ring-amber-600/45',

        search: 'rounded-xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-600/80 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-amber-400/30',

        option: 'group w-full flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-800 dark:text-gray-100 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors',

    },

    emerald: {

        badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-50',

        chip: 'rounded-lg px-2 py-1 bg-emerald-100 text-emerald-900 dark:bg-emerald-950/75 dark:text-emerald-50 dark:ring-1 dark:ring-emerald-600/45',

        search: 'rounded-xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-600/80 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-400/30',

        option: 'group w-full flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-800 dark:text-gray-100 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors',

    },

    violet: {

        badge: 'bg-violet-100 text-violet-800 dark:bg-violet-950/70 dark:text-violet-50',

        chip: 'rounded-lg px-2 py-1 bg-violet-100 text-violet-900 dark:bg-violet-950/75 dark:text-violet-50 dark:ring-1 dark:ring-violet-600/45',

        search: 'rounded-xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-600/80 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-violet-400/30',

        option: 'group w-full flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-800 dark:text-gray-100 hover:bg-violet-50 dark:hover:bg-violet-950/40 transition-colors',

    },

    sky: {

        badge: 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-50',

        chip: 'rounded-lg px-2 py-1 bg-sky-100 text-sky-900 dark:bg-sky-950/75 dark:text-sky-50 dark:ring-1 dark:ring-sky-600/45',

        search: 'rounded-xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-600/80 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-sky-400/30',

        option: 'group w-full flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-800 dark:text-gray-100 hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors',

    },

    indigo: {

        badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-50',

        chip: 'rounded-lg px-2 py-1 bg-indigo-100 text-indigo-900 dark:bg-indigo-950/75 dark:text-indigo-50 dark:ring-1 dark:ring-indigo-600/45',

        search: 'rounded-xl bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-600/80 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-400/30',

        option: 'group w-full flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-800 dark:text-gray-100 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors',

    },

};



export default {

    props: {

        modelValue: {

            type: Array,

            default: () => []

        },

        placeholder: {

            type: String,

            default: ""

        },

        options: {

            type: Array,

            required: true

        },

        optionLabel: {

            type: String,

            default: "title"

        },

        optionValue: {

            type: String,

            default: "id"

        },

        closeOnSelect: {

            type: Boolean,

            default: false

        },

        maxSelection: {

            type: Number,

            default: Infinity

        },

        enableSearch: {

            type: Boolean,

            default: true

        },

        enableSelectAll: {

            type: Boolean,

            default: true

        },

        enableClearAll: {

            type: Boolean,

            default: true

        },

        layout: {

            type: String,

            default: 'dropdown',

            validator: (v) => ['dropdown', 'panel'].includes(v),

        },

        panelAccent: {

            type: String,

            default: 'amber',

        },

        emptySelectionText: {

            type: String,

            default: 'هنوز موردی انتخاب نشده — از لیست پایین انتخاب کنید',

        },

        searchPlaceholder: {

            type: String,

            default: '',

        },

        panelOptionsMaxHeight: {

            type: String,

            default: 'max-h-52',

        },

        panelSelectedCollapsedMaxHeight: {

            type: String,

            default: 'max-h-24',

        },

        panelSelectedExpandedMaxHeight: {

            type: String,

            default: 'max-h-40',

        },

        teleportDropdown: {

            type: Boolean,

            default: false,

        },

        backgroundColor: {

            type: String,

            default: "bg-gray-100 dark:bg-gray-700"

        },

        textColor: {

            type: String,

            default: "text-gray-900 dark:text-white"

        },

        placeholderColor: {

            type: String,

            default: "text-gray-400"

        },

        borderRadius: {

            type: String,

            default: "rounded-lg"

        },

        padding: {

            type: String,

            default: "p-2.5"

        },

        ringColor: {

            type: String,

            default: "ring-yellow-500 ring-offset-1 ring-offset-white dark:ring-offset-gray-900"

        },

        selectedBgColor: {

            type: String,

            default: "bg-gray-600 dark:bg-gray-800"

        },

        selectedTextColor: {

            type: String,

            default: "text-white"

        },

        selectedBorderRadius: {

            type: String,

            default: "rounded-lg"

        },

        selectedPadding: {

            type: String,

            default: "px-2 py-1"

        },

        dropdownBgColor: {

            type: String,

            default: "bg-white dark:bg-slate-700"

        },

        dropdownTextColor: {

            type: String,

            default: "text-gray-900 dark:text-gray-200"

        },

        dropdownBorderRadius: {

            type: String,

            default: "rounded-lg"

        },

        dropdownPadding: {

            type: String,

            default: "p-2.5"

        },

        searchBgColor: {

            type: String,

            default: "bg-gray-100 dark:bg-gray-800/60"

        },

        searchTextColor: {

            type: String,

            default: "text-gray-900 dark:text-white"

        },

        searchPadding: {

            type: String,

            default: "p-2.5"

        },

        searchBorderRadius: {

            type: String,

            default: "rounded-lg"

        },

        itemClass: {

            type: String,

            default: "rounded-md p-2 cursor-pointer hover:bg-yellow-100 dark:hover:bg-white/10 text-sm"

        }

    },

    data() {

        return {

            searchTerm: "",

            isOpen: false,

            selectedExpanded: false,

            dropdownStyle: {

                top: '0px',

                left: '0px',

                width: '0px',

            },

        };

    },

    computed: {

        filteredOptions() {

            return this.options.filter(option => {

                const label = this.isObject(option) ? option[this.optionLabel] : option;

                const matchesSearch = String(label).includes(this.searchTerm);

                const isSelected = this.modelValue.some(

                    (selected) => this.getOptionValue(selected) === this.getOptionValue(option)

                );

                return matchesSearch && !isSelected;

            });

        },

        panelTheme() {

            return PANEL_ACCENTS[this.panelAccent] || PANEL_ACCENTS.amber;

        },

        panelBadgeClass() {

            return this.panelTheme.badge;

        },

        panelChipClass() {

            return this.panelTheme.chip;

        },

        panelSearchClass() {

            return this.panelTheme.search;

        },

        panelOptionClass() {

            return this.panelTheme.option;

        },

        panelListClass() {

            return [this.panelOptionsMaxHeight, 'min-h-[7rem] overflow-y-auto custom-scrollbar p-1.5'];

        },

        selectedPanelCollapsedClass() {

            return this.panelSelectedCollapsedMaxHeight;

        },

        selectedPanelExpandedClass() {

            return this.panelSelectedExpandedMaxHeight;

        },

    },

    watch: {

        isOpen(open) {

            if (open && this.teleportDropdown) {

                this.$nextTick(() => this.updateDropdownPosition());

            }

        },

    },

    methods: {

        toggleDropdown() {

            this.isOpen = !this.isOpen;

            this.$nextTick(() => {

                if (this.isOpen) {

                    this.updateDropdownPosition();

                    this.focusSearchInput();

                }

            });

        },

        updateDropdownPosition() {

            const root = this.$refs.rootRef;

            if (!root) return;

            const rect = root.getBoundingClientRect();

            const gap = 8;

            const maxH = 240;

            const spaceBelow = window.innerHeight - rect.bottom - gap;

            const spaceAbove = rect.top - gap;

            const openUp = spaceBelow < 160 && spaceAbove > spaceBelow;



            let top;

            let maxHeight;

            if (openUp) {

                maxHeight = Math.min(maxH, spaceAbove);

                top = rect.top - gap - maxHeight;

            } else {

                maxHeight = Math.min(maxH, spaceBelow);

                top = rect.bottom + gap;

            }



            this.dropdownStyle = {

                top: `${Math.max(8, top)}px`,

                left: `${rect.left}px`,

                width: `${rect.width}px`,

                maxHeight: `${Math.max(120, maxHeight)}px`,

            };

        },

        toggleOption(option) {

            const exists = this.modelValue.some(

                (selected) => this.getOptionValue(selected) === this.getOptionValue(option)

            );

            if (exists) {

                this.updateModel(this.modelValue.filter(

                    (o) => this.getOptionValue(o) !== this.getOptionValue(option)

                ));

            } else if (this.modelValue.length < this.maxSelection) {

                this.updateModel([...this.modelValue, option]);

            }

            if (this.closeOnSelect && this.layout === 'dropdown') this.isOpen = false;

            this.$nextTick(() => this.focusSearchInput());

        },

        removeOption(option) {

            this.updateModel(this.modelValue.filter(

                (o) => this.getOptionValue(o) !== this.getOptionValue(option)

            ));

            this.$nextTick(() => this.focusSearchInput());

        },

        selectAll() {

            const available = this.options.filter(

                (option) => !this.modelValue.some(

                    (selected) => this.getOptionValue(selected) === this.getOptionValue(option)

                )

            );

            const toAdd = available.length <= this.maxSelection - this.modelValue.length

                ? available

                : available.slice(0, this.maxSelection - this.modelValue.length);

            this.updateModel([...this.modelValue, ...toAdd]);

            if (this.layout === 'dropdown') this.isOpen = false;

        },

        clearAll() {

            this.updateModel([]);

            if (this.layout === 'dropdown') this.isOpen = false;

        },

        closeDropdown(event) {

            if (this.layout === 'panel') return;

            const root = this.$refs.rootRef;

            const dropdown = this.$refs.dropdownRef;

            if (root?.contains(event.target) || dropdown?.contains(event.target)) return;

            this.isOpen = false;

        },

        isObject(item) {

            return typeof item === "object" && item !== null;

        },

        getOptionLabel(option) {

            return this.isObject(option) ? option[this.optionLabel] : option;

        },

        getOptionValue(option) {

            return this.isObject(option) ? option[this.optionValue] : option;

        },

        updateModel(value) {

            this.$emit('update:modelValue', value);

        },

        focusSearchInput() {

            const root = this.$refs.containerRef || this.$refs.rootRef;

            const el = root && root.$el ? root.$el : root;

            if (!el || typeof el.querySelector !== 'function') return;

            const searchInput = el.querySelector("input[type='text']");

            if (searchInput) searchInput.focus();

        },

        onScrollOrResize() {

            if (this.isOpen && this.teleportDropdown) {

                this.updateDropdownPosition();

            }

        },

    },

    mounted() {

        document.addEventListener("click", this.closeDropdown);

        window.addEventListener("scroll", this.onScrollOrResize, true);

        window.addEventListener("resize", this.onScrollOrResize);

    },

    unmounted() {

        document.removeEventListener("click", this.closeDropdown);

        window.removeEventListener("scroll", this.onScrollOrResize, true);

        window.removeEventListener("resize", this.onScrollOrResize);

    }

};

</script>


