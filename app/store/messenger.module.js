import {
  getConversations,
  getConversation,
  createConversation,
  openSavedConversation,
  getMessages,
  sendMessage,
  sendMediaMessage,
  editMessage,
  deleteMessage,
  getPins,
  pinMessage,
  unpinMessage,
  unpinAllMessages,
  markRead,
  markDelivered,
  sendTyping,
  getContacts,
  addContact,
  updateContact,
  deleteContact,
  searchUsers,
  getUnreadCount,
  deleteConversation,
  clearConversation,
  muteConversation,
  forwardMessages,
  bulkDeleteMessages,
  getSettings,
  updateSettings,
  listWallpapers,
  uploadWallpaper,
  deleteWallpaper,
  getConversationWallpaper,
  setConversationWallpaper,
  lookupContact,
  inviteContact,
  syncContacts,
  refreshContactSync,
  getSyncedContacts,
  getBlockedContacts,
  blockUser,
  unblockUser,
  pingPresence,
  presenceOfflineBeacon,
  syncEvents,
  getSystemConfig,
  requestConversationKey,
  listCryptoDevices,
} from '@/services/messenger';
import {
  conversationNeedsE2e,
  decryptIncomingMessage,
  decryptMessageList,
  bootstrapCrypto,
  transferUserIdentityToSiblings,
  pullAndConsumeIdentityPackages,
  adoptUserIdentityFromSiblings,
  encryptLocationMessage,
  encryptMediaMessage,
  encryptTextMessage,
  encryptOutgoingMediaEnvelope,
  LOCKED_PLACEHOLDER,
  prewarmConversationCrypto,
  pullAndConsumePackages,
  pullConversationKeySources,
  refillPrekeysIfLow,
  rotateConversationKey,
  forceRedistributeConversationKey,
  clearForceRedistributeGuard,
  getMyDeviceId,
  invalidateConversationCryptoCache,
  listConversationIdsWithLocalKeys,
  syncKeysAfterLogin,
  pullAndConsumeKeyVault,
  uploadAllLocalKeysToVault,
  restoreIdentityFromRecovery,
  getIdentityRecoveryStatus,
  isRecoverySetupDismissed,
  dismissRecoverySetupPrompt,
  isRecoveryRestoreDismissed,
  dismissRecoveryRestorePrompt,
  enableIdentityRecovery,
  hasLocalUserIdentityPrivates,
  ensureSeamlessMultiDeviceBackup,
  trySeamlessIdentityRestore,
} from '@/crypto/messenger';
import { typingClearMs } from '@/views/components/messenger/typingHelpers';
import { withLinkFlag } from '@/views/components/messenger/messageLinks';
import { connectionManager } from '@/services/connectionManager';
import {
  initEcho,
  getEcho,
  getPusher,
  refreshEchoAuth,
} from '@/lib/echo';
import {
  ensureConversationChannel,
  leaveAllConversationChannels,
  setConversationRealtimeHandlers,
  warmConversationChannels,
  whisperMessage,
  whisperTyping,
  isConversationChannelLive,
} from '@/services/conversationRealtime';
import config from '@/store/config';
import {
  loadWallpaper,
  saveWallpaper,
  normalizeWallpaper,
  wallpaperToApi,
} from '@/views/components/messenger/wallpaper';
import { loadFont, saveFont, loadFontSlots, saveFontSlot, saveFontSlots, resetFontSlots, applyDirectionFontDefaults } from '@/views/components/messenger/appearance';
import { loadAllDrafts, getDraft, saveDraft, clearDraft } from '@/views/components/messenger/drafts';
import {
  defaultAutoDownload,
  defaultAutoPlay,
  normalizeAutoDownload,
  normalizeAutoPlay,
} from '@/views/components/messenger/autoDownloadSettings';
import {
  outboxPut,
  outboxUpdate,
  outboxRemove,
  outboxListAll,
  outboxGetBlob,
  nextLocalSeq,
  sortMessages,
  mergeMessageLists,
  mergeMessageMeta,
  isServerId,
  outboxBackoffMs,
  outboxIsDue,
} from '@/views/components/messenger/outbox';
import {
  SEND_STATUS,
  INLINE_SEND_ATTEMPTS,
  MAX_OUTBOX_ATTEMPTS,
  isRetriableSendError,
  isPermanentSendError,
  isSendTransportReady,
  isRealtimeSendReady,
  ensureSendTransportReady,
  sendingPatch,
  queuedPatch,
  wireSentPatch,
  withSettledSendStatus,
  deriveSendStatus,
  mergeReceiptFields,
} from '@/views/components/messenger/sendPipeline';
import { applyThemePreference } from '@/utils/themePreference';
import {
  applyCachedSidebarPreview,
  cacheSidebarPreview,
  clearSidebarPreview,
  isSidebarPreviewLocked,
} from '@/utils/messengerSidebarPreview';
import { seedLocalMedia } from '@/views/components/messenger/mediaCache';
import { stopMediaPlayerIfMessage } from '@/views/components/messenger/mediaPlayer';
import { applyMessengerUploadLimits } from '@/views/components/messenger/mediaHelpers';

function isMessengerRoute() {
  if (typeof window === 'undefined') return false;
  return String(window.location.pathname || '').startsWith('/messenger');
}

// Guard concurrent startStream calls (App + MessengerPage race on SPA
// boot / navigation). Without this, two callers both see streamChannel=null and
// double-subscribe the private channel.
let streamBootstrapPromise = null;
/** Shared E2E device/package bootstrap — config + conversations share one gate. */
let e2eBootstrapPromise = null;
/** Single messenger page/session boot orchestrator. */
let bootstrapSessionPromise = null;
/** Unsubscribe from connectionManager → Vuex sync. */
let connectionManagerUnsub = null;
/** Debounce bursty recoverStream triggers (subscribe + connected + start). */
let recoverDebounceTimer = null;
let lastUnreadFetchAt = 0;

function ensureE2eBootstrapped(state) {
  if (!e2eEnabledFromState(state)) return Promise.resolve(false);
  if (e2eBootstrapPromise) return e2eBootstrapPromise;
  e2eBootstrapPromise = bootstrapCrypto()
    .then(() => pullAndConsumeIdentityPackages())
    .then(async () => {
      // New device: try local / server MDS restore, then siblings.
      // Never depend on the peer sending a new message for history unlock.
      if (!(await hasLocalUserIdentityPrivates().catch(() => false))) {
        await trySeamlessIdentityRestore().catch(() => false);
      }
      // Critical path: vault sync when identity is already local.
      const vaultSync = syncKeysAfterLogin({ bypassCooldown: true }).catch((err) => {
        console.warn('[e2e] key sync after login failed', err);
        return 0;
      });
      // Background provisioning — keep UI responsive.
      hasLocalUserIdentityPrivates()
        .then(async (has) => {
          if (has) {
            await ensureSeamlessMultiDeviceBackup().catch(() => false);
            await uploadAllLocalKeysToVault().catch(() => 0);
            return;
          }
          await adoptUserIdentityFromSiblings().catch(() => false);
          await pullAndConsumeIdentityPackages().catch(() => false);
          if (!(await hasLocalUserIdentityPrivates().catch(() => false))) {
            await trySeamlessIdentityRestore().catch(() => false);
          }
          if (await hasLocalUserIdentityPrivates().catch(() => false)) {
            await ensureSeamlessMultiDeviceBackup().catch(() => false);
            await syncKeysAfterLogin({ bypassCooldown: true }).catch(() => 0);
          }
        })
        .catch(() => {});
      await vaultSync;
    })
    .then(() => {
      // Prekey refill is maintenance — never stall first paint / first send.
      refillPrekeysIfLow().catch(() => {});
      return true;
    })
    .catch((err) => {
      console.warn('messenger e2e bootstrap failed', err);
      return false;
    });
  return e2eBootstrapPromise;
}

/** Debounced outbox flush after reconnect / backoff. */
let outboxRetryTimer = null;
let outboxFlushDispatch = null;

function scheduleOutboxRetry(dispatch, delayMs = 0) {
  if (!isMessengerRoute()) return;
  const run = dispatch || outboxFlushDispatch;
  if (!run) return;
  if (outboxRetryTimer) clearTimeout(outboxRetryTimer);
  outboxRetryTimer = setTimeout(() => {
    outboxRetryTimer = null;
    if (!isMessengerRoute()) return;
    run('hydrateAndFlushOutbox').catch(() => {});
  }, Math.max(50, Number(delayMs) || 0));
}

function syncConnectionManagerToStore(commit, dispatch) {
  if (dispatch) outboxFlushDispatch = dispatch;
  if (!connectionRebuildUnsub) {
    connectionRebuildUnsub = connectionManager.onTransportRebuild(() => {
      if (!isMessengerRoute()) return;
      commit('SET_STREAM_CHANNEL', null);
      dispatch('startStream');
    });
  }
  if (connectionManagerUnsub) return;
  let wasSendable = connectionManager.isOnline && !connectionManager.networkConfirmedDown;
  connectionManagerUnsub = connectionManager.subscribe((snap) => {
    const sendable = !!(snap.isOnline && !snap.networkConfirmedDown && snap.authenticated !== false);
    commit('SET_NETWORK_ONLINE', sendable);
    commit('SET_CONNECTION_DISPLAY', snap.displayStatus || 'connecting');
    // Transport state for legacy consumers; UI prefers connectionDisplayStatus.
    if (snap.state === 'unavailable') {
      commit('SET_CONNECTION_STATE', 'unavailable');
      commit('SET_CONNECTION_GRACE', false);
    } else if (snap.state === 'connected') {
      commit('SET_CONNECTION_STATE', 'connected');
      commit('SET_CONNECTION_GRACE', false);
    } else {
      commit('SET_CONNECTION_STATE', 'connecting');
      commit('SET_CONNECTION_GRACE', true);
    }
    // Coming back online (or WS connected): flush queued sends automatically.
    if (sendable && (!wasSendable || snap.state === 'connected')) {
      scheduleOutboxRetry(dispatch || outboxFlushDispatch, 120);
    }
    wasSendable = sendable;
  });
}

function scheduleRecoverStream(dispatch) {
  if (!isMessengerRoute()) return;
  if (recoverDebounceTimer) clearTimeout(recoverDebounceTimer);
  recoverDebounceTimer = setTimeout(() => {
    recoverDebounceTimer = null;
    if (!isMessengerRoute()) return;
    dispatch('recoverStream').catch(() => {});
  }, 120);
}

// TWO independent promise tails (Telegram-like). Never share one map/object —
// text must keep sending while audio/photo uploads run on the media lane.
const textLaneTails = new Map();
const mediaLaneTails = new Map();
let recoveryPromise = null;
let conversationsFetchPromise = null;
/** Drops a stale background list-decrypt if a newer fetch started. */
let conversationsDecryptGen = 0;
let outboxFlushPromise = null;
let settingsFetchPromise = null;
let systemConfigFetchPromise = null;
/** client_ids currently executing a send task — avoid double enqueue. */
const outboxInFlight = new Set();
/**
 * In-memory text outbox rows so a text send never waits on IndexedDB while a
 * large media blob is being persisted (IDB write lock).
 */
const pendingTextRows = new Map();
/** Shared in-flight draft → real conversation promote (Telegram first-send). */
let draftPromotePromise = null;
/**
 * Background create started when the draft chat opens — send only remaps.
 * Shape: { userId, promise: Promise<conversation> }
 */
let draftCreatePrefetch = null;

function queueConversationKey(conversationId) {
  return String(conversationId ?? '');
}

function isDraftConversationId(conversationId) {
  return conversationId === 'draft' || String(conversationId) === 'draft';
}

/**
 * Chain a task onto one lane only. Media uploads never appear on textLaneTails
 * and text never appears on mediaLaneTails — so music upload cannot block text.
 */
function chainSendLane(lane, conversationId, taskFn) {
  const tails = lane === 'media' ? mediaLaneTails : textLaneTails;
  const key = queueConversationKey(conversationId);
  const prev = tails.get(key) || Promise.resolve();
  // Always run next task even if previous rejected.
  const result = prev.then(() => taskFn(), () => taskFn());
  tails.set(key, result.catch(() => {}));
  return result;
}

/**
 * Text sends stay FIFO per conversation so bursts keep order and nothing is lost
 * in flight races. UI still paints instantly; warm crypto keeps each hop ~fast.
 */
function enqueueTextSend(conversationId, taskFn) {
  return chainSendLane('text', conversationId, taskFn);
}

/** Keep FIFO across draft→real remap so first messages never reorder. */
function migrateLaneTails(fromId, toId) {
  const fromKey = queueConversationKey(fromId);
  const toKey = queueConversationKey(toId);
  if (!fromKey || !toKey || fromKey === toKey) return;
  [textLaneTails, mediaLaneTails].forEach((tails) => {
    const fromTail = tails.get(fromKey);
    if (!fromTail) return;
    const toTail = tails.get(toKey) || Promise.resolve();
    tails.set(
      toKey,
      Promise.all([fromTail.catch(() => {}), toTail.catch(() => {})]).then(() => {}),
    );
    tails.delete(fromKey);
  });
}

function isMediaOutboxLane(bubble, row) {
  const type = row?.type || bubble?.type || '';
  if (row?.kind === 'media') return true;
  if (['photo', 'video', 'voice', 'audio', 'file'].includes(type)) return true;
  return false;
}
/** Keep File/Blob refs alive after upload so blob: previews aren't GC'd early. */
const retainedMediaBlobs = new Map();
const bufferedDurableEvents = new Map();
/** Deduplicate concurrent E2E refresh for the same chat. */
const refreshE2eInflight = new Map();
/** One redistribute sweep per tab session (sibling-device catch-up). */
let redistributeSweepAt = 0;
/**
 * Conversations whose unread badge we cleared locally (open / mark-read).
 * Prevents late getConversation / list refresh from resurrecting a stale
 * server unread_count while write-behind is still catching up.
 * Map: conversationId → clearedAt ms
 */
const unreadClearedAt = new Map();
/** Last local unread bump (WS) — keep badge ahead of a lagging list refresh. */
const unreadBumpedAt = new Map();
/** Per-conversation set of message ids already counted as unread (dedupe WS+API). */
const unreadCountedMessageIds = new Map();

function unreadIdKey(conversationId) {
  return String(conversationId);
}

function hasCountedUnreadMessage(conversationId, messageId) {
  if (conversationId == null || messageId == null || !isServerId(messageId)) return false;
  const set = unreadCountedMessageIds.get(unreadIdKey(conversationId));
  return !!(set && set.has(Number(messageId)));
}

function markCountedUnreadMessage(conversationId, messageId) {
  if (conversationId == null || messageId == null || !isServerId(messageId)) return false;
  const key = unreadIdKey(conversationId);
  let set = unreadCountedMessageIds.get(key);
  if (!set) {
    set = new Set();
    unreadCountedMessageIds.set(key, set);
  }
  const id = Number(messageId);
  if (set.has(id)) return false;
  set.add(id);
  // Bound memory per conversation.
  if (set.size > 500) {
    const keep = [...set].slice(-300);
    unreadCountedMessageIds.set(key, new Set(keep));
  }
  return true;
}

function clearCountedUnreadMessages(conversationId) {
  if (conversationId == null) return;
  unreadCountedMessageIds.delete(unreadIdKey(conversationId));
}

function markUnreadCleared(conversationId) {
  if (conversationId == null || conversationId === 'draft') return;
  unreadClearedAt.set(String(conversationId), Date.now());
  unreadBumpedAt.delete(String(conversationId));
  // Keep counted message ids for the session so a replayed message.new
  // after mark-read cannot bump unread again for the same message_id.
}

function clearUnreadClearedMark(conversationId) {
  if (conversationId == null) return;
  unreadClearedAt.delete(String(conversationId));
}

function markUnreadBumped(conversationId) {
  if (conversationId == null || conversationId === 'draft') return;
  unreadBumpedAt.set(String(conversationId), Date.now());
}

function shouldPreserveClearedUnread(state, conversationId, incomingUnread) {
  const id = String(conversationId);
  const clearedAt = unreadClearedAt.get(id);
  if (!clearedAt) return false;
  const serverUnread = Number(incomingUnread) || 0;
  if (serverUnread <= 0) {
    unreadClearedAt.delete(id);
    return false;
  }
  // Active chat: always trust local clear.
  if (Number(state.activeConversationId) === Number(conversationId)) {
    return true;
  }
  // Recently cleared: hold for 90s until server agrees (last_read_at / flush).
  if (Date.now() - clearedAt < 90_000) {
    return true;
  }
  unreadClearedAt.delete(id);
  return false;
}

/**
 * Merge list/API unread with local WS bumps without resurrecting a cleared badge
 * or wiping a fresher realtime count during write-behind lag.
 */
function mergeSidebarUnread(state, conversationId, serverUnread, prevUnread) {
  if (shouldPreserveClearedUnread(state, conversationId, serverUnread)) {
    return 0;
  }
  if (
    Number(state.activeConversationId) === Number(conversationId)
    && !isDraftConversationId(state.activeConversationId)
  ) {
    markUnreadCleared(conversationId);
    return 0;
  }
  const prev = Number(prevUnread) || 0;
  if (serverUnread === undefined || serverUnread === null) {
    return prev;
  }
  const server = Number(serverUnread) || 0;
  if (server >= prev) {
    if (server === 0) unreadBumpedAt.delete(String(conversationId));
    return server;
  }
  const bumpedAt = unreadBumpedAt.get(String(conversationId)) || 0;
  if (bumpedAt && (Date.now() - bumpedAt) < 60_000) {
    return prev;
  }
  return server;
}

/** True when `candidate` is a newer sidebar tip than `current`. */
function isFresherMessage(candidate, current) {
  if (!candidate) return false;
  if (!current) return true;
  if (sameMessageId(candidate.id, current.id)) return false;

  const candServer = isServerId(candidate.id);
  const curServer = isServerId(current.id);
  // Durable ids always win on order — never let a stuck pending flag override.
  if (candServer && curServer) {
    return Number(candidate.id) > Number(current.id);
  }

  const candAt = Date.parse(candidate.created_at || '') || 0;
  const curAt = Date.parse(current.created_at || '') || 0;
  if (candAt && curAt && candAt !== curAt) {
    return candAt > curAt;
  }

  // Just-sent optimistic (no server id yet) beats an older durable tip.
  if (!candServer && curServer) {
    if (candAt && curAt && candAt + 2000 < curAt) return false;
    return true;
  }
  // Durable candidate beats a stuck optimistic / local tip.
  if (candServer && !curServer) {
    if (candAt && curAt && curAt > candAt + 2000) return false;
    return true;
  }

  return candAt >= curAt;
}

/** Drop stale pending/clock flags once a tip is durable or receipt-stamped. */
function normalizeSidebarTip(message) {
  if (!message) return null;
  const durable = isServerId(message.id);
  const settled = !!(message.delivered_at || message.read_at
    || message.send_status === 'sent'
    || message.send_status === 'delivered'
    || message.send_status === 'read');
  if (!durable && !settled) return message;
  if (!message.pending && !message.awaiting_server && !message.queued) return message;
  return {
    ...message,
    pending: false,
    awaiting_server: false,
    queued: false,
    failed: !!message.failed,
  };
}

/** Pick the live sidebar tip, then prefer a decrypted display for the same id. */
function pickSidebarTip(a, b) {
  if (!a) return normalizeSidebarTip(b);
  if (!b) return normalizeSidebarTip(a);
  if (sameMessageId(a.id, b.id)) {
    return normalizeSidebarTip(preferPreviewMessage(a, b));
  }
  const newer = isFresherMessage(b, a) ? b : a;
  return normalizeSidebarTip(newer);
}

/** Per-user typing expiry timers: `${conversationId}:${userId}` → timeoutId */
const typingClearTimers = {};

function scheduleTypingClear(commit, conversationId, userId, ms = 3200) {
  const key = `${conversationId}:${userId}`;
  if (typingClearTimers[key]) clearTimeout(typingClearTimers[key]);
  typingClearTimers[key] = setTimeout(() => {
    delete typingClearTimers[key];
    commit('CLEAR_TYPING_USER', { conversationId, userId });
  }, ms);
}

function authUserId(rootState) {
  const userInfo = rootState.auth?.status?.userInfo;
  return userInfo?.id || userInfo?.value?.id || null;
}

function e2eEnabledFromState(st) {
  if (st?.systemConfig?.e2e?.enabled === false) return false;
  if (st?.systemConfig?.features?.e2e === false) return false;
  return true;
}

function findConversation(st, conversationId) {
  if (!conversationId || !st) return null;
  const id = Number(conversationId);
  const fromList = (st.conversations || []).find((c) => Number(c.id) === id);
  if (fromList) return fromList;
  if (st.overlayConversation && Number(st.overlayConversation.id) === id) {
    return st.overlayConversation;
  }
  if (st.draftConversation && (st.draftConversation.id === conversationId || Number(st.draftConversation.id) === id)) {
    return st.draftConversation;
  }
  return null;
}

function conversationRequiresE2e(st, conversationId) {
  const conv = findConversation(st, conversationId);
  if (!conv) {
    // Draft / unknown: treat private as E2E when feature on.
    return e2eEnabledFromState(st);
  }
  return conversationNeedsE2e(conv, e2eEnabledFromState(st));
}

/** True when conversation involves the given user id (partner / members). */
function conversationIncludesUser(conv, userId) {
  if (!conv || userId == null) return false;
  const uid = Number(userId);
  if (conv.partner?.id != null && Number(conv.partner.id) === uid) return true;
  if (Array.isArray(conv.users) && conv.users.some((u) => Number(u?.id) === uid)) return true;
  return false;
}

/** True when this chat already has encrypted history — never mint a conflicting key. */
function conversationHasE2eHistory(st, conversationId) {
  const conv = findConversation(st, conversationId);
  if (conv?.is_encrypted || Number(conv?.e2e_key_version) > 0) return true;
  if (conv?.last_message?.is_encrypted || conv?.last_message?.e2e) return true;
  const list = (() => {
    if (st.messages?.[conversationId]) return st.messages[conversationId];
    const key = Object.keys(st.messages || {}).find((k) => Number(k) === Number(conversationId));
    return key != null ? st.messages[key] : [];
  })();
  return (list || []).some((m) => (
    (m.is_encrypted || m.e2e)
    && m.id != null
    && Number(m.id) > 0
  ));
}

const keyRequestAt = new Map();
function requestKeyIfNeeded(conversationId, { force = false } = {}) {
  if (conversationId == null || conversationId === 'draft') return;
  const key = String(conversationId);
  const last = keyRequestAt.get(key) || 0;
  // Force path may re-ask every 8s (new-device heal); normal path every 2 min.
  const gap = force ? 8_000 : 120_000;
  if (Date.now() - last < gap) return;
  keyRequestAt.set(key, Date.now());
  requestConversationKey(conversationId).catch(() => {});
}

/** New-device / locked-history heal: pull packages + ask siblings, then re-decrypt. */
let newDeviceHealPromise = null;
let newDeviceHealRanAt = 0;
let lastHealConvCount = 0;
let e2eUnlockPollTimers = [];
let e2eDeviceSyncTimer = null;
let e2eDeviceSyncStartedAt = 0;
let recoverPollTimer = null;
let connectionRebuildUnsub = null;
let lastSiblingFingerprint = '';
let lastSiblingShareAt = 0;
let siblingShareAttempts = 0;
let lastSyncUnlockAt = 0;
/** Prevent overlapping syncE2eAcrossDevices (adopt waits were stacking HTTP storms). */
let syncE2eInflight = null;

function stopE2eUnlockPoller() {
  e2eUnlockPollTimers.forEach((t) => clearTimeout(t));
  e2eUnlockPollTimers = [];
}

function stopE2eDeviceSync() {
  if (e2eDeviceSyncTimer) {
    clearTimeout(e2eDeviceSyncTimer);
    e2eDeviceSyncTimer = null;
  }
}

function startE2eDeviceSync(dispatch) {
  stopE2eDeviceSync();
  e2eDeviceSyncStartedAt = Date.now();
  const tick = () => {
    if (!isMessengerRoute()) return;
    dispatch('syncE2eAcrossDevices').catch(() => {});
    const elapsed = Date.now() - e2eDeviceSyncStartedAt;
    // Avoid HTTP storms on boot: 8s early, then 20s.
    const next = elapsed < 90_000 ? 8000 : 20000;
    e2eDeviceSyncTimer = setTimeout(tick, next);
  };
  // First tick after conversations have a chance to paint.
  e2eDeviceSyncTimer = setTimeout(tick, 2500);
}

function stopRecoverPoll() {
  if (recoverPollTimer) {
    clearTimeout(recoverPollTimer);
    recoverPollTimer = null;
  }
}

function startRecoverPoll(dispatch) {
  stopRecoverPoll();
  const tick = () => {
    if (!isMessengerRoute()) return;
    dispatch('recoverStream').catch(() => {});
    const wsUp = getPusher()?.connection?.state === 'connected';
    recoverPollTimer = setTimeout(tick, wsUp ? 12000 : 4000);
  };
  recoverPollTimer = setTimeout(tick, 1200);
}

/**
 * Keep pulling vault/packages for several minutes after login on a new device
 * so late sibling redistribute / identity transfer still unlocks history
 * without requiring a new message from anyone.
 */
function startE2eUnlockPoller(dispatch) {
  stopE2eUnlockPoller();
  const delays = [
    800, 2000, 4500, 9000, 16000, 28000, 45000,
    70_000, 100_000, 140_000, 200_000, 280_000,
  ];
  delays.forEach((ms) => {
    const t = setTimeout(() => {
      if (!isMessengerRoute()) return;
      dispatch('syncE2eAcrossDevices').catch(() => {});
      dispatch('unlockPendingE2e').catch(() => {});
    }, ms);
    e2eUnlockPollTimers.push(t);
  });
}

function scheduleLockedRefresh(dispatch, conversationId, delays = [4000]) {
  if (conversationId == null || conversationId === 'draft') return;
  delays.forEach((ms) => {
    setTimeout(() => {
      dispatch('refreshE2eMessages', conversationId).catch(() => {});
      dispatch('refreshConversationPreview', conversationId).catch(() => {});
    }, ms);
  });
}

async function maybeDecryptMessage(message) {
  if (!message?.is_encrypted) return message;
  return decryptIncomingMessage(message);
}

/** Prefer a decrypted in-memory message for nested reply_to / pin previews. */
function hydrateNestedMessage(state, conversationId, nested) {
  if (!nested || nested.id == null) return nested;
  if (nested._e2e_decrypted && !nested._e2e_locked && !isLockedE2eBody(nested.body)
    && !looksLikeCiphertextBody(nested.body)) {
    return nested;
  }
  const list = state.messages?.[conversationId] || [];
  const local = list.find((m) => Number(m.id) === Number(nested.id));
  if (!local) return nested;
  if (local._e2e_decrypted && !local._e2e_locked && !isLockedE2eBody(local.body)) {
    return {
      ...nested,
      ...mergeE2eDisplayFields(nested, local),
      body: local.body,
      type: local.type || nested.type,
      meta: local.meta || nested.meta,
      user: local.user || nested.user,
      is_encrypted: local.is_encrypted ?? nested.is_encrypted,
      _e2e_decrypted: true,
      _e2e_locked: false,
      _decryptFailed: false,
      _mediaKey: local._mediaKey || nested._mediaKey,
      _mediaIv: local._mediaIv || nested._mediaIv,
    };
  }
  return nested;
}

function hydrateMessageTree(state, conversationId, message) {
  if (!message) return message;
  let out = message;
  if (out.reply_to) {
    const reply = hydrateNestedMessage(state, conversationId, out.reply_to);
    if (reply !== out.reply_to) out = { ...out, reply_to: reply };
  }
  return out;
}

function isLockedE2eBody(body) {
  // Empty string is valid (e.g. photo/audio with no caption) — only the
  // explicit locked placeholder means decrypt failed.
  return body === LOCKED_PLACEHOLDER;
}

/** Ciphertext still on the wire (base64) or the locked placeholder. */
function isEncryptedDisplayBody(message) {
  if (!message) return false;
  if (message._e2e_decrypted && !message._e2e_locked && !message._decryptFailed) {
    if (isMediaMessageType(message.type) && (message._mediaKey || message.meta?.encrypted)) {
      return false;
    }
    if (message.body != null && message.body !== LOCKED_PLACEHOLDER) {
      if (message.is_encrypted && looksLikeCiphertextBody(message.body)) return true;
      return false;
    }
    if (message.type === 'location' && message.meta?.lat != null) return false;
  }
  const b = String(message.body || '');
  if (b === LOCKED_PLACEHOLDER) return true;
  if (!message.is_encrypted && !message.e2e) return false;
  if (!b) {
    return !!(message.is_encrypted && !message._e2e_decrypted);
  }
  return looksLikeCiphertextBody(b);
}

function looksLikeCiphertextBody(body) {
  const b = String(body || '').trim();
  if (!b || b === LOCKED_PLACEHOLDER) return false;
  return b.length >= 24 && /^[A-Za-z0-9+/=\s]+$/.test(b);
}

/** Prefer a decrypted plaintext preview over ciphertext / locked placeholder. */
function preferPreviewMessage(current, candidate) {
  if (!candidate) return current || null;
  if (!current) return candidate;

  // Different tips: never keep an older unlocked media over a newer message.
  if (!sameMessageId(current.id, candidate.id)) {
    return isFresherMessage(candidate, current) ? candidate : current;
  }

  const candBad = isSidebarPreviewLocked(candidate)
    || (candidate.is_encrypted && !candidate._e2e_decrypted
      && !isMediaMessageType(candidate.type) && candidate.type !== 'location');
  const curBad = isSidebarPreviewLocked(current)
    || (current.is_encrypted && !current._e2e_decrypted
      && !isMediaMessageType(current.type) && current.type !== 'location');

  if (!candBad && curBad) return candidate;
  if (candBad && !curBad) return current;
  return candidate;
}

/** Own plaintext remembered across server/websocket echoes (ciphertext ≠ plaintext). */
const e2ePlaintextByClientId = new Map();

function rememberE2ePlaintext(clientId, body, extra = {}) {
  if (!clientId || body == null) return;
  // Media captions may be empty — still remember file keys.
  const hasMediaKeys = !!(extra._mediaKey && extra._mediaIv);
  if (!hasMediaKeys && (isLockedE2eBody(body) || isEncryptedDisplayBody({ is_encrypted: true, body }))) {
    return;
  }
  e2ePlaintextByClientId.set(clientId, {
    body: String(body),
    _mediaKey: extra._mediaKey || null,
    _mediaIv: extra._mediaIv || null,
    at: Date.now(),
  });
  // Bound memory — drop entries older than 1 hour when map grows.
  if (e2ePlaintextByClientId.size > 200) {
    const cutoff = Date.now() - 3600000;
    e2ePlaintextByClientId.forEach((v, k) => {
      if (v.at < cutoff) e2ePlaintextByClientId.delete(k);
    });
  }
}

function takeRememberedE2ePlaintext(clientId) {
  if (!clientId) return null;
  return e2ePlaintextByClientId.get(clientId) || null;
}

/** Prefer a previously decrypted / optimistic plaintext over a ciphertext echo. */
function mergeE2eDisplayFields(prev, incoming) {
  const remembered = takeRememberedE2ePlaintext(
    incoming?.client_id || prev?.client_id || null,
  );
  const prevPlain = !!(
    (prev?.body && !isLockedE2eBody(prev.body) && !isEncryptedDisplayBody(prev))
    || (prev?._e2e_decrypted && prev?.body && !isLockedE2eBody(prev.body))
  );
  const incomingFailed = !!(
    incoming?._decryptFailed
    || incoming?._e2e_locked
    || isEncryptedDisplayBody(incoming)
    || (incoming?.is_encrypted && !incoming?._e2e_decrypted && isLockedE2eBody(incoming?.body))
  );

  if ((prevPlain || remembered) && incomingFailed) {
    const body = (prevPlain ? prev.body : null) || remembered?.body || prev?.body;
    if (body && !isLockedE2eBody(body) && !isEncryptedDisplayBody({ is_encrypted: true, body })) {
      return {
        body,
        _e2e_decrypted: true,
        _e2e_locked: false,
        _decryptFailed: false,
        _e2e_ciphertext: incoming._e2e_ciphertext
          || (isEncryptedDisplayBody(incoming) ? incoming.body : null)
          || prev._e2e_ciphertext
          || null,
        _mediaKey: incoming._mediaKey || prev?._mediaKey || remembered?._mediaKey || null,
        _mediaIv: incoming._mediaIv || prev?._mediaIv || remembered?._mediaIv || null,
      };
    }
  }
  return {
    _e2e_decrypted: incoming._e2e_decrypted || prev?._e2e_decrypted || false,
    _e2e_locked: incoming._e2e_locked ?? prev?._e2e_locked,
    _decryptFailed: incoming._decryptFailed ?? prev?._decryptFailed,
    _e2e_ciphertext: incoming._e2e_ciphertext || prev?._e2e_ciphertext || null,
    _mediaKey: incoming._mediaKey || prev?._mediaKey,
    _mediaIv: incoming._mediaIv || prev?._mediaIv,
  };
}

