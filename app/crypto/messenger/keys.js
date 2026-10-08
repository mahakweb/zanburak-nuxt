/**
 * Key primitives (Web Crypto SubtleCrypto only).
 *
 * Two layers of P-256 key material:
 *  - User Identity (identity.js): account-level, stable across devices — Safety Code
 *  - Device Keys (device.js): per browser — ECDSA signing + ECDH agreement + signed/OTP
 *    prekeys used to wrap conversation keys to that device
 *
 * Public keys are exchanged as base64 SPKI, private keys as base64 PKCS8 in IndexedDB.
 */
import { b64Encode, b64Decode, concatBytes, utf8Encode } from './bytes';

const ECDSA_PARAMS = { name: 'ECDSA', namedCurve: 'P-256' };
const ECDH_PARAMS = { name: 'ECDH', namedCurve: 'P-256' };

// ---------------------------------------------------------------------------
// Key generation
// ---------------------------------------------------------------------------

export async function generateSigningKeyPair() {
  return crypto.subtle.generateKey(ECDSA_PARAMS, true, ['sign', 'verify']);
}

export async function generateAgreementKeyPair() {
  return crypto.subtle.generateKey(ECDH_PARAMS, true, ['deriveBits']);
}

/** Generate `count` one-time ECDH prekeys, each tagged with a random keyId. */
export async function generatePrekeys(count = 20, startId = null) {
  const prekeys = [];
  const base = startId != null ? startId : Date.now();
  for (let i = 0; i < count; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const keyPair = await generateAgreementKeyPair();
    prekeys.push({ keyId: base + i, keyPair });
  }
  return prekeys;
}

// ---------------------------------------------------------------------------
// Export / import (base64 SPKI for public, base64 PKCS8 for private)
// ---------------------------------------------------------------------------

export async function exportPublicKeyB64(key) {
  const spki = await crypto.subtle.exportKey('spki', key);
  return b64Encode(new Uint8Array(spki));
}

export async function exportPrivateKeyB64(key) {
  const pkcs8 = await crypto.subtle.exportKey('pkcs8', key);
  return b64Encode(new Uint8Array(pkcs8));
}

export async function importSigningPublicKey(b64) {
  return crypto.subtle.importKey('spki', b64Decode(b64), ECDSA_PARAMS, true, ['verify']);
}

export async function importSigningPrivateKey(b64) {
  return crypto.subtle.importKey('pkcs8', b64Decode(b64), ECDSA_PARAMS, true, ['sign']);
}

export async function importAgreementPublicKey(b64) {
  return crypto.subtle.importKey('spki', b64Decode(b64), ECDH_PARAMS, true, []);
}

export async function importAgreementPrivateKey(b64) {
  return crypto.subtle.importKey('pkcs8', b64Decode(b64), ECDH_PARAMS, true, ['deriveBits']);
}

// ---------------------------------------------------------------------------
// Signing / verification (prekey authenticity)
// ---------------------------------------------------------------------------

/** Sign arbitrary bytes with ECDSA P-256 / SHA-256. Returns base64 signature. */
export async function signBytes(signingPrivateKey, dataBytes) {
  const sig = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    signingPrivateKey,
    dataBytes,
  );
  return b64Encode(new Uint8Array(sig));
}

export async function verifyBytes(signingPublicKey, dataBytes, signatureB64) {
  try {
    return await crypto.subtle.verify(
      { name: 'ECDSA', hash: 'SHA-256' },
      signingPublicKey,
      b64Decode(signatureB64),
      dataBytes,
    );
  } catch (e) {
    return false;
  }
}

/** Canonical bytes signed for a prekey: `${keyId}:${publicKeyB64}`. */
export function prekeySignaturePayload(keyId, publicKeyB64) {
  return utf8Encode(`${keyId}:${publicKeyB64}`);
}

export async function signPrekey(signingPrivateKey, keyId, publicKeyB64) {
  return signBytes(signingPrivateKey, prekeySignaturePayload(keyId, publicKeyB64));
}

export async function verifyPrekeySignature(signingPublicKey, keyId, publicKeyB64, signatureB64) {
  return verifyBytes(signingPublicKey, prekeySignaturePayload(keyId, publicKeyB64), signatureB64);
}

// ---------------------------------------------------------------------------
// ECDH + HKDF key wrapping (per-recipient conversation key distribution)
// ---------------------------------------------------------------------------

/** Raw shared secret bytes from ECDH(myPrivateAgreement, theirPublicAgreement). */
export async function deriveSharedSecretBits(myPrivateAgreementKey, theirPublicAgreementKey, lengthBits = 256) {
  const bits = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: theirPublicAgreementKey },
    myPrivateAgreementKey,
    lengthBits,
  );
  return new Uint8Array(bits);
}

/** HKDF-SHA256(ikm, salt, info) -> derived key bytes. */
export async function hkdfSha256(ikmBytes, saltBytes, infoBytes, lengthBytes = 32) {
  const ikmKey = await crypto.subtle.importKey('raw', ikmBytes, 'HKDF', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: saltBytes || new Uint8Array(0),
      info: infoBytes || new Uint8Array(0),
    },
    ikmKey,
    lengthBytes * 8,
  );
  return new Uint8Array(bits);
}

/**
 * Wrap (encrypt) a symmetric key for one recipient device using
 * ECDH(senderAgreementPriv, recipientAgreementPub) -> HKDF-SHA256 -> AES-GCM.
 * `info` binds the wrap to the conversation + key version to prevent reuse
 * across contexts.
 * @returns {{ iv: string, ciphertext: string }} base64 fields
 */
export async function wrapKeyForRecipient({
  senderAgreementPrivateKey,
  recipientAgreementPublicKey,
  keyBytesToWrap,
  info,
}) {
  const shared = await deriveSharedSecretBits(senderAgreementPrivateKey, recipientAgreementPublicKey);
  const wrapKeyBytes = await hkdfSha256(shared, null, utf8Encode(info), 32);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const aesKey = await crypto.subtle.importKey('raw', wrapKeyBytes, { name: 'AES-GCM' }, false, ['encrypt']);
  const ctBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aesKey, keyBytesToWrap);
  return { iv: b64Encode(iv), ciphertext: b64Encode(new Uint8Array(ctBuf)) };
}

/** Inverse of wrapKeyForRecipient — run on the recipient side. */
export async function unwrapKeyFromSender({
  recipientAgreementPrivateKey,
  senderAgreementPublicKey,
  wrappedIvB64,
  wrappedCiphertextB64,
  info,
}) {
  const shared = await deriveSharedSecretBits(recipientAgreementPrivateKey, senderAgreementPublicKey);
  const wrapKeyBytes = await hkdfSha256(shared, null, utf8Encode(info), 32);
  const iv = b64Decode(wrappedIvB64);
  const ciphertext = b64Decode(wrappedCiphertextB64);
  const aesKey = await crypto.subtle.importKey('raw', wrapKeyBytes, { name: 'AES-GCM' }, false, ['decrypt']);
  const ptBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, aesKey, ciphertext);
  return new Uint8Array(ptBuf);
}

/** Combine two SPKI public keys (identity + something) for fingerprinting. */
export function combinePublicKeyBytes(...spkiB64List) {
  return concatBytes(...spkiB64List.map((b64) => b64Decode(b64)));
}
