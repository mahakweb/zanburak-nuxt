export const COURSE_PUBLISH_REQUEST_PERMS = [
    'courses.publish.request',
    'courses.publish.request.own',
    'courses.publish.request.any',
]

export const COURSE_PUBLISH_APPROVE_PERMS = [
    'courses.publish.approve',
    'courses.publish.approve.own',
    'courses.publish.approve.any',
    'courses.publish',
    'courses.publish.any',
]

export const COURSE_PUBLISH_REJECT_PERMS = [
    'courses.publish.reject',
    'courses.publish.reject.own',
    'courses.publish.reject.any',
    'courses.publish.approve',
    'courses.publish.approve.any',
]

export const COURSE_PUBLISH_UNPUBLISH_PERMS = [
    'courses.publish.approve',
    'courses.publish.approve.own',
    'courses.publish.approve.any',
    'courses.publish',
    'courses.publish.any',
]

export const COURSE_PUBLISH_REVIEW_PERMS = [
    'courses.publish.review',
    'courses.publish.review.own',
    'courses.publish.review.any',
    'courses.publish.approve',
    'courses.publish.approve.any',
    'courses.publish.reject',
    'courses.publish.reject.any',
]

export const COURSE_PUBLISH_QUEUE_PERMS = [
    'courses.publish.review',
    'courses.publish.review.any',
    'courses.publish.approve',
    'courses.publish.approve.any',
    'courses.publish.reject',
    'courses.publish.reject.any',
]

export const COURSE_DELETE_PERMS = [
    'courses.delete',
    'courses.delete.own',
    'courses.delete.any',
]

export function publishStatus(item) {
    if (!item) return 'draft'
    if (item.publish_status) return item.publish_status
    return item.publish ? 'published' : 'draft'
}

export function publishLabel(item) {
    switch (publishStatus(item)) {
        case 'published':
            return 'منتشر شده'
        case 'pending':
            return 'در انتظار تایید'
        case 'rejected':
            return 'رد شده'
        default:
            return 'پیش‌نویس'
    }
}

export function publishBadgeClass(item) {
    switch (publishStatus(item)) {
        case 'published':
            return 'bg-emerald-500/80'
        case 'pending':
            return 'bg-amber-500/80'
        case 'rejected':
            return 'bg-rose-500/80'
        default:
            return 'bg-gray-600/80'
    }
}

export function publishBarClass(item) {
    switch (publishStatus(item)) {
        case 'published':
            return 'bg-emerald-400 dark:bg-emerald-600'
        case 'pending':
            return 'bg-amber-400 dark:bg-amber-500'
        case 'rejected':
            return 'bg-rose-400 dark:bg-rose-600'
        default:
            return 'bg-gray-400 dark:bg-gray-600'
    }
}

export function publishChipClass(item) {
    switch (publishStatus(item)) {
        case 'published':
            return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
        case 'pending':
            return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
        case 'rejected':
            return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
        default:
            return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
    }
}

export function applyPublishResponse(item, payload) {
    if (!item || !payload) return item
    if (Object.prototype.hasOwnProperty.call(payload, 'publish')) {
        item.publish = payload.publish
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'publish_status')) {
        item.publish_status = payload.publish_status
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'publish_review')) {
        item.publish_review = payload.publish_review
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'publish_history')) {
        item.publish_history = payload.publish_history
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'delete_status')) {
        item.delete_status = payload.delete_status
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'delete_review')) {
        item.delete_review = payload.delete_review
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'delete_history')) {
        item.delete_history = payload.delete_history
    }
    return item
}

export function deleteStatus(item) {
    return item?.delete_status || 'none'
}

export function deleteStatusLabel(item) {
    switch (deleteStatus(item)) {
        case 'pending':
            return 'در انتظار تایید حذف'
        case 'rejected':
            return 'حذف رد شده'
        default:
            return ''
    }
}

export function isPublishedCourse(item) {
    return publishStatus(item) === 'published'
}

export function canHardDeleteCourse(item, canFn) {
    if (!item) return false
    const canDelete = typeof canFn === 'function' ? canFn(COURSE_DELETE_PERMS) : false
    if (!canDelete) return false
    if (!isPublishedCourse(item)) return true
    return typeof canFn === 'function' ? canFn(COURSE_PUBLISH_APPROVE_PERMS) : false
}

export function actorName(actor) {
    if (!actor) return 'سیستم'
    const fullName = [actor.first_name, actor.last_name].filter(Boolean).join(' ').trim()
    return fullName || actor.username || 'کاربر'
}

