/**
 * Per-conversation symmetric key lifecycle.
 *
 * Rules:
 *  1. Pull+consume packages BEFORE creating a new local key
 *  2. Never overwrite an existing (conversationId, kid) key — keep alternates
 *  3. Wrap to OTP when available (verified); fall back to signed prekey / identity
 *  4. Rotate kid on membership / revoke for forward-secrecy-lite
 *  5. Never force-redistribute from the e2e.package receive path
 */
import {
  getConversationBundles,
  distributeConversationKeys,
  pullPackages,
  ackPackages,
} from '@/services/messenger';
import { generateAesKeyBytes } from './aes';
import { b64Encode, b64Decode } from './bytes';
import {
  importAgreementPublicKey,
  importAgreementPrivateKey,
  importSigningPublicKey,
  verifyPrekeySignature,
  wrapKeyForRecipient,
  unwrapKeyFromSender,
} from './keys';
import {
  getDeviceRecord,
  getPrekey,
  markPrekeyUsed,
  saveConversationKey,
  saveConversationKeyAlternate,
  getConversationKey,
  getLatestConversationKey,
  listConversationKeys,
  reconcileConversationKeys,
  isDistributed,
  markDistributed,
  isPackageSeen,
  markPackageSeen,
  clearDistributedForConversation,
  archiveConversationKeyToHistory,
} from './store';
import { ensureDevice, loadIdentityKeys, repairDeviceRegistration } from './device';
import { assertVaultUnlocked } from './vault';
import {
  uploadConversationKeyToVault,
  pullAndConsumeKeyVault,
  ensureLatestKeyInVault,
  uploadAllLocalKeysToVault,
} from './keyVault';

const WRAP_INFO_PREFIX = 'zanburak-e2e-conv-key-v1';

function wrapInfo(conversationId, kid) {
  return `${WRAP_INFO_PREFIX}:${String(conversationId)}:${Number(kid)}`;
}

function wrapInfoVariants(conversationId, kid) {
  const k = Number(kid);
  return [...new Set([
    `${WRAP_INFO_PREFIX}:${String(conversationId)}:${k}`,
    `${WRAP_INFO_PREFIX}:${Number(conversationId)}:${k}`,
  ])];
}

const ensureKeyPromises = new Map();
const readyKeyCache = new Map(); // conversationId -> { keyBytes, kid, at }
const pullInflight = new Map();
const pullCooldownUntil = new Map();
const distributeInflight = new Map();
const forceRedistributeDone = new Set();
const rotateInflight = new Map();
const bundlesCache = new Map(); // conversationId -> { bundles, at }
const bundlesInflight = new Map(); // conversationId -> Promise
const wrapsCache = new Map(); // `${cid}:${kid}` -> { wraps, at }
const wrapsBuildInflight = new Map(); // `${cid}:${kid}:force` -> Promise

const PULL_COOLDOWN_MS = 30_000;
const READY_KEY_TTL_MS = 5 * 60_000; // 5 min — warm chats stay memory-only
const BUNDLES_TTL_MS = 5 * 60_000;
const WRAPS_TTL_MS = 5 * 60_000;
const DISTRIBUTE_COOLDOWN_MS = 5 * 60_000;

const distributedMem = new Map(); // `${cid}:${kid}:${deviceId}` -> true
const distributeDoneAt = new Map(); // `${cid}:${kid}` -> timestamp

function pullCacheKey(conversationId) {
  return conversationId == null ? '__all__' : String(conversationId);
}

/** Cached peer device bundles — avoids a GET on every encrypt/distribute. */
async function fetchConversationBundlesCached(conversationId, { force = false } = {}) {
  const key = String(conversationId);
  const hit = bundlesCache.get(key);
  if (!force && hit && (Date.now() - hit.at) < BUNDLES_TTL_MS) {
    return hit.bundles;
  }
  if (!force && bundlesInflight.has(key)) {
    return bundlesInflight.get(key);
  }
  const promise = (async () => {
    const bundlesRes = await getConversationBundles(conversationId).catch((e) => {
      if (isUnknownDeviceError(e)) throw e;
      console.warn('[e2e] bundles fetch failed', e);
      return null;
    });
    const bundles = bundlesRes?.devices || bundlesRes?.bundles || [];
    bundlesCache.set(key, { bundles, at: Date.now() });
    return bundles;
  })();
  bundlesInflight.set(key, promise);
  try {
    return await promise;
  } finally {
    if (bundlesInflight.get(key) === promise) bundlesInflight.delete(key);
  }
}

function invalidateBundlesCache(conversationId) {
  if (conversationId == null) {
    bundlesCache.clear();
    wrapsCache.clear();
    distributedMem.clear();
    return;
  }
  const key = String(conversationId);
  bundlesCache.delete(key);
  [...wrapsCache.keys()].filter((k) => k.startsWith(`${key}:`)).forEach((k) => wrapsCache.delete(k));
  [...distributedMem.keys()].filter((k) => k.startsWith(`${key}:`)).forEach((k) => distributedMem.delete(k));
}

