<template>
  <nav
    class="flex min-w-0 max-w-full items-center overflow-x-auto overscroll-x-contain whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar-button]:hidden"
    :class="navToneClass" :aria-label="$t('breadcrumb.ariaLabel')">
    <ol class="inline-flex items-center gap-0.5">
      <li v-for="(item, index) in items" :key="`${item.label}-${index}`" class="flex items-center shrink-0">
        <div v-if="index !== 0" class="flex items-center" aria-hidden="true">
          <svg class="ltr:-rotate-[180deg] block text-gray-400 dark:text-gray-500" :class="separatorSizeClass"
            viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z"
                fill="currentColor"></path>
          </svg>
        </div>

        <component :is="getLinkComponent(item, index)" v-bind="getLinkProps(item)"
          class="flex items-center transition-colors duration-150" :class="getItemClass(index)">
          <svg v-if="showHomeIcon && index === 0" class="me-2 shrink-0 " :class="homeIconSizeClass" viewBox="0 0 24 24"
            fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z"
              stroke="currentColor" stroke-width="2" />
            <path d="M15 18H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <span>{{ item.label }}</span>
        </component>
      </li>
    </ol>
  </nav>
</template>

<script>
const SIZE_MAP = {
  xs: {
    text: "text-xs font-medium",
    last: "text-xs font-medium",
    separator: "w-3 h-3 mx-0.5",
    home: "w-2.5 h-2.5",
  },
  sm: {
    text: "text-sm font-medium",
    last: "text-sm font-medium",
    separator: "w-3 h-3 mx-0.5",
    home: "w-3.5 h-3.5",
  },
  md: {
    text: "text-base font-medium",
    last: "text-base font-medium",
    separator: "w-3.5 h-3.5 mx-0.5",
    home: "w-4 h-4",
  },
  lg: {
    text: "text-lg font-medium",
    last: "text-lg font-medium",
    separator: "w-3.5 h-3.5 mx-1",
    home: "w-[1.1rem] h-[1.1rem]",
  },
};

export default {
  name: "BreadcrumbComponent",
  props: {
    items: {
      type: Array,
      required: true,
      validator: (value) =>
        value.every((i) => i && typeof i.label === "string" && "href" in i),
    },
    size: {
      type: String,
      default: "md",
      validator: (v) => ["sm", "md", "lg"].includes(v),
    },
    showHomeIcon: {
      type: Boolean,
      default: true,
    },
    muted: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    sizeTokens() {
      return SIZE_MAP[this.size] || SIZE_MAP.md;
    },
    separatorSizeClass() {
      return this.sizeTokens.separator;
    },
    homeIconSizeClass() {
      return this.sizeTokens.home;
    },
    navToneClass() {
      return this.muted
        ? "text-gray-500 dark:text-gray-400"
        : "text-gray-700 dark:text-gray-300";
    },
  },
  methods: {
    getLinkComponent(item, index) {
      if (index === this.items.length - 1 || item.href == null) return "span";
      if (typeof item.href === "object") return "router-link";
      return "a";
    },
    getLinkProps(item) {
      if (typeof item.href === "object" && item.href !== null) {
        return { to: item.href };
      }
      if (typeof item.href === "string") {
        return { href: item.href };
      }
      return {};
    },
    getItemClass(index) {
      const isLast = index === this.items.length - 1;
      const base = isLast ? this.sizeTokens.last : this.sizeTokens.text;

      if (isLast) {
        return [
          base,
          "text-gray-900 dark:text-gray-100 cursor-default",
        ];
      }

      return [
        base,
        "text-gray-600 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400",
      ];
    },
  },
};
</script>
