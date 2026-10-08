/**
 * Account-level User Identity Key — stable across browsers/devices.
 *
 * Hierarchy:
 *   User Identity Key  (this module — Security Code source of truth)
 *     └── Device Key 1 / Device Key 2 / …  (device.js — wraps conversation keys)
 *
 * Auth session tokens are NEVER used as encryption identity. Clearing a browser
 * session does not mint a new User Identity; a new Device Key may be created,
 * then linked to the existing User Identity via sibling transfer or recovery.
 */
import {
  getUserIdentity,
  publishUserIdentity,
  uploadIdentityBackup,
  uploadSeamlessUnlock,
  distributeIdentityPackages,
  pullIdentityPackages,
  ackIdentityPackages,
  requestIdentityTransfer,
  listCryptoDevices,
} from '@/services/messenger';
import {
  generateSigningKeyPair,
  generateAgreementKeyPair,
  exportPublicKeyB64,
  exportPrivateKeyB64,
  importAgreementPublicKey,
  wrapKeyForRecipient,
  unwrapKeyFromSender,
} from './keys';
import {
  getUserIdentityRecord,
  saveUserIdentityRecord,
  patchUserIdentityRecord,
  getDeviceRecord,
} from './store';
import {
  ensureDevice,
  loadIdentityKeys as loadDeviceKeys,
  getMyDeviceId,
} from './device';
import { b64Encode, b64Decode, randomBytes, utf8Encode } from './bytes';
import { encryptBytes, decryptBytes } from './aes';
import { assertVaultUnlocked } from './vault';

const IDENTITY_WRAP_INFO = 'zanburak-e2e-user-identity-v1';
const RECOVERY_META_KEY = 'zanburak_e2e_recovery_hint_v1';

let ensureUserIdentityPromise = null;
let identityPending = false;

function readRecoveryHint() {
  try {
    return localStorage.getItem(RECOVERY_META_KEY) || null;
  } catch {
    return null;
  }
}

function writeRecoveryHint(hint) {
  try {
    if (hint) localStorage.setItem(RECOVERY_META_KEY, hint);
    else localStorage.removeItem(RECOVERY_META_KEY);
  } catch { /* ignore */ }
}

export function isUserIdentityPending() {
  return identityPending;
}

export async function getMyUserIdentityPublicKeys() {
  const record = await getUserIdentityRecord();
  if (!record?.signingPub || !record?.agreementPub) return null;
  return {
    signingPub: record.signingPub,
    agreementPub: record.agreementPub,
  };
}

export async function hasLocalUserIdentityPrivates() {
  const record = await getUserIdentityRecord();
  return !!(record?.signingPriv && record?.agreementPriv);
}

async function mintUserIdentity() {
  const signing = await generateSigningKeyPair();
  const agreement = await generateAgreementKeyPair();
  const record = {
    signingPub: await exportPublicKeyB64(signing.publicKey),
    signingPriv: await exportPrivateKeyB64(signing.privateKey),
    agreementPub: await exportPublicKeyB64(agreement.publicKey),
    agreementPriv: await exportPrivateKeyB64(agreement.privateKey),
    published: false,
    createdAt: Date.now(),
    source: 'mint',
  };
  await saveUserIdentityRecord(record);
  return record;
}

/**
 * Migrate pre-architecture devices: promote this device's long-term keys to
 * User Identity once, so Security Code stays continuous for single-device users.
 */
async function promoteDeviceKeysToUserIdentity(deviceRecord) {
  if (!deviceRecord?.identitySigningPub || !deviceRecord?.identityAgreementPub
    || !deviceRecord?.identitySigningPriv || !deviceRecord?.identityAgreementPriv) {
    return null;
  }
  const record = {
    signingPub: deviceRecord.identitySigningPub,
    signingPriv: deviceRecord.identitySigningPriv,
    agreementPub: deviceRecord.identityAgreementPub,
    agreementPriv: deviceRecord.identityAgreementPriv,
    published: false,
    createdAt: Date.now(),
    source: 'promoted_device',
  };
  await saveUserIdentityRecord(record);
  return record;
}

async function publishToServer(record, { forceReset = false, backup = null } = {}) {
  const payload = {
    signing_public: record.signingPub,
    agreement_public: record.agreementPub,
    force_reset: forceReset || undefined,
  };
  if (backup) {
    payload.encrypted_backup = backup.encrypted_backup;
    payload.backup_salt = backup.backup_salt;
    payload.backup_version = backup.backup_version || 1;
  }
  try {
    await publishUserIdentity(payload);
    return patchUserIdentityRecord({ published: true });
  } catch (e) {
    const msg = e?.response?.data?.message || '';
    if (e?.response?.status === 422 && /already published/i.test(msg)) {
      return null;
    }
    throw e;
  }
}

