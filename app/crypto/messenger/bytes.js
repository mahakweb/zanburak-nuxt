/**
 * Low-level byte / base64 helpers shared by the messenger E2E crypto modules.
 * No dependencies beyond the standard Web APIs (btoa/atob, TextEncoder/Decoder).
 */

/** Encode a Uint8Array (or ArrayBuffer) as standard base64. */
export function b64Encode(bytes) {
  const arr = bytes instanceof ArrayBuffer ? new Uint8Array(bytes) : bytes;
  let binary = '';
  const chunkSize = 0x8000; // avoid call-stack limits on String.fromCharCode(...bigArray)
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk);
  }
  return btoa(binary);
}

/** Decode a standard base64 string into a Uint8Array. */
export function b64Decode(b64) {
  const binary = atob(b64 || '');
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/** Concatenate any number of Uint8Array chunks into one. */
export function concatBytes(...chunks) {
  const parts = chunks.filter(Boolean);
  const total = parts.reduce((sum, c) => sum + c.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  parts.forEach((c) => {
    out.set(c, offset);
    offset += c.length;
  });
  return out;
}

/** Cryptographically strong random bytes. */
export function randomBytes(length) {
  const out = new Uint8Array(length);
  crypto.getRandomValues(out);
  return out;
}

export function utf8Encode(str) {
  return new TextEncoder().encode(str ?? '');
}

export function utf8Decode(bytes) {
  return new TextDecoder().decode(bytes);
}

/** Encode bytes as lowercase hex (used for safety-number digest formatting). */
export function toHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function fromHex(hex) {
  const clean = String(hex || '').replace(/[^0-9a-f]/gi, '');
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i += 1) {
    out[i] = parseInt(clean.substr(i * 2, 2), 16);
  }
  return out;
}
