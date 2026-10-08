/**
 * Cap concurrent /messenger/crypto/* HTTP so E2E package/distribute/bundles
 * cannot saturate the browser connection pool and stall message sends.
 *
 * Message POST / typing / sync stay unrestricted (priority path).
 */
const CRYPTO_PATH = /\/messenger\/crypto\//i;
const MAX_CONCURRENT = 1;

let active = 0;
const waiters = [];

function isCryptoUrl(url) {
  if (!url) return false;
  return CRYPTO_PATH.test(String(url));
}

function pump() {
  while (active < MAX_CONCURRENT && waiters.length) {
    const next = waiters.shift();
    active += 1;
    next();
  }
}

export function acquireCryptoSlot() {
  return new Promise((resolve) => {
    const grant = () => resolve(() => {
      active = Math.max(0, active - 1);
      pump();
    });
    if (active < MAX_CONCURRENT) {
      active += 1;
      grant();
    } else {
      waiters.push(grant);
    }
  });
}

export function shouldLimitCryptoRequest(config) {
  if (!config || config.skipCryptoLimit) return false;
  const url = config.url || '';
  const base = config.baseURL || '';
  return isCryptoUrl(url) || isCryptoUrl(`${base}${url}`);
}
