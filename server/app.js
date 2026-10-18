import express from 'express';
import { randomBytes } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { jobRouter } from './routes/jobs.js';
import { services } from './services/jobs.js';

export function createApp(store) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '16kb' }));
  app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    if (!['GET', 'HEAD'].includes(req.method) && !req.is('application/json')) {
      return res.status(415).json({ error: 'Send application/json.' });
    }
    const cookie = req.headers.cookie?.split(';').map(value => value.trim()).find(value => value.startsWith('vms_demo='));
    const session = cookie?.slice('vms_demo='.length);
    req.demoSession = /^[a-f0-9]{64}$/.test(session || '') ? session : randomBytes(32).toString('hex');
    if (session !== req.demoSession) {
      res.cookie('vms_demo', req.demoSession, {
        httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000, path: '/'
      });
    }
    next();
  });
  app.get('/api/health', (req, res) => res.json({ status: 'ok', storage: store.mode, demo: true }));
  app.get('/api/services', (req, res) => res.json(services));
  app.use('/api/jobs', jobRouter(store));
  app.use('/api', (req, res) => res.status(404).json({ error: 'API route not found.' }));
  const client = fileURLToPath(new URL('../client/dist/', import.meta.url));
  app.use(express.static(client));
  app.get('/', (req, res) => {
    if (existsSync(path.join(client, 'index.html'))) return res.sendFile(path.join(client, 'index.html'));
    res.status(503).send('Run npm run build, or use the Vite development server on port 5173.');
  });
  app.use((error, req, res, next) => {
    const status = error.status || 500;
    if (status === 500) console.error('Request failed:', error.name);
    res.status(status).json({ error: status >= 500 ? 'The server could not complete this request.' : error.message });
  });
  return app;
}
