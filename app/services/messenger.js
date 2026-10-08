import axiosInstance from '@/store/axiosInstance';
import config from '@/store/config';

// -------------------------------------------------------------------------
// Conversations
// -------------------------------------------------------------------------

export async function getConversations(page = 1) {
  const r = await axiosInstance.get('/messenger/conversations', { params: { page } });
  // Returns { data: Conversation[], meta: { current_page, last_page, has_more, ... } }.
  return r.data;
}

export async function createConversation(userId) {
  // Must survive draft→real URL sync (router must not abort first-message create).
  const r = await axiosInstance.post(
    '/messenger/conversations',
    { user_id: userId },
    { skipCancelOnNavigate: true },
  );
  return r.data;
}

// Personal "Saved Messages" chat (a conversation with yourself).
export async function openSavedConversation() {
  const r = await axiosInstance.post('/messenger/saved');
  return r.data;
}

export async function getConversation(conversationId) {
  const r = await axiosInstance.get(`/messenger/conversations/${conversationId}`);
  return r.data;
}

export async function deleteConversation(conversationId) {
  const r = await axiosInstance.delete(`/messenger/conversations/${conversationId}`);
  return r.data;
}

export async function clearConversation(conversationId) {
  const r = await axiosInstance.post(`/messenger/conversations/${conversationId}/clear`);
  return r.data;
}

export async function muteConversation(conversationId, mute = true) {
  const r = await axiosInstance.post(`/messenger/conversations/${conversationId}/mute`, { mute });
  return r.data;
}

// -------------------------------------------------------------------------
// Messages
// -------------------------------------------------------------------------

export async function getMessages(conversationId, beforeId = null) {
  const params = beforeId ? { before_id: beforeId } : {};
  const r = await axiosInstance.get(`/messenger/conversations/${conversationId}/messages`, { params });
  return r.data;
}

/** Shared media tabs (photo/video/gif/audio/voice/links) with cursor pagination. */
export async function getSharedMedia(conversationId, type, beforeId = null, limit = 40) {
  const params = { type, limit };
  if (beforeId) params.before_id = beforeId;
  const r = await axiosInstance.get(`/messenger/conversations/${conversationId}/shared-media`, { params });
  return r.data;
}

export async function sendMessage(conversationId, body, clientId = null, options = {}) {
  const payload = { body };
  if (clientId) payload.client_id = clientId;
  if (options.replyToId) payload.reply_to_id = options.replyToId;
  if (options.replyShowTitle !== undefined) payload.reply_show_title = options.replyShowTitle;
  if (options.type) payload.type = options.type;
  if (options.meta !== undefined) payload.meta = options.meta;
  if (options.forwarded_from_user_id) {
    payload.forwarded_from_user_id = options.forwarded_from_user_id;
  }
  if (options.forward_from_message_id) {
    payload.forward_from_message_id = options.forward_from_message_id;
  }
  if (options.drop_author) payload.drop_author = true;
  if (options.is_encrypted) {
    payload.is_encrypted = true;
    payload.sender_device_id = options.sender_device_id;
    payload.e2e = options.e2e;
    if (options.mention_ids) payload.mention_ids = options.mention_ids;
  }
  if (options.clientSentAt) payload.client_sent_at = options.clientSentAt;
  // Priority path: never share the crypto HTTP slot; fail fast vs 60s hang.
  // skipCancelOnNavigate: draft→real chat URL replace must not abort the send.
  const r = await axiosInstance.post(
    `/messenger/conversations/${conversationId}/messages`,
    payload,
    { timeout: 12000, skipCryptoLimit: true, skipCancelOnNavigate: true },
  );
  return r.data;
}

