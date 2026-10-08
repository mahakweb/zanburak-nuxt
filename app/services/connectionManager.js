/**
 * Messenger connection manager.
 *
 * Centralizes browser network + WebSocket + heartbeat + reconnect state so
 * send readiness and Telegram-style connection UX stay in sync.
 *
 * Display statuses:
 *   connected | connecting | reconnecting | waiting_for_network | offline
 *
 * Internal transport state remains: connecting | connected | unavailable
 */
import {
  ensureEchoConnected,
  forceEchoReconnect,
  rebuildEcho,
  getEcho,
  getPusher,
  initEcho,
  mapPusherState,
  teardownEcho,
} from '@/lib/echo';
import config from '@/store/config';
import {
  CONNECTION_DISPLAY,
  resolveConnectionDisplayStatus,
} from '@/utils/connectionStatus';

const GRACE_MS = 12_000;
const HEALTH_INTERVAL_MS = 5_000;
const HEARTBEAT_STALE_MS = 45_000;
const RECONNECT_BASE_MS = 1_000;
const RECONNECT_MAX_MS = 5_000;
const CONNECTING_STUCK_MS = 4_000;
const NETWORK_PROBE_TIMEOUT_MS = 4_000;

/** @typedef {'connecting' | 'connected' | 'unavailable'} ConnectionUiState */

function readOnline() {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine !== false;
}

function apiOrigin() {
  try {
    const base = config?.apiBaseUrl || '/api';
    if (typeof window !== 'undefined' && String(base).startsWith('/')) {
      return window.location.origin;
    }
    return new URL(base, typeof window !== 'undefined' ? window.location.href : undefined).origin;
  } catch {
    return typeof window !== 'undefined' ? window.location.origin : '';
  }
}

function readAuthToken() {
  try {
    if (typeof localStorage === 'undefined') return null;
    return JSON.parse(localStorage.getItem('token'));
  } catch {
    return null;
  }
}

