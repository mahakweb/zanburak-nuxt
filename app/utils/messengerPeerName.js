/**
 * Resolve the display name for a messenger peer.
 * Prefers a local contact nickname when present; otherwise the user's real name / username.
 */

export function userRealName(user) {
  if (!user) return '';
  if (user.first_name || user.last_name) {
    return `${user.first_name || ''} ${user.last_name || ''}`.trim();
  }
  return user.username || '';
}

export function peerDisplayName(user, contactName, fallback = '') {
  const nick = typeof contactName === 'string' ? contactName.trim() : '';
  if (nick) return nick;
  return userRealName(user) || fallback;
}

/** Build { [userId]: contactName } from the contacts list. */
export function contactNameMap(contacts) {
  const map = Object.create(null);
  if (!Array.isArray(contacts)) return map;
  contacts.forEach((ct) => {
    const uid = ct?.contact_user?.id;
    if (uid == null) return;
    const name = typeof ct.name === 'string' ? ct.name.trim() : '';
    if (name) map[uid] = name;
  });
  return map;
}

/**
 * Resolve the peer shown for a conversation row / chat header.
 * Uses partner → other participant → last_message.user.
 */
export function conversationPartner(conversation, meId) {
  if (!conversation) return null;
  const type = conversation.type;
  if (type === 'group' || type === 'channel') {
    return {
      id: conversation.id,
      first_name: conversation.title || '',
      profile_pic: conversation.avatar || null,
      username: conversation.username || null,
      is_online: false,
    };
  }
  if (conversation.partner?.id != null) return conversation.partner;

  const me = meId != null && meId !== '' ? Number(meId) : null;
  const users = Array.isArray(conversation.users) ? conversation.users : [];
  const other = users.find((u) => (
    u?.id != null && (me == null || !Number.isFinite(me) || Number(u.id) !== me)
  ));
  if (other) return other;

  if (type === 'saved' && me != null && Number.isFinite(me)) {
    return users.find((u) => Number(u.id) === me) || null;
  }

  const lmUser = conversation.last_message?.user;
  if (lmUser?.id != null && (me == null || !Number.isFinite(me) || Number(lmUser.id) !== me)) {
    return lmUser;
  }
  return null;
}

/** True when a sidebar/chat row has enough identity to paint (no "—" / "?" flash). */
export function conversationIdentityReady(conversation, meId) {
  if (!conversation) return false;
  const type = conversation.type;
  if (type === 'saved') return true;
  if (type === 'group' || type === 'channel') {
    return !!(conversation.title || conversation.username);
  }
  const p = conversationPartner(conversation, meId);
  return p?.id != null;
}
