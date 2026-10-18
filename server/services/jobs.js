// Business rules are separate from Express so they can be tested directly.
export const services = [
  { id: 'battery', name: 'Battery service', detail: 'Jump-start or replacement', icon: 'ϟ', labor: 65 },
  { id: 'tire', name: 'Tire change', detail: 'Spare tire installation', icon: '◉', labor: 75 },
  { id: 'oil', name: 'Oil change', detail: 'At-home maintenance', icon: '≋', labor: 95 },
  { id: 'diagnostic', name: 'Not sure yet', detail: 'Let’s figure it out', icon: '⌕', labor: 55 }
];

export function fail(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  throw error;
}

function text(value, label, maxLength) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maxLength) {
    fail(`${label} is required and must be under ${maxLength + 1} characters.`);
  }
  return value.trim();
}

export function createJob(input) {
  const service = services.find(item => item.id === input.serviceId);
  if (!service) fail('Choose a supported service.');
  if (!['roadside', 'home'].includes(input.mode)) fail('Choose roadside or home service.');
  return {
    serviceId: service.id,
    service: service.name,
    location: text(input.location, 'Location', 200),
    vehicle: text(input.vehicle, 'Vehicle', 100),
    issue: text(input.issue, 'Issue', 1000),
    mode: input.mode,
    status: 'requested',
    distance: 1.2,
    version: 0,
    createdAt: new Date().toISOString()
  };
}

function cents(amount) {
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 0 || amount > 10000) {
    fail('Quote amounts must be numbers from $0 to $10,000.');
  }
  return Math.round(amount * 100);
}

// Role selection is an educational demo control, NOT authentication.
// In production the role and user ID must come from a verified session.
export function updateJob(job, action, input, role) {
  const next = structuredClone(job);
  const rules = {
    quote: ['mechanic', 'requested', 'quoted'],
    accept: ['driver', 'quoted', 'enroute'],
    arrive: ['mechanic', 'enroute', 'arrived'],
    start: ['mechanic', 'arrived', 'working'],
    finish: ['mechanic', 'working', 'done'],
    complete: ['driver', 'done', 'completed']
  };
  if (action === 'cancel') {
    if (role !== 'driver') fail('Only the driver can cancel.', 403);
    if (!['requested', 'quoted'].includes(job.status)) fail('This request can no longer be canceled.', 409);
    next.status = 'canceled';
  } else {
    const rule = rules[action];
    if (!rule) fail('Unknown action.');
    if (role !== rule[0]) fail('This action belongs to the other role.', 403);
    if (job.status !== rule[1]) fail('The request has changed. Refresh and try again.', 409);
    if (action === 'quote') {
      const laborCents = cents(input.labor);
      const partsCents = cents(input.parts);
      const travelCents = Math.round(job.distance * 500);
      next.quote = { laborCents, partsCents, travelCents, totalCents: laborCents + partsCents + travelCents };
    }
    if (action === 'complete') {
      if (input.confirmed !== true) fail('Confirm the vehicle is running before completing payment.');
      if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) fail('Choose a rating from 1 to 5.');
      next.rating = input.rating;
      next.completedAt = new Date().toISOString();
      next.payment = 'simulated';
    }
    next.status = rule[2];
  }
  next.version = job.version + 1;
  return next;
}