export async function sendMediaMessage(conversationId, {
  file,
  type,
  caption = '',
  clientId = null,
  replyToId = null,
  replyShowTitle = undefined,
  duration = null,
  width = null,
  height = null,
  coverFile = null,
  silent = false,
  animation = false,
  albumId = null,
  albumIndex = null,
  albumCount = null,
  is_encrypted = false,
  encrypted = false,
  sender_device_id = null,
  e2e = null,
  forwarded_from_user_id = null,
  drop_author = false,
  mediaId = null,
  meta = null,
  onUploadProgress = null,
  abortController = null,
} = {}) {
  const form = new FormData();
  const reuseMediaId = mediaId != null && mediaId !== '' && !file;
  if (reuseMediaId) {
    form.append('media_id', String(mediaId));
  } else {
    form.append('file', file);
  }
  form.append('type', type);
  if (caption != null) form.append('caption', caption);
  if (clientId) form.append('client_id', clientId);
  if (replyToId) form.append('reply_to_id', replyToId);
  if (replyShowTitle !== undefined) form.append('reply_show_title', replyShowTitle ? '1' : '0');
  if (duration != null && duration !== '') form.append('duration', String(duration));
  if (width != null) form.append('width', String(width));
  if (height != null) form.append('height', String(height));
  if (coverFile) form.append('cover', coverFile);
  if (silent || animation) {
    form.append('silent', '1');
    form.append('animation', '1');
  }
  if (albumId) {
    form.append('album_id', String(albumId));
    if (albumIndex != null) form.append('album_index', String(albumIndex));
    if (albumCount != null) form.append('album_count', String(albumCount));
  }
  if (forwarded_from_user_id) {
    form.append('forwarded_from_user_id', String(forwarded_from_user_id));
  }
  if (drop_author) form.append('drop_author', '1');
  if (meta && typeof meta === 'object') {
    if (meta.sticker) {
      form.append('sticker', '1');
      if (meta.sticker_id) form.append('sticker_id', String(meta.sticker_id));
      if (meta.sticker_pack_id) form.append('sticker_pack_id', String(meta.sticker_pack_id));
      if (meta.sticker_emoji) form.append('sticker_emoji', String(meta.sticker_emoji));
      if (meta.sticker_kind) form.append('sticker_kind', String(meta.sticker_kind));
    }
    form.append('meta', JSON.stringify(meta));
  }
  if (is_encrypted || encrypted) {
    form.append('is_encrypted', '1');
    form.append('encrypted', '1');
    if (sender_device_id) form.append('sender_device_id', sender_device_id);
    if (e2e) form.append('e2e', JSON.stringify(e2e));
  }

  const r = await axiosInstance.post(`/messenger/conversations/${conversationId}/media`, form, {
    onUploadProgress: reuseMediaId ? undefined : (onUploadProgress || undefined),
    timeout: 300000,
    signal: abortController?.signal,
    abortController: abortController || undefined,
    skipCancelOnNavigate: true,
  });
  return r.data;
}

export async function forwardMessages(conversationId, messageIds, dropAuthor = false) {
  const r = await axiosInstance.post(`/messenger/conversations/${conversationId}/forward`, {
    message_ids: messageIds,
    drop_author: dropAuthor,
  });
  return r.data;
}

export async function bulkDeleteMessages(messageIds, scope = 'everyone') {
  const r = await axiosInstance.post('/messenger/messages/bulk-delete', { message_ids: messageIds, scope });
  return r.data;
}

export async function editMessage(messageId, body, options = {}) {
  const payload = { body };
  if (options.is_encrypted) {
    payload.is_encrypted = true;
    payload.sender_device_id = options.sender_device_id;
    payload.e2e = options.e2e;
  }
  const r = await axiosInstance.put(`/messenger/messages/${messageId}`, payload);
  return r.data;
}

// -------------------------------------------------------------------------
// End-to-end encryption (device keys + opaque package relay)
// -------------------------------------------------------------------------

function parseIdentityField(identityPublicKey) {
  if (!identityPublicKey) return { signing: null, agreement: null };
  if (typeof identityPublicKey === 'object') {
    return {
      signing: identityPublicKey.signing || null,
      // Never fall back agreement → signing (ECDSA SPKI cannot ECDH).
      agreement: identityPublicKey.agreement || null,
    };
  }
  try {
    const parsed = JSON.parse(identityPublicKey);
    if (parsed && typeof parsed === 'object' && (parsed.signing || parsed.agreement)) {
      return {
        signing: parsed.signing || null,
        agreement: parsed.agreement || null,
      };
    }
  } catch {
    // single legacy key string — last resort only
  }
  // Legacy: one SPKI used for both (pre-split devices). Prefer failing closed
  // on modern JSON without agreement over silently using a signing key.
  if (typeof identityPublicKey === 'string' && identityPublicKey.length > 40) {
    return { signing: identityPublicKey, agreement: identityPublicKey };
  }
  return { signing: null, agreement: null };
}

/**
 * Register this browser as a crypto device.
 * Accepts either the backend wire shape or the client-friendly split keys.
 */
