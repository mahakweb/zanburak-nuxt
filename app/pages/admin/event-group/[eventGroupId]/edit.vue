<script setup>
const route = useRoute()
await navigateTo({ path: "/admin/event-groups", query: { edit: String(route.params.eventGroupId) } })
</script>
