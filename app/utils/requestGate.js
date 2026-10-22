/**
 * Share one in-flight promise for identical keys. Callers with different
 * keys (users, cursors, conversation ids) never share a result.
 */
export function createSingleFlight() {
  const inflight = new Map();
  return function singleFlight(key, fn) {
    const existing = inflight.get(key);
    if (existing) return existing;
    const work = Promise.resolve().then(fn).finally(() => {
      if (inflight.get(key) === work) inflight.delete(key);
    });
    inflight.set(key, work);
    return work;
  };
}

export function createTtlCache() {
  const cache = new Map();
  return {
    get(key, ttlMs) {
      const row = cache.get(key);
      if (!row) return undefined;
      if (Date.now() - row.at > ttlMs) {
        cache.delete(key);
        return undefined;
      }
      return row.value;
    },
    set(key, value) {
      cache.set(key, { at: Date.now(), value });
    },
    invalidate(key) {
      if (key == null) cache.clear();
      else cache.delete(String(key));
    },
    invalidatePrefix(prefix) {
      const needle = String(prefix);
      for (const key of cache.keys()) {
        if (String(key).startsWith(needle)) cache.delete(key);
      }
    },
  };
}

/**
 * While the socket is connected, do not poll /sync. While it is down, sync
 * with capped exponential backoff so a dead socket still recovers history.
 */
export function nextRecoverDelay({ wsConnected, attempt = 0 } = {}) {
  if (wsConnected) {
    return { delayMs: 20000, sync: false, attempt: 0 };
  }
  const steps = [8000, 15000, 30000, 60000];
  const index = Math.max(0, Math.min(steps.length - 1, Number(attempt) || 0));
  return { delayMs: steps[index], sync: true, attempt: index + 1 };
}

/** Collapse visibility + interval + reconnect pings into one heartbeat. */
export function shouldPingPresence(lastAt, now, minGapMs = 20000) {
  if (!lastAt) return true;
  return now - lastAt >= minGapMs;
}
