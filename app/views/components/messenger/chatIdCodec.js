/**
 * Opaque reversible chat keys for /messenger/:chatId.
 * Renders as a UUID-looking string; decodes back to the numeric conversation id.
 */

/* Conversation ids are DB bigints that stay within Number.SAFE_INTEGER in practice. */
const ID_XOR_HI = 0x9e3779b9;
const ID_XOR_LO = 0x7f4a7c15;

function toHex8(n) {
  return (n >>> 0).toString(16).padStart(8, '0');
}

function mixId(id) {
  // Split 53-bit-safe id into hi/lo 32-bit halves, XOR with a fixed key.
  const lo = id >>> 0;
  const hi = Math.floor(id / 0x100000000) >>> 0;
  return {
    mixedHi: (hi ^ ID_XOR_HI) >>> 0,
    mixedLo: (lo ^ ID_XOR_LO) >>> 0,
    hi,
    lo,
  };
}

function formatUuid(hex32) {
  return [
    hex32.slice(0, 8),
    hex32.slice(8, 12),
    hex32.slice(12, 16),
    hex32.slice(16, 20),
    hex32.slice(20, 32),
  ].join('-');
}

/**
 * @param {number|string|null|undefined} id
 * @returns {string|null}
 */
export function encodeChatId(id) {
  if (id == null || id === 'draft') return null;
  const n = Number(id);
  if (!Number.isFinite(n) || n <= 0 || !Number.isSafeInteger(n)) return null;
  const { mixedHi, mixedLo, hi, lo } = mixId(n);
  const hex = `${toHex8(mixedHi)}${toHex8(mixedLo)}${toHex8(hi)}${toHex8(lo)}`;
  return formatUuid(hex);
}

/**
 * @param {string|null|undefined} key
 * @returns {number|null}
 */
export function decodeChatId(key) {
  if (key == null) return null;
  const raw = String(key).trim();
  if (!raw) return null;
  // Allow plain numeric ids (bookmarks / legacy links).
  if (/^\d+$/.test(raw)) {
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 && Number.isSafeInteger(n) ? n : null;
  }
  const hex = raw.replace(/-/g, '').toLowerCase();
  if (!/^[0-9a-f]{32}$/.test(hex)) return null;
  const mixedHi = parseInt(hex.slice(0, 8), 16) >>> 0;
  const mixedLo = parseInt(hex.slice(8, 16), 16) >>> 0;
  const hi = parseInt(hex.slice(16, 24), 16) >>> 0;
  const lo = parseInt(hex.slice(24, 32), 16) >>> 0;
  // Guard: mixed half must match (detect typos / foreign UUIDs).
  if (((hi ^ ID_XOR_HI) >>> 0) !== mixedHi) return null;
  if (((lo ^ ID_XOR_LO) >>> 0) !== mixedLo) return null;
  const id = hi * 0x100000000 + lo;
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export function isChatIdParam(value) {
  return decodeChatId(value) != null;
}
