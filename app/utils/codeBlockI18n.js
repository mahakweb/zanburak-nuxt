import fa from '@/translate/locales/fa.json';
import en from '@/translate/locales/en.json';

const messages = { fa, en };

export function codeBlockT(key) {
    const locale = localStorage.getItem('locale') || 'fa';
    const dict = messages[locale] || messages.fa;
    return dict[key] || key;
}
