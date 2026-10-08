<script setup>
definePageMeta({ middleware: ["auth"] })
await navigateTo("/messenger")
</script>
