/**
 * IndexedDB persistence for the messenger E2E crypto state:
 *  - User Identity Key (account-level, stable across devices) — STORE_USER_IDENTITY
 *  - this device's Device Keys + one-time prekey key pairs — STORE_DEVICE
 *  - per-conversation symmetric keys (keyed by conversationId + key version)
 *  - bookkeeping to avoid redundant key distribution / package reprocessing
 *
 * Auth tokens live in localStorage/cookies and are NEVER used as crypto identity.
 * Private key material never leaves IndexedDB unencrypted (except in-memory while unlocked).
 */

const DB_NAME = 'zanburak_messenger_e2e';
const DB_VERSION = 2;

const STORE_DEVICE = 'device';       // single row, id = 'me' — Device Keys
const STORE_USER_IDENTITY = 'userIdentity'; // single row, id = 'me' — User Identity Key
const STORE_PREKEYS = 'prekeys';     // one row per one-time prekey
const STORE_CONV_KEYS = 'convKeys';  // one row per (conversationId, kid)
const STORE_DISTRIBUTED = 'distributed'; // tracks which devices already received a key version
const STORE_SEEN_PACKAGES = 'seenPackages'; // dedupe consumed server packages
const STORE_KEY_HISTORY = 'keyHistory'; // retained old conversation kids for history decrypt

let dbPromise = null;

function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (ev) => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_DEVICE)) {
        db.createObjectStore(STORE_DEVICE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_USER_IDENTITY)) {
        db.createObjectStore(STORE_USER_IDENTITY, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_PREKEYS)) {
        db.createObjectStore(STORE_PREKEYS, { keyPath: 'keyId' });
      }
      if (!db.objectStoreNames.contains(STORE_CONV_KEYS)) {
        const store = db.createObjectStore(STORE_CONV_KEYS, { keyPath: 'ckey' });
        store.createIndex('by_conversation', 'conversationId', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_DISTRIBUTED)) {
        db.createObjectStore(STORE_DISTRIBUTED, { keyPath: 'dkey' });
      }
      if (!db.objectStoreNames.contains(STORE_SEEN_PACKAGES)) {
        db.createObjectStore(STORE_SEEN_PACKAGES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_KEY_HISTORY)) {
        const hist = db.createObjectStore(STORE_KEY_HISTORY, { keyPath: 'ckey' });
        hist.createIndex('by_conversation', 'conversationId', { unique: false });
      }
      // v1 → v2: userIdentity store is created above when missing.
      void ev;
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('IndexedDB open failed'));
  });
  return dbPromise;
}

function idbReq(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('IndexedDB request failed'));
  });
}

function txDone(tx) {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error('IndexedDB tx failed'));
    tx.onabort = () => reject(tx.error || new Error('IndexedDB tx aborted'));
  });
}

// ---------------------------------------------------------------------------
// Device identity
// ---------------------------------------------------------------------------

export async function getDeviceRecord() {
  try {
    const db = await openDb();
    const tx = db.transaction(STORE_DEVICE, 'readonly');
    return (await idbReq(tx.objectStore(STORE_DEVICE).get('me'))) || null;
  } catch (e) {
    return null;
  }
}

export async function saveDeviceRecord(record) {
  const db = await openDb();
  const tx = db.transaction(STORE_DEVICE, 'readwrite');
  tx.objectStore(STORE_DEVICE).put({ ...record, id: 'me' });
  await txDone(tx);
}

export async function patchDeviceRecord(patch) {
  const existing = (await getDeviceRecord()) || { id: 'me' };
  const merged = { ...existing, ...patch, id: 'me' };
  await saveDeviceRecord(merged);
  return merged;
}

// ---------------------------------------------------------------------------
// User Identity (account-level — stable across devices / browsers)
// ---------------------------------------------------------------------------

export async function getUserIdentityRecord() {
  try {
    const db = await openDb();
    const tx = db.transaction(STORE_USER_IDENTITY, 'readonly');
    return (await idbReq(tx.objectStore(STORE_USER_IDENTITY).get('me'))) || null;
  } catch (e) {
    return null;
  }
}

export async function saveUserIdentityRecord(record) {
  const db = await openDb();
  const tx = db.transaction(STORE_USER_IDENTITY, 'readwrite');
  tx.objectStore(STORE_USER_IDENTITY).put({ ...record, id: 'me' });
  await txDone(tx);
}

export async function patchUserIdentityRecord(patch) {
  const existing = (await getUserIdentityRecord()) || { id: 'me' };
  const merged = { ...existing, ...patch, id: 'me' };
  await saveUserIdentityRecord(merged);
  return merged;
}

export async function clearUserIdentityRecord() {
  try {
    const db = await openDb();
    const tx = db.transaction(STORE_USER_IDENTITY, 'readwrite');
    tx.objectStore(STORE_USER_IDENTITY).delete('me');
    await txDone(tx);
  } catch (e) { /* best effort */ }
}

// ---------------------------------------------------------------------------
// One-time prekeys
// ---------------------------------------------------------------------------

