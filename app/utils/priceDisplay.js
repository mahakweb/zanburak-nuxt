export function toAmount(value) {
    const amount = Number(value);
    return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

export function courseOriginalPrice(course) {
    return toAmount(course?.original_price ?? course?.price);
}

export function courseCurrentPrice(course) {
    if (course?.current_price != null && course.current_price !== '') {
        return Math.max(0, Number(course.current_price) || 0);
    }
    if (course?.has_discount && course?.discount_amount != null) {
        return Math.max(0, courseOriginalPrice(course) - toAmount(course.discount_amount));
    }
    return courseOriginalPrice(course);
}

export function courseHasDiscount(course) {
    if (course?.has_discount === true) {
        return courseCurrentPrice(course) < courseOriginalPrice(course);
    }
    const original = courseOriginalPrice(course);
    const current = courseCurrentPrice(course);
    return original > 0 && current < original;
}

export function courseDiscountPercent(course) {
    const original = courseOriginalPrice(course);
    if (original <= 0) {
        return 0;
    }
    if (course?.discount_percentage) {
        return Math.round(Number(course.discount_percentage));
    }
    const current = courseCurrentPrice(course);
    return Math.round(((original - current) / original) * 100);
}

export function formatToman(value) {
    return toAmount(value).toLocaleString();
}
