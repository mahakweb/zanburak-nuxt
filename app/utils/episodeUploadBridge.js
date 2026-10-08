let pendingVideo = null;
let pendingVideoPreview = null;

export function setPendingEpisodeVideo(file, preview) {
    pendingVideo = file;
    pendingVideoPreview = preview ? { ...preview } : null;
}

export function consumePendingEpisodeVideo() {
    const file = pendingVideo;
    const preview = pendingVideoPreview;
    pendingVideo = null;
    pendingVideoPreview = null;
    return file ? { file, preview } : null;
}

export function hasPendingEpisodeVideo() {
    return !!pendingVideo;
}
