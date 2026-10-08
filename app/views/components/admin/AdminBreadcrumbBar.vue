<template>
  <header class="mb-3">
    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div class="min-w-0 flex-1 space-y-1.5">
        <h1
          class="text-lg md:text-xl font-bold tracking-tight text-gray-700 dark:text-gray-100">
          {{ displayTitle }}
        </h1>
        <!-- <p
          v-if="displaySubtitle"
          class="text-sm md:text-base font-medium text-gray-500 dark:text-gray-400">
          {{ displaySubtitle }}
        </p> -->
        <div class="min-w-0 max-w-full overflow-hidden">
          <BreadcrumbComponent
            :items="breadcrumbItems"
            size="xs"
            :show-home-icon="showHomeIcon" />
        </div>
      </div>
      <div
        v-if="$slots.actions"
        class="flex shrink-0 flex-wrap items-center justify-end gap-2">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<script>
import BreadcrumbComponent from "@/views/components/breadcrumb/BreadcrumbComponent.vue";
import {
  resolveAdminBreadcrumbItems,
  resolveAdminPageHeader,
} from "@/utils/adminBreadcrumb";

export default {
  name: "AdminBreadcrumbBar",
  components: {
    BreadcrumbComponent,
  },
  props: {
    routeName: {
      type: String,
      default: null,
    },
    titleOverride: {
      type: String,
      default: null,
    },
    subtitleOverride: {
      type: String,
      default: null,
    },
    lastBreadcrumbOverride: {
      type: String,
      default: null,
    },
    showHomeIcon: {
      type: Boolean,
      default: true,
    },
    syncDocumentTitle: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    activeRouteName() {
      return this.routeName || this.$route.name;
    },
    pageHeader() {
      return resolveAdminPageHeader(this.activeRouteName, {
        titleOverride: this.titleOverride,
        subtitleOverride: this.subtitleOverride,
      });
    },
    displayTitle() {
      return this.pageHeader.title;
    },
    displaySubtitle() {
      return this.pageHeader.subtitle;
    },
    breadcrumbItems() {
      return resolveAdminBreadcrumbItems(this.$route, {
        lastBreadcrumbLabel: this.lastBreadcrumbOverride,
      });
    },
  },
  watch: {
    displayTitle: {
      immediate: true,
      handler(title) {
        if (this.syncDocumentTitle && title) {
          document.title = title;
        }
      },
    },
  },
};
</script>
