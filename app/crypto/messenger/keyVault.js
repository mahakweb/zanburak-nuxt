/**
 * Identity-wrapped conversation-key vault.
 *
 * Root cause this solves:
 *   New devices historically received conversation keys only via
 *   (1) online sibling redistribute on e2e.device_added, or
 *   (2) inline wraps on the next message.
 *   If siblings were offline, history stayed locked until someone sent.
 *
 * Fix:
 *   Every device that holds a conversation key also uploads an opaque vault
 *   entry wrapped to the account User Identity agreement key. A newly
 *   authorized device that has (or receives) User Identity privates can pull
 *   the vault and decrypt historical messages immediately — no new message
 *   required, and no online sibling required once the vault is populated.
 *
 * Server stores only opaque ciphertext.
 */
import { upsertKeyVault, pullKeyVault } from '@/services/messenger';
import {
  importAgreementPublicKey,
  importAgreementPrivateKey,
  wrapKeyForRecipient,
  unwrapKeyFromSender,
} from './keys';
import {
  getDeviceRecord,
  getUserIdentityRecord,
  getLatestConversationKey,
  listConversationKeys,
  listConversationIdsWithLocalKeys,
  saveConversationKey,
  saveConversationKeyAlternate,
  getConversationKey,
  reconcileConversationKeys,
} from './store';
import { ensureDevice, loadIdentityKeys } from './device';
import { b64Encode, b64Decode } from './bytes';
import { assertVaultUnlocked } from './vault';

const VAULT_WRAP_INFO_PREFIX = 'zanburak-e2e-conv-vault-v1';

const uploadInflight = new Map();
const uploadedMem = new Set(); // `${cid}:${kid}` recently uploaded
const pullInflight = new Map();
let lastPullAt = 0;

function vaultInfo(conversationId, kid) {
  return `${VAULT_WRAP_INFO_PREFIX}:${String(conversationId)}:${Number(kid)}`;
}

function vaultInfoVariants(conversationId, kid) {
  const k = Number(kid);
  return [...new Set([
    `${VAULT_WRAP_INFO_PREFIX}:${String(conversationId)}:${k}`,
    `${VAULT_WRAP_INFO_PREFIX}:${Number(conversationId)}:${k}`,
  ])];
}

function uploadKey(conversationId, kid) {
  return `${String(conversationId)}:${Number(kid)}`;
}

async function loadIdentityAgreementPublicB64() {
  const identity = await getUserIdentityRecord();
  if (identity?.agreementPub) return identity.agreementPub;
  return null;
}

async function loadIdentityAgreementPrivate() {
  const identity = await getUserIdentityRecord();
  if (!identity?.agreementPriv) return null;
  return importAgreementPrivateKey(identity.agreementPriv);
}

/**
 * Wrap one conversation key to the account User Identity and upload.
 * Fire-and-forget safe — failures are logged, never block send.
 */
export async function uploadConversationKeyToVault(conversationId, kid, keyBytes) {
  const memKey = uploadKey(conversationId, kid);
  if (uploadedMem.has(memKey)) return false;
  if (uploadInflight.has(memKey)) return uploadInflight.get(memKey);

  const work = (async () => {
    try {
      await ensureDevice();
      await assertVaultUnlocked();

      const record = await getDeviceRecord();
      if (!record?.deviceId || !record?.identityAgreementPub) {
        console.warn('[e2e] vault upload skipped — missing device', { conversationId, kid });
        return false;
      }

      const identityPubB64 = await loadIdentityAgreementPublicB64();
      if (!identityPubB64) {
        console.warn('[e2e] vault upload skipped — no user identity yet', { conversationId, kid });
        return false;
      }

      const { agreementPriv } = await loadIdentityKeys(record);
      const identityPub = await importAgreementPublicKey(identityPubB64);
      const wrapped = await wrapKeyForRecipient({
        senderAgreementPrivateKey: agreementPriv,
        recipientAgreementPublicKey: identityPub,
        keyBytesToWrap: keyBytes,
        info: vaultInfo(conversationId, kid),
      });

      const ciphertext = JSON.stringify({
        v: 1,
        type: 'conv_key_vault',
        iv: wrapped.iv,
        ct: wrapped.ciphertext,
        sap: record.identityAgreementPub,
        kid: Number(kid),
      });

      await upsertKeyVault({
        sender_device_id: record.deviceId,
        entries: [{
          conversation_id: Number(conversationId),
          key_version: Number(kid),
          ciphertext,
        }],
      });

      uploadedMem.add(memKey);
      console.info('[e2e] vault uploaded', { conversationId, kid });
      return true;
    } catch (e) {
      console.warn('[e2e] vault upload failed', { conversationId, kid, err: e?.message || e });
      return false;
    }
  })();

  uploadInflight.set(memKey, work);
  try {
    return await work;
  } finally {
    uploadInflight.delete(memKey);
  }
}

/** Upload every local conversation key we hold (sibling maintenance). */
export async function uploadAllLocalKeysToVault({ limit = 80 } = {}) {
  try {
    await ensureDevice();
    const ids = await listConversationIdsWithLocalKeys();
    const targets = (ids || []).slice(0, limit);
    let uploaded = 0;

    // eslint-disable-next-line no-restricted-syntax
    for (const cid of targets) {
      // eslint-disable-next-line no-await-in-loop
      const rows = await listConversationKeys(cid);
      const byKid = new Map();
      rows.forEach((r) => {
        if (!r?.keyB64) return;
        const kid = Number(r.kid);
        if (!Number.isFinite(kid)) return;
        if (!byKid.has(kid) || !r.isAlt) byKid.set(kid, r);
      });
      // eslint-disable-next-line no-restricted-syntax
      for (const [kid, row] of byKid) {
        // eslint-disable-next-line no-await-in-loop
        const ok = await uploadConversationKeyToVault(cid, kid, b64Decode(row.keyB64));
        if (ok) uploaded += 1;
      }
    }
    if (uploaded) {
      console.info('[e2e] vault bulk upload done', { uploaded, conversations: targets.length });
    }
    return uploaded;
  } catch (e) {
    console.warn('[e2e] vault bulk upload failed', e?.message || e);
    return 0;
  }
}

