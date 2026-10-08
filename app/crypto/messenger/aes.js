/**
 * AES-256-GCM helpers (Web Crypto SubtleCrypto). Used both for:
 *  - message payload encryption (conversation root key)
 *  - media file encryption (per-file random key)
 */
import { b64Encode, b64Decode, randomBytes, utf8Encode, utf8Decode } from './bytes';

/** Standard GCM IV length in bytes. */
export const GCM_IV_LENGTH = 12;

/** Import raw 32-byte key material as a non-extractable AES-GCM CryptoKey. */
export async function importAesKey(rawKeyBytes, extractable = false) {
  return crypto.subtle.importKey(
    'raw',
    rawKeyBytes,
    { name: 'AES-GCM' },
    extractable,
    ['encrypt', 'decrypt'],
  );
}

/** Generate a fresh random 32-byte (256-bit) AES key as raw bytes. */
export function generateAesKeyBytes() {
  return randomBytes(32);
}

/**
 * Encrypt raw bytes with AES-256-GCM.
 * @returns {{ iv: Uint8Array, ciphertext: Uint8Array }}
 */
export async function encryptBytes(keyBytes, plaintextBytes, aad = null) {
  const key = await importAesKey(keyBytes);
  const iv = randomBytes(GCM_IV_LENGTH);
  const params = { name: 'AES-GCM', iv };
  if (aad) params.additionalData = aad;
  const ctBuf = await crypto.subtle.encrypt(params, key, plaintextBytes);
  return { iv, ciphertext: new Uint8Array(ctBuf) };
}

/** Decrypt AES-256-GCM ciphertext produced by encryptBytes. */
export async function decryptBytes(keyBytes, ciphertextBytes, ivBytes, aad = null) {
  const key = await importAesKey(keyBytes);
  const params = { name: 'AES-GCM', iv: ivBytes };
  if (aad) params.additionalData = aad;
  const ptBuf = await crypto.subtle.decrypt(params, key, ciphertextBytes);
  return new Uint8Array(ptBuf);
}

/**
 * Encrypt a JSON-serializable value. Returns base64 iv/ciphertext, ready to
 * drop into the wire `e2e` envelope + `body` field.
 */
export async function encryptJson(keyBytes, value, aad = null) {
  const plaintext = utf8Encode(JSON.stringify(value));
  const { iv, ciphertext } = await encryptBytes(keyBytes, plaintext, aad);
  return { ivB64: b64Encode(iv), ciphertextB64: b64Encode(ciphertext) };
}

/** Decrypt + JSON.parse a payload produced by encryptJson. */
export async function decryptJson(keyBytes, ivB64, ciphertextB64, aad = null) {
  const iv = b64Decode(ivB64);
  const ciphertext = b64Decode(ciphertextB64);
  const plaintext = await decryptBytes(keyBytes, ciphertext, iv, aad);
  return JSON.parse(utf8Decode(plaintext));
}

/**
 * Decrypt with preferred AAD variants, then fall back to no-AAD for legacy.
 * Messages encrypted with AAD cannot be decrypted without the matching AAD —
 * so we try several common bindings (with/without sender device id).
 */
export async function decryptJsonCompat(keyBytes, ivB64, ciphertextB64, aadOrList = null) {
  const attempts = [];
  if (Array.isArray(aadOrList)) {
    aadOrList.forEach((a) => { if (a) attempts.push(a); });
  } else if (aadOrList) {
    attempts.push(aadOrList);
  }
  attempts.push(null); // legacy / last resort

  let lastErr = null;
  // eslint-disable-next-line no-restricted-syntax
  for (const aad of attempts) {
    try {
      // eslint-disable-next-line no-await-in-loop
      return await decryptJson(keyBytes, ivB64, ciphertextB64, aad);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error('decrypt failed');
}
