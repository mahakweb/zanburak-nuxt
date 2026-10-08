<script setup>
definePageMeta({
  name: "admin-articles-stats",
  middleware: ['auth'],
})
</script>

﻿<template>
    <div class="min-w-0">
        <AdminArticlesStatsPanel ref="statsPanel" />
    </div>
</template>

<script>
import AdminArticlesStatsPanel from "@/views/components/admin/articles/AdminArticlesStatsPanel.vue";

export default {
    components: { AdminArticlesStatsPanel },
    methods: {
        refresh() {
            this.$refs.statsPanel?.refresh();
        },
    },
};
</script>
