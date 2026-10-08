import { extractPhonesFromCsv, extractPhonesFromVcard, normalizeIranMobile } from '@/utils/messengerPhone';

const SYNC_STORAGE_KEY = 'messenger_contact_sync_v1';
const ONBOARDING_SKIP_KEY = 'messenger_contact_onboarding_skipped_v1';
const SYNC_INTERVAL_MS = 12 * 60 * 60 * 1000; // 12 hours

/** Contact Picker API (Chrome Android / supported Chromium browsers over HTTPS). */
export function contactPickerSupported() {
  try {
    return typeof navigator !== 'undefined'
      && !!navigator.contacts
      && typeof navigator.contacts.select === 'function';
  } catch {
    return false;
  }
}

/**
 * Request device contacts via Contact Picker API (Telegram-like device sync).
 * Requires a user gesture and usually a secure context (HTTPS / localhost).
 * @returns {Promise<Array<{name: string, phone: string}>>}
 */
export async function pickDeviceContacts() {
  if (!contactPickerSupported()) {
    throw new Error('unsupported');
  }
  const props = ['name', 'tel'];
  const opts = { multiple: true };
  const contacts = await navigator.contacts.select(props, opts);
  const out = [];
  for (const c of contacts || []) {
    const name = Array.isArray(c.name) ? (c.name[0] || '') : (c.name || '');
    const tels = Array.isArray(c.tel) ? c.tel : (c.tel ? [c.tel] : []);
    for (const tel of tels) {
      const raw = typeof tel === 'string' ? tel : (tel?.value || String(tel || ''));
      const phone = normalizeIranMobile(raw);
      if (phone) out.push({ name: String(name || phone).trim(), phone });
    }
  }
  return dedupeContacts(out);
}

export async function parseContactFile(file) {
  const text = await file.text();
  const name = (file.name || '').toLowerCase();
  let entries = [];
  if (name.endsWith('.vcf') || text.includes('BEGIN:VCARD')) {
    entries = extractPhonesFromVcard(text);
  } else {
    entries = extractPhonesFromCsv(text);
  }
  return dedupeContacts(entries);
}

export function dedupeContacts(list) {
  const map = new Map();
  for (const row of list || []) {
    if (!row?.phone) continue;
    const phone = normalizeIranMobile(row.phone) || row.phone;
    const name = (row.name || phone).trim();
    if (!map.has(phone) || (map.get(phone).name === phone && name !== phone)) {
      map.set(phone, { name, phone });
    }
  }
  return [...map.values()];
}

export function loadSyncCache() {
  try {
    const raw = localStorage.getItem(SYNC_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSyncCache(payload) {
  try {
    localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify({
      ...payload,
      saved_at: Date.now(),
    }));
  } catch {
    /* quota */
  }
}

/** True when we should re-upload / refresh registration status. */
export function shouldPeriodicSync() {
  const cache = loadSyncCache();
  if (!cache?.saved_at) return true;
  return Date.now() - cache.saved_at >= SYNC_INTERVAL_MS;
}

export function contactsFromCache() {
  const cache = loadSyncCache();
  return Array.isArray(cache?.contacts) ? cache.contacts : [];
}

/** True when the user has synced/imported an address book (or cache remains). */
export function hasImportedContacts(syncedContacts) {
  const registered = syncedContacts?.registered?.length || 0;
  const inviteable = syncedContacts?.inviteable?.length || 0;
  if (registered + inviteable > 0) return true;
  return contactsFromCache().length > 0;
}

export function isContactOnboardingSkipped() {
  try {
    return localStorage.getItem(ONBOARDING_SKIP_KEY) === '1';
  } catch {
    return false;
  }
}

export function skipContactOnboarding() {
  try {
    localStorage.setItem(ONBOARDING_SKIP_KEY, '1');
  } catch {
    /* quota */
  }
}

export function clearContactOnboardingSkip() {
  try {
    localStorage.removeItem(ONBOARDING_SKIP_KEY);
  } catch {
    /* noop */
  }
}
