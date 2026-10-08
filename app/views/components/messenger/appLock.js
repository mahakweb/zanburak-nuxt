/**
 * Device-local messenger screen lock (Telegram-style passcode + optional WebAuthn biometrics).
 * Passcode never leaves the device; only a PBKDF2 hash is stored in localStorage.
 */
import { b64Encode, b64Decode, randomBytes, utf8Encode } from '@/crypto/messenger/bytes';

const STORAGE_KEY = 'zanburak_messenger_app_lock_v1';
const PIN_LENGTH = 4;
const PBKDF2_ITERATIONS = 210000;

/** Auto-lock delays in seconds. 0 = immediately when leaving; null = disabled. */
export const AUTO_LOCK_OPTIONS = [
  { value: null, labelKey: 'messenger.autoLockDisabled' },
  { value: 0, labelKey: 'messenger.autoLockImmediate' },
  { value: 60, labelKey: 'messenger.autoLock1m' },
  { value: 300, labelKey: 'messenger.autoLock5m' },
  { value: 3600, labelKey: 'messenger.autoLock1h' },
  { value: 18000, labelKey: 'messenger.autoLock5h' },
];

export { PIN_LENGTH };

const listeners = new Set();

/** @type {{ enabled: boolean, salt: string, hash: string, autoLockSeconds: number|null, biometricEnabled: boolean, credentialId: string|null, userHandle: string } | null} */
let cached = null;
let unlocked = false;
/** Timestamp when the document last became hidden (for away-based auto-lock). */
let hiddenAt = null;

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.enabled || !parsed?.salt || !parsed?.hash) return null;
    return {
      enabled: true,
      salt: parsed.salt,
      hash: parsed.hash,
      autoLockSeconds: Object.prototype.hasOwnProperty.call(parsed, 'autoLockSeconds')
        ? parsed.autoLockSeconds
        : 60,
      biometricEnabled: !!parsed.biometricEnabled,
      credentialId: parsed.credentialId || null,
      userHandle: parsed.userHandle || null,
    };
  } catch {
    return null;
  }
}

function writeStored(meta) {
  if (!meta) {
    localStorage.removeItem(STORAGE_KEY);
    cached = null;
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meta));
  cached = meta;
}

function getMeta() {
  if (cached === null) cached = readStored();
  return cached;
}

function notify() {
  const snap = getLockSnapshot();
  listeners.forEach((fn) => {
    try { fn(snap); } catch { /* noop */ }
  });
}

export function getLockSnapshot() {
  const meta = getMeta();
  return {
    enabled: !!meta?.enabled,
    locked: !!(meta?.enabled && !unlocked),
    autoLockSeconds: meta?.autoLockSeconds ?? 60,
    biometricEnabled: !!(meta?.biometricEnabled && meta?.credentialId),
    hasCredential: !!meta?.credentialId,
  };
}

