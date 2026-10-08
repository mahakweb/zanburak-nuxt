/**
 * Durable local messenger outbox (Telegram-style).
 * Text/media payloads survive refresh and are flushed per-conversation in order.
 */

const DB_NAME = 'zanburak_messenger_outbox';
const DB_VERSION = 1;
const STORE_ITEMS = 'items';
const STORE_BLOBS = 'blobs';

let dbPromise = null;
let seqCounter = 0;

export function nextLocalSeq() {
  seqCounter += 1;
  return Date.now() * 1000 + (seqCounter % 1000);
}

/** UTC stamp with microsecond tie-break so a burst keeps click order. */
export function clientSentAtFromLocalSeq(localSeq, fallbackIso = null) {
  const seq = Number(localSeq);
  if (!Number.isFinite(seq) || seq <= 0) return fallbackIso || null;
  const ms = Math.floor(seq / 1000);
  const extraUs = seq % 1000;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return fallbackIso || null;
  const pad = (n, w = 2) => String(Math.trunc(Math.abs(n))).padStart(w, '0');
  const iso = d.toISOString();
  return iso.replace(/\.(\d{3})Z$/, (_, fraction) => `.${fraction}${pad(extraUs, 3)}Z`);
}

/** Telegram-style retry delay: exponential backoff with jitter (ms). */
export function outboxBackoffMs(attempts = 0) {
  const n = Math.max(0, Math.min(8, Number(attempts) || 0));
  const base = Math.min(30_000, 400 * (2 ** n));
  const jitter = Math.floor(Math.random() * Math.min(400, base * 0.25));
  return base + jitter;
}

/** True when an outbox row is due for another send attempt. */
export function outboxIsDue(row, now = Date.now()) {
  if (!row || row.status === 'failed') return false;
  // Stale "sending" (tab crash / kill) is recovered by hydrate; live sends
  // are gated by outboxInFlight, not this helper.
  if (row.status === 'sending') {
    const started = row.next_attempt_at ? Date.parse(row.next_attempt_at) : 0;
    // Treat abandoned sending rows as due after 2 minutes.
    if (!Number.isFinite(started) || started <= 0 || (now - started) > 120_000) {
      return true;
    }
    return false;
  }
  const next = row.next_attempt_at ? Date.parse(row.next_attempt_at) : 0;
  if (Number.isFinite(next) && next > now) return false;
  return true;
}

function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') {
      resolve(null);
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_ITEMS)) {
        const store = db.createObjectStore(STORE_ITEMS, { keyPath: 'client_id' });
        store.createIndex('by_conversation', 'conversation_id', { unique: false });
        store.createIndex('by_created', 'created_at', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_BLOBS)) {
        db.createObjectStore(STORE_BLOBS, { keyPath: 'client_id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
  return dbPromise;
}

function idbReq(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('IndexedDB error'));
  });
}

function txDone(tx) {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error('IndexedDB tx error'));
    tx.onabort = () => reject(tx.error || new Error('IndexedDB tx aborted'));
  });
}

/**
 * Persist a queued outgoing message. `blob` / `coverBlob` optional (media).
 */
export async function outboxPut(item, { blob = null, coverBlob = null } = {}) {
  const db = await openDb();
  if (!db || !item?.client_id) return false;
  const row = {
    client_id: item.client_id,
    conversation_id: Number(item.conversation_id),
    kind: item.kind || 'text',
    body: item.body || '',
    type: item.type || 'text',
    meta: item.meta || null,
    reply_to_id: item.reply_to_id ?? null,
    reply_show_title: item.reply_show_title !== false,
    created_at: item.created_at || new Date().toISOString(),
    local_seq: item.local_seq || nextLocalSeq(),
    status: item.status || 'queued',
    attempts: item.attempts || 0,
    next_attempt_at: item.next_attempt_at || null,
    last_error: item.last_error || null,
    user_id: item.user_id ?? null,
    silent: !!item.silent,
    animation: !!item.animation,
    sticker: !!item.sticker,
    sticker_id: item.sticker_id || null,
    sticker_pack_id: item.sticker_pack_id || null,
    sticker_emoji: item.sticker_emoji || null,
    album_id: item.album_id || null,
    album_index: item.album_index ?? null,
    album_count: item.album_count ?? null,
    duration: item.duration ?? null,
    width: item.width ?? null,
    height: item.height ?? null,
    file_name: item.file_name || null,
    file_type: item.file_type || null,
    cover_name: item.cover_name || null,
    cover_type: item.cover_type || null,
  };
  try {
    const tx = db.transaction([STORE_ITEMS, STORE_BLOBS], 'readwrite');
    tx.objectStore(STORE_ITEMS).put(row);
    if (blob instanceof Blob) {
      tx.objectStore(STORE_BLOBS).put({
        client_id: item.client_id,
        blob,
        coverBlob: coverBlob instanceof Blob ? coverBlob : null,
      });
    }
    await txDone(tx);
    return true;
  } catch (e) {
    return false;
  }
}

