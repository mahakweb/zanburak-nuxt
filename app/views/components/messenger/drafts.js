/**
 * Per-chat composer drafts stored locally (Telegram-style).
 * Keyed by conversation id in localStorage — never sent to the server.
 */

const STORAGE_KEY = 'messenger_composer_drafts';

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (e) {
    return {};
  }
}

function writeAll(map) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map || {}));
  } catch (e) {
    /* quota / private mode */
  }
}

export function loadAllDrafts() {
  return readAll();
}

export function getDraft(conversationId) {
  if (conversationId == null || conversationId === 'draft') return '';
  const entry = readAll()[String(conversationId)];
  return typeof entry?.text === 'string' ? entry.text : '';
}

export function saveDraft(conversationId, text) {
  if (conversationId == null || conversationId === 'draft') return;
  const id = String(conversationId);
  const trimmed = String(text || '');
  const all = readAll();
  if (!trimmed.trim()) {
    if (all[id]) {
      delete all[id];
      writeAll(all);
    }
    return;
  }
  all[id] = { text: trimmed, updated_at: new Date().toISOString() };
  writeAll(all);
}

export function clearDraft(conversationId) {
  saveDraft(conversationId, '');
}
