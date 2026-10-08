import { stripFormatMarkers } from './messageFormat';

/** Telegram-like floor for meaningful text search (global + in-chat). */
export const SEARCH_MIN_CHARS = 3;

export function normalizeSearchQuery(q) {
  return String(q || '').trim();
}

export function meetsSearchMin(q) {
  return normalizeSearchQuery(q).length >= SEARCH_MIN_CHARS;
}

/** Plaintext searchable snippet from a message (skips locked/ciphertext). */
export function messageSearchPlaintext(m, t = null) {
  if (!m || m.type === 'system') return '';
  if (m._e2e_locked || m._decryptFailed) return '';

  let body = stripFormatMarkers(m.body || '').replace(/\s+/g, ' ').trim();

  // Still looks like raw ciphertext — not useful for search.
  if (m.is_encrypted && !m._e2e_decrypted) {
    if (!body) return '';
    // Base64-ish blob without spaces: skip.
    if (body.length > 40 && !/\s/.test(body) && /^[A-Za-z0-9+/=_-]+$/.test(body)) {
      return '';
    }
  }

  if (m.type === 'location') {
    return t ? String(t('messenger.location') || 'location') : 'location';
  }

  if (['photo', 'video', 'voice', 'audio', 'file'].includes(m.type) && !body) {
    if (!t) return m.meta?.name || m.type || '';
    if (m.type === 'photo') return String(t('messenger.mediaPhoto') || 'photo');
    if (m.type === 'video') return String(t('messenger.mediaVideo') || 'video');
    if (m.type === 'voice') return String(t('messenger.mediaVoice') || 'voice');
    if (m.type === 'file') return String(m.meta?.name || t('messenger.mediaFile') || 'file');
    return String(t('messenger.mediaAudio') || 'audio');
  }

  return body;
}

export function messageMatchesQuery(m, query, t = null) {
  const q = normalizeSearchQuery(query).toLowerCase();
  if (!q) return false;
  const text = messageSearchPlaintext(m, t).toLowerCase();
  return !!text && text.includes(q);
}

/**
 * Search decrypted/local messages already in the Vuex cache.
 * @returns {Array} newest-first hits shaped like API rows (with conversation attached when possible)
 */
export function searchCachedMessages({
  messagesByConv,
  conversations,
  query,
  conversationId = null,
  limit = 40,
  t = null,
  from = null,
  to = null,
} = {}) {
  const q = normalizeSearchQuery(query);
  if (q && !meetsSearchMin(q) && !from && !to) return [];

  const fromTs = from ? Date.parse(`${from}T00:00:00`) : NaN;
  const toTs = to ? Date.parse(`${to}T23:59:59`) : NaN;
  const convMap = Object.fromEntries(
    (conversations || []).map((c) => [String(c.id), c]),
  );

  const hits = [];
  const entries = conversationId != null
    ? [[String(conversationId), messagesByConv?.[conversationId] || []]]
    : Object.entries(messagesByConv || {});

  for (const [cid, list] of entries) {
    const conv = convMap[String(cid)] || { id: Number(cid) || cid };
    for (const m of list || []) {
      if (m?.type === 'system') continue;
      if (q && !messageMatchesQuery(m, q, t)) continue;
      if (Number.isFinite(fromTs) || Number.isFinite(toTs)) {
        const created = Date.parse(m.created_at || '');
        if (!Number.isFinite(created)) continue;
        if (Number.isFinite(fromTs) && created < fromTs) continue;
        if (Number.isFinite(toTs) && created > toTs) continue;
      }
      hits.push({
        ...m,
        conversation_id: m.conversation_id ?? (Number(cid) || cid),
        conversation: m.conversation || conv,
      });
    }
  }

  hits.sort((a, b) => Number(b.id) - Number(a.id));
  return hits.slice(0, limit);
}

/** Merge server + local hits by message id (local plaintext preferred). */
export function mergeMessageSearchHits(localRows, serverRows, limit = 40) {
  const map = new Map();
  for (const row of serverRows || []) {
    if (row?.id == null) continue;
    map.set(String(row.id), row);
  }
  for (const row of localRows || []) {
    if (row?.id == null) continue;
    const key = String(row.id);
    const prev = map.get(key);
    if (!prev) {
      map.set(key, row);
      continue;
    }
    // Prefer the row that has usable plaintext body.
    const prevPlain = messageSearchPlaintext(prev);
    const nextPlain = messageSearchPlaintext(row);
    if ((!prevPlain && nextPlain) || (row._e2e_decrypted && !prev._e2e_decrypted)) {
      map.set(key, { ...prev, ...row, conversation: row.conversation || prev.conversation });
    }
  }
  return Array.from(map.values())
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, limit);
}
