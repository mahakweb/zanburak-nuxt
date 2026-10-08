export function formatFileSize(bytes, decimal = 1, lang = 'en') {
    const units = {
        fa: ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'],
        en: ['B', 'KB', 'MB', 'GB'],
    };
    const selectedUnits = units[lang] || units.en;
    const n = Number(bytes) || 0;

    if (n < 1024) return `${n} ${selectedUnits[0]}`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(decimal)} ${selectedUnits[1]}`;
    if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(decimal)} ${selectedUnits[2]}`;
    return `${(n / (1024 * 1024 * 1024)).toFixed(decimal)} ${selectedUnits[3]}`;
}
