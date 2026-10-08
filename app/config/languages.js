/**
 * Supported UI languages for the frontend.
 * Used by ChangeLang, panel account menu, and i18n bootstrap.
 */
export const SUPPORTED_LANGUAGES = [
    { name: 'lang.persian', locale: 'fa', dir: 'rtl', flag: 'ir' },
    { name: 'lang.english', locale: 'en', dir: 'ltr', flag: 'us' },
    // Arabic is spoken across many countries, so instead of a single country
    // flag we show an Arabic-script letter as a language-appropriate icon.
    { name: 'lang.arabic', locale: 'ar', dir: 'rtl', flag: null, iconLabel: 'ع' },
    { name: 'lang.turkish', locale: 'tr', dir: 'ltr', flag: 'tr' },
];

export const SUPPORTED_LOCALES = SUPPORTED_LANGUAGES.map((lang) => lang.locale);

export function getLanguageByLocale(locale) {
    return SUPPORTED_LANGUAGES.find((lang) => lang.locale === locale) || SUPPORTED_LANGUAGES[0];
}