async function wrapIdentityPayload(recipientAgreementPubB64, identityRecord, myPriv, myPubB64) {
  const payload = utf8Encode(JSON.stringify({
    v: 1,
    type: 'user_identity',
    signingPub: identityRecord.signingPub,
    signingPriv: identityRecord.signingPriv,
    agreementPub: identityRecord.agreementPub,
    agreementPriv: identityRecord.agreementPriv,
  }));
  const wrapped = await wrapKeyForRecipient({
    senderAgreementPrivateKey: myPriv,
    recipientAgreementPublicKey: await importAgreementPublicKey(recipientAgreementPubB64),
    keyBytesToWrap: payload,
    info: IDENTITY_WRAP_INFO,
  });
  return JSON.stringify({
    v: 1,
    type: 'user_identity',
    iv: wrapped.iv,
    ct: wrapped.ciphertext,
    sender_agreement_pub: myPubB64,
  });
}

async function unwrapIdentityPackage(ciphertextJson, myDeviceAgreementPriv) {
  let parsed;
  try {
    parsed = typeof ciphertextJson === 'string' ? JSON.parse(ciphertextJson) : ciphertextJson;
  } catch {
    return null;
  }
  const senderPub = parsed.sender_agreement_pub || parsed.senderAgreementPub;
  const iv = parsed.iv;
  const ct = parsed.ct || parsed.ciphertext;
  if (!senderPub || !iv || !ct) return null;

  const keyBytes = await unwrapKeyFromSender({
    recipientAgreementPrivateKey: myDeviceAgreementPriv,
    senderAgreementPublicKey: await importAgreementPublicKey(senderPub),
    wrappedIvB64: iv,
    wrappedCiphertextB64: ct,
    info: IDENTITY_WRAP_INFO,
  });
  const body = JSON.parse(new TextDecoder().decode(keyBytes));
  if (body?.type !== 'user_identity' || !body.signingPriv || !body.agreementPriv) return null;
  return body;
}

/** Pull sibling-transferred User Identity packages and install locally. */
export async function pullAndConsumeIdentityPackages() {
  await ensureDevice();
  const deviceId = await getMyDeviceId();
  if (!deviceId) return false;

  const res = await pullIdentityPackages(deviceId).catch(() => null);
  const packages = res?.packages || [];
  if (!packages.length) return false;

  const device = await getDeviceRecord();
  if (!device?.identityAgreementPriv) return false;
  const { agreementPriv } = await loadDeviceKeys(device);

  const ackIds = [];
  let installed = false;
  // eslint-disable-next-line no-restricted-syntax
  for (const pkg of packages) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const body = await unwrapIdentityPackage(pkg.ciphertext, agreementPriv);
      if (body) {
        // eslint-disable-next-line no-await-in-loop
        await saveUserIdentityRecord({
          signingPub: body.signingPub,
          signingPriv: body.signingPriv,
          agreementPub: body.agreementPub,
          agreementPriv: body.agreementPriv,
          published: true,
          createdAt: Date.now(),
          source: 'sibling_transfer',
        });
        installed = true;
        identityPending = false;
        // Keep vault backup warm on every device that receives identity.
        ensureSeamlessMultiDeviceBackup().catch(() => {});
        if (pkg.id != null) ackIds.push(pkg.id);
      } else {
        // Do NOT ack — keep the package for a later retry (wrong device key /
        // transient unwrap). Acking on null permanently locked new devices.
        console.warn('[e2e] identity package unwrap returned empty', pkg?.id);
      }
    } catch (e) {
      console.warn('[e2e] identity package unwrap failed', e);
      // Keep package for retry — never ack on decrypt failure.
    }
  }
  if (ackIds.length) {
    await ackIdentityPackages(deviceId, ackIds).catch(() => {});
  }
  return installed;
}

function parseDeviceAgreementPub(d) {
  if (d?.identity_agreement_public_key) return d.identity_agreement_public_key;
  if (!d?.identity_public_key) return null;
  try {
    const parsed = typeof d.identity_public_key === 'string'
      ? JSON.parse(d.identity_public_key)
      : d.identity_public_key;
    return parsed?.agreement || null;
  } catch {
    return null;
  }
}

