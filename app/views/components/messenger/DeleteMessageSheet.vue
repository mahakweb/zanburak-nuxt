<template>
  <ConfirmDialog
    :open="open"
    :title="title"
    :checkbox-label="checkboxLabel"
    v-model="forEveryone"
    :confirm-label="deleteLabel"
    :danger="true"
    @close="$emit('close')"
    @confirm="onConfirm"
  />
</template>

<script>
import ConfirmDialog from './ConfirmDialog.vue';

export default {
  name: 'DeleteMessageSheet',
  components: { ConfirmDialog },
  props: {
    open: { type: Boolean, default: false },
    partnerName: { type: String, default: '' },
    count: { type: Number, default: 1 },
    isAlbum: { type: Boolean, default: false },
    /** Show permanent delete (private own msgs / groups with permission / saved). */
    canDeleteForEveryone: { type: Boolean, default: false },
    /** saved | private | group | channel */
    chatKind: { type: String, default: 'private' },
  },
  emits: ['close', 'confirm'],
  data() {
    return { forEveryone: false };
  },
  computed: {
    title() {
      if (this.isAlbum && this.count > 1) return this.$t('messenger.deleteAlbumQuestion');
      if (this.count > 1) return this.$t('messenger.deleteMessagesQuestion', { count: this.count });
      return this.$t('messenger.deleteMessageQuestion');
    },
    /** Checkbox only when the user can choose “also delete for peer / everyone”. */
    showEveryoneToggle() {
      return this.canDeleteForEveryone && this.chatKind !== 'saved';
    },
    checkboxLabel() {
      if (!this.showEveryoneToggle) return '';
      if (this.partnerName && this.chatKind === 'private') {
        return this.$t('messenger.alsoDeleteFor', { name: this.partnerName });
      }
      return this.$t('messenger.deleteForEveryone');
    },
    deleteLabel() {
      return this.$t('messenger.delete');
    },
  },
  watch: {
    open(val) {
      if (val) {
        // Saved Messages always permanently deletes — no toggle needed.
        this.forEveryone = this.chatKind === 'saved';
      }
    },
  },
  methods: {
    onConfirm() {
      if (this.chatKind === 'saved') {
        this.$emit('confirm', 'everyone');
        return;
      }
      if (this.showEveryoneToggle && this.forEveryone) {
        this.$emit('confirm', 'everyone');
        return;
      }
      this.$emit('confirm', 'me');
    },
  },
};
</script>
