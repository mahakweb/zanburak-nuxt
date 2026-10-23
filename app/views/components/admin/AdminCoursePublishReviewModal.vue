<script setup>
import { computed, ref, watch } from 'vue'
import BottomSheetDrawer from '@/views/components/common/BottomSheetDrawer.vue'
import AdminBottomSheetHeader from '@/views/components/admin/bottomSheet/AdminBottomSheetHeader.vue'
import AdminBottomSheetActions from '@/views/components/admin/bottomSheet/AdminBottomSheetActions.vue'
import {
    ADMIN_BS_PANEL_PUBLISH,
    ADMIN_BS_CONTENT,
    ADMIN_BS_BACKDROP,
    ADMIN_BS_FORM_LABEL,
    ADMIN_BS_INPUT,
    ADMIN_BS_INPUT_ERROR,
    ADMIN_BS_HINT,
    ADMIN_BS_SCROLL,
} from '@/views/components/admin/bottomSheet/adminBottomSheetStyles'
import axiosInstance from '@/store/axiosInstance'
import { showToastSuccess, showToastError } from '@/utils/toastConfig'
import {
    COURSE_PUBLISH_APPROVE_PERMS,
    formatReviewDate,
    deleteStatusLabel,
    publishLabel,
    reviewActionLabel,
    reviewActorLabel,
} from '@/utils/coursePublish'
import { useAdminCoursePublishStore } from '@/stores/adminCoursePublish'
import { usePermission } from '@/composables/usePermission'

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    course: { type: Object, default: null },
    episode: { type: Object, default: null },
    action: { type: String, default: 'request' },
    kind: { type: String, default: 'publish' },
})

const emit = defineEmits(['update:modelValue', 'updated'])

const loading = ref(false)
const comment = ref('')
const errorMessage = ref('')
const history = ref([])
const publishStore = useAdminCoursePublishStore()
const { can } = usePermission()

const hideReviewerName = computed(() => !can(COURSE_PUBLISH_APPROVE_PERMS))
const isDelete = computed(() => props.kind === 'delete')
const isEpisode = computed(() => props.kind === 'episode')
const entityLabel = computed(() => (isEpisode.value ? 'جلسه' : 'دوره'))
const subject = computed(() => (isEpisode.value ? props.episode : props.course))

const actionMeta = computed(() => {
    const entity = entityLabel.value
    if (isDelete.value) {
        switch (props.action) {
            case 'delete-cancel':
                return {
                    title: 'انصراف از درخواست حذف',
                    subtitle: 'دوره در فهرست باقی می‌ماند و از صف حذف خارج می‌شود',
                    accent: 'amber',
                    submitLabel: 'انصراف از حذف',
                    variant: 'warning',
                    endpoint: 'cancel',
                    commentRequired: false,
                    hint: 'پس از انصراف می‌توانید دوباره درخواست حذف بفرستید.',
                }
            case 'delete-review':
                return {
                    title: 'بررسی درخواست حذف',
                    subtitle: 'با تایید، دوره و متعلقات آن برای همیشه حذف می‌شود',
                    accent: 'rose',
                    submitLabel: 'تایید و حذف',
                    variant: 'danger',
                    endpoint: 'approve',
                    commentRequired: false,
                    hint: 'برای رد کردن، نوشتن دلیل الزامی است.',
                    dual: true,
                    approveLabel: 'تایید و حذف',
                    rejectLabel: 'رد درخواست',
                }
            default:
                return {
                    title: 'درخواست حذف دوره',
                    subtitle: 'پس از تایید مدیر، دوره و متعلقاتش حذف می‌شود',
                    accent: 'rose',
                    submitLabel: 'ارسال درخواست حذف',
                    variant: 'danger',
                    endpoint: 'request',
                    commentRequired: false,
                    hint: 'دوره تا تایید مدیر حذف نمی‌شود.',
                }
        }
    }

    switch (props.action) {
        case 'cancel':
            return {
                title: `انصراف از انتظار انتشار`,
                subtitle: `${entity} از صف بررسی خارج می‌شود و به پیش‌نویس برمی‌گردد`,
                accent: 'amber',
                submitLabel: 'خروج از صف انتظار',
                variant: 'warning',
                endpoint: 'cancel',
                commentRequired: false,
                hint: `پس از انصراف می‌توانید دوباره درخواست انتشار بفرستید. این تغییر در تاریخچه و صف مدیریت ثبت می‌شود.`,
            }
        case 'approve':
        case 'publish':
            return {
                title: props.action === 'publish' ? `انتشار ${entity}` : `تایید انتشار ${entity}`,
                subtitle: `${entity} برای عموم قابل مشاهده می‌شود`,
                accent: 'emerald',
                submitLabel: props.action === 'publish' ? `انتشار ${entity}` : 'تایید و انتشار',
                variant: 'primary',
                endpoint: 'approve',
                commentRequired: false,
                hint: 'می‌توانید توضیح کوتاهی برای مدرس بنویسید.',
            }
        case 'reject':
            return {
                title: 'رد درخواست انتشار',
                subtitle: 'مدرس دلیل رد را می‌بیند',
                accent: 'rose',
                submitLabel: 'رد درخواست',
                variant: 'danger',
                endpoint: 'reject',
                commentRequired: true,
                hint: `حتماً بنویسید ${entity} چرا برای انتشار آماده نیست.`,
            }
        case 'unpublish':
            return {
                title: `لغو انتشار ${entity}`,
                subtitle: `${entity} از حالت عمومی خارج می‌شود`,
                accent: 'rose',
                submitLabel: 'لغو انتشار',
                variant: 'danger',
                endpoint: 'unpublish',
                commentRequired: false,
                hint: 'توضیح اختیاری برای مدرس ثبت می‌شود.',
            }
        case 'review':
            return {
                title: 'بررسی درخواست انتشار',
                subtitle: 'تایید یا رد همراه با توضیح برای مدرس',
                accent: 'amber',
                submitLabel: 'تایید و انتشار',
                variant: 'primary',
                endpoint: 'approve',
                commentRequired: false,
                hint: 'برای رد کردن، نوشتن دلیل الزامی است.',
                dual: true,
                approveLabel: 'تایید و انتشار',
                rejectLabel: 'رد درخواست',
            }
        default:
            return {
                title: `درخواست انتشار ${entity}`,
                subtitle: `پس از بررسی مدیر، ${entity} منتشر می‌شود`,
                accent: 'amber',
                submitLabel: 'ارسال درخواست',
                variant: 'primary',
                endpoint: 'request',
                commentRequired: false,
                hint: 'در صورت نیاز توضیح کوتاهی برای بررسی‌کننده بنویسید.',
            }
    }
})