export async function registerDevice(payload = {}) {
  const identity = parseIdentityField(payload.identity_public_key);
  const signing = payload.identity_signing_public_key || identity.signing;
  const agreement = payload.identity_agreement_public_key || identity.agreement;

  const oneTime = (payload.one_time_prekeys || payload.prekeys || []).map((p) => ({
    prekey_id: p.prekey_id ?? p.key_id,
    public_key: p.public_key,
    signature: p.signature || null,
  })).filter((p) => p.prekey_id && p.public_key);

  const body = {
    device_id: payload.device_id,
    label: payload.label || payload.platform || null,
    identity_public_key: JSON.stringify({ signing, agreement }),
    signed_prekey_id: payload.signed_prekey_id ?? 1,
    signed_prekey_public: payload.signed_prekey_public,
    signed_prekey_signature: payload.signed_prekey_signature,
    one_time_prekeys: oneTime,
  };

  const r = await axiosInstance.post('/messenger/crypto/devices', body);
  return r.data;
}

/** Upload additional one-time prekeys for an already-registered device. */
export async function submitPrekeys({ device_id, prekeys = [], one_time_prekeys = [] } = {}) {
  const rows = (one_time_prekeys.length ? one_time_prekeys : prekeys).map((p) => ({
    prekey_id: p.prekey_id ?? p.key_id,
    public_key: p.public_key,
    signature: p.signature || null,
  })).filter((p) => p.prekey_id && p.public_key);

  const r = await axiosInstance.post('/messenger/crypto/prekeys', {
    device_id,
    one_time_prekeys: rows,
  });
  return r.data;
}

export async function listCryptoDevices() {
  const r = await axiosInstance.get('/messenger/crypto/devices');
  return r.data;
}

export async function revokeCryptoDevice(deviceId) {
  const r = await axiosInstance.delete(`/messenger/crypto/devices/${deviceId}`);
  return r.data;
}

/** Normalized device bundles for a conversation (client-friendly shape). */
export async function getConversationBundles(conversationId) {
  const r = await axiosInstance.get(`/messenger/crypto/conversations/${conversationId}/bundles`);
  const bundles = r.data?.bundles || [];
  const devices = bundles.map((b) => {
    const identity = parseIdentityField(b.identity_public_key);
    const otp = b.one_time_prekey || null;
    const prekey = otp
      ? {
        key_id: otp.prekey_id,
        public_key: otp.public_key,
        signature: otp.signature || null,
      }
      : (b.signed_prekey_public
        ? {
          key_id: b.signed_prekey_id,
          public_key: b.signed_prekey_public,
          signature: b.signed_prekey_signature,
        }
        : null);

    return {
      ...b,
      identity_signing_public_key: identity.signing,
      identity_agreement_public_key: identity.agreement,
      // Prefer OTP; fall back to signed prekey / identity agreement.
      prekey,
      one_time_prekey: otp,
    };
  });
  return { devices, bundles: devices };
}

export async function distributeConversationKeys(conversationId, { sender_device_id, packages } = {}) {
  const r = await axiosInstance.post(`/messenger/crypto/conversations/${conversationId}/distribute`, {
    sender_device_id,
    packages,
  });
  return r.data;
}

export async function requestConversationKey(conversationId) {
  const r = await axiosInstance.post(`/messenger/crypto/conversations/${conversationId}/key-request`);
  return r.data;
}

/** Identity-wrapped conversation-key vault (multi-device history recovery). */
export async function upsertKeyVault({ sender_device_id, entries } = {}) {
  const r = await axiosInstance.put('/messenger/crypto/vault', {
    sender_device_id,
    entries,
  });
  return r.data;
}

export async function pullKeyVault(conversationId = null) {
  const params = {};
  if (conversationId != null) params.conversation_id = conversationId;
  const r = await axiosInstance.get('/messenger/crypto/vault', { params });
  return r.data;
}

export async function pullPackages(deviceId, conversationId = null) {
  const params = { device_id: deviceId };
  if (conversationId) params.conversation_id = conversationId;
  const r = await axiosInstance.get('/messenger/crypto/packages', { params });
  return r.data;
}

export async function ackPackages(deviceId, ids = []) {
  const r = await axiosInstance.post('/messenger/crypto/packages/ack', {
    device_id: deviceId,
    ids,
  });
  return r.data;
}

export async function getSafetyNumberMaterial(userId) {
  const r = await axiosInstance.get(`/messenger/crypto/safety/${userId}`);
  return r.data;
}

/** Alias used by safety.js */
export async function getSafetyNumber(userId) {
  return getSafetyNumberMaterial(userId);
}

// -------------------------------------------------------------------------
// Account-level User Identity (stable across devices)
// -------------------------------------------------------------------------

