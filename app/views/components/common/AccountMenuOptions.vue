<script setup>
import CountryFlag from 'vue-country-flag-next';
import { CheckIcon } from '@heroicons/vue/20/solid';
import { useAppPreferences, MENU_ACCENTS } from '@/composables/useAppPreferences';

const props = defineProps({
    // 'lang' | 'theme'
    view: { type: String, required: true },
    accent: { type: String, default: 'emerald' },
});

const emit = defineEmits(['back']);

const { langs, selectedLang, changeLang, themeArray, themeMeta, currentTheme, changeTheme } =
    useAppPreferences();
const a = MENU_ACCENTS[props.accent] || MENU_ACCENTS.emerald;

function pickLang(lang) {
    changeLang(lang);
    emit('back');
}

function pickTheme(theme) {
    changeTheme(theme);
    emit('back');
}
</script>

<template>
    <div :class="a.border" class="border rounded-lg p-1.5">
        <div class="mb-2 flex items-center gap-2 px-1">
            <button type="button" @click="$emit('back')" :class="a.backBtn"
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors">
                <svg class="h-4 w-4 rtl:rotate-180" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </button>
            <div class="min-w-0">
                <h3 class="text-xs font-bold text-gray-900 dark:text-gray-50">
                    {{ view === 'lang' ? $t('lang.select') : $t('theme.select') }}
                </h3>
                <p class="text-[10px] text-gray-400 line-clamp-1">
                    {{ view === 'lang' ? $t('lang.choose') : $t('theme.choose') }}
                </p>
            </div>
        </div>

        <!-- Language options -->
        <ul v-if="view === 'lang'" class="flex flex-col gap-1.5">
            <li v-for="lang in langs" :key="lang.locale">
                <button type="button" @click="pickLang(lang)"
                    :class="selectedLang.locale === lang.locale ? a.selected : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'"
                    class="group flex w-full items-center justify-between gap-3 rounded-xl border px-2.5 py-2 transition-colors">
                    <span class="flex items-center gap-3">
                        <span class="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                            <span v-if="lang.iconLabel" :class="a.optionIconBg"
                                class="flex h-8 w-8 items-center justify-center rounded-lg text-base font-bold leading-none">
                                {{ lang.iconLabel }}
                            </span>
                            <country-flag v-else class="mask mask-squircle scale-[0.72]" :country="lang.flag"
                                size="big" />
                        </span>
                        <span class="flex flex-col text-start">
                            <span class="text-xs font-semibold text-gray-900 dark:text-gray-50">{{ $t(lang.name) }}</span>
                            <span class="text-[10px] text-gray-400 uppercase">{{ lang.locale }}</span>
                        </span>
                    </span>
                    <span v-if="selectedLang.locale === lang.locale" :class="a.checkBg"
                        class="flex h-5 w-5 items-center justify-center rounded-full text-white">
                        <CheckIcon class="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                </button>
            </li>
        </ul>

        <!-- Theme options -->
        <ul v-else class="flex flex-col gap-1.5">
            <li v-for="theme in themeArray" :key="theme">
                <button type="button" @click="pickTheme(theme)"
                    :class="currentTheme === theme ? a.selected : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'"
                    class="group flex w-full items-center justify-between gap-3 rounded-xl border px-2.5 py-2 transition-colors">
                    <span class="flex items-center gap-2">
                        <span :class="a.optionIconBg" class="flex h-8 w-8 items-center justify-center rounded-lg">
                            <svg v-if="theme === 'system'" class="w-4 h-4" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 9C3 6.17 3 4.76 3.88 3.88C4.76 3 6.17 3 9 3H15C17.83 3 19.24 3 20.12 3.88C21 4.76 21 6.17 21 9V14C21 15.89 21 16.83 20.41 17.41C19.83 18 18.89 18 17 18H7C5.11 18 4.17 18 3.59 17.41C3 16.83 3 15.89 3 14V9Z"
                                    stroke="currentColor" stroke-width="1.5" />
                                <path opacity="0.5" d="M22 21H2" stroke="currentColor" stroke-width="1.5"
                                    stroke-linecap="round" />
                            </svg>
                            <svg v-else-if="theme === 'dark'" class="w-4 h-4" viewBox="-1 -2 25 26" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M19.9358 14.3652C20.0691 14.0415 19.9906 13.6679 19.7389 13.4276C19.4872 13.1873 19.115 13.1308 18.8051 13.2857C17.7584 13.8091 16.5801 14.1034 15.3317 14.1034C10.9835 14.1034 7.45846 10.5246 7.45846 6.1098C7.45846 4.32254 8.0352 2.67449 9.01033 1.34372C9.21644 1.06244 9.22917 0.680892 9.04229 0.386091C8.85541 0.0912907 8.50809 -0.054977 8.17055 0.0189828C3.50017 1.04235 0 5.25905 0 10.3077C0 16.1208 4.64155 20.8333 10.3672 20.8333C14.6778 20.8333 18.372 18.1625 19.9358 14.3652Z"
                                    fill="currentColor" />
                            </svg>
                            <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                            </svg>
                        </span>
                        <span class="flex flex-col text-start">
                            <span class="text-xs font-semibold text-gray-900 dark:text-gray-50">{{ $t(themeMeta[theme].shortKey) }}</span>
                            <span class="text-[10px] text-gray-400 line-clamp-1">{{ $t(themeMeta[theme].labelKey) }}</span>
                        </span>
                    </span>
                    <span v-if="currentTheme === theme" :class="a.checkBg"
                        class="flex h-5 w-5 items-center justify-center rounded-full text-white">
                        <CheckIcon class="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                </button>
            </li>
        </ul>
    </div>
</template>
