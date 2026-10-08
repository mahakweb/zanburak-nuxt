<template>
    <div ref="root" class="relative lg:w-fit w-full sm:w-auto">
        <button
            ref="trigger"
            type="button"
            @click="toggleOpen"
            class="flex items-center pe-2 ps-3 h-11 rounded-md justify-between border border-gray-200/80 dark:border-[#2a3850]/70 w-full sm:w-auto min-w-[9.5rem] cursor-pointer bg-white dark:bg-[#1a2332] whitespace-nowrap">
            <div class="text-gray-800 dark:text-white text-sm font-semibold">
                {{ label }}
                <span class="text-[11px] font-semibold text-gray-500 dark:text-gray-400 ms-0.5">({{ selectedLabel }})</span>
            </div>
            <span class="border-s mx-2 h-6 border-gray-200/80 dark:border-[#2a3850]/60 w-px lg:flex hidden"></span>
            <svg class="text-gray-800 dark:text-white shrink-0" width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M0.75 11C0.75 13.2475 0.871405 15.0024 1.17704 16.3776C1.48077 17.7443 1.9564 18.6896 2.63339 19.3666C3.31039 20.0436 4.25571 20.5192 5.62241 20.823C6.99762 21.1286 8.75249 21.25 11 21.25C13.2475 21.25 15.0024 21.1286 16.3776 20.823C17.7443 20.5192 18.6896 20.0436 19.3666 19.3666C20.0436 18.6896 20.5192 17.7443 20.823 16.3776C21.1286 15.0024 21.25 13.2475 21.25 11C21.25 8.75249 21.1286 6.99762 20.823 5.62241C20.5192 4.25571 20.0436 3.31039 19.3666 2.63339C18.6896 1.9564 17.7443 1.48077 16.3776 1.17704C15.0024 0.871405 13.2475 0.75 11 0.75C8.75249 0.75 6.99762 0.871405 5.62241 1.17704C4.25571 1.48077 3.31039 1.9564 2.63339 2.63339C1.9564 3.31039 1.48077 4.25571 1.17704 5.62241C0.871405 6.99762 0.75 8.75249 0.75 11Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path opacity="0.4" d="M11.0001 6.41663V15.5833M15.5834 10.0833V15.5833M6.41675 11.9166V15.5833" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </button>

        <Teleport to="body">
            <div
                v-if="open"
                ref="menu"
                :style="menuStyle"
                class="fixed z-[200] bg-white dark:bg-[#151c2c] shadow-lg rounded-md p-3 border border-gray-100 dark:border-[#2a3850]/70"
                @click.stop>
                <ul>
                    <li v-for="option in options" :key="option.value">
                        <button
                            type="button"
                            @click="select(option.value)"
                            class="flex py-2 px-3 w-full font-bold text-sm text-gray-700 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition duration-200 hover:bg-gray-50 rounded-md text-start"
                            :class="modelValue === option.value ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : ''">
                            {{ option.label }}
                        </button>
                    </li>
                </ul>
            </div>
        </Teleport>
    </div>
</template>

<script>
export default {
    props: {
        modelValue: { type: String, required: true },
        label: { type: String, required: true },
        options: { type: Array, required: true },
    },
    emits: ["update:modelValue", "change"],
    data() {
        return {
            open: false,
            menuStyle: {},
        };
    },
    computed: {
        selectedLabel() {
            return this.options.find((o) => o.value === this.modelValue)?.label || "";
        },
    },
    watch: {
        open(val) {
            if (val) {
                this.$nextTick(() => this.updateMenuPosition());
            }
        },
    },
    mounted() {
        document.addEventListener("click", this.onClickOutside);
        window.addEventListener("scroll", this.onScrollOrResize, true);
        window.addEventListener("resize", this.onScrollOrResize);
    },
    beforeUnmount() {
        document.removeEventListener("click", this.onClickOutside);
        window.removeEventListener("scroll", this.onScrollOrResize, true);
        window.removeEventListener("resize", this.onScrollOrResize);
    },
    methods: {
        toggleOpen() {
            this.open = !this.open;
        },
        updateMenuPosition() {
            const trigger = this.$refs.trigger;
            if (!trigger) return;

            const rect = trigger.getBoundingClientRect();
            const minWidth = Math.max(rect.width, 192);
            const viewportWidth = window.innerWidth;
            let left = rect.left;

            if (left + minWidth > viewportWidth - 8) {
                left = Math.max(8, viewportWidth - minWidth - 8);
            }

            this.menuStyle = {
                top: `${rect.bottom + 8}px`,
                left: `${left}px`,
                width: `${minWidth}px`,
            };
        },
        onScrollOrResize() {
            if (this.open) {
                this.updateMenuPosition();
            }
        },
        select(value) {
            this.open = false;
            if (value !== this.modelValue) {
                this.$emit("update:modelValue", value);
                this.$emit("change", value);
            }
        },
        onClickOutside(e) {
            const menu = this.$refs.menu;
            if (
                !this.$refs.root?.contains(e.target) &&
                !(menu && menu.contains(e.target))
            ) {
                this.open = false;
            }
        },
    },
};
</script>
