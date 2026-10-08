<script setup>
definePageMeta({ middleware: ["auth"] })
await navigateTo("/admin/settlements")
</script>