/** Drop cached bundles/wraps so the next send includes newly registered devices. */
export function invalidateConversationCryptoCache(conversationId = null) {
  invalidateBundlesCache(conversationId);
}

function distMemKey(conversationId, kid, deviceId) {
  return `${String(conversationId)}:${Number(kid)}:${deviceId}`;
}

async function isDistributedFast(conversationId, kid, deviceId) {
  const mk = distMemKey(conversationId, kid, deviceId);
  if (distributedMem.get(mk)) return true;
  const ok = await isDistributed(conversationId, kid, deviceId);
  if (ok) distributedMem.set(mk, true);
  return ok;
}

async function markDistributedFast(conversationId, kid, deviceId) {
  distributedMem.set(distMemKey(conversationId, kid, deviceId), true);
  await markDistributed(conversationId, kid, deviceId);
}

/**
 * @param {string|number} conversationId
 * @param {{ allowMint?: boolean }} [options]
 *   allowMint=false — never invent a key (prewarm / open-chat). Minting a fresh
 *   kid=1 on a sibling device that lacks packages is the #1 cause of permanent
 *   «پیام رمزنگاری‌شده» for every historical message.
 * @returns {Promise<{ keyBytes: Uint8Array, kid: number }>}
 */
export function ensureConversationKey(conversationId, options = {}) {
  const allowMint = options.allowMint !== false;
  const cacheKey = String(conversationId);

  const cached = readyKeyCache.get(cacheKey);
  if (cached && (Date.now() - cached.at) < READY_KEY_TTL_MS) {
    return Promise.resolve({ keyBytes: cached.keyBytes, kid: cached.kid });
  }

  // Minting sends must not join a prewarm that is still pulling packages.
  const inflightKey = allowMint ? `${cacheKey}:mint` : `${cacheKey}:read`;
  if (ensureKeyPromises.has(inflightKey)) return ensureKeyPromises.get(inflightKey);

  const promise = (async () => {
    await ensureDevice();
    await assertVaultUnlocked();

    let latest = await getLatestConversationKey(conversationId);

    // Local key: return immediately. Reconcile and package pull stay off the send.
    if (latest?.keyB64) {
      const result = { keyBytes: b64Decode(latest.keyB64), kid: Number(latest.kid) };
      readyKeyCache.set(cacheKey, { ...result, at: Date.now() });

      Promise.resolve().then(async () => {
        try {
          const reconciled = await reconcileConversationKeys(conversationId, result.kid);
          if (reconciled?.keyB64) {
            const current = b64Encode(result.keyBytes);
            if (reconciled.keyB64 !== current || Number(reconciled.kid) !== result.kid) {
              readyKeyCache.set(cacheKey, {
                keyBytes: b64Decode(reconciled.keyB64),
                kid: Number(reconciled.kid),
                at: Date.now(),
              });
            }
          }
          await pullAndConsumePackages(conversationId).catch(() => {});
        } catch (e) {
          console.warn('[e2e] background key sync failed', e);
        }
      });

      return result;
    }

    // True first send (allowMint): skip the packages round-trip — a brand-new
    // chat has nothing to consume, and the pull was adding 300–800ms + failures.
    if (!allowMint) {
      await pullAndConsumePackages(conversationId, { bypassCooldown: true });
      latest = await getLatestConversationKey(conversationId);
    }

    if (!latest?.keyB64 && !allowMint) {
      // Ask holders to redistribute, then pull once more before failing.
      try {
        const { requestConversationKey } = await import('@/services/messenger');
        await requestConversationKey(conversationId);
        await new Promise((r) => setTimeout(r, 400));
        await pullAndConsumePackages(conversationId, { bypassCooldown: true });
        latest = await getLatestConversationKey(conversationId);
      } catch (e) { /* best-effort */ }
    }

    if (!latest?.keyB64) {
      if (!allowMint) {
        throw new Error('missing-conversation-key');
      }
      const keyBytes = generateAesKeyBytes();
      const kid = 1;
      const keyB64 = b64Encode(keyBytes);
      await saveConversationKey(conversationId, kid, keyB64, { overwrite: false });
      latest = { conversationId: String(conversationId), kid, keyB64 };
      // Brand-new key must land in the identity vault for future devices.
      uploadConversationKeyToVault(conversationId, kid, keyBytes).catch(() => {});
    } else {
      latest = (await reconcileConversationKeys(conversationId, latest.kid)) || latest;
    }

    try {
      // Fire-and-forget — do not block first send on /distribute.
      distributeConversationKeyToBundles(
        conversationId,
        Number(latest.kid),
        b64Decode(latest.keyB64),
        { force: false },
      ).catch((e) => console.warn('[e2e] key distribute failed', e));
    } catch (e) {
      console.warn('[e2e] key distribute failed', e);
    }

    const result = { keyBytes: b64Decode(latest.keyB64), kid: Number(latest.kid) };
    readyKeyCache.set(cacheKey, { ...result, at: Date.now() });
    return result;
  })();

  ensureKeyPromises.set(inflightKey, promise);
  return promise.finally(() => ensureKeyPromises.delete(inflightKey));
}

