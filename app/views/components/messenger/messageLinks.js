/**
 * Detect URLs in message bodies and classify clicks (external / app / invite).
 */
import { messengerOrigin, parseJoinTarget } from './inviteLinks';

/**
 * Match http(s), www., app /messenger/join|@ paths, and bare domains
 * (e.g. example.com/path) when they appear alone or mixed with other text.
 */
const URL_PATTERN = /https?:\/\/[^\s<>"']+|www\.[^\s<>"']+|\/messenger\/(?:join\/[^\s<>"']+|@[^\s<>"']+)|(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,24})(?::\d{2,5})?(?:\/[^\s<>"']*)?/gi;

const TRAILING_PUNCT = /[)\].,;:!?،؛»"'…]+$/;

/** Reject bare "words.with.dots" that are not plausible hosts (no TLD digits-only, etc.). */
const BARE_HOST_OK = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/i;

function trimTrailingPunct(raw) {
  return String(raw || '').replace(TRAILING_PUNCT, '');
}

function isPlausibleBareUrl(token) {
  const t = String(token || '');
  if (/^https?:\/\//i.test(t) || /^www\./i.test(t) || t.startsWith('/')) return true;
  const host = t.split('/')[0].split(':')[0];
  return BARE_HOST_OK.test(host);
}

/**
 * Normalize a matched token into an absolute or root-relative href.
 */
export function normalizeHref(token) {
  const t = trimTrailingPunct(String(token || '').trim());
  if (!t) return '';
  if (t.startsWith('/')) return t;
  if (/^www\./i.test(t)) return `https://${t}`;
  if (/^https?:\/\//i.test(t)) return t;
  // Bare domain / path → https
  if (isPlausibleBareUrl(t)) return `https://${t}`;
  return t;
}

/** True when body contains at least one detectable link. */
export function messageBodyHasLink(body) {
  const parts = linkifyMessageBody(body);
  return parts.some((p) => p?.type === 'link' && p.href);
}

/**
 * Persist a plaintext `has_link` flag in message meta so shared-media can find
 * links even when the body is E2E ciphertext on the server.
 */
export function withLinkFlag(meta, body) {
  const base = (meta && typeof meta === 'object' && !Array.isArray(meta))
    ? { ...meta }
    : {};
  if (messageBodyHasLink(body)) {
    base.has_link = true;
  } else if ('has_link' in base) {
    delete base.has_link;
  }
  return Object.keys(base).length ? base : null;
}

/**
 * Split message body into [{ type: 'text', text } | { type: 'link', text, href }].
 */
export function linkifyMessageBody(body) {
  const text = body == null ? '' : String(body);
  if (!text) return [{ type: 'text', text: '' }];

  const parts = [];
  let last = 0;
  URL_PATTERN.lastIndex = 0;
  let m = URL_PATTERN.exec(text);
  while (m) {
    const full = m[0];
    const start = m.index;
    const trimmed = trimTrailingPunct(full);
    const end = start + trimmed.length;
    if (start > last) {
      parts.push({ type: 'text', text: text.slice(last, start) });
    }
    if (trimmed && isPlausibleBareUrl(trimmed)) {
      parts.push({ type: 'link', text: trimmed, href: normalizeHref(trimmed) });
    } else if (trimmed) {
      // Keep rejected bare tokens as plain text (false-positive domains).
      parts.push({ type: 'text', text: trimmed });
    }
    // Keep any stripped trailing punct as plain text.
    if (end < start + full.length) {
      parts.push({ type: 'text', text: text.slice(end, start + full.length) });
      last = start + full.length;
    } else {
      last = end;
    }
    m = URL_PATTERN.exec(text);
  }
  if (last < text.length) {
    parts.push({ type: 'text', text: text.slice(last) });
  }
  return parts.length ? parts : [{ type: 'text', text }];
}

/**
 * @returns {{ kind: 'external'|'internal'|'invite'|'community', href: string, value?: string }}
 */
export function classifyMessageHref(href) {
  const raw = String(href || '').trim();
  if (!raw) return { kind: 'external', href: raw };

  const origin = messengerOrigin();
  let url;
  try {
    if (raw.startsWith('/')) {
      url = new URL(raw, origin || 'https://local.invalid');
    } else {
      url = new URL(raw);
    }
  } catch (e) {
    return { kind: 'external', href: raw };
  }

  const sameOrigin = !origin || url.origin === origin
    || (raw.startsWith('/') && !/^https?:/i.test(raw));

  if (sameOrigin) {
    const join = parseJoinTarget(url.href);
    if (join?.kind === 'invite') {
      return { kind: 'invite', href: url.pathname + url.search, value: join.value };
    }
    if (join?.kind === 'username') {
      return { kind: 'community', href: url.pathname + url.search, value: join.value };
    }
    return {
      kind: 'internal',
      href: `${url.pathname}${url.search}${url.hash}` || '/',
    };
  }

  return { kind: 'external', href: url.href };
}