/**
 * Push User Identity privates to sibling devices that lack them.
 * Called when we hold the identity and a new device is added.
 */
export async function transferUserIdentityToSiblings({ targetDeviceId = null } = {}) {
  if (!(await hasLocalUserIdentityPrivates())) return 0;
  await assertVaultUnlocked();
  await ensureDevice();

  const identity = await getUserIdentityRecord();
  const device = await getDeviceRecord();
  const myDid = device?.deviceId;
  if (!identity || !myDid) return 0;

  const { agreementPriv } = await loadDeviceKeys(device);
  const listRes = await listCryptoDevices().catch(() => null);
  const devices = listRes?.devices || listRes?.data || [];

  const targets = devices.filter((d) => {
    const did = d.device_id || d.deviceId;
    if (!did || did === myDid) return false;
    if (targetDeviceId && did !== targetDeviceId) return false;
    return !!parseDeviceAgreementPub(d);
  });

  const packages = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const t of targets) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const ct = await wrapIdentityPayload(
        parseDeviceAgreementPub(t),
        identity,
        agreementPriv,
        device.identityAgreementPub,
      );
      packages.push({
        recipient_device_id: t.device_id || t.deviceId,
        ciphertext: ct,
      });
    } catch (e) {
      console.warn('[e2e] identity wrap failed for', t.device_id, e);
    }
  }

  if (!packages.length) return 0;
  const res = await distributeIdentityPackages({
    sender_device_id: myDid,
    packages,
  }).catch((e) => {
    console.warn('[e2e] identity distribute failed', e);
    return null;
  });
  return res?.distributed || 0;
}

/**
 * Recovery passphrase backup — encrypted User Identity for offline restore.
 * Server stores opaque ciphertext only.
 */
export async function enableIdentityRecovery(passphrase) {
  if (!passphrase || passphrase.length < 8) {
    throw new Error('recovery-too-short');
  }
  if (!(await hasLocalUserIdentityPrivates())) {
    throw new Error('identity-not-ready');
  }
  await assertVaultUnlocked();
  const identity = await getUserIdentityRecord();
  const salt = randomBytes(16);
  const vaultKey = await deriveRecoveryKey(passphrase, salt);
  const plain = utf8Encode(JSON.stringify({
    v: 1,
    signingPub: identity.signingPub,
    signingPriv: identity.signingPriv,
    agreementPub: identity.agreementPub,
    agreementPriv: identity.agreementPriv,
  }));
  const { iv, ciphertext } = await encryptBytes(vaultKey, plain);
  const blob = JSON.stringify({
    v: 1,
    iv: b64Encode(iv),
    ct: b64Encode(ciphertext),
  });
  await uploadIdentityBackup({
    encrypted_backup: blob,
    backup_salt: b64Encode(salt),
    backup_version: (identity.backupVersion || 0) + 1,
  });
  await patchUserIdentityRecord({
    backupVersion: (identity.backupVersion || 0) + 1,
    hasBackup: true,
  });
  writeRecoveryHint('configured');
  try { localStorage.removeItem('messenger_e2e_recovery_setup_dismissed'); } catch { /* ignore */ }
  return true;
}

export async function restoreIdentityFromRecovery(passphrase) {
  if (!passphrase) throw new Error('recovery-required');
  const res = await getUserIdentity();
  const identity = res?.identity;
  if (!identity?.encrypted_backup || !identity?.backup_salt) {
    throw new Error('recovery-missing');
  }
  const salt = b64Decode(identity.backup_salt);
  const vaultKey = await deriveRecoveryKey(passphrase, salt);
  let parsed;
  try {
    parsed = JSON.parse(identity.encrypted_backup);
  } catch {
    throw new Error('recovery-invalid');
  }
  try {
    const pt = await decryptBytes(vaultKey, b64Decode(parsed.ct), b64Decode(parsed.iv));
    const body = JSON.parse(new TextDecoder().decode(pt));
    if (!body.signingPriv || !body.agreementPriv) throw new Error('bad');
    if (body.signingPub !== identity.signing_public
      || body.agreementPub !== identity.agreement_public) {
      throw new Error('recovery-mismatch');
    }
    await saveUserIdentityRecord({
      signingPub: body.signingPub,
      signingPriv: body.signingPriv,
      agreementPub: body.agreementPub,
      agreementPriv: body.agreementPriv,
      published: true,
      createdAt: Date.now(),
      source: 'recovery',
      hasBackup: true,
      backupVersion: identity.backup_version || 1,
    });
    identityPending = false;
  writeRecoveryHint('configured');
  try { localStorage.removeItem('messenger_e2e_recovery_setup_dismissed'); } catch { /* ignore */ }
  return true;
} catch (e) {
    if (e?.message === 'recovery-mismatch') throw e;
    throw new Error('recovery-wrong');
  }
}