/**
 * Mint a new conversation key version and distribute it.
 * Provides forward-secrecy-lite: new members / after revoke cannot read future
 * messages encrypted under the previous kid (past messages still use old kids).
 */
export async function rotateConversationKey(conversationId, { reason = 'manual' } = {}) {
  const key = String(conversationId);
  if (rotateInflight.has(key)) return rotateInflight.get(key);

  const work = (async () => {
    await ensureDevice();
    await pullAndConsumePackages(conversationId, { bypassCooldown: true });

    const latest = await getLatestConversationKey(conversationId);
    const nextKid = latest?.kid ? Number(latest.kid) + 1 : 1;
    // Keep previous kid decryptable on this device (history), then mint next.
    if (latest?.keyB64) {
      await archiveConversationKeyToHistory(conversationId, latest.kid, latest.keyB64);
    }
    const keyBytes = generateAesKeyBytes();
    const keyB64 = b64Encode(keyBytes);
    await saveConversationKey(conversationId, nextKid, keyB64, { overwrite: false });
    await clearDistributedForConversation(conversationId);
    readyKeyCache.delete(key);
    invalidateBundlesCache(conversationId);

    await distributeConversationKeyToBundles(conversationId, nextKid, keyBytes, { force: true });
    uploadConversationKeyToVault(conversationId, nextKid, keyBytes).catch(() => {});
    readyKeyCache.set(key, { keyBytes, kid: nextKid, at: Date.now() });
    console.info('[e2e] rotated conversation key', { conversationId, kid: nextKid, reason });
    return { keyBytes, kid: nextKid };
  })();

  rotateInflight.set(key, work);
  try {
    return await work;
  } finally {
    rotateInflight.delete(key);
  }
}

async function resolveRecipientWrapTarget(bundle) {
  // Prefer long-term identity agreement for reliability.
  if (bundle.identity_agreement_public_key) {
    return {
      pubB64: bundle.identity_agreement_public_key,
      prekeyId: null,
      useSignedPrekey: false,
    };
  }

  const signingPubB64 = bundle.identity_signing_public_key;
  const otp = bundle.one_time_prekey || null;
  if (otp?.public_key && otp?.prekey_id != null && Number(otp.prekey_id) >= 1000) {
    if (signingPubB64 && otp.signature) {
      const signingPub = await importSigningPublicKey(signingPubB64);
      const ok = await verifyPrekeySignature(
        signingPub,
        Number(otp.prekey_id),
        otp.public_key,
        otp.signature,
      );
      if (ok) {
        return { pubB64: otp.public_key, prekeyId: Number(otp.prekey_id), useSignedPrekey: false };
      }
    }
  }

  // Fallback: signed prekey (always present on registered devices).
  if (bundle.signed_prekey_public) {
    return {
      pubB64: bundle.signed_prekey_public,
      prekeyId: bundle.signed_prekey_id != null ? Number(bundle.signed_prekey_id) : 1,
      useSignedPrekey: true,
    };
  }

  return null;
}

