<template>
  <div class="session-device-icon" :class="`session-device-icon--${osKey}`" aria-hidden="true">
    <svg v-if="osKey === 'windows'" class="session-device-icon__svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 12.5V3.5l8 1.4v9.6H3zm9 0V4.9l9 1.6v9.4h-9zM3 21.5v-8h8v9.4l-8-1.4zm9-.1V13.5h9v7.9l-9-1.6z" />
    </svg>
    <svg v-else-if="osKey === 'mac'" class="session-device-icon__svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.24 13.04c-.03-2.58 2.1-3.82 2.19-3.87-1.19-1.74-3.04-1.98-3.7-2.01-1.57-.16-3.07.93-3.86.93s-2.03-.9-3.34-.88c-1.71.03-3.29 1-4.17 2.54-1.78 3.09-.45 7.67 1.27 10.18.84 1.22 1.84 2.58 3.16 2.53 1.27-.05 1.75-.82 3.28-.82 1.53 0 1.96.82 3.3.79 1.36-.02 2.22-1.24 3.05-2.47.96-1.4 1.35-2.76 1.37-2.83-.03-.01-2.63-1.01-2.66-4zM13.76 4.58c.7-.85 1.17-2.03 1.04-3.21-1.01.04-2.23.67-2.96 1.51-.65.75-1.22 1.95-1.07 3.1 1.13.09 2.28-.57 2.99-1.4z" />
    </svg>
    <svg v-else-if="osKey === 'android'" class="session-device-icon__svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.6 11.48l1.57-2.72a.75.75 0 10-1.3-.75l-1.64 2.84A7.04 7.04 0 0012 9.5a7.04 7.04 0 00-4.23 1.35L6.13 8.01a.75.75 0 10-1.3.75l1.57 2.72A6.97 6.97 0 004.5 16v1.25c0 .69.56 1.25 1.25 1.25h1.5v2.5a1.25 1.25 0 002.5 0v-2.5h5.5v2.5a1.25 1.25 0 002.5 0v-2.5h1.5c.69 0 1.25-.56 1.25-1.25V16a6.97 6.97 0 00-3.9-4.52zM8.5 13.25a1 1 0 110-2 1 1 0 010 2zm7 0a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
    <svg v-else-if="osKey === 'ios'" class="session-device-icon__svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.24 13.04c-.03-2.58 2.1-3.82 2.19-3.87-1.19-1.74-3.04-1.98-3.7-2.01-1.57-.16-3.07.93-3.86.93s-2.03-.9-3.34-.88c-1.71.03-3.29 1-4.17 2.54-1.78 3.09-.45 7.67 1.27 10.18.84 1.22 1.84 2.58 3.16 2.53 1.27-.05 1.75-.82 3.28-.82 1.53 0 1.96.82 3.3.79 1.36-.02 2.22-1.24 3.05-2.47.96-1.4 1.35-2.76 1.37-2.83-.03-.01-2.63-1.01-2.66-4zM13.76 4.58c.7-.85 1.17-2.03 1.04-3.21-1.01.04-2.23.67-2.96 1.51-.65.75-1.22 1.95-1.07 3.1 1.13.09 2.28-.57 2.99-1.4z" />
    </svg>
    <svg v-else-if="osKey === 'linux'" class="session-device-icon__svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3c-1.1 0-2 .9-2 2v.5C7.6 6.2 6 8.4 6 11v6.5c0 .83.67 1.5 1.5 1.5h1v1.5a1.5 1.5 0 003 0V19h2v1.5a1.5 1.5 0 003 0V19h1c.83 0 1.5-.67 1.5-1.5V11c0-2.6-1.6-4.8-4-5.5V5c0-1.1-.9-2-2-2zm-3 8.5a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
    <svg v-else class="session-device-icon__svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'SessionDeviceIcon',
  props: {
    token: { type: Object, required: true },
  },
  computed: {
    osKey() {
      const name = this.token?.device?.os?.name || '';
      if (name === 'Windows') return 'windows';
      if (name === 'Mac OS') return 'mac';
      if (name === 'Android') return 'android';
      if (name === 'iOS') return 'ios';
      if (name === 'Linux') return 'linux';
      return 'default';
    },
  },
};
</script>

<style scoped>
.session-device-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.session-device-icon__svg {
  width: 13px;
  height: 13px;
  display: block;
}

.session-device-icon--windows { background: #2563eb; }
.session-device-icon--mac { background: #6b7280; }
.session-device-icon--android { background: #22c55e; }
.session-device-icon--ios { background: #111827; }
.session-device-icon--linux { background: #f59e0b; color: #111827; }
.session-device-icon--default { background: #707579; }
</style>
