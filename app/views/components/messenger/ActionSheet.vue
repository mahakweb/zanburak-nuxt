<template>
  <ConfirmDialog
    :open="open"
    :title="title"
    :message="message"
    :actions="actions"
    :stacked="actions.length > 1"
    @close="$emit('close')"
    @select="(v) => $emit('select', v)"
  />
</template>

<script>
import ConfirmDialog from './ConfirmDialog.vue';

export default {
  name: 'ActionSheet',
  components: { ConfirmDialog },
  props: {
    open: { type: Boolean, default: false },
    title: { type: String, default: '' },
    message: { type: String, default: '' },
    /** Optional: kept for callers; icon chrome removed for Telegram-like UI. */
    variant: { type: String, default: '' },
    actions: { type: Array, default: () => [] },
  },
  emits: ['close', 'select'],
};
</script>
