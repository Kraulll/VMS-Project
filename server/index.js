import 'dotenv/config';
import { createApp } from './app.js';
import { connectStore } from './services/store.js';

try {
  const store = await connectStore(process.env.STORAGE_MODE || 'memory', process.env.MONGODB_URI);
  const port = process.env.PORT || 3001;
  createApp(store).listen(port, '0.0.0.0', () => {
    console.log(`VMS: http://localhost:${port} | storage: ${store.mode} | demo only`);
  });
} catch (error) {
  console.error('Startup failed. Check STORAGE_MODE and MONGODB_URI. No database credentials were logged.');
  process.exitCode = 1;
}
