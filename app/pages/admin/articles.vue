<template>
    <AdminArticlesLayout />
</template>

<script setup>
definePageMeta({
    middleware: ['auth'],
});
</script>

<script>
import AdminArticlesLayout from "@/views/page/admin/articles/AdminArticlesLayout.vue";

export default {
    components: { AdminArticlesLayout },
};
</script>
