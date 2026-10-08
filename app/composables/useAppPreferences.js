import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { SUPPORTED_LANGUAGES } from '@/config/languages';

let localeBootstrapped = false;

/**
 * Shared language + theme switching logic for account menus
 * (panel, homepage navbar, admin). Keeps the same behaviour as the
 * standalone ChangeLang.vue / DarkMode.vue components.
 */
export function useAppPreferences() {
    const { locale } = useI18n({ useScope: 'global' });

    /* ---------- Language ---------- */
    const langs = SUPPORTED_LANGUAGES;
    // Derive the selected language from the global reactive i18n locale so it
    // stays in sync no matter where the language was changed.
    const currentLocale = computed(() => locale.value);
    const selectedLang = computed(
        () => langs.find((l) => l.locale === locale.value) || langs[0]
    );

    function changeLang(lang) {
        document.documentElement.dir = lang.dir;
        document.documentElement.lang = lang.locale;
        localStorage.setItem('direction', lang.dir);
        localStorage.setItem('locale', lang.locale);
        locale.value = lang.locale;
        document.documentElement.dispatchEvent(new Event('onChangeLanguage'));
    }

    if (!localeBootstrapped && import.meta.client) {
        localeBootstrapped = true;
        const storedLocale = localStorage.getItem('locale');
        if (storedLocale && storedLocale !== locale.value) {
            const lang = langs.find((l) => l.locale === storedLocale);
            if (lang) {
                locale.value = storedLocale;
                document.documentElement.dir = lang.dir;
                document.documentElement.lang = lang.locale;
            }
        }
    }

    /* ---------- Theme ---------- */
    const themeArray = ['system', 'dark', 'light'];
    const themeMeta = {
        system: { labelKey: 'theme.system', shortKey: 'theme.systemShort' },
        dark: { labelKey: 'theme.dark', shortKey: 'theme.darkShort' },
        light: { labelKey: 'theme.light', shortKey: 'theme.lightShort' },
    };
    const currentTheme = ref(
        import.meta.client ? (localStorage.getItem('theme') || 'system') : 'system'
    );

    function changeTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else if (theme === 'light') {
            document.documentElement.classList.remove('dark');
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
        currentTheme.value = theme;
        document.documentElement.dispatchEvent(new Event('onChangeTheme'));
    }

    return {
        langs,
        selectedLang,
        currentLocale,
        changeLang,
        themeArray,
        themeMeta,
        currentTheme,
        changeTheme,
    };
}

/**
 * Accent color class presets so each menu keeps its own theme color
 * while sharing the same markup.
 */
export const MENU_ACCENTS = {
    emerald: {
        iconText: 'text-emerald-500',
        rowHover: 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20 dark:hover:text-white',
        border: 'border-emerald-100 dark:border-emerald-900/40',
        borderDashed: 'border-emerald-100 dark:border-emerald-900/40',
        selected: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-400/10',
        checkBg: 'bg-emerald-500',
        optionIconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
        backBtn: 'border-emerald-100 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/40',
    },
    amber: {
        iconText: 'text-amber-500',
        rowHover: 'hover:bg-amber-50 dark:hover:bg-amber-900/20 dark:hover:text-white',
        border: 'border-amber-100 dark:border-amber-900/40',
        borderDashed: 'border-amber-100 dark:border-amber-900/40',
        selected: 'border-amber-400 bg-amber-50 dark:bg-amber-400/10',
        checkBg: 'bg-amber-500',
        optionIconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-300',
        backBtn: 'border-amber-100 bg-amber-50 text-amber-600 hover:bg-amber-100 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300 dark:hover:bg-amber-900/40',
    },
    violet: {
        iconText: 'text-violet-500',
        rowHover: 'hover:bg-violet-50 dark:hover:bg-violet-900/20 dark:hover:text-white',
        border: 'border-violet-100 dark:border-violet-900/40',
        borderDashed: 'border-violet-100 dark:border-violet-900/40',
        selected: 'border-violet-400 bg-violet-50 dark:bg-violet-400/10',
        checkBg: 'bg-violet-500',
        optionIconBg: 'bg-violet-500/10 text-violet-600 dark:text-violet-300',
        backBtn: 'border-violet-100 bg-violet-50 text-violet-600 hover:bg-violet-100 dark:border-violet-900/40 dark:bg-violet-900/20 dark:text-violet-300 dark:hover:bg-violet-900/40',
    },
};
