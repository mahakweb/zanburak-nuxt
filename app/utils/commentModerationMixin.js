import {
    commentStatusToast,
    normalizeCommentStatus,
    postCommentStatus,
    syncPendingCommentCount,
} from "@/utils/commentStatus";
import { showToastError, showToastSuccess } from "@/utils/toastConfig";

export default {
    methods: {
        async setCommentStatus(comment, status, loadingKey) {
            if (!comment?.id) return;
            const key = loadingKey ?? comment.id;
            if (!this.loadingComments) this.loadingComments = {};
            this.loadingComments[key] = true;
            const prev = normalizeCommentStatus(comment);
            try {
                const next = await postCommentStatus(comment, status);
                syncPendingCommentCount(this.adminCommentsStore, prev, next, this.$parent);
                showToastSuccess(commentStatusToast(next));
                if (typeof this.fetchStats === "function") {
                    this.fetchStats();
                }
            } catch (error) {
                console.error(error.response?.data || error);
                showToastError("تغییر وضعیت کامنت با خطا مواجه شد.");
            } finally {
                this.loadingComments[key] = false;
            }
        },
    },
};