const latestReview = computed(() => {
    if (isDelete.value) return props.course?.delete_review || history.value[0] || null
    return subject.value?.publish_review || history.value[0] || null
})

function actionUrl(endpoint) {
    if (isDelete.value) {
        return `admin/course/${props.course?.slug}/delete/${endpoint}`
    }
    if (isEpisode.value) {
        const courseSlug = props.course?.slug || props.episode?.course?.slug
        return `admin/course/${courseSlug}/episode/${props.episode?.slug}/publish/${endpoint}`
    }
    return `admin/course/${props.course?.slug}/publish/${endpoint}`
}

function historyUrl() {
    if (isDelete.value) return `admin/course/${props.course?.slug}/delete/history`
    if (isEpisode.value) {
        const courseSlug = props.course?.slug || props.episode?.course?.slug
        return `admin/course/${courseSlug}/episode/${props.episode?.slug}/publish/history`
    }
    return `admin/course/${props.course?.slug}/publish/history`
}

watch(
    () => props.modelValue,
    (open) => {
        if (open) {
            comment.value = ''
            errorMessage.value = ''
            history.value = isDelete.value
                ? (props.course?.delete_history || [])
                : (subject.value?.publish_history || [])
            fetchHistory()
        }
    }
)

function close() {
    emit('update:modelValue', false)
}

async function fetchHistory() {
    if (!historyUrl()) return
    try {
        const { data } = await axiosInstance.post(historyUrl())
        history.value = data.history || []
    } catch {
        if (!history.value.length) {
            history.value = isDelete.value
                ? (props.course?.delete_history || [])
                : (subject.value?.publish_history || [])
        }
    }
}

