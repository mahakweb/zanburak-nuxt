import config from '@/store/config';
import { getAuthTokenSync } from '@/utils/authToken';

/** Token used when the current Echo instance was created. */
let echoAuthToken = null;
let sessionAuthenticated = false;
/** In-flight dynamic import of laravel-echo + pusher-js. */
let libsPromise = null;

function readToken() {
  return getAuthTokenSync();
}

function readXsrfToken() {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

export function setEchoAuthenticated(value) {
  if (import.meta.server) return;
  sessionAuthenticated = !!value;
  if (!sessionAuthenticated && !readToken()) teardownEcho();
}

async function loadEchoLibs() {
  if (!libsPromise) {
    libsPromise = Promise.all([
      import('laravel-echo'),
      import('./cjs/pusher-js.mjs'),
    ]).then(([echoMod, pusherMod]) => ({
      Echo: echoMod.default,
      Pusher: pusherMod.default,
    }));
  }
  return libsPromise;
}

export async function initEcho({ force = false } = {}) {
  const token = readToken();
  if (!token && !sessionAuthenticated) return null;
  const authKey = token || 'session';

  if (window.Echo && !force) {
    if (echoAuthToken === authKey) return window.Echo;
    teardownEcho();
  }

  const { Echo, Pusher } = await loadEchoLibs();
  const pc = config.pusherConfig;
  window.Pusher = Pusher;

  window.Echo = new Echo({
    broadcaster: 'pusher',
    Pusher,
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
    channelAuthorization: {
      customHandler: async (params, callback) => {
        try {
          const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          };
          const xsrfToken = readXsrfToken();
          if (xsrfToken) headers['X-XSRF-TOKEN'] = xsrfToken;
          const bearerToken = readToken();
          if (bearerToken) headers.Authorization = `Bearer ${bearerToken}`;

          const response = await fetch(pc.authEndpoint, {
            method: 'POST',
            credentials: 'include',
            headers,
            body: new URLSearchParams({
              socket_id: params.socketId,
              channel_name: params.channelName,
            }),
          });
          if (!response.ok) {
            throw new Error(`Realtime authorization failed (${response.status})`);
          }
          callback(null, await response.json());
        } catch (error) {
          callback(error, null);
        }
      },
    },
  });
  echoAuthToken = authKey;

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
