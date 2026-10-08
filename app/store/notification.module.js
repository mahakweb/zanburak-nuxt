import axiosInstance from "@/store/axiosInstance";

const PER_PAGE = 10;

const state = {
	unreadNotifications: 0,
	items: [],
	feedPage: 0,
	feedLastPage: 1,
	feedInitialized: false,
	listLoading: false,
	loadingMore: false,
	unreadItems: [],
	unreadFeedPage: 0,
	unreadFeedLastPage: 1,
	unreadFeedInitialized: false,
	unreadListLoading: false,
	unreadLoadingMore: false,
};

function sortItems(list, sort) {
	const sorted = [...list];
	sorted.sort((a, b) => {
		const da = new Date(a.created_at).getTime();
		const db = new Date(b.created_at).getTime();
		return sort === "oldest" ? da - db : db - da;
	});
	return sorted;
}

function filterItems(list, filter) {
	if (filter === "read") return list.filter((n) => n.read_at);
	if (filter === "unread") return list.filter((n) => !n.read_at);
	return list;
}

const mutations = {
	SET_UNREAD_COUNT(state, count) {
		state.unreadNotifications = count;
	},
	INCREMENT_UNREAD(state) {
		state.unreadNotifications += 1;
	},
	DECREASE_UNREAD(state) {
		if (state.unreadNotifications > 0) state.unreadNotifications -= 1;
	},
	SET_ITEMS(state, items) {
		state.items = items;
	},
	APPEND_ITEMS(state, items) {
		const existingIds = new Set(state.items.map((n) => n.id));
		const fresh = items.filter((n) => !existingIds.has(n.id));
		state.items.push(...fresh);
	},
	UPDATE_ITEM(state, notification) {
		const index = state.items.findIndex((n) => n.id === notification.id);
		if (index !== -1) {
			state.items.splice(index, 1, notification);
		}
		const unreadIndex = state.unreadItems.findIndex((n) => n.id === notification.id);
		if (unreadIndex !== -1) {
			if (notification.read_at) {
				state.unreadItems.splice(unreadIndex, 1);
			} else {
				state.unreadItems.splice(unreadIndex, 1, notification);
			}
		}
	},
	MARK_ITEM_READ(state, id) {
		const item = state.items.find((n) => n.id === id);
		if (item && !item.read_at) {
			item.read_at = new Date().toISOString();
		}
	},
	MARK_ALL_ITEMS_READ(state) {
		const now = new Date().toISOString();
		state.items.forEach((n) => {
			if (!n.read_at) n.read_at = now;
		});
		state.unreadItems = [];
	},
	MARK_ALL_ITEMS_UNREAD(state) {
		state.items.forEach((n) => {
			n.read_at = null;
		});
	},
	BULK_MARK_READ(state, ids) {
		const idSet = new Set(ids);
		const now = new Date().toISOString();
		state.items.forEach((n) => {
			if (idSet.has(n.id) && !n.read_at) n.read_at = now;
		});
		state.unreadItems = state.unreadItems.filter((n) => !idSet.has(n.id));
	},
	BULK_MARK_UNREAD(state, ids) {
		const idSet = new Set(ids);
		state.items.forEach((n) => {
			if (idSet.has(n.id)) n.read_at = null;
		});
	},
	REMOVE_ITEM(state, id) {
		state.items = state.items.filter((n) => n.id !== id);
		state.unreadItems = state.unreadItems.filter((n) => n.id !== id);
	},
	REMOVE_ITEMS(state, ids) {
		const idSet = new Set(ids);
		state.items = state.items.filter((n) => !idSet.has(n.id));
		state.unreadItems = state.unreadItems.filter((n) => !idSet.has(n.id));
	},
	CLEAR_ITEMS(state) {
		state.items = [];
		state.unreadItems = [];
	},
	SET_UNREAD_FEED_ITEMS(state, items) {
		state.unreadItems = items;
	},
	APPEND_UNREAD_FEED_ITEMS(state, items) {
		const existingIds = new Set(state.unreadItems.map((n) => n.id));
		const fresh = items.filter((n) => !existingIds.has(n.id));
		state.unreadItems.push(...fresh);
	},
	SET_UNREAD_FEED_PAGINATION(state, { page, lastPage }) {
		state.unreadFeedPage = page;
		state.unreadFeedLastPage = lastPage;
	},
	SET_UNREAD_FEED_INITIALIZED(state, value) {
		state.unreadFeedInitialized = value;
	},
	SET_UNREAD_LIST_LOADING(state, value) {
		state.unreadListLoading = value;
	},
	SET_UNREAD_LOADING_MORE(state, value) {
		state.unreadLoadingMore = value;
	},
	CLEAR_UNREAD_FEED_ITEMS(state) {
		state.unreadItems = [];
	},
	SET_FEED_PAGINATION(state, { page, lastPage }) {
		state.feedPage = page;
		state.feedLastPage = lastPage;
	},
	SET_FEED_INITIALIZED(state, value) {
		state.feedInitialized = value;
	},
	SET_LIST_LOADING(state, value) {
		state.listLoading = value;
	},
	SET_LOADING_MORE(state, value) {
		state.loadingMore = value;
	},
	RESET_FEED(state) {
		state.items = [];
		state.feedPage = 0;
		state.feedLastPage = 1;
		state.feedInitialized = false;
		state.listLoading = false;
		state.loadingMore = false;
		state.unreadItems = [];
		state.unreadFeedPage = 0;
		state.unreadFeedLastPage = 1;
		state.unreadFeedInitialized = false;
		state.unreadListLoading = false;
		state.unreadLoadingMore = false;
		state.unreadNotifications = 0;
	},
};