export async function getUserIdentity(userId = null) {
  const params = userId != null ? { user_id: userId } : {};
  const r = await axiosInstance.get('/messenger/crypto/identity', { params });
  return r.data;
}

export async function publishUserIdentity(payload = {}) {
  const r = await axiosInstance.post('/messenger/crypto/identity', payload);
  return r.data;
}

export async function uploadIdentityBackup(payload = {}) {
  const r = await axiosInstance.put('/messenger/crypto/identity/backup', payload);
  return r.data;
}

/** Authenticated multi-device unlock secret (MDS) — owner-only. */
export async function uploadSeamlessUnlock(mds) {
  const r = await axiosInstance.put('/messenger/crypto/identity/seamless-unlock', { mds });
  return r.data;
}

export async function distributeIdentityPackages({ sender_device_id, packages } = {}) {
  const r = await axiosInstance.post('/messenger/crypto/identity/distribute', {
    sender_device_id,
    packages,
  });
  return r.data;
}

export async function pullIdentityPackages(deviceId) {
  const r = await axiosInstance.get('/messenger/crypto/identity/packages', {
    params: { device_id: deviceId },
  });
  return r.data;
}

export async function ackIdentityPackages(deviceId, ids = []) {
  const r = await axiosInstance.post('/messenger/crypto/identity/packages/ack', {
    device_id: deviceId,
    ids,
  });
  return r.data;
}

export async function requestIdentityTransfer(deviceId) {
  const r = await axiosInstance.post('/messenger/crypto/identity/request', {
    device_id: deviceId,
  });
  return r.data;
}

export async function deleteMessage(messageId, scope = 'everyone') {
  const r = await axiosInstance.delete(`/messenger/messages/${messageId}`, { data: { scope } });
  return r.data;
}

// -------------------------------------------------------------------------
// Pinned messages
// -------------------------------------------------------------------------

export async function getPins(conversationId) {
  const r = await axiosInstance.get(`/messenger/conversations/${conversationId}/pins`);
  return r.data;
}

export async function pinMessage(messageId, forEveryone = false) {
  const r = await axiosInstance.post(`/messenger/messages/${messageId}/pin`, { for_everyone: forEveryone });
  return r.data;
}

export async function unpinMessage(messageId) {
  const r = await axiosInstance.delete(`/messenger/messages/${messageId}/pin`);
  return r.data;
}

export async function unpinAllMessages(conversationId) {
  const r = await axiosInstance.post(`/messenger/conversations/${conversationId}/unpin-all`);
  return r.data;
}

export async function sendTyping(conversationId, activity = 'typing') {
  const r = await axiosInstance.post(`/messenger/conversations/${conversationId}/typing`, {
    activity: activity || 'typing',
  });
  return r.data;
}

export async function markRead(conversationId) {
  const r = await axiosInstance.post(`/messenger/conversations/${conversationId}/read`);
  return r.data;
}

export async function markDelivered(conversationId, messageIds) {
  const r = await axiosInstance.post(`/messenger/conversations/${conversationId}/delivered`, {
    message_ids: messageIds,
  });
  return r.data;
}

// -------------------------------------------------------------------------
// Contacts
// -------------------------------------------------------------------------

let contactsInflight = null;
let contactsInflightSort = null;

export async function getContacts(sort = 'name_asc') {
  if (contactsInflight && contactsInflightSort === sort) {
    return contactsInflight;
  }
  contactsInflightSort = sort;
  contactsInflight = axiosInstance
    .get('/messenger/contacts', { params: { sort } })
    .then((r) => r.data)
    .finally(() => {
      contactsInflight = null;
      contactsInflightSort = null;
    });
  return contactsInflight;
}

export async function addContact(contactUserId, name = null) {
  const payload = { contact_user_id: contactUserId };
  if (name) payload.name = name;
  const r = await axiosInstance.post('/messenger/contacts', payload);
  return r.data;
}

export async function updateContact(contactId, data) {
  const r = await axiosInstance.put(`/messenger/contacts/${contactId}`, data);
  return r.data;
}

export async function deleteContact(contactId) {
  const r = await axiosInstance.delete(`/messenger/contacts/${contactId}`);
  return r.data;
}

export async function searchUsers(query, limit = 10) {
  const r = await axiosInstance.get('/messenger/users/search', { params: { q: query, limit } });
  return r.data;
}

export async function lookupContact(identifier) {
  const r = await axiosInstance.post('/messenger/contacts/lookup', { identifier });
  return r.data;
}