/** Unwrap Laravel `{ data: message }` if the API ever double-wraps. */
function normalizeMessagePayload(message) {
  if (!message || typeof message !== 'object') return message;
  const inner = message.data;
  if (
    inner
    && typeof inner === 'object'
    && !Array.isArray(inner)
    && (inner.id != null || inner.client_id)
    && message.type == null
    && message.body === undefined
    && message.meta === undefined
  ) {
    return inner;
  }
  return message;
}

function sameMessageId(a, b) {
  if (a == null || b == null) return false;
  if (a === b) return true;
  if (isServerId(a) && isServerId(b)) return Number(a) === Number(b);
  return String(a) === String(b);
}

function isMediaMessageType(type) {
  return ['photo', 'video', 'voice', 'audio', 'file'].includes(String(type || ''));
}

function normalizeCursor(value) {
  const cursor = String(value ?? '');
  return /^\d+$/.test(cursor) ? cursor.replace(/^0+(?=\d)/, '') : null;
}

function compareCursors(a, b) {
  const left = normalizeCursor(a) || '0';
  const right = normalizeCursor(b) || '0';
  if (left.length !== right.length) return left.length < right.length ? -1 : 1;
  return left === right ? 0 : (left < right ? -1 : 1);
}

function cursorStorageKey(userId) {
  if (typeof window === 'undefined') return null;
  let apiOrigin = window.location.origin;
  try {
    apiOrigin = new URL(config.apiBaseUrl || '/', window.location.origin).origin;
  } catch (e) { /* use page origin */ }
  return `messenger_cursor:${apiOrigin}:${userId}`;
}

function readCursor(userId) {
  const key = cursorStorageKey(userId);
  if (!key) return null;
  try {
    return normalizeCursor(sessionStorage.getItem(key));
  } catch (e) {
    return null;
  }
}

function writeCursor(userId, cursor) {
  const key = cursorStorageKey(userId);
  const normalized = normalizeCursor(cursor);
  if (!key || normalized === null) return;
  try {
    sessionStorage.setItem(key, normalized);
  } catch (e) { /* recovery still works for this page lifetime */ }
}

