/**
 * Optional passphrase vault for messenger E2E private keys at rest.
 * When unlocked (or never set), crypto works normally.
 * When locked, Device Key + User Identity private keys are AES-GCM wrapped
 * with a PBKDF2 key derived from the passphrase.
 */
import { b64Encode, b64Decode, randomBytes, utf8Encode } from './bytes';
import {
  getDeviceRecord,
  saveDeviceRecord,
  patchDeviceRecord,
  getUserIdentityRecord,
  patchUserIdentityRecord,
} from './store';
import { encryptBytes, decryptBytes } from './aes';

const VAULT_META_KEY = 'zanburak_e2e_vault_v1';

function readMeta() {
  try {
    const raw = localStorage.getItem(VAULT_META_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeMeta(meta) {
  localStorage.setItem(VAULT_META_KEY, JSON.stringify(meta));
}

async function deriveVaultKey(passphrase, saltBytes) {
  const base = await crypto.subtle.importKey(
    'raw',
    utf8Encode(passphrase),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: saltBytes,
      iterations: 210000,
    },
    base,
    256,
  );
  return new Uint8Array(bits);
}

async function wrapField(vaultKey, plainB64) {
  const { iv, ciphertext } = await encryptBytes(vaultKey, utf8Encode(plainB64));
  return { iv: b64Encode(iv), ct: b64Encode(ciphertext) };
}

async function unwrapField(vaultKey, wrapped) {
  if (!wrapped?.iv || !wrapped?.ct) return null;
  const pt = await decryptBytes(vaultKey, b64Decode(wrapped.ct), b64Decode(wrapped.iv));
  return new TextDecoder().decode(pt);
}

/** True when a passphrase is configured and private keys are currently wrapped. */
export function isVaultConfigured() {
  return !!readMeta()?.enabled;
}

export function isVaultLocked() {
  const meta = readMeta();
  return !!(meta?.enabled && meta?.locked);
}

/**
 * Enable vault: wrap Device + User Identity private keys with passphrase-derived key.
 */
export async function enableVault(passphrase) {
  if (!passphrase || passphrase.length < 6) {
    throw new Error('رمز عبور باید حداقل ۶ کاراکتر باشد');
  }
  const record = await getDeviceRecord();
  if (!record?.identitySigningPriv || !record?.identityAgreementPriv) {
    throw new Error('دستگاه رمزنگاری آماده نیست');
  }
  if (record.vaultWrapped) {
    throw new Error('قفل از قبل فعال است');
  }

  const salt = randomBytes(16);
  const vaultKey = await deriveVaultKey(passphrase, salt);
  const wrapped = {
    identitySigningPriv: await wrapField(vaultKey, record.identitySigningPriv),
    identityAgreementPriv: await wrapField(vaultKey, record.identityAgreementPriv),
    signedPrekeyPriv: record.signedPrekeyPriv
      ? await wrapField(vaultKey, record.signedPrekeyPriv)
      : null,
  };

  const userId = await getUserIdentityRecord();
  let userWrapped = null;
  if (userId?.signingPriv && userId?.agreementPriv) {
    userWrapped = {
      signingPriv: await wrapField(vaultKey, userId.signingPriv),
      agreementPriv: await wrapField(vaultKey, userId.agreementPriv),
    };
  }

  await saveDeviceRecord({
    ...record,
    identitySigningPriv: null,
    identityAgreementPriv: null,
    signedPrekeyPriv: null,
    vaultWrapped: wrapped,
  });
  if (userWrapped) {
    await patchUserIdentityRecord({
      signingPriv: null,
      agreementPriv: null,
      vaultWrapped: userWrapped,
    });
  }
  writeMeta({
    enabled: true,
    locked: true,
    salt: b64Encode(salt),
    unlockedAt: null,
  });
  return true;
}

/** Unlock vault into memory (restores private keys on the device + user identity records). */
export async function unlockVault(passphrase) {
  const meta = readMeta();
  if (!meta?.enabled || !meta.salt) throw new Error('قفل فعال نیست');
  const record = await getDeviceRecord();
  if (!record?.vaultWrapped) throw new Error('کلیدهای قفل‌شده یافت نشد');

  const vaultKey = await deriveVaultKey(passphrase, b64Decode(meta.salt));
  try {
    const signing = await unwrapField(vaultKey, record.vaultWrapped.identitySigningPriv);
    const agreement = await unwrapField(vaultKey, record.vaultWrapped.identityAgreementPriv);
    const signed = record.vaultWrapped.signedPrekeyPriv
      ? await unwrapField(vaultKey, record.vaultWrapped.signedPrekeyPriv)
      : record.signedPrekeyPriv;
    if (!signing || !agreement) throw new Error('bad');
    await patchDeviceRecord({
      identitySigningPriv: signing,
      identityAgreementPriv: agreement,
      signedPrekeyPriv: signed,
    });

    const userId = await getUserIdentityRecord();
    if (userId?.vaultWrapped) {
      const us = await unwrapField(vaultKey, userId.vaultWrapped.signingPriv);
      const ua = await unwrapField(vaultKey, userId.vaultWrapped.agreementPriv);
      if (us && ua) {
        await patchUserIdentityRecord({
          signingPriv: us,
          agreementPriv: ua,
        });
      }
    }

    writeMeta({ ...meta, locked: false, unlockedAt: Date.now() });
    return true;
  } catch (e) {
    throw new Error('رمز عبور نادرست است');
  }
}

/** Re-wrap and clear plaintext privates from IndexedDB (lock again). */
export async function lockVault() {
  const meta = readMeta();
  if (!meta?.enabled) return false;
  const record = await getDeviceRecord();
  if (!record?.vaultWrapped) return false;
  if (!record.identitySigningPriv) {
    writeMeta({ ...meta, locked: true, unlockedAt: null });
    return true;
  }
  await patchDeviceRecord({
    identitySigningPriv: null,
    identityAgreementPriv: null,
    signedPrekeyPriv: null,
  });
  const userId = await getUserIdentityRecord();
  if (userId?.vaultWrapped && userId.signingPriv) {
    await patchUserIdentityRecord({
      signingPriv: null,
      agreementPriv: null,
    });
  }
  writeMeta({ ...meta, locked: true, unlockedAt: null });
  return true;
}

/** Assert vault is usable before crypto ops that need private keys. */
export async function assertVaultUnlocked() {
  if (!isVaultConfigured()) return;
  if (isVaultLocked()) {
    throw new Error('قفل رمزنگاری فعال است — ابتدا قفل را باز کنید');
  }
  const record = await getDeviceRecord();
  if (!record?.identityAgreementPriv) {
    throw new Error('قفل رمزنگاری فعال است — ابتدا قفل را باز کنید');
  }
}
