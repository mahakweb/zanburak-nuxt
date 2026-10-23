import axiosInstance from "@/store/axiosInstance";

export const COMMENT_STATUS = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
};

const FILTER_ALIASES = {
    published: COMMENT_STATUS.APPROVED,
    true: COMMENT_STATUS.APPROVED,
    "1": COMMENT_STATUS.APPROVED,
    unpublished: COMMENT_STATUS.PENDING,
    unapproved: COMMENT_STATUS.PENDING,
    false: COMMENT_STATUS.PENDING,
    "0": COMMENT_STATUS.PENDING,
};

export function normalizeCommentStatus(commentOrStatus) {
    if (commentOrStatus == null) return COMMENT_STATUS.PENDING;

    const raw = typeof commentOrStatus === "string" || typeof commentOrStatus === "boolean"
        ? commentOrStatus
        : (commentOrStatus.status ?? (commentOrStatus.approved ? COMMENT_STATUS.APPROVED : COMMENT_STATUS.PENDING));

    if (raw === true) return COMMENT_STATUS.APPROVED;
    if (raw === false) return COMMENT_STATUS.PENDING;

    const value = String(raw).toLowerCase().trim();
    if (value === COMMENT_STATUS.APPROVED || value === COMMENT_STATUS.PENDING || value === COMMENT_STATUS.REJECTED) {
        return value;
    }
    return FILTER_ALIASES[value] || COMMENT_STATUS.PENDING;
}

export function applyCommentStatus(comment, status) {
    if (!comment) return;
    const next = normalizeCommentStatus(status);
    comment.status = next;
    comment.approved = next === COMMENT_STATUS.APPROVED;
}

export function commentStatusLabel(status) {
    const map = {
        [COMMENT_STATUS.PENDING]: "در انتظار بررسی",
        [COMMENT_STATUS.APPROVED]: "تایید شده",
        [COMMENT_STATUS.REJECTED]: "رد شده",
    };
    return map[normalizeCommentStatus(status)] || map[COMMENT_STATUS.PENDING];
}

export function commentStatusToast(status) {
    const map = {
        [COMMENT_STATUS.PENDING]: "کامنت به حالت در انتظار بررسی تغییر کرد.",
        [COMMENT_STATUS.APPROVED]: "کامنت تایید شد.",
        [COMMENT_STATUS.REJECTED]: "کامنت رد شد.",
    };
    return map[normalizeCommentStatus(status)];
}

export function commentStatusBarClass(comment) {
    const status = normalizeCommentStatus(comment);
    if (status === COMMENT_STATUS.APPROVED) return "bg-green-400 dark:bg-green-600";
    if (status === COMMENT_STATUS.REJECTED) return "bg-rose-400 dark:bg-rose-600";
    return "bg-amber-400 dark:bg-amber-500";
}

export function commentStatusLineClass(comment) {
    const status = normalizeCommentStatus(comment);
    if (status === COMMENT_STATUS.APPROVED) return "bg-green-500/50 dark:bg-green-400/50";
    if (status === COMMENT_STATUS.REJECTED) return "bg-rose-500/60 dark:bg-rose-400/80";
    return "bg-amber-400/70 dark:bg-amber-400/60";
}

export function commentStatusBadgeClass(comment) {
    const status = normalizeCommentStatus(comment);
    if (status === COMMENT_STATUS.APPROVED) {
        return "text-green-800 dark:text-green-100 bg-green-100/70 dark:bg-green-800/50";
    }
    if (status === COMMENT_STATUS.REJECTED) {
        return "text-rose-800 dark:text-rose-100 bg-rose-100/70 dark:bg-rose-800/50";
    }
    return "text-amber-800 dark:text-amber-100 bg-amber-100/70 dark:bg-amber-800/50";
}

export function commentStatusFilterOptions() {
    return [
        { value: "all", slug: "all", label: "همه", title: "همه" },
        { value: COMMENT_STATUS.PENDING, slug: COMMENT_STATUS.PENDING, label: "در انتظار بررسی", title: "در انتظار بررسی" },
        { value: COMMENT_STATUS.APPROVED, slug: COMMENT_STATUS.APPROVED, label: "تایید شده", title: "تایید شده" },
        { value: COMMENT_STATUS.REJECTED, slug: COMMENT_STATUS.REJECTED, label: "رد شده", title: "رد شده" },
    ];
}

export function resolveStatusFilter(raw) {
    if (raw == null || raw === "" || raw === "all") return "all";
    return normalizeCommentStatus(raw);
}

export function syncPendingCommentCount(store, prev, next, parent) {
    const wasPending = normalizeCommentStatus(prev) === COMMENT_STATUS.PENDING;
    const isPending = normalizeCommentStatus(next) === COMMENT_STATUS.PENDING;
    if (wasPending && !isPending) {
        store?.decreaseUnapprovedComments?.();
        parent?.decreaseUnapprovedCount?.();
    } else if (!wasPending && isPending) {
        store?.incrementUnapprovedComments?.();
        parent?.incrementUnapprovedCount?.();
    }
}

export async function postCommentStatus(comment, status) {
    const response = await axiosInstance.post("admin/comments/toggle-approval", {
        comment_id: comment.id,
        status: normalizeCommentStatus(status),
    });
    const payload = response.data?.comment || {};
    const next = payload.status || status;
    applyCommentStatus(comment, next);
    if (payload.approved != null) {
        comment.approved = !!payload.approved;
    }
    return normalizeCommentStatus(comment);
}