class ConnectionManager {
  constructor() {
    /** @type {ConnectionUiState} */
    this.state = 'connecting';
    this.isOnline = readOnline();
    this.networkConfirmedDown = false;
    this.intentionalStop = false;
    this.reconnectAttempt = 0;
    this.everConnected = false;
    /** @type {number|null} */
    this.lastHeartbeatAt = null;
    this.reconnectTimer = null;
    this.graceTimer = null;
    this.healthTimer = null;
    this.connectingWatchdog = null;
    this.connectingSince = null;
    this.softReconnects = 0;
    this.lastRebuildAt = 0;
    /** @type {Set<() => void>} */
    this.rebuildListeners = new Set();
    this.boundPusher = null;
    this.stateHandler = null;
    this.started = false;
    /** @type {Set<(snap: object) => void>} */
    this.listeners = new Set();
    this._onOnline = () => this.handleOnline();
    this._onOffline = () => this.handleOffline();
    this._probeInflight = null;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.snapshot());
    return () => this.listeners.delete(listener);
  }

  /**
   * Telegram-facing status derived from transport + network + reconnect history.
   */
  get displayStatus() {
    return resolveConnectionDisplayStatus({
      state: this.state,
      isOnline: this.isOnline,
      networkConfirmedDown: this.networkConfirmedDown,
      reconnectAttempt: this.reconnectAttempt,
      everConnected: this.everConnected,
    });
  }

  /** True when WS is up and network path is healthy. */
  get isHealthy() {
    return this.displayStatus === CONNECTION_DISPLAY.CONNECTED;
  }

  /** Auth token present (required before durable / realtime send). */
  get isAuthenticated() {
    return !!readAuthToken();
  }

  /**
   * Combined sendability: browser online, API path OK, auth present.
   * Websocket readiness is separate (realtimeReady) for instant ticks.
   */
  get canSendHttp() {
    return !!(this.isOnline && !this.networkConfirmedDown && this.isAuthenticated);
  }

  snapshot() {
    const displayStatus = this.displayStatus;
    const pusherState = getPusher()?.connection?.state || null;
    const wsConnected = pusherState === 'connected';
    return {
      state: this.state,
      displayStatus,
      isOnline: this.isOnline,
      networkConfirmedDown: this.networkConfirmedDown,
      intentionalStop: this.intentionalStop,
      reconnectAttempt: this.reconnectAttempt,
      everConnected: this.everConnected,
      lastHeartbeatAt: this.lastHeartbeatAt,
      heartbeatStale: this.isHeartbeatStale(),
      authenticated: this.isAuthenticated,
      canSendHttp: this.canSendHttp,
      wsConnected,
      wsState: pusherState,
      realtimeReady: this.canSendHttp && wsConnected,
      healthy: displayStatus === CONNECTION_DISPLAY.CONNECTED,
    };
  }

  emit() {
    const snap = this.snapshot();
    this.listeners.forEach((fn) => {
      try { fn(snap); } catch (e) { /* noop */ }
    });
  }

  /**
   * @param {ConnectionUiState} next
   */
  setState(next) {
    if (this.state === next) return;
    this.state = next;
    this.emit();
  }

  markHeartbeat() {
    this.lastHeartbeatAt = Date.now();
  }

  isHeartbeatStale() {
    if (!this.lastHeartbeatAt) return this.state !== 'connected';
    return (Date.now() - this.lastHeartbeatAt) > HEARTBEAT_STALE_MS;
  }

  startBrowserListeners() {
    if (typeof window === 'undefined' || this.started) return;
    this.started = true;
    window.addEventListener('online', this._onOnline);
    window.addEventListener('offline', this._onOffline);
    this.isOnline = readOnline();
    if (!this.healthTimer) {
      this.healthTimer = setInterval(() => this.healthTick(), HEALTH_INTERVAL_MS);
    }
  }

  stopBrowserListeners() {
    if (typeof window === 'undefined' || !this.started) return;
    this.started = false;
    window.removeEventListener('online', this._onOnline);
    window.removeEventListener('offline', this._onOffline);
    if (this.healthTimer) {
      clearInterval(this.healthTimer);
      this.healthTimer = null;
    }
  }

  onTransportRebuild(fn) {
    this.rebuildListeners.add(fn);
    return () => this.rebuildListeners.delete(fn);
  }

  /**
   * Begin (or revive) the realtime transport for a logged-in session.
   * Echo/Pusher are loaded lazily — only when messenger starts this path.
   * @returns {Promise<import('laravel-echo').default | null>}
   */
  async ensureConnected() {
    this.intentionalStop = false;
    this.startBrowserListeners();
    this.isOnline = readOnline();

    if (!this.isOnline) {
      this.networkConfirmedDown = true;
      this.setState('unavailable');
      this.scheduleReconnect();
      return null;
    }

    if (!this.isAuthenticated) {
      this.networkConfirmedDown = false;
      this.setState('connecting');
      this.scheduleReconnect();
      return null;
    }

    this.networkConfirmedDown = false;

    const livePusher = getPusher();
    if (livePusher?.connection?.state === 'connected') {
      this.bindPusher(livePusher);
      if (this.state !== 'connected') this.applyPusherState('connected');
      return getEcho() || (await initEcho());
    }

    this.beginGrace();
    this.setState('connecting');

    const echo = (await ensureEchoConnected()) || (await initEcho());
    if (!echo) {
      this.setState('connecting');
      this.armConnectingWatchdog();
      this.scheduleReconnect();
      return null;
    }

    this.bindPusher(getPusher());
    this.armConnectingWatchdog();
    this.nudgeSocket();
    return echo;
  }

  bindPusher(pusher) {
    if (!pusher) return;
    if (this.boundPusher === pusher && this.stateHandler) {
      this.applyPusherState(pusher.connection?.state);
      return;
    }
    this.unbindPusher();
    this.boundPusher = pusher;
    this.stateHandler = ({ current }) => {
      this.applyPusherState(current);
    };
    try {
      pusher.connection.bind('state_change', this.stateHandler);
    } catch (e) { /* noop */ }
    this.applyPusherState(pusher.connection?.state);
  }

  unbindPusher() {
    if (this.boundPusher && this.stateHandler) {
      try {
        this.boundPusher.connection.unbind('state_change', this.stateHandler);
      } catch (e) { /* noop */ }
    }
    this.boundPusher = null;
    this.stateHandler = null;
  }

  applyPusherState(raw) {
    if (this.intentionalStop) return;

    const mapped = mapPusherState(raw);
    if (mapped === 'connected') {
      this.reconnectAttempt = 0;
      this.softReconnects = 0;
      this.everConnected = true;
      this.markHeartbeat();
      this.clearReconnectTimer();
      this.clearGrace();
      this.clearConnectingWatchdog();
      this.networkConfirmedDown = false;
      this.isOnline = true;
      this.setState('connected');
      return;
    }

    if (!this.isOnline || this.networkConfirmedDown) {
      this.setState('unavailable');
      this.scheduleReconnect();
      return;
    }

    // Online but socket not ready — keep negotiating (Connecting / Reconnecting UI).
    this.setState('connecting');
    this.armConnectingWatchdog();
    if (raw === 'failed' || raw === 'unavailable' || raw === 'disconnected') {
      this.scheduleReconnect();
    }
  }

  beginGrace() {
    this.clearGrace();
    this.graceTimer = setTimeout(() => {
      this.graceTimer = null;
      if (this.intentionalStop) return;
      if (this.state === 'connected') return;
      // After grace: only escalate to unavailable when the browser/network is down.
      if (!readOnline()) {
        this.isOnline = false;
        this.networkConfirmedDown = true;
        this.setState('unavailable');
        return;
      }
      // Still online — probe once; if API is reachable keep connecting + reconnect.
      this.probeNetwork().then((ok) => {
        if (this.intentionalStop || this.state === 'connected') return;
        if (!ok) {
          this.networkConfirmedDown = true;
          this.setState('unavailable');
        } else {
          this.networkConfirmedDown = false;
          this.setState('connecting');
          this.nudgeSocket();
          this.scheduleReconnect();
        }
      });
    }, GRACE_MS);
  }

  clearGrace() {
    if (this.graceTimer) {
      clearTimeout(this.graceTimer);
      this.graceTimer = null;
    }
  }

  nudgeSocket({ force = false } = {}) {
    const pusher = getPusher();
    if (!pusher) {
      Promise.resolve()
        .then(async () => {
          if (this.intentionalStop) return;
          await ensureEchoConnected({ force }) || await initEcho();
          this.bindPusher(getPusher());
        })
        .catch(() => {});
      return;
    }
    const state = pusher.connection?.state;
    if (state === 'connected' && !force) return;
    if (state === 'connecting' && !force) {
      if (this.isConnectingStuck()) this.forceReconnectSocket();
      return;
    }
    try {
      pusher.connect();
    } catch (e) { /* noop */ }
  }

  isConnectingStuck() {
    const raw = getPusher()?.connection?.state;
    if (raw === 'connected') return false;
    if (!this.connectingSince) return false;
    return (Date.now() - this.connectingSince) >= CONNECTING_STUCK_MS;
  }

  armConnectingWatchdog() {
    if (this.intentionalStop) return;
    if (this.state === 'connected') return;
    if (getPusher()?.connection?.state === 'connected') return;
    if (!this.connectingSince) this.connectingSince = Date.now();
    if (this.connectingWatchdog) return;
    this.connectingWatchdog = setTimeout(() => {
      this.connectingWatchdog = null;
      if (this.intentionalStop) return;
      if (this.state === 'connected' || getPusher()?.connection?.state === 'connected') {
        this.applyPusherState('connected');
        return;
      }
      this.forceReconnectSocket();
      this.scheduleReconnect();
      this.armConnectingWatchdog();
    }, CONNECTING_STUCK_MS);
  }

  clearConnectingWatchdog() {
    if (this.connectingWatchdog) {
      clearTimeout(this.connectingWatchdog);
      this.connectingWatchdog = null;
    }
    this.connectingSince = null;
  }

  forceReconnectSocket() {
    if (this.intentionalStop) return;
    this.connectingSince = Date.now();
    this.softReconnects += 1;
    // disconnect()+connect() often leaves pusher-js stuck in "connecting".
    // After two soft tries, destroy Echo so channels can be re-subscribed.
    if (this.softReconnects >= 2) {
      this.softReconnects = 0;
      this.rebuildTransport();
      return;
    }
    Promise.resolve()
      .then(async () => {
        if (this.intentionalStop) return;
        await forceEchoReconnect();
        this.bindPusher(getPusher());
      })
      .catch(() => {});
  }

  rebuildTransport() {
    if (this.intentionalStop) return;
    const now = Date.now();
    if (now - this.lastRebuildAt < 6000) {
      this.scheduleReconnect();
      return;
    }
    this.lastRebuildAt = now;
    this.unbindPusher();
    Promise.resolve()
      .then(async () => {
        if (this.intentionalStop) return;
        try {
          await rebuildEcho();
        } catch (e) {
          try { teardownEcho(); } catch (e2) { /* noop */ }
          try { await initEcho({ force: true }); } catch (e3) { /* noop */ }
        }
        this.bindPusher(getPusher());
        this.connectingSince = Date.now();
        this.rebuildListeners.forEach((fn) => {
          try { fn(); } catch (e) { /* noop */ }
        });
      })
      .catch(() => {});
  }

  scheduleReconnect() {
    if (this.intentionalStop) return;
    if (this.reconnectTimer) return;

    const attempt = this.reconnectAttempt;
    const delay = Math.min(
      RECONNECT_MAX_MS,
      RECONNECT_BASE_MS * (2 ** Math.min(attempt, 5)) + Math.floor(Math.random() * 250),
    );
    this.reconnectAttempt = attempt + 1;
    // Attempt bump can flip Connecting → Reconnecting in the UI.
    this.emit();
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (this.intentionalStop) return;
      this.isOnline = readOnline();
      if (!this.isOnline) {
        this.networkConfirmedDown = true;
        this.setState('unavailable');
        this.scheduleReconnect();
        return;
      }
      this.setState(this.state === 'connected' ? 'connected' : 'connecting');
      this.ensureConnected().then(() => {
        this.nudgeSocket({ force: this.isConnectingStuck() });
      }).catch(() => {});
    }, delay);
  }

  clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  handleOnline() {
    this.isOnline = true;
    this.networkConfirmedDown = false;
    if (this.intentionalStop) {
      this.emit();
      return;
    }
    this.reconnectAttempt = 0;
    this.setState('connecting');
    this.beginGrace();
    this.ensureConnected().catch(() => {});
    this.emit();
  }

  handleOffline() {
    this.isOnline = false;
    this.networkConfirmedDown = true;
    if (this.intentionalStop) {
      this.emit();
      return;
    }
    this.setState('unavailable');
    this.scheduleReconnect();
    this.emit();
  }

  async probeNetwork() {
    if (this._probeInflight) return this._probeInflight;
    if (!readOnline()) {
      this.networkConfirmedDown = true;
      return false;
    }

    this._probeInflight = (async () => {
      const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timer = setTimeout(() => {
        try { ctrl?.abort(); } catch (e) { /* noop */ }
      }, NETWORK_PROBE_TIMEOUT_MS);
      try {
        const origin = apiOrigin();
        const probeUrl = config?.apiBaseUrl
          ? `${String(config.apiBaseUrl).replace(/\/$/, '')}/messenger/config`
          : `${origin}/api/messenger/config`;
        // Hit the API; any HTTP response (incl. 401/404) means the network path works.
        await fetch(probeUrl, {
          method: 'GET',
          credentials: 'omit',
          cache: 'no-store',
          signal: ctrl?.signal,
          headers: { Accept: 'application/json' },
        });
        this.networkConfirmedDown = false;
        this.markHeartbeat();
        return true;
      } catch {
        this.networkConfirmedDown = true;
        return false;
      } finally {
        clearTimeout(timer);
        this._probeInflight = null;
      }
    })();

    return this._probeInflight;
  }

  async healthTick() {
    if (this.intentionalStop) return;
    this.isOnline = readOnline();
    if (!this.isOnline) {
      this.networkConfirmedDown = true;
      this.setState('unavailable');
      this.scheduleReconnect();
      return;
    }

    const pusher = getPusher();
    const raw = pusher?.connection?.state;
    if (raw === 'connected') {
      if (this.isHeartbeatStale()) {
        this.forceReconnectSocket();
        this.scheduleReconnect();
        return;
      }
      this.markHeartbeat();
      if (this.state !== 'connected') this.applyPusherState('connected');
      return;
    }

    // Socket unhealthy while browser reports online — reconnect without treating as offline.
    if (this.state !== 'connecting') this.setState('connecting');
    this.armConnectingWatchdog();
    if (this.isConnectingStuck() && this.softReconnects >= 1) {
      this.rebuildTransport();
      return;
    }
    const shouldForce = this.isConnectingStuck()
      || (raw !== 'connecting' && raw !== 'initialized');
    this.nudgeSocket({ force: shouldForce });
    this.scheduleReconnect();
  }

  /**
   * Tear down transport (logout). Does not paint a false offline banner for
   * the next session — state resets on the next ensureConnected().
   */
  stop({ teardown = true } = {}) {
    this.intentionalStop = true;
    this.clearGrace();
    this.clearReconnectTimer();
    this.clearConnectingWatchdog();
    this.unbindPusher();
    this.reconnectAttempt = 0;
    this.softReconnects = 0;
    this.lastRebuildAt = 0;
    this.everConnected = false;
    this.lastHeartbeatAt = null;
    this.networkConfirmedDown = false;
    if (teardown) {
      try { teardownEcho(); } catch (e) { /* noop */ }
    }
    this.setState('connecting');
    this.stopBrowserListeners();
  }
}

export const connectionManager = new ConnectionManager();

export default connectionManager;
