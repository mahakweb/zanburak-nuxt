const COVER_ACCEPT = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const COVER_MAX = 5 * 1024 * 1024;

function plainTextLength(html) {
    return (html || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().length;
}

function isValidUrl(value) {
    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

export function calculateArticleReadingTime(content) {
    const plain = (content || '')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/<[^>]*>/g, '')
        .trim();
    const words = plain.split(/\s+/).filter(Boolean);
    return Math.max(1, Math.ceil(words.length / 200));
}

export function validateArticleForm(form, { tags = [], coverFile = null, requireCover = false } = {}) {
    const errors = {};

    const title = (form.title || '').trim();
    if (!title) {
        errors.title = ['عنوان مقاله الزامی است.'];
    } else if (title.length < 5) {
        errors.title = ['عنوان باید حداقل ۵ کاراکتر باشد.'];
    } else if (title.length > 255) {
        errors.title = ['عنوان نباید بیشتر از ۲۵۵ کاراکتر باشد.'];
    }

    const englishTitle = (form.english_title || '').trim();
    if (englishTitle.length > 255) {
        errors.english_title = ['عنوان انگلیسی نباید بیشتر از ۲۵۵ کاراکتر باشد.'];
    } else if (englishTitle && !/^[a-zA-Z0-9 _-]+$/.test(englishTitle)) {
        errors.english_title = ['عنوان انگلیسی فقط می‌تواند شامل حروف انگلیسی، اعداد، خط تیره و زیرخط باشد.'];
    }

    if (!form.category_id) {
        errors.category_id = ['انتخاب دسته‌بندی الزامی است.'];
    }

    if (!form.user_id) {
        errors.user_id = ['نویسنده مقاله مشخص نشده است.'];
    }

    const excerpt = form.excerpt || '';
    if (excerpt.length > 500) {
        errors.excerpt = ['خلاصه مقاله نباید بیشتر از ۵۰۰ کاراکتر باشد.'];
    }

    const contentLen = plainTextLength(form.content);
    if (contentLen === 0) {
        errors.content = ['محتوای مقاله الزامی است.'];
    } else if (contentLen < 50) {
        errors.content = ['محتوای مقاله باید حداقل ۵۰ کاراکتر باشد.'];
    }

    if (form.reading_time_minutes !== null && form.reading_time_minutes !== '' && form.reading_time_minutes !== undefined) {
        const minutes = Number(form.reading_time_minutes);
        if (!Number.isInteger(minutes) || minutes < 1) {
            errors.reading_time_minutes = ['زمان مطالعه باید عدد صحیح و حداقل ۱ دقیقه باشد.'];
        } else if (minutes > 999) {
            errors.reading_time_minutes = ['زمان مطالعه نباید بیشتر از ۹۹۹ دقیقه باشد.'];
        }
    }

    if (Array.isArray(tags)) {
        if (tags.length > 5) {
            errors.tags = ['حداکثر ۵ تگ مجاز است.'];
        } else {
            const invalidTag = tags.find((t) => !t || t.length > 30 || /\s/.test(t));
            if (invalidTag) {
                errors.tags = ['هر تگ حداکثر ۳۰ کاراکتر و بدون فاصله باشد.'];
            }
        }
    }

    const seoTitle = form.seo_title || '';
    if (seoTitle.length > 255) {
        errors.seo_title = ['عنوان SEO نباید بیشتر از ۲۵۵ کاراکتر باشد.'];
    }

    const seoDescription = form.seo_description || '';
    if (seoDescription.length > 500) {
        errors.seo_description = ['توضیحات SEO نباید بیشتر از ۵۰۰ کاراکتر باشد.'];
    }

    const canonicalUrl = (form.canonical_url || '').trim();
    if (canonicalUrl && !isValidUrl(canonicalUrl)) {
        errors.canonical_url = ['آدرس Canonical معتبر نیست.'];
    }

    const ogImage = form.og_image || '';
    if (ogImage.length > 500) {
        errors.og_image = ['آدرس OG Image نباید بیشتر از ۵۰۰ کاراکتر باشد.'];
    }

    if (coverFile) {
        if (!COVER_ACCEPT.includes(coverFile.type)) {
            errors.cover_image = ['فرمت تصویر کاور مجاز نیست (JPG, PNG, WebP, GIF).'];
        } else if (coverFile.size > COVER_MAX) {
            errors.cover_image = ['حجم تصویر کاور نباید بیشتر از ۵ مگابایت باشد.'];
        }
    } else if (requireCover) {
        errors.cover_image = ['تصویر کاور الزامی است.'];
    }

    return errors;
}

export function filterEnglishTitle(value) {
    return (value || '').replace(/[^a-zA-Z0-9 _-]/g, '');
}
