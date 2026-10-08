/**
 * Collapse newlines so bio / description stay single-line (no Enter).
 */
export function stripNewlines(value) {
  return String(value ?? '').replace(/[\r\n]+/g, ' ');
}

/**
 * Split text into segments for Telegram-style search highlighting.
 * @returns {Array<{ text: string, hit: boolean }>}
 */
export function splitHighlight(text, query) {
  const s = String(text ?? '');
  const q = String(query ?? '').trim();
  if (!q || !s) return [{ text: s, hit: false }];
  const lower = s.toLowerCase();
  const ql = q.toLowerCase();
  const out = [];
  let i = 0;
  while (i < s.length) {
    const at = lower.indexOf(ql, i);
    if (at === -1) {
      out.push({ text: s.slice(i), hit: false });
      break;
    }
    if (at > i) out.push({ text: s.slice(i, at), hit: false });
    out.push({ text: s.slice(at, at + q.length), hit: true });
    i = at + Math.max(q.length, 1);
  }
  return out.length ? out : [{ text: s, hit: false }];
}

/**
 * Keep paste / typed bio text single-line without leaving trailing double spaces.
 */
export function toSingleLine(value) {
  return stripNewlines(value).replace(/ {2,}/g, ' ');
}

/**
 * Map mouse wheel (and trackpad) to horizontal scroll on single-line fields.
 * Scrollbar stays hidden; touch swipe still uses native overflow-x.
 */
export function onHorizontalWheel(e) {
  const el = e.currentTarget;
  if (!el) return;
  const max = el.scrollWidth - el.clientWidth;
  if (max <= 0) return;

  const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
  if (!dx) return;

  const next = Math.max(0, Math.min(max, el.scrollLeft + dx));
  if (next === el.scrollLeft) return;

  el.scrollLeft = next;
  e.preventDefault();
}
