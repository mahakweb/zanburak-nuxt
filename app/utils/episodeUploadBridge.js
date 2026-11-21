let pendingVideo = null;
let pendingVideoPreview = null;
let pendingVideoOptions = null;

export function setPendingEpisodeVideo(file, preview, options = null) {
    pendingVideo = file;
    pendingVideoPreview = preview ? { ...preview } : null;
    pendingVideoOptions = options ? { ...options } : null;
}

export function consumePendingEpisodeVideo() {
    const file = pendingVideo;
    const preview = pendingVideoPreview;
    const options = pendingVideoOptions;
    pendingVideo = null;
    pendingVideoPreview = null;
    pendingVideoOptions = null;
    return file ? { file, preview, options } : null;
}

export function hasPendingEpisodeVideo() {
    return !!pendingVideo;
}