export async function savePrekeys(rows) {
  if (!rows?.length) return;
  const db = await openDb();
  const tx = db.transaction(STORE_PREKEYS, 'readwrite');
  const store = tx.objectStore(STORE_PREKEYS);
  rows.forEach((row) => store.put(row));
  await txDone(tx);
}

export async function getPrekey(keyId) {
  const db = await openDb();
  const tx = db.transaction(STORE_PREKEYS, 'readonly');
  return (await idbReq(tx.objectStore(STORE_PREKEYS).get(keyId))) || null;
}

export async function markPrekeyUsed(keyId) {
  const row = await getPrekey(keyId);
  if (!row) return;
  await savePrekeys([{ ...row, used: true }]);
}

export async function listPrekeys() {
  try {
    const db = await openDb();
    const tx = db.transaction(STORE_PREKEYS, 'readonly');
    return (await idbReq(tx.objectStore(STORE_PREKEYS).getAll())) || [];
  } catch (e) {
    return [];
  }
}

export async function countUnusedPrekeys() {
  const all = await listPrekeys();
  return all.filter((p) => !p.used).length;
}

// ---------------------------------------------------------------------------
// Conversation symmetric keys
// ---------------------------------------------------------------------------

function convKeyId(conversationId, kid) {
  return `${String(conversationId)}:${Number(kid)}`;
}

export async function saveConversationKey(conversationId, kid, keyB64, { overwrite = false } = {}) {
  const existing = await getConversationKey(conversationId, kid);
  if (existing?.keyB64 && !overwrite) {
    return existing;
  }
  const db = await openDb();
  const tx = db.transaction(STORE_CONV_KEYS, 'readwrite');
  tx.objectStore(STORE_CONV_KEYS).put({
    ckey: convKeyId(conversationId, kid),
    conversationId: String(conversationId),
    kid: Number(kid),
    keyB64,
    createdAt: Date.now(),
  });
  await txDone(tx);
  return {
    ckey: convKeyId(conversationId, kid),
    conversationId: String(conversationId),
    kid: Number(kid),
    keyB64,
  };
}

/**
 * Keep a peer's conversation key alongside ours when both sides minted the
 * same kid with different secrets. Decrypt will try every candidate.
 */
export async function saveConversationKeyAlternate(conversationId, kid, keyB64) {
  if (!keyB64) return null;
  const primary = await getConversationKey(conversationId, kid);
  if (primary?.keyB64 === keyB64) return primary;

  const ckey = `${convKeyId(conversationId, kid)}:alt:${keyB64.slice(0, 22)}`;
  const db = await openDb();
  const tx = db.transaction(STORE_CONV_KEYS, 'readwrite');
  const row = {
    ckey,
    conversationId: String(conversationId),
    kid: Number(kid),
    keyB64,
    isAlt: true,
    createdAt: Date.now(),
  };
  tx.objectStore(STORE_CONV_KEYS).put(row);
  await txDone(tx);
  return row;
}

export async function getConversationKey(conversationId, kid) {
  try {
    const db = await openDb();
    const tx = db.transaction(STORE_CONV_KEYS, 'readonly');
    return (await idbReq(tx.objectStore(STORE_CONV_KEYS).get(convKeyId(conversationId, kid))))
      || (await idbReq(tx.objectStore(STORE_CONV_KEYS).get(convKeyId(String(conversationId), Number(kid)))))
      || null;
  } catch (e) {
    return null;
  }
}

/** All key rows for a conversation (primary + alternates), newest kid first. */
export async function listConversationKeys(conversationId) {
  try {
    const db = await openDb();
    const tx = db.transaction(STORE_CONV_KEYS, 'readonly');
    const idx = tx.objectStore(STORE_CONV_KEYS).index('by_conversation');
    const rows = (await idbReq(idx.getAll(String(conversationId)))) || [];
    return rows.sort((a, b) => Number(b.kid) - Number(a.kid));
  } catch (e) {
    return [];
  }
}

/**
 * Candidate key bytes for decrypt: matching kid first (primary then alts),
 * then any other local keys for this chat (kid mismatch recovery).
 */
export async function getConversationKeyCandidates(conversationId, kid) {
  const rows = await listConversationKeys(conversationId);
  if (!rows.length) return [];
  const want = Number(kid);
  const matched = rows.filter((r) => Number(r.kid) === want && r.keyB64);
  const others = rows.filter((r) => Number(r.kid) !== want && r.keyB64);
  const ordered = [...matched.filter((r) => !r.isAlt), ...matched.filter((r) => r.isAlt), ...others];
  const seen = new Set();
  const out = [];
  ordered.forEach((r) => {
    if (seen.has(r.keyB64)) return;
    seen.add(r.keyB64);
    out.push(r.keyB64);
  });
  return out;
}

/**
 * When both peers mint kid=N independently, each keeps the other as an
 * alternate. Pick a deterministic primary (lexicographically smallest key)
 * so both sides encrypt with the same secret going forward.
 */
