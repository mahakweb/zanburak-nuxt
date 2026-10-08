/**
 * Build shareable messenger invite / public links (Telegram-style).
 */

export function messengerOrigin() {
  if (typeof window === 'undefined') return '';
  return window.location.origin;
}

/** Full invite URL: https://app/messenger/join/CODE */
export function inviteLinkUrl(code) {
  const c = String(code || '').trim().replace(/^.*\//, '');
  if (!c) return '';
  return `${messengerOrigin()}/messenger/join/${encodeURIComponent(c)}`;
}

/** Public community URL: https://app/messenger/@username */
export function publicCommunityUrl(username) {
  const u = String(username || '').trim().replace(/^@/, '');
  if (!u) return '';
  return `${messengerOrigin()}/messenger/@${encodeURIComponent(u)}`;
}

/** Public user profile URL: https://app/@username */
export function userProfileUrl(username) {
  const u = String(username || '').trim().replace(/^@/, '');
  if (!u) return '';
  return `${messengerOrigin()}/@${encodeURIComponent(u)}`;
}

/** Parse /messenger/join/X or /messenger/@user or bare code from pasted text. */
export function parseJoinTarget(raw) {
  const s = String(raw || '').trim();
  if (!s) return null;

  try {
    const url = new URL(s, messengerOrigin() || 'https://local');
    const path = url.pathname || '';
    const joinMatch = path.match(/\/messenger\/join\/([^/]+)\/?$/i);
    if (joinMatch) return { kind: 'invite', value: decodeURIComponent(joinMatch[1]) };
    const atMatch = path.match(/\/messenger\/@([^/]+)\/?$/i);
    if (atMatch) return { kind: 'username', value: decodeURIComponent(atMatch[1]) };
  } catch (e) { /* fall through */ }

  if (s.startsWith('@') || /^[a-zA-Z][a-zA-Z0-9_]{2,31}$/.test(s)) {
    return { kind: 'username', value: s.replace(/^@/, '') };
  }

  const code = s.replace(/^.*\//, '').trim();
  if (code.length >= 6) return { kind: 'invite', value: code };
  return null;
}

export async function copyText(text) {
  const value = String(text || '');
  if (!value) return false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch (e) { /* fallback */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = value;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch (e) {
    return false;
  }
}