export async function distributeConversationKeyToBundles(conversationId, kid, keyBytes, { force = false, _retried = false } = {}) {
  let record = await getDeviceRecord();
  if (!record) {
    await ensureDevice();
    record = await getDeviceRecord();
  }
  if (!record) return;

  const distKey = `${String(conversationId)}:${Number(kid)}:${force ? 'f' : 'n'}`;
  if (distributeInflight.has(distKey)) return distributeInflight.get(distKey);

  // Skip redundant distribute storms (bundles+POST) when we recently finished.
  const doneKey = `${String(conversationId)}:${Number(kid)}`;
  const lastDone = distributeDoneAt.get(doneKey) || 0;
  if (!force && !_retried && (Date.now() - lastDone) < DISTRIBUTE_COOLDOWN_MS) {
    return;
  }

  const work = (async () => {
    const { agreementPriv } = await loadIdentityKeys(record);
    const myId = String(record.deviceId || '');

    const wrapsKey = `${String(conversationId)}:${Number(kid)}`;
    const wrapsHit = wrapsCache.get(wrapsKey);
    const wrapsByDid = new Map();
    if (wrapsHit && (Date.now() - wrapsHit.at) < WRAPS_TTL_MS && Array.isArray(wrapsHit.wraps)) {
      wrapsHit.wraps.forEach((w) => {
        if (w?.did) wrapsByDid.set(String(w.did), w);
      });
    }

    let bundles;
    try {
      // force=true (sibling redistribute / new device) must refresh bundles —
      // stale cache misses newly registered devices.
      bundles = await fetchConversationBundlesCached(conversationId, {
        force: force || !!_retried,
      });
    } catch (e) {
      if (isUnknownDeviceError(e) && !_retried) throw e;
      console.warn('[e2e] bundles fetch failed', e);
      bundles = [];
    }
    const packages = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const bundle of bundles) {
      const deviceId = String((bundle.device_id ?? bundle.deviceId) || '');
      if (!deviceId || deviceId === myId) continue;

      // eslint-disable-next-line no-await-in-loop
      const already = !force && (await isDistributedFast(conversationId, kid, deviceId));
      const hasWrap = wrapsByDid.has(deviceId);

      // Fully covered — skip ECDH for this peer.
      if (already && hasWrap) continue;

      // eslint-disable-next-line no-await-in-loop
      const target = await resolveRecipientWrapTarget(bundle);
      if (!target?.pubB64) continue;

      // eslint-disable-next-line no-await-in-loop
      const recipientPub = await importAgreementPublicKey(target.pubB64);
      // eslint-disable-next-line no-await-in-loop
      const wrapped = await wrapKeyForRecipient({
        senderAgreementPrivateKey: agreementPriv,
        recipientAgreementPublicKey: recipientPub,
        keyBytesToWrap: keyBytes,
        info: wrapInfo(conversationId, kid),
      });

      wrapsByDid.set(deviceId, {
        did: deviceId,
        iv: wrapped.iv,
        ct: wrapped.ciphertext,
        sap: record.identityAgreementPub,
      });

      if (already) continue;

      const recipientUserId = Number(bundle.user_id ?? bundle.userId);
      if (!recipientUserId) continue;

      packages.push({
        recipient_device_id: deviceId,
        recipient_user_id: recipientUserId,
        key_version: Number(kid),
        ciphertext: JSON.stringify({
          iv: wrapped.iv,
          ct: wrapped.ciphertext,
          ...(target.prekeyId != null ? { prekey_id: target.prekeyId } : {}),
          use_signed_prekey: !!target.useSignedPrekey,
          sender_agreement_pub: record.identityAgreementPub,
        }),
      });
    }

    if (wrapsByDid.size) {
      wrapsCache.set(wrapsKey, {
        wraps: [...wrapsByDid.values()],
        at: Date.now(),
      });
    }

    if (!packages.length) {
      distributeDoneAt.set(doneKey, Date.now());
      return;
    }

    try {
      await distributeConversationKeys(conversationId, {
        sender_device_id: record.deviceId,
        packages,
      });
    } catch (e) {
      if (isUnknownDeviceError(e) && !_retried) {
        console.warn('[e2e] distribute 422 — repairing device then retrying');
        distributeInflight.delete(distKey);
        await repairDeviceRegistration();
        invalidateBundlesCache(conversationId);
        return distributeConversationKeyToBundles(conversationId, kid, keyBytes, {
          force: true,
          _retried: true,
        });
      }
      throw e;
    }
    await Promise.all(packages.map((p) => markDistributedFast(conversationId, kid, p.recipient_device_id)));
    distributeDoneAt.set(doneKey, Date.now());
  })();

  distributeInflight.set(distKey, work);
  try {
    await work;
  } finally {
    distributeInflight.delete(distKey);
  }
}

function isUnknownDeviceError(e) {
  const status = e?.response?.status;
  const msg = String(e?.response?.data?.message || e?.message || '');
  return status === 422 && /unknown|revoked|crypto device/i.test(msg);
}

