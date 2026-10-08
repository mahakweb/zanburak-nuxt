export function episodeShowRoute(courseSlug, order) {
    return {
        name: 'episode.show',
        params: {
            courseSlug,
            episodeOrder: String(order),
        },
    };
}

export function episodeShowPath(courseSlug, order) {
    return `/course/${courseSlug}/episode/${order}`;
}

export function isActiveEpisode(routeOrder, episodeOrder) {
    return String(routeOrder) === String(episodeOrder);
}
