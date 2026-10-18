import mongoose from 'mongoose';
import { Job } from '../models/Job.js';

export function memoryStore() {
  const records = new Map();
  return {
    mode: 'memory',
    async list(owner) {
      return structuredClone([...records.values()].filter(job => job.owner === owner).reverse());
    },
    async create(job) { records.set(job.id, structuredClone(job)); return structuredClone(job); },
    async get(id, owner) {
      const job = records.get(id);
      return job?.owner === owner ? structuredClone(job) : null;
    },
    async replace(job, expectedVersion) {
      if (records.get(job.id)?.version !== expectedVersion) return null;
      records.set(job.id, structuredClone(job));
      return structuredClone(job);
    }
  };
}

export async function connectStore(mode, uri) {
  if (mode === 'memory') return memoryStore();
  if (mode !== 'mongodb' || !uri) throw new Error('Set STORAGE_MODE to memory, or mongodb with MONGODB_URI.');
  // Connection failures stop startup; we never silently lose persistent data.
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  return {
    mode: 'mongodb',
    list: owner => Job.find({ owner }).sort({ createdAt: -1 }).lean(),
    create: async job => (await Job.create(job)).toObject(),
    get: (id, owner) => Job.findOne({ id, owner }).lean(),
    replace: (job, expectedVersion) => Job.findOneAndUpdate(
      { id: job.id, owner: job.owner, version: expectedVersion },
      { $set: job },
      { new: true, runValidators: true }
    ).lean()
  };
}