export async function pullAndConsumePackages(conversationId = null, { bypassCooldown = false } = {}) {
  const cacheKey = pullCacheKey(conversationId);

  // An in-flight pull that started before sibling packages landed often
  // returns empty. Urgent callers must not inherit that empty result —
  // that is why a second device stayed on «پیام رمزنگاری‌شده» until someone
  // sent a new message (inline wraps) from the first device.
  const existing = pullInflight.get(cacheKey);
  if (existing && !bypassCooldown) return existing;
  if (existing && bypassCooldown) {
    const n = await existing.catch(() => 0);
    if (n > 0) return n;
  }

  const until = pullCooldownUntil.get(cacheKey) || 0;
  if (!bypassCooldown && Date.now() < until) return 0;

  const raced = pullInflight.get(cacheKey);
  if (raced && raced !== existing) return raced;

  const work = (async () => {
    let record = await getDeviceRecord();
    if (!record?.deviceId) {
      await ensureDevice();
      record = await getDeviceRecord();
    }
    if (!record?.deviceId) return 0;

    let res;
    try {
      res = await pullPackages(record.deviceId, conversationId);
    } catch (e) {
      if (isUnknownDeviceError(e)) {
        console.warn('[e2e] packages 422 — repairing device registration');
        try {
          await repairDeviceRegistration();
          record = await getDeviceRecord();
          res = await pullPackages(record.deviceId, conversationId);
        } catch (e2) {
          console.warn('[e2e] pull packages failed after repair', e2);
          return 0;
        }
      } else {
        console.warn('[e2e] pull packages failed', e);
        return 0;
      }
    }
    const list = res?.packages || res?.data || [];
    if (!Array.isArray(list) || !list.length) return 0;

    const processedIds = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const pkg of list) {
      const id = pkg.id;
      // eslint-disable-next-line no-await-in-loop
      if (id != null && (await isPackageSeen(id))) {
        processedIds.push(id);
        continue;
      }
      try {
        // eslint-disable-next-line no-await-in-loop
        await consumePackage(pkg, record);
        if (id != null) {
          processedIds.push(id);
          // eslint-disable-next-line no-await-in-loop
          await markPackageSeen(id);
        }
      } catch (err) {
        console.warn('[e2e] consume package failed', err, pkg?.id);
      }
    }
    if (processedIds.length) {
      await ackPackages(record.deviceId, processedIds).catch(() => {});
    }
    return processedIds.length;
  })();

  pullInflight.set(cacheKey, work);
  try {
    const n = await work;
    if (n > 0) {
      pullCooldownUntil.set(cacheKey, Date.now() + PULL_COOLDOWN_MS);
      if (conversationId != null) {
        const allUntil = pullCooldownUntil.get('__all__') || 0;
        if (Date.now() >= allUntil) {
          pullCooldownUntil.set('__all__', Date.now() + Math.floor(PULL_COOLDOWN_MS / 2));
        }
      }
    } else if (!bypassCooldown) {
      pullCooldownUntil.set(cacheKey, Date.now() + PULL_COOLDOWN_MS);
    } else {
      // Empty urgent pull: do not lock out the next e2e.package / heal tick.
      pullCooldownUntil.set(cacheKey, Date.now() + 400);
    }
    return n;
  } finally {
    if (pullInflight.get(cacheKey) === work) pullInflight.delete(cacheKey);
  }
}

/** Vault (identity-wrapped) then device packages — used before decrypt / heal. */
export async function pullConversationKeySources(conversationId = null, {
  bypassCooldown = true,
  forceVault = true,
} = {}) {
  await pullAndConsumeKeyVault(conversationId, { force: forceVault }).catch(() => 0);
  return pullAndConsumePackages(conversationId, { bypassCooldown }).catch(() => 0);
}

async function collectUnwrapPrivateKeys(record, prekeyId, useSignedPrekey) {
  const out = [];
  const pushPriv = async (b64) => {
    if (!b64) return;
    out.push(await importAgreementPrivateKey(b64));
  };

  // Try every plausible agreement private key — legacy packages used prekey_id=1
  // for both OTPs and the signed prekey, and sometimes fell through to identity.
  if (useSignedPrekey) {
    await pushPriv(record.signedPrekeyPriv);
  }
  if (prekeyId != null && prekeyId !== '') {
    const prekeyRow = await getPrekey(Number(prekeyId));
    if (prekeyRow?.priv) await pushPriv(prekeyRow.priv);
    if (Number(prekeyId) === Number(record.signedPrekeyId || 1)) {
      await pushPriv(record.signedPrekeyPriv);
    }
  }
  const { agreementPriv } = await loadIdentityKeys(record);
  out.push(agreementPriv);
  if (!useSignedPrekey) {
    await pushPriv(record.signedPrekeyPriv);
  }
  return out;
}

async function persistUnwrappedConversationKey(conversationId, kid, keyBytes) {
  const keyB64 = b64Encode(keyBytes);
  const existing = await getConversationKey(conversationId, kid);
  if (existing?.keyB64 && existing.keyB64 !== keyB64) {
    await saveConversationKeyAlternate(conversationId, kid, keyB64);
  } else {
    await saveConversationKey(conversationId, kid, keyB64, { overwrite: false });
  }
  // Keep both keys available for decrypt; converge encrypt primary when possible.
  await reconcileConversationKeys(conversationId, kid);
  // Durable multi-device recovery — identity-wrapped vault (best-effort).
  uploadConversationKeyToVault(conversationId, kid, keyBytes).catch(() => {});
  return keyB64;
}

/**
 * Build per-recipient ECDH wraps of the conversation key to embed in message.e2e.
 *
 * Cache is only reused when it covers EVERY current peer device id.
 * Incomplete cache (e.g. only the sender's other device) is the main reason
 * recipients see «پیام رمزنگاری‌شده».
 *
 * @returns {Promise<{ wraps: array, omitted: boolean }>}
 */
