import config from '@/store/config';

/** Token used when the current Echo instance was created. */
let echoAuthToken = null;
/** In-flight dynamic import of laravel-echo + pusher-js. */
let libsPromise = null;

function readToken() {
  try {
    return JSON.parse(localStorage.getItem('token'));
  } catch (e) {
    return null;
  }
}

async function loadEchoLibs() {
  if (!libsPromise) {
    libsPromise = Promise.all([
      import('laravel-echo'),
      import('pusher-js'),
    ]).then(([echoMod, pusherMod]) => ({
      Echo: echoMod.default,
      Pusher: pusherMod.default,
    }));
  }
  return libsPromise;
}

export async function initEcho({ force = false } = {}) {
  const token = readToken();
  if (!token) return null;

  if (window.Echo && !force) {
    if (echoAuthToken === token) return window.Echo;
    teardownEcho();
  }

  const { Echo, Pusher } = await loadEchoLibs();
  const pc = config.pusherConfig;
  window.Pusher = Pusher;

  window.Echo = new Echo({
    broadcaster: 'pusher',
    key: pc.key,
    cluster: pc.cluster || 'mt1',
    wsHost: pc.wsHost,
    wsPort: pc.wsPort,
    wssPort: pc.wssPort,
    forceTLS: pc.forceTLS,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
    unavailableTimeout: 4000,
    activityTimeout: 15000,
    pongTimeout: 8000,
    authEndpoint: pc.authEndpoint,
    auth: {
      headers: {
        Authorization: 'Bearer ' + token,
        'X-Requested-With': 'XMLHttpRequest',
      },
    },
  });
  echoAuthToken = token;

  return window.Echo;
}

export function getEcho() {
  return window.Echo || null;
}

export function getPusher() {
  return window.Echo?.connector?.pusher || null;
}

export function mapPusherState(state) {
  if (state === 'connected') return 'connected';
  if (state === 'connecting' || state === 'initialized') return 'connecting';
  return 'unavailable';
}

export async function ensureEchoConnected({ force = false } = {}) {
  const echo = await initEcho();
  if (!echo) return null;
  const pusher = getPusher();
  if (pusher) {
    const state = pusher.connection.state;
    if (force && state !== 'connected') {
      try { pusher.disconnect(); } catch (e) { /* noop */ }
      try { pusher.connect(); } catch (e) { /* noop */ }
    } else if (state === 'disconnected' || state === 'failed' || state === 'unavailable') {
      try {
        pusher.connect();
      } catch (e) {
        /* noop */
      }
    }
  }
  return echo;
}

export async function forceEchoReconnect() {
  const pusher = getPusher();
  if (!pusher) {
    return initEcho({ force: true });
  }
  try { pusher.disconnect(); } catch (e) { /* noop */ }
  try { pusher.connect(); } catch (e) { /* noop */ }
  return getEcho();
}

export async function rebuildEcho() {
  teardownEcho();
  return initEcho({ force: true });
}

export async function refreshEchoAuth() {
  teardownEcho();
  return initEcho({ force: true });
}

export function teardownEcho() {
  if (window.Echo) {
    try {
      window.Echo.disconnect();
    } catch (e) {
      /* noop */
    }
    window.Echo = null;
  }
  echoAuthToken = null;
}
