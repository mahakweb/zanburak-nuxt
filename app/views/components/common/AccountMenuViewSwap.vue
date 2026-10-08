<script setup>
defineProps({
    view: { type: String, required: true },
});
</script>

<template>
    <Transition name="account-menu-swap" mode="out-in">
        <div :key="view" class="account-menu-swap-pane">
            <slot />
        </div>
    </Transition>
</template>

<style scoped>
.account-menu-swap-pane {
    width: 100%;
}

.account-menu-swap-enter-active,
.account-menu-swap-leave-active {
    transition: opacity 0.2s ease;
}

.account-menu-swap-enter-from,
.account-menu-swap-leave-to {
    opacity: 0;
}
</style>
