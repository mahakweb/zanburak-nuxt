<template>
    <Listbox :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" v-slot="{ open }" as="div" class="w-max">
        <div v-if="open" class="fixed inset-0 z-10 bg-black opacity-20 dark:opacity-60"></div>
        <div class="relative" :class="open ? ' z-20' : ''">
            <div class="text-xs font-light text-gray-400 px-1">{{ label }}</div>
            <ListboxButton :class="open ? 'rounded-b-none outline-none ring-0 text-yellow-400 ' : ''"
                class="w-full min-w-[8rem] flex justify-between items-center px-2 py-1.5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 rounded-lg text-xs border border-gray-200/70 dark:border-gray-700/70">
                <span class="mx-2 flex items-center line-clamp-1 font-semibold">{{ selectedTitle }}</span>
                <div class="ms-4 py-1.5">
                    <svg class="w-2 h-3" :class="open ? 'rotate-180 transition duration-500' : ''" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.06597 0.94873L3.95486 4.05984L0.84375 0.94873" stroke="currentColor" stroke-width="1.23077" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </div>
            </ListboxButton>
            <ListboxOptions class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 text-xs space-y-1 p-1 rounded-b-xl shadow-lg border border-gray-200/70 dark:border-gray-700/70">
                <ListboxOption v-for="opt in options" :key="opt.value" :value="opt.value" :disabled="false"
                    class="flex items-center px-2 py-2.5 md:py-2 rounded-lg cursor-pointer"
                    :class="modelValue === opt.value ? 'bg-yellow-400/20 text-yellow-400' : 'text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:bg-opacity-50'">
                    <span class="ms-1 font-semibold">{{ opt.label }}</span>
                </ListboxOption>
            </ListboxOptions>
        </div>
    </Listbox>
</template>

<script>
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from "@headlessui/vue";

export default {
    name: "MissionFilterSelect",
    components: { Listbox, ListboxButton, ListboxOptions, ListboxOption },
    props: {
        modelValue: { type: [String, Number], default: "" },
        label: { type: String, default: "" },
        options: { type: Array, default: () => [] }, // [{ value, label }]
    },
    emits: ["update:modelValue"],
    computed: {
        selectedTitle() {
            const found = this.options.find((o) => o.value === this.modelValue);
            return found ? found.label : (this.options[0]?.label ?? "");
        },
    },
};
</script>