async function deriveRecoveryKey(passphrase, saltBytes) {
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

export function hasRecoveryHint() {
  return !!readRecoveryHint();
}

/** Local seamless multi-device secret (never sent plaintext to API). */
const SETUP_DISMISS_KEY = 'messenger_e2e_recovery_setup_dismissed';
const RESTORE_DISMISS_KEY = 'messenger_e2e_recovery_restore_dismissed';

const MDS_LOCAL_PREFIX = 'zanburak_e2e_mds_v1:';

function mdsLocalKey() {
  try {
    const raw = localStorage.getItem('user') || localStorage.getItem('auth_user');
    if (raw) {
      const u = JSON.parse(raw);
      if (u?.id != null) return `${MDS_LOCAL_PREFIX}${u.id}`;
    }
  } catch { /* ignore */ }
  return `${MDS_LOCAL_PREFIX}me`;
}

function readLocalMds() {
  try {
    return localStorage.getItem(mdsLocalKey()) || null;
  } catch {
    return null;
  }
}

function writeLocalMds(mds) {
  try {
    if (mds) localStorage.setItem(mdsLocalKey(), mds);
    else localStorage.removeItem(mdsLocalKey());
  } catch { /* ignore */ }
}

/** One silent password-manager read per page. Never call credentials.store — Chrome shows "Save password?" on every store(), and the sync loop was re-prompting after each dismiss. */
let mdsCredentialGetTried = false;

async function loadMdsCredential() {
  const local = readLocalMds();
  if (local) return local;
  if (mdsCredentialGetTried) return null;
  mdsCredentialGetTried = true;
  try {
    if (typeof window === 'undefined' || !navigator.credentials?.get) return null;
    const cred = await navigator.credentials.get({
      password: true,
      mediation: 'silent',
    });
    if (cred && 'password' in cred && cred.password && String(cred.id || '').startsWith(MDS_LOCAL_PREFIX)) {
      writeLocalMds(cred.password);
      return cred.password;
    }
  } catch { /* ignore */ }
  return null;
}

/** Successful seamless backup for this page load. Later sync ticks must not re-upload. */
let seamlessBackupDone = false;
let seamlessBackupInflight = null;
let seamlessBackupRetryAt = 0;

/**
 * First device / holder: silently create an identity backup + authenticated
 * multi-device unlock so future logins restore history without a typed passphrase
 * or waiting for a peer / sibling message.
 */
async function runSeamlessBackup() {
  if (!(await hasLocalUserIdentityPrivates())) return null;
  const identity = await getUserIdentityRecord();
  let mds = identity?.seamlessMds || readLocalMds();
  if (!mds) {
    mds = b64Encode(randomBytes(32));
  }
  try {
    if (!identity?.hasBackup) {
      await enableIdentityRecovery(mds);
    }
    await uploadSeamlessUnlock(mds).catch((e) => {
      console.warn('[e2e] seamless unlock upload failed', e?.message || e);
    });
    await patchUserIdentityRecord({ seamlessMds: mds, hasBackup: true });
    writeLocalMds(mds);
    // Don't nag the user with setup/restore modals — this path is automatic.
    try { localStorage.setItem(SETUP_DISMISS_KEY, '1'); } catch { /* ignore */ }
    try { localStorage.setItem(RESTORE_DISMISS_KEY, '1'); } catch { /* ignore */ }
    return true;
  } catch (e) {
    console.warn('[e2e] seamless multi-device backup failed', e?.message || e);
    return false;
  }
}

export function ensureSeamlessMultiDeviceBackup() {
  if (seamlessBackupDone) return Promise.resolve(true);
  if (seamlessBackupInflight) return seamlessBackupInflight;
  if (Date.now() < seamlessBackupRetryAt) return Promise.resolve(false);
  seamlessBackupInflight = runSeamlessBackup()
    .then((ok) => {
      if (ok === true) seamlessBackupDone = true;
      else if (ok === false) seamlessBackupRetryAt = Date.now() + 60_000;
      return ok === true;
    })
    .finally(() => {
      seamlessBackupInflight = null;
    });
  return seamlessBackupInflight;
}

async function loadMdsFromServer() {
  try {
    const res = await getUserIdentity();
    const mds = res?.identity?.seamless_unlock;
    if (mds && String(mds).length >= 16) return String(mds);
  } catch { /* ignore */ }
  return null;
}

/**
 * New device: restore User Identity without a typed passphrase when possible.
 * Order: local/credential MDS → authenticated server unlock → (caller also tries sibling).
 */
export async function trySeamlessIdentityRestore() {
  if (await hasLocalUserIdentityPrivates()) return true;
  const status = await getIdentityRecoveryStatus().catch(() => ({ hasBackup: false, pending: true }));
  if (!status.pending) return true;
  if (!status.hasBackup) return false;

  const mds = (await loadMdsCredential()) || (await loadMdsFromServer());
  if (!mds) return false;
  try {
    await restoreIdentityFromRecovery(mds);
    await patchUserIdentityRecord({ seamlessMds: mds, hasBackup: true });
    writeLocalMds(mds);
    // Keep server envelope warm for the next device.
    uploadSeamlessUnlock(mds).catch(() => {});
    identityPending = false;
    return true;
  } catch (e) {
    console.warn('[e2e] seamless restore failed', e?.message || e);
    return false;
  }
}

export function isRecoverySetupDismissed() {
  try {
    return localStorage.getItem(SETUP_DISMISS_KEY) === '1';
  } catch {
    return false;
  }
}

export function dismissRecoverySetupPrompt() {
  try { localStorage.setItem(SETUP_DISMISS_KEY, '1'); } catch { /* ignore */ }
}

export function clearRecoverySetupDismissed() {
  try { localStorage.removeItem(SETUP_DISMISS_KEY); } catch { /* ignore */ }
}

/** Sticky dismiss for the restore passphrase dialog on this device. */
export function isRecoveryRestoreDismissed() {
  try {
    return localStorage.getItem(RESTORE_DISMISS_KEY) === '1';
  } catch {
    return false;
  }
}

export function dismissRecoveryRestorePrompt() {
  try { localStorage.setItem(RESTORE_DISMISS_KEY, '1'); } catch { /* ignore */ }
}

export function clearRecoveryRestoreDismissed() {
  try { localStorage.removeItem(RESTORE_DISMISS_KEY); } catch { /* ignore */ }
}

/**
 * Whether this device can unwrap history, and whether a server backup exists.
 */
export async function getIdentityRecoveryStatus() {
  const local = await getUserIdentityRecord().catch(() => null);
  const hasLocalPrivates = !!(local?.signingPriv && local?.agreementPriv);
  let hasBackup = !!(local?.hasBackup || hasRecoveryHint());
  try {
    const res = await getUserIdentity();
    const id = res?.identity;
    if (id?.has_backup || id?.encrypted_backup) hasBackup = true;
  } catch { /* ignore */ }
  return {
    hasBackup,
    hasLocalPrivates,
    pending: !hasLocalPrivates,
  };
}

/**
 * Ensure this browser holds the account User Identity (privates when possible).
 * Never mints a second User Identity if the server already published one.
 */
export function ensureUserIdentity({ force = false } = {}) {
  if (ensureUserIdentityPromise && !force) return ensureUserIdentityPromise;

  const run = (async () => {
    await assertVaultUnlocked().catch(() => {});
    await ensureDevice();

    let local = await getUserIdentityRecord();

    if (local?.signingPriv && local?.agreementPriv) {
      if (!local.published) {
        const published = await publishToServer(local).catch((e) => {
          console.warn('[e2e] publish user identity failed', e);
          return null;
        });
        if (published === null) {
          // Server already has a different User Identity — discard local mint
          // and adopt via sibling transfer / recovery.
          await saveUserIdentityRecord({
            signingPub: null,
            agreementPub: null,
            signingPriv: null,
            agreementPriv: null,
            published: false,
            pendingPrivates: true,
            createdAt: Date.now(),
            source: 'conflict_cleared',
          });
          local = null;
        } else {
          identityPending = false;
          transferUserIdentityToSiblings().catch(() => {});
          return published || local;
        }
      } else {
        identityPending = false;
        transferUserIdentityToSiblings().catch(() => {});
        return local;
      }
    }

    const got = await pullAndConsumeIdentityPackages().catch(() => false);
    if (got) {
      identityPending = false;
      return getUserIdentityRecord();
    }

    const remote = await getUserIdentity().catch(() => null);
    const serverId = remote?.identity || null;

    if (serverId?.signing_public && serverId?.agreement_public) {
      // Prefer silent restore (server MDS / password manager) before sibling wait.
      const seamless = await trySeamlessIdentityRestore().catch(() => false);
      if (seamless || (await hasLocalUserIdentityPrivates().catch(() => false))) {
        identityPending = false;
        return getUserIdentityRecord();
      }
      identityPending = true;
      const deviceId = await getMyDeviceId();
      if (deviceId) {
        await requestIdentityTransfer(deviceId).catch(() => {});
      }
      await new Promise((r) => setTimeout(r, 600));
      const got2 = await pullAndConsumeIdentityPackages().catch(() => false);
      if (got2) {
        identityPending = false;
        return getUserIdentityRecord();
      }
      // Sibling may still be offline — retry authenticated unlock once more.
      const seamless2 = await trySeamlessIdentityRestore().catch(() => false);
      if (seamless2 || (await hasLocalUserIdentityPrivates().catch(() => false))) {
        identityPending = false;
        return getUserIdentityRecord();
      }
      await saveUserIdentityRecord({
        signingPub: serverId.signing_public,
        agreementPub: serverId.agreement_public,
        signingPriv: null,
        agreementPriv: null,
        published: true,
        createdAt: Date.now(),
        source: 'server_publics_only',
        hasBackup: !!serverId.has_backup,
        pendingPrivates: true,
      });
      return getUserIdentityRecord();
    }

    // First device for this account — promote existing device keys or mint.
    const device = await getDeviceRecord();
    local = await promoteDeviceKeysToUserIdentity(device);
    if (!local) {
      local = await mintUserIdentity();
    }
    try {
      const published = await publishToServer(local);
      if (published === null) {
        identityPending = true;
        const deviceId = await getMyDeviceId();
        if (deviceId) await requestIdentityTransfer(deviceId).catch(() => {});
        await pullAndConsumeIdentityPackages().catch(() => false);
        return getUserIdentityRecord();
      }
      identityPending = false;
      // First holder: seed seamless backup so future devices unlock without a peer message.
      ensureSeamlessMultiDeviceBackup().catch(() => {});
      return published || local;
    } catch (e) {
      if (e?.response?.status === 422) {
        identityPending = true;
        const deviceId = await getMyDeviceId();
        if (deviceId) await requestIdentityTransfer(deviceId).catch(() => {});
        await pullAndConsumeIdentityPackages().catch(() => false);
        return getUserIdentityRecord();
      }
      console.warn('[e2e] first publish failed', e);
      return local;
    }
  })();

  ensureUserIdentityPromise = run;
  run.finally(() => {
    if (ensureUserIdentityPromise === run) ensureUserIdentityPromise = null;
  });
  return run;
}

/**
 * New device: ask siblings (HTTP) for User Identity privates, then consume.
 * Does not depend on WebSocket events.
 */
export async function adoptUserIdentityFromSiblings() {
  if (await hasLocalUserIdentityPrivates()) return true;
  await ensureDevice();
  const deviceId = await getMyDeviceId();
  if (!deviceId) return false;

  // One transfer request, then short poll — keep total wait small so callers
  // that await this (heal path) don't stall the UI for many seconds.
  await requestIdentityTransfer(deviceId).catch(() => {});
  const waits = [250, 700, 1500];
  // eslint-disable-next-line no-restricted-syntax
  for (const wait of waits) {
    await new Promise((r) => setTimeout(r, wait));
    const got = await pullAndConsumeIdentityPackages().catch(() => false);
    if (got || (await hasLocalUserIdentityPrivates())) {
      identityPending = false;
      return true;
    }
  }
  return false;
}

/**
 * Full crypto bootstrap: Device Keys + User Identity.
 * Call this instead of ensureDevice alone at login / config load.
 */
export async function bootstrapCrypto() {
  await ensureDevice();
  return ensureUserIdentity();
}

/**
 * Explicit encryption reset — mints a NEW User Identity (Security Code changes).
 */
export async function resetUserIdentity() {
  await ensureDevice();
  const record = await mintUserIdentity();
  await publishToServer(record, { forceReset: true });
  identityPending = false;
  await transferUserIdentityToSiblings().catch(() => {});
  return record;
}
