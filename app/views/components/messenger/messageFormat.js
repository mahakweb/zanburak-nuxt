/**
 * Lightweight Telegram-like message formatting.
 *
 * Manual markers (also applied via composer format menu):
 *   **bold**   *italic*   __underline__   ^^superscript^^   ,,subscript,,
 */

import { linkifyMessageBody, normalizeHref } from './messageLinks';

export const FORMAT_KINDS = {
  bold: { open: '**', close: '**' },
  italic: { open: '*', close: '*' },
  underline: { open: '__', close: '__' },
  superscript: { open: '^^', close: '^^' },
  subscript: { open: ',,', close: ',,' },
};

/** Longest markers first so ** wins over *. */
const PARSE_RULES = [
  { kind: 'bold', open: '**', close: '**' },
  { kind: 'underline', open: '__', close: '__' },
  { kind: 'superscript', open: '^^', close: '^^' },
  { kind: 'subscript', open: ',,', close: ',,' },
  { kind: 'italic', open: '*', close: '*' },
];

/**
 * Wrap (or unwrap) the selected range with a format marker.
 * Empty selection inserts open+close and places the caret between them.
 */
export function applyFormatMarker(text, start, end, kind) {
  const marker = FORMAT_KINDS[kind];
  if (!marker) {
    return { text, start, end };
  }
  const { open, close } = marker;
  const value = String(text ?? '');
  const s = Math.max(0, Math.min(start, end));
  const e = Math.max(0, Math.max(start, end));
  const selected = value.slice(s, e);

  // Selection already includes markers → unwrap.
  if (
    selected.length >= open.length + close.length
    && selected.startsWith(open)
    && selected.endsWith(close)
  ) {
    const inner = selected.slice(open.length, selected.length - close.length);
    return {
      text: value.slice(0, s) + inner + value.slice(e),
      start: s,
      end: s + inner.length,
    };
  }

  // Markers sit just outside the selection → unwrap.
  const before = value.slice(Math.max(0, s - open.length), s);
  const after = value.slice(e, e + close.length);
  if (before === open && after === close) {
    return {
      text: value.slice(0, s - open.length) + selected + value.slice(e + close.length),
      start: s - open.length,
      end: s - open.length + selected.length,
    };
  }

  const wrapped = `${open}${selected}${close}`;
  const next = value.slice(0, s) + wrapped + value.slice(e);
  if (!selected) {
    const caret = s + open.length;
    return { text: next, start: caret, end: caret };
  }
  return { text: next, start: s, end: s + wrapped.length };
}

/**
 * Strip formatting markers for previews / plain clipboard copies of styled text.
 */
export function stripFormatMarkers(body) {
  return flattenLeaves(parseFormats(String(body ?? '')))
    .map((n) => n.text)
    .join('');
}

/**
 * Parse body into render parts: text / link with optional style flags.
 * @returns {Array<{ type: 'text'|'link', text: string, href?: string, styles: string[] }>}
 */
export function formatMessageBody(body) {
  const leaves = flattenLeaves(parseFormats(String(body ?? '')));
  const parts = [];

  for (const leaf of leaves) {
    const linked = linkifyMessageBody(leaf.text);
    for (const chunk of linked) {
      if (!chunk.text && chunk.type === 'text') continue;
      if (chunk.type === 'link') {
        parts.push({
          type: 'link',
          text: chunk.text,
          href: chunk.href || normalizeHref(chunk.text),
          styles: leaf.styles.slice(),
        });
      } else {
        parts.push({
          type: 'text',
          text: chunk.text,
          styles: leaf.styles.slice(),
        });
      }
    }
  }

  return parts.length ? parts : [{ type: 'text', text: '', styles: [] }];
}

function parseFormats(text, depth = 0) {
  if (!text) return [{ type: 'text', text: '', styles: [] }];
  if (depth > 12) return [{ type: 'text', text, styles: [] }];

  let earliest = null;
  for (const rule of PARSE_RULES) {
    const idx = text.indexOf(rule.open);
    if (idx === -1) continue;
    if (!earliest || idx < earliest.idx || (idx === earliest.idx && rule.open.length > earliest.rule.open.length)) {
      earliest = { idx, rule };
    }
  }

  if (!earliest) {
    return [{ type: 'text', text, styles: [] }];
  }

  const { idx, rule } = earliest;
  const closeIdx = text.indexOf(rule.close, idx + rule.open.length);
  if (closeIdx === -1) {
    // Unmatched opener — treat opener char(s) as literal and continue after.
    const before = text.slice(0, idx + rule.open.length);
    const rest = parseFormats(text.slice(idx + rule.open.length), depth + 1);
    return [{ type: 'text', text: before, styles: [] }, ...rest];
  }

  const before = text.slice(0, idx);
  const inner = text.slice(idx + rule.open.length, closeIdx);
  const after = text.slice(closeIdx + rule.close.length);

  const nodes = [];
  if (before) nodes.push({ type: 'text', text: before, styles: [] });

  const innerNodes = parseFormats(inner, depth + 1).map((n) => ({
    ...n,
    styles: n.styles.includes(rule.kind) ? n.styles : [...n.styles, rule.kind],
  }));
  nodes.push(...innerNodes);

  if (after) nodes.push(...parseFormats(after, depth + 1));
  return nodes;
}

function flattenLeaves(nodes) {
  const out = [];
  for (const n of nodes) {
    if (!n) continue;
    if (n.type === 'text') {
      out.push({ text: n.text, styles: n.styles || [] });
    }
  }
  return out.length ? out : [{ text: '', styles: [] }];
}