export async function reconcileConversationKeys(conversationId, kid = null) {
  const rows = await listConversationKeys(conversationId);
  if (!rows.length) return null;

  const kids = kid != null
    ? [Number(kid)]
    : [...new Set(rows.map((r) => Number(r.kid)))];

  let latest = null;
  // eslint-disable-next-line no-restricted-syntax
  for (const k of kids.sort((a, b) => b - a)) {
    const matched = rows.filter((r) => Number(r.kid) === k && r.keyB64);
    if (!matched.length) continue;
    const unique = [...new Set(matched.map((r) => r.keyB64))].sort();
    const chosen = unique[0];
    // eslint-disable-next-line no-await-in-loop
    await saveConversationKey(conversationId, k, chosen, { overwrite: true });
    // eslint-disable-next-line no-restricted-syntax
    for (const alt of unique.slice(1)) {
      // eslint-disable-next-line no-await-in-loop
      await saveConversationKeyAlternate(conversationId, k, alt);
    }
    if (!latest) {
      latest = {
        ckey: convKeyId(conversationId, k),
        conversationId: String(conversationId),
        kid: k,
        keyB64: chosen,
      };
    }
  }
  return latest;
}

/** Highest key-version row currently stored for a conversation, or null. */
export async function getLatestConversationKey(conversationId) {
  try {
    const rows = await listConversationKeys(conversationId);
    const primary = rows.find((r) => !r.isAlt);
    return primary || rows[0] || null;
  } catch (e) {
    return null;
  }
}

/**
 * Conversation ids for which this device already holds at least one key.
 * Used so a sibling can redistribute history keys when Vuex list is empty/stale.
 */
export async function listConversationIdsWithLocalKeys() {
  try {
    const db = await openDb();
    const tx = db.transaction(STORE_CONV_KEYS, 'readonly');
    const rows = (await idbReq(tx.objectStore(STORE_CONV_KEYS).getAll())) || [];
    const ids = new Set();
    rows.forEach((r) => {
      if (r?.conversationId != null && r.keyB64) ids.add(String(r.conversationId));
    });
    return [...ids];
  } catch (e) {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Distribution bookkeeping — avoid re-sending the same wrapped key to a
// device that has already acknowledged receiving it.
// ---------------------------------------------------------------------------

function distKeyId(conversationId, kid, deviceId) {
  return `${conversationId}:${kid}:${deviceId}`;
}

export async function markDistributed(conversationId, kid, deviceId) {
  const db = await openDb();
  const tx = db.transaction(STORE_DISTRIBUTED, 'readwrite');
  tx.objectStore(STORE_DISTRIBUTED).put({ dkey: distKeyId(conversationId, kid, deviceId) });
  await txDone(tx);
}

export async function isDistributed(conversationId, kid, deviceId) {
  try {
    const db = await openDb();
    const tx = db.transaction(STORE_DISTRIBUTED, 'readonly');
    const row = await idbReq(tx.objectStore(STORE_DISTRIBUTED).get(distKeyId(conversationId, kid, deviceId)));
    return !!row;
  } catch (e) {
    return false;
  }
}

/** Drop distribution marks so a rotated key is re-shared to every peer. */
export async function clearDistributedForConversation(conversationId) {
  try {
    const db = await openDb();
    const tx = db.transaction(STORE_DISTRIBUTED, 'readwrite');
    const store = tx.objectStore(STORE_DISTRIBUTED);
    const all = (await idbReq(store.getAll())) || [];
    const prefix = `${String(conversationId)}:`;
    all.forEach((row) => {
      if (row?.dkey && String(row.dkey).startsWith(prefix)) {
        store.delete(row.dkey);
      }
    });
    await txDone(tx);
  } catch (e) { /* best effort */ }
}

// ---------------------------------------------------------------------------
// Seen packages (idempotent consumption even if the ack round-trip is lost)
// ---------------------------------------------------------------------------

export async function isPackageSeen(id) {
  try {
    const db = await openDb();
    const tx = db.transaction(STORE_SEEN_PACKAGES, 'readonly');
    const row = await idbReq(tx.objectStore(STORE_SEEN_PACKAGES).get(id));
    return !!row;
  } catch (e) {
    return false;
  }
}

export async function markPackageSeen(id) {
  try {
    const db = await openDb();
    const tx = db.transaction(STORE_SEEN_PACKAGES, 'readwrite');
    tx.objectStore(STORE_SEEN_PACKAGES).put({ id, seenAt: Date.now() });
    await txDone(tx);
  } catch (e) { /* best effort */ }
}

/**
 * After rotation, keep previous kids readable on authorized devices.
 * Primary convKeys still hold the active kid; history retains retired ones.
 */
export async function archiveConversationKeyToHistory(conversationId, kid, keyB64) {
  if (!keyB64) return;
  try {
    const db = await openDb();
    const tx = db.transaction(STORE_KEY_HISTORY, 'readwrite');
    tx.objectStore(STORE_KEY_HISTORY).put({
      ckey: `${String(conversationId)}:${Number(kid)}`,
      conversationId: String(conversationId),
      kid: Number(kid),
      keyB64,
      archivedAt: Date.now(),
    });
    await txDone(tx);
  } catch (e) { /* best effort */ }
}
