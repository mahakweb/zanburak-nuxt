<script setup>
import { useAppPreferences, MENU_ACCENTS } from '@/composables/useAppPreferences';

const props = defineProps({
    accent: { type: String, default: 'emerald' },
});

defineEmits(['open']);

const { selectedLang, currentTheme, themeMeta } = useAppPreferences();
const a = MENU_ACCENTS[props.accent] || MENU_ACCENTS.emerald;
</script>

<template>
    <ul :class="a.border"
        class="border rounded-lg p-1.5 text-xs font-medium font-anjoman text-gray-600 dark:text-gray-200">
        <li>
            <button type="button" @click="$emit('open', 'lang')" :class="a.rowHover"
                class="flex w-full items-center justify-between ps-4 pe-2 rounded-lg py-2">
                <span class="flex items-center">
                    <svg :class="a.iconText" class="w-4 h-4 me-3 shrink-0" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1.6"
                        stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12,22 C14.67,19.58 16,16.24 16,12 C16,7.76 14.67,4.42 12,2 C9.33,4.42 8,7.76 8,12 C8,16.24 9.33,19.58 12,22 Z"></path>
                        <path d="M2.5 9L21.5 9M2.5 15L21.5 15"></path>
                    </svg>
                    <span class="font-semibold">{{ $t('lang.select') }}</span>
                </span>
                <span class="flex items-center gap-1 text-[11px] text-gray-400">
                    <span>{{ $t(selectedLang.name) }}</span>
                    <svg class="h-3.5 w-3.5 shrink-0 ltr:rotate-180" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </span>
            </button>
        </li>
        <hr :class="a.borderDashed" class="my-0.5 ms-10 me-8 border-t border-dashed" />
        <li>
            <button type="button" @click="$emit('open', 'theme')" :class="a.rowHover"
                class="flex w-full items-center justify-between ps-4 pe-2 rounded-lg py-2">
                <span class="flex items-center">
                    <svg :class="a.iconText" class="w-4 h-4 me-3 shrink-0" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C12.83 21 13.5 20.33 13.5 19.5C13.5 19.11 13.35 18.76 13.11 18.5C12.88 18.24 12.73 17.89 12.73 17.5C12.73 16.67 13.4 16 14.23 16H16C18.76 16 21 13.76 21 11C21 6.58 16.97 3 12 3Z"
                            stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
                        <circle cx="7.5" cy="11.5" r="1.2" fill="currentColor" />
                        <circle cx="12" cy="7.5" r="1.2" fill="currentColor" />
                        <circle cx="16.5" cy="11.5" r="1.2" fill="currentColor" />
                    </svg>
                    <span class="font-semibold">{{ $t('theme.select') }}</span>
                </span>
                <span class="flex items-center gap-1 text-[11px] text-gray-400">
                    <span>{{ $t(themeMeta[currentTheme].shortKey) }}</span>
                    <svg class="h-3.5 w-3.5 shrink-0 ltr:rotate-180" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </span>
            </button>
        </li>
    </ul>
</template>
