<script setup>
import { computed } from 'vue'
import { usePermission } from '@/composables/usePermission'
import { teacherDisplayName, teacherProfileRoute } from '@/utils/coursePublish'

const props = defineProps({
    teacher: { type: Object, default: null },
    compact: { type: Boolean, default: false },
})

const { can } = usePermission()

const name = computed(() => teacherDisplayName(props.teacher))
const username = computed(() => props.teacher?.username ? `@${props.teacher.username}` : '')
const to = computed(() => teacherProfileRoute(
    props.teacher,
    can(['users.view', 'users.view.any']),
))
</script>

<template>
    <div v-if="!teacher" class="text-xs text-gray-400">—</div>
    <component
        v-else
        :is="to ? 'router-link' : 'div'"
        :to="to || undefined"
        class="flex min-w-0 items-center gap-2"
        :class="to ? 'hover:opacity-80 transition-opacity' : ''"
    >
        <div
            class="shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
            :class="compact ? 'h-8 w-8' : 'h-9 w-9'"
        >
            <img
                v-if="teacher.profile_pic"
                :src="teacher.profile_pic"
                :alt="name"
                class="h-full w-full object-cover"
                onerror="this.style.display='none'"
            />
        </div>
        <div class="min-w-0 text-start">
            <p class="truncate text-[11px] font-semibold text-gray-800 dark:text-gray-200">{{ name }}</p>
            <p v-if="username" class="truncate text-[10px] text-gray-400" dir="ltr">{{ username }}</p>
        </div>
    </component>
</template>