export async function buildInlineKeyWraps(conversationId, kid, keyBytes, options = {}) {
  const cacheKey = `${String(conversationId)}:${Number(kid)}`;
  const forceBundles = options.forceBundles === true || options.forceRebuild === true;
  const inflightKey = `${cacheKey}:${forceBundles ? 1 : 0}:${options.forceRebuild ? 1 : 0}`;

  // Deduplicate concurrent cold builds (burst send / prewarm race).
  if (wrapsBuildInflight.has(inflightKey)) {
    return wrapsBuildInflight.get(inflightKey);
  }

  const work = (async () => {
  let record = await getDeviceRecord();
  if (!record) {
    await ensureDevice();
    record = await getDeviceRecord();
  }
  if (!record?.identityAgreementPub) return { wraps: [], omitted: false };

  const myId = String(record.deviceId || '');

  // Saved Messages / single-device chats often have zero peer devices. Cache that
  // so every send does not re-hit GET /bundles (crypto pool + spinner).
  const cachedEarly = wrapsCache.get(cacheKey);
  if (
    !forceBundles
    && cachedEarly
    && cachedEarly.noPeers
    && (Date.now() - cachedEarly.at) < WRAPS_TTL_MS
  ) {
    return { wraps: [], omitted: false, noPeers: true };
  }

  // Warm complete wraps — skip rebuild.
  if (
    !forceBundles
    && cachedEarly
    && Array.isArray(cachedEarly.wraps)
    && cachedEarly.wraps.length
    && (Date.now() - cachedEarly.at) < WRAPS_TTL_MS
  ) {
    return { wraps: cachedEarly.wraps, omitted: false };
  }

  const bundles = await fetchConversationBundlesCached(conversationId, { force: forceBundles }).catch((e) => {
    console.warn('[e2e] bundles for inline wraps failed', e);
    return [];
  });

  const peerBundles = bundles.filter((b) => {
    const deviceId = b.device_id ?? b.deviceId;
    return deviceId && String(deviceId) !== myId;
  });
  if (!peerBundles.length) {
    wrapsCache.set(cacheKey, { wraps: [], at: Date.now(), noPeers: true });
    return { wraps: [], omitted: false, noPeers: true };
  }

  const peerIds = peerBundles.map((b) => String(b.device_id ?? b.deviceId));
  const peerSet = new Set(peerIds);

  const cached = wrapsCache.get(cacheKey);
  let wraps = (
    cached
    && (Date.now() - cached.at) < WRAPS_TTL_MS
    && Array.isArray(cached.wraps)
  ) ? cached.wraps.filter((w) => peerSet.has(String(w?.did || ''))) : [];

  const have = new Set(wraps.map((w) => String(w.did)));
  const missingBundles = peerBundles.filter((b) => !have.has(String(b.device_id ?? b.deviceId)));
  const needRebuild = options.forceRebuild === true || missingBundles.length > 0 || wraps.length === 0;

  if (!needRebuild) {
    return { wraps, omitted: false };
  }

  const { agreementPriv } = await loadIdentityKeys(record);
  const toBuild = options.forceRebuild === true ? peerBundles : missingBundles;

  const fresh = (await Promise.all(toBuild.map(async (bundle) => {
    const deviceId = String(bundle.device_id ?? bundle.deviceId);
    try {
      const target = await resolveRecipientWrapTarget(bundle);
      if (!target?.pubB64) {
        console.warn('[e2e] no wrap target for device', deviceId);
        return null;
      }
      const recipientPub = await importAgreementPublicKey(target.pubB64);
      const wrapped = await wrapKeyForRecipient({
        senderAgreementPrivateKey: agreementPriv,
        recipientAgreementPublicKey: recipientPub,
        keyBytesToWrap: keyBytes,
        info: wrapInfo(conversationId, kid),
      });
      return {
        did: deviceId,
        iv: wrapped.iv,
        ct: wrapped.ciphertext,
        sap: record.identityAgreementPub,
      };
    } catch (e) {
      console.warn('[e2e] inline wrap failed for', deviceId, e);
      return null;
    }
  }))).filter(Boolean);

  const byDid = new Map();
  wraps.forEach((w) => byDid.set(String(w.did), w));
  fresh.forEach((w) => byDid.set(String(w.did), w));
  wraps = peerIds.map((id) => byDid.get(id)).filter(Boolean);

  if (wraps.length) {
    wrapsCache.set(cacheKey, { wraps, at: Date.now() });
  }
  if (wraps.length < peerIds.length) {
    console.warn('[e2e] wraps incomplete', {
      conversationId,
      kid,
      peers: peerIds.length,
      wraps: wraps.length,
    });
  }
  return { wraps, omitted: false };
  })();

  wrapsBuildInflight.set(inflightKey, work);
  try {
    return await work;
  } finally {
    if (wrapsBuildInflight.get(inflightKey) === work) {
      wrapsBuildInflight.delete(inflightKey);
    }
  }
}

/** In-memory wraps only. Null means the send must not wait on the network. */
export function peekInlineKeyWraps(conversationId, kid) {
  const cacheKey = `${String(conversationId)}:${Number(kid)}`;
  const cached = wrapsCache.get(cacheKey);
  if (!cached || (Date.now() - cached.at) >= WRAPS_TTL_MS) return null;
  if (cached.noPeers) return { wraps: [], noPeers: true };
  if (Array.isArray(cached.wraps) && cached.wraps.length) {
    return { wraps: cached.wraps, noPeers: false };
  }
  return null;
}

