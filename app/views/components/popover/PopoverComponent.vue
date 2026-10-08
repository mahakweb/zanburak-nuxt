<template>
  <div class="relative">
    <slot />
  </div>
</template>

<script>
export default {
  name: "PopoverComponent",
  data() {
    return {
      isOpen: false,
    };
  },
  provide() {
    return {
      popover: this,
    };
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;

      // وقتی باز میشه، لیسنر اضافه کن
      if (this.isOpen) {
        this.$nextTick(() => {
          document.addEventListener("click", this.handleClickOutside);
        });
      } else {
        document.removeEventListener("click", this.handleClickOutside);
      }
    },
    close() {
      this.isOpen = false;
    },
    handleClickOutside(event) {
      if (this.$el && !this.$el.contains(event.target)) {
        this.close();
      }
    },
    mounted() {
      document.addEventListener("click", this.handleClickOutside);
    },
    beforeUnmount() {
      document.removeEventListener("click", this.handleClickOutside);
    },
  },
};
</script>