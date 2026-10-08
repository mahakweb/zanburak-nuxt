<template>
  <svg
    class="pending-clock"
    :class="iconClass"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <!-- Hour hand: advances one step per full minute revolution -->
    <line
      class="pending-clock-hour"
      x1="12"
      y1="12"
      x2="12"
      y2="8.25"
      stroke-linecap="round"
    />
    <!-- Minute hand: continuous spin -->
    <line
      class="pending-clock-minute"
      x1="12"
      y1="12"
      x2="12"
      y2="6.5"
      stroke-linecap="round"
    />
  </svg>
</template>

<script>
export default {
  name: 'PendingClockIcon',
  props: {
    iconClass: { type: String, default: 'msg-meta-icon opacity-70' },
  },
};
</script>

<style scoped>
.pending-clock-hour,
.pending-clock-minute {
  transform-box: view-box;
  transform-origin: 12px 12px;
}

.pending-clock-minute {
  animation: pending-clock-minute 1s linear infinite;
}

.pending-clock-hour {
  animation: pending-clock-hour 12s linear infinite;
}

@keyframes pending-clock-minute {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pending-clock-hour {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
