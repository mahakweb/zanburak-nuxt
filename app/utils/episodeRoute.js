export function episodeShowRoute(courseSlug, order) {
    const slug = courseSlug || '';
    const ord = String(order ?? '');
    return {
        path: `/course/${slug}/episode/${ord}`,
        name: 'episode.show',
        params: {
            courseSlug: slug,
            episodeOrder: ord,
        },
    };
}

export function episodeShowPath(courseSlug, order) {
    return `/course/${courseSlug}/episode/${order}`;
}

export function isActiveEpisode(routeOrder, episodeOrder) {
    return String(routeOrder) === String(episodeOrder);
}
