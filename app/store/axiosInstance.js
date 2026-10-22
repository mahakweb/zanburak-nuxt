import axios from 'axios';
import { useRequestHeaders, useRuntimeConfig } from '#app'
import config from '@/store/config'
import { acquireCryptoSlot, shouldLimitCryptoRequest } from '@/utils/cryptoHttpLimit';
import { getAuthTokenSync } from '@/utils/authToken';

const baseURL = config.apiBaseUrl; 

const instance = axios.create({
  baseURL: baseURL,
  timeout: 60000,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
//   headers: {'X-Custom-Header': 'foobar'}
});

const apiOrigin = baseURL.replace(/\/api\/?$/, '');
let csrfCookieRequest = null;

export async function ensureCsrfCookie() {
  if (!csrfCookieRequest) {
    csrfCookieRequest = fetch(`${apiOrigin}/sanctum/csrf-cookie`, {
      credentials: 'include',
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Could not initialize CSRF session (${response.status})`);
      }
    }).finally(() => {
      csrfCookieRequest = null;
    });
  }
  return csrfCookieRequest;
}

export function getXsrfToken() {
  if (!import.meta.client) return null;
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
  if (!match) return null;

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}


// Track in-flight requests to allow cancellation on route changes
const pendingControllers = new Set();

// Attach AbortController to every request and track it.
// Respect a caller-provided signal (e.g. cancellable messenger uploads).
// Crypto endpoints share a single slot so they cannot starve message sends.
// skipCancelOnNavigate: keep the request alive across SPA route sync (first-message
// create/send must not die when draft→real updates /messenger/:chatId).
instance.interceptors.request.use(async (requestConfig) => {
  try {
    if (shouldLimitCryptoRequest(requestConfig)) {
      const release = await acquireCryptoSlot();
      requestConfig.__cryptoRelease = release;
      // Don't let a hung crypto call hold the only slot for 60s.
      if (requestConfig.timeout == null || requestConfig.timeout > 15000) {
        requestConfig.timeout = 15000;
      }
    }
    const skipCancel = !!requestConfig.skipCancelOnNavigate;
    if (requestConfig.signal) {
      const existing = requestConfig.abortController || requestConfig.__controller;
      if (existing) {
        requestConfig.__controller = existing;
        if (!skipCancel) pendingControllers.add(existing);
      }
      return requestConfig;
    }
    const controller = new AbortController();
    requestConfig.signal = controller.signal;
    // Keep reference to remove later in response interceptor
    requestConfig.__controller = controller;
    if (!skipCancel) pendingControllers.add(controller);
  } catch (e) {
    // Ignore if environment/axios version does not support AbortController
  }
  return requestConfig;
});

function releaseCrypto(config) {
  if (config && typeof config.__cryptoRelease === 'function') {
    try { config.__cryptoRelease(); } catch (_) { /* noop */ }
    config.__cryptoRelease = null;
  }
}

// Remove finished/failed requests from the tracked set
instance.interceptors.response.use(
  (response) => {
    if (response && response.config && response.config.__controller) {
      pendingControllers.delete(response.config.__controller);
    }
    releaseCrypto(response && response.config);
    return response;
  },
  (error) => {
    const cfg = error && error.config;
    if (cfg && cfg.__controller) {
      pendingControllers.delete(cfg.__controller);
    }
    releaseCrypto(cfg);
    // Normalize canceled requests to always have a response object to avoid UI errors
    if (error && (error.code === 'ERR_CANCELED' || error.name === 'CanceledError')) {
      if (!error.response) {
        error.response = { status: 0, statusText: 'Canceled', data: null };
      }
    }
    return Promise.reject(error);
  }
);

// Cancel all in-flight requests (used on route navigation)
instance.cancelAllPending = function() {
  for (const controller of Array.from(pendingControllers)) {
    try { controller.abort(); } catch (_) { /* noop */ }
  }
  pendingControllers.clear();
};


instance.addHeaders = function(headers) {
  for (const [key, value] of Object.entries(headers)) {
    this.defaults.headers.common[key] = value;
  }
};

// Attach Bearer on both SSR and client when a token cookie/localStorage exists.
try {
  if (import.meta.client) {
    const token = getAuthTokenSync();
    if (token) {
      instance.addHeaders({ Authorization: 'Bearer ' + token });
    }
  }
} catch (_) {
  /* ignore invalid token */
}

/** Ensure Authorization matches the latest cookie/localStorage token (SSR-safe). */
instance.syncAuthHeader = function syncAuthHeader() {
  const token = getAuthTokenSync();
  if (import.meta.server) return token;
  if (token) {
    this.addHeaders({ Authorization: 'Bearer ' + token });
  } else if (this.defaults?.headers?.common) {
    delete this.defaults.headers.common.Authorization;
  }
  return token;
};

instance.interceptors.request.use(async (requestConfig) => {
  const token = getAuthTokenSync();
  if (token) {
    requestConfig.headers = requestConfig.headers || {};
    requestConfig.headers.Authorization = 'Bearer ' + token;
  }

  requestConfig.headers = requestConfig.headers || {};
  if (import.meta.client) {
    requestConfig.withCredentials = true;
    if (String(requestConfig.url || '').startsWith('/auth/')) {
      requestConfig.headers['X-Auth-Mode'] = 'session';
      if (requestConfig.method?.toLowerCase() !== 'get') {
        await ensureCsrfCookie();
      }
    }
  } else {
    try {
      const incomingCookie = useRequestHeaders(['cookie']).cookie;
      if (incomingCookie) requestConfig.headers.Cookie = incomingCookie;
      const appUrl = useRuntimeConfig().public.appUrl;
      if (appUrl) requestConfig.headers.Origin = new URL(appUrl).origin;
    } catch {
      // Calls outside an active Nuxt SSR request can still use bearer auth.
    }
  }
  return requestConfig;
});

export default instance;