export function parseTimeToSeconds(timeStr) {
    if (!timeStr) return null;
    const parts = timeStr.split(':').map((p) => parseInt(p, 10));
    if (parts.some((n) => Number.isNaN(n))) return null;
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 1) return parts[0];
    return null;
}

/**
 * Extract video chapters from episode description lines like:
 * `05:30 Introduction` or `1:05:00 Advanced topic`
 */
export function extractVideoSegments(src) {
    if (!src || typeof src !== 'string') return [];
    const segments = [];
    const linePattern = /^\s*(\d{1,2}:\d{2}(?::\d{2})?)\s+(.+)$/;
    for (const line of src.split(/\r?\n/)) {
        const m = line.match(linePattern);
        if (!m) continue;
        const time = parseTimeToSeconds(m[1]);
        if (time !== null) {
            segments.push({ time, label: m[2].trim(), timeText: m[1] });
        }
    }
    return segments.sort((a, b) => a.time - b.time);
}