const actions = {
	async fetchUnreadCount({ commit }) {
		try {
			const response = await axiosInstance.post("panel/notification/unread");
			commit("SET_UNREAD_COUNT", response.data.unread_count);
		} catch (error) {
			console.error("Error fetching unread count:", error);
		}
	},

	fetchNotifications({ dispatch }) {
		return dispatch("fetchUnreadCount");
	},

	async loadFeedPage({ commit }, { page, append = false, filter = "all" }) {
		const response = await axiosInstance.post("/panel/notifications", {
			page,
			perPage: PER_PAGE,
			sort: "newest",
			filter,
		});

		const items = response.data.notifications || [];
		const pagination = response.data.pagination || {};

		if (filter === "unread") {
			if (append) {
				commit("APPEND_UNREAD_FEED_ITEMS", items);
			} else {
				commit("SET_UNREAD_FEED_ITEMS", items);
			}
			commit("SET_UNREAD_FEED_PAGINATION", {
				page: pagination.current_page ?? page,
				lastPage: pagination.last_page ?? 1,
			});
			commit("SET_UNREAD_FEED_INITIALIZED", true);
		} else if (append) {
			commit("APPEND_ITEMS", items);
			commit("SET_FEED_PAGINATION", {
				page: pagination.current_page ?? page,
				lastPage: pagination.last_page ?? 1,
			});
			commit("SET_FEED_INITIALIZED", true);
		} else {
			commit("SET_ITEMS", items);
			commit("SET_FEED_PAGINATION", {
				page: pagination.current_page ?? page,
				lastPage: pagination.last_page ?? 1,
			});
			commit("SET_FEED_INITIALIZED", true);
		}

		return items.length;
	},

	async ensureUnreadFeedLoaded({ state, dispatch, commit }) {
		if (state.unreadFeedInitialized || state.unreadListLoading) return;
		commit("SET_UNREAD_LIST_LOADING", true);
		try {
			await dispatch("loadFeedPage", { page: 1, append: false, filter: "unread" });
		} catch (error) {
			console.error("Error loading unread notifications feed:", error);
		} finally {
			commit("SET_UNREAD_LIST_LOADING", false);
		}
	},

	async loadMoreUnreadFeed({ state, dispatch, commit }) {
		if (state.unreadLoadingMore || state.unreadListLoading) return;
		if (state.unreadFeedPage >= state.unreadFeedLastPage) return;

		commit("SET_UNREAD_LOADING_MORE", true);
		try {
			await dispatch("loadFeedPage", {
				page: state.unreadFeedPage + 1,
				append: true,
				filter: "unread",
			});
		} catch (error) {
			console.error("Error loading more unread notifications:", error);
		} finally {
			commit("SET_UNREAD_LOADING_MORE", false);
		}
	},

	async ensureFeedLoaded({ state, dispatch, commit }) {
		if (state.feedInitialized || state.listLoading) return;
		commit("SET_LIST_LOADING", true);
		try {
			await dispatch("loadFeedPage", { page: 1, append: false });
		} catch (error) {
			console.error("Error loading notifications feed:", error);
		} finally {
			commit("SET_LIST_LOADING", false);
		}
	},

	async loadMoreFeed({ state, dispatch, commit }) {
		if (state.loadingMore || state.listLoading) return;
		if (state.feedPage >= state.feedLastPage) return;

		commit("SET_LOADING_MORE", true);
		try {
			await dispatch("loadFeedPage", { page: state.feedPage + 1, append: true });
		} catch (error) {
			console.error("Error loading more notifications:", error);
		} finally {
			commit("SET_LOADING_MORE", false);
		}
	},

	async ensureEnoughItems({ state, dispatch, getters }, { neededCount = PER_PAGE } = {}) {
		await dispatch("ensureFeedLoaded");

		let guard = 0;
		while (state.items.length < neededCount && getters.hasMoreItems && guard < 50) {
			await dispatch("loadMoreFeed");
			guard += 1;
		}
	},

	async markAsRead({ commit, state }, id) {
		const item =
			state.items.find((n) => n.id === id) || state.unreadItems.find((n) => n.id === id);
		if (!item) return null;
		if (item.read_at) return item;

		try {
			const response = await axiosInstance.post("/panel/notification/details", { id });
			if (response.data?.notification) {
				commit("UPDATE_ITEM", response.data.notification);
				commit("DECREASE_UNREAD");
				return response.data.notification;
			}
		} catch (error) {
			console.error("Error marking notification as read:", error);
			throw error;
		}

		return state.items.find((n) => n.id === id) || state.unreadItems.find((n) => n.id === id) || item;
	},

	decreaseNotification({ commit }) {
		commit("DECREASE_UNREAD");
	},

	setReadAt({ commit }) {
		commit("DECREASE_UNREAD");
	},

	increaseNotification({ commit }) {
		commit("INCREMENT_UNREAD");
	},

	async markAllAsRead({ commit }) {
		await axiosInstance.post("/panel/notification/mark-all-read");
		commit("MARK_ALL_ITEMS_READ");
		commit("CLEAR_UNREAD_FEED_ITEMS");
		commit("SET_UNREAD_COUNT", 0);
	},

	async markAllAsUnread({ commit, state }) {
		await axiosInstance.post("/panel/notification/mark-all-unread");
		commit("MARK_ALL_ITEMS_UNREAD");
		commit("SET_UNREAD_COUNT", state.items.length);
	},

	async deleteNotification({ commit, state }, id) {
		const item = state.items.find((n) => n.id === id);
		await axiosInstance.post("/panel/notification/delete", { id });
		if (item && !item.read_at) commit("DECREASE_UNREAD");
		commit("REMOVE_ITEM", id);
	},

	async bulkDelete({ commit, state }, ids) {
		await axiosInstance.post("/panel/notification/bulk-delete", { ids });
		ids.forEach((id) => {
			const item = state.items.find((n) => n.id === id);
			if (item && !item.read_at) commit("DECREASE_UNREAD");
		});
		commit("REMOVE_ITEMS", ids);
	},

	async deleteAll({ commit }) {
		await axiosInstance.post("/panel/notification/delete-all");
		commit("CLEAR_ITEMS");
		commit("SET_UNREAD_COUNT", 0);
		commit("SET_FEED_INITIALIZED", false);
		commit("SET_FEED_PAGINATION", { page: 0, lastPage: 1 });
	},

	async bulkMarkAsRead({ commit, state }, ids) {
		await axiosInstance.post("/panel/notification/bulk-mark-read", { ids });
		let decreased = 0;
		ids.forEach((id) => {
			const item = state.items.find((n) => n.id === id);
			if (item && !item.read_at) decreased += 1;
		});
		commit("BULK_MARK_READ", ids);
		for (let i = 0; i < decreased; i++) commit("DECREASE_UNREAD");
	},

	async bulkMarkAsUnread({ commit, state }, ids) {
		await axiosInstance.post("/panel/notification/bulk-mark-unread", { ids });
		let increased = 0;
		ids.forEach((id) => {
			const item = state.items.find((n) => n.id === id);
			if (item && item.read_at) increased += 1;
		});
		commit("BULK_MARK_UNREAD", ids);
		for (let i = 0; i < increased; i++) commit("INCREMENT_UNREAD");
	},

	resetFeed({ commit }) {
		commit("RESET_FEED");
	},

	initForUser({ dispatch }) {
		dispatch("fetchUnreadCount");
		dispatch("ensureUnreadFeedLoaded");
	},
};

const getters = {
	unreadNotifications: (state) => state.unreadNotifications,
	items: (state) => state.items,
	hasMoreItems: (state) => state.feedPage < state.feedLastPage,
	hasMoreUnreadItems: (state) => state.unreadFeedPage < state.unreadFeedLastPage,
	listLoading: (state) => state.listLoading,
	loadingMore: (state) => state.loadingMore,
	unreadListLoading: (state) => state.unreadListLoading,
	unreadLoadingMore: (state) => state.unreadLoadingMore,
	feedInitialized: (state) => state.feedInitialized,
	unreadFeedInitialized: (state) => state.unreadFeedInitialized,
	getItemById: (state) => (id) =>
		state.items.find((n) => n.id === id) || state.unreadItems.find((n) => n.id === id),
	filteredItems: (state) => (filter = "all", sort = "newest") => {
		return sortItems(filterItems(state.items, filter), sort);
	},
};

export const notification = {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
};
