import axiosInstance from "@/store/axiosInstance";

export const articleService = {
    list(params = {}) {
        return axiosInstance.post("/articles", params);
    },
    sections(params = {}) {
        return axiosInstance.post("/articles/sections", params);
    },
    featured(params = {}) {
        return axiosInstance.post("/articles/featured", params);
    },
    show(slug) {
        return axiosInstance.post(`/article/${slug}`);
    },
    related(slug, params = {}) {
        return axiosInstance.post(`/article/${slug}/related`, params);
    },
    prevNext(slug) {
        return axiosInstance.post(`/article/${slug}/prev-next`);
    },
    getInitData() {
        return axiosInstance.post("/articles/layouts/getInitData");
    },
    create(data) {
        return axiosInstance.post("/articles/layouts/create", data);
    },
    getForEdit(slug) {
        return axiosInstance.get(`/article/${slug}/edit`);
    },
    update(slug, data) {
        return axiosInstance.put(`/article/${slug}/edit`, data);
    },
    delete(slug) {
        return axiosInstance.delete(`/article/${slug}/delete`);
    },
    userArticles(username, params = {}) {
        return axiosInstance.post(`/articles/user/${username}`, params);
    },
};

export default articleService;
