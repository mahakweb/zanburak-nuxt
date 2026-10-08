/**
 * Public surface of the messenger E2E crypto client.
 * Vuex / services should import from here only.
 *
 * Architecture:
 *   User Identity Key (account, stable) → Device Keys (per browser)
 *   Auth tokens are orthogonal and never used as encryption identity.
 */
export {
  conversationNeedsE2e,
  encryptOutgoingMessage,
  encryptOutgoingMediaEnvelope,
  encryptTextMessage,
  encryptLocationMessage,
  encryptMediaMessage,
  decryptIncomingMessage,
  decryptMessages,
  decryptMessageList,
  encryptFile,
  decryptFile,
  E2E_VERSION,
  E2E_ALG,
  LOCKED_PLACEHOLDER,
  messageAadBytes,
  messageAadCandidates,
} from './e2e';

export {
  ensureDevice,
  refillPrekeysIfLow,
  getMyDeviceId,
  getMyIdentityPublicKeys,
  repairDeviceRegistration,
} from './device';

export {
  bootstrapCrypto,
  ensureUserIdentity,
  transferUserIdentityToSiblings,
  pullAndConsumeIdentityPackages,
  adoptUserIdentityFromSiblings,
  enableIdentityRecovery,
  restoreIdentityFromRecovery,
  getIdentityRecoveryStatus,
  isRecoverySetupDismissed,
  dismissRecoverySetupPrompt,
  clearRecoverySetupDismissed,
  isRecoveryRestoreDismissed,
  dismissRecoveryRestorePrompt,
  clearRecoveryRestoreDismissed,
  ensureSeamlessMultiDeviceBackup,
  trySeamlessIdentityRestore,
  resetUserIdentity,
  getMyUserIdentityPublicKeys,
  hasLocalUserIdentityPrivates,
  isUserIdentityPending,
  hasRecoveryHint,
} from './identity';

export {
  ensureConversationKey,
  pullAndConsumePackages,
  getConversationKeyBytes,
  forceRedistributeConversationKey,
  clearForceRedistributeGuard,
  prewarmConversationCrypto,
  rotateConversationKey,
  distributeConversationKeyToBundles,
  buildInlineKeyWraps,
  ingestInlineKeyWraps,
  invalidateConversationCryptoCache,
  syncKeysAfterLogin,
  pullAndConsumeKeyVault,
  pullConversationKeySources,
  uploadAllLocalKeysToVault,
} from './session';

export {
  reconcileConversationKeys,
  listConversationIdsWithLocalKeys,
} from './store';

export {
  fetchAuthenticatedMedia,
  fetchAuthenticatedBlob,
  mediaMessageUrl,
  isMessengerMediaProxyUrl,
} from './mediaAuth';

export {
  computeSafetyNumber,
  computeSafetyNumberForUser,
  getMySafetyNumberInputs,
  fingerprintHex,
  markSafetyNumberVerified,
} from './safety';

export {
  enableVault,
  unlockVault,
  lockVault,
  isVaultConfigured,
  isVaultLocked,
  assertVaultUnlocked,
} from './vault';

export { b64Encode, b64Decode } from './bytes';