export async function outboxUpdate(clientId, patch) {
  const db = await openDb();
  if (!db || !clientId) return false;
  try {
    const tx = db.transaction(STORE_ITEMS, 'readwrite');
    const store = tx.objectStore(STORE_ITEMS);
    const existing = await idbReq(store.get(clientId));
    if (!existing) return false;
    store.put({ ...existing, ...patch, client_id: clientId });
    await txDone(tx);
    return true;
  } catch (e) {
    return false;
  }
}

export async function outboxRemove(clientId) {
  const db = await openDb();
  if (!db || !clientId) return;
  try {
    const tx = db.transaction([STORE_ITEMS, STORE_BLOBS], 'readwrite');
    tx.objectStore(STORE_ITEMS).delete(clientId);
    tx.objectStore(STORE_BLOBS).delete(clientId);
    await txDone(tx);
  } catch (e) { /* noop */ }
}

export async function outboxListAll() {
  const db = await openDb();
  if (!db) return [];
  try {
    const tx = db.transaction(STORE_ITEMS, 'readonly');
    const rows = await idbReq(tx.objectStore(STORE_ITEMS).getAll());
    const list = Array.isArray(rows) ? rows : [];
    list.sort((a, b) => {
      const sa = Number(a.local_seq) || 0;
      const sb = Number(b.local_seq) || 0;
      if (sa !== sb) return sa - sb;
      return String(a.created_at || '').localeCompare(String(b.created_at || ''));
    });
    return list;
  } catch (e) {
    return [];
  }
}

export async function outboxListForConversation(conversationId) {
  const all = await outboxListAll();
  const id = Number(conversationId);
  return all.filter((r) => Number(r.conversation_id) === id);
}

export async function outboxGetBlob(clientId) {
  const db = await openDb();
  if (!db || !clientId) return null;
  try {
    const tx = db.transaction(STORE_BLOBS, 'readonly');
    return await idbReq(tx.objectStore(STORE_BLOBS).get(clientId)) || null;
  } catch (e) {
    return null;
  }
}

/** Compare / sort chat messages chronologically (Telegram-like). */
export function messageTimeMs(m) {
  if (!m) return 0;
  // Pending local_seq = Date.now()*1000 + (counter%1000) — extract wall-clock ms.
  if (!isServerId(m.id) && m.local_seq != null) {
    const seq = Number(m.local_seq);
    if (Number.isFinite(seq) && seq > 0) return Math.floor(seq / 1000);
  }
  const parsed = Date.parse(m.created_at || '');
  if (Number.isFinite(parsed)) return parsed;
  if (m.local_seq != null) {
    const seq = Number(m.local_seq);
    if (Number.isFinite(seq) && seq > 0) return Math.floor(seq / 1000);
  }
  return 0;
}

export function compareMessages(a, b) {
  const ta = messageTimeMs(a);
  const tb = messageTimeMs(b);
  if (ta !== tb) return ta < tb ? -1 : 1;

  const aServer = isServerId(a?.id);
  const bServer = isServerId(b?.id);
  if (aServer && bServer) {
    const ai = Number(a.id);
    const bi = Number(b.id);
    if (ai !== bi) return ai < bi ? -1 : 1;
    return 0;
  }
  // Same millisecond: confirmed before still-pending, then local_seq / client_id.
  if (aServer && !bServer) return -1;
  if (!aServer && bServer) return 1;
  const sa = Number(a?.local_seq) || 0;
  const sb = Number(b?.local_seq) || 0;
  if (sa !== sb) return sa < sb ? -1 : 1;
  return String(a?.client_id || '').localeCompare(String(b?.client_id || ''));
}

export function isServerId(id) {
  if (id == null) return false;
  if (typeof id === 'number') return Number.isFinite(id);
  if (typeof id === 'string') return /^\d+$/.test(id);
  return false;
}

export function sortMessages(list) {
  if (!Array.isArray(list) || list.length < 2) return list || [];
  return list.slice().sort(compareMessages);
}

/**
 * Merge message meta without dropping local blob previews (local_url / local_cover).
 * Server rows never include those fields; losing them blanks the bubble until refresh.
 */
