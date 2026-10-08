export const TAG_MIN_LENGTH = 2;
export const TAG_MAX_LENGTH = 20;
export const TAG_NAME_PATTERN = /^[\p{L}\p{N}_-]+$/u;
export const TAG_EDGE_PATTERN = /^[-_]|[-_]$/u;

export function sanitizeTagInput(value) {
    return String(value ?? "")
        .replace(/\s+/g, "-")
        .replace(/[^\p{L}\p{N}_-]/gu, "");
}

export function validateTagName(name, t = (key) => key) {
    const trimmed = String(name ?? "").trim();

    if (!trimmed) {
        return t("tags.invalidTagEmpty");
    }
    if (trimmed.length < TAG_MIN_LENGTH) {
        return t("tags.invalidTagMin");
    }
    if (trimmed.length > TAG_MAX_LENGTH) {
        return t("tags.invalidTagMax");
    }
    if (/\s/.test(trimmed)) {
        return t("tags.invalidTagSpace");
    }
    if (!TAG_NAME_PATTERN.test(trimmed)) {
        return t("tags.invalidTagChars");
    }
    if (TAG_EDGE_PATTERN.test(trimmed)) {
        return t("tags.invalidTagEdge");
    }

    return null;
}
