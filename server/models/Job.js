import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema({
  laborCents: Number,
  partsCents: Number,
  travelCents: Number,
  totalCents: Number
}, { _id: false });

const jobSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  owner: { type: String, required: true, index: true },
  serviceId: { type: String, required: true },
  service: { type: String, required: true },
  location: { type: String, required: true, maxlength: 200 },
  vehicle: { type: String, required: true, maxlength: 100 },
  issue: { type: String, required: true, maxlength: 1000 },
  mode: { type: String, enum: ['roadside', 'home'], required: true },
  status: { type: String, enum: ['requested', 'quoted', 'enroute', 'arrived', 'working', 'done', 'completed', 'canceled'], required: true },
  distance: Number,
  version: { type: Number, default: 0 },
  quote: quoteSchema,
  rating: { type: Number, min: 1, max: 5 },
  payment: String,
  createdAt: String,
  completedAt: String
}, { versionKey: false });

jobSchema.index({ owner: 1, createdAt: -1 });
export const Job = mongoose.model('Job', jobSchema);
