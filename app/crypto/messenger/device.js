/**
 * This-device Device Key bootstrap: generate/register Device Key pairs once,
 * then keep the one-time prekey pool topped up.
 *
 * Device Keys are NOT the User Identity. Account-level identity lives in
 * identity.js and must stay stable across browsers. Auth tokens/session storage
 * are never used as encryption identity.
 *
 * Critical: never mark `registered: true` unless the server actually has this
 * device_id — a false local flag makes packages/distribute return 422 forever
 * and leaves peers unable to decrypt.
 */
import {
  registerDevice,
  submitPrekeys,
  listCryptoDevices,
} from '@/services/messenger';
import {
  generateSigningKeyPair,
  generateAgreementKeyPair,
  generatePrekeys,
  exportPublicKeyB64,
  exportPrivateKeyB64,
  importSigningPrivateKey,
  importAgreementPrivateKey,
  signPrekey,
} from './keys';
import {
  getDeviceRecord,
  saveDeviceRecord,
  patchDeviceRecord,
  savePrekeys,
  listPrekeys,
  countUnusedPrekeys,
} from './store';
import { randomBytes, toHex } from './bytes';
import { assertVaultUnlocked } from './vault';

const PREKEY_LOW_WATERMARK = 10;
const PREKEY_BATCH_SIZE = 20;
const REFILL_THROTTLE_MS = 6 * 60 * 60 * 1000;

let ensureDevicePromise = null;
/** One server-side presence check per page load (catches stale registered flags). */
let serverPresenceChecked = false;

function generateLocalDeviceId() {
  return `web-${toHex(randomBytes(8))}`;
}

function deviceLabel() {
  try {
    const ua = navigator.userAgent || '';
    const platform = navigator.platform || 'web';
    return `${platform} · ${ua.slice(0, 60)}`;
  } catch (e) {
    return 'web';
  }
}

async function generateAndPersistIdentity() {
  // Device Keys only — User Identity is minted/linked separately in identity.js
  const signingKeyPair = await generateSigningKeyPair();
  const agreementKeyPair = await generateAgreementKeyPair();
  const signedPair = await generateAgreementKeyPair();
  const signingPriv = signingKeyPair.privateKey;
  const signedPub = await exportPublicKeyB64(signedPair.publicKey);
  const signedSig = await signPrekey(signingPriv, 1, signedPub);

  const record = {
    deviceId: generateLocalDeviceId(),
    // Field names kept for wire/DB compatibility; these are Device Keys.
    identitySigningPub: await exportPublicKeyB64(signingKeyPair.publicKey),
    identitySigningPriv: await exportPrivateKeyB64(signingKeyPair.privateKey),
    identityAgreementPub: await exportPublicKeyB64(agreementKeyPair.publicKey),
    identityAgreementPriv: await exportPrivateKeyB64(agreementKeyPair.privateKey),
    signedPrekeyId: 1,
    signedPrekeyPub: signedPub,
    signedPrekeyPriv: await exportPrivateKeyB64(signedPair.privateKey),
    signedPrekeySignature: signedSig,
    registered: false,
    lastPrekeyRefillAt: 0,
    createdAt: Date.now(),
    keyKind: 'device',
  };
  await saveDeviceRecord(record);
  return record;
}

/** Ensure signed-prekey fields exist on older local records. */
async function ensureSignedPrekey(record) {
  if (record.signedPrekeyPub && record.signedPrekeyPriv && record.signedPrekeySignature) {
    return record;
  }
  const { signingPriv } = await loadIdentityKeys(record);
  const signedPair = await generateAgreementKeyPair();
  const signedPub = await exportPublicKeyB64(signedPair.publicKey);
  const signedSig = await signPrekey(signingPriv, 1, signedPub);
  return patchDeviceRecord({
    signedPrekeyId: 1,
    signedPrekeyPub: signedPub,
    signedPrekeyPriv: await exportPrivateKeyB64(signedPair.privateKey),
    signedPrekeySignature: signedSig,
  });
}

export async function loadIdentityKeys(record) {
  const signingPriv = await importSigningPrivateKey(record.identitySigningPriv);
  const agreementPriv = await importAgreementPrivateKey(record.identityAgreementPriv);
  return { signingPriv, agreementPriv };
}

async function generatePrekeyBatch(count) {
  const record = await getDeviceRecord();
  const { signingPriv } = await loadIdentityKeys(record);
  const existing = await listPrekeys();
  const maxExistingId = existing.reduce((max, p) => Math.max(max, Number(p.keyId) || 0), 0);
  // Never collide with signed_prekey_id (always 1) — OTPs start at >= 1000.
  const startId = Math.max(maxExistingId + 1, 1000);
  const pairs = await generatePrekeys(count, startId);

  const rows = [];
  const apiPayload = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const { keyId, keyPair } of pairs) {
    // eslint-disable-next-line no-await-in-loop
    const pubB64 = await exportPublicKeyB64(keyPair.publicKey);
    // eslint-disable-next-line no-await-in-loop
    const privB64 = await exportPrivateKeyB64(keyPair.privateKey);
    // eslint-disable-next-line no-await-in-loop
    const signature = await signPrekey(signingPriv, keyId, pubB64);
    rows.push({
      keyId, pub: pubB64, priv: privB64, signature, used: false, uploaded: false, createdAt: Date.now(),
    });
    apiPayload.push({ key_id: keyId, public_key: pubB64, signature });
  }
  await savePrekeys(rows);
  return apiPayload;
}