export function isReviewerAction(action) {
    return ['approve', 'reject', 'unpublish', 'publish', 'delete_approve', 'delete_reject'].includes(action)
}

export function reviewActorLabel(actor, action, hideReviewer = false) {
    if (hideReviewer && isReviewerAction(action)) return 'بررسی‌کننده'
    return actorName(actor)
}

export function formatReviewDate(value) {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleString('fa-IR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export function teacherDisplayName(teacher) {
    if (!teacher) return '—'
    const fullName = [teacher.first_name, teacher.last_name].filter(Boolean).join(' ').trim()
    return fullName || teacher.username || '—'
}

export function getCoursePublishActions(course, canFn) {
    const status = publishStatus(course)
    const canRequest = typeof canFn === 'function' ? canFn(COURSE_PUBLISH_REQUEST_PERMS) : false
    const canApprove = typeof canFn === 'function' ? canFn(COURSE_PUBLISH_APPROVE_PERMS) : false
    const canReject = typeof canFn === 'function' ? canFn(COURSE_PUBLISH_REJECT_PERMS) : false
    const list = []

    if (status === 'draft' || status === 'rejected') {
        if (canApprove) {
            list.push({ action: 'publish', label: 'انتشار دوره', tone: 'success' })
        } else if (canRequest) {
            list.push({
                action: 'request',
                label: status === 'rejected' ? 'ارسال مجدد درخواست' : 'درخواست انتشار',
                tone: 'amber',
            })
        }
        if (status === 'rejected' && canApprove && canReject) {
            list.push({ action: 'review', label: 'بررسی انتشار', tone: 'amber' })
        }
    }
    if (status === 'pending') {
        if (canApprove || canReject) {
            list.push({ action: 'review', label: 'بررسی درخواست', tone: 'amber' })
        }
        if (canRequest) {
            list.push({ action: 'cancel', label: 'انصراف از انتظار انتشار', tone: 'warning' })
        }
    }
    if (status === 'published' && canApprove) {
        list.push({ action: 'unpublish', label: 'لغو انتشار', tone: 'danger' })
    }
    return list
}

export function getCourseDeleteActions(course, canFn) {
    const canDelete = typeof canFn === 'function' ? canFn(COURSE_DELETE_PERMS) : false
    const canApprove = typeof canFn === 'function' ? canFn(COURSE_PUBLISH_APPROVE_PERMS) : false
    const canReject = typeof canFn === 'function' ? canFn(COURSE_PUBLISH_REJECT_PERMS) : false
    const list = []
    if (!isPublishedCourse(course)) return list

    const status = deleteStatus(course)
    if (status === 'pending') {
        if (canApprove || canReject) {
            list.push({ action: 'delete-review', label: 'بررسی درخواست حذف', tone: 'amber' })
        }
        if (canDelete) {
            list.push({ action: 'delete-cancel', label: 'انصراف از درخواست حذف', tone: 'warning' })
        }
        return list
    }

    if (canDelete && !canApprove) {
        list.push({
            action: 'delete-request',
            label: status === 'rejected' ? 'ارسال مجدد درخواست حذف' : 'درخواست حذف دوره',
            tone: 'danger',
        })
    }
    return list
}

export function getEpisodePublishActions(episode, canFn) {
    return getCoursePublishActions(episode, canFn).map((item) => ({
        ...item,
        label: item.label.replace('دوره', 'جلسه'),
    }))
}

export function teacherProfileRoute(teacher, canViewAdminUser) {
    if (!teacher?.username) return null
    if (canViewAdminUser) {
        return { name: 'admin-user-details', params: { username: teacher.username } }
    }
    return { name: 'profile-page', params: { username: teacher.username } }
}

export function reviewActionLabel(action) {
    switch (action) {
        case 'request':
            return 'درخواست انتشار'
        case 'cancel':
            return 'انصراف از انتظار انتشار'
        case 'approve':
            return 'تایید انتشار'
        case 'reject':
            return 'رد انتشار'
        case 'unpublish':
            return 'لغو انتشار'
        case 'publish':
            return 'انتشار مستقیم'
        case 'delete_request':
            return 'درخواست حذف'
        case 'delete_cancel':
            return 'انصراف از درخواست حذف'
        case 'delete_approve':
            return 'تایید حذف'
        case 'delete_reject':
            return 'رد حذف'
        default:
            return action || '—'
    }
}
