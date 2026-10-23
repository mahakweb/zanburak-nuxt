import { defineStore } from 'pinia'
import axiosInstance from '@/store/axiosInstance'

export const useAdminCoursePublishStore = defineStore('adminCoursePublish', {
    state: () => ({
        pendingCount: 0,
    }),
    actions: {
        async fetchPendingCount() {
            try {
                const response = await axiosInstance.get('/admin/course/publish-requests/count')
                if (response.data && response.data.message === 'Success') {
                    this.pendingCount = response.data.count || 0
                }
            } catch {
                this.pendingCount = 0
            }
        },
        setPendingCount(count) {
            this.pendingCount = Math.max(0, Number(count) || 0)
        },
        decreasePending() {
            if (this.pendingCount > 0) this.pendingCount -= 1
        },
        increasePending() {
            this.pendingCount += 1
        },
    },
})