function buildRegisterPayload(record, otpPayload) {
  return {
    device_id: record.deviceId,
    label: deviceLabel(),
    identity_signing_public_key: record.identitySigningPub,
    identity_agreement_public_key: record.identityAgreementPub,
    signed_prekey_id: record.signedPrekeyId || 1,
    signed_prekey_public: record.signedPrekeyPub,
    signed_prekey_signature: record.signedPrekeySignature,
    one_time_prekeys: (otpPayload || []).map((p) => ({
      prekey_id: p.key_id ?? p.prekey_id,
      public_key: p.public_key,
      signature: p.signature || null,
    })),
  };
}

async function serverHasDevice(deviceId) {
  try {
    const res = await listCryptoDevices();
    const list = res?.devices || res?.data || [];
    return list.some((d) => (d.device_id || d.deviceId) === deviceId);
  } catch (e) {
    return false;
  }
}

/**
 * Upsert this device on the server. Retries without OTPs if bulk OTP validation fails.
 */
async function registerWithServer(record) {
  let otpPayload = [];
  const unused = await countUnusedPrekeys();
  if (unused < PREKEY_BATCH_SIZE) {
    otpPayload = await generatePrekeyBatch(PREKEY_BATCH_SIZE);
  } else {
    const rows = await listPrekeys();
    otpPayload = rows
      .filter((r) => !r.used)
      .slice(0, PREKEY_BATCH_SIZE)
      .map((r) => ({ key_id: r.keyId, public_key: r.pub, signature: r.signature || null }));
  }

  try {
    await registerDevice(buildRegisterPayload(record, otpPayload));
    return patchDeviceRecord({ registered: true });
  } catch (e) {
    const status = e?.response?.status;
    const errors = e?.response?.data?.errors || e?.response?.data;
    console.warn('[e2e] registerDevice failed', status, errors);

    // Retry once without OTPs — registration of identity is enough to unblock packages.
    if (status === 422 && otpPayload.length) {
      try {
        await registerDevice(buildRegisterPayload(record, []));
        return patchDeviceRecord({ registered: true });
      } catch (e2) {
        console.warn('[e2e] registerDevice retry without OTPs failed', e2?.response?.data);
      }
    }

    // Only treat as registered if the server really lists this device.
    if (await serverHasDevice(record.deviceId)) {
      return patchDeviceRecord({ registered: true });
    }

    await patchDeviceRecord({ registered: false });
    throw e;
  }
}

/**
 * Ensure local identity exists AND is present on the server.
 * Safe to call repeatedly — uses upsert semantics on the backend.
 */
export function ensureDevice({ forceReregister = false } = {}) {
  if (ensureDevicePromise && !forceReregister) return ensureDevicePromise;

  const run = (async () => {
    await assertVaultUnlocked().catch(() => {});

    let record = await getDeviceRecord();
    if (!record || !record.identitySigningPriv || !record.identityAgreementPriv) {
      // Vault may have cleared privates while locked.
      if (record?.vaultWrapped && !record.identityAgreementPriv) {
        throw new Error('قفل رمزنگاری فعال است — ابتدا قفل را باز کنید');
      }
      record = await generateAndPersistIdentity();
    } else {
      record = await ensureSignedPrekey(record);
    }

    const needsRegister = forceReregister || !record.registered;
    if (needsRegister) {
      record = await registerWithServer(record);
      serverPresenceChecked = true;
    } else if (!serverPresenceChecked) {
      serverPresenceChecked = true;
      const ok = await serverHasDevice(record.deviceId);
      if (!ok) {
        record = await registerWithServer(record);
      }
    }

    await refillPrekeysIfLow(record);
    return record;
  })();

  ensureDevicePromise = run;
  run.finally(() => {
    if (ensureDevicePromise === run) ensureDevicePromise = null;
  });
  return run;
}

/** Force re-upsert after packages/distribute 422 (unknown device). */
export async function repairDeviceRegistration() {
  cachedMyDeviceId = null;
  await patchDeviceRecord({ registered: false });
  return ensureDevice({ forceReregister: true });
}

export async function refillPrekeysIfLow(recordArg = null, {
  threshold = PREKEY_LOW_WATERMARK,
  batchSize = PREKEY_BATCH_SIZE,
} = {}) {
  const record = recordArg || (await getDeviceRecord());
  if (!record?.deviceId || !record.registered) return;

  const unused = await countUnusedPrekeys();
  if (unused >= threshold) return;

  const now = Date.now();
  if (record.lastPrekeyRefillAt && (now - record.lastPrekeyRefillAt) < REFILL_THROTTLE_MS) return;

  const payload = await generatePrekeyBatch(batchSize);
  if (payload.length) {
    try {
      await submitPrekeys({ device_id: record.deviceId, prekeys: payload });
      const rows = await listPrekeys();
      const uploadedIds = new Set(payload.map((p) => p.key_id));
      await savePrekeys(
        rows.map((r) => (uploadedIds.has(r.keyId) ? { ...r, uploaded: true } : r)),
      );
    } catch (e) {
      // Keep local rows; next refill retries upload.
      console.warn('[e2e] submitPrekeys failed', e?.response?.data || e);
    }
  }
  await patchDeviceRecord({ lastPrekeyRefillAt: now });
}

let cachedMyDeviceId = null;

export async function getMyDeviceId() {
  if (cachedMyDeviceId) return cachedMyDeviceId;
  const record = await getDeviceRecord();
  cachedMyDeviceId = record?.deviceId || null;
  return cachedMyDeviceId;
}

/** Clear cached device id (after repair / re-register). */
export function clearCachedMyDeviceId() {
  cachedMyDeviceId = null;
}

export async function getMyIdentityPublicKeys() {
  const record = await getDeviceRecord();
  if (!record) return null;
  return {
    signingPub: record.identitySigningPub,
    agreementPub: record.identityAgreementPub,
  };
}