/** Fill wraps + key packages off the send path. Never awaited by encrypt. */
export function scheduleInlineKeyWraps(conversationId, kid, keyBytes) {
  buildInlineKeyWraps(conversationId, kid, keyBytes, { forceBundles: false }).catch(() => {});
  distributeConversationKeyToBundles(
    conversationId,
    Number(kid),
    keyBytes,
    { force: false },
  ).catch(() => {});
}

/**
 * Unwrap any e2e.wraps entry addressed to this device and store the key.
 * @returns {Promise<boolean>} true if at least one wrap was ingested
 */
export async function ingestInlineKeyWraps(conversationId, kid, wraps) {
  if (!Array.isArray(wraps) || !wraps.length) return false;

  let record = await getDeviceRecord();
  if (!record) {
    await ensureDevice().catch(() => {});
    record = await getDeviceRecord();
  }
  if (!record) return false;

  const myDeviceId = String(record.deviceId || '');
  const mine = wraps.filter((w) => {
    if (!w?.did) return true;
    return String(w.did) === myDeviceId;
  });
  if (!mine.length) return false;

  let ingested = false;

  // eslint-disable-next-line no-restricted-syntax
  for (const w of mine) {
    if (!w?.iv || !w?.ct || !w?.sap) continue;
    try {
      // eslint-disable-next-line no-await-in-loop
      const senderPub = await importAgreementPublicKey(w.sap);
      // Try identity + signed prekey (wraps may target either).
      // eslint-disable-next-line no-await-in-loop
      const privKeys = await collectUnwrapPrivateKeys(record, null, false);
      let keyBytes = null;
      // eslint-disable-next-line no-restricted-syntax
      for (const recipientPrivateKey of privKeys) {
        // eslint-disable-next-line no-restricted-syntax
        for (const info of wrapInfoVariants(conversationId, kid)) {
          try {
            // eslint-disable-next-line no-await-in-loop
            keyBytes = await unwrapKeyFromSender({
              recipientAgreementPrivateKey: recipientPrivateKey,
              senderAgreementPublicKey: senderPub,
              wrappedIvB64: w.iv,
              wrappedCiphertextB64: w.ct,
              info,
            });
            break;
          } catch {
            /* try next */
          }
        }
        if (keyBytes) break;
      }
      if (!keyBytes) continue;
      // eslint-disable-next-line no-await-in-loop
      await persistUnwrappedConversationKey(conversationId, kid, keyBytes);
      ingested = true;
    } catch (e) {
      console.warn('[e2e] ingest inline wrap failed', e);
    }
  }
  return ingested;
}

async function consumePackage(pkg, record) {
  const conversationId = pkg.conversation_id ?? pkg.conversationId;
  const kid = Number(pkg.key_version ?? pkg.kid);

  let payload;
  try {
    payload = typeof pkg.ciphertext === 'string' ? JSON.parse(pkg.ciphertext) : pkg.ciphertext;
  } catch (e) {
    throw new Error('Malformed package ciphertext');
  }
  const {
    iv,
    ct,
    prekey_id: prekeyId,
    use_signed_prekey: useSignedPrekey,
    sender_agreement_pub: senderAgreementPubInline,
  } = payload || {};
  if (!iv || !ct) throw new Error('Package missing iv/ct');

  let senderAgreementPubB64 = senderAgreementPubInline;
  if (!senderAgreementPubB64) {
    const bundlesRes = await getConversationBundles(conversationId).catch(() => null);
    const bundles = bundlesRes?.devices || bundlesRes?.bundles || [];
    const senderDeviceId = pkg.sender_device_id ?? pkg.senderDeviceId;
    const senderBundle = bundles.find((b) => (b.device_id ?? b.deviceId) === senderDeviceId);
    senderAgreementPubB64 = senderBundle?.identity_agreement_public_key;
  }
  if (!senderAgreementPubB64) throw new Error('Unable to resolve sender agreement key');

  const senderPub = await importAgreementPublicKey(senderAgreementPubB64);
  const privKeys = await collectUnwrapPrivateKeys(record, prekeyId, !!useSignedPrekey);
  let keyBytes = null;
  let lastErr = null;
  // eslint-disable-next-line no-restricted-syntax
  for (const recipientPrivateKey of privKeys) {
    // eslint-disable-next-line no-restricted-syntax
    for (const info of wrapInfoVariants(conversationId, kid)) {
      try {
        // eslint-disable-next-line no-await-in-loop
        keyBytes = await unwrapKeyFromSender({
          recipientAgreementPrivateKey: recipientPrivateKey,
          senderAgreementPublicKey: senderPub,
          wrappedIvB64: iv,
          wrappedCiphertextB64: ct,
          info,
        });
        break;
      } catch (e) {
        lastErr = e;
      }
    }
    if (keyBytes) break;
  }
  if (!keyBytes) throw lastErr || new Error('Unwrap failed');

  await persistUnwrappedConversationKey(conversationId, kid, keyBytes);
  if (prekeyId != null && prekeyId !== '') {
    await markPrekeyUsed(Number(prekeyId)).catch(() => {});
  }
}

