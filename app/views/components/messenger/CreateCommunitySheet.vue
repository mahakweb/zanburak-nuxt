<template>
  <BottomSheetDrawer
    :model-value="open"
    :fit-content="false"
    :initial-height="0.86"
    :min-height="0.4"
    :max-height="0.96"
    :auto-close-on-min="true"
    :close-on-backdrop="true"
    :lock-scroll="true"
    backdrop-z-class="z-[2000000030]"
    panel-z-class="z-[2000000040]"
    :panel-class="sheetPanelClass"
    content-class="px-0 pt-1 pb-0 overflow-auto flex flex-col min-h-0"
    :backdrop-class="sheetBackdropClass"
    @update:modelValue="(v) => { if (!v) $emit('close'); }"
    @close="$emit('close')"
  >
    <CreateCommunityForm :kind="kind" @created="(c) => $emit('created', c)" />
  </BottomSheetDrawer>
</template>

<script>
import BottomSheetDrawer from '@/views/components/common/BottomSheetDrawer.vue';
import CreateCommunityForm from './CreateCommunityForm.vue';
import { MESSENGER_SHEET_PANEL, MESSENGER_SHEET_BACKDROP } from './sheetStyles';

export default {
  name: 'CreateCommunitySheet',
  components: { BottomSheetDrawer, CreateCommunityForm },
  props: {
    open: { type: Boolean, default: false },
    kind: { type: String, default: 'group' },
  },
  emits: ['close', 'created'],
  computed: {
    sheetPanelClass() { return MESSENGER_SHEET_PANEL; },
    sheetBackdropClass() { return MESSENGER_SHEET_BACKDROP; },
  },
};
</script>
