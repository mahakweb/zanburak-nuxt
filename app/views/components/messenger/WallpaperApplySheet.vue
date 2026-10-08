<template>
  <ConfirmDialog
    :open="open"
    :title="$t('messenger.wallpaperApplyTitle')"
    :message="hint"
    :checkbox-label="checkboxLabel"
    v-model="forEveryone"
    :confirm-label="$t('messenger.wallpaperApplyLocal')"
    @close="$emit('close')"
    @confirm="onConfirm"
  />
</template>

<script>
import ConfirmDialog from './ConfirmDialog.vue';

export default {
  name: 'WallpaperApplySheet',
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
    hint() {
      return this.partnerName
        ? this.$t('messenger.wallpaperApplyHintNamed', { name: this.partnerName })
        : this.$t('messenger.wallpaperApplyHint');
    },
    checkboxLabel() {
      if (!this.partnerName) return '';
      return this.$t('messenger.wallpaperAlsoForName', { name: this.partnerName });
    },
  },
  watch: {
    open(val) {
      if (val) this.forEveryone = false;
    },
  },
  methods: {
    onConfirm() {
      this.$emit('confirm', this.partnerName ? !!this.forEveryone : false);
    },
  },
};
</script>