export async function getConversationKeyBytes(conversationId, kid) {
  const row = await getConversationKey(conversationId, Number(kid));
  return row?.keyB64 ? b64Decode(row.keyB64) : null;
}

export async function forceRedistributeConversationKey(conversationId) {
  const key = String(conversationId);

  await ensureDevice();
  await pullAndConsumePackages(conversationId, { bypassCooldown: true });

  let rows = await listConversationKeys(conversationId);
  if (!rows.length) {
    // Do NOT mark done — a later key_request / device_added must retry.
    return false;
  }

  // Prefer unique kids (primary rows first); cover history after key rotation.
  const byKid = new Map();
  rows.forEach((r) => {
    if (!r?.keyB64) return;
    const kid = Number(r.kid);
    if (!Number.isFinite(kid)) return;
    if (!byKid.has(kid) || !r.isAlt) byKid.set(kid, r);
  });
  const kids = [...byKid.keys()].sort((a, b) => b - a);
  if (!kids.length) return false;

  await clearDistributedForConversation(conversationId);
  invalidateBundlesCache(conversationId);

  let anyOk = false;
  // eslint-disable-next-line no-restricted-syntax
  for (const kid of kids) {
    const row = byKid.get(kid);
    if (!row?.keyB64) continue;
    try {
      // eslint-disable-next-line no-await-in-loop
      await distributeConversationKeyToBundles(
        conversationId,
        kid,
        b64Decode(row.keyB64),
        { force: true },
      );
      anyOk = true;
    } catch (e) {
      console.warn('[e2e] force redistribute failed', conversationId, kid, e);
    }
  }

  if (anyOk) {
    forceRedistributeDone.add(key);
    const latest = byKid.get(kids[0]);
    if (latest?.keyB64) {
      readyKeyCache.set(key, {
        keyBytes: b64Decode(latest.keyB64),
        kid: Number(latest.kid),
        at: Date.now(),
      });
      // Keep vault fresh whenever we redistribute to siblings/peers.
      ensureLatestKeyInVault(conversationId).catch(() => {});
    }
  }
  return anyOk;
}

/**
 * Allow a later redistribute attempt for this conversation (e.g. after a new
 * sibling device registers). Clears the one-shot guard from forceRedistribute.
 */
export function clearForceRedistributeGuard(conversationId = null) {
  if (conversationId == null) {
    forceRedistributeDone.clear();
    return;
  }
  forceRedistributeDone.delete(String(conversationId));
}

/**
 * Warm IndexedDB key + wraps caches so the next send encrypts in-memory only.
 * Fire-and-forget from chat open — never block the UI.
 * Never mints a key: if packages have not arrived yet, wait for redistribute.
 */
export async function prewarmConversationCrypto(conversationId) {
  if (conversationId == null) return false;
  try {
    const cacheKey = String(conversationId);
    const cached = readyKeyCache.get(cacheKey);
    // Already in memory: do not touch /packages, /vault, or /bundles.
    if (cached && (Date.now() - cached.at) < READY_KEY_TTL_MS) {
      if (!peekInlineKeyWraps(conversationId, cached.kid)) {
        scheduleInlineKeyWraps(conversationId, cached.kid, cached.keyBytes);
      }
      return true;
    }
    let keyBytes;
    let kid;
    try {
      ({ keyBytes, kid } = await ensureConversationKey(conversationId, { allowMint: false }));
    } catch (e) {
      if (String(e?.message || e) === 'missing-conversation-key') {
        return false;
      }
      throw e;
    }
    if (!peekInlineKeyWraps(conversationId, kid)) {
      scheduleInlineKeyWraps(conversationId, kid, keyBytes);
    }
    return true;
  } catch (e) {
    if (String(e?.message || e) !== 'missing-conversation-key') {
      console.warn('[e2e] prewarm failed', e);
    }
    return false;
  }
}

/**
 * Multi-device login key sync: vault → packages → (caller issues key-requests).
 * Returns how many vault keys were recovered.
 */
export async function syncKeysAfterLogin({ bypassCooldown = true } = {}) {
  await ensureDevice();
  let vaultN = 0;
  try {
    vaultN = await pullAndConsumeKeyVault(null, { force: true });
  } catch (e) {
    console.warn('[e2e] login vault sync failed', e?.message || e);
  }
  try {
    await pullAndConsumePackages(null, { bypassCooldown });
  } catch (e) {
    console.warn('[e2e] login package sync failed', e?.message || e);
  }
  // Maintain vault for siblings we already hold keys for.
  uploadAllLocalKeysToVault().catch(() => {});
  return vaultN;
}

// Re-export vault helpers used by the store.
export {
  pullAndConsumeKeyVault,
  uploadAllLocalKeysToVault,
  uploadConversationKeyToVault,
  ensureLatestKeyInVault,
};
