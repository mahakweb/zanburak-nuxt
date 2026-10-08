<script setup>
const route = useRoute()
await navigateTo({ path: "/admin/events", query: { edit: String(route.params.eventId) } })
</script>