export async function inviteContact(identifier) {
  const r = await axiosInstance.post('/messenger/contacts/invite', { identifier });
  return r.data;
}

/** Upload device address-book batch for matching / auto-add / invite. */
export async function syncContacts(contacts) {
  const r = await axiosInstance.post('/messenger/contacts/sync', { contacts });
  return r.data;
}

/** Re-check registration status of previously synced phones. */
export async function refreshContactSync() {
  const r = await axiosInstance.post('/messenger/contacts/sync/refresh');
  return r.data;
}

/** List stored synced contacts (registered + inviteable). */
export async function getSyncedContacts() {
  const r = await axiosInstance.get('/messenger/contacts/synced');
  return r.data;
}

export async function getBlockedContacts() {
  const r = await axiosInstance.get('/messenger/contacts/blocked');
  return r.data;
}

export async function blockUser(userId) {
  const r = await axiosInstance.post(`/messenger/users/${userId}/block`);
  return r.data;
}

export async function unblockUser(userId) {
  const r = await axiosInstance.post(`/messenger/users/${userId}/unblock`);
  return r.data;
}

// -------------------------------------------------------------------------
// Presence
// -------------------------------------------------------------------------

export async function pingPresence() {
  const r = await axiosInstance.post('/messenger/presence/ping', {
    session_id: presenceSessionId(),
  });
  return r.data;
}

