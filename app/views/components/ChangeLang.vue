<script setup>
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import CountryFlag from "vue-country-flag-next";
import BottomSheetDrawer from "@/views/components/common/BottomSheetDrawer.vue";
import { SUPPORTED_LANGUAGES } from "@/config/languages";
import { CheckIcon } from "@heroicons/vue/20/solid";



defineProps({
	// عنوان بالای باتم‌شیت
	title: {
		type: String,
		default: "lang.select",
	},
	// نمایش پرچم کشورها در لیست و دکمه‌ی پیش‌فرض
	showFlags: {
		type: Boolean,
		default: true,
	},
});

const { locale } = useI18n({ useScope: 'global' });

const langs = SUPPORTED_LANGUAGES;

const isOpen = ref(false);
// Base the selected language on the reactive i18n locale so the highlighted
// item always matches the actual site language.
const selectedLang = computed(
	() => langs.find((l) => l.locale === locale.value) || langs[0]
);

function openSheet() {
	const stored = localStorage.getItem('locale');
	if (stored && stored !== locale.value) {
		locale.value = stored;
	}
	isOpen.value = true;
}

function changeLang(lang) {
	document.documentElement.dir = lang.dir;
	document.documentElement.lang = lang.locale;
	localStorage.setItem("direction", lang.dir);
	localStorage.setItem("locale", lang.locale);
	locale.value = lang.locale;
	document.documentElement.dispatchEvent(new Event("onChangeLanguage"));
	isOpen.value = false;
}

onMounted(() => {
	document.documentElement.dir = selectedLang.value.dir;
	document.documentElement.lang = selectedLang.value.locale;
});

defineExpose({ openSheet, changeLang, selectedLang, langs });
</script>

<template>
	<div class="w-full">
		<!-- دکمه‌ی باز کننده (قابل سفارشی‌سازی کامل از طریق اسلات) -->
		<slot name="trigger" :open="openSheet" :current="selectedLang" :is-open="isOpen">
			<button type="button" @click="openSheet"
				class="flex w-full items-center justify-between gap-2 cursor-pointer rounded-lg px-3 py-2 shadow-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
				<span class="flex items-center gap-2">
					<span v-if="showFlags" class="flex h-6 w-6 shrink-0 items-center justify-center">
						<span v-if="selectedLang.iconLabel"
							class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-bold leading-none text-emerald-600 dark:text-emerald-300">
							{{ selectedLang.iconLabel }}
						</span>
						<country-flag v-else class="mask mask-circle" :country="selectedLang.flag" size="normal" />
					</span>
					<span class="text-xs md:text-sm font-semibold">{{ $t(selectedLang.name) }}</span>
				</span>
				<svg class="h-5 w-5 text-gray-400 shrink-0" viewBox="0 0 24 24" role="img"
					xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="1" stroke-linecap="square"
					stroke-linejoin="miter" fill="none">
					<circle cx="12" cy="12" r="10"></circle>
					<path stroke-linecap="round"
						d="M12,22 C14.6666667,19.5757576 16,16.2424242 16,12 C16,7.75757576 14.6666667,4.42424242 12,2 C9.33333333,4.42424242 8,7.75757576 8,12 C8,16.2424242 9.33333333,19.5757576 12,22 Z">
					</path>
					<path stroke-linecap="round" d="M2.5 9L21.5 9M2.5 15L21.5 15"></path>
				</svg>
			</button>
		</slot>

		<!-- باتم‌شیت انتخاب زبان -->
		<BottomSheetDrawer v-model="isOpen" :initial-height="0.42" :min-height="0.3" :max-height="0.6"
		backdrop-z-class="z-[2000000010]" panel-z-class="z-[2000000020]"
		:panelClass="'bg-white dark:bg-gray-900 border-t border-gray-500/70 dark:border-gray-700/70 rounded-t-2xl lg:rounded-b-2xl lg:w-[30rem] shadow-[0_-8px_30px_rgba(15,23,42,0.35)]'"
		:backdropClass="'bg-gray-300/30 dark:bg-gray-500/30 backdrop-blur-sm'"
		>
			<div class="flex flex-col">
				<h3 class="text-base md:text-lg font-bold text-gray-900 dark:text-gray-50 mb-1">
					{{ $t(title) }}
				</h3>
				<p class="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-4">
					{{ $t("lang.choose") }}
				</p>

				<ul class="flex flex-col gap-2">
					<li v-for="lang in langs" :key="lang.locale">
						<button type="button" @click="changeLang(lang)" :class="[
							selectedLang.locale === lang.locale
								? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-400/10'
								: 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800',
						]"
							class="group flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 transition-colors">
							<span class="flex items-center gap-3">
								<span v-if="showFlags" class="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg">
									<span v-if="lang.iconLabel"
										class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-lg font-bold leading-none text-emerald-600 dark:text-emerald-300">
										{{ lang.iconLabel }}
									</span>
									<country-flag v-else class="mask mask-squircle scale-[0.72]" :country="lang.flag"
										size="big" />
								</span>
								<span class="flex flex-col text-start">
									<span class="text-sm font-semibold text-gray-900 dark:text-gray-50">{{
										$t(lang.name) }}</span>
									<span class="text-xs text-gray-400 uppercase">{{ lang.locale }}</span>
								</span>
							</span>
							<span v-if="selectedLang.locale === lang.locale"
								class="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-white">
								<CheckIcon class="h-4 w-4" aria-hidden="true" />
							</span>
						</button>
					</li>
				</ul>
			</div>
		</BottomSheetDrawer>
	</div>
</template>
