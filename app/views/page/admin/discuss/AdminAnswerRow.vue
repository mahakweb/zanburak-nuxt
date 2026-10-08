<template>
    <div class="flex items-start gap-3">
        <div
            class="shrink-0 w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200/60 dark:border-gray-700/60 overflow-hidden">
            <img v-if="answer.user?.profile_pic" :src="answer.user.profile_pic" :alt="answer.user?.first_name"
                class="w-full h-full object-cover" onerror="this.style.display='none'" />
            <div v-else class="w-full h-full flex items-center justify-center">
                <span class="text-yellow-500 text-xs font-semibold">{{ answer.user?.first_name?.charAt(0) || '?' }}</span>
            </div>
        </div>
        <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1.5">
                <span class="text-xs font-semibold text-gray-900 dark:text-white">
                    {{ answer.user?.first_name }} {{ answer.user?.last_name }}
                </span>
                <span class="text-[11px] text-gray-500 dark:text-gray-400">@{{ answer.user?.username }}</span>
                <span
                    class="text-[11px] text-gray-500 dark:text-gray-400 bg-gray-100/70 dark:bg-gray-800/50 px-2 py-0.5 rounded-lg">
                    {{ formattedDate }}
                </span>
                <span v-if="badge" class="text-[10px] font-semibold px-2 py-0.5 rounded-lg" :class="badgeClass">
                    {{ badge }}
                </span>
            </div>
            <div class="text-sm text-gray-700 dark:text-gray-300 rendered-content p-2.5 rounded-lg bg-gray-50/80 dark:bg-gray-800/50">
                <MarkdownRenderer startClass="rendered-content" :source="answer.answer || ''" />
            </div>
        </div>
        <Popover class="group relative shrink-0">
            <PopoverOverlay class="fixed inset-0 z-20 bg-black opacity-50" />
            <PopoverButton
                class="text-gray-900 dark:text-white relative group-focus-within:z-30 focus:outline-none flex items-center justify-center p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <svg class="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="8" cy="3" r="1.5" />
                    <circle cx="8" cy="8" r="1.5" />
                    <circle cx="8" cy="13" r="1.5" />
                </svg>
            </PopoverButton>
            <transition enter-active-class="transition duration-200 ease-out" enter-from-class="translate-y-1 opacity-0"
                enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-150 ease-in"
                leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-1 opacity-0">
                <PopoverPanel
                    class="text-start flex flex-col z-30 end-0 absolute p-2 bg-white rounded-lg shadow w-max min-w-[10rem] dark:bg-gray-900">
                    <ul class="text-xs font-semibold text-gray-700 dark:text-gray-200">
                        <slot name="actions" />
                    </ul>
                </PopoverPanel>
            </transition>
        </Popover>
    </div>
</template>

<script>
import { Popover, PopoverButton, PopoverPanel, PopoverOverlay } from "@headlessui/vue";
import MarkdownRenderer from "@/views/components/home/MarkdownRenderer.vue";

export default {
    name: "AdminAnswerRow",
    components: { MarkdownRenderer, Popover, PopoverButton, PopoverPanel, PopoverOverlay },
    props: {
        answer: { type: Object, required: true },
        badge: { type: String, default: "" },
        badgeClass: { type: String, default: "" },
        formattedDate: { type: String, default: "-" },
    },
};
</script>
