<template>
  <!-- Same chrome as sidebar/chat panels; blue only while hovering/dragging. -->
  <div
    class="messenger-divider hidden lg:block w-[3px] flex-shrink-0 cursor-col-resize relative z-20 self-stretch bg-[#f4f4f5] dark:bg-[#0e1621] hover:bg-[#3390ec]/80 dark:hover:bg-[#3390ec]/80 active:bg-[#3390ec] transition-colors duration-150"
    @mousedown.prevent="$emit('start', $event)"
  >
    <div class="absolute inset-y-0 -inset-x-2" />
  </div>
</template>

<script>
export default { emits: ['start'] };
</script>
