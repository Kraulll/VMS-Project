import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createApp } from '../server/app.js';
import { memoryStore } from '../server/services/store.js';

test('REST lifecycle, browser isolation, and stale update protection', async t => {
  const server = createApp(memoryStore()).listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => server.close());
  const base = `http://127.0.0.1:${server.address().port}/api`;
  const health = await fetch(`${base}/health`);
  const cookie = health.headers.get('set-cookie').split(';')[0];
  async function call(path, method = 'GET', body, role = 'driver', session = cookie) {
    const response = await fetch(base + path, {
      method, headers: { 'Content-Type': 'application/json', Cookie: session, 'X-Demo-Role': role },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    return { status: response.status, data: await response.json() };
  }
  const created = await call('/jobs', 'POST', {
    serviceId: 'tire', mode: 'roadside', location: 'Demo Street', vehicle: 'Honda Civic', issue: 'Flat tire'
  });
  assert.equal(created.status, 201);
  assert.equal(created.data.owner, undefined);
  let job = created.data;
  const other = 'vms_demo=' + 'a'.repeat(64);
  assert.deepEqual((await call('/jobs', 'GET', undefined, 'driver', other)).data, []);
  assert.equal((await call(`/jobs/${job.id}/cancel`, 'PATCH', { version: 0 }, 'driver', other)).status, 404);
  const quote = await call(`/jobs/${job.id}/quote`, 'PATCH', { version: 0, labor: 75, parts: 0 }, 'mechanic');
  assert.equal(quote.status, 200);
  assert.equal(quote.data.quote.totalCents, 8100);
  assert.equal((await call(`/jobs/${job.id}/accept`, 'PATCH', { version: 0 })).status, 409);
  job = quote.data;
  for (const [action, role] of [['accept', 'driver'], ['arrive', 'mechanic'], ['start', 'mechanic'], ['finish', 'mechanic']]) {
    const result = await call(`/jobs/${job.id}/${action}`, 'PATCH', { version: job.version }, role);
    assert.equal(result.status, 200);
    job = result.data;
  }
  assert.equal((await call(`/jobs/${job.id}/complete`, 'PATCH', { version: job.version, confirmed: false, rating: 5 })).status, 400);
  const completed = await call(`/jobs/${job.id}/complete`, 'PATCH', { version: job.version, confirmed: true, rating: 4 });
  assert.equal(completed.data.status, 'completed');
  assert.equal((await call('/jobs')).data[0].rating, 4);
});
