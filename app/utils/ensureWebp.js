import axiosInstance from '@/store/axiosInstance'

/**
 * After poster/cover upload to worker: if worker did not create WebP, ask main API.
 * Safe / best-effort — never throws to caller.
 *
 * @param {object|null} workerResData  response.data from worker attachment upload
 * @param {string} imageUrl            public URL of the uploaded jpg/png
 */
export async function ensureWebpAfterUpload(workerResData, imageUrl) {
  try {
    if (!imageUrl || typeof imageUrl !== 'string') return { ok: false, reason: 'no_url' }

    const isPosterOrCover =
      workerResData?.webp_type === 'poster' ||
      workerResData?.webp_type === 'cover' ||
      workerResData?.webp_needed === true

    // If worker didn't tag the type (old worker), still try for jpg/png URLs
    const looksRaster = /\.(jpe?g|png)(\?|$)/i.test(imageUrl)
    if (!isPosterOrCover && !looksRaster) {
      return { ok: true, skipped: true, reason: 'not_needed' }
    }

    if (workerResData?.webp_created === true) {
      return { ok: true, source: 'worker' }
    }

    // Worker missing / GD missing / old worker without flag → main API fallback
    const res = await axiosInstance.post('admin/media/ensure-webp', { url: imageUrl })
    return { ok: !!res.data?.ok, source: 'api', ...res.data }
  } catch (e) {
    console.warn('[ensureWebpAfterUpload]', e?.response?.data || e?.message || e)
    return { ok: false, reason: 'fallback_failed' }
  }
}