async function submit(endpointOverride) {
    const endpoint = endpointOverride || actionMeta.value.endpoint
    const required = endpoint === 'reject' || actionMeta.value.commentRequired
    const text = comment.value.trim()
    if (required && text.length < 3) {
        errorMessage.value = 'لطفاً دلیل را حداقل در ۳ حرف بنویسید.'
        return
    }

    loading.value = true
    errorMessage.value = ''
    try {
        const { data } = await axiosInstance.post(actionUrl(endpoint), { comment: text || null })
        showToastSuccess(data?.message || 'وضعیت به‌روز شد.')
        const payload = isEpisode.value
            ? (data?.episode || null)
            : (data?.course || null)
        emit('updated', data?.deleted ? { ...payload, deleted: true } : payload)
        const wasPending = isDelete.value
            ? props.course?.delete_status === 'pending'
            : subject.value?.publish_status === 'pending'
        if (endpoint === 'request') publishStore.increasePending()
        if (['approve', 'reject', 'cancel'].includes(endpoint) && wasPending) {
            publishStore.decreasePending()
        }
        close()
    } catch (error) {
        const message = error.response?.data?.message || 'انجام این عملیات ممکن نشد.'
        errorMessage.value = message
        showToastError(message)
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <BottomSheetDrawer
        :model-value="modelValue"
        @update:model-value="emit('update:modelValue', $event)"
        :initialHeight="0.58"
        :maxHeight="0.86"
        :minHeight="0.42"
        :autoCloseOnMin="true"
        :closeOnBackdrop="true"
        :lockScroll="true"
        :panelClass="ADMIN_BS_PANEL_PUBLISH"
        :contentClass="ADMIN_BS_CONTENT"
        :backdropClass="ADMIN_BS_BACKDROP"
    >
        <AdminBottomSheetHeader
            :title="actionMeta.title"
            :subtitle="actionMeta.subtitle"
            :accent="actionMeta.accent"
            @close="close"
        >
            <template #icon>
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
                    <path d="M4 19V5a1 1 0 0 1 1-1h9l6 6v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14 4v6h6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </template>
        </AdminBottomSheetHeader>

        <div v-if="subject" :class="[ADMIN_BS_SCROLL, 'px-0.5']">
            <div class="relative z-0 rounded-xl border border-gray-200/70 dark:border-gray-700/70 bg-gray-50/60 dark:bg-gray-800/30 p-3 mb-3">
                <div class="text-sm font-bold text-gray-900 dark:text-white line-clamp-2">{{ subject.title }}</div>
                <div v-if="isEpisode && (course?.title || episode?.course?.title)" class="mt-0.5 text-[11px] text-gray-400">
                    دوره: {{ course?.title || episode?.course?.title }}
                </div>
                <div class="mt-1 text-[11px] text-gray-500">
                    وضعیت فعلی: {{ isDelete ? (deleteStatusLabel(course) || publishLabel(course)) : publishLabel(subject) }}
                </div>
                <div v-if="latestReview?.comment" class="mt-2 rounded-lg bg-white/80 dark:bg-gray-900/50 px-2.5 py-2 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                    <div class="mb-1 text-[10px] font-bold text-gray-400">
                        آخرین پیام {{ reviewActorLabel(latestReview.actor, latestReview.action, hideReviewerName) }}
                    </div>
                    {{ latestReview.comment }}
                </div>
            </div>

                <div v-if="history.length" class="mb-3 space-y-1.5">
                <div class="text-[11px] font-bold text-gray-500">{{ isDelete ? 'تاریخچه حذف' : 'تاریخچه انتشار' }}</div>
                <div class="max-h-36 space-y-1.5 overflow-y-auto custom-scrollbar pe-0.5">
                    <div
                        v-for="row in history"
                        :key="row.id"
                        class="rounded-lg border border-gray-100 bg-white px-2.5 py-2 text-[11px] text-gray-600 dark:border-gray-800 dark:bg-gray-900/40 dark:text-gray-300"
                    >
                        <div class="flex items-center justify-between gap-2">
                            <span class="font-bold text-gray-800 dark:text-gray-100">{{ reviewActionLabel(row.action) }}</span>
                            <span class="shrink-0 text-[10px] text-gray-400">{{ formatReviewDate(row.created_at) }}</span>
                        </div>
                        <div class="mt-0.5 text-[10px] text-gray-400">
                            {{ reviewActorLabel(row.actor, row.action, hideReviewerName) }}
                        </div>
                        <div v-if="row.comment" class="mt-1 leading-relaxed">{{ row.comment }}</div>
                    </div>
                </div>
            </div>

            <div class="relative z-10 pb-1">
                <label :class="ADMIN_BS_FORM_LABEL">
                    {{ actionMeta.commentRequired || action === 'reject' || action === 'review' ? 'توضیح برای مدرس' : 'توضیح (اختیاری)' }}
                </label>
                <textarea
                    v-model="comment"
                    rows="4"
                    :class="[ADMIN_BS_INPUT, errorMessage ? ADMIN_BS_INPUT_ERROR : '']"
                    placeholder="مثلاً محتوای دوره کامل است / پوستر یا توضیحات نیاز به اصلاح دارد..."
                />
                <p v-if="errorMessage" class="mt-1.5 text-xs font-medium text-rose-500">{{ errorMessage }}</p>
                <p :class="[ADMIN_BS_HINT, 'mt-3']">{{ actionMeta.hint }}</p>
            </div>
        </div>

        <div v-if="actionMeta.dual" class="shrink-0 pt-3 pb-5 border-t border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900">
            <div class="flex items-stretch gap-2">
                <button
                    type="button"
                    class="flex flex-1 items-center justify-center rounded-xl bg-rose-500 hover:bg-rose-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
                    :disabled="loading"
                    @click="submit('reject')"
                >
                    {{ actionMeta.rejectLabel || 'رد درخواست' }}
                </button>
                <button
                    type="button"
                    class="flex flex-1 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
                    :class="isDelete ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600'"
                    :disabled="loading"
                    @click="submit('approve')"
                >
                    {{ actionMeta.approveLabel || 'تایید و انتشار' }}
                </button>
            </div>
        </div>
        <AdminBottomSheetActions
            v-else
            hide-cancel
            :submit-label="actionMeta.submitLabel"
            :variant="actionMeta.variant"
            :loading="loading"
            @cancel="close"
            @submit="submit()"
        />
    </BottomSheetDrawer>
</template>
