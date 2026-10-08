/**
 * Human-verifiable safety number between two users' User Identity Keys.
 *
 * MUST be based on account-level User Identity — not Device Keys — so adding
 * Chrome/Mobile/another browser does not change the Security Code.
 */
import { b64Decode, concatBytes, toHex } from './bytes';
import { getUserIdentityRecord } from './store';
import { getSafetyNumberMaterial } from '@/services/messenger';
import { ensureUserIdentity, getMyUserIdentityPublicKeys } from './identity';

function bytesLexCompare(a, b) {
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i += 1) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return a.length - b.length;
}

function safetyStorageKey(userId) {
  return `zanburak_e2e_safety_${Number(userId)}`;
}

function utf8ish(str) {
  return new TextEncoder().encode(str);
}

export async function computeSafetyNumberFromKeys(myAgreementPubB64, theirAgreementPubB64) {
  const a = b64Decode(myAgreementPubB64);
  const b = b64Decode(theirAgreementPubB64);
  const [first, second] = bytesLexCompare(a, b) <= 0 ? [a, b] : [b, a];
  const combined = concatBytes(first, second);

  let digest = new Uint8Array(await crypto.subtle.digest('SHA-256', combined));
  for (let i = 0; i < 16; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    digest = new Uint8Array(await crypto.subtle.digest('SHA-256', concatBytes(digest, combined)));
  }

  const groups = [];
  for (let i = 0; i < 12; i += 1) {
    const hi = digest[(i * 2) % digest.length];
    const lo = digest[(i * 2 + 1) % digest.length];
    const value = (hi * 256 + lo) % 100000;
    groups.push(String(value).padStart(5, '0'));
  }
  return groups.join(' ');
}

export function fingerprintHex(agreementPubB64) {
  return toHex(b64Decode(agreementPubB64)).slice(0, 16);
}

export async function getMySafetyNumberInputs() {
  await ensureUserIdentity();
  const mine = await getMyUserIdentityPublicKeys();
  if (mine?.agreementPub) {
    return { agreementPub: mine.agreementPub, signingPub: mine.signingPub };
  }
  const record = await getUserIdentityRecord();
  if (!record?.agreementPub) return null;
  return { agreementPub: record.agreementPub, signingPub: record.signingPub };
}

function extractAgreementFromMaterialKey(k) {
  try {
    if (typeof k === 'string' && k.trim().startsWith('{')) {
      const parsed = JSON.parse(k);
      return parsed.agreement || parsed.signing || k;
    }
  } catch {
    // fall through
  }
  return k;
}

function extractRemoteAgreementKeys(material) {
  // Prefer explicit user-identity fields from the redesigned API.
  if (material?.remote_user_identity?.agreement_public) {
    return [material.remote_user_identity.agreement_public];
  }
  const keys = material?.remote_identity_keys || [];
  return keys.map(extractAgreementFromMaterialKey).filter(Boolean);
}

function extractLocalAgreementKeys(material) {
  if (material?.local_user_identity?.agreement_public) {
    return [material.local_user_identity.agreement_public];
  }
  const keys = material?.local_identity_keys || [];
  return keys.map(extractAgreementFromMaterialKey).filter(Boolean);
}

async function remoteFingerprint(remotes) {
  const sorted = remotes.slice().sort();
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', utf8ish(sorted.join('|'))));
  return toHex(digest).slice(0, 32);
}

export async function computeSafetyNumber(otherUserId) {
  if (typeof otherUserId === 'string' && arguments.length >= 2 && typeof arguments[1] === 'string') {
    const display = await computeSafetyNumberFromKeys(otherUserId, arguments[1]);
    return {
      display, digits: display.split(' '), localCount: 1, remoteCount: 1, changed: false,
    };
  }

  await ensureUserIdentity();
  const material = await getSafetyNumberMaterial(Number(otherUserId));
  let locals = extractLocalAgreementKeys(material);
  const remotes = extractRemoteAgreementKeys(material);
  if (!locals.length) {
    const mine = await getMySafetyNumberInputs();
    if (mine?.agreementPub) locals = [mine.agreementPub];
  }
  if (!remotes.length) {
    return {
      display: '',
      digits: [],
      localCount: locals.length || 1,
      remoteCount: 0,
      changed: false,
      usesUserIdentity: !!material?.uses_user_identity,
    };
  }

  // One stable key per user (User Identity). Sort is defensive for legacy
  // multi-key payloads during migration.
  const myCanon = locals.slice().sort()[0];
  const theirCanon = remotes.slice().sort()[0];
  const flat = await computeSafetyNumberFromKeys(myCanon, theirCanon);
  const digits = flat.split(' ');
  // Fingerprint only the user-identity pair — device membership must not flag "changed".
  const fp = await remoteFingerprint([myCanon, theirCanon]);
  const storageKey = safetyStorageKey(otherUserId);
  let changed = false;
  try {
    const prev = localStorage.getItem(storageKey);
    if (prev && prev !== fp) changed = true;
    localStorage.setItem(storageKey, fp);
  } catch {
    /* ignore */
  }

  return {
    display: digits.reduce((rows, d, i) => {
      const row = Math.floor(i / 4);
      if (!rows[row]) rows[row] = [];
      rows[row].push(d);
      return rows;
    }, []).map((r) => r.join(' ')).join('\n'),
    digits,
    localCount: 1,
    remoteCount: 1,
    changed,
    fingerprint: fp,
    usesUserIdentity: !!material?.uses_user_identity,
  };
}

export async function computeSafetyNumberForUser(userId) {
  return computeSafetyNumber(userId);
}

export function markSafetyNumberVerified(userId, fingerprint) {
  if (!fingerprint) return;
  try {
    localStorage.setItem(safetyStorageKey(userId), fingerprint);
  } catch {
    /* ignore */
  }
}