async function persistVaultKey(conversationId, kid, keyBytes) {
  const keyB64 = b64Encode(keyBytes);
  const existing = await getConversationKey(conversationId, kid);
  if (existing?.keyB64 && existing.keyB64 !== keyB64) {
    await saveConversationKeyAlternate(conversationId, kid, keyB64);
  } else {
    await saveConversationKey(conversationId, kid, keyB64, { overwrite: false });
  }
  await reconcileConversationKeys(conversationId, kid);
}

/**
 * Pull vault entries and unwrap with User Identity agreement private key.
 * @returns {Promise<number>} number of keys newly stored
 */
export async function pullAndConsumeKeyVault(conversationId = null, { force = false } = {}) {
  const cacheKey = conversationId == null ? '__all__' : String(conversationId);

  const existing = pullInflight.get(cacheKey);
  if (existing && !force) return existing;
  if (existing && force) {
    const n = await existing.catch(() => 0);
    if (n > 0) return n;
  }

  // Soft cooldown — bootstrap / heal may force.
  if (!force && Date.now() - lastPullAt < 8_000) {
    return 0;
  }

  const raced = pullInflight.get(cacheKey);
  if (raced && raced !== existing) return raced;

  const work = (async () => {
    try {
      await ensureDevice();
      await assertVaultUnlocked();

      const identityPriv = await loadIdentityAgreementPrivate();
      if (!identityPriv) {
        console.info('[e2e] vault pull deferred — user identity privates not ready');
        return 0;
      }

      const res = await pullKeyVault(conversationId);
      const entries = res?.entries || res?.data || [];
      if (!Array.isArray(entries) || !entries.length) {
        lastPullAt = Date.now();
        return 0;
      }

      let stored = 0;
      // eslint-disable-next-line no-restricted-syntax
      for (const entry of entries) {
        const cid = entry.conversation_id ?? entry.conversationId;
        const kid = Number(entry.key_version ?? entry.kid);
        if (cid == null || !Number.isFinite(kid) || kid < 1) continue;

        // Skip if we already hold this kid.
        // eslint-disable-next-line no-await-in-loop
        const have = await getConversationKey(cid, kid);
        if (have?.keyB64) {
          uploadedMem.add(uploadKey(cid, kid));
          continue;
        }

        let payload;
        try {
          payload = typeof entry.ciphertext === 'string'
            ? JSON.parse(entry.ciphertext)
            : entry.ciphertext;
        } catch {
          console.warn('[e2e] vault entry malformed', { cid, kid, id: entry.id });
          continue;
        }

        const iv = payload?.iv;
        const ct = payload?.ct || payload?.ciphertext;
        const sap = payload?.sap || payload?.sender_agreement_pub;
        if (!iv || !ct || !sap) {
          console.warn('[e2e] vault entry missing fields', { cid, kid, id: entry.id });
          continue;
        }

        try {
          // eslint-disable-next-line no-await-in-loop
          const senderPub = await importAgreementPublicKey(sap);
          let keyBytes = null;
          // eslint-disable-next-line no-restricted-syntax
          for (const info of vaultInfoVariants(cid, kid)) {
            try {
              // eslint-disable-next-line no-await-in-loop
              keyBytes = await unwrapKeyFromSender({
                recipientAgreementPrivateKey: identityPriv,
                senderAgreementPublicKey: senderPub,
                wrappedIvB64: iv,
                wrappedCiphertextB64: ct,
                info,
              });
              break;
            } catch {
              /* try next info variant */
            }
          }
          if (!keyBytes) {
            console.warn('[e2e] vault unwrap failed', { cid, kid, id: entry.id });
            continue;
          }
          // eslint-disable-next-line no-await-in-loop
          await persistVaultKey(cid, kid, keyBytes);
          uploadedMem.add(uploadKey(cid, kid));
          stored += 1;
        } catch (e) {
          console.warn('[e2e] vault consume failed', { cid, kid, err: e?.message || e });
        }
      }

      lastPullAt = Date.now();
      if (stored) {
        console.info('[e2e] vault keys recovered', { stored, total: entries.length });
      }
      return stored;
    } catch (e) {
      console.warn('[e2e] vault pull failed', e?.message || e);
      return 0;
    }
  })();

  pullInflight.set(cacheKey, work);
  try {
    return await work;
  } finally {
    if (pullInflight.get(cacheKey) === work) pullInflight.delete(cacheKey);
  }
}

/**
 * Ensure the latest local key for a conversation is also in the vault.
 * Used after mint / consume / redistribute.
 */
export async function ensureLatestKeyInVault(conversationId) {
  try {
    const latest = await getLatestConversationKey(conversationId);
    if (!latest?.keyB64) return false;
    return uploadConversationKeyToVault(
      conversationId,
      Number(latest.kid),
      b64Decode(latest.keyB64),
    );
  } catch (e) {
    console.warn('[e2e] ensureLatestKeyInVault failed', e?.message || e);
    return false;
  }
}

/** Clear upload memo (e.g. after identity rotate). */
export function clearVaultUploadCache() {
  uploadedMem.clear();
}