export function presenceSessionId() {
  const key = 'messenger_presence_session';
  try {
    let id = sessionStorage.getItem(key);
    if (!id) {
      id = (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : `p_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem(key, id);
    }
    return id;
  } catch (e) {
    return 'tab';
  }
}

export function presenceOfflineBeacon() {
  // Best-effort offline signal; uses keepalive so it survives page unload.
  // session_id lets other devices of the same user stay online.
  try {
    const token = JSON.parse(localStorage.getItem('token'));
    if (!token) return;
    const url = `${config.apiBaseUrl}/messenger/presence/offline`;
    fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: presenceSessionId() }),
      keepalive: true,
    }).catch(() => {});
  } catch (e) {
    /* noop */
  }
}

// -------------------------------------------------------------------------
// Utility
// -------------------------------------------------------------------------

let unreadCountInflight = null;

export async function getUnreadCount() {
  if (unreadCountInflight) return unreadCountInflight;
  unreadCountInflight = axiosInstance
    .get('/messenger/unread-count')
    .then((r) => r.data)
    .finally(() => {
      unreadCountInflight = null;
    });
  return unreadCountInflight;
}

// -------------------------------------------------------------------------
// Settings & profiles
// -------------------------------------------------------------------------

export function getSystemConfig() {
  return axiosInstance.get('/messenger/config').then((r) => r.data);
}

export async function getSettings() {
  const r = await axiosInstance.get('/messenger/settings');
  return r.data;
}

export async function updateSettings(data) {
  const r = await axiosInstance.put('/messenger/settings', data);
  return r.data;
}

export async function listWallpapers() {
  const r = await axiosInstance.get('/messenger/wallpapers');
  return r.data?.data || r.data || [];
}

export async function uploadWallpaper(file) {
  const fd = new FormData();
  fd.append('file', file);
  const r = await axiosInstance.post('/messenger/wallpapers', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return r.data;
}

export async function deleteWallpaper(wallpaperId) {
  const r = await axiosInstance.delete(`/messenger/wallpapers/${wallpaperId}`);
  return r.data;
}

export async function getConversationWallpaper(conversationId) {
  const r = await axiosInstance.get(`/messenger/conversations/${conversationId}/wallpaper`);
  return r.data;
}

export async function setConversationWallpaper(conversationId, { config = null, forBoth = false, wallpaperId = null } = {}) {
  const payload = {
    config,
    for_both: !!forBoth,
  };
  if (wallpaperId != null) payload.wallpaper_id = wallpaperId;
  const r = await axiosInstance.put(`/messenger/conversations/${conversationId}/wallpaper`, payload);
  return r.data;
}

const PROFILE_TTL_MS = 60_000;
const profileCache = new Map();
const profileInflight = new Map();
let myProfileCache = null;
let myProfileInflight = null;

export async function getUserProfile(userId, { force = false } = {}) {
  const key = String(userId);
  if (!force) {
    const cached = profileCache.get(key);
    if (cached && Date.now() - cached.at < PROFILE_TTL_MS) return cached.data;
  }
  if (profileInflight.has(key)) return profileInflight.get(key);

  const work = axiosInstance
    .get(`/messenger/users/${userId}/profile`)
    .then((r) => {
      profileCache.set(key, { data: r.data, at: Date.now() });
      return r.data;
    })
    .finally(() => {
      profileInflight.delete(key);
    });
  profileInflight.set(key, work);
  return work;
}

export async function getMyProfile({ force = false } = {}) {
  if (!force && myProfileCache && Date.now() - myProfileCache.at < PROFILE_TTL_MS) {
    return myProfileCache.data;
  }
  if (myProfileInflight) return myProfileInflight;

  myProfileInflight = axiosInstance
    .get('/messenger/me')
    .then((r) => {
      myProfileCache = { data: r.data, at: Date.now() };
      return r.data;
    })
    .finally(() => {
      myProfileInflight = null;
    });
  return myProfileInflight;
}

export async function updateMyProfile(data) {
  const r = await axiosInstance.put('/messenger/me', data);
  myProfileCache = { data: r.data, at: Date.now() };
  return r.data;
}

export async function checkUserUsername(username) {
  const r = await axiosInstance.get('/messenger/me/username-check', {
    params: { username },
  });
  return r.data;
}

export async function uploadProfilePic(file, options = {}) {
  const formData = new FormData();
  formData.append('profilePic', file);
  const r = await axiosInstance.post('panel/profile/change-profile-pic', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: options.onUploadProgress,
  });
  return r.data;
}

export async function deleteProfilePic() {
  const r = await axiosInstance.delete('panel/profile/change-profile-pic');
  return r.data;
}

export async function syncEvents(since = 0) {
  const r = await axiosInstance.get('/messenger/sync', { params: { since } });
  return r.data;
}

// -------------------------------------------------------------------------
// Groups & Channels
// -------------------------------------------------------------------------

export async function createGroup(payload) {
  const r = await axiosInstance.post('/messenger/groups', payload);
  return r.data;
}

export async function createChannel(payload) {
  const r = await axiosInstance.post('/messenger/channels', payload);
  return r.data;
}

export async function updateCommunityInfo(conversationId, data) {
  const r = await axiosInstance.put(`/messenger/conversations/${conversationId}/info`, data);
  return r.data;
}

export async function uploadCommunityImage(conversationId, file, kind = 'avatar', options = {}) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('kind', kind);
  const r = await axiosInstance.post(`/messenger/conversations/${conversationId}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: options.onUploadProgress,
  });
  return r.data;
}

export async function getMembers(conversationId, page = 1, role = null) {
  const params = { page };
  if (role) params.role = role;
  const r = await axiosInstance.get(`/messenger/conversations/${conversationId}/members`, { params });
  return r.data;
}

export async function getMemberProfile(conversationId, userId) {
  const r = await axiosInstance.get(`/messenger/conversations/${conversationId}/members/${userId}`);
  return r.data;
}

export async function updateMember(conversationId, userId, data) {
  const r = await axiosInstance.put(`/messenger/conversations/${conversationId}/members/${userId}`, data);
  return r.data;
}

export async function addMembers(conversationId, userIds) {
  const r = await axiosInstance.post(`/messenger/conversations/${conversationId}/members`, {
    user_ids: userIds,
  });
  return r.data;
}

export async function leaveCommunity(conversationId) {
  const r = await axiosInstance.post(`/messenger/conversations/${conversationId}/leave`);
  return r.data;
}

export async function kickMember(conversationId, userId, reason = null) {
  const r = await axiosInstance.post(`/messenger/conversations/${conversationId}/members/${userId}/kick`, { reason });
  return r.data;
}

export async function joinCommunity(conversationId, message = null) {
  const r = await axiosInstance.post(`/messenger/conversations/${conversationId}/join`, { message });
  return r.data;
}

export async function joinByUsername(username) {
  const r = await axiosInstance.post('/messenger/join/username', { username });
  return r.data;
}

export async function checkCommunityUsername(username, exceptId = null) {
  const params = { username };
  if (exceptId) params.except_id = exceptId;
  const r = await axiosInstance.get('/messenger/communities/username-check', { params });
  return r.data;
}

export async function joinByInvite(code) {
  const r = await axiosInstance.post('/messenger/join/invite', { code });
  return r.data;
}

export async function previewJoin({ code, username } = {}) {
  const params = {};
  if (code) params.code = code;
  if (username) params.username = username;
  const r = await axiosInstance.get('/messenger/join/preview', { params });
  return r.data;
}

export async function joinConversation(conversationId) {
  const r = await axiosInstance.post(`/messenger/conversations/${conversationId}/join`);
  return r.data;
}

export async function getJoinRequests(conversationId, status = 'pending') {
  const r = await axiosInstance.get(`/messenger/conversations/${conversationId}/join-requests`, { params: { status } });
  return r.data;
}

export async function approveJoinRequest(conversationId, requestId) {
  const r = await axiosInstance.post(`/messenger/conversations/${conversationId}/join-requests/${requestId}/approve`);
  return r.data;
}

export async function rejectJoinRequest(conversationId, requestId, note = null) {
  const r = await axiosInstance.post(`/messenger/conversations/${conversationId}/join-requests/${requestId}/reject`, { note });
  return r.data;
}

export async function createInvite(conversationId, data = {}) {
  const r = await axiosInstance.post(`/messenger/conversations/${conversationId}/invites`, data);
  return r.data;
}

export async function getInvites(conversationId) {
  const r = await axiosInstance.get(`/messenger/conversations/${conversationId}/invites`);
  return r.data;
}

export async function revokeInvite(conversationId, inviteId) {
  const r = await axiosInstance.delete(`/messenger/conversations/${conversationId}/invites/${inviteId}`);
  return r.data;
}

export async function banMember(conversationId, userId, data = {}) {
  const r = await axiosInstance.post(`/messenger/conversations/${conversationId}/members/${userId}/ban`, data);
  return r.data;
}

export async function unbanMember(conversationId, userId) {
  const r = await axiosInstance.post(`/messenger/conversations/${conversationId}/members/${userId}/unban`);
  return r.data;
}

export async function getBans(conversationId, page = 1) {
  const r = await axiosInstance.get(`/messenger/conversations/${conversationId}/bans`, {
    params: { page },
  });
  return r.data;
}

export async function muteMember(conversationId, userId, data = {}) {
  const r = await axiosInstance.post(`/messenger/conversations/${conversationId}/members/${userId}/mute`, data);
  return r.data;
}

export async function unmuteMember(conversationId, userId) {
  const r = await axiosInstance.post(`/messenger/conversations/${conversationId}/members/${userId}/unmute`);
  return r.data;
}

export async function searchCommunities(q, type = null) {
  const params = { q };
  if (type) params.type = type;
  const r = await axiosInstance.get('/messenger/communities/search', { params });
  return r.data;
}

export async function searchMessages(conversationId, filters = {}) {
  const r = await axiosInstance.get(`/messenger/conversations/${conversationId}/search`, { params: filters });
  return r.data;
}

export async function searchAllMessages(filters = {}) {
  const r = await axiosInstance.get('/messenger/messages/search', { params: filters });
  return r.data;
}

export async function getPermissions(conversationId) {
  const r = await axiosInstance.get(`/messenger/conversations/${conversationId}/permissions`);
  return r.data;
}

export async function setPermission(conversationId, role, permission, allowed) {
  const r = await axiosInstance.put(`/messenger/conversations/${conversationId}/permissions`, {
    role, permission, allowed,
  });
  return r.data;
}

export async function getAuditLogs(conversationId, page = 1) {
  const r = await axiosInstance.get(`/messenger/conversations/${conversationId}/audit-logs`, { params: { page } });
  return r.data;
}

export async function reactToMessage(messageId, emoji) {
  const r = await axiosInstance.post(`/messenger/messages/${messageId}/react`, { emoji });
  return r.data;
}

export async function recordMessageView(messageId) {
  const r = await axiosInstance.post(`/messenger/messages/${messageId}/view`);
  return r.data;
}

/** Batch channel view recording — one request for many message ids. */
export async function recordMessageViews(messageIds) {
  const ids = [...new Set((messageIds || []).map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0))];
  if (!ids.length) return { views: {} };
  if (ids.length === 1) {
    const r = await recordMessageView(ids[0]);
    return { views: { [ids[0]]: r?.view_count } };
  }
  const r = await axiosInstance.post('/messenger/messages/views', { message_ids: ids });
  return r.data;
}

