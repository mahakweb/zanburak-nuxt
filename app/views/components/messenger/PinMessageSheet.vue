<template>
  <ConfirmDialog
    :open="open"
    :title="dialogTitle"
    :checkbox-label="checkboxLabel"
    v-model="forEveryone"
    :confirm-label="$t('messenger.pin')"
    @close="$emit('close')"
    @confirm="onConfirm"
  />
</template>

<script>
import ConfirmDialog from './ConfirmDialog.vue';

export default {
  name: 'PinMessageSheet',
  components: { ConfirmDialog },
  props: {
    open: { type: Boolean, default: false },
    partnerName: { type: String, default: '' },
  },
  emits: ['close', 'confirm'],
  data() {
    return { forEveryone: false };
  },
  computed: {
    dialogTitle() {
      return this.$t('messenger.pinConfirmQuestion');
    },
    checkboxLabel() {
      if (!this.partnerName) return '';
      return this.$t('messenger.pinAlsoForName', { name: this.partnerName });
    },
  },
  watch: {
    open(val) {
      if (val) this.forEveryone = false;
    },
  },
  methods: {
    onConfirm() {
      this.$emit('confirm', !!this.forEveryone);
    },
  },
};
</script>
