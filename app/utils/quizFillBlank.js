/**
 * Parse fill-blank markers in question text.
 *
 * Supported markers:
 * - {{1}}, {{2}}, ... (1-based blank numbers)
 * - ___ (3+ underscores), sequential from 0
 *
 * Returns parts for inline rendering and blank indices used.
 */
export function parseFillBlankText(text = '') {
    const source = String(text || '');

    const explicit = [...source.matchAll(/\{\{(\d+)\}\}/g)];
    if (explicit.length) {
        const parts = [];
        const indices = [];
        let last = 0;

        explicit.forEach((match) => {
            if (match.index > last) {
                parts.push({ type: 'text', value: source.slice(last, match.index) });
            }
            const blankIndex = Math.max(0, parseInt(match[1], 10) - 1);
            parts.push({ type: 'blank', index: blankIndex });
            indices.push(blankIndex);
            last = match.index + match[0].length;
        });

        if (last < source.length) {
            parts.push({ type: 'text', value: source.slice(last) });
        }

        const unique = [...new Set(indices)].sort((a, b) => a - b);
        return {
            parts,
            blankCount: unique.length ? Math.max(...unique) + 1 : 0,
            indices: unique,
            mode: 'numbered',
        };
    }

    const parts = [];
    const indices = [];
    let last = 0;
    let blankIndex = 0;
    const re = /_{3,}/g;
    let match;

    while ((match = re.exec(source)) !== null) {
        if (match.index > last) {
            parts.push({ type: 'text', value: source.slice(last, match.index) });
        }
        parts.push({ type: 'blank', index: blankIndex });
        indices.push(blankIndex);
        blankIndex += 1;
        last = match.index + match[0].length;
    }

    if (last < source.length) {
        parts.push({ type: 'text', value: source.slice(last) });
    }

    if (!parts.length && source) {
        parts.push({ type: 'text', value: source });
    }

    return {
        parts,
        blankCount: blankIndex,
        indices,
        mode: blankIndex ? 'underscore' : 'none',
    };
}

export function blankCountFromQuestion(question) {
    const fromText = parseFillBlankText(question?.text || '');
    if (fromText.blankCount > 0) return fromText.blankCount;

    const max = Math.max(
        ...(question?.options || []).map((o) => (o.blank_index == null ? -1 : Number(o.blank_index))),
        -1,
    );
    return max >= 0 ? max + 1 : 0;
}
