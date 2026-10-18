import test from 'node:test';
import assert from 'node:assert/strict';
import { createJob, updateJob } from '../server/services/jobs.js';

const input = { serviceId: 'battery', mode: 'roadside', location: '100 Demo Avenue', vehicle: '2018 Honda Civic', issue: 'Engine will not start.' };

test('quotes use integer cents and the server-controlled travel distance', () => {
  const quoted = updateJob(createJob(input), 'quote', { labor: 65.15, parts: 110.25, totalCents: 1 }, 'mechanic');
  assert.deepEqual(quoted.quote, { laborCents: 6515, partsCents: 11025, travelCents: 600, totalCents: 18140 });
});

test('wrong role, skipped steps, and invalid quotes are rejected', () => {
  const job = createJob(input);
  assert.throws(() => updateJob(job, 'quote', { labor: 1, parts: 1 }, 'driver'), /other role/);
  assert.throws(() => updateJob(job, 'finish', {}, 'mechanic'), /changed/);
  for (const labor of [-1, null, '65', Infinity, 10001]) {
    assert.throws(() => updateJob(job, 'quote', { labor, parts: 0 }, 'mechanic'), /Quote amounts/);
  }
  assert.throws(() => createJob({ ...input, location: '  ' }), /Location/);
  assert.throws(() => createJob({ ...input, serviceId: 'unsupported' }), /supported/);
});

test('completion requires a finished job and explicit driver confirmation', () => {
  let job = createJob(input);
  for (const [action, role, data] of [
    ['quote', 'mechanic', { labor: 65, parts: 110 }], ['accept', 'driver', {}],
    ['arrive', 'mechanic', {}], ['start', 'mechanic', {}], ['finish', 'mechanic', {}]
  ]) job = updateJob(job, action, data, role);
  assert.throws(() => updateJob(job, 'complete', { confirmed: false, rating: 5 }, 'driver'), /Confirm/);
  assert.throws(() => updateJob(job, 'complete', { confirmed: true, rating: 6 }, 'driver'), /rating/);
  const completed = updateJob(job, 'complete', { confirmed: true, rating: 5 }, 'driver');
  assert.equal(completed.status, 'completed');
  assert.equal(completed.payment, 'simulated');
  assert.throws(() => updateJob(completed, 'complete', { confirmed: true, rating: 5 }, 'driver'), /changed/);
});
