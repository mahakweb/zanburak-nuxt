// store/adminComments.module.js
import axiosInstance from "@/store/axiosInstance";

const state = {
	unapprovedCommentsCount: 0
};

const mutations = {
	SET_UNAPPROVED_COMMENTS_COUNT(state, count) {
		state.unapprovedCommentsCount = count;
	},
	DECREASE_UNAPPROVED_COMMENTS(state) {
		if (state.unapprovedCommentsCount > 0) {
			state.unapprovedCommentsCount -= 1;
		}
	},
	INCREMENT_UNAPPROVED_COMMENTS(state) {
		state.unapprovedCommentsCount += 1;
	}
};

const actions = {
	async fetchUnapprovedCommentsCount({ commit }) {
		try {
			const response = await axiosInstance.get("/admin/dashboard/unapproved-comments-count");
			if (response.data && response.data.message === "Success") {
				commit("SET_UNAPPROVED_COMMENTS_COUNT", response.data.count || 0);
			}
		} catch (error) {
			console.error("Error fetching unapproved comments count:", error);
		}
	},
	decreaseUnapprovedComments({ commit }) {
		commit("DECREASE_UNAPPROVED_COMMENTS");
	},
	incrementUnapprovedComments({ commit }) {
		commit("INCREMENT_UNAPPROVED_COMMENTS");
	}
};

const getters = {
	unapprovedCommentsCount: (state) => state.unapprovedCommentsCount
};

export const adminComments = {
	namespaced: true,
	state,
	mutations,
	actions,
	getters
};

