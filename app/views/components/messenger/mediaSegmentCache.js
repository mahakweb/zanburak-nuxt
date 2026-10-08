/**
 * Cache API + IndexedDB helpers for messenger media segments.
 * Used by progressive / HLS downloads so replay is instant from cache.
 */

const CACHE_NAME = 'zanburak-messenger-media-v1';
const SEGMENT_PREFIX = 'zb-media-seg:';

function cacheAvailable() {
  return typeof caches !== 'undefined';
}

async function openCache() {
  if (!cacheAvailable()) return null;
  try {
    return await caches.open(CACHE_NAME);
  } catch (e) {
    return null;
  }
}

function segmentKey(url, start, end) {
  return `${SEGMENT_PREFIX}${url}#${start}-${end}`;
}

/** Store a byte-range response for later Range / MSE reuse. */
export async function putMediaSegment(url, start, end, buffer, mime = 'application/octet-stream') {
  if (!url || buffer == null) return false;
  const cache = await openCache();
  if (!cache) return false;
  try {
    const body = buffer instanceof ArrayBuffer ? buffer : buffer.buffer || buffer;
    const res = new Response(body, {
      status: 206,
      headers: {
        'Content-Type': mime,
        'Content-Range': `bytes ${start}-${end}/${end + 1}`,
        'Content-Length': String((end - start) + 1),
        'X-Zanburak-Media-Url': String(url),
      },
    });
    await cache.put(segmentKey(url, start, end), res);
    return true;
  } catch (e) {
    return false;
  }
}

export async function getMediaSegment(url, start, end) {
  if (!url) return null;
  const cache = await openCache();
  if (!cache) return null;
  try {
    const hit = await cache.match(segmentKey(url, start, end));
    if (!hit) return null;
    return hit.arrayBuffer();
  } catch (e) {
    return null;
  }
}

/** Cache a complete media Response / Blob under the media URL. */
export async function putMediaResponse(url, blobOrResponse) {
  if (!url || !blobOrResponse) return false;
  const cache = await openCache();
  if (!cache) return false;
  try {
    const res = blobOrResponse instanceof Response
      ? blobOrResponse.clone()
      : new Response(blobOrResponse, {
        status: 200,
        headers: {
          'Content-Type': blobOrResponse.type || 'application/octet-stream',
          'Content-Length': String(blobOrResponse.size || 0),
        },
      });
    await cache.put(String(url), res);
    return true;
  } catch (e) {
    return false;
  }
}

export async function getMediaResponse(url) {
  if (!url) return null;
  const cache = await openCache();
  if (!cache) return null;
  try {
    return (await cache.match(String(url))) || null;
  } catch (e) {
    return null;
  }
}

export async function deleteMediaCache(url) {
  if (!url) return;
  const cache = await openCache();
  if (!cache) return;
  try {
    await cache.delete(String(url));
    const keys = await cache.keys();
    const prefix = `${SEGMENT_PREFIX}${url}#`;
    await Promise.all(
      keys
        .filter((req) => String(req.url || req).includes(prefix) || String(req.url).endsWith(String(url)))
        .map((req) => cache.delete(req)),
    );
  } catch (e) { /* noop */ }
}
