/** Shared avatar initials: first + last letter with a space (e.g. "م س", "J D"). */

export function firstLetter(str) {
  const s = String(str || '').trim();
  if (!s) return '';
  const m = s.match(/[\p{L}\p{N}]/u);
  return m ? m[0] : s.charAt(0);
}

/**
 * @param {object|string|null} userOrName - user-like object or a display name string
 * @param {string} [nameFallback]
 */
export function avatarInitials(userOrName, nameFallback = '') {
  let first = '';
  let last = '';
  let fallback = '';

  if (userOrName && typeof userOrName === 'object') {
    const u = userOrName;
    first = String(u.first_name || '').trim();
    last = String(u.last_name || '').trim();
    const name = String(u.name || nameFallback || '').trim();
    if (!first && name) {
      const parts = name.split(/\s+/).filter(Boolean);
      first = parts[0] || '';
      if (parts.length >= 2) last = parts[parts.length - 1];
    }
    fallback = name || u.username || u.name || nameFallback || '?';
  } else {
    const name = String(userOrName || nameFallback || '').trim();
    const parts = name.split(/\s+/).filter(Boolean);
    first = parts[0] || '';
    if (parts.length >= 2) last = parts[parts.length - 1];
    fallback = name || '?';
  }

  const a = firstLetter(first);
  const b = firstLetter(last);
  if (a && b) return `${a} ${b}`.toUpperCase();
  if (a) {
    const rest = firstLetter(String(first).trim().slice(1));
    if (rest) return `${a} ${rest}`.toUpperCase();
    return a.toUpperCase();
  }
  const fb = String(fallback).trim();
  const c0 = firstLetter(fb);
  const c1 = firstLetter(fb.slice(1));
  if (c0 && c1) return `${c0} ${c1}`.toUpperCase();
  return (c0 || '?').toUpperCase();
}