// Generate a client id used for idempotency + optimistic reconciliation. The
// same id is reused across retries so a send that actually committed on the
// first (deadlocked-looking) attempt is never duplicated by the backend.
function newClientId() {
  return `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// Send a message with automatic retries on *transient* failures only
// (deadlock-contention 409, rate/availability, or network errors). Validation
// and permission errors are surfaced immediately. Navigation aborts are treated
// as retriable (URL sync must never drop an optimistic bubble).
async function sendWithRetry(conversationId, body, clientId, options, attempts = INLINE_SEND_ATTEMPTS) {
  let lastErr;
  for (let i = 0; i < attempts; i += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      return await sendMessage(conversationId, body, clientId, options);
    } catch (e) {
      lastErr = e;
      // Navigation cancel is not a user cancel — keep retrying like a flake.
      if (isRequestCanceled(e)) {
        if (i === attempts - 1) throw e;
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setTimeout(resolve, outboxBackoffMs(i)));
        continue;
      }
      // Never auto-retry client/validation errors (422 etc.) — user taps retry.
      const retriable = isRetriableSendError(e);
      if (!retriable || i === attempts - 1) throw e;
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, outboxBackoffMs(i)));
    }
  }
  throw lastErr;
}

/**
 * Peer-relay ciphertext over the persistent WebSocket before (or without waiting
 * on) the durable Redis/HTTP ack. Recipients subscribed to conversation.{id}
 * paint instantly; server fan-out still covers multi-device + offline.
 */
function whisperOutgoingMessage(conversationId, messagePayload) {
  if (!conversationId || isDraftConversationId(conversationId)) return false;
  return whisperMessage(conversationId, {
    type: 'message.new',
    via: 'ws',
    message: messagePayload,
  });
}

// Pending local File blobs keyed by client_id (for media retry after failure).
const pendingMediaFiles = new Map();
// In-flight AbortControllers keyed by client_id (cancel upload).
const pendingMediaAborts = new Map();

function isRequestCanceled(e) {
  return !!(
    e?.code === 'ERR_CANCELED'
    || e?.name === 'CanceledError'
    || e?.name === 'AbortError'
    || (e?.response?.status === 0 && e?.response?.statusText === 'Canceled')
  );
}

/** Seed Vuex message cache from conversation list rows (recent messages bundle). */
function seedMessagesFromConversations(commit, state, list) {
  (list || []).forEach((conv) => {
    if (!conv?.id || !Array.isArray(conv.messages) || !conv.messages.length) return;
    const conversationId = conv.id;
    const existing = state.messages[conversationId]
      || state.messages[String(conversationId)]
      || state.messages[Number(conversationId)]
      || [];
    // History clear marker — never resurrect older server/local rows past it.
    const clearCutoff = existing.reduce((max, m) => {
      if (m?.system_kind !== 'cleared') return max;
      const t = Date.parse(m.created_at || '');
      return Number.isFinite(t) && t > max ? t : max;
    }, 0);
    const afterClear = (m) => {
      if (!m) return false;
      if (m.system_kind === 'cleared') return true;
      if (!clearCutoff) return true;
      const t = Date.parse(m.created_at || '');
      return Number.isFinite(t) && t > clearCutoff;
    };

    // Always keep local pending/failed outbox bubbles; never wipe them on list refresh.
    const localOnly = existing.filter((m) => (
      (m.pending || m.failed || (!isServerId(m.id) && m.client_id))
      && afterClear(m)
    ));
    // Conversation list only ships a recent window — keep already-loaded settled
    // history that is not in that window (otherwise media/text vanish until refresh).
    const seededIds = new Set(
      (conv.messages || []).filter((m) => isServerId(m.id)).map((m) => Number(m.id)),
    );
    let keepHistory = existing.filter((m) => (
      isServerId(m.id) && !m.pending && !m.failed && !seededIds.has(Number(m.id))
      && afterClear(m)
    ));
    // After clear, drop any pre-clear "keep history" entirely.
    if (clearCutoff) {
      keepHistory = keepHistory.filter(afterClear);
    }
    // Re-attach local blob previews onto seeded server rows so photos don't
    // blank when the conversation list refresh replaces the in-memory copies.
    const localById = new Map();
    const localByClient = new Map();
    existing.forEach((m) => {
      if (m?.meta?.local_url || m?.meta?.local_cover || m?.client_id) {
        if (isServerId(m.id)) localById.set(Number(m.id), m);
        if (m.client_id) localByClient.set(m.client_id, m);
      }
    });
    let seeded = (conv.messages || []).filter(afterClear).map((m) => {
      const prev = (isServerId(m.id) && localById.get(Number(m.id)))
        || (m.client_id && localByClient.get(m.client_id))
        || null;
      if (!prev) return m;
      return {
        ...prev,
        ...m,
        client_id: m.client_id || prev.client_id || null,
        meta: mergeMessageMeta(prev, m),
        pending: false,
        failed: false,
        ...mergeE2eDisplayFields(prev, m),
      };
    });
    // Preserve the local clear note when the list has no post-clear history yet.
    const clearNotes = existing.filter((m) => m?.system_kind === 'cleared');
    const merged = mergeMessageLists(seeded, [...localOnly, ...keepHistory, ...clearNotes]);
    commit('SET_MESSAGES', { conversationId, messages: merged });
    commit('SET_MESSAGES_META', {
      conversationId,
      hasMore: clearCutoff
        ? false
        : (conv.messages_has_more ?? state.messagesMeta[conversationId]?.hasMore ?? false),
    });
    commit('MARK_CONVERSATION_LOADED', conversationId);
  });
}

async function sendMediaWithRetry(conversationId, payload, attempts = INLINE_SEND_ATTEMPTS) {
  let lastErr;
  for (let i = 0; i < attempts; i += 1) {
    if (payload?.abortController?.signal?.aborted) {
      const err = new Error('Upload canceled');
      err.code = 'ERR_CANCELED';
      err.name = 'CanceledError';
      throw err;
    }
    try {
      // eslint-disable-next-line no-await-in-loop
      return await sendMediaMessage(conversationId, payload);
    } catch (e) {
      lastErr = e;
      if (isRequestCanceled(e)) throw e;
      const retriable = isRetriableSendError(e);
      if (!retriable || i === attempts - 1) throw e;
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, outboxBackoffMs(i)));
    }
  }
  throw lastErr;
}

/** Throttled axios progress → Vuex update on the optimistic media bubble. */
function makeUploadProgressHandler(commit, conversationId, clientId, expectedTotal = 0) {
  let lastPct = -1;
  let lastAt = 0;
  let settled = false;
  // Some browsers/proxies omit evt.total — fall back to File.size.
  const fallbackTotal = Number(expectedTotal) > 0 ? Number(expectedTotal) : 0;
  const handler = (evt) => {
    if (settled) return;
    const loaded = Number(evt?.loaded) || 0;
    const total = (Number(evt?.total) > 0 ? Number(evt.total) : 0) || fallbackTotal;
    let pct = 0;
    if (total > 0) pct = Math.min(99, Math.round((loaded / total) * 100));
    else if (loaded > 0) pct = Math.max(lastPct, 1);
    const now = Date.now();
    if (pct === lastPct) return;
    if (pct < 99 && now - lastAt < 80 && pct - lastPct < 2) return;
    lastPct = pct;
    lastAt = now;
    // Only patch progress — never rewrite id/pending (late events after settle
    // were flipping settled media back to a client-id pending bubble).
    commit('UPDATE_MESSAGE', {
      conversationId,
      message: { client_id: clientId, upload_progress: pct },
    });
  };
  handler.markSettled = () => { settled = true; };
  return handler;
}

/** Debounce timer for syncing global wallpaper to server settings. */
let wallpaperSyncTimer = null;

const state = {
  wallpaper: loadWallpaper(), // global default wallpaper (synced + local cache)
  myWallpapers: [],           // user-uploaded gallery from server
  conversationWallpapers: {}, // { [conversationId]: config|null }
  font: loadFont(),           // messenger message-body font id — local-only
  fontSlots: loadFontSlots(), // per-area fonts (ui / message / meta / menu / …)
  conversations: [],
  conversationsPage: 1,
  conversationsHasMore: false,
  conversationsLoadingMore: false,
  activeConversationId: null,
  // A not-yet-created (draft) private chat. Lives only in the UI until the first
  // message is sent; never shown in the sidebar list and never hits the backend.
  draftConversation: null,
  // Active chat that must not appear in the sidebar yet: join previews, or an
  // empty private created for the first outgoing message.
  overlayConversation: null,
  messages: {},          // { [conversationId]: Message[] }
  messagesMeta: {},      // { [conversationId]: { hasMore: bool } }
  pinnedMessages: {},    // { [conversationId]: Message[] } — pinned, oldest first
  loadedConversationIds: {}, // { [conversationId]: true } — messages fetched/seeded at least once
  contacts: [],
  contactsSort: (() => {
    try {
      if (typeof localStorage === 'undefined') return 'name_asc';
      const v = localStorage.getItem('messenger_contacts_sort');
      if (['name_asc', 'name_desc', 'last_seen'].includes(v)) return v;
    } catch (e) { /* noop */ }
    return 'name_asc';
  })(),
  blockedContacts: [],
  presence: {},          // { [userId]: { is_online, last_seen } }
  unreadCount: 0,
  typingUsers: {},       // { [conversationId]: { [userId]: { id, name } } }
  streamChannel: null,   // subscribed Echo channel name
  presenceTimer: null,   // heartbeat interval id
  connected: false,
  connectionState: 'connecting', // connecting | connected | unavailable
  /** Telegram-facing status: connected | connecting | reconnecting | waiting_for_network | offline */
  connectionDisplayStatus: 'connecting',
  /** True when the browser reports online (and probes have not failed). */
  networkOnline: typeof navigator === 'undefined' ? true : navigator.onLine !== false,
  /** Hide the "waiting for network" strip briefly on first connect attempt. */
  connectionGrace: true,
  /** MessengerPage finished auth + bootstrap + route sync (safe to paint chat). */
  sessionReady: false,
  loading: false,
  contactsLoading: false,
  blockedLoading: false,
  messagesLoading: false, // initial history fetch for the active conversation
  sending: false,
  selectionMode: false,
  selectedIds: [],       // selected message ids (multi-select)
  replyTo: null,         // message being replied to / quoted
  /** While picking a forward target in the sidebar. */
  forwardPick: null,     // { messageIds, messages, dropAuthor }
  /** After a target chat is opened — shown above the composer. */
  pendingForward: null,  // { messageIds, messages, dropAuthor }
  settings: {
    enter_to_send: true,
    quote_with_title: true,
    forward_tap_to_chat: true,
    auto_download: defaultAutoDownload(),
    auto_play: defaultAutoPlay(),
    auto_download_photos: false,
    auto_download_videos: false,
    auto_download_files: false,
    auto_download_voice: false,
    auto_download_audio: false,
    wallpaper: 'default',
    theme: null,
    locale: null,
    show_online: true,
    show_last_seen: true,
    show_phone: false,
    show_email: false,
    privacy: {
      last_seen: { rule: 'everybody', always_allow: [], never_allow: [] },
      online: { rule: 'everybody', always_allow: [], never_allow: [] },
      profile_photo: { rule: 'everybody', always_allow: [], never_allow: [] },
      bio: { rule: 'everybody', always_allow: [], never_allow: [] },
      phone: { rule: 'nobody', always_allow: [], never_allow: [] },
    },
  },
  /** Device contact sync result: registered + inviteable */
  syncedContacts: {
    registered: [],
    inviteable: [],
    last_synced_at: null,
  },
  syncedContactsLoading: false,
  /** Admin-controlled feature flags / upload limits from GET /messenger/config */
  systemConfig: null,
  accessBlocked: false,
  accessBlockedMessage: null,
  /** Identity recovery passphrase: set on this device, restore on a new one. */
  e2eRecovery: {
    hasBackup: false,
    hasLocalPrivates: false,
    pending: false,
    prompt: null,
  },
  /** Local composer drafts keyed by conversation id (not synced). */
  drafts: loadAllDrafts(),
};

const mutations = {
  SET_WALLPAPER(state, cfg) {
    state.wallpaper = normalizeWallpaper({ ...state.wallpaper, ...(cfg || {}) });
    saveWallpaper(state.wallpaper);
  },
  REPLACE_WALLPAPER(state, cfg) {
    state.wallpaper = normalizeWallpaper(cfg || {});
    saveWallpaper(state.wallpaper);
  },
  SET_MY_WALLPAPERS(state, list) {
    state.myWallpapers = Array.isArray(list) ? list : [];
  },
  PREPEND_MY_WALLPAPER(state, item) {
    if (!item?.id) return;
    const rest = state.myWallpapers.filter((w) => Number(w.id) !== Number(item.id));
    state.myWallpapers = [item, ...rest];
  },
  REMOVE_MY_WALLPAPER(state, wallpaperId) {
    state.myWallpapers = state.myWallpapers.filter((w) => Number(w.id) !== Number(wallpaperId));
  },
  SET_CONVERSATION_WALLPAPER(state, { conversationId, config }) {
    if (conversationId == null) return;
    const key = String(conversationId);
    state.conversationWallpapers = {
      ...state.conversationWallpapers,
      [key]: config ? normalizeWallpaper(config) : null,
    };
  },
  SET_FONT(state, id) {
    state.font = id;
    saveFont(id);
    state.fontSlots = loadFontSlots();
  },
  SET_FONT_SLOT(state, { slot, id }) {
    state.fontSlots = saveFontSlot(slot, id);
    if (slot === 'message') state.font = id;
  },
  SET_FONT_SLOTS(state, slots) {
    state.fontSlots = saveFontSlots(slots);
    state.font = state.fontSlots.message;
  },
  RESET_FONT_SLOTS(state, dir) {
    state.fontSlots = resetFontSlots(dir);
    state.font = state.fontSlots.message;
  },
  APPLY_FONT_DIRECTION(state, dir) {
    state.fontSlots = applyDirectionFontDefaults(dir);
    state.font = state.fontSlots.message;
  },
  SET_CONVERSATIONS(state, list) {
    const prevById = new Map(
      (state.conversations || []).map((c) => [String(c.id), c]),
    );
    state.conversations = (list || []).filter((c) => {
      if (!c || c.is_preview) return false;
      if (c.type === 'private' && !c.last_message && !c.last_message_at) return false;
      return true;
    }).map((c) => {
      const prev = prevById.get(String(c.id));
      let unread = mergeSidebarUnread(state, c.id, c.unread_count, prev?.unread_count);
      let last = c.last_message;

      // When this chat's history is loaded locally, the in-memory tip is source
      // of truth (clear / delete must not be overwritten by a stale list tip).
      const localKey = Object.prototype.hasOwnProperty.call(state.messages, c.id)
        ? c.id
        : (Object.prototype.hasOwnProperty.call(state.messages, String(c.id))
          ? String(c.id)
          : Object.keys(state.messages || {}).find((k) => Number(k) === Number(c.id)));
      const localMsgs = (localKey != null ? state.messages[localKey] : null) || [];
      const loaded = !!(state.loadedConversationIds[c.id]
        || state.loadedConversationIds[String(c.id)]
        || state.loadedConversationIds[Number(c.id)]);
      if (loaded) {
        const nonSystem = localMsgs.filter((m) => m && m.type !== 'system');
        const tip = nonSystem.length
          ? nonSystem[nonSystem.length - 1]
          : (localMsgs.length ? localMsgs[localMsgs.length - 1] : null);
        if (tip) {
          last = pickSidebarTip(prev?.last_message, tip);
          last = applyCachedSidebarPreview(c.id, last);
        } else {
          last = null;
        }
      } else {
        // Never let a lagging list response stomp a fresher realtime tip.
        last = pickSidebarTip(prev?.last_message, last);
        if (last) {
          last = applyCachedSidebarPreview(c.id, last);
          if (
            prev?.last_message
            && sameMessageId(prev.last_message.id, last.id)
          ) {
            last = {
              ...last,
              delivered_at: last.delivered_at || prev.last_message.delivered_at || null,
              read_at: last.read_at || prev.last_message.read_at || null,
            };
          }
        } else if (prev?.last_message?.system_kind === 'cleared') {
          last = prev.last_message;
        }
      }

      return {
        ...c,
        unread_count: unread,
        last_message: last,
        last_message_at: last?.created_at || c.last_message_at || prev?.last_message_at || null,
      };
    }).filter((c) => {
      if (!c || c.is_preview) return false;
      if (c.type === 'private' && !c.last_message && !c.last_message_at) return false;
      return true;
    });
    // Keep navbar/global badge aligned with sidebar rows.
    // Prefer meta.total_unread (SET_UNREAD_COUNT right after) when the API provides it.
    state.unreadCount = state.conversations.reduce(
      (sum, c) => sum + (Number(c.unread_count) || 0),
      0,
    );
  },
  APPEND_CONVERSATIONS(state, list) {
    const existingIds = new Set(state.conversations.map((c) => c.id));
    const fresh = (list || []).filter((c) => {
      if (!c?.id || existingIds.has(c.id)) return false;
      if (c.is_preview) return false;
      if (c.type === 'private' && !c.last_message && !c.last_message_at) return false;
      return true;
    });
    state.conversations = [...state.conversations, ...fresh];
  },
  SET_CONVERSATIONS_PAGINATION(state, { page, hasMore }) {
    if (page !== undefined) state.conversationsPage = page;
    if (hasMore !== undefined) state.conversationsHasMore = hasMore;
  },
  SET_CONVERSATIONS_LOADING_MORE(state, val) {
    state.conversationsLoadingMore = val;
  },
  SET_ACTIVE_CONVERSATION(state, id) {
    state.activeConversationId = id;
    if (!id || id === 'draft') state.messagesLoading = false;
  },
  SET_DRAFT_CONVERSATION(state, conv) {
    if (!conv?.partner?.id || Number(draftCreatePrefetch?.userId) !== Number(conv.partner.id)) {
      draftCreatePrefetch = null;
    }
    state.draftConversation = conv;
  },
  CLEAR_DRAFT_CONVERSATION(state) {
    state.draftConversation = null;
    draftCreatePrefetch = null;
  },
  SET_OVERLAY_CONVERSATION(state, conv) {
    state.overlayConversation = conv || null;
  },
  CLEAR_OVERLAY_CONVERSATION(state) {
    state.overlayConversation = null;
  },
  SET_MESSAGES(state, { conversationId, messages }) {
    state.messages = { ...state.messages, [conversationId]: sortMessages(messages || []) };
  },
  SET_MESSAGES_META(state, { conversationId, hasMore }) {
    state.messagesMeta = {
      ...state.messagesMeta,
      [conversationId]: { ...(state.messagesMeta[conversationId] || {}), hasMore: !!hasMore },
    };
  },
  MARK_CONVERSATION_LOADED(state, conversationId) {
    if (state.loadedConversationIds[conversationId]) return;
    state.loadedConversationIds = { ...state.loadedConversationIds, [conversationId]: true };
  },
  // Replace a conversation's history with a single "history cleared" system
  // note. Used for clear-history so the chat shows why it's empty and by whom.
  SET_CONVERSATION_CLEARED(state, payload) {
    const conversationId = typeof payload === 'object' ? payload.conversationId : payload;
    const byMe = typeof payload === 'object' ? !!payload.byMe : true;
    const actorName = typeof payload === 'object' ? (payload.actorName || '') : '';
    const note = {
      id: `sys_clear_${conversationId}_${Date.now()}`,
      type: 'system',
      system_kind: 'cleared',
      system_by_me: byMe,
      system_actor: actorName,
      created_at: new Date().toISOString(),
    };
    state.messages = { ...state.messages, [conversationId]: [note] };
    state.messagesMeta = {
      ...state.messagesMeta,
      [conversationId]: { ...(state.messagesMeta[conversationId] || {}), hasMore: false },
    };
    // Sidebar must drop the old tip immediately (not wait on a soft prefer).
    clearSidebarPreview(conversationId);
    const idx = state.conversations.findIndex((c) => c.id === conversationId
      || Number(c.id) === Number(conversationId));
    if (idx !== -1) {
      const list = [...state.conversations];
      list[idx] = {
        ...list[idx],
        last_message: note,
        last_message_at: note.created_at,
      };
      state.conversations = list;
    }
    if (state.overlayConversation
      && (state.overlayConversation.id === conversationId
        || Number(state.overlayConversation.id) === Number(conversationId))) {
      state.overlayConversation = {
        ...state.overlayConversation,
        last_message: note,
        last_message_at: note.created_at,
      };
    }
  },
  APPEND_MESSAGE(state, { conversationId, message: rawMessage }) {
    const message = normalizeMessagePayload(rawMessage);
    if (!message) return;
    const existing = state.messages[conversationId] || [];
    const settle = (prev) => {
      const incomingType = message.type || prev.type || 'text';
      // Never let an incomplete echo demote a media bubble to plain text.
      const type = (isMediaMessageType(prev.type) && !isMediaMessageType(incomingType))
        ? prev.type
        : incomingType;
      const prevId = prev?.id;
      const nextId = message.id;
      // Keep a real server id if the echo omits / sends a client id.
      let id = nextId;
      if (isServerId(prevId) && !isServerId(nextId)) id = prevId;
      // Preserve the optimistic client_id forever — Vue :key depends on it, and
      // a later collision must not steal another message's client_id onto media.
      const sameClient = !!(message.client_id && prev.client_id && message.client_id === prev.client_id);
      const clientId = sameClient
        ? prev.client_id
        : (prev.client_id || message.client_id || null);
      // If types diverge and client_ids don't match, keep the previous body/meta
      // shape for media so a text echo with a colliding id cannot blank the photo.
      const collidingType = isMediaMessageType(prev.type)
        && !isMediaMessageType(incomingType)
        && !sameClient
        && isServerId(prevId)
        && isServerId(nextId)
        && Number(prevId) === Number(nextId);
      if (collidingType) {
      return {
        ...prev,
        id: prevId,
        type: prev.type,
        client_id: prev.client_id || null,
        meta: mergeMessageMeta(prev, { meta: prev.meta }),
        pending: false,
        failed: false,
        awaiting_server: false,
        upload_progress: null,
        send_status: deriveSendStatus({ ...prev, pending: false, failed: false }),
        local_seq: prev.local_seq || null,
      };
    }
      const settled = {
        ...prev,
        ...message,
        id,
        type,
        client_id: clientId,
        meta: mergeMessageMeta(prev, message),
        local_seq: prev.local_seq || message.local_seq || null,
        created_at: message.created_at || prev.created_at,
        pending: false,
        failed: false,
        awaiting_server: false,
        upload_progress: null,
        ...mergeReceiptFields(prev, message),
        ...mergeE2eDisplayFields(prev, message),
      };
      return withSettledSendStatus(settled);
    };

    let next = existing;

    if (message.client_id) {
      const idx = existing.findIndex((m) => m.client_id && m.client_id === message.client_id);
      if (idx !== -1) {
        next = existing.slice();
        next[idx] = settle(existing[idx]);
        const sid = message.id;
        if (sid != null) {
          for (let i = next.length - 1; i >= 0; i -= 1) {
            if (i !== idx && sameMessageId(next[i].id, sid)) next.splice(i, 1);
          }
        }
        state.messages = { ...state.messages, [conversationId]: sortMessages(next) };
        return;
      }
    }

    if (message.id != null) {
      const byId = existing.findIndex((m) => sameMessageId(m.id, message.id));
      if (byId !== -1) {
        const prev = existing[byId];
        // Hard guard: never fold a different-type message onto a settled media
        // row unless client_id matches (Redis/Postgres id collision leftover).
        const typeClash = isMediaMessageType(prev.type)
          && !isMediaMessageType(message.type)
          && !(message.client_id && prev.client_id && message.client_id === prev.client_id);
        if (typeClash) {
          // Keep media; append the incoming as a distinct bubble with a synthetic
          // offset only if it is not already represented by client_id elsewhere.
          if (message.client_id && existing.some((m) => m.client_id === message.client_id)) {
            return;
          }
          state.messages = {
            ...state.messages,
            [conversationId]: sortMessages([...existing, message]),
          };
          return;
        }
        next = existing.slice();
        next[byId] = settle(prev);
        const uid = message.user_id;
        const body = message.body;
        const type = String(message.type || 'text');
        // Never body-match media — empty captions collide across photos/videos.
        const allowBodyMatch = !isMediaMessageType(type);
        next = next.filter((m, i) => {
          if (i === byId) return true;
          if (!(m.pending || m.failed)) return true;
          if (message.client_id && m.client_id === message.client_id) return false;
          if (!allowBodyMatch || isMediaMessageType(m.type)) return true;
          if (uid != null && Number(m.user_id) === Number(uid)
            && String(m.body || '') === String(body || '')
            && String(m.type || 'text') === type
            && typeof m.id === 'string') {
            return false;
          }
          return true;
        });
        state.messages = { ...state.messages, [conversationId]: sortMessages(next) };
        return;
      }
    }

    if (message.user_id != null && !message.pending && !isMediaMessageType(message.type)
      && !message.is_encrypted) {
      const body = String(message.body || '');
      const type = String(message.type || 'text');
      const idx = existing.findIndex((m) => (
        (m.pending || m.failed)
        && typeof m.id === 'string'
        && !isMediaMessageType(m.type)
        && Number(m.user_id) === Number(message.user_id)
        && String(m.body || '') === body
        && String(m.type || 'text') === type
        && (!message.client_id || !m.client_id || m.client_id === message.client_id)
      ));
      if (idx !== -1) {
        next = existing.slice();
        next[idx] = settle(existing[idx]);
        state.messages = { ...state.messages, [conversationId]: sortMessages(next) };
        return;
      }
    }

    state.messages = {
      ...state.messages,
      [conversationId]: sortMessages([...existing, message]),
    };
  },
  ADD_OPTIMISTIC_MESSAGE(state, { conversationId, message }) {
    const existing = state.messages[conversationId] || [];
    const withSeq = {
      ...message,
      local_seq: message.local_seq || nextLocalSeq(),
    };
    state.messages = {
      ...state.messages,
      [conversationId]: sortMessages([...existing, withSeq]),
    };
  },
  // Flag an optimistic message as failed (kept in the list so it's never lost).
  // Match pending OR awaiting_server — a late failure must still flip the bubble.
  MARK_MESSAGE_FAILED(state, { conversationId, clientId }) {
    const existing = state.messages[conversationId] || [];
    state.messages = {
      ...state.messages,
      [conversationId]: existing.map(
        (m) => (m.client_id === clientId && (m.pending || m.awaiting_server || m.send_status === SEND_STATUS.SENDING || m.send_status === SEND_STATUS.QUEUED) && !isServerId(m.id)
          ? {
            ...m,
            pending: false,
            awaiting_server: false,
            failed: true,
            send_status: SEND_STATUS.FAILED,
            upload_progress: null,
          }
          : m),
      ),
    };
  },
  // Drop a failed optimistic message from the local queue (never hit the server).
  REMOVE_FAILED_MESSAGE(state, { conversationId, clientId }) {
    const existing = state.messages[conversationId] || [];
    state.messages = {
      ...state.messages,
      [conversationId]: existing.filter((m) => m.client_id !== clientId),
    };
  },
  UPDATE_MESSAGE(state, { conversationId, message: rawMessage }) {
    const message = normalizeMessagePayload(rawMessage);
    if (!message) return;
    const existing = state.messages[conversationId] || [];
    const mid = message?.id;
    const cid = message?.client_id;
    state.messages = {
      ...state.messages,
      [conversationId]: existing.map((m) => {
        const match = (mid != null && sameMessageId(m.id, mid))
          || (cid != null && (m.client_id === cid || m.id === cid));
        if (!match) return m;
        // Ignore progress-only patches once the bubble already settled on a server id.
        // Late XHR progress after APPEND used to keep mutating the row and could race
        // the next send's reconciliation.
        const progressOnly = message
          && Object.keys(message).every((k) => (
            k === 'client_id' || k === 'id' || k === 'upload_progress' || k === 'pending'
          ))
          && Object.prototype.hasOwnProperty.call(message, 'upload_progress');
        if (progressOnly && isServerId(m.id) && !m.pending) {
          return m;
        }
        const next = {
          ...m,
          ...message,
          client_id: message.client_id || m.client_id || null,
          ...mergeReceiptFields(m, message),
          ...mergeE2eDisplayFields(m, message),
        };
        if (message.type == null && m.type) next.type = m.type;
        if (isMediaMessageType(m.type) && message.type && !isMediaMessageType(message.type)) {
          next.type = m.type;
        }
        if (message.meta !== undefined) {
          next.meta = mergeMessageMeta(m, message);
        }
        // Stale upload-progress patches used to rewrite a settled server id
        // back to the client id and flip pending:true — media then vanished
        // when the next send reconciled against that fake pending row.
        if (isServerId(m.id) && !isServerId(message?.id)) {
          next.id = m.id;
        }
        if (isServerId(m.id) && !m.pending && message?.pending === true) {
          next.pending = false;
          if (Object.prototype.hasOwnProperty.call(message, 'upload_progress')) {
            next.upload_progress = null;
          }
        }
        // Keep send_status in sync with receipts / pending flags.
        if (!next.pending && !next.failed && isServerId(next.id)) {
          next.send_status = deriveSendStatus(next);
          next.awaiting_server = false;
        } else if (next.failed) {
          next.send_status = SEND_STATUS.FAILED;
        } else if (next.pending && !next.send_status) {
          next.send_status = SEND_STATUS.QUEUED;
        }
        return next;
      }),
    };
  },
  SET_MESSAGE_REACTIONS(state, { conversationId, messageId, reactions }) {
    const existing = state.messages[conversationId] || [];
    state.messages = {
      ...state.messages,
      [conversationId]: existing.map((m) => (m.id === messageId ? { ...m, reactions } : m)),
    };
  },
  PREPEND_CONVERSATION(state, conv) {
    if (!conv?.id || state.conversations.some((c) => Number(c.id) === Number(conv.id))) return;
    // Never park join-previews or empty private chats in the sidebar list.
    if (conv.is_preview) return;
    if (conv.type === 'private' && !conv.last_message && !conv.last_message_at) return;
    state.conversations = [conv, ...state.conversations];
  },
  UPSERT_CONVERSATION(state, conversation) {
    if (!conversation?.id) return;
    const id = Number(conversation.id);
    const idx = state.conversations.findIndex((c) => Number(c.id) === id);
    if (idx >= 0) {
      const next = [...state.conversations];
      const prev = next[idx];

      const localKey = Object.prototype.hasOwnProperty.call(state.messages, id)
        ? id
        : (Object.prototype.hasOwnProperty.call(state.messages, String(id))
          ? String(id)
          : Object.keys(state.messages || {}).find((k) => Number(k) === id));
      const localMsgs = (localKey != null ? state.messages[localKey] : null) || [];
      const loaded = !!(state.loadedConversationIds[id] || state.loadedConversationIds[String(id)]);
      const incoming = conversation.last_message;
      const prevLast = prev.last_message;

      let mergedLast;
      if (loaded) {
        // Local history is authoritative after clear / delete / send.
        const nonSystem = localMsgs.filter((m) => m && m.type !== 'system');
        const tip = nonSystem.length
          ? nonSystem[nonSystem.length - 1]
          : (localMsgs.length ? localMsgs[localMsgs.length - 1] : null);
        if (!tip) {
          mergedLast = null;
          clearSidebarPreview(id);
        } else {
          if (prevLast && !sameMessageId(prevLast.id, tip.id)) {
            clearSidebarPreview(id);
          }
          mergedLast = pickSidebarTip(prevLast, tip);
          mergedLast = applyCachedSidebarPreview(id, mergedLast);
        }
      } else if (!incoming) {
        // Server has no tip — keep fresher local / optimistic tip.
        mergedLast = prevLast || null;
        if (!mergedLast) clearSidebarPreview(id);
      } else {
        if (prevLast && !sameMessageId(prevLast.id, incoming.id) && isFresherMessage(incoming, prevLast)) {
          clearSidebarPreview(id);
        }
        mergedLast = pickSidebarTip(prevLast, incoming);
        mergedLast = applyCachedSidebarPreview(id, mergedLast) || mergedLast;
      }

      // Preserve delivery/read ticks on the same last message when the server
      // row is briefly behind realtime events.
      if (
        prevLast
        && mergedLast
        && sameMessageId(prevLast.id, mergedLast.id)
      ) {
        mergedLast = {
          ...mergedLast,
          delivered_at: mergedLast.delivered_at || prevLast.delivered_at || null,
          read_at: mergedLast.read_at || prevLast.read_at || null,
        };
      }

      const unread = mergeSidebarUnread(
        state,
        id,
        conversation.unread_count,
        prev.unread_count,
      );

      const merged = {
        ...prev,
        ...conversation,
        id: prev.id,
        unread_count: unread,
        last_message: mergedLast,
        last_message_at: mergedLast?.created_at
          || conversation.last_message_at
          || prev.last_message_at,
        // Never let a sparse WS/API payload wipe partner identity (causes "—" / "?" flash).
        partner: conversation.partner?.id != null ? conversation.partner : (prev.partner || null),
        pivot: conversation.pivot || prev.pivot,
        my_role: conversation.my_role || conversation.pivot?.role || prev.my_role || prev.pivot?.role || null,
        users: (Array.isArray(conversation.users) && conversation.users.length)
          ? conversation.users
          : (prev.users || []),
        member_count: conversation.member_count ?? prev.member_count,
      };
      // Drop leaked previews / empty privates from the list when refreshed as such.
      if (merged.is_preview || (merged.type === 'private' && !merged.last_message && !merged.last_message_at)) {
        next.splice(idx, 1);
        state.conversations = next;
        return;
      }
      next[idx] = merged;
      state.conversations = next;
      if (merged.last_message && merged.last_message.type !== 'system') {
        cacheSidebarPreview(id, merged.last_message);
      }
      return;
    }
    // New rows: only real chats that belong in the sidebar.
    if (conversation.is_preview) return;
    if (conversation.type === 'private' && !conversation.last_message && !conversation.last_message_at) return;
    const last = applyCachedSidebarPreview(id, conversation.last_message);
    const unread = mergeSidebarUnread(state, id, conversation.unread_count ?? 0, 0);
    state.conversations = [{ ...conversation, unread_count: unread, last_message: last }, ...state.conversations];
    if (last && last.type !== 'system') cacheSidebarPreview(id, last);
  },
  REMOVE_MESSAGE(state, { conversationId, messageId }) {
    const existing = state.messages[conversationId] || [];
    stopMediaPlayerIfMessage(messageId);
    state.messages = {
      ...state.messages,
      [conversationId]: existing.filter((m) => !sameMessageId(m.id, messageId)
        && !(m.client_id != null && String(m.client_id) === String(messageId))),
    };
  },
  SET_PINNED(state, { conversationId, messages }) {
    state.pinnedMessages = { ...state.pinnedMessages, [conversationId]: messages };
  },
  ADD_PINNED(state, { conversationId, message }) {
    const existing = state.pinnedMessages[conversationId] || [];
    if (existing.some((m) => m.id === message.id)) return;
    const list = [...existing, message].sort((a, b) => a.id - b.id);
    state.pinnedMessages = { ...state.pinnedMessages, [conversationId]: list };
  },
  REMOVE_PINNED(state, { conversationId, messageId }) {
    const existing = state.pinnedMessages[conversationId];
    if (!existing) return;
    state.pinnedMessages = {
      ...state.pinnedMessages,
      [conversationId]: existing.filter((m) => m.id !== messageId),
    };
  },
  CLEAR_PINNED(state, conversationId) {
    state.pinnedMessages = { ...state.pinnedMessages, [conversationId]: [] };
  },
  SET_CONTACTS(state, list) {
    state.contacts = Array.isArray(list) ? list : [];
  },
  SET_CONTACTS_SORT(state, sort) {
    const next = ['name_asc', 'name_desc', 'last_seen'].includes(sort) ? sort : 'name_asc';
    state.contactsSort = next;
    try { localStorage.setItem('messenger_contacts_sort', next); } catch (e) { /* noop */ }
  },
  /** Merge fields into an existing contact (optimistic rename / patch). */
  PATCH_CONTACT(state, patch) {
    if (!patch?.id) return;
    const idx = state.contacts.findIndex((c) => Number(c.id) === Number(patch.id));
    if (idx === -1) return;
    const next = state.contacts.slice();
    next[idx] = { ...next[idx], ...patch };
    state.contacts = next;
  },
  SET_UNREAD_COUNT(state, count) {
    state.unreadCount = count;
  },
  SET_TYPING(state, { conversationId, user }) {
    if (!conversationId || user?.id == null) return;
    const uid = String(user.id);
    const prev = state.typingUsers[conversationId] || {};
    state.typingUsers = {
      ...state.typingUsers,
      [conversationId]: {
        ...prev,
        [uid]: {
          id: user.id,
          name: user.name || '',
          activity: user.activity || 'typing',
        },
      },
    };
  },
  CLEAR_TYPING_USER(state, { conversationId, userId }) {
    if (!conversationId || userId == null) return;
    const prev = state.typingUsers[conversationId];
    if (!prev) return;
    const uid = String(userId);
    if (!prev[uid]) return;
    const next = { ...prev };
    delete next[uid];
    const copy = { ...state.typingUsers };
    if (Object.keys(next).length) copy[conversationId] = next;
    else delete copy[conversationId];
    state.typingUsers = copy;
  },
  CLEAR_TYPING(state, conversationId) {
    const copy = { ...state.typingUsers };
    delete copy[conversationId];
    state.typingUsers = copy;
  },
  SET_STREAM_CHANNEL(state, name) {
    state.streamChannel = name;
  },
  SET_CONNECTED(state, val) {
    state.connected = val;
  },
  SET_CONNECTION_STATE(state, val) {
    state.connectionState = val;
    state.connected = val === 'connected';
    if (val === 'connected') {
      state.connectionGrace = false;
      state.connectionDisplayStatus = 'connected';
    } else if (val === 'unavailable') {
      state.connectionDisplayStatus = state.networkOnline
        ? 'waiting_for_network'
        : 'offline';
    } else if (val === 'connecting') {
      if (state.connectionDisplayStatus === 'connected') {
        state.connectionDisplayStatus = 'reconnecting';
      } else if (
        state.connectionDisplayStatus !== 'reconnecting'
        && state.connectionDisplayStatus !== 'connecting'
      ) {
        state.connectionDisplayStatus = 'connecting';
      }
    }
  },
  SET_CONNECTION_DISPLAY(state, val) {
    state.connectionDisplayStatus = val || 'connecting';
    if (val === 'connected') {
      state.connected = true;
      state.connectionGrace = false;
    } else if (val === 'offline') {
      state.networkOnline = false;
    }
  },
  SET_E2E_RECOVERY(state, payload) {
    state.e2eRecovery = {
      ...state.e2eRecovery,
      ...(payload || {}),
    };
  },
  SET_CONNECTION_GRACE(state, val) {
    state.connectionGrace = !!val;
  },
  SET_SESSION_READY(state, val) {
    state.sessionReady = !!val;
  },
  SET_NETWORK_ONLINE(state, val) {
    state.networkOnline = !!val;
  },
  SET_DRAFT_TEXT(state, { conversationId, text }) {
    const id = String(conversationId);
    const trimmed = String(text || '');
    const next = { ...state.drafts };
    if (!trimmed.trim()) {
      delete next[id];
    } else {
      next[id] = { text: trimmed, updated_at: new Date().toISOString() };
    }
    state.drafts = next;
    saveDraft(conversationId, trimmed);
  },
  CLEAR_DRAFT_TEXT(state, conversationId) {
    const id = String(conversationId);
    if (!state.drafts[id]) return;
    const next = { ...state.drafts };
    delete next[id];
    state.drafts = next;
    clearDraft(conversationId);
  },
  MARK_CONVERSATION_READ(state, payload) {
    const conversationId = (payload && typeof payload === 'object')
      ? payload.conversationId
      : payload;
    const myUserId = (payload && typeof payload === 'object')
      ? payload.myUserId
      : null;
    const messageIds = (payload && typeof payload === 'object' && Array.isArray(payload.messageIds))
      ? payload.messageIds.map((id) => Number(id)).filter((id) => Number.isFinite(id))
      : null;
    const readAt = (payload && typeof payload === 'object' && payload.readAt)
      ? payload.readAt
      : null;
    if (conversationId == null) return;
    const cidKey = Object.keys(state.messages || {}).find(
      (k) => Number(k) === Number(conversationId),
    );
    const existing = cidKey != null
      ? state.messages[cidKey]
      : state.messages[conversationId];
    const now = readAt || new Date().toISOString();
    const idSet = messageIds?.length ? new Set(messageIds) : null;
    // Only stamp outbound messages (mine). Receipts are monotonic — never clear read_at.
    const stampMine = (m) => {
      if (!m || m.read_at) return m;
      if (myUserId != null && m.user_id != null && Number(m.user_id) !== Number(myUserId)) {
        return m;
      }
      if (idSet && isServerId(m.id) && !idSet.has(Number(m.id))) {
        return m;
      }
      const next = { ...m, read_at: now, delivered_at: m.delivered_at || now };
      next.send_status = deriveSendStatus(next);
      return next;
    };
    if (existing) {
      const key = cidKey != null ? cidKey : conversationId;
      state.messages = {
        ...state.messages,
        [key]: existing.map(stampMine),
      };
    }
    // Keep sidebar ticks in sync with the last message status.
    const idx = state.conversations.findIndex((c) => Number(c.id) === Number(conversationId));
    if (idx === -1) return;
    const conv = state.conversations[idx];
    const lm = conv?.last_message;
    if (lm && !lm.read_at && (myUserId == null || Number(lm.user_id) === Number(myUserId))) {
      const list = [...state.conversations];
      list[idx] = {
        ...conv,
        last_message: { ...lm, read_at: now, delivered_at: lm.delivered_at || now },
      };
      state.conversations = list;
    }
  },
  MARK_MESSAGES_DELIVERED(state, { conversationId, messageIds, deliveredAt }) {
    const cidKey = Object.keys(state.messages || {}).find(
      (k) => Number(k) === Number(conversationId),
    );
    const existing = cidKey != null
      ? state.messages[cidKey]
      : state.messages[conversationId];
    if (!existing || !messageIds?.length) return;
    const idSet = new Set(messageIds.map((id) => Number(id)));
    const at = deliveredAt || new Date().toISOString();
    const key = cidKey != null ? cidKey : conversationId;
    state.messages = {
      ...state.messages,
      [key]: existing.map((m) => {
        if (!idSet.has(Number(m.id))) return m;
        // Monotonic: never demote Read → Delivered; only fill missing delivered_at.
        if (m.read_at || m.delivered_at) return m;
        const next = { ...m, delivered_at: at };
        next.send_status = deriveSendStatus(next);
        return next;
      }),
    };
    const idx = state.conversations.findIndex((c) => Number(c.id) === Number(conversationId));
    if (idx === -1) return;
    const conv = state.conversations[idx];
    const lm = conv?.last_message;
    if (lm && idSet.has(Number(lm.id)) && !lm.delivered_at && !lm.read_at) {
      const list = [...state.conversations];
      list[idx] = {
        ...conv,
        last_message: { ...lm, delivered_at: at },
      };
      state.conversations = list;
    }
  },
  SET_LOADING(state, val) {
    state.loading = val;
  },
  SET_CONTACTS_LOADING(state, val) {
    state.contactsLoading = !!val;
  },
  SET_BLOCKED_LOADING(state, val) {
    state.blockedLoading = !!val;
  },
  SET_MESSAGES_LOADING(state, val) {
    state.messagesLoading = !!val;
  },
  SET_SENDING(state, val) {
    state.sending = val;
  },
  REMAP_DRAFT_TO_CONVERSATION(state, { conversation }) {
    if (!conversation?.id) return;
    const fromId = 'draft';
    const toId = conversation.id;
    const draftMsgs = (state.messages[fromId] || []).map((m) => ({
      ...m,
      conversation_id: toId,
    }));
    const existing = state.messages[toId] || [];
    const nextMsgs = { ...state.messages };
    delete nextMsgs[fromId];
    nextMsgs[toId] = mergeMessageLists(existing, draftMsgs);
    state.messages = nextMsgs;

    const nextMeta = { ...state.messagesMeta };
    const fromMeta = nextMeta[fromId];
    delete nextMeta[fromId];
    nextMeta[toId] = { hasMore: false, ...(fromMeta || {}), ...(nextMeta[toId] || {}) };
    state.messagesMeta = nextMeta;

    state.loadedConversationIds = { ...state.loadedConversationIds, [toId]: true };
    state.messagesLoading = false;

    const list = nextMsgs[toId] || [];
    const lastMsg = list.length ? list[list.length - 1] : null;
    const partner = state.draftConversation?.partner || conversation.partner || null;
    state.overlayConversation = {
      ...conversation,
      partner: partner || conversation.partner,
      users: conversation.users || (partner ? [partner] : []),
      last_message: lastMsg || conversation.last_message || null,
      last_message_at: lastMsg?.created_at || conversation.last_message_at || null,
      is_preview: false,
    };
    state.draftConversation = null;
    // Don't steal focus if the user already left the draft chat.
    if (isDraftConversationId(state.activeConversationId)) {
      state.activeConversationId = toId;
    }
  },
  UPDATE_CONVERSATION_PREVIEW(state, { conversationId, message }) {
    // Never push the local draft id into the sidebar.
    if (isDraftConversationId(conversationId) || conversationId == null || Number.isNaN(Number(conversationId))) {
      if (isDraftConversationId(conversationId) && state.draftConversation) {
        state.draftConversation = {
          ...state.draftConversation,
          last_message: message,
          last_message_at: message?.created_at || state.draftConversation.last_message_at,
        };
      }
      return;
    }
    if (!message) return;
    const id = Number(conversationId);
    const idx = state.conversations.findIndex((c) => Number(c.id) === id);
    if (idx === -1) {
      // First message promotes an overlay / unseen chat into the sidebar.
      const base = (state.overlayConversation && Number(state.overlayConversation.id) === id)
        ? state.overlayConversation
        : { id: conversationId, type: 'private' };
      const tip = applyCachedSidebarPreview(conversationId, message) || message;
      const promoted = {
        ...base,
        is_preview: false,
        last_message: tip,
        last_message_at: tip.created_at || message.created_at,
      };
      state.conversations = [promoted, ...state.conversations.filter((c) => Number(c.id) !== id)];
      if (state.overlayConversation && Number(state.overlayConversation.id) === id) {
        state.overlayConversation = null;
      }
      if (tip.type !== 'system') cacheSidebarPreview(conversationId, tip);
      return;
    }
    const conv = { ...state.conversations[idx] };
    const prevLast = conv.last_message;
    // Explicit preview updates (send / decrypt / echo) must advance the tip.
    // Never keep a stuck pending media row over a newer message.
    let tip = pickSidebarTip(prevLast, message);
    if (
      prevLast
      && message
      && !sameMessageId(prevLast.id, message.id)
      && isFresherMessage(message, prevLast)
    ) {
      tip = normalizeSidebarTip(message);
      clearSidebarPreview(conversationId);
    } else if (
      prevLast
      && tip
      && !sameMessageId(prevLast.id, tip.id)
      && isFresherMessage(tip, prevLast)
    ) {
      clearSidebarPreview(conversationId);
    }
    tip = applyCachedSidebarPreview(conversationId, tip) || tip;
    tip = normalizeSidebarTip(tip);
    if (
      prevLast
      && tip
      && sameMessageId(prevLast.id, tip.id)
    ) {
      tip = {
        ...tip,
        delivered_at: tip.delivered_at || prevLast.delivered_at || null,
        read_at: tip.read_at || prevLast.read_at || null,
      };
    }
    conv.last_message = tip;
    conv.last_message_at = tip?.created_at || message.created_at || conv.last_message_at;
    conv.is_preview = false;
    const list = [...state.conversations];
    list.splice(idx, 1);
    list.unshift(conv);
    state.conversations = list;
    if (tip && tip.type !== 'system') cacheSidebarPreview(conversationId, tip);
  },
  SET_CONVERSATION_MUTE(state, { conversationId, mute }) {
    const id = Number(conversationId);
    const conv = state.conversations.find((c) => Number(c.id) === id);
    if (conv) {
      conv.pivot = { ...(conv.pivot || {}), muted_at: mute ? new Date().toISOString() : null };
    }
    if (state.overlayConversation && Number(state.overlayConversation.id) === id) {
      state.overlayConversation = {
        ...state.overlayConversation,
        pivot: {
          ...(state.overlayConversation.pivot || {}),
          muted_at: mute ? new Date().toISOString() : null,
        },
      };
    }
  },
  REMOVE_CONVERSATION(state, conversationId) {
    const id = Number(conversationId);
    const conv = state.conversations.find((c) => Number(c.id) === id);
    if (conv && conv.unread_count) {
      state.unreadCount = Math.max(0, state.unreadCount - conv.unread_count);
    }
    clearCountedUnreadMessages(conversationId);
    state.conversations = state.conversations.filter((c) => Number(c.id) !== id);
    // Purge cached history so a deleted conversation can't resurface stale messages.
    const messages = { ...state.messages };
    delete messages[conversationId];
    delete messages[id];
    state.messages = messages;
    const meta = { ...state.messagesMeta };
    delete meta[conversationId];
    delete meta[id];
    state.messagesMeta = meta;
    const loaded = { ...state.loadedConversationIds };
    delete loaded[conversationId];
    delete loaded[id];
    state.loadedConversationIds = loaded;
    const pinned = { ...state.pinnedMessages };
    delete pinned[conversationId];
    delete pinned[id];
    state.pinnedMessages = pinned;
  },
  /** Drop a row from the sidebar without wiping the active message cache. */
  REMOVE_FROM_SIDEBAR(state, conversationId) {
    const id = Number(conversationId);
    state.conversations = state.conversations.filter((c) => Number(c.id) !== id);
  },
  INCREMENT_UNREAD(state, payload) {
    const conversationId = (payload && typeof payload === 'object')
      ? payload.conversationId
      : payload;
    const messageId = (payload && typeof payload === 'object')
      ? payload.messageId
      : null;
    if (conversationId == null) return;
    if (Number(conversationId) === Number(state.activeConversationId)) return;
    // Same message_id must never bump unread twice (WS replay / API+WS race).
    if (messageId != null) {
      if (hasCountedUnreadMessage(conversationId, messageId)) return;
      if (!markCountedUnreadMessage(conversationId, messageId)) return;
    }
    clearUnreadClearedMark(conversationId);
    markUnreadBumped(conversationId);
    const idx = state.conversations.findIndex((c) => Number(c.id) === Number(conversationId));
    if (idx === -1) {
      state.unreadCount++;
      return;
    }
    const conv = state.conversations[idx];
    const list = [...state.conversations];
    list[idx] = { ...conv, unread_count: (conv.unread_count || 0) + 1 };
    state.conversations = list;
    state.unreadCount++;
  },
  RESET_CONVERSATION_UNREAD(state, conversationId) {
    markUnreadCleared(conversationId);
    const idx = state.conversations.findIndex((c) => Number(c.id) === Number(conversationId));
    if (idx === -1) return;
    const conv = state.conversations[idx];
    if (!conv?.unread_count) return;
    state.unreadCount = Math.max(0, state.unreadCount - conv.unread_count);
    const list = [...state.conversations];
    list[idx] = { ...conv, unread_count: 0 };
    state.conversations = list;
  },
  SYNC_CONVERSATION_PREVIEW(state, conversationId) {
    if (conversationId == null || isDraftConversationId(conversationId)) return;
    const idx = state.conversations.findIndex((c) => c.id === conversationId
      || Number(c.id) === Number(conversationId));
    const listKey = Object.prototype.hasOwnProperty.call(state.messages, conversationId)
      ? conversationId
      : Object.keys(state.messages || {}).find((k) => Number(k) === Number(conversationId));
    const all = (listKey != null ? state.messages[listKey] : null) || [];
    // Prefer real chat tip; fall back to system note (e.g. history cleared).
    const nonSystem = all.filter((m) => m && m.type !== 'system');
    const tip = nonSystem.length
      ? nonSystem[nonSystem.length - 1]
      : (all.length ? all[all.length - 1] : null);

    const current = idx >= 0 ? (state.conversations[idx]?.last_message || null) : null;
    let last = tip;
    if (!tip) {
      // Empty history — never keep a stale sidebar snippet.
      last = null;
      clearSidebarPreview(conversationId);
    } else if (current && sameMessageId(current.id, tip.id)) {
      // Same tip: keep decrypted plaintext if the echo is still locked.
      last = preferPreviewMessage(current, tip);
      last = applyCachedSidebarPreview(conversationId, last);
    } else {
      // Tip changed (delete / new message / clear) — trust messages list.
      // Drop cache for the previous tip so it cannot resurrect old text.
      clearSidebarPreview(conversationId);
      last = pickSidebarTip(current, tip);
      last = applyCachedSidebarPreview(conversationId, last) || last;
    }

    if (idx === -1) {
      if (state.overlayConversation
        && Number(state.overlayConversation.id) === Number(conversationId)) {
        state.overlayConversation = {
          ...state.overlayConversation,
          last_message: last,
          last_message_at: last?.created_at || state.overlayConversation.last_message_at,
        };
      }
      return;
    }

    const conv = { ...state.conversations[idx] };
    conv.last_message = last;
    if (last) {
      conv.last_message_at = last.created_at || conv.last_message_at;
    } else if (!all.length || (all.length === 1 && all[0]?.type === 'system' && all[0]?.system_kind === 'cleared')) {
      // Cleared / empty: bump activity time so sort stays sensible, or keep.
      conv.last_message_at = last?.created_at || conv.last_message_at;
    }
    const list = [...state.conversations];
    list.splice(idx, 1);
    list.unshift(conv);
    state.conversations = list;
    if (last && last.type !== 'system') {
      cacheSidebarPreview(conversationId, last);
    } else if (!last) {
      clearSidebarPreview(conversationId);
    }
  },
  SET_SELECTION_MODE(state, val) {
    state.selectionMode = val;
    if (!val) state.selectedIds = [];
  },
  TOGGLE_SELECT(state, messageId) {
    state.selectedIds = state.selectedIds.includes(messageId)
      ? state.selectedIds.filter((id) => id !== messageId)
      : [...state.selectedIds, messageId];
  },
  SELECT_ALL(state, ids) {
    const list = Array.isArray(ids) ? ids.filter((id) => id != null) : [];
    state.selectionMode = true;
    state.selectedIds = [...new Set(list)];
  },
  CLEAR_SELECTION(state) {
    state.selectedIds = [];
    state.selectionMode = false;
  },
  SET_REPLY(state, message) {
    state.replyTo = message;
  },
  SET_FORWARD_PICK(state, payload) {
    state.forwardPick = payload || null;
  },
  CLEAR_FORWARD_PICK(state) {
    state.forwardPick = null;
  },
  SET_PENDING_FORWARD(state, payload) {
    state.pendingForward = payload || null;
  },
  CLEAR_PENDING_FORWARD(state) {
    state.pendingForward = null;
  },
  SET_PENDING_FORWARD_DROP_AUTHOR(state, dropAuthor) {
    if (!state.pendingForward) return;
    state.pendingForward = { ...state.pendingForward, dropAuthor: !!dropAuthor };
  },
  SET_SETTINGS(state, settings) {
    const merged = { ...state.settings, ...(settings || {}) };
    merged.auto_download = normalizeAutoDownload(
      settings?.auto_download ?? merged.auto_download,
      merged,
    );
    merged.auto_play = normalizeAutoPlay(settings?.auto_play ?? merged.auto_play);
    const priv = merged.auto_download.private || {};
    merged.auto_download_photos = !!priv.photos;
    merged.auto_download_videos = !!priv.videos;
    merged.auto_download_files = !!priv.files;
    merged.auto_download_voice = !!priv.voice;
    merged.auto_download_audio = !!priv.audio;
    state.settings = merged;
  },
  SET_SYSTEM_CONFIG(state, cfg) {
    state.systemConfig = cfg || null;
    const allowed = cfg?.access_allowed !== false && cfg?.enabled !== false;
    state.accessBlocked = !allowed;
    state.accessBlockedMessage = !cfg?.enabled
      ? (cfg?.disabled_message || null)
      : (cfg?.access_denied_message || cfg?.access_reason || null);
  },
  SET_BLOCKED(state, list) {
    state.blockedContacts = list;
  },
  SET_SYNCED_CONTACTS(state, payload) {
    state.syncedContacts = {
      registered: Array.isArray(payload?.registered) ? payload.registered : [],
      inviteable: Array.isArray(payload?.inviteable) ? payload.inviteable : [],
      last_synced_at: payload?.last_synced_at || null,
    };
  },
  SET_SYNCED_CONTACTS_LOADING(state, v) {
    state.syncedContactsLoading = !!v;
  },
  SET_PRESENCE_TIMER(state, id) {
    state.presenceTimer = id;
  },
  APPLY_PRESENCE(state, { userId, isOnline, lastSeen, profilePic, firstName, lastName, username }) {
    const uid = Number(userId);
    if (!Number.isFinite(uid)) return;
    state.presence = {
      ...state.presence,
      [uid]: {
        ...(state.presence[uid] || {}),
        ...(isOnline !== undefined ? { is_online: isOnline } : {}),
        ...(lastSeen !== undefined ? { last_seen: lastSeen } : {}),
      },
    };
    // Replace user objects (not mutate-in-place) so avatar/name bindings refresh.
    const patchUser = (u) => {
      if (!u || Number(u.id) !== uid) return u;
      const next = { ...u };
      if (isOnline !== undefined) next.is_online = isOnline;
      if (lastSeen !== undefined) next.last_seen = lastSeen;
      if (profilePic !== undefined) next.profile_pic = profilePic;
      if (firstName !== undefined) next.first_name = firstName;
      if (lastName !== undefined) next.last_name = lastName;
      if (username !== undefined) next.username = username;
      return next;
    };
    state.conversations = (state.conversations || []).map((c) => {
      const partner = patchUser(c.partner);
      const owner = patchUser(c.owner);
      const users = Array.isArray(c.users) ? c.users.map(patchUser) : c.users;
      if (partner === c.partner && owner === c.owner && users === c.users) return c;
      return { ...c, partner, owner, users };
    });
    if (state.overlayConversation) {
      const oc = state.overlayConversation;
      state.overlayConversation = {
        ...oc,
        partner: patchUser(oc.partner),
        owner: patchUser(oc.owner),
        users: Array.isArray(oc.users) ? oc.users.map(patchUser) : oc.users,
      };
    }
    state.contacts = (state.contacts || []).map((ct) => {
      if (!ct?.contact_user || Number(ct.contact_user.id) !== uid) return ct;
      return { ...ct, contact_user: patchUser(ct.contact_user) };
    });
    if (state.syncedContacts?.registered?.length) {
      let syncedChanged = false;
      const registered = state.syncedContacts.registered.map((row) => {
        if (!row?.user || Number(row.user.id) !== uid) return row;
        syncedChanged = true;
        return { ...row, user: patchUser(row.user) };
      });
      if (syncedChanged) {
        state.syncedContacts = { ...state.syncedContacts, registered };
      }
    }
    const msgs = { ...(state.messages || {}) };
    Object.keys(msgs).forEach((cid) => {
      msgs[cid] = (msgs[cid] || []).map((m) => {
        const user = patchUser(m.user);
        const forwarded_from = patchUser(m.forwarded_from);
        if (user === m.user && forwarded_from === m.forwarded_from) return m;
        return { ...m, user, forwarded_from };
      });
    });
    state.messages = msgs;
  },
};

const actions = {
  async fetchConversations({ commit, state, dispatch }, {
    page = 1, append = false, silent = false,
  } = {}) {
    const run = async () => {
      if (append) {
        if (state.conversationsLoadingMore) return;
        commit('SET_CONVERSATIONS_LOADING_MORE', true);
      } else if (!silent) {
        commit('SET_LOADING', true);
      }
      try {
        // List HTTP is the critical path. Crypto bootstrap and decrypt run
        // after the sidebar can paint.
        const res = await getConversations(page);
        let list = Array.isArray(res) ? res : (res.data || []);
        const meta = Array.isArray(res) ? {} : (res.meta || {});

        // Instant paint from cache overlays while decrypt finishes.
        if (!append) {
          const quick = (list || []).map((conv) => {
            const last = conv.last_message
              ? applyCachedSidebarPreview(conv.id, conv.last_message)
              : conv.last_message;
            return { ...conv, last_message: last };
          });
          commit('SET_CONVERSATIONS', quick);
          if (!silent) commit('SET_LOADING', false);
        }

        const decorateOne = async (conv) => {
          try {
            let messages = conv.messages;
            if (Array.isArray(messages) && messages.length) {
              messages = await decryptMessageList(messages);
            }

            let last = conv.last_message;
            if (last?.is_encrypted || last?.e2e) {
              const fromBundle = Array.isArray(messages)
                ? messages.find((m) => sameMessageId(m.id, last.id))
                : null;
              if (fromBundle && !isSidebarPreviewLocked(fromBundle)
                && !(fromBundle.is_encrypted && !fromBundle._e2e_decrypted
                  && !isMediaMessageType(fromBundle.type))) {
                last = fromBundle;
              } else {
                last = await decryptIncomingMessage(last);
                if (isSidebarPreviewLocked(last) || last._e2e_locked || last._decryptFailed) {
                  // Do not per-conversation bypass pull here — list decrypt used to
                  // fire dozens of /packages and starve sends.
                  last = await decryptIncomingMessage({
                    ...last,
                    body: last._e2e_ciphertext || conv.last_message?.body || last.body,
                    _e2e_decrypted: false,
                    _e2e_locked: false,
                    _decryptFailed: false,
                  });
                }
              }
            } else if (!last && Array.isArray(messages) && messages.length) {
              last = messages[messages.length - 1];
            }

            if (Array.isArray(messages) && messages.length) {
              // Tip = newest by id, not array position (API order can vary).
              const newest = messages.reduce((best, m) => (
                !best || isFresherMessage(m, best) ? m : best
              ), null);
              last = pickSidebarTip(last, newest);
            }
            // Do not let a stale localStorage snippet resurrect a deleted tip.
            if (last) {
              last = applyCachedSidebarPreview(conv.id, last);
              if (last && !isSidebarPreviewLocked(last) && last.type !== 'system') {
                cacheSidebarPreview(conv.id, last);
              }
            } else {
              clearSidebarPreview(conv.id);
            }

            return { ...conv, last_message: last, messages };
          } catch {
            const last = conv.last_message
              ? applyCachedSidebarPreview(conv.id, conv.last_message)
              : null;
            return { ...conv, last_message: last };
          }
        };
        // Cap concurrent conversation decrypts so cold boot doesn't thrash CPU/network.
        const decorateList = async (rows) => {
          const list = rows || [];
          const out = new Array(list.length);
          const concurrency = 4;
          let cursor = 0;
          const worker = async () => {
            while (cursor < list.length) {
              const i = cursor;
              cursor += 1;
              // eslint-disable-next-line no-await-in-loop
              out[i] = await decorateOne(list[i]);
            }
          };
          await Promise.all(Array.from({ length: Math.min(concurrency, list.length || 1) }, () => worker()));
          return out;
        };

        const publishListMeta = () => {
          commit('SET_CONVERSATIONS_PAGINATION', {
            page: meta.current_page || page,
            hasMore: !!meta.has_more,
          });
          if (!append) {
            const rowSum = (state.conversations || []).reduce(
              (sum, c) => sum + (Number(c.unread_count) || 0),
              0,
            );
            const metaTotal = meta.total_unread != null ? (Number(meta.total_unread) || 0) : rowSum;
            const preservingClear = unreadClearedAt.size > 0;
            commit(
              'SET_UNREAD_COUNT',
              (!preservingClear && metaTotal > rowSum) ? metaTotal : rowSum,
            );
            lastUnreadFetchAt = Date.now();
          }
        };

        const warmRecent = (rows) => {
          if (append || !e2eEnabledFromState(state)) return;
          dispatch('healNewDeviceE2e', { force: true }).catch(() => {});
          const warmIds = [];
          if (state.activeConversationId) warmIds.push(state.activeConversationId);
          (rows || []).slice(0, 5).forEach((c) => {
            if (c?.id != null && conversationRequiresE2e(state, c.id)) warmIds.push(c.id);
          });
          [...new Set(warmIds.map(String))].slice(0, 6).forEach((id) => {
            prewarmConversationCrypto(id).catch(() => {});
            Promise.resolve(ensureConversationChannel(id)).catch(() => {});
          });
        };

        if (!append) {
          publishListMeta();
          warmRecent(list);
          const gen = ++conversationsDecryptGen;
          const snapshot = list;
          const e2eP = e2eEnabledFromState(state)
            ? ensureE2eBootstrapped(state)
            : Promise.resolve(false);
          e2eP.then(async () => {
            if (gen !== conversationsDecryptGen) return;
            const decorated = await decorateList(snapshot);
            if (gen !== conversationsDecryptGen) return;
            commit('SET_CONVERSATIONS', decorated);
            seedMessagesFromConversations(commit, state, decorated);
            dispatch('refreshLockedSidebarPreviews').catch(() => {});
          }).catch((e) => console.warn('[messenger] list decrypt failed', e));
          return;
        }

        list = await decorateList(list);
        commit('APPEND_CONVERSATIONS', list);
        seedMessagesFromConversations(commit, state, list);
        publishListMeta();
      } finally {
        if (append) commit('SET_CONVERSATIONS_LOADING_MORE', false);
        else if (!silent) commit('SET_LOADING', false);
      }
    };

    if (!append && conversationsFetchPromise) {
      return conversationsFetchPromise;
    }

    const promise = run().finally(() => {
      if (conversationsFetchPromise === promise) conversationsFetchPromise = null;
    });
    if (!append) conversationsFetchPromise = promise;
    return promise;
  },

  async loadMoreConversations({ state, dispatch }) {
    if (state.conversationsLoadingMore || !state.conversationsHasMore) return;
    await dispatch('fetchConversations', { page: state.conversationsPage + 1, append: true });
  },

  async fetchMessages({ commit, state }, { conversationId, beforeId = null }) {
    if (conversationRequiresE2e(state, conversationId) && !beforeId) {
      // Do not block history paint on a key-vault round trip.
      pullConversationKeySources(conversationId).catch(() => {});
    }
    const res = await getMessages(conversationId, beforeId);
    if (beforeId) {
      const existing = state.messages[conversationId] || [];
      const existingIds = new Set(existing.map((m) => m.id));
      const olderRaw = (res.data || []).filter((m) => !existingIds.has(m.id));
      let older = await decryptMessageList(olderRaw);
      const mergedOlder = mergeMessageLists(existing, older);
      older = older.map((m) => hydrateMessageTree(
        { ...state, messages: { ...state.messages, [conversationId]: mergedOlder } },
        conversationId,
        m,
      ));
      commit('SET_MESSAGES', {
        conversationId,
        messages: mergeMessageLists(existing, older),
      });
    } else {
      const fetchedRaw = res.data || [];
      let fetched = await decryptMessageList(fetchedRaw);
      fetched = fetched.map((m) => hydrateMessageTree(
        { ...state, messages: { ...state.messages, [conversationId]: fetched } },
        conversationId,
        m,
      ));
      const existing = state.messages[conversationId] || [];
      const clearCutoff = existing.reduce((max, m) => {
        if (m?.system_kind !== 'cleared') return max;
        const t = Date.parse(m.created_at || '');
        return Number.isFinite(t) && t > max ? t : max;
      }, 0);
      const afterClear = (m) => {
        if (!m) return false;
        if (m.system_kind === 'cleared') return true;
        if (!clearCutoff) return true;
        const t = Date.parse(m.created_at || '');
        return Number.isFinite(t) && t > clearCutoff;
      };
      fetched = fetched.filter(afterClear);
      // Keep pending/failed outbox bubbles + any newer local confirms.
      const localOnly = existing.filter((m) => (
        (m.pending || m.failed || (!isServerId(m.id) && m.client_id))
        && afterClear(m)
      ));
      const maxFetchedNumericId = fetched.reduce((max, m) => {
        const n = Number(m.id);
        return Number.isFinite(n) && n > max ? n : max;
      }, 0);
      const newerLocal = existing.filter((m) => {
        if (m.pending || m.failed || !isServerId(m.id) || !afterClear(m)) return false;
        const n = Number(m.id);
        return Number.isFinite(n) && n > maxFetchedNumericId;
      });
      const localById = new Map();
      const localByClient = new Map();
      existing.forEach((m) => {
        // Index every local row so receipt timestamps survive refetch/re-entry.
        if (isServerId(m.id)) localById.set(Number(m.id), m);
        if (m.client_id) localByClient.set(m.client_id, m);
      });
      const enriched = fetched.map((m) => {
        const prev = (isServerId(m.id) && localById.get(Number(m.id)))
          || (m.client_id && localByClient.get(m.client_id))
          || null;
        if (!prev) return m;
        return {
          ...prev,
          ...m,
          client_id: m.client_id || prev.client_id || null,
          meta: mergeMessageMeta(prev, m),
          pending: false,
          failed: false,
          ...mergeReceiptFields(prev, m),
          ...mergeE2eDisplayFields(prev, m),
        };
      });
      const clearNotes = existing.filter((m) => m?.system_kind === 'cleared');
      commit('SET_MESSAGES', {
        conversationId,
        messages: mergeMessageLists(enriched, [...localOnly, ...newerLocal, ...clearNotes]),
      });
    }
    commit('SET_MESSAGES_META', { conversationId, hasMore: !!res.meta?.has_more });
    return res.meta;
  },

  async selectConversation({ commit, dispatch, state }, payload) {
    const conversationId = typeof payload === 'object' && payload != null
      ? payload.conversationId ?? payload.id
      : payload;
    const asPreview = !!(typeof payload === 'object' && payload && payload.asPreview);
    if (conversationId == null) return { has_more: false };

    commit('SET_ACTIVE_CONVERSATION', conversationId);
    if (state.overlayConversation && Number(state.overlayConversation.id) !== Number(conversationId)) {
      commit('CLEAR_OVERLAY_CONVERSATION');
    }
    // Clear badge immediately — before async getConversation can resurrect a
    // stale unread_count from DB while markRead write-behind is in flight.
    if (!asPreview && !isDraftConversationId(conversationId)) {
      commit('RESET_CONVERSATION_UNREAD', conversationId);
    }
    // Subscribe for WS peer relay (whisper) as soon as the chat is opened.
    // Await connect so the first send does not race an unfinished subscribe.
    if (!asPreview && !isDraftConversationId(conversationId)) {
      Promise.resolve(ensureConversationChannel(conversationId)).catch(() => {});
    }
    // Refresh full conversation meta in background (member_count, lock, role…).
    getConversation(conversationId)
      .then((conv) => {
        const c = conv?.id ? conv : conv?.data;
        if (!c?.id) return;
        const keepPreview = asPreview
          || !!state.overlayConversation?.is_preview
          || c.is_preview === true;
        // Previews / empty privates stay as overlay — never enter the sidebar.
        if (keepPreview || (c.type === 'private' && !c.last_message && !c.last_message_at)) {
          const prev = state.overlayConversation?.id != null
            && Number(state.overlayConversation.id) === Number(c.id)
            ? state.overlayConversation
            : {};
          commit('SET_OVERLAY_CONVERSATION', {
            ...prev,
            ...c,
            is_preview: keepPreview ? true : !!c.is_preview,
          });
          // Ensure a leaked sidebar row cannot linger (keep message cache).
          commit('REMOVE_FROM_SIDEBAR', c.id);
          return;
        }
        commit('CLEAR_OVERLAY_CONVERSATION');
        commit('UPSERT_CONVERSATION', c);
      })
      .catch(() => {});
    // Kick off the pinned-messages fetch in parallel with the history so the
    // pinned bar/sheet are ready without an extra wait after the messages land.
    if (!asPreview) {
      dispatch('fetchPins', conversationId);
      dispatch('fetchConversationWallpaper', conversationId).catch(() => {});
    }
    let hasMore;
    if (state.loadedConversationIds[conversationId]) {
      // Use the cached history (seeded from the list or loaded earlier) so we
      // never wait for a round-trip and never lose previously loaded messages.
      commit('SET_MESSAGES_LOADING', false);
      hasMore = state.messagesMeta[conversationId]?.hasMore || false;
      // Soft repair only: pull packages + re-decrypt + warm caches.
      // Never force-redistribute on open — clearing distributed marks forced
      // expensive wrap rebuilds on every subsequent send.
      if (conversationRequiresE2e(state, conversationId)) {
        // Prewarm first so the next send hits warm wraps (not a cold /bundles).
        prewarmConversationCrypto(conversationId).catch(() => {});
        pullConversationKeySources(conversationId)
          .then(() => dispatch('refreshE2eMessages', conversationId))
          .then(() => {
            requestKeyIfNeeded(conversationId, { force: true });
            scheduleLockedRefresh(dispatch, conversationId, [800, 2500, 6000]);
          })
          .catch(() => {});
      }
    } else {
      commit('SET_MESSAGES_LOADING', true);
      try {
        if (conversationRequiresE2e(state, conversationId)) {
          // Kick package pull without blocking HTTP history (fetchMessages shares inflight).
          pullConversationKeySources(conversationId).catch(() => {});
          prewarmConversationCrypto(conversationId).catch(() => {});
        }
        const meta = await dispatch('fetchMessages', { conversationId });
        hasMore = meta?.has_more || false;
        commit('MARK_CONVERSATION_LOADED', conversationId);
        if (conversationRequiresE2e(state, conversationId)) {
          dispatch('refreshE2eMessages', conversationId)
            .then(() => {
              requestKeyIfNeeded(conversationId, { force: true });
              scheduleLockedRefresh(dispatch, conversationId, [800, 2500, 6000]);
            })
            .catch(() => {});
        }
      } finally {
        if (state.activeConversationId === conversationId) {
          commit('SET_MESSAGES_LOADING', false);
        }
      }
    }
    // Never mark-read a join preview (user is not a member).
    if (!asPreview && !state.overlayConversation?.is_preview) {
      markRead(conversationId).catch(() => {});
      commit('RESET_CONVERSATION_UNREAD', conversationId);
    }
    return { has_more: hasMore };
  },

  async fetchPins({ commit, state, dispatch }, conversationId) {
    if (!conversationId) return;
    try {
      // Soft refresh often races pins ahead of crypto packages → ciphertext in the bar.
      // Fire-and-share the same inflight pull as selectConversation (no second round-trip).
      const e2ePull = conversationRequiresE2e(state, conversationId)
        ? pullConversationKeySources(conversationId).catch(() => {})
        : Promise.resolve();
      const [res] = await Promise.all([
        getPins(conversationId),
        e2ePull,
      ]);
      let messages = res.data || [];
      if (messages.length) {
        messages = await decryptMessageList(messages);
        messages = messages.map((m) => {
          const hydrated = hydrateMessageTree(state, conversationId, m);
          // Prefer already-decrypted chat bubble when pin API still has ciphertext.
          const local = (state.messages[conversationId] || [])
            .find((x) => Number(x.id) === Number(m.id));
          if (local && local._e2e_decrypted && !local._e2e_locked) {
            return {
              ...hydrated,
              ...mergeE2eDisplayFields(hydrated, local),
              body: local.body,
              _e2e_decrypted: true,
              _e2e_locked: false,
              _decryptFailed: false,
              _mediaKey: local._mediaKey || hydrated._mediaKey,
              _mediaIv: local._mediaIv || hydrated._mediaIv,
            };
          }
          return hydrated;
        });
      }
      commit('SET_PINNED', { conversationId, messages });
      // Still locked? Retry after keys settle (soft refresh path).
      const stillLocked = messages.some((m) => m?.is_encrypted && (m._e2e_locked || m._decryptFailed || isEncryptedDisplayBody(m)));
      if (stillLocked && conversationRequiresE2e(state, conversationId)) {
        dispatch('refreshE2eMessages', conversationId).catch(() => {});
      }
    } catch (e) {
      console.warn('[messenger] fetchPins failed', conversationId, e);
    }
  },

  /** Pull key packages then re-decrypt locked messages still in memory. */
  async refreshE2eMessages({ commit, state, dispatch }, conversationId) {
    if (!conversationId || !conversationRequiresE2e(state, conversationId)) return;
    const key = String(conversationId);
    if (refreshE2eInflight.has(key)) return refreshE2eInflight.get(key);

    const work = (async () => {
      // Always bypass cooldown — locked history must unlock as soon as packages land.
      await pullConversationKeySources(conversationId).catch(() => {});
      let list = state.messages[conversationId] || [];
      // Also resolve string/number key mismatch.
      if (!list.length) {
        const alt = Object.keys(state.messages || {}).find((k) => Number(k) === Number(conversationId));
        if (alt != null) list = state.messages[alt] || [];
      }
      let needs = list.filter((m) => (
        m?.is_encrypted
        && (!m._e2e_decrypted || m._e2e_locked || m._decryptFailed || isLockedE2eBody(m.body)
          || (m.reply_to && (m.reply_to._e2e_locked || (m.reply_to.is_encrypted && !m.reply_to._e2e_decrypted))))
      ));
      if (!needs.length) {
        const pins = state.pinnedMessages[conversationId] || [];
        if (pins.some((m) => m?.is_encrypted && (!m._e2e_decrypted || m._e2e_locked || isLockedE2eBody(m.body)))) {
          await dispatch('fetchPins', conversationId);
        }
        return;
      }

      const missingCipher = needs.some((m) => !m._e2e_ciphertext && isLockedE2eBody(m.body));
      if (missingCipher) {
        await dispatch('fetchMessages', { conversationId });
        list = state.messages[conversationId] || list;
        needs = list.filter((m) => (
          m?.is_encrypted
          && (!m._e2e_decrypted || m._e2e_locked || m._decryptFailed || isLockedE2eBody(m.body)
            || (m.reply_to && (m.reply_to._e2e_locked || (m.reply_to.is_encrypted && !m.reply_to._e2e_decrypted))))
        ));
        if (!needs.length) return;
      }

      const decrypted = await decryptMessageList(needs);
      const stillLocked = decrypted.some((m) => m?._e2e_locked || m?._decryptFailed || isLockedE2eBody(m?.body));
      if (stillLocked) {
        requestKeyIfNeeded(conversationId, { force: true });
      }
      const byId = new Map();
      const byClient = new Map();
      decrypted.forEach((m) => {
        if (m?.id != null) byId.set(String(m.id), m);
        if (m?.client_id) byClient.set(m.client_id, m);
      });
      const next = list.map((m) => {
        const fresh = (m.id != null && byId.get(String(m.id)))
          || (m.client_id && byClient.get(m.client_id))
          || null;
        if (!fresh || (fresh._decryptFailed && fresh._e2e_locked)) {
          // Keep previous decrypt if refresh still failed.
          if (m._e2e_decrypted && !m._e2e_locked) return hydrateMessageTree(state, conversationId, m);
          return hydrateMessageTree(state, conversationId, fresh || m);
        }
        const merged = { ...m, ...fresh, ...mergeE2eDisplayFields(m, fresh) };
        return hydrateMessageTree(state, conversationId, merged);
      });
      commit('SET_MESSAGES', { conversationId, messages: next });
      commit('SYNC_CONVERSATION_PREVIEW', conversationId);

      const pins = state.pinnedMessages[conversationId] || [];
      if (pins.length) {
        const pinDecrypted = await decryptMessageList(pins);
        const pinNext = pinDecrypted.map((m) => {
          const local = next.find((x) => Number(x.id) === Number(m.id));
          if (local && local._e2e_decrypted && !local._e2e_locked) {
            return {
              ...m,
              ...mergeE2eDisplayFields(m, local),
              body: local.body,
              _e2e_decrypted: true,
              _e2e_locked: false,
              _decryptFailed: false,
            };
          }
          return hydrateMessageTree({ ...state, messages: { ...state.messages, [conversationId]: next } }, conversationId, m);
        });
        commit('SET_PINNED', { conversationId, messages: pinNext });
      }
    })();

    refreshE2eInflight.set(key, work);
    try {
      await work;
    } finally {
      refreshE2eInflight.delete(key);
    }
  },

  /** Re-decrypt conversation.last_message for sidebar after key packages arrive. */
  async refreshConversationPreview({ commit, state }, conversationId) {
    if (!conversationId) return;
    const conv = (state.conversations || []).find((c) => String(c.id) === String(conversationId));
    const last = conv?.last_message;
    if (!last?.is_encrypted && !last?.e2e) {
      commit('SYNC_CONVERSATION_PREVIEW', conversationId);
      return;
    }
    if (last._e2e_decrypted && !last._e2e_locked && !isSidebarPreviewLocked(last)) {
      cacheSidebarPreview(conversationId, last);
      commit('SYNC_CONVERSATION_PREVIEW', conversationId);
      return;
    }

    await pullConversationKeySources(conversationId).catch(() => {});

    const cachedMsg = (state.messages[conversationId] || []).find((m) => sameMessageId(m.id, last.id));
    let decrypted = cachedMsg && !isSidebarPreviewLocked(cachedMsg)
      ? cachedMsg
      : await decryptIncomingMessage({
        ...last,
        body: last._e2e_ciphertext || last.body,
        _e2e_decrypted: false,
        _e2e_locked: false,
        _decryptFailed: false,
      });

    if (isSidebarPreviewLocked(decrypted)) {
      decrypted = applyCachedSidebarPreview(conversationId, decrypted);
    }

    if (decrypted && !isSidebarPreviewLocked(decrypted)) {
      cacheSidebarPreview(conversationId, decrypted);
      commit('UPDATE_CONVERSATION_PREVIEW', {
        conversationId,
        message: decrypted,
      });
    } else {
      // Keep current row + cache overlay — do not clobber with another locked tip.
      const patched = applyCachedSidebarPreview(conversationId, last);
      if (patched && !isSidebarPreviewLocked(patched)) {
        cacheSidebarPreview(conversationId, patched);
        commit('UPDATE_CONVERSATION_PREVIEW', {
          conversationId,
          message: patched,
        });
      }
    }
  },

  /** Unlock any locked last_message rows still showing in the sidebar. */
  async refreshLockedSidebarPreviews({ state, dispatch }) {
    const locked = (state.conversations || []).filter((c) => {
      const m = c.last_message;
      if (!m) return false;
      if (!m.is_encrypted && !m.e2e) return false;
      return isSidebarPreviewLocked(m)
        || (m.is_encrypted && !m._e2e_decrypted && !isMediaMessageType(m.type) && m.type !== 'location');
    });
    await Promise.allSettled(
      locked.map((c) => dispatch('refreshConversationPreview', c.id)),
    );
  },

  async pinMessageAction({ commit }, {
    messageId, forEveryone = false, message = null, conversationId = null,
  }) {
    // Optimistic — bar updates immediately; roll back on failure.
    if (message && conversationId) commit('ADD_PINNED', { conversationId, message });
    try {
      await pinMessage(messageId, forEveryone);
    } catch (e) {
      if (conversationId) commit('REMOVE_PINNED', { conversationId, messageId });
      throw e;
    }
  },

  async unpinMessageAction({ commit, state: st }, { messageId, conversationId = null }) {
    const prev = conversationId
      ? (st.pinnedMessages[conversationId] || []).find((m) => Number(m.id) === Number(messageId))
      : null;
    if (conversationId) commit('REMOVE_PINNED', { conversationId, messageId });
    try {
      await unpinMessage(messageId);
    } catch (e) {
      if (conversationId && prev) commit('ADD_PINNED', { conversationId, message: prev });
      throw e;
    }
  },

  async unpinAllAction({ commit, state: st }, conversationId) {
    const prev = conversationId ? [...(st.pinnedMessages[conversationId] || [])] : [];
    commit('CLEAR_PINNED', conversationId);
    try {
      await unpinAllMessages(conversationId);
    } catch (e) {
      if (conversationId) commit('SET_PINNED', { conversationId, messages: prev });
      throw e;
    }
  },

  /**
   * After a sibling device registers, push conversation keys we already hold
   * so the new device can pull packages and decrypt history.
   */
  async redistributeE2eKeysForKnownConversations({ state }, { force = false, onlyUserId = null } = {}) {
    const now = Date.now();
    // Avoid hammering distribute on every socket reconnect (cap 10 min).
    if (!force && redistributeSweepAt && (now - redistributeSweepAt) < 600_000) return;
    redistributeSweepAt = now;

    let convs = (state.conversations || []).filter((c) => conversationRequiresE2e(state, c.id));
    if (onlyUserId != null) {
      const uid = Number(onlyUserId);
      convs = convs.filter((c) => conversationIncludesUser(c, uid));
    }
    const active = state.activeConversationId;
    const ids = [];
    if (active && conversationRequiresE2e(state, active)) {
      if (onlyUserId == null || conversationIncludesUser(findConversation(state, active), Number(onlyUserId))) {
        ids.push(String(active));
      }
    }
    convs.forEach((c) => {
      const id = String(c.id);
      if (!ids.includes(id)) ids.push(id);
    });
    // Also redistribute every conversation we hold a key for in IndexedDB
    // (covers chats not on the current sidebar page).
    if (onlyUserId == null) {
      const localIds = await listConversationIdsWithLocalKeys().catch(() => []);
      localIds.forEach((id) => {
        if (!ids.includes(String(id))) ids.push(String(id));
      });
    }

    const targets = ids.slice(0, 80);
    console.info('[e2e] redistribute sweep', {
      force: !!force,
      onlyUserId,
      targets: targets.length,
    });
    clearForceRedistributeGuard();
    invalidateConversationCryptoCache();
    await Promise.allSettled(targets.map(async (cid) => {
      await forceRedistributeConversationKey(cid).catch(() => false);
    }));
    // Keep identity vault warm for future devices of this account.
    uploadAllLocalKeysToVault().catch(() => {});
  },

  /**
   * New/restored device: recover keys from vault + packages, then actively
   * request any still-missing conversation keys from online holders.
   * Must NOT depend on a new message being sent.
   */
  async healNewDeviceE2e({ dispatch, state }, { force = false } = {}) {
    if (newDeviceHealPromise) {
      if (!force) return newDeviceHealPromise;
      // First pass often races ahead of fetchConversations (empty sidebar).
      return newDeviceHealPromise.then(() => {
        const n = (state.conversations || []).length;
        if (n > lastHealConvCount) {
          return dispatch('healNewDeviceE2e', { force: true });
        }
        return undefined;
      });
    }
    // Quiet heal at most once / 2 min unless force (true new-device / vault event).
    if (!force && newDeviceHealRanAt && (Date.now() - newDeviceHealRanAt) < 120_000) {
      return Promise.resolve();
    }
    newDeviceHealRanAt = Date.now();
    lastHealConvCount = (state.conversations || []).length;
    newDeviceHealPromise = (async () => {
      console.info('[e2e] healNewDeviceE2e start', { force: !!force });

      // Prefer identity before vault — vault unwrap needs User Identity privates.
      // Order: seamless MDS → sibling transfer → packages. Never wait for a peer message.
      let hasIdentity = await hasLocalUserIdentityPrivates().catch(() => false);
      if (!hasIdentity) {
        await trySeamlessIdentityRestore().catch(() => false);
        hasIdentity = await hasLocalUserIdentityPrivates().catch(() => false);
      }
      if (!hasIdentity) {
        await adoptUserIdentityFromSiblings().catch(() => false);
        await pullAndConsumeIdentityPackages().catch(() => {});
        hasIdentity = await hasLocalUserIdentityPrivates().catch(() => false);
      } else {
        await pullAndConsumeIdentityPackages().catch(() => {});
      }

      let vaultRecovered = 0;
      if (hasIdentity) {
        await ensureSeamlessMultiDeviceBackup().catch(() => false);
        vaultRecovered = await pullAndConsumeKeyVault(null, { force: true }).catch((e) => {
          console.warn('[e2e] heal vault pull failed', e?.message || e);
          return 0;
        });
        // Holders: keep vault warm for future devices of this account.
        uploadAllLocalKeysToVault().catch(() => {});
      } else {
        console.info('[e2e] heal deferred vault — waiting for identity transfer');
        startE2eUnlockPoller(dispatch);
        dispatch('fetchE2eRecoveryStatus').catch(() => {});
      }

      await pullConversationKeySources(null).catch(() => {});

      const localIds = new Set(
        (await listConversationIdsWithLocalKeys().catch(() => [])).map(String),
      );
      const e2eConvs = (state.conversations || [])
        .filter((c) => conversationRequiresE2e(state, c.id));
      const missing = e2eConvs
        .map((c) => String(c.id))
        .filter((id) => !localIds.has(id));

      // Always include active chat if locked / missing.
      const active = state.activeConversationId;
      if (active && conversationRequiresE2e(state, active) && !missing.includes(String(active))) {
        if (!localIds.has(String(active))) missing.unshift(String(active));
      }

      const toRequest = missing.slice(0, 40);
      if (toRequest.length) {
        console.info('[e2e] heal key-request for missing chats', {
          missing: toRequest.length,
          vaultRecovered,
        });
        await Promise.allSettled(toRequest.map(async (cid) => {
          requestKeyIfNeeded(cid, { force: true });
        }));
        // Give holders a moment to redistribute, then pull again.
        await new Promise((r) => setTimeout(r, 700));
        await pullConversationKeySources(null).catch(() => {});
        // Second pull after identity/vault may have landed mid-wait.
        if (!hasIdentity) {
          await pullAndConsumeIdentityPackages().catch(() => {});
          if (await hasLocalUserIdentityPrivates().catch(() => false)) {
            await pullAndConsumeKeyVault(null, { force: true }).catch(() => 0);
          }
        }
      } else {
        console.info('[e2e] heal — all known chats have local keys', { vaultRecovered });
      }

      // Second pass for chats that still look locked in the sidebar.
      const stillLocked = e2eConvs.filter((c) => {
        const last = c?.last_message;
        return !!(
          last
          && (last.is_encrypted || last.e2e)
          && (last._e2e_locked || last._decryptFailed
            || isLockedE2eBody(last.body) || isSidebarPreviewLocked(last))
        );
      }).map((c) => String(c.id)).slice(0, 20);

      stillLocked.forEach((cid) => requestKeyIfNeeded(cid, { force: true }));
      if (stillLocked.length) {
        await new Promise((r) => setTimeout(r, 500));
        await pullConversationKeySources(null).catch(() => {});
      }

      if (active && conversationRequiresE2e(state, active)) {
        await dispatch('refreshE2eMessages', active).catch(() => {});
        scheduleLockedRefresh(dispatch, active, [800, 2500, 6000]);
      }
      await dispatch('refreshLockedSidebarPreviews').catch(() => {});
      // Re-decrypt every already-loaded chat once identity is local — never wait for a peer message.
      if (hasIdentity) {
        await dispatch('unlockAllE2eHistory').catch(() => {});
      }

      if (toRequest.length || stillLocked.length || !hasIdentity) {
        startE2eUnlockPoller(dispatch);
      }

      console.info('[e2e] healNewDeviceE2e done', {
        vaultRecovered,
        requested: toRequest.length,
        stillLocked: stillLocked.length,
        hasIdentity,
      });
      dispatch('fetchE2eRecoveryStatus').catch(() => {});
    })().finally(() => {
      newDeviceHealPromise = null;
    });
    return newDeviceHealPromise;
  },

  /** After identity/vault recovery: decrypt loaded histories without waiting for new messages. */
  async unlockAllE2eHistory({ dispatch, state }) {
    await dispatch('refreshLockedSidebarPreviews').catch(() => {});
    const active = state.activeConversationId;
    if (active && conversationRequiresE2e(state, active)) {
      await dispatch('refreshE2eMessages', active).catch(() => {});
    }
    const convs = (state.conversations || [])
      .filter((c) => conversationRequiresE2e(state, c.id))
      .slice(0, 40);
    await Promise.allSettled(convs.map(async (c) => {
      const key = Object.prototype.hasOwnProperty.call(state.messages, c.id)
        ? c.id
        : (Object.prototype.hasOwnProperty.call(state.messages, String(c.id))
          ? String(c.id)
          : null);
      if (key == null) return;
      if (!(state.messages[key] || []).length) return;
      await dispatch('refreshE2eMessages', c.id).catch(() => {});
    }));
  },

  /**
   * Lightweight follow-up after heal: consume any keys that arrived late
   * (sibling redistribute / identity transfer) and re-decrypt locked UI.
   */
  async unlockPendingE2e({ dispatch, state }) {
    const hadIdentity = await hasLocalUserIdentityPrivates().catch(() => false);
    if (!hadIdentity) {
      // Lightweight: pull any packages already queued — do not re-run full adopt
      // (that POSTs /request and blocks for seconds; syncE2e owns that path).
      await pullAndConsumeIdentityPackages().catch(() => {});
    }
    const hasIdentity = await hasLocalUserIdentityPrivates().catch(() => false);
    if (hasIdentity) {
      await pullAndConsumeKeyVault(null, { force: true }).catch(() => 0);
    }
    await pullConversationKeySources(null).catch(() => {});

    const e2eConvs = (state.conversations || [])
      .filter((c) => conversationRequiresE2e(state, c.id));
    const localIds = new Set(
      (await listConversationIdsWithLocalKeys().catch(() => [])).map(String),
    );
    const missing = e2eConvs
      .map((c) => String(c.id))
      .filter((id) => !localIds.has(id));
    missing.slice(0, 40).forEach((cid) => requestKeyIfNeeded(cid, { force: true }));

    e2eConvs.forEach((c) => {
      const last = c?.last_message;
      if (
        last
        && (last.is_encrypted || last.e2e)
        && (last._e2e_locked || last._decryptFailed
          || isLockedE2eBody(last.body) || isSidebarPreviewLocked(last))
      ) {
        requestKeyIfNeeded(c.id, { force: true });
      }
    });

    const active = state.activeConversationId;
    if (active && conversationRequiresE2e(state, active)) {
      await dispatch('refreshE2eMessages', active).catch(() => {});
    }
    await dispatch('refreshLockedSidebarPreviews').catch(() => {});
    if (!hadIdentity && hasIdentity) {
      // Identity just arrived — recover vault keys and refresh UI.
      await dispatch('healNewDeviceE2e', { force: true }).catch(() => {});
    }
  },

  /**
   * HTTP path (no WebSocket): devices of the same account push/pull keys.
   * Holders wrap identity + conversation keys for siblings; new devices adopt
   * identity, pull the vault/packages, and decrypt locked history.
   */
  async syncE2eAcrossDevices({ dispatch, state }) {
    if (!e2eEnabledFromState(state)) return;
    if (!isMessengerRoute()) return;
    if (syncE2eInflight) return syncE2eInflight;

    syncE2eInflight = (async () => {
    const myDid = await getMyDeviceId().catch(() => null);
    const listRes = await listCryptoDevices().catch(() => null);
    const devices = listRes?.devices || listRes?.data || [];
    const siblingIds = devices
      .map((d) => d.device_id || d.deviceId)
      .filter((id) => id && myDid && String(id) !== String(myDid))
      .sort();
    const fingerprint = siblingIds.join('|');

    let hasIdentity = await hasLocalUserIdentityPrivates().catch(() => false);
    if (!hasIdentity) {
      const seamless = await trySeamlessIdentityRestore().catch(() => false);
      const adopted = seamless || await adoptUserIdentityFromSiblings().catch(() => false);
      if (adopted || await hasLocalUserIdentityPrivates().catch(() => false)) {
        await ensureSeamlessMultiDeviceBackup().catch(() => false);
        await pullConversationKeySources(null).catch(() => {});
        await dispatch('healNewDeviceE2e', { force: true }).catch(() => {});
        await dispatch('unlockAllE2eHistory').catch(() => {});
      } else {
        // Keep polling siblings/vault — do not force a passphrase modal.
        if (!e2eUnlockPollTimers.length) startE2eUnlockPoller(dispatch);
        await dispatch('fetchE2eRecoveryStatus').catch(() => {});
      }
      return;
    }

    await ensureSeamlessMultiDeviceBackup().catch(() => false);

    if (siblingIds.length) {
      const setChanged = fingerprint !== lastSiblingFingerprint;
      if (setChanged) {
        lastSiblingFingerprint = fingerprint;
        siblingShareAttempts = 0;
      }
      const now = Date.now();
      const shouldPush = setChanged
        || (siblingShareAttempts < 3 && now - lastSiblingShareAt > 4000);
      if (shouldPush) {
        lastSiblingShareAt = now;
        siblingShareAttempts += 1;
        await transferUserIdentityToSiblings().catch(() => {});
        await uploadAllLocalKeysToVault().catch(() => {});
        clearForceRedistributeGuard();
        await dispatch('redistributeE2eKeysForKnownConversations', { force: true }).catch(() => {});
      }
    }

    const needsUnlock = (state.conversations || []).some((c) => {
      const last = c?.last_message;
      return !!(
        last
        && (last.is_encrypted || last.e2e)
        && (last._e2e_locked || last._decryptFailed
          || isLockedE2eBody(last.body) || isSidebarPreviewLocked(last)
          || isEncryptedDisplayBody(last))
      );
    });
    if (needsUnlock && Date.now() - lastSyncUnlockAt > 60_000) {
      lastSyncUnlockAt = Date.now();
      await dispatch('unlockPendingE2e').catch(() => {});
    }
    })().finally(() => {
      syncE2eInflight = null;
    });
    return syncE2eInflight;
  },

  async fetchE2eRecoveryStatus({ commit, dispatch }) {
    // Silent unlock paths first — user should not need a typed encryption password.
    if (!(await hasLocalUserIdentityPrivates().catch(() => false))) {
      await trySeamlessIdentityRestore().catch(() => false);
    } else {
      await ensureSeamlessMultiDeviceBackup().catch(() => false);
    }
    const status = await getIdentityRecoveryStatus().catch(() => ({
      hasBackup: false,
      hasLocalPrivates: false,
      pending: false,
    }));
    if (status.hasLocalPrivates) {
      await dispatch('unlockPendingE2e').catch(() => {});
    }
    // No blocking modal on normal login. Manual recovery stays in Settings.
    const prompt = null;
    commit('SET_E2E_RECOVERY', { ...status, prompt });
    return { ...status, prompt };
  },

  async enableE2eRecovery({ dispatch }, passphrase) {
    await enableIdentityRecovery(passphrase);
    await uploadAllLocalKeysToVault().catch(() => {});
    await dispatch('fetchE2eRecoveryStatus');
    return true;
  },

  async restoreE2eFromRecovery({ dispatch }, passphrase) {
    await restoreIdentityFromRecovery(passphrase);
    await pullConversationKeySources(null).catch(() => {});
    await dispatch('healNewDeviceE2e', { force: true }).catch(() => {});
    await dispatch('unlockAllE2eHistory').catch(() => {});
    await dispatch('fetchE2eRecoveryStatus');
    return true;
  },

  dismissE2eRecoveryPrompt({ commit, state }) {
    const current = state.e2eRecovery?.prompt;
    if (current === 'setup') dismissRecoverySetupPrompt();
    if (current === 'restore') dismissRecoveryRestorePrompt();
    commit('SET_E2E_RECOVERY', { prompt: null });
  },

  async sendMessageAction({ commit, state: st, rootState, dispatch }, { conversationId, body, type = 'text', meta = null }) {
    const meId = authUserId(rootState);
    const clientId = newClientId();
    const localSeq = nextLocalSeq();
    const replyTo = st.replyTo;
    const options = {};
    if (replyTo) {
      options.replyToId = replyTo.id;
      options.replyShowTitle = st.settings.quote_with_title;
    }
    if (type && type !== 'text') options.type = type;
    if (meta) options.meta = meta;

    // If draft already promoted mid-chunk, paint on the real conversation.
    let paintId = conversationId;
    if (
      isDraftConversationId(paintId)
      && !st.draftConversation
      && st.activeConversationId
      && !isDraftConversationId(st.activeConversationId)
    ) {
      paintId = st.activeConversationId;
    }

    const optimistic = {
      id: clientId,
      client_id: clientId,
      conversation_id: paintId,
      user_id: meId,
      body,
      type: type || 'text',
      meta: meta || null,
      created_at: new Date().toISOString(),
      local_seq: localSeq,
      reply_to_id: replyTo ? replyTo.id : null,
      reply_show_title: options.replyShowTitle !== undefined ? options.replyShowTitle : true,
      reply_to: replyTo
        ? {
          id: replyTo.id,
          user_id: replyTo.user_id,
          body: replyTo.body,
          type: replyTo.type,
          meta: replyTo.meta || null,
          user: replyTo.user || null,
        }
        : null,
      read_at: null,
      // Live WS: paint single check immediately (Telegram). Offline stays queued.
      // Never start "sending" then flip back to clock after a check.
      pending: true,
      failed: false,
      awaiting_server: false,
      send_status: SEND_STATUS.QUEUED,
      // Own plaintext is known locally even before the server ack / decrypt path.
      ...(conversationRequiresE2e(st, paintId) ? {
        is_encrypted: true,
        _e2e_decrypted: true,
        _e2e_locked: false,
      } : {}),
    };
    // Wire-sent only when socket + conversation channel are actually live.
    // Cold subscribe still in-flight → keep queued (avoids fake ticks / "lost" feel).
    const liveAtPaint = isRealtimeSendReady()
      && isSendTransportReady()
      && (isDraftConversationId(paintId) || isConversationChannelLive(paintId));
    if (liveAtPaint) {
      Object.assign(optimistic, wireSentPatch(clientId), {
        conversation_id: paintId,
        user_id: meId,
        body,
        type: type || 'text',
        meta: meta || null,
        created_at: optimistic.created_at,
        local_seq: localSeq,
        reply_to_id: optimistic.reply_to_id,
        reply_to: optimistic.reply_to,
        is_encrypted: optimistic.is_encrypted,
        _e2e_decrypted: optimistic._e2e_decrypted,
        _e2e_locked: optimistic._e2e_locked,
      });
    }
    if (conversationRequiresE2e(st, paintId)) {
      rememberE2ePlaintext(clientId, body);
    }
    // Paint immediately — never wait for createConversation / contacts / encrypt.
    commit('ADD_OPTIMISTIC_MESSAGE', { conversationId: paintId, message: optimistic });
    commit('UPDATE_CONVERSATION_PREVIEW', { conversationId: paintId, message: optimistic });
    commit('SET_REPLY', null);
    commit('CLEAR_DRAFT_TEXT', paintId);

    // Memory row first — HTTP must not wait on IndexedDB (media blob writes lock IDB).
    pendingTextRows.set(clientId, {
      client_id: clientId,
      conversation_id: paintId,
      kind: 'text',
      body,
      type: type || 'text',
      meta: meta || null,
      reply_to_id: replyTo ? replyTo.id : null,
      reply_show_title: options.replyShowTitle !== undefined ? options.replyShowTitle : true,
      created_at: optimistic.created_at,
      local_seq: localSeq,
      status: liveAtPaint ? 'sending' : 'queued',
      attempts: 0,
      user_id: meId,
    });

    outboxPut({
      client_id: clientId,
      conversation_id: paintId,
      kind: 'text',
      body,
      type: type || 'text',
      meta: meta || null,
      reply_to_id: replyTo ? replyTo.id : null,
      reply_show_title: options.replyShowTitle !== undefined ? options.replyShowTitle : true,
      created_at: optimistic.created_at,
      local_seq: localSeq,
      status: liveAtPaint ? 'sending' : 'queued',
      user_id: meId,
    }).catch(() => {});

    commit('SET_SENDING', false);

    // Offline / unreachable: keep clock (queued), never mark sent. Flush on reconnect.
    if (!isSendTransportReady()) {
      commit('UPDATE_MESSAGE', {
        conversationId: paintId,
        message: queuedPatch(clientId),
      });
      return Promise.resolve(optimistic);
    }

    // Parallel text lane (burst of N) — media uploads never share this slot.
    if (outboxInFlight.has(clientId)) return Promise.resolve();
    outboxInFlight.add(clientId);

    return enqueueTextSend(paintId, async () => {
      let cid = paintId;
      let row = null;
      try {
        if (isDraftConversationId(cid)) {
          const conv = await dispatch('promoteDraftConversation');
          cid = conv.id;
          const mem = pendingTextRows.get(clientId);
          if (mem) mem.conversation_id = cid;
          outboxUpdate(clientId, { conversation_id: cid }).catch(() => {});
        }
        const list = st.messages[cid] || [];
        const bubble = list.find((m) => m.client_id === clientId);
        if (bubble && isServerId(bubble.id) && !bubble.pending && !bubble.failed) {
          pendingTextRows.delete(clientId);
          outboxRemove(clientId).catch(() => {});
          return bubble;
        }
        row = pendingTextRows.get(clientId);
        if (!row) return null;

        // Sync readiness only — never await network probe on the hot path.
        if (!isSendTransportReady()) {
          commit('UPDATE_MESSAGE', {
            conversationId: cid,
            message: queuedPatch(clientId),
          });
          outboxUpdate(clientId, { status: 'queued', next_attempt_at: null }).catch(() => {});
          if (pendingTextRows.has(clientId)) {
            pendingTextRows.get(clientId).status = 'queued';
          }
          scheduleOutboxRetry(dispatch, 1500);
          return null;
        }

        const textOptions = {};
        if (row.reply_to_id) {
          textOptions.replyToId = row.reply_to_id;
          textOptions.replyShowTitle = row.reply_show_title;
        }
        if (row.type && row.type !== 'text') textOptions.type = row.type;
        if (row.meta) textOptions.meta = row.meta;

        let sendBody = row.body;
        let plainBody = row.body;
        let encMeta = null;
        if (conversationRequiresE2e(st, cid) && row.type !== 'system') {
          const allowMint = !conversationHasE2eHistory(st, cid);
          const encryptOnce = async () => {
            if (row.type === 'location' && row.meta) {
              return encryptLocationMessage(cid, row.meta, { allowMint });
            }
            return encryptTextMessage(cid, row.body, { allowMint });
          };
          try {
            encMeta = await encryptOnce();
          } catch (encErr) {
            // One device-repair pass for unknown-device / vault race, then retry.
            try {
              const { repairDeviceRegistration } = await import('@/crypto/messenger');
              await repairDeviceRegistration().catch(() => {});
              encMeta = await encryptOnce();
            } catch (encErr2) {
              throw encErr2 || encErr;
            }
          }
          if (encMeta) {
            if (row.type === 'location' && row.meta) {
              Object.assign(textOptions, {
                is_encrypted: true,
                sender_device_id: encMeta.sender_device_id,
                e2e: encMeta.e2e,
                meta: null,
              });
              sendBody = encMeta.body;
            } else {
              sendBody = encMeta.body;
              Object.assign(textOptions, {
                is_encrypted: true,
                sender_device_id: encMeta.sender_device_id,
                e2e: encMeta.e2e,
              });
            }
          }
        }
        if (conversationRequiresE2e(st, cid) && row.type !== 'system' && !encMeta) {
          throw new Error('e2e_encrypt_required');
        }
        if ((row.type || 'text') === 'text') {
          const flagged = withLinkFlag(
            textOptions.meta !== undefined ? textOptions.meta : row.meta,
            plainBody,
          );
          if (flagged) textOptions.meta = flagged;
        }

        const liveNow = isRealtimeSendReady();
        outboxUpdate(clientId, {
          status: 'sending',
          next_attempt_at: new Date().toISOString(),
        }).catch(() => {});
        if (pendingTextRows.has(clientId)) {
          pendingTextRows.get(clientId).status = 'sending';
        }

        // Never demote an already wire-sent tick back to the pending clock.
        const bubbleNow = (st.messages[cid] || []).find((m) => m.client_id === clientId);
        const alreadyWireSent = !!(bubbleNow && bubbleNow.awaiting_server && !bubbleNow.pending);
        if (!alreadyWireSent && !liveNow) {
          commit('UPDATE_MESSAGE', {
            conversationId: cid,
            message: sendingPatch(clientId),
          });
        } else if (!alreadyWireSent && liveNow) {
          commit('UPDATE_MESSAGE', {
            conversationId: cid,
            message: wireSentPatch(clientId),
          });
        }

        // Peer whisper over WS — ciphertext when E2E; peer paints instantly.
        const meUser = rootState.auth?.user || {};
        whisperOutgoingMessage(cid, {
          id: clientId,
          client_id: clientId,
          conversation_id: cid,
          user_id: meId,
          body: sendBody,
          type: row.type || 'text',
          meta: textOptions.meta !== undefined ? textOptions.meta : row.meta,
          created_at: row.created_at || new Date().toISOString(),
          local_seq: row.local_seq,
          reply_to_id: row.reply_to_id || null,
          reply_show_title: row.reply_show_title,
          is_encrypted: !!encMeta,
          sender_device_id: encMeta?.sender_device_id || null,
          e2e: encMeta?.e2e || null,
          read_at: null,
          delivered_at: null,
          pending: !liveNow,
          awaiting_server: true,
          send_status: liveNow ? SEND_STATUS.SENT : SEND_STATUS.SENDING,
          user: {
            id: meId,
            first_name: meUser.first_name,
            last_name: meUser.last_name,
            username: meUser.username,
            profile_pic: meUser.profile_pic,
          },
        });

        if (liveNow) {
          commit('UPDATE_MESSAGE', {
            conversationId: cid,
            message: wireSentPatch(clientId),
          });
        }

        let message = await sendWithRetry(cid, sendBody, clientId, textOptions);
        if (message) {
          // Own sends: keep plaintext locally — never show the locked placeholder
          // just because a server echo still carries ciphertext.
          if (encMeta) {
            rememberE2ePlaintext(clientId, plainBody);
            message = {
              ...message,
              client_id: message.client_id || clientId,
              local_seq: bubble?.local_seq || row.local_seq || message.local_seq,
              body: plainBody,
              is_encrypted: true,
              e2e: encMeta.e2e || message.e2e,
              _e2e_decrypted: true,
              _e2e_locked: false,
              _decryptFailed: false,
              _e2e_ciphertext: encMeta.body || message.body || null,
            };
            // E2E location: server strips clear coords — keep the optimistic
            // lat/lng so the sender map never blanks after durable ack.
            if (row.type === 'location' && row.meta?.lat != null && row.meta?.lng != null) {
              message.meta = {
                ...(message.meta || {}),
                lat: row.meta.lat,
                lng: row.meta.lng,
                accuracy: row.meta.accuracy ?? null,
              };
              message.type = 'location';
            }
          } else {
            message = await maybeDecryptMessage({
              ...message,
              client_id: message.client_id || clientId,
              local_seq: bubble?.local_seq || row.local_seq || message.local_seq,
            });
          }
          message = withSettledSendStatus(message);
        }
        pendingTextRows.delete(clientId);
        commit('APPEND_MESSAGE', { conversationId: cid, message });
        commit('UPDATE_CONVERSATION_PREVIEW', { conversationId: cid, message });
        outboxRemove(clientId).catch(() => {});
        return message;
      } catch (e) {
        if (isRequestCanceled(e)) {
          // SPA URL sync / navigation abort ≠ user cancel. Keep the optimistic
          // bubble and re-queue so the first message never vanishes.
          if (pendingTextRows.has(clientId)) {
            pendingTextRows.get(clientId).status = 'queued';
            pendingTextRows.get(clientId).conversation_id = cid;
          }
          commit('UPDATE_MESSAGE', {
            conversationId: cid,
            message: {
              ...queuedPatch(clientId),
              send_status: SEND_STATUS.QUEUED,
            },
          });
          outboxUpdate(clientId, {
            status: 'queued',
            conversation_id: cid,
            next_attempt_at: new Date(Date.now() + 400).toISOString(),
          }).catch(() => {});
          scheduleOutboxRetry(dispatch, 400);
          return null;
        }
        const attempts = (Number(pendingTextRows.get(clientId)?.attempts) || 0) + 1;
        const permanent = isPermanentSendError(e) || attempts >= MAX_OUTBOX_ATTEMPTS;
        const retriable = !permanent && isRetriableSendError(e);
        if (pendingTextRows.has(clientId)) {
          pendingTextRows.get(clientId).attempts = attempts;
          pendingTextRows.get(clientId).status = retriable ? 'queued' : 'failed';
        }
        if (retriable) {
          // First-message crypto races: retry almost immediately (not 400×2^n).
          const soft = /e2e|encrypt|crypto|device|key|قفل/i.test(
            String(e?.message || e?.response?.data?.message || ''),
          );
          const delay = soft && attempts <= 3
            ? Math.min(900, 250 * attempts)
            : outboxBackoffMs(attempts);
          const nextAt = new Date(Date.now() + delay).toISOString();
          commit('UPDATE_MESSAGE', {
            conversationId: cid,
            message: {
              ...queuedPatch(clientId),
              send_status: SEND_STATUS.QUEUED,
            },
          });
          outboxUpdate(clientId, {
            status: 'queued',
            attempts,
            last_error: String(e?.message || e?.response?.status || 'send_failed').slice(0, 200),
            next_attempt_at: nextAt,
          }).catch(() => {});
          scheduleOutboxRetry(dispatch, delay);
          return null;
        }
        // Whisper may have already delivered to the peer while HTTP timed out /
        // lost the ack. Reconcile by client_id before painting a false failure
        // (especially location messages).
        try {
          const failRow = row || pendingTextRows.get(clientId);
          const bubbleNow = (st.messages[cid] || []).find((m) => m.client_id === clientId);
          const wireLikely = !!(
            bubbleNow
            && (bubbleNow.awaiting_server
              || bubbleNow.send_status === SEND_STATUS.SENT
              || bubbleNow.send_status === SEND_STATUS.DELIVERED)
          );
          if (failRow && (wireLikely || failRow.type === 'location')) {
            const res = await getMessages(cid);
            const list = res?.data || res?.messages || (Array.isArray(res) ? res : []);
            const found = (list || []).find((m) => m && m.client_id === clientId);
            if (found && isServerId(found.id)) {
              let settled = await maybeDecryptMessage({
                ...found,
                client_id: clientId,
                local_seq: bubbleNow?.local_seq || failRow.local_seq || found.local_seq,
              });
              if (failRow.type === 'location' && failRow.meta?.lat != null && failRow.meta?.lng != null) {
                settled = {
                  ...settled,
                  type: 'location',
                  body: failRow.body || settled.body || '',
                  meta: {
                    ...(settled.meta || {}),
                    lat: failRow.meta.lat,
                    lng: failRow.meta.lng,
                    accuracy: failRow.meta.accuracy ?? null,
                  },
                  _e2e_decrypted: true,
                  _e2e_locked: false,
                  _decryptFailed: false,
                };
              }
              settled = withSettledSendStatus(settled);
              pendingTextRows.delete(clientId);
              commit('APPEND_MESSAGE', { conversationId: cid, message: settled });
              commit('UPDATE_CONVERSATION_PREVIEW', { conversationId: cid, message: settled });
              outboxRemove(clientId).catch(() => {});
              return settled;
            }
          }
        } catch (reconcileErr) { /* fall through to failed */ }
        commit('MARK_MESSAGE_FAILED', { conversationId: cid, clientId });
        outboxUpdate(clientId, {
          status: 'failed',
          attempts,
          last_error: String(e?.message || e?.response?.status || 'send_failed').slice(0, 200),
          next_attempt_at: null,
        }).catch(() => {});
        throw e;
      } finally {
        outboxInFlight.delete(clientId);
        commit('SET_SENDING', false);
      }
    });
  },

  /** Run one outbox item on its lane (text ∥ media). */
  enqueueOutboxSend({ commit, state: st, dispatch, rootState }, { conversationId, clientId, lane: laneHint = null }) {
    if (!clientId || outboxInFlight.has(clientId)) {
      return Promise.resolve();
    }
    outboxInFlight.add(clientId);

    const listPeek = st.messages[conversationId] || [];
    const bubblePeek = listPeek.find((m) => m.client_id === clientId);
    // Explicit hint from send*Action wins; else infer from the optimistic bubble.
    const lane = (laneHint === 'media' || laneHint === 'text')
      ? laneHint
      : (isMediaOutboxLane(bubblePeek, null) ? 'media' : 'text');

    const task = async () => {
      let settled = false;
      let rowAttempts = 0;
      let watchdog = null;
      let cid = conversationId;
      try {
        if (isDraftConversationId(cid)) {
          const conv = await dispatch('promoteDraftConversation');
          cid = conv.id;
          const mem = pendingTextRows.get(clientId);
          if (mem) mem.conversation_id = cid;
          outboxUpdate(clientId, { conversation_id: cid }).catch(() => {});
        }
        const list = st.messages[cid] || [];
        const bubble = list.find((m) => m.client_id === clientId);
        // Already reconciled by WS/HTTP — drop the durable row and skip HTTP.
        if (bubble && isServerId(bubble.id) && !bubble.pending && !bubble.failed) {
          pendingTextRows.delete(clientId);
          outboxRemove(clientId).catch(() => {});
          return bubble;
        }
        // Stuck failed bubble: never send again unless retryFailedMessage flipped it.
        if (bubble?.failed && !bubble?.pending) {
          outboxUpdate(clientId, { status: 'failed', next_attempt_at: null }).catch(() => {});
          return null;
        }
        // Never lock the composer send button on upload/send (Telegram-like).
        commit('SET_SENDING', false);

        // Offline / API down: keep queued clock, retry when transport recovers.
        // Skip probe — same as inline send (false offline kills first message).
        const ready = await ensureSendTransportReady({ probe: false });
        if (!ready.canSend) {
          commit('UPDATE_MESSAGE', {
            conversationId: cid,
            message: queuedPatch(clientId),
          });
          outboxUpdate(clientId, { status: 'queued' }).catch(() => {});
          scheduleOutboxRetry(dispatch, 2000);
          return null;
        }

        outboxUpdate(clientId, {
          status: 'sending',
          next_attempt_at: new Date().toISOString(),
        }).catch(() => {});
        commit('UPDATE_MESSAGE', {
          conversationId: cid,
          message: sendingPatch(clientId),
        });
        // Media uploads need a longer watchdog (large files / slow networks).
        const watchdogMs = lane === 'media' ? 5 * 60 * 1000 : 90 * 1000;
        watchdog = setTimeout(() => {
          if (settled) return;
          // Watchdog → requeue for auto-retry (not permanent fail) on flaky nets.
          commit('UPDATE_MESSAGE', {
            conversationId: cid,
            message: queuedPatch(clientId),
          });
          outboxUpdate(clientId, {
            status: 'queued',
            last_error: 'timeout',
            next_attempt_at: new Date(Date.now() + outboxBackoffMs(1)).toISOString(),
          }).catch(() => {});
          scheduleOutboxRetry(dispatch, outboxBackoffMs(1));
        }, watchdogMs);

        // Prefer memory / optimistic bubble — never await IDB on the text lane
        // (media blob writes lock IndexedDB and would serialize text behind uploads).
        let row = pendingTextRows.get(clientId) || null;
        if (!row && lane === 'media' && pendingMediaFiles.has(clientId)) {
          const mem = pendingMediaFiles.get(clientId);
          row = {
            client_id: clientId,
            conversation_id: cid,
            kind: 'media',
            body: mem.caption || '',
            type: mem.type,
            reply_to_id: mem.replyToId ?? null,
            reply_show_title: mem.replyShowTitle !== false,
            attempts: 0,
            status: 'sending',
            duration: mem.duration,
            width: mem.width,
            height: mem.height,
            silent: !!mem.silent,
            animation: !!mem.animation,
            sticker: !!mem.sticker,
            sticker_id: mem.stickerId || null,
            sticker_pack_id: mem.stickerPackId || null,
            sticker_emoji: mem.stickerEmoji || null,
            sticker_kind: mem.stickerKind || null,
            album_id: mem.albumId || null,
            album_index: mem.albumIndex != null ? mem.albumIndex : null,
            album_count: mem.albumCount != null ? mem.albumCount : null,
            media_id: mem.mediaId || null,
          };
        }
        if (!row && bubble && lane === 'text') {
          row = {
            client_id: clientId,
            conversation_id: cid,
            kind: 'text',
            body: bubble.body || '',
            type: bubble.type || 'text',
            meta: bubble.meta || null,
            reply_to_id: bubble.reply_to_id ?? null,
            reply_show_title: bubble.reply_show_title !== false,
            created_at: bubble.created_at,
            local_seq: bubble.local_seq,
            status: 'queued',
            attempts: 0,
            user_id: bubble.user_id,
          };
        }
        if (!row && lane === 'media') {
          // Media recovery after refresh — may briefly wait on IDB (text never does).
          const rows = await outboxListAll();
          row = rows.find((r) => r.client_id === clientId) || null;
        }
        if (!row) {
          settled = true;
          clearTimeout(watchdog);
          return null;
        }
        // Lane is authoritative — never run a media upload on the text lane.
        const runAsMedia = lane === 'media';
        rowAttempts = Number(row.attempts) || 0;
        if (!outboxIsDue(row) && row.status !== 'sending' && row.status !== 'queued') {
          settled = true;
          clearTimeout(watchdog);
          return null;
        }

        let message;
        if (runAsMedia) {
          const reuseMediaId = pendingMediaFiles.get(clientId)?.mediaId
            || row.media_id
            || null;
          let file = pendingMediaFiles.get(clientId)?.file || null;
          let coverFile = pendingMediaFiles.get(clientId)?.coverFile || null;
          if (!reuseMediaId && !(file instanceof Blob)) {
            const stored = await outboxGetBlob(clientId);
            if (!(stored?.blob instanceof Blob)) {
              throw new Error('Media file unavailable for send');
            }
            file = new File(
              [stored.blob],
              row.file_name || 'media',
              { type: row.file_type || stored.blob.type || 'application/octet-stream' },
            );
            if (stored.coverBlob instanceof Blob) {
              coverFile = new File(
                [stored.coverBlob],
                row.cover_name || 'cover.jpg',
                { type: row.cover_type || stored.coverBlob.type || 'image/jpeg' },
              );
            }
            pendingMediaFiles.set(clientId, {
              file,
              mediaId: null,
              type: row.type,
              caption: row.body || '',
              duration: row.duration,
              width: row.width,
              height: row.height,
              coverFile,
              silent: !!row.silent,
              animation: !!row.animation,
              sticker: !!row.sticker,
              stickerId: row.sticker_id || null,
              stickerPackId: row.sticker_pack_id || null,
              stickerEmoji: row.sticker_emoji || null,
              stickerKind: row.sticker_kind || null,
              albumId: row.album_id || null,
              albumIndex: row.album_index != null ? row.album_index : null,
              albumCount: row.album_count != null ? row.album_count : null,
              replyToId: row.reply_to_id,
              replyShowTitle: row.reply_show_title,
            });
          }
          const abortController = new AbortController();
          pendingMediaAborts.set(clientId, abortController);
          const onUploadProgress = makeUploadProgressHandler(
            commit,
            cid,
            clientId,
            reuseMediaId ? 1 : ((file?.size || 0) + (coverFile?.size || 0)),
          );
          try {
            const stickerMeta = (row.sticker || pendingMediaFiles.get(clientId)?.sticker)
              ? {
                sticker: true,
                sticker_id: row.sticker_id || pendingMediaFiles.get(clientId)?.stickerId || null,
                sticker_pack_id: row.sticker_pack_id || pendingMediaFiles.get(clientId)?.stickerPackId || null,
                sticker_emoji: row.sticker_emoji || pendingMediaFiles.get(clientId)?.stickerEmoji || null,
                sticker_kind: row.sticker_kind || pendingMediaFiles.get(clientId)?.stickerKind || 'image',
              }
              : null;
            let mediaPayload = {
              file: reuseMediaId ? null : file,
              mediaId: reuseMediaId || null,
              type: row.type,
              caption: row.body || '',
              clientId,
              replyToId: row.reply_to_id,
              replyShowTitle: row.reply_show_title,
              duration: row.duration,
              width: row.width,
              height: row.height,
              coverFile: reuseMediaId ? null : coverFile,
              silent: !!row.silent,
              animation: !!row.animation,
              albumId: row.album_id || null,
              albumIndex: row.album_index != null ? row.album_index : null,
              albumCount: row.album_count != null ? row.album_count : null,
              meta: stickerMeta,
              abortController,
              onUploadProgress,
            };
            let encMeta = null;
            // Stickers are public pack assets (Telegram-like) — never encrypt the
            // blob. Encrypting them hid CDN urls and left recipients stuck loading.
            const isStickerSend = !!(row.sticker || pendingMediaFiles.get(clientId)?.sticker || stickerMeta?.sticker);
            if (!reuseMediaId && !isStickerSend && conversationRequiresE2e(st, cid)) {
              encMeta = await encryptMediaMessage(cid, {
                file,
                type: row.type,
                caption: row.body || '',
                width: row.width,
                height: row.height,
                duration: row.duration,
              }, { allowMint: !conversationHasE2eHistory(st, cid) });
              mediaPayload = {
                ...mediaPayload,
                file: encMeta.file,
                caption: encMeta.captionCipher,
                is_encrypted: true,
                encrypted: true,
                sender_device_id: encMeta.sender_device_id,
                e2e: encMeta.e2e,
                coverFile: null,
              };
            }
            message = await sendMediaWithRetry(cid, mediaPayload);
            if (message && encMeta) {
              rememberE2ePlaintext(clientId, row.body || '', {
                _mediaKey: encMeta._mediaKey,
                _mediaIv: encMeta._mediaIv,
              });
              message = {
                ...message,
                body: row.body || '',
                is_encrypted: true,
                _e2e_decrypted: true,
                _mediaKey: encMeta._mediaKey,
                _mediaIv: encMeta._mediaIv,
                meta: {
                  ...(message.meta || {}),
                  mime: encMeta._mime || bubble?.meta?.mime,
                  name: encMeta._name || bubble?.meta?.name,
                  encrypted: true,
                },
              };
            }
          } finally {
            if (typeof onUploadProgress.markSettled === 'function') {
              onUploadProgress.markSettled();
            }
            pendingMediaAborts.delete(clientId);
          }
          try {
            if (message?.meta?.url && file instanceof Blob) await seedLocalMedia(message.meta.url, file);
          } catch (e) { /* noop */ }
          // Keep the optimistic blob preview on the settled row so the bubble
          // never blanks while the CDN URL is first painted / cached.
          const localPreview = bubble?.meta?.local_url || bubble?.meta?.url || null;
          const localCover = bubble?.meta?.local_cover || null;
          if (message && (localPreview || localCover)) {
            message = {
              ...message,
              client_id: message.client_id || clientId,
              local_seq: bubble?.local_seq || row.local_seq || message.local_seq,
              meta: {
                ...(message.meta || {}),
                local_url: (message.meta && message.meta.local_url) || localPreview,
                local_cover: (message.meta && message.meta.local_cover) || localCover,
              },
            };
          } else if (message) {
            message = {
              ...message,
              client_id: message.client_id || clientId,
              local_seq: bubble?.local_seq || row.local_seq || message.local_seq,
            };
          }
          // Retain the File so blob: URLs stay valid until CDN has painted.
          if (file instanceof Blob) {
            retainedMediaBlobs.set(clientId, file);
            setTimeout(() => retainedMediaBlobs.delete(clientId), 30 * 60 * 1000);
          }
          pendingMediaFiles.delete(clientId);
        } else {
          // TEXT PATH — must encrypt before HTTP (Saved/private/group). Sending
          // plaintext here was the cause of 422 "requires end-to-end encryption"
          // when hydrateAndFlushOutbox retried outbox rows.
          const textOptions = {};
          if (row.reply_to_id) {
            textOptions.replyToId = row.reply_to_id;
            textOptions.replyShowTitle = row.reply_show_title;
          }
          if (row.type && row.type !== 'text') textOptions.type = row.type;
          if (row.meta) textOptions.meta = row.meta;

          let sendBody = row.body;
          let plainBody = row.body;
          let encMeta = null;
          if (conversationRequiresE2e(st, cid) && row.type !== 'system') {
            const allowMint = !conversationHasE2eHistory(st, cid);
            if (row.type === 'location' && row.meta) {
              encMeta = await encryptLocationMessage(cid, row.meta, { allowMint });
              sendBody = encMeta.body;
              Object.assign(textOptions, {
                is_encrypted: true,
                sender_device_id: encMeta.sender_device_id,
                e2e: encMeta.e2e,
                meta: null,
              });
            } else {
              encMeta = await encryptTextMessage(cid, row.body, { allowMint });
              sendBody = encMeta.body;
              Object.assign(textOptions, {
                is_encrypted: true,
                sender_device_id: encMeta.sender_device_id,
                e2e: encMeta.e2e,
              });
            }
          }
          if (conversationRequiresE2e(st, cid) && row.type !== 'system' && !encMeta) {
            throw new Error('e2e_encrypt_required');
          }
          if ((row.type || 'text') === 'text') {
            const flagged = withLinkFlag(
              textOptions.meta !== undefined ? textOptions.meta : row.meta,
              plainBody,
            );
            if (flagged) textOptions.meta = flagged;
          }

          const liveNow = isRealtimeSendReady();
          const meUser = rootState.auth?.user || {};
          const whispered = whisperOutgoingMessage(cid, {
            id: clientId,
            client_id: clientId,
            conversation_id: cid,
            user_id: bubble?.user_id || row.user_id,
            body: sendBody,
            type: row.type || 'text',
            meta: textOptions.meta !== undefined ? textOptions.meta : row.meta,
            created_at: row.created_at || bubble?.created_at || new Date().toISOString(),
            local_seq: row.local_seq || bubble?.local_seq,
            reply_to_id: row.reply_to_id || null,
            reply_show_title: row.reply_show_title,
            is_encrypted: !!encMeta,
            sender_device_id: encMeta?.sender_device_id || null,
            e2e: encMeta?.e2e || null,
            read_at: null,
            delivered_at: null,
            pending: !liveNow,
            awaiting_server: true,
            send_status: liveNow ? SEND_STATUS.SENT : SEND_STATUS.SENDING,
            user: meUser?.id ? {
              id: meUser.id,
              first_name: meUser.first_name,
              last_name: meUser.last_name,
              username: meUser.username,
              profile_pic: meUser.profile_pic,
            } : undefined,
          });
          if (liveNow && whispered !== false) {
            commit('UPDATE_MESSAGE', {
              conversationId: cid,
              message: wireSentPatch(clientId),
            });
          }

          message = await sendWithRetry(cid, sendBody, clientId, textOptions);
          if (message) {
            if (encMeta) {
              rememberE2ePlaintext(clientId, plainBody);
              message = {
                ...message,
                client_id: message.client_id || clientId,
                local_seq: bubble?.local_seq || row.local_seq || message.local_seq,
                body: plainBody,
                is_encrypted: true,
                e2e: encMeta.e2e || message.e2e,
                _e2e_decrypted: true,
                _e2e_locked: false,
                _decryptFailed: false,
                _e2e_ciphertext: encMeta.body || message.body || null,
              };
            } else {
              message = {
                ...message,
                client_id: message.client_id || clientId,
                local_seq: bubble?.local_seq || row.local_seq || message.local_seq,
              };
            }
          }
        }

        settled = true;
        clearTimeout(watchdog);
        pendingTextRows.delete(clientId);
        // UI first — never hold checkmarks behind IndexedDB (media blob lock).
        // Only paint "sent" after server acknowledgment (numeric id).
        if (!message || !isServerId(message.id)) {
          commit('UPDATE_MESSAGE', {
            conversationId: cid,
            message: queuedPatch(clientId),
          });
          outboxUpdate(clientId, { status: 'queued' }).catch(() => {});
          scheduleOutboxRetry(dispatch, outboxBackoffMs(1));
          return null;
        }
        message = withSettledSendStatus(message);
        commit('APPEND_MESSAGE', { conversationId: cid, message });
        commit('UPDATE_CONVERSATION_PREVIEW', { conversationId: cid, message });
        outboxRemove(clientId).catch(() => {});
        return message;
      } catch (e) {
        settled = true;
        clearTimeout(watchdog);
        if (isRequestCanceled(e)) {
          // User cancel/delete already cleared outbox + bubble — do not resurrect.
          const stillQueued = pendingTextRows.has(clientId) || pendingMediaFiles.has(clientId);
          if (!stillQueued) {
            return null;
          }
          // Keep optimistic media/text bubble; navigation abort is retriable.
          if (pendingTextRows.has(clientId)) {
            pendingTextRows.get(clientId).status = 'queued';
            pendingTextRows.get(clientId).conversation_id = cid;
          }
          commit('UPDATE_MESSAGE', {
            conversationId: cid,
            message: queuedPatch(clientId),
          });
          outboxUpdate(clientId, {
            status: 'queued',
            conversation_id: cid,
            next_attempt_at: new Date(Date.now() + 400).toISOString(),
          }).catch(() => {});
          scheduleOutboxRetry(dispatch, 400);
          return null;
        }
        const attempts = rowAttempts + 1;
        const permanent = isPermanentSendError(e) || attempts >= MAX_OUTBOX_ATTEMPTS;
        const retriable = !permanent && isRetriableSendError(e);
        if (retriable) {
          const soft = /e2e|encrypt|crypto|device|key|قفل/i.test(
            String(e?.message || e?.response?.data?.message || ''),
          );
          const delay = soft && attempts <= 3
            ? Math.min(900, 250 * attempts)
            : outboxBackoffMs(attempts);
          const nextAt = new Date(Date.now() + delay).toISOString();
          if (pendingTextRows.has(clientId)) {
            pendingTextRows.get(clientId).attempts = attempts;
            pendingTextRows.get(clientId).status = 'queued';
          }
          commit('UPDATE_MESSAGE', {
            conversationId: cid,
            message: queuedPatch(clientId),
          });
          outboxUpdate(clientId, {
            status: 'queued',
            attempts,
            last_error: String(e?.message || e?.response?.status || 'send_failed').slice(0, 200),
            next_attempt_at: nextAt,
          }).catch(() => {});
          scheduleOutboxRetry(dispatch, delay);
          return null;
        }
        commit('MARK_MESSAGE_FAILED', { conversationId: cid, clientId });
        outboxUpdate(clientId, {
          status: 'failed',
          attempts,
          last_error: String(e?.message || e?.response?.status || 'send_failed').slice(0, 200),
          next_attempt_at: null,
        }).catch(() => {});
        throw e;
      } finally {
        outboxInFlight.delete(clientId);
        commit('SET_SENDING', false);
      }
    };

    return lane === 'text'
      ? enqueueTextSend(conversationId, task)
      : chainSendLane(lane, conversationId, task);
  },

  async sendMediaAction({ commit, state: st, rootState, dispatch }, {
    conversationId,
    file,
    type,
    caption = '',
    duration = null,
    width = null,
    height = null,
    localUrl = null,
    coverFile = null,
    localCover = null,
    silent = false,
    animation = false,
    albumId = null,
    albumIndex = null,
    albumCount = null,
    sticker = false,
    stickerId = null,
    stickerPackId = null,
    stickerEmoji = null,
    stickerKind = null,
    mediaId = null,
  }) {
    const meId = authUserId(rootState);
    const clientId = newClientId();
    const localSeq = nextLocalSeq();
    const replyTo = st.replyTo;
    const replyShowTitle = st.settings.quote_with_title;
    const name = file?.name || (type === 'voice' ? 'voice.webm' : 'media');
    const ext = String(name).includes('.') ? String(name).split('.').pop().toLowerCase() : '';
    let paintId = conversationId;
    if (
      isDraftConversationId(paintId)
      && !st.draftConversation
      && st.activeConversationId
      && !isDraftConversationId(st.activeConversationId)
    ) {
      paintId = st.activeConversationId;
    }
    const meta = {
      url: localUrl || null,
      local_url: localUrl || null,
      mime: file?.type || null,
      size: file?.size != null ? Number(file.size) : null,
      name,
      ext,
      width: width || null,
      height: height || null,
      duration: duration != null ? Number(duration) : null,
      cover_url: null,
      local_cover: localCover || null,
      silent: !!(silent || animation),
      animation: !!(animation || silent),
    };
    if (mediaId != null && mediaId !== '') {
      meta.media_id = Number(mediaId) || mediaId;
    }
    if (sticker) {
      meta.sticker = true;
      if (stickerId) meta.sticker_id = String(stickerId);
      if (stickerPackId) meta.sticker_pack_id = String(stickerPackId);
      if (stickerEmoji) meta.sticker_emoji = String(stickerEmoji);
      if (stickerKind) meta.sticker_kind = String(stickerKind);
      else if (localUrl || file) meta.sticker_kind = 'image';
    }
    if (albumId) {
      meta.album_id = String(albumId);
      if (albumIndex != null) meta.album_index = Number(albumIndex);
      if (albumCount != null) meta.album_count = Number(albumCount);
    }

    const optimistic = {
      id: clientId,
      client_id: clientId,
      conversation_id: paintId,
      user_id: meId,
      body: caption || '',
      type,
      media_id: mediaId != null && mediaId !== '' ? (Number(mediaId) || mediaId) : null,
      meta,
      created_at: new Date().toISOString(),
      local_seq: localSeq,
      reply_to_id: replyTo ? replyTo.id : null,
      reply_show_title: replyShowTitle,
      reply_to: replyTo
        ? {
          id: replyTo.id,
          user_id: replyTo.user_id,
          body: replyTo.body,
          type: replyTo.type,
          meta: replyTo.meta || null,
          user: replyTo.user || null,
        }
        : null,
      read_at: null,
      pending: true,
      failed: false,
      awaiting_server: false,
      send_status: SEND_STATUS.QUEUED,
      upload_progress: mediaId && !file ? 100 : 0,
    };
    pendingMediaFiles.set(clientId, {
      file: file || null,
      mediaId: mediaId != null && mediaId !== '' ? mediaId : null,
      type,
      caption,
      duration,
      width,
      height,
      coverFile,
      silent: meta.silent,
      animation: meta.animation,
      sticker: !!meta.sticker,
      stickerId: meta.sticker_id || null,
      stickerPackId: meta.sticker_pack_id || null,
      stickerEmoji: meta.sticker_emoji || null,
      stickerKind: meta.sticker_kind || null,
      albumId: albumId || null,
      albumIndex: albumIndex != null ? albumIndex : null,
      albumCount: albumCount != null ? albumCount : null,
      replyToId: replyTo ? replyTo.id : null,
      replyShowTitle,
    });
    commit('ADD_OPTIMISTIC_MESSAGE', { conversationId: paintId, message: optimistic });
    commit('UPDATE_CONVERSATION_PREVIEW', { conversationId: paintId, message: optimistic });
    if (!albumId || albumIndex === 0 || albumIndex == null) {
      commit('SET_REPLY', null);
    }

    // Start upload immediately — do not wait for IndexedDB blob persistence.
    // Text lane stays free because media never shares its promise chain.
    const sendPromise = dispatch('enqueueOutboxSend', { conversationId: paintId, clientId, lane: 'media' });
    outboxPut({
      client_id: clientId,
      conversation_id: paintId,
      kind: 'media',
      body: caption || '',
      type,
      meta: null,
      reply_to_id: replyTo ? replyTo.id : null,
      reply_show_title: replyShowTitle,
      created_at: optimistic.created_at,
      local_seq: localSeq,
      status: 'queued',
      user_id: meId,
      silent: meta.silent,
      animation: meta.animation,
      sticker: !!meta.sticker,
      sticker_id: meta.sticker_id || null,
      sticker_pack_id: meta.sticker_pack_id || null,
      sticker_emoji: meta.sticker_emoji || null,
      sticker_kind: meta.sticker_kind || null,
      album_id: albumId || null,
      album_index: albumIndex != null ? albumIndex : null,
      album_count: albumCount != null ? albumCount : null,
      duration,
      width,
      height,
      media_id: mediaId != null && mediaId !== '' ? mediaId : null,
      file_name: name,
      file_type: file?.type || null,
      cover_name: coverFile?.name || null,
      cover_type: coverFile?.type || null,
    }, { blob: file || null, coverBlob: coverFile || null }).catch(() => {});

    return sendPromise;
  },

  // Retry a previously failed optimistic message (same client id → idempotent).
  retryFailedMessage({ commit, dispatch }, { conversationId, message }) {
    if (!message || !message.client_id) return Promise.resolve();
    const clientId = message.client_id;
    commit('UPDATE_MESSAGE', {
      conversationId,
      message: {
        id: clientId,
        client_id: clientId,
        pending: true,
        failed: false,
        awaiting_server: false,
        send_status: SEND_STATUS.QUEUED,
        upload_progress: 0,
      },
    });
    outboxUpdate(clientId, {
      status: 'queued',
      attempts: 0,
      next_attempt_at: null,
      last_error: null,
    }).catch(() => {});
    const lane = isMediaOutboxLane(message, null) ? 'media' : 'text';
    if (lane === 'text') {
      pendingTextRows.set(clientId, {
        client_id: clientId,
        conversation_id: conversationId,
        kind: 'text',
        body: message.body || '',
        type: message.type || 'text',
        meta: message.meta || null,
        reply_to_id: message.reply_to_id ?? null,
        reply_show_title: message.reply_show_title !== false,
        created_at: message.created_at,
        local_seq: message.local_seq,
        status: 'queued',
        attempts: 0,
        user_id: message.user_id,
      });
    }
    if (!isSendTransportReady()) {
      scheduleOutboxRetry(dispatch, 800);
      return Promise.resolve();
    }
    return dispatch('enqueueOutboxSend', { conversationId, clientId, lane });
  },

  deleteFailedMessage({ commit }, { conversationId, clientId }) {
    if (!conversationId || !clientId) return;
    const ctrl = pendingMediaAborts.get(clientId);
    if (ctrl) {
      try { ctrl.abort(); } catch (e) { /* noop */ }
      pendingMediaAborts.delete(clientId);
    }
    pendingMediaFiles.delete(clientId);
    outboxRemove(clientId).catch(() => {});
    commit('REMOVE_FAILED_MESSAGE', { conversationId, clientId });
    commit('SYNC_CONVERSATION_PREVIEW', conversationId);
  },

  cancelMediaUpload({ commit }, { conversationId, clientId }) {
    if (!conversationId || !clientId) return;
    const ctrl = pendingMediaAborts.get(clientId);
    if (ctrl) {
      try { ctrl.abort(); } catch (e) { /* noop */ }
      pendingMediaAborts.delete(clientId);
    }
    pendingMediaFiles.delete(clientId);
    outboxRemove(clientId).catch(() => {});
    commit('REMOVE_FAILED_MESSAGE', { conversationId, clientId });
    commit('SYNC_CONVERSATION_PREVIEW', conversationId);
  },

  /**
   * Hydrate pending bubbles from IndexedDB and flush the durable send queue.
   * Safe to call on boot, reconnect, and tab focus.
   */
  async hydrateAndFlushOutbox({ commit, dispatch, state: st, rootState }) {
    if (outboxFlushPromise) return outboxFlushPromise;
    outboxFlushDispatch = dispatch;

    outboxFlushPromise = (async () => {
      // Don't burn battery / spam API while fully offline — wait for online.
      if (!isSendTransportReady()) {
        scheduleOutboxRetry(dispatch, 2500);
        // Still hydrate bubbles into the UI from IDB so the user sees queued clocks.
      }

      const meId = authUserId(rootState);
      const rows = await outboxListAll();
      if (!rows.length) return;

      for (const row of rows) {
        const cid = row.conversation_id;
        // Recover abandoned "sending" rows from a previous tab session.
        if (row.status === 'sending' && outboxIsDue(row)) {
          outboxUpdate(row.client_id, {
            status: 'queued',
            next_attempt_at: null,
          }).catch(() => {});
          row.status = 'queued';
          row.next_attempt_at = null;
        }
        const existing = st.messages[cid] || [];
        if (existing.some((m) => m.client_id === row.client_id)) continue;

        let localUrl = null;
        let localCover = null;
        if (row.kind === 'media') {
          const stored = await outboxGetBlob(row.client_id);
          if (stored?.blob instanceof Blob) {
            try { localUrl = URL.createObjectURL(stored.blob); } catch (e) { /* noop */ }
            pendingMediaFiles.set(row.client_id, {
              file: new File(
                [stored.blob],
                row.file_name || 'media',
                { type: row.file_type || stored.blob.type || 'application/octet-stream' },
              ),
              type: row.type,
              caption: row.body || '',
              duration: row.duration,
              width: row.width,
              height: row.height,
              coverFile: stored.coverBlob instanceof Blob
                ? new File(
                  [stored.coverBlob],
                  row.cover_name || 'cover.jpg',
                  { type: row.cover_type || stored.coverBlob.type || 'image/jpeg' },
                )
                : null,
              silent: !!row.silent,
              animation: !!row.animation,
              sticker: !!row.sticker,
              stickerId: row.sticker_id || null,
              stickerPackId: row.sticker_pack_id || null,
              stickerEmoji: row.sticker_emoji || null,
              stickerKind: row.sticker_kind || null,
              albumId: row.album_id || null,
              albumIndex: row.album_index != null ? row.album_index : null,
              albumCount: row.album_count != null ? row.album_count : null,
              replyToId: row.reply_to_id,
              replyShowTitle: row.reply_show_title,
            });
            if (stored.coverBlob instanceof Blob) {
              try { localCover = URL.createObjectURL(stored.coverBlob); } catch (e) { /* noop */ }
            }
          }
        }

        const optimistic = {
          id: row.client_id,
          client_id: row.client_id,
          conversation_id: cid,
          user_id: row.user_id || meId,
          body: row.body || '',
          type: row.type || 'text',
          meta: row.kind === 'media'
            ? {
              url: localUrl,
              local_url: localUrl,
              local_cover: localCover,
              mime: row.file_type,
              name: row.file_name,
              width: row.width,
              height: row.height,
              duration: row.duration,
              silent: !!row.silent,
              animation: !!row.animation,
              sticker: !!row.sticker,
              sticker_id: row.sticker_id || undefined,
              sticker_pack_id: row.sticker_pack_id || undefined,
              sticker_emoji: row.sticker_emoji || undefined,
              sticker_kind: row.sticker_kind || undefined,
              album_id: row.album_id || undefined,
              album_index: row.album_index ?? undefined,
              album_count: row.album_count ?? undefined,
            }
            : (row.meta || null),
          created_at: row.created_at,
          local_seq: row.local_seq,
          reply_to_id: row.reply_to_id,
          reply_show_title: row.reply_show_title,
          reply_to: null,
          read_at: null,
          pending: row.status !== 'failed',
          failed: row.status === 'failed',
          awaiting_server: false,
          send_status: row.status === 'failed'
            ? SEND_STATUS.FAILED
            : (row.status === 'sending' ? SEND_STATUS.SENDING : SEND_STATUS.QUEUED),
          upload_progress: row.kind === 'media' && row.status !== 'failed' ? 0 : null,
        };
        commit('ADD_OPTIMISTIC_MESSAGE', { conversationId: cid, message: optimistic });
        commit('UPDATE_CONVERSATION_PREVIEW', { conversationId: cid, message: optimistic });
        if (row.kind !== 'media' && row.status !== 'failed') {
          pendingTextRows.set(row.client_id, { ...row });
        }
      }

      if (!isSendTransportReady()) return;

      const byConv = new Map();
      const consider = (r) => {
        if (!r?.client_id || r.status === 'failed') return;
        if (outboxInFlight.has(r.client_id)) return;
        if (!outboxIsDue(r)) return;
        const list = byConv.get(r.conversation_id) || [];
        if (list.some((x) => x.client_id === r.client_id)) return;
        list.push(r);
        byConv.set(r.conversation_id, list);
      };
      rows.forEach(consider);
      // Memory rows may exist before IndexedDB finishes (offline tap → immediate queue).
      pendingTextRows.forEach((row) => consider(row));
      const soonestRetry = (() => {
        let soonest = null;
        const scan = (r) => {
          if (!r || r.status === 'failed') return;
          if (outboxIsDue(r)) return;
          const next = r.next_attempt_at ? Date.parse(r.next_attempt_at) : 0;
          if (Number.isFinite(next) && next > Date.now()) {
            const wait = next - Date.now();
            if (soonest == null || wait < soonest) soonest = wait;
          }
        };
        rows.forEach(scan);
        pendingTextRows.forEach(scan);
        return soonest;
      })();
      const flushPromises = [];
      byConv.forEach((list, conversationId) => {
        // Strict FIFO per conversation by local_seq (Telegram outbox order).
        // Text and media use separate lanes so uploads never block plain text.
        list.sort((a, b) => {
          const sa = Number(a.local_seq) || 0;
          const sb = Number(b.local_seq) || 0;
          if (sa !== sb) return sa - sb;
          return String(a.created_at || '').localeCompare(String(b.created_at || ''));
        });
        list.forEach((row) => {
          if (row.status === 'failed') return;
          const lane = isMediaOutboxLane(null, row) ? 'media' : 'text';
          flushPromises.push(
            dispatch('enqueueOutboxSend', { conversationId, clientId: row.client_id, lane }),
          );
        });
      });
      await Promise.allSettled(flushPromises);
      if (soonestRetry != null) {
        scheduleOutboxRetry(dispatch, soonestRetry + 50);
      }
    })().finally(() => {
      outboxFlushPromise = null;
    });

    return outboxFlushPromise;
  },

  async forwardMessagesAction({
    commit, state: st, rootState,
  }, {
    messageIds, toConversationId, dropAuthor = false, sourceMessages = [],
  }) {
    const meId = authUserId(rootState);
    const ids = (messageIds || []).filter((id) => id != null);
    if (!ids.length || !toConversationId) return [];

    const sources = (Array.isArray(sourceMessages) && sourceMessages.length)
      ? sourceMessages
      : (st.pendingForward?.messages || []);

    const findSource = (id, index) => {
      const byId = sources.find((m) => Number(m?.id) === Number(id));
      if (byId) return byId;
      return sources[index] || null;
    };

    const targetConv = findConversation(st, toConversationId);
    const targetIsSaved = targetConv?.type === 'saved';
    // Saved Messages is a cloud self-chat — never E2E-encrypt forwards into it.
    const targetNeedsE2e = targetIsSaved
      ? false
      : conversationRequiresE2e(st, toConversationId);
    // Encrypted *sources* still take the client path so we can decrypt first.
    const needsClientForward = targetNeedsE2e || sources.some((m) => m?.is_encrypted);

    const optimisticList = ids.map((id, index) => {
      const src = findSource(id, index) || {};
      const clientId = newClientId();
      const plainBody = (src._e2e_decrypted || !src.is_encrypted)
        ? (src.body || '')
        : '';
      const fwdFrom = dropAuthor
        ? null
        : (src.forwarded_from || src.user || null);
      const fwdChat = dropAuthor
        ? null
        : (src.forward_from_chat || src.meta?.fwd_chat || null);
      return {
        id: clientId,
        client_id: clientId,
        conversation_id: toConversationId,
        user_id: meId,
        body: plainBody || (
          src.is_encrypted && !['photo', 'video', 'voice', 'audio', 'file'].includes(src.type)
            ? LOCKED_PLACEHOLDER
            : (src.body || '')
        ),
        type: src.type || 'text',
        meta: src.meta ? { ...src.meta } : null,
        created_at: new Date(Date.now() + index).toISOString(),
        local_seq: nextLocalSeq(),
        pending: true,
        failed: false,
        awaiting_server: false,
        send_status: SEND_STATUS.QUEUED,
        forwarded_from: fwdFrom,
        forward_from_chat: fwdChat,
        reply_to: null,
        reply_to_id: null,
        read_at: null,
        is_encrypted: !!targetNeedsE2e,
        _e2e_decrypted: !!targetNeedsE2e,
        _mediaKey: src._mediaKey || null,
        _mediaIv: src._mediaIv || null,
        _source: src,
      };
    });

    optimisticList.forEach((message) => {
      commit('ADD_OPTIMISTIC_MESSAGE', { conversationId: toConversationId, message });
      // WS-first: destination peers paint before HTTP/DB durability.
      const meUser = rootState.auth?.user || {};
      whisperOutgoingMessage(toConversationId, {
        id: message.client_id,
        client_id: message.client_id,
        conversation_id: toConversationId,
        user_id: meId,
        body: message.body,
        type: message.type || 'text',
        meta: message.meta,
        created_at: message.created_at,
        local_seq: message.local_seq,
        reply_to_id: null,
        forwarded_from: message.forwarded_from || null,
        forward_from_chat: message.forward_from_chat || null,
        is_encrypted: !!message.is_encrypted,
        read_at: null,
        delivered_at: null,
        pending: false,
        user: {
          id: meId,
          first_name: meUser.first_name,
          last_name: meUser.last_name,
          username: meUser.username,
          profile_pic: meUser.profile_pic,
        },
      });
    });
    if (optimisticList.length) {
      commit('UPDATE_CONVERSATION_PREVIEW', {
        conversationId: toConversationId,
        message: optimisticList[optimisticList.length - 1],
      });
    }
    commit('CLEAR_PENDING_FORWARD');
    commit('CLEAR_SELECTION');

    if (!needsClientForward) {
      try {
        const res = await forwardMessages(toConversationId, ids, dropAuthor);
        const created = res.data || [];
        created.forEach((message, i) => {
          const opt = optimisticList[i];
          commit('APPEND_MESSAGE', {
            conversationId: toConversationId,
            message: opt?.client_id
              ? { ...message, client_id: opt.client_id }
              : message,
          });
        });
        if (created.length < optimisticList.length) {
          optimisticList.slice(created.length).forEach((opt) => {
            commit('MARK_MESSAGE_FAILED', {
              conversationId: toConversationId,
              clientId: opt.client_id,
            });
          });
        }
        if (created.length) {
          commit('UPDATE_CONVERSATION_PREVIEW', {
            conversationId: toConversationId,
            message: created[created.length - 1],
          });
        }
        return created;
      } catch (e) {
        console.warn(
          '[messenger] server forward failed',
          e?.response?.data?.message || e?.message || e,
          { toConversationId, ids, dropAuthor },
        );
        optimisticList.forEach((opt) => {
          commit('MARK_MESSAGE_FAILED', {
            conversationId: toConversationId,
            clientId: opt.client_id,
          });
        });
        throw e;
      }
    }

    // Client-side re-encrypt forward (required for E2E source or target).

    // Warm target crypto once before the pool — wraps/omit cache ready for all items.
    if (targetNeedsE2e) {
      await prewarmConversationCrypto(toConversationId).catch(() => {});
    }

    const attributionPayload = (opt) => {
      if (dropAuthor) return { drop_author: true };
      const out = {};
      const fromId = opt.forwarded_from?.id || opt._source?.user_id || null;
      if (fromId) out.forwarded_from_user_id = Number(fromId);
      const fwdChat = opt.forward_from_chat || opt._source?.forward_from_chat || opt._source?.meta?.fwd_chat || null;
      if (fwdChat) {
        out.meta = {
          fwd_chat: fwdChat,
          fwd_message_id: opt._source?.meta?.fwd_message_id || opt._source?.id || null,
        };
      }
      return out;
    };

    const mediaUrlOf = (m) => m?.meta?.local_url || m?.meta?.url || null;

    /** Same encryption mode + durable source id → reuse storage path (no re-upload). */
    const canReuseMediaPath = (plain) => {
      const srcEnc = !!(plain.is_encrypted || plain.meta?.encrypted);
      if (!plain.id || !isServerId(plain.id)) return false;
      // MessageResource strips raw paths; media_id / proxy url are enough to
      // ask the server to clone by reference via forward_from_message_id.
      const hasMediaRef = !!(
        plain.media_id
        || plain.meta?.media_id
        || plain.meta?.path
        || plain.meta?.url
      );
      if (!hasMediaRef) return false;
      if (srcEnc && targetNeedsE2e) return !!(plain._mediaKey && plain._mediaIv);
      if (!srcEnc && !targetNeedsE2e) return true;
      return false;
    };

    const materializeForwardFile = async (plain) => {
      const type = plain.type || 'file';
      const mime = plain.meta?.mime
        || (type === 'photo' ? 'image/jpeg'
          : type === 'video' ? 'video/mp4'
            : type === 'audio' ? 'audio/mpeg'
              : type === 'voice' ? 'audio/webm'
                : 'application/octet-stream');
      const name = plain.meta?.name
        || (type === 'photo' ? 'photo.jpg'
          : type === 'video' ? 'video.mp4'
            : type === 'audio' ? 'audio.mp3'
              : type === 'voice' ? 'voice.webm'
                : 'file.bin');

      const url = mediaUrlOf(plain);
      if (!url) throw new Error('Media URL missing for forward');

      const { downloadMedia } = await import('@/views/components/messenger/mediaCache');
      const { blobUrl, remoteUrl } = await downloadMedia(url, { message: plain });
      const fetchUrl = blobUrl || remoteUrl;
      if (!fetchUrl || (String(fetchUrl).includes('/messenger/media/') && plain.is_encrypted && !blobUrl)) {
        throw new Error('Could not decrypt media for forward');
      }
      const res = await fetch(fetchUrl);
      if (!res.ok) throw new Error(`Media fetch failed (${res.status})`);
      const blob = await res.blob();
      return new File([blob], name, { type: mime || blob.type || 'application/octet-stream' });
    };

    const forwardOne = async (opt) => {
      const src = opt._source || {};
      let plain = src;
      if (src.is_encrypted && !src._e2e_decrypted) {
        plain = await maybeDecryptMessage(src);
      }
      if (plain._decryptFailed || plain._e2e_locked) {
        throw new Error('Cannot forward undecrypted message');
      }

      const type = plain.type || 'text';
      const attr = attributionPayload({ ...opt, _source: plain });
      let message;
      if (['photo', 'video', 'voice', 'audio', 'file'].includes(type)) {
        const caption = plain.body && plain.body !== LOCKED_PLACEHOLDER ? plain.body : '';

        // Recover media keys so same-mode forwards reuse storage (no re-upload).
        if (
          targetNeedsE2e
          && (plain.is_encrypted || plain.meta?.encrypted)
          && !(plain._mediaKey && plain._mediaIv)
          && plain.id
          && isServerId(plain.id)
        ) {
          const again = await decryptIncomingMessage({
            ...plain,
            _e2e_decrypted: false,
            _e2e_locked: false,
            _decryptFailed: false,
          }).catch(() => plain);
          if (again?._mediaKey && again?._mediaIv) {
            plain = { ...plain, ...again, _mediaKey: again._mediaKey, _mediaIv: again._mediaIv };
          }
        }

        if (canReuseMediaPath(plain)) {
          if (targetNeedsE2e) {
            const envelope = await encryptOutgoingMediaEnvelope(toConversationId, type, {
              caption,
              fileKey: { mkB64: plain._mediaKey, mivB64: plain._mediaIv },
              name: plain.meta?.name || `file.${type}`,
              mime: plain.meta?.mime || 'application/octet-stream',
              width: plain.meta?.width ?? null,
              height: plain.meta?.height ?? null,
              duration: plain.meta?.duration ?? null,
            }, { allowMint: !conversationHasE2eHistory(st, toConversationId) });
            message = await sendMessage(
              toConversationId,
              envelope.body,
              opt.client_id,
              {
                type,
                is_encrypted: true,
                sender_device_id: envelope.sender_device_id,
                e2e: envelope.e2e,
                forward_from_message_id: plain.id,
                ...attr,
              },
            );
            message = {
              ...message,
              body: caption,
              type,
              is_encrypted: true,
              _e2e_decrypted: true,
              _e2e_locked: false,
              _decryptFailed: false,
              _mediaKey: plain._mediaKey,
              _mediaIv: plain._mediaIv,
              meta: {
                ...(message.meta || {}),
                mime: plain.meta?.mime,
                name: plain.meta?.name,
                encrypted: true,
                width: plain.meta?.width ?? message.meta?.width,
                height: plain.meta?.height ?? message.meta?.height,
                duration: plain.meta?.duration ?? message.meta?.duration,
              },
            };
          } else {
            message = await sendMessage(
              toConversationId,
              caption,
              opt.client_id,
              {
                type,
                forward_from_message_id: plain.id,
                ...attr,
              },
            );
            message = { ...message, body: caption, type };
          }
        } else {
          const file = await materializeForwardFile(plain);
          if (targetNeedsE2e) {
            const encMeta = await encryptMediaMessage(toConversationId, {
              file,
              type,
              caption,
              width: plain.meta?.width ?? null,
              height: plain.meta?.height ?? null,
              duration: plain.meta?.duration ?? null,
            }, { allowMint: !conversationHasE2eHistory(st, toConversationId) });
            message = await sendMediaMessage(toConversationId, {
              file: encMeta.file,
              type,
              caption: encMeta.captionCipher,
              clientId: opt.client_id,
              duration: plain.meta?.duration ?? null,
              width: plain.meta?.width ?? null,
              height: plain.meta?.height ?? null,
              is_encrypted: true,
              encrypted: true,
              sender_device_id: encMeta.sender_device_id,
              e2e: encMeta.e2e,
              forwarded_from_user_id: attr.forwarded_from_user_id || null,
              drop_author: !!attr.drop_author,
              meta: attr.meta || null,
            });
            message = {
              ...message,
              body: caption,
              type,
              is_encrypted: true,
              _e2e_decrypted: true,
              _e2e_locked: false,
              _decryptFailed: false,
              _mediaKey: encMeta._mediaKey,
              _mediaIv: encMeta._mediaIv,
              meta: {
                ...(message.meta || {}),
                mime: encMeta._mime || plain.meta?.mime,
                name: encMeta._name || plain.meta?.name,
                encrypted: true,
                width: plain.meta?.width ?? message.meta?.width,
                height: plain.meta?.height ?? message.meta?.height,
                duration: plain.meta?.duration ?? message.meta?.duration,
              },
            };
          } else {
            message = await sendMediaMessage(toConversationId, {
              file,
              type,
              caption,
              clientId: opt.client_id,
              duration: plain.meta?.duration ?? null,
              width: plain.meta?.width ?? null,
              height: plain.meta?.height ?? null,
              forwarded_from_user_id: attr.forwarded_from_user_id || null,
              drop_author: !!attr.drop_author,
              meta: attr.meta || null,
            });
            message = { ...message, body: caption, type };
          }
        }
      } else if (type === 'location' && plain.meta) {
        const enc = targetNeedsE2e
          ? await encryptLocationMessage(toConversationId, plain.meta, {
            allowMint: !conversationHasE2eHistory(st, toConversationId),
          })
          : null;
        message = await sendMessage(
          toConversationId,
          enc ? enc.body : '',
          opt.client_id,
          enc
            ? {
              type: 'location',
              is_encrypted: true,
              sender_device_id: enc.sender_device_id,
              e2e: enc.e2e,
              meta: attr.meta || null,
              forwarded_from_user_id: attr.forwarded_from_user_id,
              drop_author: !!attr.drop_author,
            }
            : {
              type: 'location',
              meta: { ...plain.meta, ...(attr.meta || {}) },
              forwarded_from_user_id: attr.forwarded_from_user_id,
              drop_author: !!attr.drop_author,
            },
        );
        if (enc) {
          message = {
            ...message,
            body: '',
            meta: plain.meta,
            _e2e_decrypted: true,
            is_encrypted: true,
          };
        }
      } else {
        const text = plain.body || '';
        const enc = targetNeedsE2e
          ? await encryptTextMessage(toConversationId, text, {
            allowMint: !conversationHasE2eHistory(st, toConversationId),
          })
          : null;
        message = await sendMessage(
          toConversationId,
          enc ? enc.body : text,
          opt.client_id,
          enc
            ? {
              type: 'text',
              is_encrypted: true,
              sender_device_id: enc.sender_device_id,
              e2e: enc.e2e,
              meta: attr.meta || null,
              forwarded_from_user_id: attr.forwarded_from_user_id,
              drop_author: !!attr.drop_author,
            }
            : {
              type: 'text',
              meta: attr.meta || undefined,
              forwarded_from_user_id: attr.forwarded_from_user_id,
              drop_author: !!attr.drop_author,
            },
        );
        if (enc) {
          message = {
            ...message,
            body: text,
            _e2e_decrypted: true,
            is_encrypted: true,
          };
        }
      }

      return {
        ...message,
        client_id: opt.client_id,
        forwarded_from: dropAuthor ? null : (message.forwarded_from || opt.forwarded_from),
        forward_from_chat: dropAuthor ? null : (message.forward_from_chat || opt.forward_from_chat),
      };
    };

    // Parallel pool (3) — text/reference forwards no longer wait serially.
    const FORWARD_CONCURRENCY = 3;
    const results = new Array(optimisticList.length);
    let nextIdx = 0;
    const workers = Array.from(
      { length: Math.min(FORWARD_CONCURRENCY, optimisticList.length) },
      async () => {
        while (nextIdx < optimisticList.length) {
          const i = nextIdx;
          nextIdx += 1;
          const opt = optimisticList[i];
          try {
            const message = await forwardOne(opt);
            commit('APPEND_MESSAGE', { conversationId: toConversationId, message });
            results[i] = message;
          } catch (e) {
            console.warn('[e2e] client forward failed', e);
            commit('MARK_MESSAGE_FAILED', {
              conversationId: toConversationId,
              clientId: opt.client_id,
            });
          }
        }
      },
    );
    await Promise.all(workers);

    const created = results.filter(Boolean);
    if (created.length) {
      commit('UPDATE_CONVERSATION_PREVIEW', {
        conversationId: toConversationId,
        message: created[created.length - 1],
      });
    }
    return created;
  },

  async bulkDeleteAction({ commit, state: st }, { conversationId, messageIds, scope = 'everyone' }) {
    const ids = (messageIds || []).filter((id) => id != null);
    if (!ids.length) return;
    const existing = st.messages[conversationId] || [];
    const snapshots = ids
      .map((messageId) => existing.find((m) => sameMessageId(m.id, messageId)))
      .filter(Boolean)
      .map((m) => ({ ...m }));

    // Optimistic UI — remove immediately; persist async.
    ids.forEach((messageId) => commit('REMOVE_MESSAGE', { conversationId, messageId }));
    commit('SYNC_CONVERSATION_PREVIEW', conversationId);
    commit('CLEAR_SELECTION');

    try {
      await bulkDeleteMessages(ids, scope);
    } catch (e) {
      snapshots.forEach((message) => {
        commit('APPEND_MESSAGE', { conversationId, message });
      });
      commit('SYNC_CONVERSATION_PREVIEW', conversationId);
      throw e;
    }
  },

  async editMessageAction({ commit, state: st }, { conversationId, messageId, body }) {
    const existing = (st.messages[conversationId] || []).find((m) => sameMessageId(m.id, messageId));
    const prevSnapshot = existing ? { ...existing } : null;

    // Paint immediately — encrypt + POST run in the background of the UI.
    commit('UPDATE_MESSAGE', {
      conversationId,
      message: {
        id: messageId,
        body,
        edited_at: new Date().toISOString(),
        pending_edit: true,
        is_encrypted: !!conversationRequiresE2e(st, conversationId),
        _e2e_decrypted: true,
        _e2e_locked: false,
        _decryptFailed: false,
      },
    });
    commit('SYNC_CONVERSATION_PREVIEW', conversationId);

    try {
      let payloadBody = body;
      const options = {};
      if (conversationRequiresE2e(st, conversationId)) {
        const enc = await encryptTextMessage(conversationId, body, {
          allowMint: !conversationHasE2eHistory(st, conversationId),
        });
        payloadBody = enc.body;
        Object.assign(options, {
          is_encrypted: true,
          sender_device_id: enc.sender_device_id,
          e2e: enc.e2e,
        });
      }
      let message = await editMessage(messageId, payloadBody, options);
      if (options.is_encrypted) {
        message = {
          ...message,
          body,
          is_encrypted: true,
          _e2e_decrypted: true,
          _e2e_locked: false,
        };
      }
      commit('UPDATE_MESSAGE', {
        conversationId,
        message: { ...message, pending_edit: false },
      });
      commit('SYNC_CONVERSATION_PREVIEW', conversationId);
      return message;
    } catch (e) {
      if (prevSnapshot) {
        commit('UPDATE_MESSAGE', { conversationId, message: { ...prevSnapshot, pending_edit: false } });
        commit('SYNC_CONVERSATION_PREVIEW', conversationId);
      }
      throw e;
    }
  },

  async deleteMessageAction({ commit, state: st }, { conversationId, messageId, scope = 'everyone' }) {
    const existing = (st.messages[conversationId] || []).find((m) => sameMessageId(m.id, messageId));
    const snapshot = existing ? { ...existing } : null;

    // Optimistic remove — peers / local UI update before HTTP/DB.
    commit('REMOVE_MESSAGE', { conversationId, messageId });
    commit('SYNC_CONVERSATION_PREVIEW', conversationId);

    try {
      await deleteMessage(messageId, scope);
    } catch (e) {
      if (snapshot) {
        commit('APPEND_MESSAGE', { conversationId, message: snapshot });
        commit('SYNC_CONVERSATION_PREVIEW', conversationId);
      }
      throw e;
    }
  },

  async fetchSettings({ commit, state: st, dispatch }) {
    if (settingsFetchPromise) return settingsFetchPromise;
    settingsFetchPromise = (async () => {
      try {
        // Config + settings are independent — fetch in parallel on the boot path.
        const [, settings] = await Promise.all([
          dispatch('fetchSystemConfig'),
          getSettings(),
        ]);
        commit('SET_SETTINGS', settings);
        // Hydrate wallpaper from cloud when present (multi-device sync).
        if (settings?.wallpaper_config && typeof settings.wallpaper_config === 'object') {
          commit('REPLACE_WALLPAPER', settings.wallpaper_config);
        } else if (!st.wallpaper) {
          commit('REPLACE_WALLPAPER', loadWallpaper());
        }
        // The browser preference is applied synchronously during boot and may
        // have just been changed while this GET was in flight. Only use the
        // server value when this browser has no preference of its own.
        if (!localStorage.getItem('theme') && settings?.theme) {
          applyThemePreference(settings.theme);
        }
      } catch (e) {
        /* keep defaults — access errors handled via systemConfig */
        if (e?.response?.status === 403 || e?.response?.status === 503) {
          commit('SET_SYSTEM_CONFIG', {
            enabled: e?.response?.status !== 503,
            access_allowed: false,
            disabled_message: e?.response?.data?.message,
            access_denied_message: e?.response?.data?.message,
          });
        }
      }
    })().finally(() => {
      settingsFetchPromise = null;
    });
    return settingsFetchPromise;
  },

  async fetchSystemConfig({ commit, dispatch, state }) {
    if (systemConfigFetchPromise) return systemConfigFetchPromise;
    systemConfigFetchPromise = (async () => {
      try {
        const cfg = await getSystemConfig();
        commit('SET_SYSTEM_CONFIG', cfg);
        if (cfg?.uploads) {
          applyMessengerUploadLimits(cfg.uploads);
        }
        if (cfg?.e2e?.enabled !== false && cfg?.features?.e2e !== false) {
          ensureE2eBootstrapped(state)
            .then((ok) => {
              if (!ok) return;
              return dispatch('refreshLockedSidebarPreviews')
                .then(() => dispatch('healNewDeviceE2e', { force: true }))
                .then(() => dispatch('fetchE2eRecoveryStatus'));
            })
            .catch((err) => console.warn('messenger e2e bootstrap failed', err));
        }
        return cfg;
      } catch (e) {
        if (e?.response?.status === 403 || e?.response?.status === 503) {
          commit('SET_SYSTEM_CONFIG', {
            enabled: e?.response?.status !== 503,
            access_allowed: false,
            disabled_message: e?.response?.data?.message,
            access_denied_message: e?.response?.data?.message,
          });
        }
        return null;
      }
    })().finally(() => {
      systemConfigFetchPromise = null;
    });
    return systemConfigFetchPromise;
  },

  async saveSettings({ commit }, data) {
    const settings = await updateSettings(data);
    commit('SET_SETTINGS', settings);
    return settings;
  },

  setWallpaper({ commit, dispatch }, patch) {
    commit('SET_WALLPAPER', patch);
    // Debounce cloud sync so sliders stay snappy.
    if (wallpaperSyncTimer) clearTimeout(wallpaperSyncTimer);
    wallpaperSyncTimer = setTimeout(() => {
      wallpaperSyncTimer = null;
      dispatch('syncWallpaperSettings').catch(() => {});
    }, 600);
  },

  async syncWallpaperSettings({ state: st, commit }) {
    try {
      const settings = await updateSettings({ wallpaper_config: wallpaperToApi(st.wallpaper) });
      commit('SET_SETTINGS', settings);
    } catch (e) { /* offline ok — local cache remains */ }
  },

  async fetchWallpapers({ commit }) {
    try {
      const list = await listWallpapers();
      commit('SET_MY_WALLPAPERS', list);
      return list;
    } catch (e) {
      return [];
    }
  },

  async uploadWallpaper({ commit }, file) {
    const item = await uploadWallpaper(file);
    commit('PREPEND_MY_WALLPAPER', item);
    return item;
  },

  async deleteWallpaper({ commit, state: st }, wallpaperId) {
    await deleteWallpaper(wallpaperId);
    commit('REMOVE_MY_WALLPAPER', wallpaperId);
    if (Number(st.wallpaper?.wallpaper_id) === Number(wallpaperId)) {
      commit('SET_WALLPAPER', { type: 'image', url: '', wallpaper_id: null });
    }
  },

  async fetchConversationWallpaper({ commit }, conversationId) {
    if (!conversationId || conversationId === 'draft') return null;
    try {
      const res = await getConversationWallpaper(conversationId);
      const cfg = res?.config || null;
      commit('SET_CONVERSATION_WALLPAPER', { conversationId, config: cfg });
      return cfg;
    } catch (e) {
      return null;
    }
  },

  async applyConversationWallpaper({ commit }, { conversationId, config, forBoth = false }) {
    if (!conversationId || conversationId === 'draft') return null;
    // Never persist a local blob preview as a chat wallpaper.
    if (config?.url && String(config.url).startsWith('blob:')) {
      throw new Error('Wallpaper must be uploaded before apply');
    }
    const apiConfig = config ? wallpaperToApi(config) : null;
    if (apiConfig?.type === 'custom' && !apiConfig.url && !apiConfig.wallpaper_id) {
      throw new Error('Wallpaper custom url missing');
    }
    const wallpaperId = apiConfig?.wallpaper_id || null;
    const cid = String(conversationId);
    // Optimistic: update chat background immediately on Apply.
    commit('SET_CONVERSATION_WALLPAPER', {
      conversationId: cid,
      config: config ? normalizeWallpaper(config) : null,
    });
    const res = await setConversationWallpaper(cid, {
      config: apiConfig,
      forBoth,
      wallpaperId,
    });
    commit('SET_CONVERSATION_WALLPAPER', {
      conversationId: cid,
      config: res?.config || (config ? normalizeWallpaper(config) : null),
    });
    return res;
  },

  async clearConversationWallpaper({ commit }, payload) {
    const conversationId = typeof payload === 'object' ? payload?.conversationId : payload;
    const forBoth = typeof payload === 'object' ? !!payload?.forBoth : false;
    if (!conversationId || conversationId === 'draft') return;
    const cid = String(conversationId);
    commit('SET_CONVERSATION_WALLPAPER', { conversationId: cid, config: null });
    await setConversationWallpaper(cid, { config: null, forBoth });
    commit('SET_CONVERSATION_WALLPAPER', { conversationId: cid, config: null });
  },

  async startConversation({ commit, state: st }, userId) {
    const conv = await createConversation(userId);
    // Keep empty privates out of the sidebar; promote on first message.
    if (st.conversations.some((c) => c.id === conv.id)) {
      return conv;
    }
    commit('SET_OVERLAY_CONVERSATION', conv);
    return conv;
  },

  // Open (or lazily create) the personal "Saved Messages" chat.
  // Always refresh from the server so a swipe-hidden Saved chat is restored
  // with its history (Telegram-style durable self-chat).
  async openSavedMessages({ commit }) {
    const conv = await openSavedConversation();
    commit('UPSERT_CONVERSATION', conv);
    return conv;
  },

  // Pull a brand-new conversation (created by an incoming first message) into the list.
  async ingestNewConversation({ commit, dispatch }, conversationId) {
    try {
      const conv = await getConversation(conversationId);
      commit('PREPEND_CONVERSATION', conv);
      dispatch('fetchUnreadCount');
    } catch (e) {
      // Fallback: full resync if the single fetch fails
      dispatch('fetchConversations');
      dispatch('fetchUnreadCount');
    }
  },

  // Search a user across ALL users, add them as a contact, and open the chat.
  // Used by forward / explicit open — first-message draft path uses promoteDraftConversation.
  async startChatWithUser({ dispatch }, user) {
    const name = (user.first_name || user.last_name)
      ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
      : user.username;
    dispatch('addContactQuiet', { contactUserId: user.id, name }).catch(() => {});
    return dispatch('startConversation', user.id);
  },

  /**
   * Kick off find-or-create + device warm while the user is still typing.
   * Does NOT remap draft → real until the first send (sidebar stays clean).
   */
  async prefetchDraftConversation({ state: st, dispatch }) {
    const partner = st.draftConversation?.partner;
    const userId = partner?.id;
    if (!userId || !isDraftConversationId(st.activeConversationId)) return null;

    // Warm crypto device in parallel so first encrypt does not wait on register.
    import('@/crypto/messenger/device')
      .then((m) => m.ensureDevice())
      .catch(() => {});

    if (draftCreatePrefetch && Number(draftCreatePrefetch.userId) === Number(userId)) {
      return draftCreatePrefetch.promise;
    }

    const promise = dispatch('startConversation', userId)
      .then((conv) => {
        if (draftCreatePrefetch?.promise === promise) {
          draftCreatePrefetch = { userId, promise, conv };
        }
        return conv;
      })
      .catch((e) => {
        if (draftCreatePrefetch?.promise === promise) draftCreatePrefetch = null;
        throw e;
      });

    draftCreatePrefetch = { userId, promise, conv: null };
    return promise;
  },

  /**
   * Telegram-style: promote local draft → real private conversation once.
   * Optimistic bubbles already painted under `draft`; remap after create.
   * Prefetch from draft-open makes this a near no-op by send time.
   */
  async promoteDraftConversation({ commit, state: st, dispatch }) {
    if (draftPromotePromise) return draftPromotePromise;

    if (!st.draftConversation) {
      const id = st.activeConversationId;
      if (id && !isDraftConversationId(id)) {
        const fromOverlay = st.overlayConversation && Number(st.overlayConversation.id) === Number(id)
          ? st.overlayConversation
          : null;
        const fromList = st.conversations.find((c) => Number(c.id) === Number(id));
        return fromOverlay || fromList || { id };
      }
      throw new Error('No draft conversation to promote');
    }

    const partner = st.draftConversation.partner;
    const userId = partner?.id;
    if (!userId) throw new Error('Draft has no partner');

    draftPromotePromise = (async () => {
      try {
        const name = (partner.first_name || partner.last_name)
          ? `${partner.first_name || ''} ${partner.last_name || ''}`.trim()
          : partner.username;
        // Contacts must never block first message.
        dispatch('addContactQuiet', { contactUserId: userId, name }).catch(() => {});

        let conv = null;
        const prefetch = draftCreatePrefetch;
        if (prefetch && Number(prefetch.userId) === Number(userId)) {
          conv = prefetch.conv || await prefetch.promise;
        } else {
          // Create + ensure device in parallel (encrypt needs device immediately after).
          const deviceWarm = import('@/crypto/messenger/device')
            .then((m) => m.ensureDevice())
            .catch(() => {});
          [conv] = await Promise.all([
            dispatch('startConversation', userId),
            deviceWarm,
          ]);
        }
        draftCreatePrefetch = null;

        migrateLaneTails('draft', conv.id);

        const draftMsgs = st.messages.draft || [];
        draftMsgs.forEach((m) => {
          if (!m?.client_id) return;
          const row = pendingTextRows.get(m.client_id);
          if (row) row.conversation_id = conv.id;
          outboxUpdate(m.client_id, { conversation_id: conv.id }).catch(() => {});
        });

        commit('REMAP_DRAFT_TO_CONVERSATION', { conversation: conv });
        // Warm whisper channel without selectConversation / history refetch.
        ensureConversationChannel(conv.id);
        // Surface the chat in the sidebar as soon as the real id exists
        // (optimistic bubble already painted — don't wait for HTTP send).
        const last = (st.messages[conv.id] || []).slice(-1)[0];
        if (last) {
          commit('UPDATE_CONVERSATION_PREVIEW', { conversationId: conv.id, message: last });
        }
        return conv;
      } finally {
        draftPromotePromise = null;
      }
    })();

    return draftPromotePromise;
  },

  async fetchContacts({ commit, state }) {
    commit('SET_CONTACTS_LOADING', true);
    try {
      const res = await getContacts(state.contactsSort || 'name_asc');
      const list = Array.isArray(res) ? res : (res?.data || []);
      commit('SET_CONTACTS', list);
    } finally {
      commit('SET_CONTACTS_LOADING', false);
    }
  },

  /** Add contact without blocking; refresh list in background. */
  async addContactQuiet({ dispatch }, { contactUserId, name }) {
    try {
      await addContact(contactUserId, name);
    } catch (e) {
      // Already a contact or transient — ignore.
    }
    dispatch('fetchContacts').catch(() => {});
  },

  async addContactAction({ dispatch }, { contactUserId, name }) {
    await addContact(contactUserId, name);
    await dispatch('fetchContacts');
  },

  async updateContactAction({ commit, dispatch }, { contactId, data }) {
    // Instant UI: patch local contact before / after the request.
    if (contactId && data && Object.prototype.hasOwnProperty.call(data, 'name')) {
      commit('PATCH_CONTACT', { id: contactId, name: data.name });
    }
    try {
      const res = await updateContact(contactId, data);
      const patched = res && !Array.isArray(res) && res.data && !res.id ? res.data : res;
      if (patched?.id) commit('PATCH_CONTACT', patched);
    } catch (e) {
      await dispatch('fetchContacts');
      throw e;
    }
    await dispatch('fetchContacts');
  },

  async deleteContactAction({ dispatch }, contactId) {
    await deleteContact(contactId);
    await dispatch('fetchContacts');
  },

  async searchUsersAction(_, query) {
    return searchUsers(query);
  },

  async lookupContactAction(_ctx, identifier) {
    return lookupContact(identifier);
  },

  async inviteContactAction({ dispatch }, identifier) {
    const res = await inviteContact(identifier);
    if (res.status === 'added') {
      await dispatch('fetchContacts');
    }
    return res;
  },

  async syncContactsAction({ commit, dispatch }, contacts) {
    commit('SET_SYNCED_CONTACTS_LOADING', true);
    try {
      const res = await syncContacts(contacts);
      commit('SET_SYNCED_CONTACTS', {
        registered: res.registered || [],
        inviteable: res.inviteable || [],
        last_synced_at: new Date().toISOString(),
      });
      await dispatch('fetchContacts');
      return res;
    } finally {
      commit('SET_SYNCED_CONTACTS_LOADING', false);
    }
  },

  async refreshContactSyncAction({ commit, dispatch }) {
    commit('SET_SYNCED_CONTACTS_LOADING', true);
    try {
      const res = await refreshContactSync();
      commit('SET_SYNCED_CONTACTS', {
        registered: res.registered || [],
        inviteable: res.inviteable || [],
        last_synced_at: new Date().toISOString(),
      });
      await dispatch('fetchContacts');
      return res;
    } finally {
      commit('SET_SYNCED_CONTACTS_LOADING', false);
    }
  },

  async fetchSyncedContacts({ commit }) {
    commit('SET_SYNCED_CONTACTS_LOADING', true);
    try {
      const res = await getSyncedContacts();
      commit('SET_SYNCED_CONTACTS', res);
      return res;
    } finally {
      commit('SET_SYNCED_CONTACTS_LOADING', false);
    }
  },

  async savePrivacySetting({ dispatch }, { key, rule, always_allow, never_allow }) {
    const slice = { rule };
    if (always_allow !== undefined) {
      slice.always_allow = (always_allow || []).map((u) => (typeof u === 'object' ? u.id : u));
    }
    if (never_allow !== undefined) {
      slice.never_allow = (never_allow || []).map((u) => (typeof u === 'object' ? u.id : u));
    }
    return dispatch('saveSettings', { privacy: { [key]: slice } });
  },

  async fetchBlocked({ commit }) {
    commit('SET_BLOCKED_LOADING', true);
    try {
      const data = await getBlockedContacts();
      commit('SET_BLOCKED', data);
    } finally {
      commit('SET_BLOCKED_LOADING', false);
    }
  },

  async blockUserAction({ dispatch }, userId) {
    await blockUser(userId);
    await dispatch('fetchBlocked');
    await dispatch('fetchContacts');
  },

  async unblockUserAction({ dispatch }, userId) {
    await unblockUser(userId);
    await dispatch('fetchBlocked');
    await dispatch('fetchContacts');
  },

  async fetchUnreadCount({ commit }) {
    if (!isMessengerRoute()) return;
    // Dedupe bursts from MessengerPage / recoverStream.
    if (Date.now() - lastUnreadFetchAt < 1500 && lastUnreadFetchAt > 0) {
      return;
    }
    const res = await getUnreadCount();
    commit('SET_UNREAD_COUNT', res.unread_count);
    lastUnreadFetchAt = Date.now();
  },

  /**
   * Single entry for messenger page boot: settings, stream, conversations,
   * unread (via list meta when possible), outbox, then deferred contacts.
   */
  async bootstrapSession({ dispatch, state }) {
    if (bootstrapSessionPromise) return bootstrapSessionPromise;

    bootstrapSessionPromise = (async () => {
      const settingsP = dispatch('fetchSettings');
      // Realtime first so SPA entry recovers the socket before list paint.
      dispatch('startStream');

      const cached = state.conversations || [];
      const hasCachedList = cached.length > 0;
      // Silent refresh only when cached rows already have displayable peers —
      // otherwise hollow "— / ?" placeholders would flash instead of a skeleton.
      const cacheReady = hasCachedList && cached.every((c) => {
        if (!c || c.type === 'saved' || c.type === 'group' || c.type === 'channel') return true;
        return !!(c.partner?.id || (Array.isArray(c.users) && c.users.some((u) => u?.id != null)));
      });
      await Promise.all([
        settingsP,
        dispatch('fetchConversations', { silent: cacheReady }),
      ]);

      // List meta usually set unread; refresh the badge off the critical path.
      if (Date.now() - lastUnreadFetchAt > 5000) {
        dispatch('fetchUnreadCount').catch(() => {});
      }

      dispatch('hydrateAndFlushOutbox').catch(() => {});
      // Durable multi-device: push any local conversation keys into the
      // identity vault so future devices can decrypt without a new message.
      uploadAllLocalKeysToVault().catch(() => {});
      transferUserIdentityToSiblings().catch(() => {});

      // Defer contacts until after first paint — not on the critical path.
      if (!(state.contacts || []).length) {
        const defer = typeof requestIdleCallback === 'function'
          ? (fn) => requestIdleCallback(fn, { timeout: 2000 })
          : (fn) => setTimeout(fn, 0);
        defer(() => {
          dispatch('fetchContacts').catch(() => {});
          // Needed for empty-list onboarding / suggested contacts.
          dispatch('fetchSyncedContacts').catch(() => {});
        });
      } else {
        dispatch('fetchSyncedContacts').catch(() => {});
      }
    })().finally(() => {
      bootstrapSessionPromise = null;
    });

    return bootstrapSessionPromise;
  },

  async deleteConversationAction({ commit }, conversationId) {
    await deleteConversation(conversationId);
    commit('REMOVE_CONVERSATION', conversationId);
  },

  async clearConversationAction({ commit }, conversationId) {
    await clearConversation(conversationId);
    commit('SET_CONVERSATION_CLEARED', { conversationId, byMe: true });
    commit('MARK_CONVERSATION_LOADED', conversationId);
    commit('SYNC_CONVERSATION_PREVIEW', conversationId);
  },

  async muteConversationAction({ commit, state: st }, conversationId) {
    const id = Number(conversationId);
    const conv = st.conversations.find((c) => Number(c.id) === id)
      || (st.overlayConversation && Number(st.overlayConversation.id) === id
        ? st.overlayConversation
        : null);
    const mute = !(conv && conv.pivot && conv.pivot.muted_at);
    await muteConversation(conversationId, mute);
    commit('SET_CONVERSATION_MUTE', { conversationId: id, mute });
  },

  async markConversationReadAction({ commit }, conversationId) {
    // Clearing *my* unread only — do not paint partner read ticks here.
    // Ticks arrive via `messages.read` when the peer actually reads.
    await markRead(conversationId);
    commit('RESET_CONVERSATION_UNREAD', conversationId);
  },

  async authoritativeRefresh({ commit, dispatch, state: st }) {
    await Promise.all([
      dispatch('fetchConversations', { silent: true }),
      dispatch('fetchUnreadCount'),
    ]);

    const conversationId = st.activeConversationId;
    if (!conversationId) return;
    if (!st.conversations.some((conversation) => conversation.id === conversationId)) {
      commit('SET_ACTIVE_CONVERSATION', null);
      return;
    }

    // Only refetch history when the open chat has no seeded cache yet.
    if (!st.loadedConversationIds[conversationId]) {
      await Promise.all([
        dispatch('fetchMessages', { conversationId }),
        dispatch('fetchPins', conversationId),
      ]);
      commit('MARK_CONVERSATION_LOADED', conversationId);
    } else {
      dispatch('fetchPins', conversationId);
    }
  },

  recoverStream(context) {
    const {
      dispatch, rootState,
    } = context;
    const userId = authUserId(rootState);
    if (!userId) return Promise.resolve();
    if (!isMessengerRoute()) return Promise.resolve();
    if (recoveryPromise) return recoveryPromise;

    let recovered = false;
    recoveryPromise = (async () => {
      let cursor = readCursor(userId);
      const bootstrap = cursor === null;

      if (bootstrap) {
        // Establish sync cursor; conversation list is loaded once by MessengerPage.
        const marker = await syncEvents('0');
        cursor = normalizeCursor(marker.high_watermark ?? marker.cursor) || '0';
        writeCursor(userId, cursor);
      }

      let hasMore;
      do {
        // eslint-disable-next-line no-await-in-loop
        const page = await syncEvents(cursor);
        const events = Array.isArray(page.events) ? page.events : [];
        // Server order is ascending, but sorting also protects compatibility
        // with an older or intermediary API implementation.
        events.sort((a, b) => compareCursors(a.id, b.id));
        // eslint-disable-next-line no-restricted-syntax
        for (const event of events) {
          const eventId = normalizeCursor(event.id);
          if (!eventId || compareCursors(eventId, cursor) <= 0) continue;
          // eslint-disable-next-line no-await-in-loop
          await dispatch('handleRealtimeEvent', {
            type: event.type,
            data: event.payload || {},
            id: eventId,
          });
          cursor = eventId;
          bufferedDurableEvents.delete(eventId);
          writeCursor(userId, cursor);
        }
        hasMore = page.has_more === true;
      } while (hasMore);

      // Realtime events may have arrived while HTTP replay was in flight. The
      // durable log remains authoritative, so make one more pass whenever a
      // buffered event is ahead of the cursor rather than applying out of order.
      bufferedDurableEvents.forEach((_event, id) => {
        if (compareCursors(id, cursor) <= 0) bufferedDurableEvents.delete(id);
      });
      if ([...bufferedDurableEvents.keys()].some((id) => compareCursors(id, cursor) > 0)) {
        let hasMore;
        do {
          // eslint-disable-next-line no-await-in-loop
          const page = await syncEvents(cursor);
          const events = Array.isArray(page.events) ? page.events : [];
          events.sort((a, b) => compareCursors(a.id, b.id));
          // eslint-disable-next-line no-restricted-syntax
          for (const event of events) {
            const eventId = normalizeCursor(event.id);
            if (!eventId || compareCursors(eventId, cursor) <= 0) continue;
            // eslint-disable-next-line no-await-in-loop
            await dispatch('handleRealtimeEvent', {
              type: event.type,
              data: event.payload || {},
              id: eventId,
            });
            cursor = eventId;
            bufferedDurableEvents.delete(eventId);
            writeCursor(userId, cursor);
          }
          hasMore = page.has_more === true;
        } while (hasMore);
      }

      if (bootstrap) {
        // Prefer list meta / recent fetch — avoid duplicate /unread-count on boot.
        if (Date.now() - lastUnreadFetchAt > 3000) {
          await dispatch('fetchUnreadCount');
        }
      }
      recovered = true;
      dispatch('hydrateAndFlushOutbox').catch(() => {});
    })().finally(() => {
      recoveryPromise = null;
      if (recovered) {
        const cursor = readCursor(userId) || '0';
        if ([...bufferedDurableEvents.keys()].some((id) => compareCursors(id, cursor) > 0)) {
          // A broadcast may arrive at the end of recovery or briefly outrun a
          // read-routed query. Keep it buffered and retry without cursor jumps.
          setTimeout(() => dispatch('recoverStream').catch(() => {}), 250);
        }
      }
    });

    return recoveryPromise;
  },

  handleStreamEvent({ dispatch }, event) {
    const eventId = normalizeCursor(event?.id);
    if (!eventId || eventId === '0') {
      return dispatch('handleRealtimeEvent', {
        type: event?.type,
        data: event?.data || {},
        id: '0',
      });
    }

    // Map-by-id dedupes duplicate Echo deliveries while recovery serializes all
    // durable application through /sync in database order.
    bufferedDurableEvents.set(eventId, { ...event, id: eventId });
    return dispatch('recoverStream');
  },

  handleRealtimeEvent({ commit, state: st, dispatch, rootState }, { type, data }) {
    const meId = authUserId(rootState);
    switch (type) {
      case 'e2e.package': {
        const pkgCid = data?.conversation_id || null;
        // Consume only — do not redistribute in response (that caused a
        // distribute ↔ e2e.package feedback loop that blocked the HTTP pool).
        pullConversationKeySources(pkgCid)
          .then(async () => {
            const active = st.activeConversationId;
            if (active && (!pkgCid || String(active) === String(pkgCid))) {
              await dispatch('refreshE2eMessages', active);
              scheduleLockedRefresh(dispatch, active, [500, 2000, 5000]);
            }
            // Unlock sidebar previews for this conversation even when not open.
            if (pkgCid) {
              await dispatch('refreshConversationPreview', pkgCid);
              scheduleLockedRefresh(dispatch, pkgCid, [800, 2500]);
            } else {
              await dispatch('refreshLockedSidebarPreviews');
            }
          })
          .catch(() => {});
        break;
      }
      case 'e2e.device_added': {
        // Sibling: transfer User Identity + redistribute conversation keys.
        // Peer: proactively redistribute shared chats so the new device can
        // decrypt history without waiting for the next outgoing message.
        Promise.resolve((async () => {
          const newDid = data?.device_id || data?.deviceId || null;
          const ownerId = data?.user_id ?? data?.userId ?? null;
          const myDid = await getMyDeviceId().catch(() => null);
          if (newDid && myDid && String(newDid) === String(myDid)) return;

          const isPeer = data?.peer === true
            || (meId != null && ownerId != null && Number(ownerId) !== Number(meId));

          if (isPeer) {
            invalidateConversationCryptoCache();
            console.info('[e2e] peer device_added — redistributing shared keys', {
              ownerId,
              newDid,
            });
            // Proactive redistribute for chats shared with that user.
            await dispatch('redistributeE2eKeysForKnownConversations', {
              force: true,
              onlyUserId: ownerId,
            }).catch((e) => {
              console.warn('[e2e] peer redistribute failed', e?.message || e);
            });
            const active = st.activeConversationId;
            if (active && active !== 'draft') {
              prewarmConversationCrypto(active).catch(() => {});
            }
            return;
          }

          // Sibling device: first share account User Identity, then conversation keys.
          invalidateConversationCryptoCache();
          clearForceRedistributeGuard();
          await transferUserIdentityToSiblings({ targetDeviceId: newDid }).catch(() => {});
          await dispatch('redistributeE2eKeysForKnownConversations', { force: true });
          uploadAllLocalKeysToVault().catch(() => {});
          setTimeout(() => {
            clearForceRedistributeGuard();
            transferUserIdentityToSiblings({ targetDeviceId: newDid }).catch(() => {});
            dispatch('redistributeE2eKeysForKnownConversations', { force: true }).catch(() => {});
          }, 2500);
        })()).catch(() => {});
        break;
      }
      case 'e2e.vault': {
        // Sibling uploaded identity-wrapped keys — recover immediately.
        pullConversationKeySources(null)
          .then(async (n) => {
            if (n) console.info('[e2e] vault/package event recovered keys', { n });
            if (n > 0) {
              await dispatch('healNewDeviceE2e', { force: true }).catch(() => {});
            }
            await dispatch('unlockAllE2eHistory').catch(() => {});
          })
          .catch((e) => console.warn('[e2e] vault event handler failed', e?.message || e));
        break;
      }
      case 'e2e.identity_package': {
        pullAndConsumeIdentityPackages()
          .then(async () => {
            // Identity may already be local; still try vault + packages.
            await pullConversationKeySources(null).catch(() => {});
            await dispatch('healNewDeviceE2e', { force: true }).catch(() => {});
            await dispatch('unlockAllE2eHistory').catch(() => {});
          })
          .catch(() => {});
        break;
      }
      case 'e2e.identity_request': {
        Promise.resolve((async () => {
          const reqDid = data?.device_id || data?.deviceId || null;
          const myDid = await getMyDeviceId().catch(() => null);
          if (reqDid && myDid && String(reqDid) === String(myDid)) return;
          await transferUserIdentityToSiblings({ targetDeviceId: reqDid }).catch(() => {});
        })()).catch(() => {});
        break;
      }
      case 'e2e.key_rotate': {
        const rotCid = data?.conversation_id || null;
        if (!rotCid) break;
        Promise.resolve((async () => {
          const initiator = data?.initiator_user_id ?? data?.initiatorUserId ?? null;
          const iAmInitiator = initiator != null && meId != null
            && Number(initiator) === Number(meId);
          try {
            if (iAmInitiator) {
              // Only one of the initiator's devices mints (lexicographically first
              // device_id) so siblings don't create conflicting kids.
              const myDid = await getMyDeviceId().catch(() => null);
              const { listCryptoDevices } = await import('@/services/messenger');
              const listRes = await listCryptoDevices().catch(() => null);
              const ids = (listRes?.devices || [])
                .map((d) => d.device_id)
                .filter(Boolean)
                .sort();
              const primary = ids[0] || myDid;
              if (myDid && primary && String(myDid) === String(primary)) {
                await rotateConversationKey(rotCid, {
                  reason: data?.reason || 'membership',
                });
              } else {
                await new Promise((r) => setTimeout(r, 800));
                await pullAndConsumePackages(rotCid, { bypassCooldown: true });
              }
            } else {
              invalidateConversationCryptoCache(rotCid);
              await new Promise((r) => setTimeout(r, 500));
              await pullAndConsumePackages(rotCid, { bypassCooldown: true });
              requestKeyIfNeeded(rotCid, { force: true });
            }
          } catch (e) {
            console.warn('[e2e] membership key rotate failed', e);
          }
        })()).catch(() => {});
        break;
      }
      case 'e2e.key_request': {
        const reqCid = data?.conversation_id || null;
        if (!reqCid) break;
        Promise.resolve((async () => {
          clearForceRedistributeGuard(reqCid);
          const ok = await forceRedistributeConversationKey(reqCid).catch(() => false);
          if (ok) {
            await dispatch('refreshE2eMessages', reqCid).catch(() => {});
          }
        })()).catch(() => {});
        break;
      }
      case 'message.new': {
        const raw = data.message;
        if (!raw) break;
        // Decrypt async then commit — fire and apply.
        Promise.resolve((async () => {
          let msg = await maybeDecryptMessage(raw);
          // Recipient often gets the live event before key packages settle.
          // Retry once: pull packages + re-ingest wraps from the envelope.
          if (
            msg?.is_encrypted
            && !msg._e2e_decrypted
            && (msg._e2e_locked || msg._decryptFailed || isEncryptedDisplayBody(msg))
          ) {
            const lockedCid = msg.conversation_id || raw.conversation_id;
            requestKeyIfNeeded(lockedCid, { force: true });
            await pullConversationKeySources(lockedCid).catch(() => {});
            msg = await decryptIncomingMessage({
              ...raw,
              body: msg._e2e_ciphertext || raw.body,
              e2e: raw.e2e || msg.e2e,
              _e2e_decrypted: false,
              _e2e_locked: false,
              _decryptFailed: false,
            });
          }
          return msg;
        })()).then((msg) => {
          const cid = msg.conversation_id;
          const isMine = meId != null && Number(msg.user_id) === Number(meId);
          const remembered = takeRememberedE2ePlaintext(msg.client_id);
          let finalMsg = msg;
          // Own echo: never paint ciphertext/locked when we still know the plaintext.
          if (isMine && msg.is_encrypted && remembered && (remembered.body != null || remembered._mediaKey)) {
            finalMsg = {
              ...msg,
              body: remembered.body != null ? remembered.body : (msg.body || ''),
              _e2e_decrypted: true,
              _e2e_locked: false,
              _decryptFailed: false,
              _e2e_ciphertext: msg._e2e_ciphertext
                || (isEncryptedDisplayBody(msg) ? msg.body : null)
                || null,
              _mediaKey: msg._mediaKey || remembered._mediaKey,
              _mediaIv: msg._mediaIv || remembered._mediaIv,
            };
          } else if (msg._e2e_decrypted && (msg._mediaKey || (msg.body != null && !isLockedE2eBody(msg.body)))) {
            rememberE2ePlaintext(msg.client_id, msg.body || '', {
              _mediaKey: msg._mediaKey,
              _mediaIv: msg._mediaIv,
            });
          }
          commit('APPEND_MESSAGE', { conversationId: cid, message: finalMsg });
          if (finalMsg.user_id != null) {
            commit('CLEAR_TYPING_USER', { conversationId: cid, userId: finalMsg.user_id });
          }
          if (finalMsg.client_id) {
            outboxRemove(finalMsg.client_id).catch(() => {});
          }

          const exists = st.conversations.some((c) => Number(c.id) === Number(cid));
          if (!exists) {
            dispatch('ingestNewConversation', cid);
          } else {
            commit('UPDATE_CONVERSATION_PREVIEW', { conversationId: cid, message: finalMsg });
            if (!isMine && Number(cid) !== Number(st.activeConversationId)) {
              commit('INCREMENT_UNREAD', { conversationId: cid, messageId: finalMsg.id });
            }
          }

          if (!isMine && finalMsg.id) {
            markDelivered(cid, [finalMsg.id]).catch(() => {});
          }

          if (!isMine && Number(cid) === Number(st.activeConversationId)) {
            markRead(cid).catch(() => {});
            commit('RESET_CONVERSATION_UNREAD', cid);
          }

          const tabHidden = typeof document !== 'undefined' && document.hidden;
          const activeCid = st.activeConversationId;
          const sameChat = activeCid != null && Number(cid) === Number(activeCid);
          const muted = !!(st.conversations.find((c) => Number(c.id) === Number(cid))?.pivot?.muted_at);
          if (!isMine && !muted && (!sameChat || tabHidden)) {
            dispatch('pushMessageNotification', { msg: finalMsg, cid });
          }

          // Still locked after retry — keep trying when packages arrive.
          if (
            !isMine
            && finalMsg.is_encrypted
            && (finalMsg._e2e_locked || finalMsg._decryptFailed || isEncryptedDisplayBody(finalMsg))
          ) {
            requestKeyIfNeeded(cid);
            dispatch('refreshE2eMessages', cid).catch(() => {});
            dispatch('refreshConversationPreview', cid).catch(() => {});
          }
        }).catch(() => {
          commit('APPEND_MESSAGE', { conversationId: raw.conversation_id, message: raw });
        });
        break;
      }
      case 'message.updated': {
        const raw = data.message;
        if (raw) {
          Promise.resolve(maybeDecryptMessage(raw)).then((msg) => {
            commit('UPDATE_MESSAGE', { conversationId: msg.conversation_id, message: msg });
            commit('SYNC_CONVERSATION_PREVIEW', msg.conversation_id);
          });
        }
        break;
      }
      case 'message.deleted': {
        commit('REMOVE_MESSAGE', {
          conversationId: data.conversation_id,
          messageId: data.message_id,
        });
        commit('REMOVE_PINNED', {
          conversationId: data.conversation_id,
          messageId: data.message_id,
        });
        commit('SYNC_CONVERSATION_PREVIEW', data.conversation_id);
        break;
      }
      case 'message.pinned': {
        const raw = data.message;
        if (raw) {
          Promise.resolve(maybeDecryptMessage(raw)).then((msg) => {
            const cid = data.conversation_id || msg.conversation_id;
            const local = (st.messages[cid] || []).find((m) => Number(m.id) === Number(msg.id));
            let finalMsg = msg;
            if (local && local._e2e_decrypted && !local._e2e_locked) {
              finalMsg = {
                ...msg,
                ...mergeE2eDisplayFields(msg, local),
                body: local.body,
                _e2e_decrypted: true,
                _e2e_locked: false,
                _decryptFailed: false,
                _mediaKey: local._mediaKey || msg._mediaKey,
                _mediaIv: local._mediaIv || msg._mediaIv,
              };
            }
            commit('ADD_PINNED', { conversationId: cid, message: finalMsg });
          });
        }
        break;
      }
      case 'message.unpinned': {
        commit('REMOVE_PINNED', {
          conversationId: data.conversation_id,
          messageId: data.message_id,
        });
        break;
      }
      case 'messages.unpinned_all': {
        commit('CLEAR_PINNED', data.conversation_id);
        break;
      }
      case 'messages.read': {
        const readerId = data.reader_id ?? data.readerId;
        if (meId != null && readerId != null && Number(readerId) === Number(meId)) {
          // Another of my devices read this chat → clear my unread badge here.
          commit('RESET_CONVERSATION_UNREAD', data.conversation_id);
        } else {
          // The partner read my messages → show read ticks (all my devices).
          commit('MARK_CONVERSATION_READ', {
            conversationId: data.conversation_id,
            myUserId: meId,
            readerId,
            messageIds: data.message_ids || data.messageIds || null,
            readAt: data.read_at || data.readAt || null,
          });
        }
        break;
      }
      case 'message.delivered': {
        if (data.conversation_id && data.message_ids?.length) {
          commit('MARK_MESSAGES_DELIVERED', {
            conversationId: data.conversation_id,
            messageIds: data.message_ids,
            deliveredAt: data.delivered_at,
          });
        }
        break;
      }
      case 'conversation.cleared': {
        const byMe = meId && data.cleared_by === meId;
        commit('SET_CONVERSATION_CLEARED', {
          conversationId: data.conversation_id,
          byMe,
          actorName: byMe ? '' : (data.cleared_by_name || ''),
        });
        commit('MARK_CONVERSATION_LOADED', data.conversation_id);
        commit('SYNC_CONVERSATION_PREVIEW', data.conversation_id);
        break;
      }
      case 'conversation.deleted': {
        commit('REMOVE_CONVERSATION', data.conversation_id);
        if (data.conversation_id === st.activeConversationId) {
          commit('SET_ACTIVE_CONVERSATION', null);
        }
        break;
      }
      case 'conversation.muted': {
        commit('SET_CONVERSATION_MUTE', { conversationId: data.conversation_id, mute: data.muted });
        break;
      }
      case 'conversation.updated': {
        if (data.conversation) {
          // Ignore membership broadcasts for chats we're only previewing.
          if (data.conversation.is_preview) break;
          if (st.overlayConversation?.is_preview
            && Number(st.overlayConversation.id) === Number(data.conversation.id)) {
            break;
          }
          commit('UPSERT_CONVERSATION', data.conversation);
        }
        break;
      }
      case 'conversation.wallpaper': {
        const cid = data.conversation_id;
        if (!cid) break;
        const forBoth = !!data.for_both;
        const mine = meId != null && Number(data.user_id) === Number(meId);
        // Peers only apply when shared for both; actor's other devices always sync.
        if (forBoth || mine) {
          commit('SET_CONVERSATION_WALLPAPER', {
            conversationId: cid,
            config: data.config || null,
          });
        }
        break;
      }
      case 'message.reaction': {
        if (data.message_id && data.reactions) {
          commit('SET_MESSAGE_REACTIONS', {
            conversationId: data.conversation_id,
            messageId: data.message_id,
            reactions: data.reactions,
          });
        }
        break;
      }
      case 'member.joined':
      case 'member.left':
      case 'member.banned':
      case 'member.unbanned':
      case 'member.muted':
      case 'member.unmuted':
      case 'member.role_changed': {
        // Refresh conversation meta when membership changes.
        // Skip while only previewing (not a member yet).
        if (data.conversation_id) {
          if (st.overlayConversation?.is_preview
            && Number(st.overlayConversation.id) === Number(data.conversation_id)) {
            break;
          }
          dispatch('ingestNewConversation', data.conversation_id).catch(() => {});
          // Forward-secrecy-lite: rotate conversation key when membership changes
          // so leavers / new joiners don't share the previous secret forever.
          if (
            (type === 'member.joined' || type === 'member.left' || type === 'member.banned')
            && conversationRequiresE2e(st, data.conversation_id)
          ) {
            rotateConversationKey(data.conversation_id, { reason: type }).catch((err) => {
              console.warn('[e2e] rotate on membership failed', err);
            });
          }
        }
        break;
      }
      case 'presence': {
        if (data.user_id) {
          commit('APPLY_PRESENCE', {
            userId: data.user_id,
            isOnline: !!data.is_online,
            lastSeen: data.last_seen,
            profilePic: data.profile_pic,
            firstName: data.first_name,
            lastName: data.last_name,
            username: data.username,
          });
        }
        break;
      }
      case 'user.updated': {
        if (data.user_id || data.id) {
          commit('APPLY_PRESENCE', {
            userId: data.user_id || data.id,
            isOnline: data.is_online,
            lastSeen: data.last_seen,
            profilePic: data.profile_pic,
            firstName: data.first_name,
            lastName: data.last_name,
            username: data.username,
          });
          // Own profile change on another device → keep auth userInfo in sync.
          if (meId != null && Number(data.user_id || data.id) === Number(meId)) {
            const info = rootState.auth?.status?.userInfo;
            const target = info?.value && typeof info.value === 'object' ? info.value : info;
            if (target && typeof target === 'object') {
              if (data.profile_pic !== undefined) target.profile_pic = data.profile_pic;
              if (data.first_name !== undefined) target.first_name = data.first_name;
              if (data.last_name !== undefined) target.last_name = data.last_name;
              if (data.username !== undefined) target.username = data.username;
            }
          }
        }
        break;
      }
      case 'typing': {
        const conversationId = data.conversation_id;
        const userId = data.user_id ?? data.user?.id;
        if (!conversationId || userId == null) break;
        const name = data.user?.first_name || data.user?.username || '';
        const activity = data.activity || 'typing';
        commit('SET_TYPING', {
          conversationId,
          user: { id: userId, name, activity },
        });
        scheduleTypingClear(commit, conversationId, userId, typingClearMs(activity));
        break;
      }
      default:
        break;
    }
  },

  startStream({ commit, dispatch, state: st, rootState }) {
    const userId = authUserId(rootState);
    if (!userId) return Promise.resolve();
    if (!isMessengerRoute()) return Promise.resolve();

    const channelName = `messenger.${userId}`;
    syncConnectionManagerToStore(commit, dispatch);
    startE2eDeviceSync(dispatch);
    startRecoverPoll(dispatch);

    const ensurePresenceHeartbeat = () => {
      // Presence heartbeat: announce online now and keep last_seen fresh. Skip the
      // ping while the tab is hidden so a backgrounded tab stops counting as
      // online (the backend window is ~70s, so it lapses shortly after).
      if (!isMessengerRoute()) return;
      if (st.presenceTimer) return;
      pingPresence().catch(() => {});
      const timer = setInterval(() => {
        if (!isMessengerRoute()) return;
        if (typeof document !== 'undefined' && document.hidden) return;
        pingPresence().catch(() => {});
      }, 30000);
      commit('SET_PRESENCE_TIMER', timer);
    };

    const attachChannel = (echo) => {
      // Leave a previous channel if the user changed
      if (st.streamChannel && st.streamChannel !== channelName) {
        try { echo.leave(st.streamChannel); } catch (e) { /* noop */ }
      }

      if (st.streamChannel === channelName) {
        // Already subscribed — revive socket + sync only.
        connectionManager.bindPusher(getPusher());
        ensurePresenceHeartbeat();
        scheduleRecoverStream(dispatch);
        return;
      }

      const channel = echo.private(channelName);
      channel.listen('.MessengerEvent', (e) => {
        dispatch('handleStreamEvent', e);
      });
      channel.subscribed(() => {
        commit('SET_CONNECTION_STATE', 'connected');
        commit('SET_CONNECTION_GRACE', false);
        scheduleRecoverStream(dispatch);
      });

      // Conversation whisper handlers (WS peer relay — no PHP hop).
      setConversationRealtimeHandlers({
        message: (cid, payload) => {
          const msg = payload?.message || payload;
          if (!msg) return;
          const me = authUserId(rootState);
          if (me != null && Number(msg.user_id) === Number(me)) return;
          dispatch('handleRealtimeEvent', {
            type: 'message.new',
            data: {
              message: {
                ...msg,
                conversation_id: msg.conversation_id || cid,
              },
            },
            id: 0,
          });
        },
        typing: (cid, payload) => {
          const uid = payload?.user_id ?? payload?.user?.id;
          const me = authUserId(rootState);
          if (uid == null || (me != null && Number(uid) === Number(me))) return;
          const activity = payload.activity || 'typing';
          commit('SET_TYPING', {
            conversationId: cid,
            user: {
              id: uid,
              name: payload.user?.first_name
                || payload.user?.username
                || payload.name
                || '',
              activity,
              ...(payload.user || {}),
            },
          });
          scheduleTypingClear(commit, cid, uid, typingClearMs(activity));
        },
      });

      // Only the active chat needs conversation.* for whisper. Subscribing to
      // dozens of channels caused /broadcasting/auth storms on every boot.
      const warmIds = [];
      if (st.activeConversationId && !isDraftConversationId(st.activeConversationId)) {
        warmIds.push(st.activeConversationId);
      }
      warmConversationChannels(warmIds);

      commit('SET_STREAM_CHANNEL', channelName);
      ensurePresenceHeartbeat();
      scheduleRecoverStream(dispatch);
    };

    const run = async () => {
      commit('SET_CONNECTION_GRACE', true);
      if (!connectionManager.isOnline) {
        commit('SET_NETWORK_ONLINE', false);
        commit('SET_CONNECTION_STATE', 'unavailable');
        commit('SET_CONNECTION_DISPLAY', 'offline');
      } else {
        commit('SET_NETWORK_ONLINE', true);
        commit('SET_CONNECTION_STATE', 'connecting');
        commit(
          'SET_CONNECTION_DISPLAY',
          connectionManager.everConnected ? 'reconnecting' : 'connecting',
        );
      }

      let echo = await connectionManager.ensureConnected();
      if (!echo) {
        // Token may not be restored yet — retry once after a tick.
        await new Promise((r) => setTimeout(r, 50));
        if (!isMessengerRoute()) return;
        echo = (await connectionManager.ensureConnected())
          || (await initEcho())
          || (await refreshEchoAuth());
      }
      if (!isMessengerRoute()) return;
      if (!echo) {
        // Stay connecting while online; unavailable only when offline.
        if (!connectionManager.isOnline) {
          commit('SET_CONNECTION_STATE', 'unavailable');
          commit('SET_CONNECTION_DISPLAY', 'offline');
        } else {
          commit('SET_CONNECTION_STATE', 'connecting');
          commit('SET_CONNECTION_DISPLAY', connectionManager.displayStatus);
          connectionManager.scheduleReconnect();
        }
        return;
      }

      connectionManager.bindPusher(getPusher());
      commit('SET_CONNECTION_DISPLAY', connectionManager.displayStatus);

      // When socket comes up, recover durable events + presence once (debounced).
      const pusher = getPusher();
      if (pusher && !pusher.__messengerRecoverBound) {
        pusher.__messengerRecoverBound = true;
        pusher.connection.bind('state_change', ({ current }) => {
          if (current === 'connected') {
            if (!isMessengerRoute()) return;
            pingPresence().catch(() => {});
            scheduleRecoverStream(dispatch);
            dispatch('hydrateAndFlushOutbox').catch(() => {});
          }
        });
      }

      attachChannel(echo);
    };

    // Already subscribed for this user: revive via connection manager.
    if (st.streamChannel === channelName) {
      if (!getEcho()) {
        // Echo torn down out of band — clear and resubscribe below.
        commit('SET_STREAM_CHANNEL', null);
      } else {
        const live = getPusher()?.connection?.state;
        if (live !== 'connected' && connectionManager.isConnectingStuck()) {
          connectionManager.rebuildTransport();
          return Promise.resolve();
        }
        connectionManager.ensureConnected().then(() => {
          connectionManager.bindPusher(getPusher());
          const nowLive = getPusher()?.connection?.state;
          if (nowLive === 'connected') {
            commit('SET_CONNECTION_STATE', 'connected');
            commit('SET_CONNECTION_GRACE', false);
          } else if (connectionManager.isOnline) {
            commit('SET_CONNECTION_STATE', 'connecting');
            commit('SET_CONNECTION_GRACE', true);
          } else {
            commit('SET_CONNECTION_STATE', 'unavailable');
          }
          ensurePresenceHeartbeat();
          scheduleRecoverStream(dispatch);
        }).catch(() => {});
        return Promise.resolve();
      }
    }

    if (streamBootstrapPromise) {
      // Another caller is mid-subscribe — still nudge the socket alive.
      connectionManager.ensureConnected().catch(() => {});
      return streamBootstrapPromise;
    }

    streamBootstrapPromise = run()
      .catch(() => {})
      .finally(() => {
        streamBootstrapPromise = null;
      });
    return streamBootstrapPromise;
  },

  stopStream({ commit, state: st }) {
    if (st.presenceTimer) {
      clearInterval(st.presenceTimer);
      commit('SET_PRESENCE_TIMER', null);
      presenceOfflineBeacon();
    }
    leaveAllConversationChannels();
    if (st.streamChannel) {
      const echo = getEcho();
      if (echo) {
        try { echo.leave(st.streamChannel); } catch (e) { /* noop */ }
      }
    }
    if (connectionManagerUnsub) {
      try { connectionManagerUnsub(); } catch (e) { /* noop */ }
      connectionManagerUnsub = null;
    }
    if (connectionRebuildUnsub) {
      try { connectionRebuildUnsub(); } catch (e) { /* noop */ }
      connectionRebuildUnsub = null;
    }
    stopE2eUnlockPoller();
    stopE2eDeviceSync();
    stopRecoverPoll();
    connectionManager.stop({ teardown: true });
    streamBootstrapPromise = null;
    if (recoverDebounceTimer) {
      clearTimeout(recoverDebounceTimer);
      recoverDebounceTimer = null;
    }
    if (outboxRetryTimer) {
      clearTimeout(outboxRetryTimer);
      outboxRetryTimer = null;
    }
    commit('SET_STREAM_CHANNEL', null);
    // Do not paint "Waiting for network" on intentional teardown (logout / leave).
    commit('SET_CONNECTION_STATE', 'connecting');
    commit('SET_CONNECTION_GRACE', true);
  },

  // Tab focus/visibility changed: ping immediately when the user comes back so
  // they flip online instantly; announce offline when the tab goes hidden so
  // they don't linger as "online" while away.
  presenceVisibility(_, hidden) {
    if (!isMessengerRoute()) return;
    if (hidden) {
      presenceOfflineBeacon();
    } else {
      pingPresence().catch(() => {});
    }
  },

  sendTypingAction({ rootState }, payload) {
    let id;
    let activity = 'typing';
    if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
      id = payload.conversationId;
      activity = payload.activity || 'typing';
    } else {
      id = payload;
    }
    if (!id || id === 'draft' || isDraftConversationId(id)) return;
    const meId = authUserId(rootState);
    const me = rootState.auth?.user || {};
    // Prefer WebSocket whisper (no HTTP). Fall back to HTTP for cold sockets.
    const whispered = whisperTyping(id, {
      user_id: meId,
      activity,
      user: {
        id: meId,
        first_name: me.first_name,
        last_name: me.last_name,
        username: me.username,
      },
    });
    if (!whispered) {
      sendTyping(id, activity).catch(() => {});
    }
  },

  setDraftText({ commit }, { conversationId, text }) {
    if (conversationId == null || conversationId === 'draft') return;
    commit('SET_DRAFT_TEXT', { conversationId, text });
  },

  clearDraftText({ commit }, conversationId) {
    if (conversationId == null || conversationId === 'draft') return;
    commit('CLEAR_DRAFT_TEXT', conversationId);
  },

  // Browser / OS notifications disabled — unreliable and unwanted.
  pushMessageNotification() {
    /* intentionally no-op */
  },

};

const getters = {
  /** Effective wallpaper for the active chat (per-chat override → global). */
  effectiveWallpaper: (state) => {
    const cid = state.activeConversationId;
    if (cid != null && cid !== 'draft') {
      const key = String(cid);
      if (Object.prototype.hasOwnProperty.call(state.conversationWallpapers, key)) {
        const override = state.conversationWallpapers[key];
        if (override) return override;
      }
    }
    return state.wallpaper;
  },
  activeConversation: (state) => {
    if (state.draftConversation && state.activeConversationId === state.draftConversation.id) {
      return state.draftConversation;
    }
    if (state.overlayConversation
      && Number(state.activeConversationId) === Number(state.overlayConversation.id)) {
      return state.overlayConversation;
    }
    return state.conversations.find((c) => Number(c.id) === Number(state.activeConversationId)) || null;
  },
  activeMessages: (state) => {
    // Draft chats keep a local message list so first sends paint instantly.
    if (state.draftConversation && state.activeConversationId === state.draftConversation.id) {
      return state.messages.draft || state.messages[state.activeConversationId] || [];
    }
    const aid = state.activeConversationId;
    if (aid == null) return [];
    if (state.messages[aid]) return state.messages[aid];
    const key = Object.keys(state.messages || {}).find((k) => Number(k) === Number(aid));
    return key != null ? state.messages[key] : [];
  },
  /** Conversations visible in the sidebar (no drafts/previews/empty privates). */
  sidebarConversations: (state) => {
    const list = (state.conversations || []).filter((c) => {
      if (!c || c.id === 'draft') return false;
      if (c.is_preview) return false;
      if (c.type === 'private' && !c.last_message && !c.last_message_at) return false;
      return true;
    });
    // Always newest-activity first so last message / sort stay live.
    return list.slice().sort((a, b) => {
      const ta = Date.parse(a.last_message_at || a.last_message?.created_at || '') || 0;
      const tb = Date.parse(b.last_message_at || b.last_message?.created_at || '') || 0;
      if (tb !== ta) return tb - ta;
      return Number(b.id || 0) - Number(a.id || 0);
    });
  },
  activePinnedMessages: (state) => state.pinnedMessages[state.activeConversationId] || [],
  unreadCount: (state) => state.unreadCount,
  typingInActive: (state, _getters, rootState) => {
    const map = state.typingUsers[state.activeConversationId];
    if (!map) return [];
    const meId = authUserId(rootState);
    return Object.values(map).filter((u) => meId == null || Number(u.id) !== Number(meId));
  },
  /** All conversations currently showing typists (excludes self). */
  typingByConversation: (state, _getters, rootState) => {
    const meId = authUserId(rootState);
    const out = {};
    Object.keys(state.typingUsers).forEach((cid) => {
      const map = state.typingUsers[cid];
      if (!map) return;
      const list = Object.values(map).filter((u) => meId == null || Number(u.id) !== Number(meId));
      if (list.length) out[cid] = list;
    });
    return out;
  },
  selectedCount: (state) => state.selectedIds.length,
  selectedMessages: (state) => {
    const msgs = state.messages[state.activeConversationId] || [];
    const selected = new Set((state.selectedIds || []).map((id) => Number(id)));
    return msgs.filter((m) => selected.has(Number(m.id)));
  },
  // True only when every selected message belongs to the current user, so the
  // "delete" action may be offered in the selection toolbar.
  selectionAllMine: (state, getters, rootState) => {
    const meId = authUserId(rootState);
    const selected = getters.selectedMessages;
    return selected.length > 0 && selected.every((m) => Number(m.user_id) === Number(meId));
  },
  draftForConversation: (state) => (conversationId) => {
    if (conversationId == null || conversationId === 'draft') return '';
    const entry = state.drafts[String(conversationId)];
    return typeof entry?.text === 'string' ? entry.text : getDraft(conversationId);
  },
  hasDraft: (state, getters) => (conversationId) => !!getters.draftForConversation(conversationId)?.trim(),
  /** Map of contact_user_id → custom contact name (trimmed, non-empty only). */
  contactNameByUserId: (state) => {
    const map = Object.create(null);
    (state.contacts || []).forEach((ct) => {
      const uid = ct?.contact_user?.id;
      if (uid == null) return;
      const name = typeof ct.name === 'string' ? ct.name.trim() : '';
      if (name) map[Number(uid)] = name;
    });
    return map;
  },
  systemConfig: (state) => state.systemConfig,
  messengerFeatures: (state) => state.systemConfig?.features || {
    private_chats: true,
    groups: true,
    channels: true,
    saved_messages: true,
    forward: true,
    reactions: true,
    edit_messages: true,
    delete_messages: true,
    pin_messages: true,
    voice_messages: true,
    location: true,
    contacts: true,
    user_search: true,
    wallpapers: true,
    custom_wallpapers: true,
  },
  messengerUploads: (state) => state.systemConfig?.uploads || {
    enabled: true,
    allow_photo: true,
    allow_video: true,
    allow_audio: true,
    allow_voice: true,
    allow_file: true,
    max_album_items: 10,
  },
  messengerLimits: (state) => state.systemConfig?.limits || {
    max_message_length: 5000,
    max_group_members: 200,
    max_channel_subscribers: 0,
    edit_window_minutes: 0,
    messages_per_page: 50,
  },
  messengerQuota: (state) => state.systemConfig?.quota || null,
  canMessengerFeature: (state, getters) => (key) => {
    const features = getters.messengerFeatures;
    return features?.[key] !== false;
  },
  canMessengerUpload: (state, getters) => (type) => {
    const uploads = getters.messengerUploads;
    if (uploads?.enabled === false) return false;
    if (!type) return uploads?.enabled !== false;
    const map = {
      photo: 'allow_photo',
      video: 'allow_video',
      audio: 'allow_audio',
      voice: 'allow_voice',
      file: 'allow_file',
      camera: 'allow_photo',
    };
    const flag = map[type];
    if (!flag) return true;
    return uploads?.[flag] !== false;
  },
};

export const messenger = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
