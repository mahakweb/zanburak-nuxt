/**
 * Strip status suffix from course title when status is shown via ribbon/badge.
 */
export function cleanCourseTitle(title, status = null) {
    if (!title || typeof title !== 'string') {
        return '';
    }

    let cleaned = title.trim();

    if (status?.title) {
        const patterns = [
            ` — ${status.title}`,
            ` - ${status.title}`,
            `– ${status.title}`,
        ];
        for (const suffix of patterns) {
            if (cleaned.endsWith(suffix)) {
                cleaned = cleaned.slice(0, -suffix.length).trim();
                break;
            }
        }
    }

    return cleaned.replace(/\s*[—–-]\s*(پیش‌فروش|به‌زودی|آرشیو|در حال برگزاری|تکمیل ضبط)\s*$/u, '').trim();
}

export const emptyCourseRatings = () => ({
    countOfOne: 0,
    countOfTwo: 0,
    countOfThree: 0,
    countOfFour: 0,
    countOfFive: 0,
    countOfAll: 0,
    sumOfAll: 0,
    averageRating: 0,
    currentUserRate: null,
});

const compareByOrder = (a, b, fallbackKey = 'id') => {
    const ao = Number(a?.order);
    const bo = Number(b?.order);
    const aHasOrder = Number.isFinite(ao);
    const bHasOrder = Number.isFinite(bo);
    if (aHasOrder && bHasOrder) return ao - bo;
    if (aHasOrder) return -1;
    if (bHasOrder) return 1;
    return (Number(a?.[fallbackKey]) || 0) - (Number(b?.[fallbackKey]) || 0);
};

/** Sort episodes by global `order` field. */
export function sortEpisodesByOrder(episodes = []) {
    if (!Array.isArray(episodes)) return [];
    return [...episodes].sort((a, b) => compareByOrder(a, b));
}

const sectionSortKey = (section) => {
    const eps = section?.episode || [];
    if (eps.length) {
        const orders = eps.map((ep) => Number(ep.order)).filter(Number.isFinite);
        if (orders.length) return Math.min(...orders);
    }
    const sectionOrder = Number(section?.order);
    if (Number.isFinite(sectionOrder)) return sectionOrder;
    return Number(section?.id) || 0;
};

/** Sort sections by min episode order (or section.order / id), episodes inside each section by order. */
export function sortCourseSections(sections = []) {
    if (!Array.isArray(sections)) return [];

    const normalized = sections.map((section) => {
        const rawEpisodes = section?.episode ?? section?.episodes ?? section?.items ?? [];
        const episode = sortEpisodesByOrder(rawEpisodes);
        return { ...section, episode };
    });

    return normalized.sort((a, b) => {
        const diff = sectionSortKey(a) - sectionSortKey(b);
        if (diff !== 0) return diff;
        return compareByOrder(a, b);
    });
}

/** Flatten all course episodes in display order (sections + episode.order). */
export function flattenCourseEpisodes(sections = [], extra = {}) {
    const flat = [];
    for (const section of sortCourseSections(sections)) {
        for (const ep of section.episode || []) {
            flat.push({ ...ep, ...extra });
        }
    }
    return flat;
}
