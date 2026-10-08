/**
 * Consistent online / last-seen labels across chat, profile, and side panels.
 * Backend already applies privacy; null last_seen + offline → "recently".
 */
export function formatLastSeenClock(iso, locale = 'fa-IR') {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString(locale, { month: 'long', day: 'numeric' });
}

/**
 * @param {object|null} user  { is_online, last_seen }
 * @param {(key: string, params?: object) => string} t
 * @param {{ locale?: string, exact?: boolean }} [opts]
 */
export function formatPresenceText(user, t, opts = {}) {
  if (!user) return '';
  if (user.is_online) return t('messenger.online');
  if (user.last_seen) {
    if (opts.exact === false) return t('messenger.lastSeenRecently');
    const time = formatLastSeenClock(user.last_seen, opts.locale || 'fa-IR');
    if (!time) return t('messenger.lastSeenRecently');
    return t('messenger.lastSeenAt', { time });
  }
  return t('messenger.lastSeenRecently');
}

export function isUserOnline(user) {
  return !!user?.is_online;
}