export async function transferOwnership(conversationId, userId) {
  const r = await axiosInstance.post(`/messenger/conversations/${conversationId}/transfer`, { user_id: userId });
  return r.data;
}

export async function listStickerPacks() {
  const r = await axiosInstance.get('/messenger/sticker-packs');
  return r.data;
}

export async function getStickerPack(uuid) {
  const r = await axiosInstance.get(`/messenger/sticker-packs/${uuid}`);
  return r.data?.pack || r.data;
}

export async function createStickerPackApi(payload) {
  const form = new FormData();
  form.append('title', payload.title || 'My pack');
  if (payload.title_fa) form.append('title_fa', payload.title_fa);
  if (payload.icon) form.append('icon', payload.icon);
  (payload.stickers || []).forEach((st, i) => {
    if (st.emoji) form.append(`stickers[${i}][emoji]`, st.emoji);
    if (st.data_url) form.append(`stickers[${i}][data_url]`, st.data_url);
    if (st.file) form.append(`stickers[${i}][file]`, st.file);
  });
  const r = await axiosInstance.post('/messenger/sticker-packs', form, { timeout: 120000 });
  return r.data?.pack || r.data;
}

export async function installStickerPackApi(uuid) {
  const r = await axiosInstance.post(`/messenger/sticker-packs/${uuid}/install`);
  return r.data?.pack || r.data;
}

