<script setup>
import { computed } from 'vue'
import { usePermission } from '@/composables/usePermission'
import {
    COURSE_PUBLISH_APPROVE_PERMS,
    COURSE_PUBLISH_REJECT_PERMS,
    COURSE_PUBLISH_REQUEST_PERMS,
    publishStatus,
} from '@/utils/coursePublish'

const props = defineProps({
    course: { type: Object, required: true },
})

const emit = defineEmits(['action'])
const { can } = usePermission()

const status = computed(() => publishStatus(props.course))
const canRequest = computed(() => can(COURSE_PUBLISH_REQUEST_PERMS))
const canApprove = computed(() => can(COURSE_PUBLISH_APPROVE_PERMS))
const canReject = computed(() => can(COURSE_PUBLISH_REJECT_PERMS))
const canUnpublish = computed(() => can(COURSE_PUBLISH_APPROVE_PERMS))

const items = computed(() => {
    const list = []
    if (status.value === 'draft' || status.value === 'rejected') {
        if (canApprove.value) {
            list.push({ action: 'publish', label: 'انتشار دوره' })
        } else if (canRequest.value) {
            list.push({ action: 'request', label: status.value === 'rejected' ? 'ارسال مجدد درخواست انتشار' : 'درخواست انتشار' })
        }
        if (status.value === 'rejected' && canApprove.value && canReject.value) {
            list.push({ action: 'review', label: 'بررسی انتشار' })
        }
    }
    if (status.value === 'pending') {
        if (canApprove.value || canReject.value) {
            list.push({ action: 'review', label: 'بررسی درخواست انتشار' })
        }
        if (canRequest.value) {
            list.push({ action: 'cancel', label: 'انصراف از انتظار انتشار' })
        }
    }
    if (status.value === 'published' && canUnpublish.value) {
        list.push({ action: 'unpublish', label: 'لغو انتشار' })
    }
    return list
})
</script>

<template>
    <li v-for="item in items" :key="item.action">
        <button
            type="button"
            class="block w-full px-4 py-2 text-start hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            :class="item.action === 'unpublish' || item.action === 'reject' ? 'text-red-500 dark:text-red-400' : ''"
            @click="emit('action', { action: item.action, course })"
        >
            {{ item.label }}
        </button>
    </li>
</template>
