import { defineStore } from "pinia";import axiosInstance from "@/store/axiosInstance";

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
  unreadLoadingMore: false
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

function isCanceledRequest(error) {
  return error?.code === "ERR_CANCELED" ||
    error?.name === "CanceledError" ||
    error?.name === "AbortError";
}




































































































































const actions = {
  async fetchUnreadCount() {const piniaStore = this;
    try {
      const response = await axiosInstance.post("panel/notification/unread");
      piniaStore._apply_SET_UNREAD_COUNT(response.data.unread_count);
    } catch (error) {
      if (isCanceledRequest(error)) return;
      console.error("Error fetching unread count:", error);
    }
  },

  fetchNotifications() {const piniaStore = this;
    return piniaStore.fetchUnreadCount();
  },

  async loadFeedPage({ page, append = false, filter = "all" }) {const piniaStore = this;
    const response = await axiosInstance.post("/panel/notifications", {
      page,
      perPage: PER_PAGE,
      sort: "newest",
      filter
    });

    const items = response.data.notifications || [];
    const pagination = response.data.pagination || {};

    if (filter === "unread") {
      if (append) {
        piniaStore._apply_APPEND_UNREAD_FEED_ITEMS(items);
      } else {
        piniaStore._apply_SET_UNREAD_FEED_ITEMS(items);
      }
      piniaStore._apply_SET_UNREAD_FEED_PAGINATION({
        page: pagination.current_page ?? page,
        lastPage: pagination.last_page ?? 1
      });
      piniaStore._apply_SET_UNREAD_FEED_INITIALIZED(true);
    } else if (append) {
      piniaStore._apply_APPEND_ITEMS(items);
      piniaStore._apply_SET_FEED_PAGINATION({
        page: pagination.current_page ?? page,
        lastPage: pagination.last_page ?? 1
      });
      piniaStore._apply_SET_FEED_INITIALIZED(true);
    } else {
      piniaStore._apply_SET_ITEMS(items);
      piniaStore._apply_SET_FEED_PAGINATION({
        page: pagination.current_page ?? page,
        lastPage: pagination.last_page ?? 1
      });
      piniaStore._apply_SET_FEED_INITIALIZED(true);
    }

    return items.length;
  },

  async ensureUnreadFeedLoaded() {const piniaStore = this,state = piniaStore.$state;
    if (state.unreadFeedInitialized || state.unreadListLoading) return;
    piniaStore._apply_SET_UNREAD_LIST_LOADING(true);
    try {
      await piniaStore.loadFeedPage({ page: 1, append: false, filter: "unread" });
    } catch (error) {
      if (!isCanceledRequest(error)) {
        console.error("Error loading unread notifications feed:", error);
      }
    } finally {
      piniaStore._apply_SET_UNREAD_LIST_LOADING(false);
    }
  },

  async loadMoreUnreadFeed() {const piniaStore = this,state = piniaStore.$state;
    if (state.unreadLoadingMore || state.unreadListLoading) return;
    if (state.unreadFeedPage >= state.unreadFeedLastPage) return;

    piniaStore._apply_SET_UNREAD_LOADING_MORE(true);
    try {
      await piniaStore.loadFeedPage({
        page: state.unreadFeedPage + 1,
        append: true,
        filter: "unread"
      });
    } catch (error) {
      if (!isCanceledRequest(error)) {
        console.error("Error loading more unread notifications:", error);
      }
    } finally {
      piniaStore._apply_SET_UNREAD_LOADING_MORE(false);
    }
  },

  async ensureFeedLoaded() {const piniaStore = this,state = piniaStore.$state;
    if (state.feedInitialized || state.listLoading) return;
    piniaStore._apply_SET_LIST_LOADING(true);
    try {
      await piniaStore.loadFeedPage({ page: 1, append: false });
    } catch (error) {
      if (!isCanceledRequest(error)) {
        console.error("Error loading notifications feed:", error);
      }
    } finally {
      piniaStore._apply_SET_LIST_LOADING(false);
    }
  },

  async loadMoreFeed() {const piniaStore = this,state = piniaStore.$state;
    if (state.loadingMore || state.listLoading) return;
    if (state.feedPage >= state.feedLastPage) return;

    piniaStore._apply_SET_LOADING_MORE(true);
    try {
      await piniaStore.loadFeedPage({ page: state.feedPage + 1, append: true });
    } catch (error) {
      if (!isCanceledRequest(error)) {
        console.error("Error loading more notifications:", error);
      }
    } finally {
      piniaStore._apply_SET_LOADING_MORE(false);
    }
  },

  async ensureEnoughItems({ neededCount = PER_PAGE } = {}) {const piniaStore = this,state = piniaStore.$state,getters = piniaStore;
    await piniaStore.ensureFeedLoaded();

    let guard = 0;
    while (state.items.length < neededCount && getters.hasMoreItems && guard < 50) {
      await piniaStore.loadMoreFeed();
      guard += 1;
    }
  },

  async markAsRead(id) {const piniaStore = this,state = piniaStore.$state;
    const item =
    state.items.find((n) => n.id === id) || state.unreadItems.find((n) => n.id === id);
    if (!item) return null;
    if (item.read_at) return item;

    try {
      const response = await axiosInstance.post("/panel/notification/details", { id });
      if (response.data?.notification) {
        piniaStore._apply_UPDATE_ITEM(response.data.notification);
        piniaStore._apply_DECREASE_UNREAD();
        return response.data.notification;
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }

    return state.items.find((n) => n.id === id) || state.unreadItems.find((n) => n.id === id) || item;
  },

  decreaseNotification() {const piniaStore = this;
    piniaStore._apply_DECREASE_UNREAD();
  },

  setReadAt() {const piniaStore = this;
    piniaStore._apply_DECREASE_UNREAD();
  },

  increaseNotification() {const piniaStore = this;
    piniaStore._apply_INCREMENT_UNREAD();
  },

  async markAllAsRead() {const piniaStore = this;
    await axiosInstance.post("/panel/notification/mark-all-read");
    piniaStore._apply_MARK_ALL_ITEMS_READ();
    piniaStore._apply_CLEAR_UNREAD_FEED_ITEMS();
    piniaStore._apply_SET_UNREAD_COUNT(0);
  },

  async markAllAsUnread() {const piniaStore = this,state = piniaStore.$state;
    await axiosInstance.post("/panel/notification/mark-all-unread");
    piniaStore._apply_MARK_ALL_ITEMS_UNREAD();
    piniaStore._apply_SET_UNREAD_COUNT(state.items.length);
  },

  async deleteNotification(id) {const piniaStore = this,state = piniaStore.$state;
    const item = state.items.find((n) => n.id === id);
    await axiosInstance.post("/panel/notification/delete", { id });
    if (item && !item.read_at) piniaStore._apply_DECREASE_UNREAD();
    piniaStore._apply_REMOVE_ITEM(id);
  },

  async bulkDelete(ids) {const piniaStore = this,state = piniaStore.$state;
    await axiosInstance.post("/panel/notification/bulk-delete", { ids });
    ids.forEach((id) => {
      const item = state.items.find((n) => n.id === id);
      if (item && !item.read_at) piniaStore._apply_DECREASE_UNREAD();
    });
    piniaStore._apply_REMOVE_ITEMS(ids);
  },

  async deleteAll() {const piniaStore = this;
    await axiosInstance.post("/panel/notification/delete-all");
    piniaStore._apply_CLEAR_ITEMS();
    piniaStore._apply_SET_UNREAD_COUNT(0);
    piniaStore._apply_SET_FEED_INITIALIZED(false);
    piniaStore._apply_SET_FEED_PAGINATION({ page: 0, lastPage: 1 });
  },

  async bulkMarkAsRead(ids) {const piniaStore = this,state = piniaStore.$state;
    await axiosInstance.post("/panel/notification/bulk-mark-read", { ids });
    let decreased = 0;
    ids.forEach((id) => {
      const item = state.items.find((n) => n.id === id);
      if (item && !item.read_at) decreased += 1;
    });
    piniaStore._apply_BULK_MARK_READ(ids);
    for (let i = 0; i < decreased; i++) piniaStore._apply_DECREASE_UNREAD();
  },

  async bulkMarkAsUnread(ids) {const piniaStore = this,state = piniaStore.$state;
    await axiosInstance.post("/panel/notification/bulk-mark-unread", { ids });
    let increased = 0;
    ids.forEach((id) => {
      const item = state.items.find((n) => n.id === id);
      if (item && item.read_at) increased += 1;
    });
    piniaStore._apply_BULK_MARK_UNREAD(ids);
    for (let i = 0; i < increased; i++) piniaStore._apply_INCREMENT_UNREAD();
  },

  resetFeed() {const piniaStore = this;
    piniaStore._apply_RESET_FEED();
  },

  initForUser() {const piniaStore = this;
    piniaStore.fetchUnreadCount();
    piniaStore.ensureUnreadFeedLoaded();
  }, _apply_SET_UNREAD_COUNT(count) {const state = this.$state;state.unreadNotifications = count;}, _apply_INCREMENT_UNREAD() {const state = this.$state;state.unreadNotifications += 1;}, _apply_DECREASE_UNREAD() {const state = this.$state;if (state.unreadNotifications > 0) state.unreadNotifications -= 1;}, _apply_SET_ITEMS(items) {const state = this.$state;state.items = items;}, _apply_APPEND_ITEMS(items) {const state = this.$state;const existingIds = new Set(state.items.map((n) => n.id));const fresh = items.filter((n) => !existingIds.has(n.id));state.items.push(...fresh);}, _apply_UPDATE_ITEM(notification) {const state = this.$state;const index = state.items.findIndex((n) => n.id === notification.id);if (index !== -1) {state.items.splice(index, 1, notification);}const unreadIndex = state.unreadItems.findIndex((n) => n.id === notification.id);if (unreadIndex !== -1) {if (notification.read_at) {state.unreadItems.splice(unreadIndex, 1);} else {state.unreadItems.splice(unreadIndex, 1, notification);}}}, _apply_MARK_ITEM_READ(id) {const state = this.$state;const item = state.items.find((n) => n.id === id);if (item && !item.read_at) {item.read_at = new Date().toISOString();}}, _apply_MARK_ALL_ITEMS_READ() {const state = this.$state;const now = new Date().toISOString();state.items.forEach((n) => {if (!n.read_at) n.read_at = now;});state.unreadItems = [];}, _apply_MARK_ALL_ITEMS_UNREAD() {const state = this.$state;state.items.forEach((n) => {n.read_at = null;});}, _apply_BULK_MARK_READ(ids) {const state = this.$state;const idSet = new Set(ids);const now = new Date().toISOString();state.items.forEach((n) => {if (idSet.has(n.id) && !n.read_at) n.read_at = now;});state.unreadItems = state.unreadItems.filter((n) => !idSet.has(n.id));}, _apply_BULK_MARK_UNREAD(ids) {const state = this.$state;const idSet = new Set(ids);state.items.forEach((n) => {if (idSet.has(n.id)) n.read_at = null;});}, _apply_REMOVE_ITEM(id) {const state = this.$state;state.items = state.items.filter((n) => n.id !== id);state.unreadItems = state.unreadItems.filter((n) => n.id !== id);}, _apply_REMOVE_ITEMS(ids) {const state = this.$state;const idSet = new Set(ids);state.items = state.items.filter((n) => !idSet.has(n.id));state.unreadItems = state.unreadItems.filter((n) => !idSet.has(n.id));}, _apply_CLEAR_ITEMS() {const state = this.$state;state.items = [];state.unreadItems = [];}, _apply_SET_UNREAD_FEED_ITEMS(items) {const state = this.$state;state.unreadItems = items;}, _apply_APPEND_UNREAD_FEED_ITEMS(items) {const state = this.$state;const existingIds = new Set(state.unreadItems.map((n) => n.id));const fresh = items.filter((n) => !existingIds.has(n.id));state.unreadItems.push(...fresh);}, _apply_SET_UNREAD_FEED_PAGINATION({ page, lastPage }) {const state = this.$state;state.unreadFeedPage = page;state.unreadFeedLastPage = lastPage;}, _apply_SET_UNREAD_FEED_INITIALIZED(value) {const state = this.$state;state.unreadFeedInitialized = value;}, _apply_SET_UNREAD_LIST_LOADING(value) {const state = this.$state;state.unreadListLoading = value;}, _apply_SET_UNREAD_LOADING_MORE(value) {const state = this.$state;state.unreadLoadingMore = value;}, _apply_CLEAR_UNREAD_FEED_ITEMS() {const state = this.$state;state.unreadItems = [];}, _apply_SET_FEED_PAGINATION({ page, lastPage }) {const state = this.$state;state.feedPage = page;state.feedLastPage = lastPage;}, _apply_SET_FEED_INITIALIZED(value) {const state = this.$state;state.feedInitialized = value;}, _apply_SET_LIST_LOADING(value) {const state = this.$state;state.listLoading = value;}, _apply_SET_LOADING_MORE(value) {const state = this.$state;state.loadingMore = value;}, _apply_RESET_FEED() {const state = this.$state;state.items = [];state.feedPage = 0;state.feedLastPage = 1;state.feedInitialized = false;state.listLoading = false;state.loadingMore = false;state.unreadItems = [];state.unreadFeedPage = 0;state.unreadFeedLastPage = 1;state.unreadFeedInitialized = false;state.unreadListLoading = false;state.unreadLoadingMore = false;state.unreadNotifications = 0;}
};

const getters = {
  unreadNotifications: function (state) {return state.unreadNotifications;},
  items: function (state) {return state.items;},
  hasMoreItems: function (state) {return state.feedPage < state.feedLastPage;},
  hasMoreUnreadItems: function (state) {return state.unreadFeedPage < state.unreadFeedLastPage;},
  listLoading: function (state) {return state.listLoading;},
  loadingMore: function (state) {return state.loadingMore;},
  unreadListLoading: function (state) {return state.unreadListLoading;},
  unreadLoadingMore: function (state) {return state.unreadLoadingMore;},
  feedInitialized: function (state) {return state.feedInitialized;},
  unreadFeedInitialized: function (state) {return state.unreadFeedInitialized;},
  getItemById: function (state) {return (id) =>
    state.items.find((n) => n.id === id) || state.unreadItems.find((n) => n.id === id);},
  filteredItems: function (state) {return (filter = "all", sort = "newest") => {
      return sortItems(filterItems(state.items, filter), sort);
    };}
};function getRootState() {return {};}function getRootGetters() {return {};}export const useNotificationStore = defineStore("notification", { state: () => JSON.parse(JSON.stringify(state)), getters: Object.fromEntries(Object.entries(getters || {}).filter(([name]) => !Object.prototype.hasOwnProperty.call(state, name))), actions });
