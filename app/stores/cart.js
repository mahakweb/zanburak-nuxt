import { defineStore } from "pinia";
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
  finalPrice: 0
};


































function applyCartPayload(piniaStore, data) {
  piniaStore._apply_setCartItems(data.cartItems || []);
  piniaStore._apply_setDiscountCode(data.discount_code || null);
  piniaStore._apply_setAppliedCoupon(data.applied_coupon || null);
  piniaStore._apply_setTotalPrice(data.total_price || 0);
  piniaStore._apply_setTotalDiscount(data.total_discount || 0);
  piniaStore._apply_setTotalOriginal(data.total_original ?? data.total_price ?? 0);
  piniaStore._apply_setTotalCourseDiscount(data.total_course_discount || 0);
  piniaStore._apply_setTotalCouponDiscount(data.total_coupon_discount || 0);
  piniaStore._apply_setFinalPrice(

    data.final_price ?? Math.max(0, (data.total_price || 0) - (data.total_discount || 0)));

}

function isCanceledRequest(error) {
  return error?.code === "ERR_CANCELED" ||
    error?.name === "CanceledError" ||
    error?.name === "AbortError";
}

function cartErrorMessage(error) {
  return error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    "عملیات سبد خرید انجام نشد. لطفاً دوباره تلاش کنید.";
}

function showCartError(error, context) {
  if (isCanceledRequest(error)) return;

  toast.error(cartErrorMessage(error), {
    theme: "colored",
    hideProgressBar: false,
    rtl: import.meta.client && localStorage.getItem("direction") === "rtl",
    bodyClassName: "font-anjoman",
    toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
    transition: toast.TRANSITIONS.BOUNCE,
    position: toast.POSITION.BOTTOM_RIGHT
  });
  if (error?.response?.status !== 422) {
    console.error(context, error);
  }
}

const actions = {
  async loadCartItems() {const piniaStore = this;
    piniaStore._apply_setLoading(true);
    try {
      const response = await axiosInstance.get("/cart");
      if (response.status === 200) {
        applyCartPayload(piniaStore, response.data);
      }
    } catch (error) {
      showCartError(error, "Error loading cart:");
    } finally {
      piniaStore._apply_setLoading(false);
    }
  },

  async addToCart({ type, itemId }) {const piniaStore = this;
    try {
      const response = await axiosInstance.post("/cart/add", {
        type,
        item_id: itemId
      });
      if (response.status === 200) {
        applyCartPayload(piniaStore, response.data);

        toast.success(response.data.message, {
          theme: "colored",
          hideProgressBar: false,
          rtl: localStorage.getItem("direction") == "rtl",
          bodyClassName: "font-anjoman",
          toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
          transition: toast.TRANSITIONS.BOUNCE,
          position: toast.POSITION.BOTTOM_RIGHT
        });
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      showCartError(error, "Error adding to cart:");
    }
  },

  async removeFromCart(cartId) {const piniaStore = this;
    try {
      const response = await axiosInstance.delete(`/cart/remove/${cartId}`);
      if (response.status === 200) {
        applyCartPayload(piniaStore, response.data);

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
      showCartError(error, "Error removing from cart:");
    }
  },

  async clearCart() {const piniaStore = this;
    try {
      const response = await axiosInstance.delete(`/cart/clear`);
      if (response.status === 200) {
        applyCartPayload(piniaStore, response.data);

        toast.success(response.data.message, {
          theme: "colored",
          hideProgressBar: false,
          rtl: localStorage.getItem("direction") == "rtl",
          bodyClassName: "font-anjoman",
          toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
          transition: toast.TRANSITIONS.BOUNCE,
          position: toast.POSITION.BOTTOM_RIGHT
        });
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      showCartError(error, "Error clearing cart:");
    }
  },

  async applyDiscountCode(code) {const piniaStore = this;
    try {
      const response = await axiosInstance.post("/cart/discount/apply", {
        code: code
      });
      if (response.status === 200) {
        applyCartPayload(piniaStore, response.data);
        toast.success(response.data.message, {
          theme: "colored",
          hideProgressBar: false,
          rtl: localStorage.getItem("direction") == "rtl",
          bodyClassName: "font-anjoman",
          toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
          transition: toast.TRANSITIONS.BOUNCE,
          position: toast.POSITION.BOTTOM_RIGHT
        });
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      showCartError(error, "Error applying discount:");
    }
  },

  async removeDiscountCode() {const piniaStore = this;
    try {
      const response = await axiosInstance.post("/cart/discount/remove");
      if (response.status === 200) {
        applyCartPayload(piniaStore, response.data);
        toast.success(response.data.message, {
          theme: "colored",
          hideProgressBar: false,
          rtl: localStorage.getItem("direction") == "rtl",
          bodyClassName: "font-anjoman",
          toastClassName: "rounded-xl text-sm font-semibold mb-4 mx-3 md:mx-0",
          transition: toast.TRANSITIONS.BOUNCE,
          position: toast.POSITION.BOTTOM_RIGHT
        });
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      showCartError(error, "Error removing discount:");
    }
  }, _apply_setLoading(status) {const state = this.$state;state.loading = status;}, _apply_setCartItems(cartItems) {const state = this.$state;state.cartItems = cartItems;}, _apply_setDiscountCode(code) {const state = this.$state;state.discountCode = code;}, _apply_setAppliedCoupon(coupon) {const state = this.$state;state.appliedCoupon = coupon;}, _apply_setTotalPrice(price) {const state = this.$state;state.totalPrice = price;}, _apply_setTotalDiscount(amount) {const state = this.$state;state.totalDiscount = amount;}, _apply_setTotalOriginal(amount) {const state = this.$state;state.totalOriginal = amount;}, _apply_setTotalCourseDiscount(amount) {const state = this.$state;state.totalCourseDiscount = amount;}, _apply_setTotalCouponDiscount(amount) {const state = this.$state;state.totalCouponDiscount = amount;}, _apply_setFinalPrice(amount) {const state = this.$state;state.finalPrice = amount;}
};

const getters = {
  cartItemCount: function (state) {return state.cartItems.length;},

  totalCartPrice: function (state) {return state.totalPrice;},
  totalDiscount: function (state) {return state.totalDiscount;},
  totalOriginal: function (state) {return state.totalOriginal || state.totalPrice;},
  totalCourseDiscount: function (state) {return state.totalCourseDiscount;},
  totalCouponDiscount: function (state) {return state.totalCouponDiscount;},
  finalPrice: function (state) {return state.finalPrice || Math.max(0, state.totalPrice - state.totalDiscount);},
  appliedCoupon: function (state) {return state.appliedCoupon;},

  isItemInCart: function (state) {return (type, itemId) => {
      return state.cartItems.some((item) => {
        if (item.type !== type) return false;

        const model = item[type];
        return model && model.id === itemId;
      });
    };},

  getCartItemsByType: function (state) {return (type) => {
      return state.cartItems.filter((item) => item.type === type);
    };},

  getDiscountCode: function (state) {return state.discountCode;}
};function getRootState() {return {};}function getRootGetters() {return {};}export const useCartStore = defineStore("cart", { state: () => JSON.parse(JSON.stringify(state)), getters: Object.fromEntries(Object.entries(getters || {}).filter(([name]) => !Object.prototype.hasOwnProperty.call(state, name))), actions });