export async function uninstallStickerPackApi(uuid) {
  const r = await axiosInstance.delete(`/messenger/sticker-packs/${uuid}/install`);
  return r.data;
}

export async function deleteStickerApi(stickerUuid) {
  const r = await axiosInstance.delete(`/messenger/stickers/${stickerUuid}`);
  return r.data;
}

export async function addStickersToPackApi(uuid, stickers = []) {
  const form = new FormData();
  (stickers || []).forEach((st, i) => {
    if (st.emoji) form.append(`stickers[${i}][emoji]`, st.emoji);
    if (st.data_url) form.append(`stickers[${i}][data_url]`, st.data_url);
    if (st.file) form.append(`stickers[${i}][file]`, st.file);
  });
  const r = await axiosInstance.post(`/messenger/sticker-packs/${uuid}/stickers`, form, { timeout: 120000 });
  return r.data?.pack || r.data;
}

export async function updateStickerApi(stickerUuid, payload = {}) {
  const r = await axiosInstance.put(`/messenger/stickers/${stickerUuid}`, payload);
  return r.data?.sticker || r.data;
}

export async function updateStickerPackApi(uuid, payload = {}) {
  const r = await axiosInstance.put(`/messenger/sticker-packs/${uuid}`, payload);
  return r.data?.pack || r.data;
}

export async function deleteStickerPackApi(uuid) {
  const r = await axiosInstance.delete(`/messenger/sticker-packs/${uuid}`);
  return r.data;
}

export default {
  getConversations,
  createConversation,
  getConversation,
  deleteConversation,
  clearConversation,
  muteConversation,
  getMessages,
  getSharedMedia,
  sendMessage,
  forwardMessages,
  bulkDeleteMessages,
  editMessage,
  deleteMessage,
  getPins,
  pinMessage,
  unpinMessage,
  unpinAllMessages,
  sendTyping,
  markRead,
  markDelivered,
  getContacts,
  addContact,
  updateContact,
  deleteContact,
  searchUsers,
  lookupContact,
  inviteContact,
  getBlockedContacts,
  blockUser,
  unblockUser,
  pingPresence,
  presenceOfflineBeacon,
  getUnreadCount,
  getSettings,
  updateSettings,
  listWallpapers,
  uploadWallpaper,
  deleteWallpaper,
  listStickerPacks,
  getStickerPack,
  createStickerPackApi,
  installStickerPackApi,
  uninstallStickerPackApi,
  deleteStickerApi,
  addStickersToPackApi,
  updateStickerApi,
  updateStickerPackApi,
  deleteStickerPackApi,
  getConversationWallpaper,
  setConversationWallpaper,
  getUserProfile,
  getMyProfile,
  updateMyProfile,
  checkUserUsername,
  uploadProfilePic,
  deleteProfilePic,
  syncEvents,
  createGroup,
  createChannel,
  updateCommunityInfo,
  uploadCommunityImage,
  getMembers,
  getMemberProfile,
  updateMember,
  addMembers,
  leaveCommunity,
  kickMember,
  joinCommunity,
  joinByUsername,
  checkCommunityUsername,
  joinByInvite,
  getJoinRequests,
  approveJoinRequest,
  rejectJoinRequest,
  createInvite,
  getInvites,
  revokeInvite,
  banMember,
  unbanMember,
  getBans,
  muteMember,
  unmuteMember,
  searchCommunities,
  searchMessages,
  searchAllMessages,
  getPermissions,
  setPermission,
  getAuditLogs,
  reactToMessage,
  recordMessageView,
  recordMessageViews,
  transferOwnership,
};
