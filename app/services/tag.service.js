import axiosInstance from "@/store/axiosInstance";

export const tagService = {
    list(params = {}) {
        return axiosInstance.post("/tags", params);
    },

    show(slug) {
        return axiosInstance.post(`/tags/${slug}`);
    },

    content(slug, params = {}) {
        return axiosInstance.post(`/tags/${slug}/content`, params);
    },

    toggleFollow(tagId) {
        return axiosInstance.post("/toggleFollow", {
            followable_id: tagId,
            followable_type: "Tag",
        });
    },

    addTagsToQuestion(questionSlug, tags) {
        return axiosInstance.post(`/discuss/${questionSlug}/tags`, { tags });
    },

    syncQuestionTags(questionSlug, tags) {
        return axiosInstance.post(`/discuss/${questionSlug}/tags`, { tags });
    },
};

export default tagService;
