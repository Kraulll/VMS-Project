import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { createJob, updateJob, fail } from '../services/jobs.js';

// Do not return browser-session identifiers or MongoDB internal fields.
function publicJob(job) {
  const { owner, _id, __v, ...visible } = job;
  return visible;
}

export function jobRouter(store) {
  const router = Router();
  router.use((req, res, next) => {
    if (['POST', 'PATCH'].includes(req.method) && (!req.body || typeof req.body !== 'object' || Array.isArray(req.body))) {
      return res.status(400).json({ error: 'Send a JSON object.' });
    }
    next();
  });
  router.get('/', async (req, res) => res.json((await store.list(req.demoSession)).map(publicJob)));
  router.post('/', async (req, res) => {
    if (req.get('X-Demo-Role') !== 'driver') fail('Only the driver can request service.', 403);
    const job = { ...createJob(req.body), id: randomUUID(), owner: req.demoSession };
    res.status(201).json(publicJob(await store.create(job)));
  });
  router.patch('/:id/:action', async (req, res) => {
    const current = await store.get(req.params.id, req.demoSession);
    if (!current) fail('Service request not found.', 404);
    if (req.body.version !== current.version) fail('The request has changed. Refresh and try again.', 409);
    const next = updateJob(current, req.params.action, req.body, req.get('X-Demo-Role'));
    const updated = await store.replace(next, current.version);
    if (!updated) fail('Another update arrived first. Refresh and try again.', 409);
    res.json(publicJob(updated));
  });
  return router;
}