export function mergeMessageMeta(prev, incoming) {
  const prevMeta = (prev && prev.meta && typeof prev.meta === 'object') ? prev.meta : {};
  const nextMeta = (incoming && incoming.meta && typeof incoming.meta === 'object') ? incoming.meta : {};
  if (!prev?.meta && (incoming?.meta == null)) {
    return incoming?.meta === null ? (prev?.meta ?? null) : (incoming?.meta || prev?.meta || null);
  }
  // Text echoes often send meta:null — never wipe a media payload with that.
  if (incoming && Object.prototype.hasOwnProperty.call(incoming, 'meta') && incoming.meta == null && prev?.meta) {
    return prev.meta;
  }
  const pickUrl = (next, prev) => {
    if (next && !String(next).startsWith('blob:')) return next;
    if (prev && !String(prev).startsWith('blob:')) return prev;
    return next || prev || null;
  };
  return {
    ...prevMeta,
    ...nextMeta,
    // Always keep local blob previews until a durable URL is painted — losing
    // these blanks the bubble when the next send re-renders the list.
    local_url: prevMeta.local_url || nextMeta.local_url || null,
    local_cover: prevMeta.local_cover || nextMeta.local_cover || null,
    cover_url: nextMeta.cover_url || prevMeta.cover_url || null,
    url: pickUrl(nextMeta.url, prevMeta.url),
    thumb_url: nextMeta.thumb_url || prevMeta.thumb_url || null,
    width: nextMeta.width || prevMeta.width || null,
    height: nextMeta.height || prevMeta.height || null,
    duration: nextMeta.duration || prevMeta.duration || null,
    album_id: nextMeta.album_id || prevMeta.album_id || null,
    album_index: nextMeta.album_index ?? prevMeta.album_index ?? null,
    album_count: nextMeta.album_count ?? prevMeta.album_count ?? null,
    // E2E restores real mime/name from the envelope — don't let server
    // application/octet-stream wipe them on echo / list reconcile.
    mime: (prevMeta.encrypted || nextMeta.encrypted)
      ? (prevMeta.mime && prevMeta.mime !== 'application/octet-stream'
        ? prevMeta.mime
        : (nextMeta.mime || prevMeta.mime || null))
      : (nextMeta.mime || prevMeta.mime || null),
    name: (prevMeta.encrypted || nextMeta.encrypted)
      ? (prevMeta.name || nextMeta.name || null)
      : (nextMeta.name || prevMeta.name || null),
    encrypted: !!(nextMeta.encrypted || prevMeta.encrypted),
  };
}

/** Merge two message lists, dedupe by server id / client_id, keep sorted. */
export function mergeMessageLists(existing, incoming) {
  const byServerId = new Map();
  const byClientId = new Map();
  const orphans = [];

  const ingest = (m) => {
    if (!m) return;
    if (isServerId(m.id)) {
      const prev = byServerId.get(Number(m.id));
      const mediaTypes = new Set(['photo', 'video', 'voice', 'audio']);
      const merged = prev
        ? {
          ...prev,
          ...m,
          // Keep optimistic client_id when the server echo omits it.
          client_id: m.client_id || prev.client_id || null,
          type: (mediaTypes.has(String(prev.type)) && !mediaTypes.has(String(m.type || '')))
            ? prev.type
            : (m.type || prev.type),
          meta: mergeMessageMeta(prev, m),
          // Monotonic receipts: never demote Read/Delivered on merge.
          delivered_at: m.delivered_at || prev.delivered_at || null,
          read_at: m.read_at || prev.read_at || null,
        }
        : m;
      byServerId.set(Number(m.id), merged);
      if (merged.client_id) byClientId.set(merged.client_id, merged);
      return;
    }
    if (m.client_id) {
      const viaServer = byClientId.get(m.client_id);
      if (viaServer && isServerId(viaServer.id)) {
        // Fold any newer local-only fields onto the settled server row.
        const folded = {
          ...viaServer,
          ...m,
          id: viaServer.id,
          client_id: viaServer.client_id || m.client_id,
          pending: false,
          failed: false,
          meta: mergeMessageMeta(viaServer, m),
          delivered_at: m.delivered_at || viaServer.delivered_at || null,
          read_at: m.read_at || viaServer.read_at || null,
        };
        byServerId.set(Number(viaServer.id), folded);
        byClientId.set(folded.client_id, folded);
        return;
      }
      byClientId.set(m.client_id, m);
      return;
    }
    orphans.push(m);
  };

  (existing || []).forEach(ingest);
  (incoming || []).forEach(ingest);

  const out = [];
  const seenClient = new Set();
  byServerId.forEach((m) => {
    out.push(m);
    if (m.client_id) seenClient.add(m.client_id);
  });
  byClientId.forEach((m, clientId) => {
    if (seenClient.has(clientId)) return;
    if (isServerId(m.id) && byServerId.has(Number(m.id))) return;
    out.push(m);
  });
  orphans.forEach((m) => out.push(m));
  return sortMessages(out);
}
