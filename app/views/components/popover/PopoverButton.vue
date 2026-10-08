<template>
    <button @click.prevent="popover.toggle()" :class="buttonClass">
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: "PopoverButton",
    inject: ['popover'],
    props: {
        buttonClass: {
            type: String,
            default: '',
        },
    },
};
</script>