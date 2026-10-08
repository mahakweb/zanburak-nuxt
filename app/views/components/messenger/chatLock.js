/**
 * Live evaluation of group/channel chat lock (mirrors Conversation::isChatLockedNow).
 * Do not rely on stale `chat_locked_now` from the API — schedule windows move.
 */

function pad2(n) {
  return String(n).padStart(2, '0');
}

/** Normalize "9:5" / "09:05:00" → "09:05" for lexicographic compare. */
export function normalizeHm(value) {
  if (value == null || value === '') return null;
  const m = String(value).trim().match(/^(\d{1,2}):(\d{1,2})/);
  if (!m) return null;
  const h = Math.min(23, Math.max(0, Number(m[1])));
  const min = Math.min(59, Math.max(0, Number(m[2])));
  return `${pad2(h)}:${pad2(min)}`;
}

/**
 * Wall-clock HH:mm (+ optional dayOfWeek 0=Sun..6=Sat) in a given IANA timezone.
 */
export function zonedClockParts(date, timeZone) {
  const d = date instanceof Date ? date : new Date(date);
  const tz = timeZone || 'UTC';
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'short',
      hourCycle: 'h23',
    }).formatToParts(d);
    const get = (type) => parts.find((p) => p.type === type)?.value;
    let hour = Number(get('hour'));
    if (Number.isNaN(hour)) hour = 0;
    if (hour === 24) hour = 0;
    const minute = Number(get('minute')) || 0;
    const wd = get('weekday');
    const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return {
      hm: `${pad2(hour)}:${pad2(minute)}`,
      dayOfWeek: map[wd] ?? d.getDay(),
    };
  } catch (e) {
    return {
      hm: `${pad2(d.getHours())}:${pad2(d.getMinutes())}`,
      dayOfWeek: d.getDay(),
    };
  }
}

export function isScheduleLockActive(schedule, date = new Date()) {
  if (!schedule || !schedule.enabled) return false;
  const start = normalizeHm(schedule.start);
  const end = normalizeHm(schedule.end);
  if (!start || !end) return false;

  const { hm: current, dayOfWeek } = zonedClockParts(date, schedule.timezone || 'Asia/Tehran');

  const days = schedule.days;
  if (Array.isArray(days) && days.length > 0) {
    const allowed = days.map((x) => Number(x));
    if (!allowed.includes(Number(dayOfWeek))) return false;
  }

  if (start <= end) {
    return current >= start && current < end;
  }
  // Overnight window (e.g. 22:00 → 08:00)
  return current >= start || current < end;
}

export function isChatLockedNow(conversation, date = new Date()) {
  if (!conversation) return false;
  const type = conversation.type;
  if (type !== 'group' && type !== 'channel') return false;

  if (conversation.messages_locked) return true;

  if (conversation.messages_locked_until) {
    const until = new Date(conversation.messages_locked_until);
    if (!Number.isNaN(until.getTime()) && until > date) return true;
  }

  return isScheduleLockActive(conversation.lock_schedule, date);
}

export function isCommunityStaffRole(role) {
  return ['owner', 'admin', 'moderator'].includes(role);
}
