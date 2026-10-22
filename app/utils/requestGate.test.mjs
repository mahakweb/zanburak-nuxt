import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createSingleFlight,
  createTtlCache,
  nextRecoverDelay,
  shouldPingPresence,
} from './requestGate.js';

test('singleFlight shares one promise for the same key', async () => {
  const singleFlight = createSingleFlight();
  let calls = 0;
  const work = () => singleFlight('messages:1', async () => {
    calls += 1;
    return 'ok';
  });
  const [a, b] = await Promise.all([work(), work()]);
  assert.equal(a, 'ok');
  assert.equal(b, 'ok');
  assert.equal(calls, 1);
});

test('singleFlight does not share different keys', async () => {
  const singleFlight = createSingleFlight();
  let calls = 0;
  await Promise.all([
    singleFlight('a', async () => { calls += 1; }),
    singleFlight('b', async () => { calls += 1; }),
  ]);
  assert.equal(calls, 2);
});

test('ttl cache expires and invalidates one key', () => {
  const cache = createTtlCache();
  cache.set('pins:1', [1]);
  assert.deepEqual(cache.get('pins:1', 1000), [1]);
  cache.invalidate('pins:1');
  assert.equal(cache.get('pins:1', 1000), undefined);
});

test('recover delay skips sync while the socket is up', () => {
  const up = nextRecoverDelay({ wsConnected: true, attempt: 3 });
  assert.equal(up.sync, false);
  assert.equal(up.attempt, 0);
  const down = nextRecoverDelay({ wsConnected: false, attempt: 0 });
  assert.equal(down.sync, true);
  assert.equal(down.delayMs, 8000);
  const capped = nextRecoverDelay({ wsConnected: false, attempt: 9 });
  assert.equal(capped.delayMs, 60000);
});

test('presence ping respects the minimum gap', () => {
  assert.equal(shouldPingPresence(0, 1000, 20000), true);
  assert.equal(shouldPingPresence(1000, 5000, 20000), false);
  assert.equal(shouldPingPresence(1000, 22000, 20000), true);
});
