import axios from 'axios';

/** Keep each request under common proxy/PHP body limits (fixes HTTP 413 on large videos). */
export const VIDEO_UPLOAD_CHUNK_BYTES = 4 * 1024 * 1024;

/**
 * Upload a video file to the worker in small chunks, then finalize on the last chunk.
 * @returns {Promise<object>} final worker JSON (includes video_id on success)
 */
export async function uploadVideoInChunks({
    file,
    uploadPath,
    uploadToken,
    workerUploadUrl,
    onProgress,
    signal,
}) {
    if (!file || !uploadPath || !uploadToken || !workerUploadUrl) {
        throw new Error('Missing upload parameters');
    }

    const chunkUrl = String(workerUploadUrl).replace(/\/upload\/video\/?$/, '/upload/video/chunk');
    const totalChunks = Math.max(1, Math.ceil(file.size / VIDEO_UPLOAD_CHUNK_BYTES));
    let lastResponse = null;

    for (let index = 0; index < totalChunks; index += 1) {
        if (signal?.aborted) {
            const err = new Error('Upload aborted');
            err.name = 'AbortError';
            err.code = 'ERR_CANCELED';
            throw err;
        }

        const start = index * VIDEO_UPLOAD_CHUNK_BYTES;
        const end = Math.min(start + VIDEO_UPLOAD_CHUNK_BYTES, file.size);
        const blob = file.slice(start, end);

        const formData = new FormData();
        formData.append('path', uploadPath);
        formData.append('chunkIndex', String(index));
        formData.append('totalChunks', String(totalChunks));
        formData.append('file', blob, file.name || `chunk-${index}`);

        const res = await axios.post(chunkUrl, formData, {
            timeout: 3600 * 1000,
            headers: { Authorization: `Bearer ${uploadToken}` },
            signal,
            onUploadProgress: (evt) => {
                if (!onProgress || !evt.total) return;
                const chunkFraction = evt.loaded / evt.total;
                const overall = ((index + chunkFraction) / totalChunks) * 100;
                onProgress(Math.min(99, Math.round(overall)));
            },
        });

        lastResponse = res.data;
        if (typeof onProgress === 'function') {
            onProgress(Math.round(((index + 1) / totalChunks) * 100));
        }
    }

    return lastResponse || {};
}