export function subscribeAppLock(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function isAppLockEnabled() {
  return !!getMeta()?.enabled;
}

export function isAppLocked() {
  return isAppLockEnabled() && !unlocked;
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function derivePinHash(pin, saltBytes) {
  const base = await crypto.subtle.importKey('raw', utf8Encode(String(pin)), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: saltBytes, iterations: PBKDF2_ITERATIONS },
    base,
    256,
  );
  return new Uint8Array(bits);
}

export function normalizePin(value) {
  return String(value || '').replace(/\D/g, '').slice(0, PIN_LENGTH);
}

export function isValidPin(pin) {
  return /^\d{4}$/.test(String(pin || ''));
}

/**
 * Enable passcode lock with a new PIN. Leaves the session unlocked.
 */
export async function enableAppLock(pin) {
  if (!isValidPin(pin)) throw new Error('invalid_pin');
  const salt = randomBytes(16);
  const hash = await derivePinHash(pin, salt);
  const meta = {
    enabled: true,
    salt: b64Encode(salt),
    hash: b64Encode(hash),
    autoLockSeconds: 60,
    biometricEnabled: false,
    credentialId: null,
    userHandle: b64Encode(randomBytes(16)),
  };
  writeStored(meta);
  unlocked = true;
  hiddenAt = null;
  notify();
  return getLockSnapshot();
}

export async function changeAppLockPin(currentPin, nextPin) {
  if (!(await verifyAppLockPin(currentPin))) throw new Error('wrong_pin');
  if (!isValidPin(nextPin)) throw new Error('invalid_pin');
  const meta = getMeta();
  if (!meta) throw new Error('not_enabled');
  const salt = randomBytes(16);
  const hash = await derivePinHash(nextPin, salt);
  writeStored({
    ...meta,
    salt: b64Encode(salt),
    hash: b64Encode(hash),
  });
  unlocked = true;
  notify();
  return getLockSnapshot();
}

export async function disableAppLock(pin) {
  if (!(await verifyAppLockPin(pin))) throw new Error('wrong_pin');
  writeStored(null);
  unlocked = false;
  hiddenAt = null;
  notify();
  return getLockSnapshot();
}

export async function verifyAppLockPin(pin) {
  const meta = getMeta();
  if (!meta?.enabled) return false;
  if (!isValidPin(pin)) return false;
  const derived = await derivePinHash(pin, b64Decode(meta.salt));
  const expected = b64Decode(meta.hash);
  return timingSafeEqual(derived, expected);
}

export async function unlockWithPin(pin) {
  const ok = await verifyAppLockPin(pin);
  if (!ok) return false;
  unlocked = true;
  hiddenAt = null;
  notify();
  return true;
}

export function lockAppNow() {
  if (!isAppLockEnabled()) return;
  unlocked = false;
  notify();
}

export function setAutoLockSeconds(seconds) {
  const meta = getMeta();
  if (!meta?.enabled) return getLockSnapshot();
  const allowed = AUTO_LOCK_OPTIONS.some((o) => o.value === seconds);
  if (!allowed) return getLockSnapshot();
  writeStored({ ...meta, autoLockSeconds: seconds });
  notify();
  return getLockSnapshot();
}

/** Call when document becomes hidden / visible. */
export function onAppLockVisibilityChange(hidden) {
  if (!isAppLockEnabled()) return;
  if (hidden) {
    hiddenAt = Date.now();
    const meta = getMeta();
    if (meta?.autoLockSeconds === 0 && unlocked) {
      unlocked = false;
      notify();
    }
    return;
  }
  // Became visible again
  if (!unlocked && isAppLockEnabled()) {
    notify();
    return;
  }
  const meta = getMeta();
  const delay = meta?.autoLockSeconds;
  if (delay == null || delay === 0) {
    hiddenAt = null;
    return;
  }
  if (hiddenAt != null && Date.now() - hiddenAt >= delay * 1000) {
    unlocked = false;
    notify();
  }
  hiddenAt = null;
}

export async function isBiometricAvailable() {
  try {
    if (typeof window === 'undefined' || !window.PublicKeyCredential) return false;
    const PK = window.PublicKeyCredential;
    if (typeof PK.isUserVerifyingPlatformAuthenticatorAvailable !== 'function') {
      return false;
    }
    return !!(await PK.isUserVerifyingPlatformAuthenticatorAvailable());
  } catch {
    return false;
  }
}

/**
 * Best-effort UI hint for which biometric icon to show.
 * WebAuthn does not expose Face vs Fingerprint; we infer from platform.
 * @returns {'face'|'fingerprint'}
 */
export function detectBiometricKind() {
  if (typeof navigator === 'undefined') return 'fingerprint';
  const ua = navigator.userAgent || '';
  const platform = navigator.platform || '';
  // Modern iPhone / iPad → Face ID
  if (/iPhone/i.test(ua) || (/iPad/i.test(ua) && !/Macintosh/i.test(platform))) return 'face';
  // iPadOS 13+ may report as Mac — treat touch-capable Macs as fingerprint (Touch ID)
  if (/Macintosh|Mac OS X/i.test(ua)) {
    // iPadOS desktop UA: MacIntel + touch points
    if (navigator.maxTouchPoints > 1) return 'face';
    return 'fingerprint';
  }
  // Windows Hello often presents as face camera on modern laptops
  if (/Windows NT/i.test(ua)) return 'face';
  // Android / others → fingerprint is the common app icon
  return 'fingerprint';
}

function bufferToB64(buf) {
  return b64Encode(buf instanceof ArrayBuffer ? new Uint8Array(buf) : buf);
}

function b64ToBuffer(b64) {
  return b64Decode(b64).buffer;
}

/**
 * Register a platform authenticator (Face ID / fingerprint / Windows Hello).
 * Requires an unlocked session and an enabled passcode.
 */
export async function enableBiometric() {
  const meta = getMeta();
  if (!meta?.enabled) throw new Error('not_enabled');
  if (!unlocked) throw new Error('locked');
  if (!(await isBiometricAvailable())) throw new Error('unavailable');

  const userHandle = meta.userHandle ? b64Decode(meta.userHandle) : randomBytes(16);
  const challenge = randomBytes(32);
  const credential = await navigator.credentials.create({
    publicKey: {
      challenge,
      rp: {
        name: 'Zanburak Messenger',
        id: window.location.hostname,
      },
      user: {
        id: userHandle,
        name: 'messenger-lock',
        displayName: 'Messenger Lock',
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },
        { type: 'public-key', alg: -257 },
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
        residentKey: 'preferred',
      },
      timeout: 60000,
      attestation: 'none',
    },
  });

  if (!credential?.rawId) throw new Error('cancelled');

  writeStored({
    ...meta,
    userHandle: b64Encode(userHandle),
    credentialId: bufferToB64(credential.rawId),
    biometricEnabled: true,
  });
  notify();
  return getLockSnapshot();
}

export async function disableBiometric() {
  const meta = getMeta();
  if (!meta?.enabled) return getLockSnapshot();
  writeStored({
    ...meta,
    biometricEnabled: false,
    credentialId: null,
  });
  notify();
  return getLockSnapshot();
}

/**
 * Prompt platform authenticator. Returns true on success.
 */
export async function unlockWithBiometric() {
  const meta = getMeta();
  if (!meta?.enabled || !meta.biometricEnabled || !meta.credentialId) {
    throw new Error('unavailable');
  }
  if (!(await isBiometricAvailable())) throw new Error('unavailable');

  const challenge = randomBytes(32);
  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge,
      timeout: 60000,
      userVerification: 'required',
      rpId: window.location.hostname,
      allowCredentials: [
        {
          type: 'public-key',
          id: b64ToBuffer(meta.credentialId),
          transports: ['internal'],
        },
      ],
    },
  });

  if (!assertion) throw new Error('cancelled');
  unlocked = true;
  hiddenAt = null;
  notify();
  return true;
}
