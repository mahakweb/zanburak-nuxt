// store/cart.module.js
import axiosInstance from "@/store/axiosInstance";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const state = {
  cartItems: [],
  loading: false,
  discountCode: null,
  appliedCoupon: null,
  totalPrice: 0,
  totalDiscount: 0,
  totalOriginal: 0,
  totalCourseDiscount: 0,
  totalCouponDiscount: 0,
  finalPrice: 0,
};

const mutations = {
  setLoading(state, status) {
    state.loading = status;
  },
  setCartItems(state, cartItems) {
    state.cartItems = cartItems;
  },
  setDiscountCode(state, code) {
    state.discountCode = code;
  },
  setAppliedCoupon(state, coupon) {
    state.appliedCoupon = coupon;
  },
  setTotalPrice(state, price) {
    state.totalPrice = price;
  },
  setTotalDiscount(state, amount) {
    state.totalDiscount = amount;
  },
  setTotalOriginal(state, amount) {
    state.totalOriginal = amount;
  },
  setTotalCourseDiscount(state, amount) {
    state.totalCourseDiscount = amount;
  },
  setTotalCouponDiscount(state, amount) {
    state.totalCouponDiscount = amount;
  },
  setFinalPrice(state, amount) {
    state.finalPrice = amount;
  },
};

function applyCartPayload(commit, data) {
  commit("setCartItems", data.cartItems || []);
  commit("setDiscountCode", data.discount_code || null);
  commit("setAppliedCoupon", data.applied_coupon || null);
  commit("setTotalPrice", data.total_price || 0);
  commit("setTotalDiscount", data.total_discount || 0);
  commit("setTotalOriginal", data.total_original ?? data.total_price ?? 0);
  commit("setTotalCourseDiscount", data.total_course_discount || 0);
  commit("setTotalCouponDiscount", data.total_coupon_discount || 0);
  commit(
    "setFinalPrice",
    data.final_price ?? Math.max(0, (data.total_price || 0) - (data.total_discount || 0))
  );
}

const actions = {
  async loadCartItems({ commit }) {
    commit("setLoading", true);
    try {
      const response = await axiosInstance.get("/cart");
      if (response.status === 200) {
        applyCartPayload(commit, response.data);
      }
    } catch (error) {
      toast.error(error.response.data.error, {
        theme: "colored",
        hideProgressBar: false,
        rtl: localStorage.getItem("direction") == "rtl",
        bodyClassName: "font-anjoman",
        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
        transition: toast.TRANSITIONS.BOUNCE,
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      console.error("Error loading cart:", error);
    }
    commit("setLoading", false);
  },

  async addToCart({ commit }, { type, itemId }) {
    try {
      const response = await axiosInstance.post("/cart/add", {
        type,
        item_id: itemId,
      });
      if (response.status === 200) {
        applyCartPayload(commit, response.data);

        toast.success(response.data.message, {
          theme: "colored",
          hideProgressBar: false,
          rtl: localStorage.getItem("direction") == "rtl",
          bodyClassName: "font-anjoman",
          toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
          transition: toast.TRANSITIONS.BOUNCE,
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.error, {
        theme: "colored",
        hideProgressBar: false,
        rtl: localStorage.getItem("direction") == "rtl",
        bodyClassName: "font-anjoman",
        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
        transition: toast.TRANSITIONS.BOUNCE,
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      console.error("Error adding to cart:", error);
    }
  },

  async removeFromCart({ commit }, cartId) {
    try {
      const response = await axiosInstance.delete(`/cart/remove/${cartId}`);
      if (response.status === 200) {
        applyCartPayload(commit, response.data);

        // toast.success(response.data.message, {
        //   theme: "colored",
        //   hideProgressBar: false,
        //   rtl: localStorage.getItem("direction") == "rtl",
        //   bodyClassName: "font-anjoman",
        //   toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
        //   transition: toast.TRANSITIONS.BOUNCE,
        //   position: toast.POSITION.BOTTOM_RIGHT,
        // });
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.error, {
        theme: "colored",
        hideProgressBar: false,
        rtl: localStorage.getItem("direction") == "rtl",
        bodyClassName: "font-anjoman",
        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
        transition: toast.TRANSITIONS.BOUNCE,
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      console.error("Error removing from cart:", error);
    }
  },

  async clearCart({ commit }) {
    try {
      const response = await axiosInstance.delete(`/cart/clear`);
      if (response.status === 200) {
        applyCartPayload(commit, response.data);

        toast.success(response.data.message, {
          theme: "colored",
          hideProgressBar: false,
          rtl: localStorage.getItem("direction") == "rtl",
          bodyClassName: "font-anjoman",
          toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
          transition: toast.TRANSITIONS.BOUNCE,
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.error, {
        theme: "colored",
        hideProgressBar: false,
        rtl: localStorage.getItem("direction") == "rtl",
        bodyClassName: "font-anjoman",
        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
        transition: toast.TRANSITIONS.BOUNCE,
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      console.error("Error removing from cart:", error);
    }
  },

  async applyDiscountCode({ commit }, code) {
    try {
      const response = await axiosInstance.post("/cart/discount/apply", {
        code: code,
      });
      if (response.status === 200) {
        applyCartPayload(commit, response.data);
        toast.success(response.data.message, {
          theme: "colored",
          hideProgressBar: false,
          rtl: localStorage.getItem("direction") == "rtl",
          bodyClassName: "font-anjoman",
          toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
          transition: toast.TRANSITIONS.BOUNCE,
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.error, {
        theme: "colored",
        hideProgressBar: false,
        rtl: localStorage.getItem("direction") == "rtl",
        bodyClassName: "font-anjoman",
        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
        transition: toast.TRANSITIONS.BOUNCE,
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      console.error("Error applying discount:", error);
    }
  },

  async removeDiscountCode({ commit }) {
    try {
      const response = await axiosInstance.post("/cart/discount/remove");
      if (response.status === 200) {
        applyCartPayload(commit, response.data);
        toast.success(response.data.message, {
          theme: "colored",
          hideProgressBar: false,
          rtl: localStorage.getItem("direction") == "rtl",
          bodyClassName: "font-anjoman",
          toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
          transition: toast.TRANSITIONS.BOUNCE,
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.error, {
        theme: "colored",
        hideProgressBar: false,
        rtl: localStorage.getItem("direction") == "rtl",
        bodyClassName: "font-anjoman",
        toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
        transition: toast.TRANSITIONS.BOUNCE,
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      console.error("Error applying discount:", error);
    }
  },
};

const getters = {
  cartItemCount: (state) => state.cartItems.length,

  totalCartPrice: (state) => state.totalPrice,
  totalDiscount: (state) => state.totalDiscount,
  totalOriginal: (state) => state.totalOriginal || state.totalPrice,
  totalCourseDiscount: (state) => state.totalCourseDiscount,
  totalCouponDiscount: (state) => state.totalCouponDiscount,
  finalPrice: (state) => state.finalPrice || Math.max(0, state.totalPrice - state.totalDiscount),
  appliedCoupon: (state) => state.appliedCoupon,

  isItemInCart: (state) => (type, itemId) => {
    return state.cartItems.some((item) => {
      if (item.type !== type) return false;

      const model = item[type];
      return model && model.id === itemId;
    });
  },

  getCartItemsByType: (state) => (type) => {
    return state.cartItems.filter((item) => item.type === type);
  },

  getDiscountCode: (state) => state.discountCode,
};

export const cart = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
