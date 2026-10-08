/**
 * Shared helpers for messenger media compose → send payload shaping.
 * Keeps ChatArea / composer aligned on album meta + captions.
 */

import { newMediaClientId } from './mediaHelpers';

/**
 * Normalize a composer item into the ChatArea → send-media emit shape.
 */
export function toChatSendMediaPayload(item, {
  albumId = null,
  albumIndex = null,
  albumCount = null,
} = {}) {
  return {
    file: item.file,
    type: item.type,
    caption: item.caption || '',
    duration: item.duration,
    width: item.width,
    height: item.height,
    localUrl: item.previewUrl || null,
    coverFile: null,
    localCover: null,
    silent: !!item.silent,
    animation: !!item.animation,
    albumId,
    albumIndex,
    albumCount,
  };
}

/**
 * Expand a MediaComposerSheet send-batch result into ordered emit payloads.
 * Shared album caption stays on the first visual item (Telegram-style).
 * Visuals are emitted first (consecutive) so destination grouping never
 * splits the album when a file/document is in the same batch.
 */
export function expandMediaBatchForSend(batch) {
  const items = Array.isArray(batch?.items) ? batch.items : [];
  if (!items.length) return [];
  const visual = items.filter((it) => it.type === 'photo' || it.type === 'video');
  const other = items.filter((it) => it.type !== 'photo' && it.type !== 'video');
  const asAlbum = !!batch?.asAlbum && visual.length > 1;
  const albumId = asAlbum ? newMediaClientId('alb') : null;
  const sharedCaption = String(batch?.caption || '').trim();

  // Keep original relative order within each group; visuals before documents.
  const ordered = [...visual, ...other];
  let visualIdx = 0;

  return ordered.map((item) => {
    const isVisual = item.type === 'photo' || item.type === 'video';
    const useAlbum = asAlbum && isVisual;
    const payload = toChatSendMediaPayload(item, {
      albumId: useAlbum ? albumId : null,
      albumIndex: useAlbum ? visualIdx : null,
      albumCount: useAlbum ? visual.length : null,
    });
    if (useAlbum) {
      // Caption only on the lead tile — matches Telegram album caption.
      payload.caption = visualIdx === 0
        ? (item.caption || sharedCaption || '')
        : '';
    }
    if (isVisual) visualIdx += 1;
    return payload;
  });
}

/** Lead type for upload activity pulse (file > video > first). */
export function batchLeadType(items) {
  const list = Array.isArray(items) ? items : [];
  if (list.some((it) => it.type === 'file')) return 'file';
  if (list.some((it) => it.type === 'video')) return 'video';
  return list[0]?.type || 'photo';
}
