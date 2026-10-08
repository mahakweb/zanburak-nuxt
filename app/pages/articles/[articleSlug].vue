<script setup>
const route = useRoute()
await navigateTo(`/article/${route.params.articleSlug}`, { redirectCode: 301 })
</script>
