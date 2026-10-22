<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :disabled="disabled"
    @click="!disabled && $emit('update:modelValue', !modelValue)"
    :class="[
      'relative inline-flex h-[22px] w-[36px] flex-shrink-0 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3390ec] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0e1621]',
      disabled ? 'opacity-50 cursor-not-allowed' : '',
      modelValue ? 'bg-[#3390ec]' : 'bg-gray-300 dark:bg-[#3d4d5c]',
    ]"
  >
    <span
      class="absolute top-[2px] h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-all duration-200 ease-in-out"
      :class="modelValue ? 'start-[16px]' : 'start-[2px]'"
    />
  </button>
</template>

<script>
export default {
  props: {
    modelValue: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
};
</script>
