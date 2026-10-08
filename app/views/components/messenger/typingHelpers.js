/** Supported presence activities from typing channel. */
export const TYPING_ACTIVITIES = [
  'typing',
  'recording_voice',
  'uploading_photo',
  'uploading_video',
  'uploading_audio',
  'uploading_file',
];

export function normalizeTypingActivity(activity) {
  const a = String(activity || 'typing').toLowerCase().trim();
  return TYPING_ACTIVITIES.includes(a) ? a : 'typing';
}

/** Client-side clear delay — slightly longer than server TTL so UI doesn't flicker. */
export function typingClearMs(activity) {
  switch (normalizeTypingActivity(activity)) {
    case 'recording_voice':
      return 5500;
    case 'uploading_photo':
    case 'uploading_video':
    case 'uploading_audio':
    case 'uploading_file':
      return 9000;
    default:
      // Drop quickly when the peer pauses typing (server TTL ≈ 4s).
      return 3200;
  }
}

function activityKey(activity, { short = false } = {}) {
  const a = normalizeTypingActivity(activity);
  if (short) {
    if (a === 'recording_voice') return 'messenger.recordingVoiceShort';
    if (a === 'uploading_photo') return 'messenger.sendingPhotoShort';
    if (a === 'uploading_video') return 'messenger.sendingVideoShort';
    if (a === 'uploading_audio') return 'messenger.sendingAudioShort';
    if (a === 'uploading_file') return 'messenger.sendingFileShort';
    return 'messenger.typingShort';
  }
  if (a === 'recording_voice') return 'messenger.recordingVoiceNamed';
  if (a === 'uploading_photo') return 'messenger.sendingPhotoNamed';
  if (a === 'uploading_video') return 'messenger.sendingVideoNamed';
  if (a === 'uploading_audio') return 'messenger.sendingAudioNamed';
  if (a === 'uploading_file') return 'messenger.sendingFileNamed';
  return 'messenger.typing';
}

/**
 * Pick the "strongest" activity when multiple users are active.
 * uploading > recording > typing
 */
export function dominantTypingActivity(users) {
  const list = Array.isArray(users) ? users : [];
  const rank = {
    uploading_photo: 5,
    uploading_video: 5,
    uploading_audio: 4,
    uploading_file: 4,
    recording_voice: 3,
    typing: 1,
  };
  let best = 'typing';
  let bestRank = 0;
  list.forEach((u) => {
    const a = normalizeTypingActivity(u?.activity);
    const r = rank[a] || 0;
    if (r > bestRank) {
      bestRank = r;
      best = a;
    }
  });
  return best;
}

/**
 * Build a typing/activity status for chat header / sidebar.
 * @returns {{ label: string, activity: string, users: array }|null}
 */
export function formatTypingStatus(t, users, options = {}) {
  const list = Array.isArray(users) ? users.filter(Boolean) : [];
  if (!list.length) return null;

  const { privateChat = false, fallbackName = 'User' } = options;
  const activity = dominantTypingActivity(list);

  if (privateChat) {
    return {
      label: t(activityKey(activity, { short: true })),
      activity,
      users: list,
    };
  }

  const name = (list[0].name || '').trim() || fallbackName;
  if (list.length === 1) {
    return {
      label: t(activityKey(activity), { name }),
      activity,
      users: list,
    };
  }
  if (list.length === 2) {
    const other = (list[1].name || '').trim() || fallbackName;
    // Multi-user: keep classic typing phrasing unless all share same non-typing activity.
    const same = list.every((u) => normalizeTypingActivity(u.activity) === activity);
    if (same && activity !== 'typing') {
      return {
        label: t(activityKey(activity), { name }),
        activity,
        users: list,
      };
    }
    return {
      label: t('messenger.typingTwo', { name, other }),
      activity: 'typing',
      users: list,
    };
  }
  return {
    label: t('messenger.typingMany', { name, count: list.length - 1 }),
    activity: 'typing',
    users: list,
  };
}

/**
 * Build a typing status label for chat header / sidebar preview.
 * @param {(key: string, values?: object) => string} t  i18n translate fn
 * @param {Array<{ id?: number|string, name?: string, activity?: string }>} users
 * @param {{ privateChat?: boolean, fallbackName?: string }} [options]
 * @returns {string|null}
 */
export function formatTypingLabel(t, users, options = {}) {
  return formatTypingStatus(t, users, options)?.label || null;
}
