import { defineStore } from "pinia"; 
import axiosInstance from "@/store/axiosInstance";

const state = {
  unapprovedCommentsCount: 0
};















const actions = {
  async fetchUnapprovedCommentsCount() {const piniaStore = this;
    try {
      const response = await axiosInstance.get("/admin/dashboard/unapproved-comments-count");
      if (response.data && response.data.message === "Success") {
        piniaStore._apply_SET_UNAPPROVED_COMMENTS_COUNT(response.data.count || 0);
      }
    } catch (error) {
      console.error("Error fetching unapproved comments count:", error);
    }
  },
  decreaseUnapprovedComments() {const piniaStore = this;
    piniaStore._apply_DECREASE_UNAPPROVED_COMMENTS();
  },
  incrementUnapprovedComments() {const piniaStore = this;
    piniaStore._apply_INCREMENT_UNAPPROVED_COMMENTS();
  }, _apply_SET_UNAPPROVED_COMMENTS_COUNT(count) {const state = this.$state;state.unapprovedCommentsCount = count;}, _apply_DECREASE_UNAPPROVED_COMMENTS() {const state = this.$state;if (state.unapprovedCommentsCount > 0) {state.unapprovedCommentsCount -= 1;}}, _apply_INCREMENT_UNAPPROVED_COMMENTS() {const state = this.$state;state.unapprovedCommentsCount += 1;}
};

const getters = {
  unapprovedCommentsCount: function (state) {return state.unapprovedCommentsCount;}
};function getRootState() {return {};}function getRootGetters() {return {};}export const useAdminCommentsStore = defineStore("adminComments", { state: () => JSON.parse(JSON.stringify(state)), getters: Object.fromEntries(Object.entries(getters || {}).filter(([name]) => !Object.prototype.hasOwnProperty.call(state, name))), actions });
